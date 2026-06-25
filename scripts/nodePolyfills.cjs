const defineArrayMethod = (methodName, methodImpl) => {
  if (typeof Array.prototype[methodName] === 'function') {
    return
  }

  Object.defineProperty(Array.prototype, methodName, {
    value: methodImpl,
    writable: true,
    configurable: true
  })
}

defineArrayMethod('toReversed', function toReversed() {
  return Array.from(this).reverse()
})

defineArrayMethod('toSorted', function toSorted(compareFn) {
  return Array.from(this).sort(compareFn)
})

defineArrayMethod('toSpliced', function toSpliced(start, deleteCount, ...items) {
  const copy = Array.from(this)

  if (deleteCount === undefined) {
    copy.splice(start)
    return copy
  }

  copy.splice(start, deleteCount, ...items)
  return copy
})

defineArrayMethod('with', function arrayWith(index, value) {
  const copy = Array.from(this)
  const len = copy.length >>> 0
  const relativeIndex = Number(index)
  const actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex

  if (!Number.isFinite(actualIndex) || actualIndex < 0 || actualIndex >= len) {
    throw new RangeError('Invalid index')
  }

  copy[actualIndex] = value
  return copy
})

const defineGlobal = (name, value) => {
  if (typeof globalThis[name] !== 'undefined') {
    return
  }

  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true
  })
}

try {
  const webStreams = require('stream/web')

  defineGlobal('ReadableStream', webStreams.ReadableStream)
  defineGlobal('WritableStream', webStreams.WritableStream)
  defineGlobal('TransformStream', webStreams.TransformStream)
  defineGlobal('ByteLengthQueuingStrategy', webStreams.ByteLengthQueuingStrategy)
  defineGlobal('CountQueuingStrategy', webStreams.CountQueuingStrategy)
  defineGlobal('TextEncoderStream', webStreams.TextEncoderStream)
  defineGlobal('TextDecoderStream', webStreams.TextDecoderStream)
  defineGlobal('CompressionStream', webStreams.CompressionStream)
  defineGlobal('DecompressionStream', webStreams.DecompressionStream)
} catch (error) {
}

try {
  const os = require('os')

  if (typeof os.availableParallelism !== 'function') {
    os.availableParallelism = () => {
      const cpus = os.cpus()
      return Array.isArray(cpus) && cpus.length > 0 ? cpus.length : 1
    }
  }
} catch (error) {
}
