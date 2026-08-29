import { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi';
import './History.css';

const History = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getMyResults();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDateDisplay = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="student-history-container">
      <h2>Historique de mes examens</h2>
      <p className="subtitle">Retrouvez l'ensemble des examens que vous avez passés ainsi que vos notes.</p>

      {error && <div className="error-message">{error}</div>}

      <div className="list-card">
        {loading ? (
          <p className="loading-text">Chargement de l'historique...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>COURS</th><th>EXAMEN</th><th>NOTE OBTENUE</th><th>DATE DE SOUMISSION</th></tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan="4" className="empty-row">Vous n'avez pas encore d'historique d'examen.</td></tr>
              ) : (
                results.map((res) => (
                  <tr key={res.exam_id}>
                    <td>{res.course_code}</td>
                    <td className="exam-title-cell">{res.title}</td>
                    <td><span className="score-badge">{res.score} / {res.total_points}</span></td>
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

export default History;