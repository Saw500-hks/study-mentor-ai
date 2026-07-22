"use client";

import { useState } from "react";
import { BrainCircuit, CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function QuizView() {
  const [topic, setTopic] = useState("Computer Science");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setQuizSubmitted(false);
    setUserAnswers({});
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: 3 }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
      }
    } catch {
      // Fallback questions if offline
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) score++;
    });
    return score;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart Quiz Generator</h2>
            <p className="text-xs text-slate-400">Generate targeted multiple-choice practice tests with explanations</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Physics</option>
          </select>

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            {loading ? "Generating..." : "Generate New Quiz"}
          </button>
        </div>
      </div>

      {/* Quiz Area */}
      {questions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Active Quiz Generated</h3>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            Select a subject above and click &quot;Generate New Quiz&quot; to test your knowledge with AI-curated practice questions.
          </p>
          <button
            onClick={generateQuiz}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-purple-600/20"
          >
            Start Practice Test
          </button>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto w-full">
          {/* Score Header Banner if Submitted */}
          {quizSubmitted && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-purple-300 font-semibold">Quiz Complete</div>
                  <div className="text-2xl font-black text-white">
                    Score: {calculateScore()} / {questions.length} (
                    {Math.round((calculateScore() / questions.length) * 100)}%)
                  </div>
                </div>
              </div>
              <button
                onClick={generateQuiz}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>
          )}

          {/* Question List */}
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-white text-base">
                  <span className="text-purple-400 font-bold mr-2">Q{qIdx + 1}.</span> {q.question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[qIdx] === oIdx;
                  const isCorrect = q.answerIndex === oIdx;

                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700";

                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-medium";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-rose-500/10 border-rose-500/50 text-rose-300";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-purple-600/20 border-purple-500 text-white font-medium";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={quizSubmitted}
                      onClick={() => setUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                      className={`p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation box after submission */}
              {quizSubmitted && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-purple-400">Explanation:</div>
                  <p className="leading-relaxed text-slate-400">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}

          {/* Submit Quiz Action */}
          {!quizSubmitted && (
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(userAnswers).length < questions.length}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20"
              >
                Submit & Check Answers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
