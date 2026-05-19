import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import FilterChip from '../../components/common/FilterChip'
import InventoryCard from '../../components/common/InventoryCard'
import SearchBar from '../../components/common/SearchBar'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { fetchInventoryCards } from '../../services'
import { colors, spacing } from '../../styles/theme'

const filterList = ['全部', '客厅', '厨房', '书房', '卧室']

export default function InventoryListScreen() {
  const [inventoryList, setInventoryList] = useState([])

  useEffect(() => {
    fetchInventoryCards().then(setInventoryList)
  }, [])

  return (
    <PageContainer backgroundColor={colors.listPageBackground}>
      <TopNavBar />
      <View style={styles.main}>
        <SearchBar placeholder='问AI，找物品' variant='filled' />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <View style={styles.filterWrap}>
            {filterList.map((filterName, index) => (
              <FilterChip active={index === 0} key={filterName} label={filterName} />
            ))}
          </View>
        </ScrollView>
        <View style={styles.listWrap}>
          {inventoryList.map(item => (
            <InventoryCard
              itemName={item.name}
              key={item.id}
              percent={item.percent}
              storageSpaceName={item.storageSpaceName}
            />
          ))}
        </View>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    gap: spacing.lg,
    paddingBottom: 48,
    paddingTop: 24
  },
  filterScroll: {
    marginHorizontal: -spacing.lg
  },
  filterWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg
  },
  listWrap: {
    gap: spacing.md
  }
})
