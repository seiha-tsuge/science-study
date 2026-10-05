import { Text } from '@mantine/core'

/** Reserve the tallest explanation at the current width, including when text wraps. */
export default function Observation({ current, alternatives }: { current: string; alternatives: string[] }) {
  return <div className="image-observation">
    {[...new Set([...alternatives, current])].map(text => <Text key={text} aria-hidden={text !== current} className={text === current ? undefined : 'image-observation-reserve'}>{text}</Text>)}
  </div>
}
