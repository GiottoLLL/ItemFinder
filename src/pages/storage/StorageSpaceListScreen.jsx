import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import AddStorageModal from '../../components/common/AddStorageModal'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { createStorageSpace, fetchStorageSpaces } from '../../services'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function StorageSpaceListScreen() {
  const navigation = useNavigation()
  const [addSpaceVisible, setAddSpaceVisible] = useState(false)
  const [spaceList, setSpaceList] = useState([])

  const refreshSpaceList = () => fetchStorageSpaces().then(setSpaceList)

  useEffect(() => {
    refreshSpaceList()
  }, [])

  return (
    <View style={styles.root}>
      <PageContainer backgroundColor={colors.pageBackground}>
        <TopNavBar leftIconName='arrow-left' onPressLeft={() => navigation.goBack()} rightIconName='x' onPressRight={() => navigation.goBack()} />
        <View style={styles.main}>
          <Text style={styles.title}>储物空间</Text>
          <View style={styles.list}>
            {spaceList.map(space => (
              <View key={space.id} style={styles.card}>
                <Text style={styles.cardText}>{space.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </PageContainer>

      <View style={styles.bottomBar}>
        <Pressable onPress={() => setAddSpaceVisible(true)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>添加存储空间</Text>
        </Pressable>
      </View>

      <AddStorageModal
        onConfirm={name =>
          createStorageSpace(name)
            .then(() => refreshSpaceList())
            .then(() => setAddSpaceVisible(false))
        }
        onRequestClose={() => setAddSpaceVisible(false)}
        visible={addSpaceVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  main: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800'
  },
  list: {
    gap: spacing.md
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    ...shadows.soft
  },
  cardText: {
    color: colors.woodPrimary,
    fontSize: 16,
    fontWeight: '700'
  },
  bottomBar: {
    backgroundColor: colors.whiteOverlay,
    borderColor: colors.borderLight,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
    ...shadows.floating
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    paddingVertical: 14
  },
  primaryButtonText: {
    color: colors.woodPrimary,
    fontSize: 16,
    fontWeight: '800'
  }
})
