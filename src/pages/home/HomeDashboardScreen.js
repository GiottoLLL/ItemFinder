import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import StatCard from '../../components/common/StatCard'
import InventoryWarningModal from '../../components/common/InventoryWarningModal'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { fetchHomeStatistics, fetchInventoryWarnings, muteWarnings } from '../../services'
import { colors, radius, spacing } from '../../styles/theme'

export default function HomeDashboardScreen() {
  const navigation = useNavigation()
  const [statistics, setStatistics] = useState({
    totalCount: 0,
    mostUsedItemName: '--',
    distributionList: []
  })
  const [warningVisible, setWarningVisible] = useState(false)
  const [warningDismissed, setWarningDismissed] = useState(false)
  const [warningList, setWarningList] = useState([])

  useEffect(() => {
    fetchHomeStatistics().then(setStatistics)
  }, [])

  useEffect(() => {
    fetchInventoryWarnings().then(list => {
      setWarningList(list)
      if (!warningDismissed && list.length > 0) {
        setWarningVisible(true)
      }
    })
  }, [warningDismissed])

  return (
    <View style={styles.root}>
      <PageContainer backgroundColor={colors.pageBackground}>
      <TopNavBar
        onPressRight={() => navigation.navigate('StorageSpaceList')}
        rightIconName='grid'
      />
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
      <InventoryWarningModal
        onMuteAll={() => {
          muteWarnings(warningList.map(item => item.id))
            .then(() => fetchInventoryWarnings())
            .then(list => setWarningList(list))
            .then(() => setWarningVisible(false))
            .then(() => setWarningDismissed(true))
        }}
        onRequestClose={() => {
          setWarningVisible(false)
          setWarningDismissed(true)
        }}
        visible={warningVisible}
        warningList={warningList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
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
