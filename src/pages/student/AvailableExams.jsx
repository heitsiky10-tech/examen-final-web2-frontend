import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../api/studentApi';
import './AvailableExams.css';

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableExams = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getAvailableExams();
        setExams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableExams();
  }, []);

  const formatDateDisplay = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const handleStartExam = (examId) => {
    navigate(`/student/exams/${examId}`);
  };

  return (
    <div className="student-exams-container">
      <h2>Examens disponibles</h2>
      <p className="subtitle">Retrouvez ci-dessous la liste des examens ouverts auxquels vous pouvez participer.</p>

      {error && <div className="error-message">{error}</div>}

      <div className="list-card">
        {loading ? (
          <p className="loading-text">Chargement des examens...</p>
        ) : exams.length === 0 ? (
          <p className="empty-row">Aucun examen n'est disponible pour le moment.</p>
        ) : (
          <div className="exams-grid">
            {exams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <div className="exam-card-header">
                  <h3>{exam.title}</h3>
                  <span className="course-badge">{exam.course ? exam.course.code : 'EXAM'}</span>
                </div>
                <p className="exam-description">{exam.course ? exam.course.name : 'Examen en ligne'}</p>
                <div className="exam-dates">
                  <div className="date-item"><span>À rendre avant :</span> {formatDateDisplay(exam.ends_at)}</div>
                  <div className="date-item"><span>Questions :</span> {exam.question_count} ({exam.total_points} pts)</div>
                </div>
                <button className="start-exam-btn" onClick={() => handleStartExam(exam.id)}>
                  Commencer l'examen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableExams;