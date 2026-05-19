import { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

import FilterChip from '../../components/common/FilterChip'
import SearchBar from '../../components/common/SearchBar'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { fetchSearchSuggestions } from '../../services'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function ItemSearchScreen() {
  const [searchData, setSearchData] = useState({
    aiCards: [],
    historyKeywords: []
  })

  useEffect(() => {
    fetchSearchSuggestions().then(setSearchData)
  }, [])

  return (
    <PageContainer backgroundColor={colors.pageBackground}>
      <TopNavBar />
      <View style={styles.main}>
        <SearchBar placeholder='问AI，找物品' />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather color={colors.textMuted} name='sparkles' size={18} />
            <Text style={styles.sectionTitle}>AI 智能回复</Text>
          </View>

          {searchData.aiCards.map(card => (
            <View key={card.id} style={styles.aiCard}>
              <View style={styles.aiBadge} />
              <View style={styles.aiCardContent}>
                <Text style={styles.aiCardTitle}>{card.title}</Text>
                <Text style={styles.aiCardDescription}>{card.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>搜索记录</Text>
            <Feather color={colors.textMuted} name='clock' size={16} />
          </View>
          <View style={styles.historyWrap}>
            {searchData.historyKeywords.map(keyword => (
              <FilterChip key={keyword} label={keyword} />
            ))}
          </View>
        </View>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    gap: spacing.xxl,
    paddingBottom: 64,
    paddingTop: 32
  },
  section: {
    gap: spacing.md
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm
  },
  sectionTitle: {
    color: colors.woodPrimary,
    fontSize: 24,
    fontWeight: '700'
  },
  aiCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.md,
    borderWidth: 2,
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.soft
  },
  aiBadge: {
    backgroundColor: 'rgba(212, 230, 241, 0.5)',
    borderRadius: radius.pill,
    height: 36,
    marginBottom: spacing.md,
    width: 36
  },
  aiCardContent: {
    gap: spacing.sm
  },
  aiCardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600'
  },
  aiCardDescription: {
    color: colors.woodPrimary,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30
  },
  historyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  historyTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700'
  },
  historyWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  }
})
