import React, { useEffect , useState} from 'react'
import '../Styles/StyleHead.css'
import ComponentLogin from './ComponentLogin';
import ComponentRegister from './ComponentRegister';
import cerrarSesion from '../Images/cerrarSesion.png';

export default function ComponentHead({ onLoginSuccess }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleOpenLogin = () => setIsLoginOpen(true);
  const handleCloseLogin = () => setIsLoginOpen(false);

  const handleOpenRegister = () => setIsRegisterOpen(true);
  const handleCloseRegister = () => setIsRegisterOpen(false);

  const handleLoginSuccess = (token, email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    localStorage.setItem("email", email);  
    localStorage.setItem("token", token);
    if (onLoginSuccess) {
      onLoginSuccess(token, email); // Notifica al padre (App.js)
    }
  };

  const handleRegisterSuccess = (email) => {
    setIsRegisterOpen(false); // Cierra el modal de registro
    setIsLoginOpen(true);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserEmail("");
    if (onLoginSuccess) {
      onLoginSuccess(null, ""); // Limpia en el padre también
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  return (
    <div className='header'>
      <div className="login-header">
        {!isLoggedIn ? (
          <button className='button-login' onClick={handleOpenLogin}>
            INICIAR SESIÓN
          </button>
        ) : (
          // Si el usuario está logueado, mostrar el botón de cerrar sesión
          // y el nombre de usuario
          <div className='user-info'>
            <span className='user-email'>{userEmail}</span>
            <img className='cerrarSesion' src={cerrarSesion} alt='cerrar seción' onClick={handleLogout}/>
          </div>
        )}

        {/* Mostrar el formulario solo si isLoginOpen es true */}
        {isLoginOpen && <ComponentLogin onLoginClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />}

        {!isLoggedIn && (
          <button className='button-register' onClick={handleOpenRegister}>
            REGISTRARME
          </button>
        )}

        {isRegisterOpen && <ComponentRegister onRegisterClose={handleCloseRegister} onRegisterSuccess={handleRegisterSuccess}/>}

      </div>
        <h1>CONTROL DE TAREAS</h1>
        <p>Administra tu lista de tareass</p>
    </div>
  )
}
