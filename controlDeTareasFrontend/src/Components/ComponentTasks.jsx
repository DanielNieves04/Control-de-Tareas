import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../Styles/StyleTasks.css';
import añadirIcon from '../Images/añadir.svg';
import eliminarIcon from '../Images/eliminar.svg';

export default function ComponentTasks({ activeButton, tareas, setTareas }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAlertOpen, setIsModalAlertOpen] = useState(false);
  const [isModalAlertEditar, setIsModalAlertEditar] = useState(false);
  const [estado, setEstado] = useState('');
  const [tarea, setTarea] = useState('');
  const [deletingId, setDeletingId] = useState(null); // Para animación de eliminación
  const token = localStorage.getItem("token");
  const [tareaEditando, setTareaEditando] = useState(null);
  const BASE_URL = "https://control-de-tareas-backend.onrender.com/tareas";

  // Abrir y cerrar modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTarea('');
    setEstado('');
  };

  const handleOpenModalAlert = () => setIsModalAlertOpen(true);
  const handleCloseModalAlert = () => {
    setIsModalAlertOpen(false);
  };

  const handleOpenModalEditar = (tarea) => {
    setTareaEditando(tarea);
    setTarea(tarea.tarea);
    setIsModalAlertEditar(true);
  };
  const handleCloseModalEditar = () => {
    setIsModalAlertEditar(false);
  };

  // Agregar nueva tarea
  const handleSubmit = (e) => {
    e.preventDefault();

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
      tarea,
      estado,
      user: {
        id: usuarioId
      }
    };

    fetch(`${BASE_URL}/saveTarea`, {
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
        setTareas([...tareas, data]);
        handleCloseModal();
      })
      .catch(error => console.error("Error al agregar tarea:", error));
  };

  const eliminarTarea = (tareaId) => {
    if (token) {
      setDeletingId(tareaId); // para animación

      setTimeout(() => {
        fetch(`${BASE_URL}/deleteTarea/${tareaId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
          .then(() => {
            setTareas(tareas.filter((t) => t.id !== tareaId));
            setDeletingId(null);
          })
          .catch(error => console.error("Error al eliminar tarea:", error));
      }, 1000); // tiempo de animación
    }
  };

  // Actualizar estado de la tarea
  const handleEstadoChange = (tareaId, nuevoEstado) => {
    const tareaActualizada = tareas.find((t) => t.id === tareaId);

    if (!tareaActualizada) return; // Evita errores si la tarea no existe

    let usuarioId = null;
    try {
      const decoded = jwtDecode(token);
      usuarioId = decoded.id;
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return;
    }

    const nuevaTarea = {
      tarea: tareaActualizada.tarea,
      estado: nuevoEstado,
      user: {
        id: usuarioId
      }
    };

    fetch(`${BASE_URL}/updateTarea/${tareaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(nuevaTarea),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTareas(tareas.map((t) => (t.id === tareaId ? data : t)));
      })
      .catch((error) => console.error("Error al actualizar tarea:", error));
  };

  const handleEditarSubmit = (e) => {
  e.preventDefault();

  if (!tareaEditando) return;

  const nuevaTarea = {
    tarea: tarea,
    estado: tareaEditando.estado,
    user: { id: jwtDecode(token).id }
  };

  fetch(`${BASE_URL}/updateTarea/${tareaEditando.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(nuevaTarea),
  })
    .then((res) => res.json())
    .then((data) => {
      setTareas(tareas.map((t) => (t.id === data.id ? data : t)));
      handleCloseModalEditar();
    })
    .catch((error) => console.error("Error al editar tarea:", error));
};


  // Filtrar tareas según el botón activo
  const tareasFiltradas = activeButton === "Todas"
    ? tareas
    : tareas.filter((t) => t.estado === activeButton);

  return (
    <div className='container-tasks'>
      {/* Botón para agregar tarea */}
      <div className="tareas-list">
        <div className='añadir-task'
          onClick={() => {
            if (token == null) {
              handleOpenModalAlert();
              return;
            }
            handleOpenModal();
          }}>
          <img className='añadir-img-task' src={añadirIcon} alt='Añadir nueva tarea' />
          <button className='añadir-button-task'>Añadir tarea</button>
        </div>

        {/* Mostrar lista de tareas */}
        {tareasFiltradas.map((t) => (
          <div
            key={t.id}
            className={`tarea-card ${deletingId === t.id ? 'fade-out' : ''}`}
            onAnimationEnd={() => deletingId === t.id && setDeletingId(null)} // Limpiar ID después de la animación
          >
            <div className="tarea-card-head">
              <select
                value={t.estado}
                onChange={(e) => handleEstadoChange(t.id, e.target.value)}
              >
                <option value="Por hacer">Por hacer</option>
                <option value="Haciendo">Haciendo</option>
                <option value="Hecha">Hecha</option>
              </select>
              <div className='tarea-card-head-options'>
                <button onClick={() => handleOpenModalEditar(t)}>
                  ✏️
                </button>
              </div>
            </div>
            <div className='tarea-card-body'>
              <h3>{t.tarea}</h3>
            </div>
            <div className='tarea-card-foot'>
              <p>{t.fechaCreacion}</p>
              <img
                className="eliminar-button"
                onClick={() => eliminarTarea(t.id)}
                src={eliminarIcon}
                alt='Eliminar tarea'
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agregar tarea */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>AÑADIR NUEVA TAREA</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Tarea:
                <input
                  type="text"
                  value={tarea}
                  onChange={(e) => setTarea(e.target.value)}
                  required
                />
              </label>
              <label>
                Estado:
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  required
                >
                  <option value="">Selecciona un estado</option>
                  <option value="Por hacer">Por hacer</option>
                  <option value="Haciendo">Haciendo</option>
                  <option value="Hecha">Hecha</option>
                </select>
              </label>
              <div className='modal-buttons'>
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleCloseModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de alerta */}
      {isModalAlertOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¡Inicia sesión para añadir tareas!</h2>
            <p>Por favor, inicia sesión para poder añadir nuevas tareas.</p>
            <button onClick={handleCloseModalAlert}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de editar */}
      {isModalAlertEditar && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar tarea</h2>
            <form onSubmit={handleEditarSubmit}>
              <label>
                Nueva descripción:
                <input
                  type="text"
                  value={tarea}
                  onChange={(e) => setTarea(e.target.value)}
                  required
                />
              </label>
              <div className='modal-buttons'>
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleCloseModalEditar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
