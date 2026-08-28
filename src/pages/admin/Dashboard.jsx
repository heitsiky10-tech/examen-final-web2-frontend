import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ coursesCount: 0, examsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [courses, exams] = await Promise.all([adminApi.getCourses(), adminApi.getExams()]);
        setStats({ coursesCount: courses.length, examsCount: exams.length });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Tableau de bord Admin</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-title">Cours enregistrés</div>
          <div className="dashboard-card-count">{stats.coursesCount}</div>
          <Link to="/admin/courses" className="dashboard-link">Gérer les cours</Link>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-title">Examens créés</div>
          <div className="dashboard-card-count">{stats.examsCount}</div>
          <Link to="/admin/exams" className="dashboard-link">Gérer les examens</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;