package com.example.myapplication.presentation

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.wear.compose.foundation.lazy.TransformingLazyColumn
import androidx.wear.compose.foundation.lazy.rememberTransformingLazyColumnState
import androidx.wear.compose.material3.*
import androidx.wear.compose.material3.lazy.rememberTransformationSpec
import androidx.wear.compose.material3.lazy.transformedHeight
import androidx.wear.compose.ui.tooling.preview.WearPreviewDevices
import androidx.wear.compose.ui.tooling.preview.WearPreviewFontScales
import com.example.myapplication.presentation.theme.WayWakeTheme
import com.example.myapplication.service.SensorWorkerService

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WearApp()
        }
    }
}

@Composable
fun WearApp() {
    val context = LocalContext.current

    // 1. Список базових дозволів (Акселерометр працює через них)
    val permissionsToRequest = remember {
        mutableListOf(
            Manifest.permission.ACTIVITY_RECOGNITION
        ).apply {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }.toTypedArray()
    }

    // 2. Лаунчер для Health Connect (Пульс)
    val healthPermissionHandler = rememberLauncherForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { grantedPermissions ->
        if (grantedPermissions.contains(HealthPermission.getReadPermission(HeartRateRecord::class))) {
            Toast.makeText(context, "Доступ до пульсу отримано", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(context, "Доступ до пульсу відхилено!", Toast.LENGTH_SHORT).show()
        }
    }

    // 3. Лаунчер для базових дозволів
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.values.all { it }
        if (allGranted) {
            startMonitoringService(context)
        } else {
            Toast.makeText(context, "Базові дозволи відхилено!", Toast.LENGTH_SHORT).show()
        }
    }

    WayWakeTheme {
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val transformationSpec = rememberTransformationSpec()

            ScreenScaffold(scrollState = listState) { contentPadding ->
                TransformingLazyColumn(
                    contentPadding = contentPadding,
                    state = listState
                ) {
                    item {
                        ListHeader(
                            modifier = Modifier
                                .fillMaxWidth()
                                .transformedHeight(this, transformationSpec),
                            transformation = SurfaceTransformation(transformationSpec)
                        ) {
                            Text("WayWake: Sleep Tracker")
                        }
                    }

                    // Кнопка для Health Connect
                    item {
                        Button(
                            onClick = {
                                healthPermissionHandler.launch(
                                    setOf(HealthPermission.getReadPermission(HeartRateRecord::class))
                                )
                            },
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.secondaryContainer
                            )
                        ) {
                            Text("Дозвіл на пульс (SDK)")
                        }
                    }

                    item {
                        Button(
                            onClick = {
                                if (hasAllPermissions(context, permissionsToRequest)) {
                                    startMonitoringService(context)
                                } else {
                                    launcher.launch(permissionsToRequest)
                                }
                            },
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                        ) {
                            Text("Почати запис")
                        }
                    }

                    item {
                        Button(
                            onClick = {
                                val intent = Intent(context, SensorWorkerService::class.java)
                                context.stopService(intent)
                                Toast.makeText(context, "Збір зупинено", Toast.LENGTH_SHORT).show()
                            },
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.errorContainer,
                                contentColor = MaterialTheme.colorScheme.onErrorContainer
                            )
                        ) {
                            Text("Зупинити")
                        }
                    }

                    item {
                        Text(
                            text = "Статус: Готовий до роботи",
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            }
        }
    }
}

private fun hasAllPermissions(context: Context, permissions: Array<String>): Boolean {
    return permissions.all {
        ContextCompat.checkSelfPermission(context, it) == PackageManager.PERMISSION_GRANTED
    }
}

private fun startMonitoringService(context: Context) {
    val intent = Intent(context, SensorWorkerService::class.java)
    try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
        Toast.makeText(context, "Моніторинг запущено", Toast.LENGTH_SHORT).show()
    } catch (e: Exception) {
        android.util.Log.e("WAYWAKE_ERROR", "Помилка запуску: ${e.message}")
        Toast.makeText(context, "Помилка: перевірте дозволи", Toast.LENGTH_LONG).show()
    }
}

@WearPreviewDevices
@WearPreviewFontScales
@Composable
fun DefaultPreview() {
    WearApp()
}