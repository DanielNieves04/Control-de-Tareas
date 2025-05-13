package com.Tareas.ControlTareas.Service;

import com.Tareas.ControlTareas.Entity.Tareas;

import java.util.List;

public interface TareasService {
    List<Tareas> findAllTareas();
    List<Tareas> findAllTareasByUser(Long id);
    Tareas saveTarea(Tareas tareas);
    Tareas updateTarea(Tareas tarea, Long id);
    void deleteTarea(Long id);
}
