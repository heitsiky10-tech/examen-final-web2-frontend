import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import './Exams.css';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({ title: '', course_id: '', starts_at: '', ends_at: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsData, coursesData] = await Promise.all([adminApi.getExams(), adminApi.getCourses()]);
      setExams(examsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateForInput = (isoString) => (isoString ? isoString.slice(0, 16) : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = {
        ...formData,
        course_id: Number(formData.course_id),
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: new Date(formData.ends_at).toISOString(),
      };
      if (editingId) {
        await adminApi.updateExam(editingId, payload);
        setSuccessMessage('Examen mis à jour avec succès.');
      } else {
        await adminApi.createExam(payload);
        setSuccessMessage('Examen créé avec succès.');
      }
      setFormData({ title: '', course_id: '', starts_at: '', ends_at: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (exam) => {
    setEditingId(exam.id);
    setFormData({
      title: exam.title,
      course_id: exam.course ? exam.course.id : '',
      starts_at: formatDateForInput(exam.starts_at),
      ends_at: formatDateForInput(exam.ends_at),
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', course_id: '', starts_at: '', ends_at: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet examen ?')) return;
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.deleteExam(id);
      setSuccessMessage('Examen supprimé avec succès.');
      fetchData();
    } catch (err) {
      setError(err.message); // Gère l'erreur RG-09 si l'examen possède des tentatives
    }
  };

  const formatDateDisplay = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  return (
    <div className="admin-exams-container">
      <div className="form-card">
        <h3>{editingId ? "Modifier l'examen" : "Créer un examen"}</h3>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Titre de l'examen</label>
              <input
                type="text"
                placeholder="ex: Examen Final Express"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Cours associé</label>
              <select
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un cours</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date de début</label>
              <input
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="datetime-local"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? "Mettre à jour" : "Créer l'examen"}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Annuler</button>
            )}
          </div>
        </form>
      </div>

      <div className="list-card">
        <h3>Liste des examens</h3>
        {loading ? (
          <p className="loading-text">Chargement des examens...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>TITRE</th><th>COURS</th><th>DÉBUT</th><th>FIN</th><th>ACTIONS</th></tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr><td colSpan="5" className="empty-row">Aucun examen enregistré.</td></tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="exam-title-cell">{exam.title}</td>
                    <td>{exam.course ? `${exam.course.code} - ${exam.course.name}` : '-'}</td>
                    <td>{formatDateDisplay(exam.starts_at)}</td>
                    <td>{formatDateDisplay(exam.ends_at)}</td>
                    <td className="actions-cell">
                      <Link to={`/admin/exams/${exam.id}/questions`} className="action-link questions">Questions</Link>
                      <Link to={`/admin/exams/${exam.id}/results`} className="action-link results">Résultats</Link>
                      <button className="action-link edit" onClick={() => handleEdit(exam)}>Modifier</button>
                      <button className="action-link delete" onClick={() => handleDelete(exam.id)}>Supprimer</button>
                    </td>
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

export default Exams;