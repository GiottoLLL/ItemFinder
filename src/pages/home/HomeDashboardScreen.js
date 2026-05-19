import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import StatCard from '../../components/common/StatCard'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { fetchHomeStatistics } from '../../services'
import { colors, radius, spacing } from '../../styles/theme'

export default function HomeDashboardScreen() {
  const [statistics, setStatistics] = useState({
    totalCount: 0,
    mostUsedItemName: '--',
    distributionList: []
  })

  useEffect(() => {
    fetchHomeStatistics().then(setStatistics)
  }, [])

  return (
    <PageContainer backgroundColor={colors.pageBackground}>
      <TopNavBar />
      <View style={styles.main}>
        <View style={styles.hero}>
          <Text style={styles.pageTitle}>我的物品</Text>
          <Text style={styles.pageSubtitle}>Statistics & Storage Insight</Text>
        </View>

        <View style={styles.section}>
          <StatCard eyebrow='Monthly Summary' title='物品总数' value={String(statistics.totalCount)} />
          <StatCard
            eyebrow='Frequency'
            title='常用物品'
            value={statistics.mostUsedItemName}
            variant='accent'
          />
        </View>

        <View style={styles.distributionCard}>
          <Text style={styles.distributionTitle}>存储分布</Text>
          {statistics.distributionList.map(item => (
            <View key={item.id} style={styles.distributionItem}>
              <View style={styles.distributionTextRow}>
                <Text style={styles.distributionName}>{item.name}</Text>
                <Text style={styles.distributionValue}>{item.percentage}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressValue, { width: `${item.percentage}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    gap: spacing.xxl,
    paddingBottom: 55,
    paddingTop: 48
  },
  hero: {
    gap: 8
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '700'
  },
  pageSubtitle: {
    color: colors.textSecondary,
    fontSize: 16
  },
  section: {
    gap: spacing.lg
  },
  distributionCard: {
    backgroundColor: '#E8F0F3',
    borderRadius: radius.xl,
    gap: spacing.lg,
    overflow: 'hidden',
    padding: spacing.xl
  },
  distributionTitle: {
    color: colors.woodPrimary,
    fontSize: 28,
    fontWeight: '700'
  },
  distributionItem: {
    gap: 8
  },
  distributionTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  distributionName: {
    color: colors.textSecondary,
    fontSize: 16
  },
  distributionValue: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600'
  },
  progressTrack: {
    backgroundColor: 'rgba(99, 94, 83, 0.12)',
    borderRadius: radius.pill,
    height: 12,
    overflow: 'hidden'
  },
  progressValue: {
    backgroundColor: colors.woodPrimary,
    borderRadius: radius.pill,
    height: '100%'
  }
})
