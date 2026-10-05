/** A static water-wave analogy: height and plan view share the same crest positions. */
export default function WaveMarkerGuide() {
  const surface = Array.from({ length: 101 }, (_, index) => {
    const x = 40 + index * 4.8
    const y = 88 - 25 * Math.sin((x - 40) / 160 * 2 * Math.PI)
    return `${index ? 'L' : 'M'}${x} ${y}`
  }).join(' ')
  return <figure className="image-diagram image-marker-guide">
    <svg viewBox="0 0 620 255" role="img" aria-label="水面の山を横から見た図と上から見た図。同じ横の位置の山の頂点を、上から見た山の線へ対応させる。">
      <text x="30" y="28">水面を横から見る：高さの山</text>
      <line x1="40" x2="520" y1="88" y2="88" stroke="#adb5bd" />
      <path d={surface} fill="none" stroke="#1971c2" strokeWidth="3" />
      <text x="30" y="158">同じ水面を上から：山の並び</text>
      {[80, 240, 400].map(x => <g key={x}>
        <circle cx={x} cy="63" r="5" fill="#147a65" />
        <line x1={x} x2={x} y1="69" y2="133" stroke="#868e96" strokeDasharray="3 5" />
        <line x1={x} x2={x} y1="177" y2="224" stroke="#147a65" strokeWidth="4" />
      </g>)}
      <path d="M470 200 H570 l-12 -8 M570 200 l-12 8" fill="none" stroke="#1971c2" strokeWidth="2" />
      <text x="457" y="249">山が進む向き</text>
    </svg>
    <figcaption>水面の山の頂点を緑で選び、同じ横の位置のまま上からの図へ移しました。水面の高さと、山が並ぶ場所を分けて見ます。このように繰り返す変化が伝わる現象が波です。</figcaption>
  </figure>
}
