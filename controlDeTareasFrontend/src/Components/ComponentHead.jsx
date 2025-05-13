import React, {useState} from 'react'
import '../Styles/StyleHead.css'
import ComponentLogin from './ComponentLogin';
import ComponentRegister from './ComponentRegister';

export default function ComponentHead() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleOpenLogin = () => setIsLoginOpen(true);
  const handleCloseLogin = () => setIsLoginOpen(false);

  const handleOpenRegister = () => setIsRegisterOpen(true);
  const handleCloseRegister = () => setIsRegisterOpen(false);

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);  
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
            <button className='button-logout' onClick={handleLogout}>
              CERRAR SESIÓN
            </button>
          </div>
        )}

        {/* Mostrar el formulario solo si isLoginOpen es true */}
        {isLoginOpen && <ComponentLogin onLoginClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />}

        {!isLoggedIn && (
          <button className='button-register' onClick={handleOpenRegister}>
            REGISTRARME
          </button>
        )}

        {isRegisterOpen && <ComponentRegister onRegisterClose={handleCloseRegister} />}

        </div>
        <h1>CONTROL DE TAREAS</h1>
        <p>Administra tu lista de tareas</p>
    </div>
  )
}
