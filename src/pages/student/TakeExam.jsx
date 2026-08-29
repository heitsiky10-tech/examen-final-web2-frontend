import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/studentApi';
import './TakeExam.css';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({}); // format: { questionId: choiceId }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const examData = await studentApi.getExamById(examId);
        setExam(examData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExamData();
  }, [examId]);

  const handleChoiceSelect = (questionId, choiceId) => {
    setAnswers({ ...answers, [questionId]: choiceId });
  };

  const handleSubmitExam = async (e) => {
    e.preventDefault();
    if (!window.confirm('Voulez-vous vraiment soumettre vos réponses ? Vous ne pourrez plus les modifier.')) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      
      const formattedAnswers = Object.entries(answers).map(([questionId, choiceId]) => ({
        question_id: Number(questionId),
        choice_id: Number(choiceId),
      }));

      const result = await studentApi.submitExam(examId, formattedAnswers);
     
      navigate(`/student/exams/${examId}/result`, { state: { result, examTitle: exam?.title } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Chargement de l'examen...</div>;
  }

  const questions = exam?.questions || [];

  return (
    <div className="take-exam-container">
      <div className="exam-top-bar">
        <h2>{exam ? exam.title : "Examen en cours"}</h2>
        <button type="button" className="back-btn" onClick={() => navigate('/student')}>
          Quitter
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmitExam}>
        <div className="questions-container">
          {questions.length === 0 ? (
            <p className="empty-row">Cet examen ne contient aucune question pour le moment.</p>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="question-card">
                <div className="question-title">
                  <span className="q-number">Question {index + 1} — {q.points} pt(s)</span>
                  <p>{q.statement}</p>
                </div>
                <div className="options-group">
                  {q.choices && q.choices.map((choice) => (
                    <label
                      key={choice.id}
                      className={`option-label ${answers[q.id] === choice.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        checked={answers[q.id] === choice.id}
                        onChange={() => handleChoiceSelect(q.id, choice.id)}
                      />
                      <span>{choice.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {questions.length > 0 && (
          <div className="submit-section">
            <button type="submit" className="submit-exam-btn" disabled={submitting}>
              {submitting ? "Soumission en cours..." : "Soumettre mes réponses"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TakeExam;