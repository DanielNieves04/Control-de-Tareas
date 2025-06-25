import ComponentHead from './Components/ComponentHead';
import React, { useEffect, useState } from 'react';
import ComponentTaskManager from './Components/ComponentTaskManager';
import logoIA from './Images/Boot.png';
import { jwtDecode } from 'jwt-decode';
import ComponentLogin from './Components/ComponentLogin';

import './App.css';

function App() {

  const [mostrarChat, setMostrarChat] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [isModalAlertOpen, setIsModalAlertOpen] = useState(false);
  const [tareas, setTareas] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [emailUsuario, setEmailUsuario] = useState(localStorage.getItem("email") || "");
  const [showLogoutSuccessModal, setShowLogoutSuccessModal] = useState(false);
  const [showAñadirSuccessModal, setShowAñadirSuccessModal] = useState(false);


  const [mensajesChat, setMensajesChat] = useState([
    { tipo: 'bot', texto: '¡Hola! ¿En qué proyecto estás pensando hoy?' }
  ]);

  const toggleChat = () => {
    setMostrarChat(!mostrarChat);
  };

  const handleOpenModalAlert = () => setIsModalAlertOpen(true);
  const handleCloseModalAlert = () => {
    setIsModalAlertOpen(false);
  };

  // Obtener tareas al cargar la página
  useEffect(() => {
    // Obtener tareas
    const cargarTareas = () => {
      if (token) {
        const decoded = jwtDecode(token);
        const usuarioId = decoded.id;

        fetch(`https://api.render.com/deploy/srv-d15e4rjipnbc73eaem2g?key=Vo_ikxIMS5Y/tareas/findAllTareasByUser/${usuarioId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        })
          .then(res => res.json())
          .then(data => setTareas(data))
          .catch(error => console.error("Error al obtener tareas:", error));
      }
    };
  cargarTareas();
  }, [token]);

  const handleLoginSuccess = (newToken, email) => {
    setToken(newToken || "");
    setEmailUsuario(email || "");
    if (newToken) {
      // Lógica adicional como cargar tareas si es necesario
      console.log("Usuario autenticado:", email);
    } else {
      // Logout
      console.log("Usuario cerró sesión");
      setTareas([]);
      setMensajesChat([
        { tipo: 'bot', texto: '¡Hola! ¿En qué proyecto estás pensando hoy?' }
      ]);
      setShowLogoutSuccessModal(true); // Mostrar modal

      setTimeout(() => {
        setShowLogoutSuccessModal(false); // Ocultarlo después de 2 segundos
      }, 2000);  
    }
  }

  // Generar posibles tareas
  const generarTareas = (e) => {
    e.preventDefault();

    if (!token) {
      console.error("Token no disponible");
      return;
    }

    const descripcion = {
      descripcion: mensaje
    };

    // Agrega el mensaje del usuario al chat
    setMensajesChat(prev => [...prev, { tipo: 'usuario', texto: mensaje }]);
    setMensaje('');

    fetch("http://localhost:5000/generar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(descripcion),
    })
      .then(res => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
      })
      .then(data => {
        if (data.tareas && Array.isArray(data.tareas)) {
          const mensajesIA = data.tareas.map(t => ({ tipo: 'bot', texto: `📝 ${t}` }));
          setMensajesChat(prev => [...prev, ...mensajesIA]);
        } else {
          setMensajesChat(prev => [...prev, { tipo: 'bot', texto: "No se generaron tareas." }]);
        }
      })
      .catch(error => {
        console.error("Error al generar descripción:", error);
        setMensajesChat(prev => [...prev, { tipo: 'bot', texto: 'Ocurrió un error al generar la respuesta.' }]);
      });

  };

  // Agregar nueva tarea
  const guardarTarea = (tareaTexto) => {

    if (!token) {
      console.error("Token no disponible");
      return;
    }

    let usuarioId = null;
    try {
      const decoded = jwtDecode(token);
      usuarioId = decoded.id;
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return;
    }

    const nuevaTarea = {
      tarea: tareaTexto,
      estado: "Por hacer",
      user: {
        id: usuarioId
      }
    };

    fetch("https://api.render.com/deploy/srv-d15e4rjipnbc73eaem2g?key=Vo_ikxIMS5Y/tareas/saveTarea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(nuevaTarea),
    })
      .then(res => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
      })
      .then(data => {
        setTareas(prev => [...prev, data]);
      })
      .catch(error => console.error("Error al agregar tarea:", error));
  };

  const handleAgregarTarea = (texto) => {
    guardarTarea(texto.replace("📝 * ", ""));
    setShowAñadirSuccessModal(true);
    setTimeout(() => {
      setShowAñadirSuccessModal(false);
    }, 3000);
  };

  return (
    <div>
      <ComponentHead onLoginSuccess={handleLoginSuccess} />
      <ComponentTaskManager tareas={tareas} setTareas={setTareas} />

      <div className="tooltip">
        <button className="button-ia" onClick={() => {
          if (!token) {
            handleOpenModalAlert();
            return;
          }
          toggleChat();
        }}
        >
          <img className="icon-ia" src={logoIA} alt="IA Icon" />
          <span className="tooltip-text">Asistente IA</span>
        </button>
      </div>

      {mostrarChat && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <strong>Asistente IA</strong>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="chatbot-messages">
            {mensajesChat.map((msg, index) => (
              <div key={index} className="mensaje-contenedor">
                <p className={msg.tipo === 'bot' ? 'mensaje-bot' : 'mensaje-usuario'}>
                  {msg.texto}
                </p>
                {msg.tipo === 'bot' && msg.texto !== '¡Hola! ¿En qué proyecto estás pensando hoy?' &&
                  !msg.texto.startsWith("📝 **")  && (
                    <button
                      className="add-btn"
                      onClick={() => handleAgregarTarea(msg.texto)}
                    >
                      ➕
                    </button>
                  )}
              </div>
            ))}
            <div className="clear-btn-container">
              <button className="clear-btn" onClick={() => setMensajesChat([
                { tipo: 'bot', texto: '¡Hola! ¿En qué proyecto estás pensando hoy?' }
              ])}>🗑️
                <span className="tooltip-text">eliminar historial</span>
              </button>
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Escribe tu mensaje..." value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            <button onClick={generarTareas}>Enviar</button>
          </div>
        </div>
      )}

      {/* Modal de alerta */}
      {isModalAlertOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¡Inicia sesión para interactuar con el chatBot!</h2>
            <p>Por favor, inicia sesión para poder crear tus tareas</p>
            <button onClick={handleCloseModalAlert}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de tarea añadida */}
      {showAñadirSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="modal-content">
              <p>Tarea añadida. Se añadido en el estado Por hacer</p> 
            </div>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <ComponentLogin
          onLoginSuccess={handleLoginSuccess}
          onLoginClose={() => setIsLoginOpen(false)}
        />
      )}

      {showLogoutSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="modal-content">
              <p>¡Sesión cerrada exitosamente!</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
