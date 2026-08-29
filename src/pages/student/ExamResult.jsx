import { useLocation, useNavigate } from 'react-router-dom';
import './ExamResult.css';

const ExamResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, examTitle } = location.state || {};

  
  if (!result) {
    return (
      <div className="exam-result-container">
        <p className="empty-row">
          Aucun résultat à afficher. <button className="back-btn" onClick={() => navigate('/student')}>Retour aux examens</button>
        </p>
      </div>
    );
  }

  return (
    <div className="exam-result-container">
      <div className="result-summary-card">
        <h2>{examTitle || 'Résultat de l\'examen'}</h2>
        <div className="score-display">
          {result.score} / {result.total_points}
        </div>
      </div>

      <div className="correction-list">
        {result.correction.map((line, index) => (
          <div key={line.question_id} className={`correction-item ${line.is_correct ? 'correct' : 'incorrect'}`}>
            <div className="correction-header">
              <span className="q-number">Question {index + 1} — {line.points} pt(s)</span>
              <span className={`result-badge ${line.is_correct ? 'correct' : 'incorrect'}`}>
                {line.is_correct ? '✓ Correct' : '✗ Incorrect'}
              </span>
            </div>
            <p className="correction-statement">{line.statement}</p>
            <p className="correction-detail">
              {line.student_choice_id === null
                ? 'Vous n\'avez pas répondu à cette question.'
                : line.is_correct
                  ? 'Votre réponse est correcte.'
                  : 'Votre réponse est incorrecte.'}
            </p>
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button className="back-btn" onClick={() => navigate('/student')}>Retour aux examens</button>
        <button className="back-btn" onClick={() => navigate('/student/results')}>Voir mon historique</button>
      </div>
    </div>
  );
};

export default ExamResult;