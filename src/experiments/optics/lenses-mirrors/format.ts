/** Presentation only: SI metres to displayed centimetres. */
export function cm(value: number) {
  return (value * 100).toLocaleString('ja-JP', { maximumSignificantDigits: 3 })
}
