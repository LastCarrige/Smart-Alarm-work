package com.example.myapplication.service

import android.app.*
import android.content.*
import android.hardware.*
import android.os.*
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import kotlinx.coroutines.*
import java.text.SimpleDateFormat
import java.util.*

class SensorWorkerService : Service(), SensorEventListener {
    private lateinit var sensorManager: SensorManager
    private val TAG = "WayWake_Watch"

    private var heartRateSensor: Sensor? = null
   // private var stepCounterSensor: Sensor? = null
    private var accelSensor: Sensor? = null

    // Об'єкти для блокування (щоб уникнути вильотів)
    private val hrLock = Any()
    private val accelLock = Any()

    // Списки даних
    private val hrValues = mutableListOf<Float>()
    private val hrTimestamps = mutableListOf<Long>()

    private val accelXList = mutableListOf<Float>()
    private val accelYList = mutableListOf<Float>()
    private val accelZList = mutableListOf<Float>()
    private val accelTimestamps = mutableListOf<Long>()

    private var lastHeartRate: Float = 0f
   // private var currentSteps: Float = 0f
    private var startTime: Long = 0

    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        heartRateSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)
       // stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
        accelSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        registerSensors()
        startDataStreaming()
    }

    private fun registerSensors() {
        sensorManager.registerListener(this, heartRateSensor, SensorManager.SENSOR_DELAY_NORMAL)
       // sensorManager.registerListener(this, stepCounterSensor, SensorManager.SENSOR_DELAY_NORMAL)
        // GAME - дуже швидкий потік, NORMAL - повільніший. Для ML краще GAME або FASTEST
        sensorManager.registerListener(this, accelSensor, SensorManager.SENSOR_DELAY_GAME)
        startTime = System.currentTimeMillis()
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_HEART_RATE -> {
                synchronized(hrLock) {
                    val hr = event.values[0]
                    val ts = System.currentTimeMillis()
                    lastHeartRate = hr
                    hrValues.add(hr)
                    hrTimestamps.add(ts)
                }
            }
           /* Sensor.TYPE_STEP_COUNTER -> {
                currentSteps = event.values[0]
            }*/
            Sensor.TYPE_ACCELEROMETER -> {
                synchronized(accelLock) {
                    val ts = System.currentTimeMillis()
                    accelXList.add(event.values[0])
                    accelYList.add(event.values[1])
                    accelZList.add(event.values[2])
                    accelTimestamps.add(ts)
                }
            }
        }
    }

    private fun startDataStreaming() {
        serviceScope.launch {
            while (isActive) {
                delay(6000) // Пакет кожні 6 секунд
                sendSensorPacket()
            }
        }
    }

    private fun sendSensorPacket() {
        val endTime = System.currentTimeMillis()

        // Робимо "знімки" списків всередині блоку синхронізації
        val hrSnapshot: List<Float>
        val hrTsSnapshot: List<Long>
        val axSnapshot: List<Float>
        val aySnapshot: List<Float>
        val azSnapshot: List<Float>
        val atSnapshot: List<Long>

        synchronized(hrLock) {
            hrSnapshot = hrValues.toList()
            hrTsSnapshot = hrTimestamps.toList()
        }

        synchronized(accelLock) {
            axSnapshot = accelXList.toList()
            aySnapshot = accelYList.toList()
            azSnapshot = accelZList.toList()
            atSnapshot = accelTimestamps.toList()
        }

        // Якщо даних немає, нічого не шлемо
        if (hrSnapshot.isEmpty() && axSnapshot.isEmpty()) return

        // --- БЛОК ЛОГУВАННЯ ДЛЯ ПЕРЕВІРКИ ---
        Log.d(TAG, "==========================================")
        Log.d(TAG, "📦 ФОРМУВАННЯ ПАКЕТУ (Інтервал: ${endTime - startTime} ms)")

        // Перевірка Пульсу
        if (hrSnapshot.isNotEmpty()) {
            Log.d(TAG, "❤️ ПУЛЬС (точок: ${hrSnapshot.size}):")
            // Виведемо перші 3 точки для прикладу
            for (i in 0 until minOf(6, hrSnapshot.size)) {
                Log.d(TAG, "   [${hrTsSnapshot[i]}] -> ${hrSnapshot[i]} bpm")
            }
        }

        // Перевірка Акселерометра
        if (axSnapshot.isNotEmpty()) {
            Log.d(TAG, "🚀 АКСЕЛЕРОМЕТР (точок: ${axSnapshot.size}):")
            // Виведемо перші 3 точки у форматі: час x y z (як у датасеті подруги)
            for (i in 0 until minOf(3, axSnapshot.size)) {
                Log.d(TAG, "   ${atSnapshot[i]} ${axSnapshot[i]} ${aySnapshot[i]} ${azSnapshot[i]}")
            }
        }
        Log.d(TAG, "==========================================")
        // --- КІНЕЦЬ БЛОКУ ЛОГУВАННЯ ---

        val dataMapRequest = PutDataMapRequest.create("/sensor_data").apply {
            dataMap.putLong("start_time", startTime)
            dataMap.putLong("end_time", endTime)

            // ПУЛЬС: Кожне значення + час
            dataMap.putFloatArray("heart_rates", hrSnapshot.toFloatArray())
            dataMap.putLongArray("hr_timestamps", hrTsSnapshot.toLongArray())

            // АКСЕЛЕРОМЕТР: Кожне значення + час
            dataMap.putFloatArray("accel_x_array", axSnapshot.toFloatArray())
            dataMap.putFloatArray("accel_y_array", aySnapshot.toFloatArray())
            dataMap.putFloatArray("accel_z_array", azSnapshot.toFloatArray())
            dataMap.putLongArray("accel_timestamps", atSnapshot.toLongArray())

           // dataMap.putFloat("steps", currentSteps)
            dataMap.putLong("timestamp", endTime)
        }

        val putDataReq = dataMapRequest.asPutDataRequest().setUrgent()
        Wearable.getDataClient(this).putDataItem(putDataReq).addOnSuccessListener {
            Log.i(TAG, "📊 Пакет надіслано! HR точок: ${hrSnapshot.size}, Accel: ${axSnapshot.size}")

            // Видаляємо тільки те, що успішно відправили
            synchronized(hrLock) {
                hrValues.removeAll(hrSnapshot)
                hrTimestamps.removeAll(hrTsSnapshot)
            }
            synchronized(accelLock) {
                accelXList.removeAll(axSnapshot)
                accelYList.removeAll(aySnapshot)
                accelZList.removeAll(azSnapshot)
                accelTimestamps.removeAll(atSnapshot)
            }
            startTime = endTime
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createNotification()
        startForeground(1, notification)
        return START_STICKY
    }

    private fun createNotification(): Notification {
        val channelId = "sensor_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channel = NotificationChannel(channelId, "Sensors", NotificationManager.IMPORTANCE_LOW)
            manager.createNotificationChannel(channel)
        }
        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("WayWake Active")
            .setContentText("Collecting sensor data...")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .build()
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
    override fun onBind(intent: Intent?) = null

    override fun onDestroy() {
        sensorManager.unregisterListener(this)
        serviceScope.cancel()
        super.onDestroy()
    }
}