import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'

import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { fetchItemDetail } from '../../services'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function ItemDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const itemId = route?.params?.itemId
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    fetchItemDetail(itemId).then(setDetail)
  }, [itemId])

  const nameText = detail?.name || '物品'
  const storageText = detail?.storageSpaceName || '--'
  const percent = Math.max(0, Math.min(100, Math.round((Number(detail?.quantity || 0) / 6) * 100)))

  return (
    <PageContainer backgroundColor={colors.pageBackground}>
      <TopNavBar leftIconName='arrow-left' onPressLeft={() => navigation.goBack()} rightIconName='x' onPressRight={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.title}>{nameText}</Text>
        <View style={styles.card}>
          <Text style={styles.label}>存放位置</Text>
          <Text style={styles.value}>{storageText}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>余量</Text>
          <Text style={styles.value}>{percent}%</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressValue, { width: `${percent}%` }]} />
          </View>
        </View>

        <Pressable onPress={() => navigation.goBack()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>返回列表</Text>
        </Pressable>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    gap: spacing.lg,
    paddingTop: spacing.lg
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800'
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    gap: spacing.sm,
    padding: spacing.lg,
    ...shadows.soft
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2
  },
  value: {
    color: colors.woodPrimary,
    fontSize: 16,
    fontWeight: '700'
  },
  progressTrack: {
    backgroundColor: colors.chipBackground,
    borderRadius: radius.pill,
    height: 12,
    overflow: 'hidden'
  },
  progressValue: {
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    height: '100%'
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    paddingVertical: 14
  },
  primaryButtonText: {
    color: colors.woodPrimary,
    fontSize: 16,
    fontWeight: '800'
  }
})
