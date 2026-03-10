package com.example.myapplication.service

import android.app.*
import android.content.*
import android.hardware.*
import android.os.*
import androidx.core.app.NotificationCompat
import com.example.myapplication.utils.Constants
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable

class SensorWorkerService : Service(), SensorEventListener {
    private lateinit var sensorManager: SensorManager

    // Списки для накопичення даних акселерометра за 6 секунд
    private val accelX = mutableListOf<Float>()
    private val accelY = mutableListOf<Float>()
    private val accelZ = mutableListOf<Float>()

    private var lastHeartRate: Float = 0f
    private var lastSteps: Float = 0f
    private var lastSendTime = 0L

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager

        // Реєструємо сенсори
        val accel = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        val hr = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)
        val steps = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

        sensorManager.registerListener(this, accel, SensorManager.SENSOR_DELAY_UI)
        sensorManager.registerListener(this, hr, SensorManager.SENSOR_DELAY_NORMAL)
        sensorManager.registerListener(this, steps, SensorManager.SENSOR_DELAY_NORMAL)

        lastSendTime = System.currentTimeMillis()

        // Запуск фонового сповіщення (обов'язково для Android 13+)
        startForeground(1, createNotification())
    }

    override fun onSensorChanged(event: SensorEvent?) {
        when (event?.sensor?.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                accelX.add(event.values[0])
                accelY.add(event.values[1])
                accelZ.add(event.values[2])
            }
            Sensor.TYPE_HEART_RATE -> lastHeartRate = event.values[0]
            Sensor.TYPE_STEP_COUNTER -> lastSteps = event.values[0]
        }

        // Перевірка: чи пройшло 6 секунд?
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastSendTime >= 6000) {
            sendPacketToPhone(lastSendTime, currentTime)
            lastSendTime = currentTime
        }
    }

    private fun sendPacketToPhone(start: Long, end: Long) {
        // Використовуємо Wearable Data Layer API
        val request = PutDataMapRequest.create(Constants.DATA_PATH).apply {
            dataMap.putLong(Constants.KEY_START_TIME, start)
            dataMap.putLong(Constants.KEY_END_TIME, end)
            dataMap.putFloat(Constants.KEY_HEART_RATE, lastHeartRate)
            dataMap.putFloat(Constants.KEY_STEPS, lastSteps)
            dataMap.putFloatArray(Constants.KEY_ACCEL_X, accelX.toFloatArray())
            dataMap.putFloatArray(Constants.KEY_ACCEL_Y, accelY.toFloatArray())
            dataMap.putFloatArray(Constants.KEY_ACCEL_Z, accelZ.toFloatArray())
        }

        // Відправляємо пакет терміново (setUrgent)
        Wearable.getDataClient(this).putDataItem(request.asPutDataRequest().setUrgent())

        // Очищуємо списки для нових 6 секунд
        accelX.clear(); accelY.clear(); accelZ.clear()
    }

    private fun createNotification(): Notification {
        val channelId = "sensor_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Sleep Tracking", NotificationManager.IMPORTANCE_LOW)
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("WayWake: Збір даних")
            .setContentText("Аналізуємо ваш стан сну...")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null
    override fun onAccuracyChanged(s: Sensor?, a: Int) {}
    override fun onDestroy() {
        sensorManager.unregisterListener(this) // Зупиняємо сенсори при вимкненні
        super.onDestroy()
    }
}