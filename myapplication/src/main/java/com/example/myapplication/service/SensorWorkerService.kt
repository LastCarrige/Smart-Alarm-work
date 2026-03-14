package com.example.myapplication.service

import android.util.Log
import android.app.*
import android.content.*
import android.hardware.*
import android.os.*
import androidx.core.app.NotificationCompat
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.example.myapplication.utils.Constants
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import kotlinx.coroutines.*
import java.time.Instant

class SensorWorkerService : Service(), SensorEventListener {
    private lateinit var sensorManager: SensorManager
    private val TAG = "WayWake_Watch"

    // Корутини для асинхронних запитів до Health Connect
    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    private val accelX = mutableListOf<Float>()
    private val accelY = mutableListOf<Float>()
    private val accelZ = mutableListOf<Float>()

    private var lastHeartRate: Float = 0f // Буде зберігати останнє зчитане значення
    private var lastSteps: Float = 0f
    private var lastSendTime = 0L

    private val healthConnectClient by lazy { HealthConnectClient.getOrCreate(this) }

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager

        // Реєструємо ТІЛЬКИ акселерометр та кроки
        val accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        val steps = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

        sensorManager.registerListener(this, accel, SensorManager.SENSOR_DELAY_UI)
        sensorManager.registerListener(this, steps, SensorManager.SENSOR_DELAY_NORMAL)

        lastSendTime = System.currentTimeMillis()
        startForeground(1, createNotification())
    }

    override fun onSensorChanged(event: SensorEvent?) {
        when (event?.sensor?.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                accelX.add(event.values[0])
                accelY.add(event.values[1])
                accelZ.add(event.values[2])
            }
            Sensor.TYPE_STEP_COUNTER -> {
                lastSteps = event.values[0]
            }
        }

        val currentTime = System.currentTimeMillis()
        // Кожні 6 секунд запускаємо процес збору пульсу та відправки
        if (currentTime - lastSendTime >= 6000) {
            val start = lastSendTime
            val end = currentTime
            lastSendTime = currentTime

            // Запускаємо асинхронну задачу
            serviceScope.launch {
                updateHeartRateFromHealthConnect()
                sendPacketToPhone(start, end)
            }
        }
    }

    /**
     * Функція підтягує останній доступний запис пульсу з Health Connect
     */
    private suspend fun updateHeartRateFromHealthConnect() {
        try {
            val response = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    recordType = HeartRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.before(Instant.now()),
                    ascendingOrder = false, // Беремо найновіші спочатку
                    pageSize = 1
                )
            )

            val latestRecord = response.records.firstOrNull()
            if (latestRecord != null && latestRecord.samples.isNotEmpty()) {
                // Беремо останнє вимірювання (bpm) з останнього запису
                lastHeartRate = latestRecord.samples.last().beatsPerMinute.toFloat()
                Log.d(TAG, "Health Connect: Оновлено пульс = $lastHeartRate")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Помилка читання Health Connect: ${e.message}")
            // Якщо помилка, залишаємо попереднє значення lastHeartRate
        }
    }

    private fun sendPacketToPhone(start: Long, end: Long) {
        // 1. СПОЧАТКУ ЛОГУЄМО (поки списки ще повні)
        Log.d("WayWake_Data", """
        Сирі дані (перед очищенням):
        X: ${accelX.joinToString(", ")}
        Y: ${accelY.joinToString(", ")}
        Z: ${accelZ.joinToString(", ")}
    """.trimIndent())

        // 2. Копіюємо дані в масиви (щоб відправляти стабільну копію)
        val xData = accelX.toFloatArray()
        val yData = accelY.toFloatArray()
        val zData = accelZ.toFloatArray()

        // 3. Очищаємо списки негайно (щоб не дублювати дані в наступному пакеті)
        accelX.clear()
        accelY.clear()
        accelZ.clear()

        // 4. Додатковий лог про готовність пакета
        Log.d("WayWake_Data", "Пакет змасштабовано: Пульс: $lastHeartRate, Точок акселя: ${xData.size}")

        // 5. Формуємо запит для Data Layer
        val request = PutDataMapRequest.create(Constants.DATA_PATH).apply {
            dataMap.putLong(Constants.KEY_START_TIME, start)
            dataMap.putLong(Constants.KEY_END_TIME, end)
            dataMap.putFloat(Constants.KEY_HEART_RATE, lastHeartRate)
            dataMap.putFloat(Constants.KEY_STEPS, lastSteps)
            dataMap.putFloatArray(Constants.KEY_ACCEL_X, xData)
            dataMap.putFloatArray(Constants.KEY_ACCEL_Y, yData)
            dataMap.putFloatArray(Constants.KEY_ACCEL_Z, zData)
        }

        // 6. Відправляємо на телефон
        Wearable.getDataClient(this)
            .putDataItem(request.asPutDataRequest().setUrgent())
            .addOnSuccessListener {
                Log.i(TAG, "✅ Пакет відправлено успішно (HR: $lastHeartRate)")
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "❌ Помилка при відправці пакета: ${e.message}")
            }
    }

    override fun onDestroy() {
        sensorManager.unregisterListener(this)
        serviceScope.cancel() // Зупиняємо всі корутини
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
    override fun onAccuracyChanged(s: Sensor?, a: Int) {}

    private fun createNotification(): Notification {
        val channelId = "sensor_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Sleep Tracking", NotificationManager.IMPORTANCE_LOW)
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("WayWake: Збір даних")
            .setContentText("Акселерометр + Health Connect")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .build()
    }
}