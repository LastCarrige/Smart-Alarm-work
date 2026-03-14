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
import java.time.Instant

class SensorWorkerService : Service(), SensorEventListener {
    private lateinit var sensorManager: SensorManager
    private val TAG = "WayWake_Watch"

    // Сенсори
    private var heartRateSensor: Sensor? = null
    private var stepCounterSensor: Sensor? = null
    private var accelSensor: Sensor? = null

    // Дані для пакету
    private var lastHeartRate: Float = 0f
    private var currentSteps: Float = 0f
    private var accelX: Float = 0f
    private var accelY: Float = 0f
    private var accelZ: Float = 0f
    private var startTime: Long = 0

    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager

        // Ініціалізація сенсорів
        heartRateSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)
        stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
        accelSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        registerSensors()
        startDataStreaming()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Обов'язково для Foreground сервісу: створюємо сповіщення
        val notification = createNotification()

        // Запускаємо сервіс у фоновому режимі з типом dataSync
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(1, notification, android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
        } else {
            startForeground(1, notification)
        }

        return START_STICKY
    }

    private fun registerSensors() {
        sensorManager.registerListener(this, heartRateSensor, SensorManager.SENSOR_DELAY_NORMAL)
        sensorManager.registerListener(this, stepCounterSensor, SensorManager.SENSOR_DELAY_NORMAL)
        sensorManager.registerListener(this, accelSensor, SensorManager.SENSOR_DELAY_GAME)

        startTime = System.currentTimeMillis()
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_HEART_RATE -> {
                lastHeartRate = event.values[0]
                Log.d(TAG, "New HR: $lastHeartRate")
            }
            Sensor.TYPE_STEP_COUNTER -> {
                currentSteps = event.values[0]
            }
            Sensor.TYPE_ACCELEROMETER -> {
                accelX = event.values[0]
                accelY = event.values[1]
                accelZ = event.values[2]
            }
        }
    }

    private fun startDataStreaming() {
        serviceScope.launch {
            while (isActive) {
                delay(6000) // Пауза 6 секунд між пакетами
                sendSensorPacket()
            }
        }
    }

    private fun sendSensorPacket() {
        val endTime = System.currentTimeMillis()

        val dataMapRequest = PutDataMapRequest.create("/sensor_data").apply {
            dataMap.putLong("start_time", startTime)
            dataMap.putLong("end_time", endTime)
            dataMap.putFloat("heart_rate", lastHeartRate)
            dataMap.putFloat("accel_x", accelX)
            dataMap.putFloat("accel_y", accelY)
            dataMap.putFloat("accel_z", accelZ)
            dataMap.putFloat("steps", currentSteps)
            dataMap.putLong("timestamp", endTime)
        }

        val putDataReq = dataMapRequest.asPutDataRequest()
        putDataReq.setUrgent()

        val dataClient = Wearable.getDataClient(this)
        dataClient.putDataItem(putDataReq).addOnSuccessListener {
            Log.i(TAG, "📊 Пакет надіслано! HR: $lastHeartRate, Steps: $currentSteps, X: $accelX, Y: $accelY, Z: $accelZ")
            startTime = endTime
        }.addOnFailureListener { e ->
            Log.e(TAG, "❌ Помилка надсилання пакету: ${e.message}")
        }
    }

    private fun createNotification(): Notification {
        val channelId = "sensor_channel"
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Sensor Tracking", NotificationManager.IMPORTANCE_LOW)
            manager.createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("WayWake Активний")
            .setContentText("Збір даних сенсорів...")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true) // Робить сповіщення постійним
            .build()
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        sensorManager.unregisterListener(this)
        serviceScope.cancel()
        super.onDestroy()
    }
}