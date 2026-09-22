import { useState } from 'react'
import StepIndicator from './components/StepIndicator.jsx'
import QuestionInput from './components/QuestionInput.jsx'
import EvaluationResult from './components/EvaluationResult.jsx'
import ImprovedQuestion from './components/ImprovedQuestion.jsx'
import { analyzeQuestion, MIN_QUESTION_LENGTH } from './services/coachService.js'

export default function App() {
  const [step, setStep] = useState(1)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const goTo = (next) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      setResult(await analyzeQuestion(question))
      goTo(2)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    setQuestion('')
    setResult(null)
    goTo(1)
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-8 space-y-6 text-center">
        <h1 className="text-3xl font-extrabold text-orange-700 sm:text-4xl">AI 질문 코치</h1>
        <StepIndicator current={step} />
      </header>

      <main>
        {step === 1 && (
          <QuestionInput
            value={question}
            onChange={setQuestion}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            canSubmit={question.trim().length >= MIN_QUESTION_LENGTH}
          />
        )}
        {step === 2 && result && (
          <EvaluationResult
            question={question}
            evaluation={result.evaluation}
            onNext={() => goTo(3)}
            onBack={() => goTo(1)}
          />
        )}
        {step === 3 && result && (
          <ImprovedQuestion
            question={question}
            improvement={result.improvement}
            onBack={() => goTo(2)}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}
