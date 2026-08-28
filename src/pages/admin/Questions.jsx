import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import './Questions.css';

const Questions = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [statement, setStatement] = useState('');
  const [points, setPoints] = useState(1);
  const [choices, setChoices] = useState([
    { text: '', is_correct: true },
    { text: '', is_correct: false },
  ]);

  const isLocked = exam ? exam.attempt_count > 0 : false; // RG-08

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examData, questionsData] = await Promise.all([
        adminApi.getExamById(examId),
        adminApi.getExamQuestions(examId),
      ]);
      setExam(examData);
      setQuestions(questionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const handleChoiceChange = (index, field, value) => {
    const newChoices = [...choices];
    if (field === 'is_correct') {
      newChoices.forEach((c, i) => { c.is_correct = i === index; });
    } else {
      newChoices[index].text = value;
    }
    setChoices(newChoices);
  };

  const addChoiceField = () => {
    if (choices.length >= 6) {
      setError('Une question ne peut pas avoir plus de 6 choix.');
      return;
    }
    setChoices([...choices, { text: '', is_correct: false }]);
  };

  const removeChoiceField = (index) => {
    if (choices.length <= 2) {
      setError('Une question doit comporter au moins 2 choix de réponse.');
      return;
    }
    const newChoices = choices.filter((_, i) => i !== index);
    if (!newChoices.some((c) => c.is_correct)) {
      newChoices[0].is_correct = true;
    }
    setChoices(newChoices);
  };

  const resetForm = () => {
    setStatement('');
    setPoints(1);
    setChoices([{ text: '', is_correct: true }, { text: '', is_correct: false }]);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.addExamQuestion(examId, {
        statement,
        points: Number(points),
        position: questions.length + 1,
        choices,
      });
      setSuccessMessage('Question ajoutée avec succès.');
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette question ?')) return;
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.deleteQuestion(questionId);
      setSuccessMessage('Question supprimée avec succès.');
      fetchData();
    } catch (err) {
      setError(err.message); // Gère l'erreur RG-08 (409) si l'examen a déjà des tentatives
    }
  };

  return (
    <div className="admin-questions-container">
      <div className="breadcrumb">
        <Link to="/admin/exams">← Retour à la liste des examens</Link>
      </div>

      <div className="exam-header-card">
        <h2>Gestion des questions</h2>
        {exam && <p className="exam-subtitle">Examen : <strong>{exam.title}</strong></p>}
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {isLocked && (
        <div className="error-message">
          🔒 Cet examen a déjà été passé par au moins un étudiant : ses questions et choix ne sont plus modifiables (RG-08).
        </div>
      )}

      {!isLocked && (
        <div className="form-card">
          <h3>Ajouter une question</h3>
          <form onSubmit={handleCreateQuestion}>
            <div className="form-group">
              <label>Intitulé de la question</label>
              <textarea
                placeholder="ex: Quel est le rôle principal du middleware dans Express.js ?"
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows="2"
                required
              />
            </div>

            <div className="form-group">
              <label>Points</label>
              <input
                type="number"
                min="1"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
            </div>

            <div className="options-section-label">Choix de réponses (cochez la bonne réponse)</div>

            {choices.map((choice, index) => (
              <div key={index} className="option-row">
                <input
                  type="radio"
                  name="correct-option"
                  checked={choice.is_correct}
                  onChange={() => handleChoiceChange(index, 'is_correct', true)}
                  title="Définir comme bonne réponse"
                />
                <input
                  type="text"
                  placeholder={`Choix ${index + 1}`}
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                  required
                />
                {choices.length > 2 && (
                  <button type="button" className="remove-option-btn" onClick={() => removeChoiceField(index)}>✕</button>
                )}
              </div>
            ))}

            {choices.length < 6 && (
              <button type="button" className="add-option-btn" onClick={addChoiceField}>+ Ajouter un choix</button>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-btn">Ajouter la question</button>
            </div>
          </form>
        </div>
      )}

      <div className="list-card">
        <h3>Questions enregistrées ({questions.length})</h3>
        {loading ? (
          <p className="loading-text">Chargement des questions...</p>
        ) : questions.length === 0 ? (
          <p className="empty-row">Aucune question n'a encore été ajoutée à cet examen.</p>
        ) : (
          <div className="questions-list">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="question-item">
                <div className="question-item-header">
                  <span className="question-number">Question {qIndex + 1} — {q.points} pt(s)</span>
                  {!isLocked && (
                    <button className="delete-question-btn" onClick={() => handleDeleteQuestion(q.id)}>
                      Supprimer
                    </button>
                  )}
                </div>
                <p className="question-text">{q.statement}</p>
                <ul className="options-list">
                  {q.choices && q.choices.map((choice) => (
                    <li key={choice.id} className={choice.is_correct ? 'correct-choice' : ''}>
                      {choice.text} {choice.is_correct && <span className="badge-correct">✓ Bonne réponse</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;