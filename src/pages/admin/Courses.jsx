import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      if (editingId) {
        await adminApi.updateCourse(editingId, formData);
        setSuccessMessage('Cours mis à jour avec succès.');
      } else {
        await adminApi.createCourse(formData);
        setSuccessMessage('Cours créé avec succès.');
      }
      setFormData({ code: '', name: '', description: '' });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({ code: course.code, name: course.name, description: course.description || '' });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ code: '', name: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce cours ?')) return;
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.deleteCourse(id);
      setSuccessMessage('Cours supprimé avec succès.');
      fetchCourses();
    } catch (err) {
      setError(err.message); // Gère notamment l'erreur RG-09 si le cours possède des examens
    }
  };

  return (
    <div className="admin-courses-container">
      <div className="form-card">
        <h3>{editingId ? "Modifier un cours" : "Ajouter un cours"}</h3>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Code du cours</label>
              <input
                type="text"
                placeholder="ex: WEB2"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom du cours</label>
              <input
                type="text"
                placeholder="ex: Fullstack Web"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                placeholder="ex: Express & React"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? "Mettre à jour" : "Créer le cours"}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Annuler</button>
            )}
          </div>
        </form>
      </div>

      <div className="list-card">
        <h3>Liste des cours</h3>
        {loading ? (
          <p className="loading-text">Chargement des cours...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>CODE</th><th>NOM</th><th>DESCRIPTION</th><th>ACTIONS</th></tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan="4" className="empty-row">Aucun cours enregistré.</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td className="course-code-cell">{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.description || '-'}</td>
                    <td className="actions-cell">
                      <button className="action-link edit" onClick={() => handleEdit(course)}>Modifier</button>
                      <button className="action-link delete" onClick={() => handleDelete(course.id)}>Supprimer</button>
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

export default Courses;