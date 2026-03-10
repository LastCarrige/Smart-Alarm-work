package com.example.myapplication.model

/**
 * Клас, що описує пакет даних, який ми відправляємо на телефон кожні 6 секунд.
 */
data class SensorPacket(
    val startTime: Long,     // Час початку запису (timestamp)
    val endTime: Long,       // Час кінця запису (timestamp)
    val heartRate: Float,    // Останній заміряний пульс
    val steps: Float,        // Поточна кількість кроків
    val accelX: FloatArray,  // Масив значень акселерометра по X
    val accelY: FloatArray,  // Масив по Y
    val accelZ: FloatArray   // Масив по Z
)