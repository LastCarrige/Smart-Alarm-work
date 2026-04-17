package com.example.myapplication.model

/**
 * Клас, що описує пакет даних, який ми відправляємо на телефон кожні 6 секунд.
 */
data class SensorPacket(
    val startTime: Long,
    val endTime: Long,
    val heartRates: FloatArray,
    val hrTimestamps: LongArray,
    val accelX: FloatArray,
    val accelY: FloatArray,
    val accelZ: FloatArray,
    val accelTimestamps: LongArray
)