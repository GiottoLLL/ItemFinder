import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import ModalMask from '../layout/ModalMask'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function AddStorageModal({
  visible,
  onRequestClose,
  onConfirm
}) {
  const [spaceName, setSpaceName] = useState('')

  const handleConfirm = () => {
    return Promise.resolve()
      .then(() => (onConfirm ? onConfirm(spaceName) : null))
      .then(() => setSpaceName(''))
      .then(() => (onRequestClose ? onRequestClose() : null))
  }

  return (
    <ModalMask
      contentStyle={styles.modalWrap}
      onRequestClose={onRequestClose}
      overlayStyle={styles.overlay}
      visible={visible}
    >
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>添加存储空间</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.label}>空间名称</Text>
          <View style={styles.inputShell}>
            <TextInput
              onChangeText={setSpaceName}
              placeholder='例如：卧室衣柜'
              placeholderTextColor={colors.inputPlaceholder}
              value={spaceName}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <Pressable onPress={onRequestClose} style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>取消</Text>
          </Pressable>
          <Pressable onPress={handleConfirm} style={[styles.button, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>确认添加</Text>
          </Pressable>
        </View>
      </View>
    </ModalMask>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)'
  },
  modalWrap: {
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: colors.pageBackground,
    borderRadius: 48,
    padding: spacing.xl,
    ...shadows.soft
  },
  header: {
    paddingBottom: spacing.md
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700'
  },
  body: {
    gap: spacing.sm,
    paddingBottom: spacing.lg
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
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 14
  },
  secondaryButton: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.borderLight,
    borderWidth: 1
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700'
  },
  primaryButton: {
    backgroundColor: colors.accentBlue
  },
  primaryButtonText: {
    color: colors.woodPrimary,
    fontSize: 14,
    fontWeight: '700'
  }
})
