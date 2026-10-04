import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

interface LessonContent {
  title: string
  subtitle: string
  question: string
  predictionQuestion: string
  predictions: readonly string[]
  observation: string
  reflection: string
  challenge: string
  challengeOptions: readonly string[]
  challengeAnswer: string
  challengeExplanation: string
  journalPath: string
}

export default function Lesson({
  lesson,
  number,
  simulation,
  explanation,
  next,
}: {
  lesson: LessonContent
  number: string
  simulation: ReactNode
  explanation: ReactNode
  next: ReactNode
}) {
  const [prediction, setPrediction] = useState('')
  const [committedPrediction, setCommittedPrediction] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [answer, setAnswer] = useState('')
  const [checkedAnswer, setCheckedAnswer] = useState('')
  const [explained, setExplained] = useState(false)
  return (
    <article className="lesson-page">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link to="/">学習マップ</Link>
        <span>/</span>
        <Link to="/mechanics">力学</Link>
        <span>/</span>
        <span>{lesson.title}</span>
      </nav>
      <header className="page-heading">
        <p className="eyebrow">MECHANICS · LESSON {number}</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.subtitle}</p>
      </header>
      <nav className="lesson-steps" aria-label="学習の流れ">
        {['問い', '予想', '実験', '数式', '説明', '再挑戦'].map((name, i) => (
          <a key={name} href={`#step-${i + 1}`}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {name}
          </a>
        ))}
      </nav>
      <section className="question-card" id="step-1">
        <p className="eyebrow">01 — 今日の問い</p>
        <h2>{lesson.question}</h2>
        <p>操作する前に予想して、動き・数値・グラフを照らし合わせよう。</p>
      </section>
      <section className="lesson-section" id="step-2">
        <div className="section-heading">
          <span>02</span>
          <h2>まず、予想する</h2>
        </div>
        <p>正解でなくても大丈夫です。理由も、声に出すか Markdown の学習メモに残してください。</p>
        <fieldset className="prediction-options" disabled={Boolean(committedPrediction)}>
          <legend>{lesson.predictionQuestion}</legend>
          {lesson.predictions.map((option) => (
            <label key={option} className={prediction === option ? 'selected' : ''}>
              <input
                type="radio"
                name={`prediction-${number}`}
                value={option}
                checked={prediction === option}
                onChange={() => setPrediction(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
        {!committedPrediction ? (
          <button
            type="button"
            className="primary-button"
            disabled={!prediction}
            onClick={() => setCommittedPrediction(prediction)}
          >
            この予想で実験する →
          </button>
        ) : (
          <p className="prediction-receipt" role="status">
            あなたの予想：{committedPrediction} <small>実験後に比べてみましょう。</small>
          </p>
        )}
        <p className="small-note">
          選択はこのページを開いている間だけ保持します。記録を残すときは {lesson.journalPath}{' '}
          を使います。
        </p>
      </section>
      <section className="lesson-section" id="step-3">
        <div className="section-heading">
          <span>03</span>
          <h2>動かして、観察する</h2>
        </div>
        <p>{lesson.observation}</p>
        {committedPrediction ? (
          simulation
        ) : (
          <div className="locked-panel">
            <span aria-hidden="true">◇</span>
            <p>まず予想を選ぶと、実験を始められます。</p>
            <a href="#step-2">予想へ戻る ↑</a>
          </div>
        )}
      </section>
      <section className="lesson-section" id="step-4">
        <div className="section-heading">
          <span>04</span>
          <h2>数式と照らし合わせる</h2>
        </div>
        <p>動きとグラフを見たら、式の意味とモデルの前提を確かめましょう。</p>
        <button
          type="button"
          className="secondary-button"
          disabled={!committedPrediction}
          aria-expanded={showExplanation}
          aria-controls={`explanation-${number}`}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? '解説を閉じる −' : '式と解説を開く ＋'}
        </button>
        {showExplanation && (
          <div id={`explanation-${number}`} className="explanation">
            {explanation}
            <p className="source">
              参考資料：
              <a
                href="https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration"
                target="_blank"
                rel="noreferrer"
              >
                OpenStax · Motion with Constant Acceleration ↗
              </a>
            </p>
          </div>
        )}
      </section>
      <section className="lesson-section" id="step-5">
        <div className="section-heading">
          <span>05</span>
          <h2>自分の言葉で、説明する</h2>
        </div>
        <p>{lesson.reflection}</p>
        <div className="reflection-card">
          <h3>解説を閉じて、思い出してみる</h3>
          <p>
            「予想は……。観察したのは……。理由は……。」の順に話してみましょう。分からない点も、そのまま残します。
          </p>
          <label>
            <input
              type="checkbox"
              checked={explained}
              disabled={!committedPrediction}
              onChange={(event) => {
                setExplained(event.target.checked)
                if (event.target.checked) setShowExplanation(false)
              }}
            />
            解説を閉じて、自分の言葉で説明した
          </label>
          <p className="small-note">
            記録先：notes/journal/。予想・条件・観察・理解の変化・残った問いを Markdown で残せます。
          </p>
        </div>
      </section>
      <section className="lesson-section" id="step-6">
        <div className="section-heading">
          <span>06</span>
          <h2>別の条件で、再挑戦</h2>
        </div>
        <p>解説を見ずに予想してから、実験の条件を変えて確かめましょう。</p>
        <fieldset className="challenge-options" disabled={!explained}>
          <legend>{lesson.challenge}</legend>
          {lesson.challengeOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={`challenge-${number}`}
                checked={answer === option}
                onChange={() => {
                  setAnswer(option)
                  setCheckedAnswer('')
                }}
              />
              {option}
            </label>
          ))}
        </fieldset>
        {!explained && (
          <p className="small-note">自分の言葉で説明できたら、上のチェックを入れて再挑戦へ。</p>
        )}
        <button
          type="button"
          className="secondary-button"
          disabled={!answer || !explained}
          onClick={() => setCheckedAnswer(answer)}
        >
          答えを確かめる
        </button>
        {checkedAnswer && explained && (
          <div
            className={checkedAnswer === lesson.challengeAnswer ? 'feedback success' : 'feedback'}
            role="status"
          >
            <strong>
              {checkedAnswer === lesson.challengeAnswer
                ? '予想と式がつながりました。'
                : '条件と単位を、もう一度確かめよう。'}
            </strong>
            <p>{lesson.challengeExplanation}</p>
            <p>実験で同じ条件を設定して、数値も確認してみましょう。</p>
          </div>
        )}
      </section>
      <footer className="next-lesson">
        <div>
          <span className="eyebrow">学びをつなぐ</span>
          <p>今回の問いから、次の問いへ。</p>
        </div>
        {next}
      </footer>
    </article>
  )
}
