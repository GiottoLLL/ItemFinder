import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors, spacing } from '../../styles/theme'

export default function PageContainer({
  children,
  backgroundColor = colors.pageBackground,
  scrollable = true,
  contentContainerStyle,
  useSafeArea = true
}) {
  const Container = useSafeArea ? SafeAreaView : View

  return (
    <Container style={[styles.safeArea, { backgroundColor }]}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.scrollContent, contentContainerStyle]}>{children}</View>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl
  }
})
