import { replace, split, head, sortBy, join, isString } from 'lodash'
import colors from './colors'

const remove = (str, patterns) => {
  return patterns.reduce((result, pattern) => {
    return replace(result, pattern, '')
  }, str)
}

const chunkString = (str, size) => {
  const length = str.length
  const result = []
  for (let i = 0; i < str.length; i++) {
    if (i % size === 0) {
      result.push(str.slice(i, i + size))
    }
  }
  return result
}

const distance = (x1, x2) => {
  if (x1.length !== x2.length) throw Error('Coordinates must be of same dimension.')
  return Math.sqrt(
    x1.reduce((total, point1, index) => {
      const point2 = x2[index]
      return total + Math.pow(point2 - point1, 2)
    }, 0)
  )
}

const cleanHex = x => {
  return remove(x.toLowerCase(), ['#'])
}

const cleanRgb = x => {
  return isString(x) ? split(
    remove(x.toLowerCase(), ['rgb(', ')', / /g]
  ), ',').map(str => Number(str)) : x
}

const validHex = hex => {
  if (hex.length !== 6 && hex.length !== 3) return false
  const parsed = parseInt(hex, 16).toString(16)
  // NOTE: fix for hex codes with leading zeros
  const diff = hex.length - parsed.length
  const padding = diff > 0 ? join(Array
    .apply(null, { length: diff })
    .map(t => '0'), '') : ''
  if (`${padding}${parsed}` === hex) {
    return hex
  }
  return false
}

const validRgb = rgb => {
  const isValid = rgb.length === 3 && rgb.reduce((result, val) => {
    return result && val >= 0 && val <= 255
  }, true)
  if (!isValid) return false
  return rgb
}

const hexToRgb = x => {
  const hex = cleanHex(x)
  if (!validHex(hex)) return false
  const size = hex.length / 3
  return chunkString(hex, size)
    .map(n => n.length === 1 ? n + n : n)
    .map(n => parseInt(n, 16))
}

export const rgbToHex = x => {
  const rgb = cleanRgb(x)
  if (!validRgb(rgb)) return false
  return rgb.reduce((hex, n) => {
    const value = n.toString(16)
    return `${hex}${value.length === 1 ? '0' + value : value}`
  }, '#')
}

export const rgbToStr = rgb => `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`

export const processColor = x => {
  const rgb = validRgb(cleanRgb(x)) || hexToRgb(x)
  if (rgb) {
    return { rgb, hex: rgbToHex(rgb) }
  }
  return false
}

export const closestColor = rgb => {
  return head(
    sortBy(colors, color => Math.abs(distance(rgb, color.rgb)))
  )
}

const getBrightness = ([ r, g, b ]) => {
  // https://www.w3.org/TR/AERT/#color-contrast
  return ((r * 299) + (g * 587) + (b * 114)) / 1000
}

export const isDark = rgb => getBrightness(rgb) < 128
