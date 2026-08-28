import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import './Results.css';

const Results = () => {
  const { examId } = useParams();
  const [examTitle, setExamTitle] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [average, setAverage] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getExamResults(examId);
        setExamTitle(data.exam.title);
        setTotalPoints(data.total_points);
        setAverage(data.average);
        setAttemptCount(data.attempt_count);
        setResults(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId]);

  const formatDateDisplay = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="admin-results-container">
      <div className="breadcrumb">
        <Link to="/admin/exams">← Retour à la liste des examens</Link>
      </div>

      <div className="exam-header-card">
        <h2>Résultats de l'examen</h2>
        {examTitle && <p className="exam-subtitle">Examen : <strong>{examTitle}</strong></p>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="list-card">
        <h3>
          Historique des soumissions ({attemptCount}) —{' '}
          Moyenne : {average !== null ? `${average} / ${totalPoints}` : 'Aucune tentative'}
        </h3>

        {loading ? (
          <p className="loading-text">Chargement des résultats...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>ÉTUDIANT</th><th>NOTE OBTENUE</th><th>DATE DE SOUMISSION</th></tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan="3" className="empty-row">Aucun étudiant n'a encore passé cet examen.</td></tr>
              ) : (
                results.map((res) => (
                  <tr key={res.student_id}>
                    <td className="student-name-cell">{res.name}</td>
                    <td><span className="score-badge">{res.score} / {totalPoints}</span></td>
                    <td>{formatDateDisplay(res.submitted_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Results;