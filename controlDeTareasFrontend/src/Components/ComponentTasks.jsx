import React, { useEffect, useState } from 'react';
import '../Styles/StyleTasks.css';
import añadirIcon from '../Images/añadir.svg';
import eliminarIcon from '../Images/eliminar.svg';

export default function ComponentTasks({ activeButton }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estado, setEstado] = useState('');
  const [tarea, setTarea] = useState('');
  const [tareas, setTareas] = useState([]);
  const [deletingId, setDeletingId] = useState(null); // Para animación de eliminación
  const token = localStorage.getItem("token");

  // Abrir y cerrar modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTarea('');
    setEstado('');
  };

  // Obtener tareas al cargar la página
  useEffect(() => {
    if (token) {
    fetch("https://qs5b0kcp-8080.use2.devtunnels.ms/tareas/findAllTareas",{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }})
      .then(res => res.json())
      .then(data => setTareas(data))
      .catch(error => console.error("Error al obtener tareas:", error));
  }}, [token]);

  // Agregar nueva tarea
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!token) {
      console.error("Token no disponible");
      return;
    }
  
    const nuevaTarea = { tarea, estado };
  
    fetch("http://localhost:8080/tareas/saveTarea", {
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
      setTareas([...tareas, data]); // Agregar tarea con ID desde backend
      handleCloseModal();
    })
    .catch(error => console.error("Error al agregar tarea:", error));
  };
  

  // Eliminar tarea
  const eliminarTarea = (id) => {
    setDeletingId(id); // Marcar la tarea para animación

    setTimeout(() => {
      fetch(`http://localhost:8080/tareas/deleteTarea/${id}`, { method: "DELETE" })
        .then(() => {
          setTareas(tareas.filter((t) => t.id !== id));
          setDeletingId(null);
        })
        .catch(error => console.error("Error al eliminar tarea:", error));
    }, 500); // Tiempo para la animación (coincide con CSS)
  };
 

  // Actualizar estado de la tarea
  const handleEstadoChange = (id, nuevoEstado) => {
    const tareaActualizada = tareas.find((t) => t.id === id);
    
    if (!tareaActualizada) return; // Evita errores si la tarea no existe
  
    const nuevaTarea = { 
      ...tareaActualizada, 
      estado: nuevoEstado 
    };
  
    fetch(`http://localhost:8080/tareas/updateTarea/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTarea),
    })
    .then((res) => res.json())
    .then((data) => {
      setTareas(tareas.map((t) => (t.id === id ? data : t))); 
    })
    .catch((error) => console.error("Error al actualizar tarea:", error));
  };
  

  // Filtrar tareas según el botón activo
  const tareasFiltradas = activeButton === "Todas" 
    ? tareas 
    : tareas.filter((t) => t.estado === activeButton);

  return (
    <div className='container-tasks'>
      {/* Botón para agregar tarea */}
      <div className="tareas-list">
        <div className='añadir-task' onClick={handleOpenModal}>
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
                onChange={(e) => handleEstadoChange(Number(t.id) , e.target.value)}
              >
                <option value="Por hacer">Por hacer</option>
                <option value="Haciendo">Haciendo</option>
                <option value="Hecha">Hecha</option>
              </select>
            </div>
            <div className='tarea-card-body'>
              <h3>{t.tarea}</h3>
            </div>
            <div className='tarea-card-foot'>
              <p>{t.fechaCreacion}</p>
              <img
                className="eliminar-button"
                onClick={() => eliminarTarea(Number(t.id))}
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
    </div>
  );
}
