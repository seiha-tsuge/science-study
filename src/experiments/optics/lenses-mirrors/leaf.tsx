/** The tip of this recognizable object is the point followed in the optical model. */
export default function Leaf({ x, y, height, reflected = false }: { x: number; y: number; height: number; reflected?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${reflected ? -height : height} ${height})`}>
    <path d="M0 0C-.5-.22-.48-.68 0-1C.22-.72.58-.28 0 0Z" fill="#8dba72" stroke="#365a31" strokeWidth=".025" />
    <path d="M0 .12V-.92M0-.25L-.24-.42M0-.44L.19-.60M0-.61L-.12-.73" fill="none" stroke="#365a31" strokeWidth=".02" />
  </g>
}
