import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext'; // Переконайся, що шлях вірний

export default function RootLayout() {
  return (
    // Огортаємо весь додаток, щоб контекст був доступний усюди
    <ThemeProvider>
      <Stack>
        {/* Тут твої вкладки (tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}