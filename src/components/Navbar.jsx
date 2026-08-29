import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();


  if (location.pathname === '/login') {
    return null;
  }

  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user ? user.role : null; // 'admin' ou 'student'
  const userName = user ? user.name : 'Utilisateur';

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={role === 'admin' ? '/admin' : '/student'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
            <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
          </svg>
          <span className="logo-text">Exam Hub</span>
        </Link>
      </div>

      <div className="navbar-links">
        {role === 'admin' ? (
          <>
            <Link to="/admin">Accueil</Link>
            <Link to="/admin/students">Étudiants</Link>
            <Link to="/admin/courses">Cours</Link>
            <Link to="/admin/exams">Examens</Link>
          </>
        ) : (
          <>
            <Link to="/student">Examens disponibles</Link>
            <Link to="/student/results">Mon historique</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        <span className="user-role">
          {userName} ({role === 'admin' ? 'admin' : 'étudiant'})
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;