import { Box, Group, Slider, Text } from '@mantine/core'
import { useId } from 'react'

interface ParameterSliderProps {
  label: string
  symbol: string
  unit: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export default function ParameterSlider({
  label,
  symbol,
  unit,
  value,
  min,
  max,
  step = 1,
  onChange,
}: ParameterSliderProps) {
  const id = useId()
  return (
    <Box my="xl">
      <Group justify="space-between" mb="sm" gap="xs">
        <Text id={id} size="sm">
          {label}{' '}
          <Text component="span" c="gray.7">
            {symbol}
          </Text>
        </Text>
        <Text component="output" fw={600}>
          {value}{' '}
          <Text component="span" size="xs" c="gray.7">
            {unit}
          </Text>
        </Text>
      </Group>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        thumbLabel={label}
        thumbProps={{
          'aria-labelledby': id,
          'aria-valuetext': `${value} ${unit}`,
        }}
        label={(current) => `${current} ${unit}`}
        onChange={onChange}
      />
      <Group justify="space-between" mt="xs">
        <Text size="xs" c="gray.7">
          {min} {unit}
        </Text>
        <Text size="xs" c="gray.7">
          {max} {unit}
        </Text>
      </Group>
    </Box>
  )
}
