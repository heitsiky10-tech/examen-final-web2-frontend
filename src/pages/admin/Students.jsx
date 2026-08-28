import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      if (editingId) {
        
        const payload = { name: formData.name, email: formData.email };
        if (formData.password) payload.password = formData.password;
        await adminApi.updateStudent(editingId, payload);
        setSuccessMessage('Étudiant mis à jour avec succès.');
      } else {
        await adminApi.createStudent(formData);
        setSuccessMessage('Étudiant créé avec succès.');
      }
      setFormData({ name: '', email: '', password: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({ name: student.name, email: student.email, password: '' });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleToggleStatus = async (student) => {
    setError(null);
    try {
      if (student.is_active) {
       
        await adminApi.deleteStudent(student.id);
      } else {
        await adminApi.updateStudent(student.id, { name: student.name, email: student.email, is_active: true });
      }
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-students-container">
      <div className="form-card">
        <h3>{editingId ? "Modifier l'étudiant" : "Ajouter un étudiant"}</h3>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                placeholder="ex: Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="etudiant@examhub.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mot de passe {editingId && "(laisser vide pour ne pas modifier)"}</label>
              <input
                type="password"
                placeholder="•••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                {...(!editingId ? { required: true } : {})}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? "Mettre à jour" : "Créer l'étudiant"}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Annuler</button>
            )}
          </div>
        </form>
      </div>

      <div className="list-card">
        <h3>Liste des étudiants</h3>
        {loading ? (
          <p className="loading-text">Chargement des étudiants...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>NOM</th><th>EMAIL</th><th>STATUT</th><th>ACTIONS</th></tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="4" className="empty-row">Aucun étudiant enregistré.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span className={`status-badge ${student.is_active ? 'active' : 'inactive'}`}>
                        {student.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-link edit" onClick={() => handleEdit(student)}>Modifier</button>
                      <button className="action-link delete" onClick={() => handleToggleStatus(student)}>
                        {student.is_active ? 'Désactiver' : 'Activer'}
                      </button>
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

export default Students;