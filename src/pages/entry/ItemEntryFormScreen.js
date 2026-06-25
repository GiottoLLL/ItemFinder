import { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

import AddStorageModal from '../../components/common/AddStorageModal'
import StorageSpacePicker from '../../components/common/StorageSpacePicker'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { createItem, createStorageSpace, fetchStorageSpaces } from '../../services'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function ItemEntryFormScreen() {
  const navigation = useNavigation()
  const [quantityText, setQuantityText] = useState('1')
  const [itemName, setItemName] = useState('')
  const [spaceList, setSpaceList] = useState([])
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [addSpaceVisible, setAddSpaceVisible] = useState(false)

  const bottomPadding = useMemo(() => 96, [])

  const refreshStorageSpaces = () => {
    return fetchStorageSpaces().then(list => {
      setSpaceList(list)
      if (!selectedSpace && list.length > 0) {
        setSelectedSpace(list[0])
      }
      return list
    })
  }

  useEffect(() => {
    refreshStorageSpaces()
  }, [])

  return (
    <View style={styles.root}>
      <PageContainer
        backgroundColor={colors.pageBackground}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        scrollable
      >
        <TopNavBar
          leftIconName='arrow-left'
          onPressLeft={() => navigation.goBack()}
          rightIconName='x'
          onPressRight={() => navigation.goBack()}
        />

        <View style={styles.main}>
          <Text style={styles.title}>录入物品</Text>

          <View style={styles.field}>
            <Text style={styles.label}>物品名称</Text>
            <View style={styles.inputShell}>
              <TextInput
                onChangeText={setItemName}
                placeholder='例如：充电宝'
                placeholderTextColor={colors.inputPlaceholder}
                value={itemName}
              />
            </View>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>数量</Text>
              <View style={styles.inputShell}>
                <TextInput
                  keyboardType='numeric'
                  onChangeText={setQuantityText}
                  placeholder='1'
                  placeholderTextColor={colors.inputPlaceholder}
                  value={quantityText}
                />
              </View>
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>单位</Text>
              <View style={styles.inputShell}>
                <Text style={styles.staticValue}>个</Text>
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>存放位置</Text>
            <Pressable onPress={() => setPickerVisible(true)} style={styles.selectShell}>
              <Text style={styles.selectValue}>{selectedSpace?.name || '请选择'}</Text>
              <Feather color={colors.woodPrimary} name='chevron-down' size={18} />
            </Pressable>
            <Pressable onPress={() => setAddSpaceVisible(true)} style={styles.addSpaceButton}>
              <Feather color={colors.woodPrimary} name='plus' size={16} />
              <Text style={styles.addSpaceText}>新增存储空间</Text>
            </Pressable>
          </View>
        </View>
      </PageContainer>

      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => {
            createItem({
              name: itemName,
              quantity: quantityText,
              unit: '个',
              storageSpaceId: selectedSpace?.id
            })
              .then(() => navigation.navigate('MainTabs', { screen: 'InventoryList' }))
              .catch(() => null)
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>保存</Text>
        </Pressable>
      </View>

      <StorageSpacePicker
        onRequestClose={() => setPickerVisible(false)}
        onSelect={space => {
          setSelectedSpace(space)
          setPickerVisible(false)
        }}
        spaceList={spaceList}
        visible={pickerVisible}
      />

      <AddStorageModal
        onConfirm={name =>
          createStorageSpace(name)
            .then(() => refreshStorageSpaces())
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
    paddingTop: spacing.lg
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800'
  },
  field: {
    gap: spacing.sm
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  fieldHalf: {
    flex: 1,
    gap: spacing.sm
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2
  },
  inputShell: {
    backgroundColor: colors.mutedCardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  staticValue: {
    color: colors.woodPrimary,
    fontSize: 14,
    fontWeight: '600'
  },
  selectShell: {
    alignItems: 'center',
    backgroundColor: colors.mutedCardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  selectValue: {
    color: colors.woodPrimary,
    fontSize: 14,
    fontWeight: '600'
  },
  addSpaceButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4
  },
  addSpaceText: {
    color: colors.woodPrimary,
    fontSize: 12,
    fontWeight: '600'
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
