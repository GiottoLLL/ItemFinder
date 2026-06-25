import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import FilterChip from '../../components/common/FilterChip'
import SearchBar from '../../components/common/SearchBar'
import SearchEmptyState from '../../components/common/SearchEmptyState'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { fetchInventoryList, fetchSearchSuggestions } from '../../services'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function ItemSearchScreen() {
  const [searchData, setSearchData] = useState({
    aiCards: [],
    historyKeywords: []
  })
  const [keyword, setKeyword] = useState('')
  const [resultList, setResultList] = useState([])

  useEffect(() => {
    fetchSearchSuggestions().then(setSearchData)
  }, [])

  useEffect(() => {
    if (!keyword) {
      setResultList([])
      return
    }
    fetchInventoryList({ keyword }).then(setResultList)
  }, [keyword])

  return (
    <PageContainer backgroundColor={colors.pageBackground}>
      <TopNavBar />
      <View style={styles.main}>
        <SearchBar
          onChangeText={setKeyword}
          placeholder='输入关键词查找'
          value={keyword}
        />

        {!!keyword && resultList.length === 0 && (
          <SearchEmptyState />
        )}

        {!!keyword && resultList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>搜索结果</Text>
            {resultList.map(item => (
              <View key={item.id} style={styles.aiCard}>
                <Text style={styles.aiCardTitle}>{item.name}</Text>
                <Text style={styles.aiCardDescription}>{item.storageSpaceName}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>搜索记录</Text>
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
  sectionTitle: {
    color: colors.woodPrimary,
    fontSize: 24,
    fontWeight: '700'
  },
  aiCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.soft
  },
  aiCardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600'
  },
  aiCardDescription: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.sm
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
