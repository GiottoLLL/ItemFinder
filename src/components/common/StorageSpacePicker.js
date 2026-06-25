import { Pressable, StyleSheet, Text, View } from 'react-native'

import ModalMask from '../layout/ModalMask'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function StorageSpacePicker({
  visible,
  spaceList = [],
  onRequestClose,
  onSelect
}) {
  return (
    <ModalMask contentStyle={styles.contentWrap} onRequestClose={onRequestClose} visible={visible}>
      <View style={styles.sheet}>
        <Text style={styles.title}>选择存放位置</Text>
        <View style={styles.list}>
          {spaceList.map(space => (
            <Pressable
              key={space.id}
              onPress={() => onSelect(space)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{space.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ModalMask>
  )
}

const styles = StyleSheet.create({
  contentWrap: {
    justifyContent: 'flex-end',
    padding: 16
  },
  sheet: {
    backgroundColor: colors.pageBackground,
    borderRadius: 24,
    padding: spacing.lg,
    ...shadows.soft
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: spacing.md
  },
  list: {
    gap: spacing.sm
  },
  option: {
    backgroundColor: colors.mutedCardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  optionText: {
    color: colors.woodPrimary,
    fontSize: 14,
    fontWeight: '600'
  }
})

