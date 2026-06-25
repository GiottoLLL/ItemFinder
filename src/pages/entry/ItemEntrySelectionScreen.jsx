import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import EntryOptionCard from '../../components/common/EntryOptionCard'
import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { colors, radius, spacing } from '../../styles/theme'

export default function ItemEntrySelectionScreen() {
  const navigation = useNavigation()

  return (
    <PageContainer backgroundColor={colors.pageBackground}>
      <TopNavBar />
      <View style={styles.main}>
        <View style={styles.hero}>
          <Text style={styles.pageTitle}>记录每件{'\n'}心爱的器物</Text>
          <Text style={styles.pageSubtitle}>
            选择最便捷的方式录入新物品，让生活重归秩序与宁静。
          </Text>
        </View>

        <View style={styles.featuredWrap}>
          <EntryOptionCard
            description='智能识别物品特征'
            featured
            iconName='camera'
            onPress={() => navigation.navigate('ItemEntryForm')}
            title='拍照录入'
          />
        </View>

        <View style={styles.gridRow}>
          <EntryOptionCard iconName='maximize' onPress={() => navigation.navigate('ItemEntryForm')} title='扫码识别' />
          <EntryOptionCard iconName='file-text' onPress={() => navigation.navigate('ItemEntryForm')} title='票据导入' />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>或者</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.manualSection}>
          <Text style={styles.manualLabel}>手动输入名称</Text>
          <View style={styles.inputShell}>
            <TextInput placeholder='输入物品名称' placeholderTextColor={colors.inputPlaceholder} />
          </View>
          <View style={styles.helperCard}>
            <Text style={styles.helperText}>
              您可以先输入名称，稍后再补充位置、类别及购买日期等详细信息。
            </Text>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('ItemEntryForm')} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>继续录入</Text>
        </Pressable>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    gap: spacing.xl,
    paddingBottom: 128,
    paddingTop: 32
  },
  hero: {
    gap: spacing.md
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44
  },
  pageSubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24
  },
  featuredWrap: {
    paddingTop: spacing.md
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md
  },
  dividerLine: {
    backgroundColor: 'rgba(178, 178, 178, 0.3)',
    flex: 1,
    height: 1
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2
  },
  manualSection: {
    gap: spacing.md
  },
  manualLabel: {
    color: colors.woodPrimary,
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
  helperCard: {
    backgroundColor: '#ECE9E4',
    borderRadius: radius.md,
    padding: spacing.md
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  submitButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#D7D2CA',
    borderRadius: radius.pill,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md
  },
  submitButtonText: {
    color: colors.woodPrimary,
    fontSize: 16,
    fontWeight: '700'
  }
})
