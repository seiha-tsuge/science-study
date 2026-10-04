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
    <div className="parameter">
      <label htmlFor={id}>
        {label} <span className="symbol">{symbol}</span>
        <output>
          {value} <small>{unit}</small>
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value} ${unit}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="range-labels">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  )
}
