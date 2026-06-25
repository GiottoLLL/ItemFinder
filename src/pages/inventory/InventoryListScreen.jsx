import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import FilterChip from '../../components/common/FilterChip'
import InventoryCard from '../../components/common/InventoryCard'
import SearchBar from '../../components/common/SearchBar'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { fetchInventoryCards, fetchStorageSpaces } from '../../services'
import { colors, spacing } from '../../styles/theme'

export default function InventoryListScreen() {
  const navigation = useNavigation()
  const [inventoryList, setInventoryList] = useState([])
  const [keyword, setKeyword] = useState('')
  const [spaceList, setSpaceList] = useState([])
  const [activeSpaceId, setActiveSpaceId] = useState(null)

  useEffect(() => {
    fetchStorageSpaces().then(list => {
      setSpaceList(list)
      return list
    })
  }, [])

  useEffect(() => {
    fetchInventoryCards({ keyword, storageSpaceId: activeSpaceId }).then(setInventoryList)
  }, [keyword, activeSpaceId])

  return (
    <PageContainer backgroundColor={colors.listPageBackground}>
      <TopNavBar />
      <View style={styles.main}>
        <SearchBar
          onChangeText={setKeyword}
          placeholder='输入关键词搜索'
          value={keyword}
          variant='filled'
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <View style={styles.filterWrap}>
            <FilterChip active={!activeSpaceId} key='all' label='全部' onPress={() => setActiveSpaceId(null)} />
            {spaceList.map(space => (
              <FilterChip
                active={String(activeSpaceId) === String(space.id)}
                key={space.id}
                label={space.name}
                onPress={() => setActiveSpaceId(space.id)}
              />
            ))}
          </View>
        </ScrollView>
        <View style={styles.listWrap}>
          {inventoryList.map(item => (
            <Pressable key={item.id} onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}>
              <InventoryCard
                itemName={item.name}
                percent={item.percent}
                storageSpaceName={item.storageSpaceName}
              />
            </Pressable>
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
