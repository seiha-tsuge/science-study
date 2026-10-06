import { Badge, Button, Slider, Text } from '@mantine/core'
import { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { observeMotion } from './model'
import {
  EXPLANATION_DURATION,
  explanationPhysicalTime,
  explanationSceneIndex,
  explanationScenes,
} from './explanation-timeline'
import './explanation-animation.css'

gsap.registerPlugin(useGSAP)

const parameters = { initialPosition: 0, velocity: 5 }
const samples = [0, 1, 2, 3, 4].map((time) => ({
  time,
  ...observeMotion(parameters, time),
}))
// SI単位からSVG座標への変換は、表示側だけで行う。
const trackX = (position: number) => 54 + position * 23
const graphX = (time: number) => 66 + time * 110
const graphY = (position: number) => 222 - position * 7.5
const graphPath = samples
  .map(
    (sample, index) =>
      `${index === 0 ? 'M' : 'L'}${graphX(sample.time)},${graphY(sample.position)}`,
  )
  .join(' ')

export default function ExplanationAnimation() {
  const container = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const id = useId()
  const physicalTime = explanationPhysicalTime(time)
  const observation = observeMotion(parameters, physicalTime)
  const sceneIndex = explanationSceneIndex(time)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useGSAP(
    () => {
      const clock = { seconds: 0 }
      const tl = gsap.timeline({
        paused: true,
        onUpdate: () => setTime(clock.seconds),
        onComplete: () => setPlaying(false),
      })
      timeline.current = tl
      setPlaying(false)
      const duration = (seconds: number) => (reducedMotion ? 0 : seconds)

      tl.to(
        clock,
        {
          seconds: EXPLANATION_DURATION,
          duration: EXPLANATION_DURATION,
          ease: 'none',
        },
        0,
      )
        .fromTo(
          '.explanation-axis',
          { opacity: 0 },
          { opacity: 1, duration: duration(0.7) },
          0,
        )
        .fromTo(
          '.explanation-object',
          { opacity: 0 },
          { opacity: 1, duration: duration(0.6) },
          0.5,
        )
        .fromTo(
          '.explanation-sample',
          { opacity: 0 },
          {
            opacity: 1,
            duration: duration(0.4),
            stagger: reducedMotion ? 0 : 0.65,
          },
          6,
        )
        .fromTo(
          '.explanation-displacement',
          { opacity: 0 },
          {
            opacity: 1,
            duration: duration(0.5),
            stagger: reducedMotion ? 0 : 0.55,
          },
          10,
        )
        .fromTo(
          '.explanation-graph',
          { opacity: 0 },
          { opacity: 1, duration: duration(0.5) },
          14,
        )
        .fromTo(
          '.explanation-graph-line',
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: duration(1.6),
            ease: 'none',
          },
          14.5,
        )
        .fromTo(
          '.explanation-graph-point',
          { opacity: 0 },
          {
            opacity: 1,
            duration: duration(0.3),
            stagger: reducedMotion ? 0 : 0.3,
          },
          16,
        )
        .fromTo(
          '.explanation-equation',
          { opacity: 0, y: reducedMotion ? 0 : 12 },
          {
            opacity: 1,
            y: 0,
            duration: duration(0.7),
            ease: 'power2.out',
          },
          18,
        )
        .fromTo(
          '.explanation-symbol',
          { opacity: 0 },
          {
            opacity: 1,
            duration: duration(0.5),
            stagger: reducedMotion ? 0 : 0.25,
          },
          18.7,
        )

      tl.time(reducedMotion ? EXPLANATION_DURATION : 0)
      setTime(reducedMotion ? EXPLANATION_DURATION : 0)

      const pauseWhenHidden = () => {
        if (document.hidden) {
          tl.pause()
          setPlaying(false)
        }
      }
      document.addEventListener('visibilitychange', pauseWhenHidden)
      return () => {
        document.removeEventListener('visibilitychange', pauseWhenHidden)
        timeline.current = null
      }
    },
    { scope: container, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  const seek = (seconds: number) => {
    timeline.current?.pause().time(seconds)
    setTime(seconds)
    setPlaying(false)
  }
  const toggle = () => {
    const tl = timeline.current
    if (!tl || reducedMotion) return
    if (tl.time() >= EXPLANATION_DURATION) {
      tl.restart()
      setPlaying(true)
    } else if (tl.paused()) {
      tl.play()
      setPlaying(true)
    } else {
      tl.pause()
      setPlaying(false)
    }
  }

  return (
    <div
      ref={container}
      className="motion-explanation"
      role="region"
      aria-labelledby={`${id}-heading`}
    >
      <header className="motion-explanation-header">
        <div>
          <p className="eyebrow">動きから式へ · 22秒の説明</p>
          <h3 id={`${id}-heading`}>同じ時間に、同じ変位</h3>
        </div>
        <Badge variant="light">解析式の可視化</Badge>
      </header>
      <p>
        青い点が物体、白い輪が1秒ごとの位置です。この図は出発点0 m、右向きの速度5 m/sに固定しています。条件を変える操作は下の運動の図にあります。
      </p>

      <div className="motion-explanation-stage">
        <svg
          className="explanation-track"
          viewBox="0 0 580 230"
          role="img"
          aria-labelledby={`${id}-track-title ${id}-track-desc`}
        >
          <title id={`${id}-track-title`}>等速運動の位置と1秒ごとの変位</title>
          <desc id={`${id}-track-desc`}>
            右向きに5
            m/sで進みます。物理時刻0、1、2、3、4秒の位置は0、5、10、15、20
            mで、1秒ごとの変位は＋5 mです。
          </desc>
          <g className="explanation-axis">
            <text x="32" y="28" className="explanation-svg-heading">
              一直線上の運動
            </text>
            <text x="538" y="28" textAnchor="end">
              右向きが正 →
            </text>
            <line
              x1="32"
              x2="548"
              y1="122"
              y2="122"
              className="explanation-axis-line"
            />
            {samples.map((sample) => (
              <g key={sample.time}>
                <line
                  x1={trackX(sample.position)}
                  x2={trackX(sample.position)}
                  y1="116"
                  y2="128"
                  className="explanation-axis-line"
                />
                <text x={trackX(sample.position)} y="151" textAnchor="middle">
                  {sample.position}
                </text>
              </g>
            ))}
            <text x="538" y="174" textAnchor="end">
              位置 x [m]
            </text>
          </g>
          <g className="explanation-object">
            <circle
              cx={trackX(observation.position)}
              cy="100"
              r="12"
              fill="#2563eb"
            />
          </g>
          {samples.map((sample) => (
            <g key={sample.time} className="explanation-sample">
              <circle
                cx={trackX(sample.position)}
                cy="100"
                r="5"
                fill="#fcfcfa"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <text x={trackX(sample.position)} y="204" textAnchor="middle">
                {sample.time} s
              </text>
            </g>
          ))}
          {samples.slice(0, -1).map((sample, index) => {
            const start = trackX(sample.position)
            const end = trackX(samples[index + 1].position)
            const displacement = samples[index + 1].position - sample.position
            return (
              <g key={sample.time} className="explanation-displacement">
                <path
                  d={`M${start + 8},76 H${end - 8} m-6,-4 l6,4 l-6,4`}
                  fill="none"
                  stroke="#147d68"
                  strokeWidth="2"
                />
                <text
                  x={(start + end) / 2}
                  y="64"
                  textAnchor="middle"
                  className="explanation-distance"
                >
                  ＋{displacement} m
                </text>
              </g>
            )
          })}
        </svg>

        <svg
          className="explanation-graph"
          viewBox="0 0 580 300"
          role="img"
          aria-labelledby={`${id}-graph-title ${id}-graph-desc`}
        >
          <title id={`${id}-graph-title`}>位置と時間のグラフ</title>
          <desc id={`${id}-graph-desc`}>
            横軸は時間s、縦軸は位置m。原点から4秒・20 mまでの直線で、傾きは5
            m/sです。運動の0〜4秒を振り返るグラフです。
          </desc>
          <text x="32" y="28" className="explanation-svg-heading">
            位置と時間のグラフ
          </text>
          {samples.map((sample) => (
            <g key={sample.time}>
              <line
                x1="66"
                x2="506"
                y1={graphY(sample.position)}
                y2={graphY(sample.position)}
                className="grid-line"
              />
              <text x="55" y={graphY(sample.position) + 5} textAnchor="end">
                {sample.position}
              </text>
              <text x={graphX(sample.time)} y="246" textAnchor="middle">
                {sample.time}
              </text>
            </g>
          ))}
          <path
            d="M66,66 V222 H524"
            fill="none"
            className="explanation-axis-line"
          />
          <text x="66" y="60">
            位置 x [m]
          </text>
          <text x="520" y="282" textAnchor="end">
            時間 t [s]
          </text>
          <path
            d={graphPath}
            pathLength="1"
            strokeDasharray="1 1"
            className="explanation-graph-line current-path"
          />
          {samples.map((sample) => (
            <circle
              key={sample.time}
              cx={graphX(sample.time)}
              cy={graphY(sample.position)}
              r="5"
              fill="#2563eb"
              className="explanation-graph-point"
            />
          ))}
          <text x="300" y="96" className="explanation-graph-point">
            傾き = 5 m/s
          </text>
        </svg>
      </div>

      <div className="explanation-equation">
        <div
          className="formula"
          aria-label="位置イコール初期位置プラス速度かける時間"
        >
          x = x₀ + vt
        </div>
        <dl className="explanation-symbols">
          <div className="explanation-symbol">
            <dt>x₀ = 0 m</dt>
            <dd>出発点</dd>
          </div>
          <div className="explanation-symbol">
            <dt>v = 5 m/s</dt>
            <dd>一定の速度</dd>
          </div>
          <div className="explanation-symbol">
            <dt>t = 4 s</dt>
            <dd>物理時刻</dd>
          </div>
          <div className="explanation-symbol">
            <dt>x = 20 m</dt>
            <dd>4秒後の位置</dd>
          </div>
        </dl>
      </div>

      <p className="explanation-caption" aria-live="polite" aria-atomic="true">
        <strong>
          {String(sceneIndex + 1).padStart(2, '0')} ·{' '}
          {explanationScenes[sceneIndex].label}
        </strong>
        {explanationScenes[sceneIndex].caption}
      </p>
      <div className="explanation-readings">
        <span>
          物体の時間 t <output>{physicalTime.toFixed(2)} s</output>
        </span>
        <span>
          位置 x <output>{observation.position.toFixed(2)} m</output>
        </span>
        <span>
          {playing && time > 2 && time < 6
            ? '物体が動いています'
            : '物体の時間は止まっています'}
        </span>
      </div>
      <div className="explanation-playback">
        <Button type="button" onClick={toggle} disabled={reducedMotion}>
          {playing
            ? '説明を一時停止'
            : time >= EXPLANATION_DURATION
              ? '説明をもう一度再生'
              : '説明を再生'}
        </Button>
        <Button type="button" variant="default" onClick={() => seek(0)}>
          説明を初期化
        </Button>
      </div>
      <div className="time-slider">
        <Text id={`${id}-time`} size="sm" mb="sm">
          説明の時間：{time.toFixed(1)} / {EXPLANATION_DURATION} 秒
        </Text>
        <Slider
          min={0}
          max={EXPLANATION_DURATION}
          step={0.1}
          value={time}
          thumbLabel="説明の時間"
          thumbProps={{ 'aria-labelledby': `${id}-time` }}
          label={(value) => `${value.toFixed(1)} s`}
          onChange={seek}
        />
      </div>
      <div
        className="explanation-scenes"
        role="group"
        aria-label="説明の場面を選ぶ"
      >
        {explanationScenes.map((scene, index) => (
          <Button
            key={scene.label}
            variant={sceneIndex === index ? 'light' : 'default'}
            type="button"
            aria-pressed={sceneIndex === index}
            onClick={() => seek(scene.end)}
          >
            {index + 1}. {scene.label}
          </Button>
        ))}
      </div>
      {reducedMotion && (
        <p className="small-note">
          動きを減らす設定に合わせて再生を無効にしています。場面のボタンか時間スライダーで静止画を選べます。
        </p>
      )}
      <p className="small-note">
        「説明の時間」の2〜6秒だけ、物体の時間が0〜4秒へ進みます。その後は物体を止め、過去の位置を印とグラフに示します。グラフの線が現れる動きは、物体の追加の運動を表しません。
      </p>
    </div>
  )
}
