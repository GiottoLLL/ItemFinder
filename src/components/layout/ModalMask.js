import { Pressable, StyleSheet, View } from 'react-native'

export default function ModalMask({
  visible,
  children,
  onRequestClose,
  overlayStyle,
  contentStyle
}) {
  if (!visible) {
    return null
  }

  return (
    <View style={styles.root} pointerEvents='box-none'>
      <Pressable onPress={onRequestClose} style={[styles.overlay, overlayStyle]} />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  }
})
