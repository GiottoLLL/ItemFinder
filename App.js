import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigator from './src/navigation/RootNavigator'
import { initializeAppDatabase } from './src/services'
import { colors } from './src/styles/theme'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initializeAppDatabase()
      .then(() => setReady(true))
      .catch(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.woodPrimary} size='large' />
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style='dark' />
      <RootNavigator />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.pageBackground,
    flex: 1,
    justifyContent: 'center'
  }
})
