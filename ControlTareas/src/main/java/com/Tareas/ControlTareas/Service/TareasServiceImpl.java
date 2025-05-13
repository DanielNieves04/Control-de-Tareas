package com.Tareas.ControlTareas.Service;

import com.Tareas.ControlTareas.Entity.Tareas;
import com.Tareas.ControlTareas.Entity.User;
import com.Tareas.ControlTareas.Repository.TareaRepository;
import com.Tareas.ControlTareas.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TareasServiceImpl implements TareasService{
    @Autowired
    TareaRepository tareaRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public List<Tareas> findAllTareas() {
        return tareaRepository.findAll();
    }

    @Override
    public List<Tareas> findAllTareasByUser(Long id) {
        return tareaRepository.findAllByUserId(id);
    }

    @Override
    public Tareas saveTarea(Tareas tareas) {
        Long idUser = tareas.getUser().getId();

        User usuarioExistente = userRepository.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        tareas.setUser(usuarioExistente);

        return tareaRepository.save(tareas);
    }

    @Override
    public Tareas updateTarea(Tareas tarea, Long id) {
        Tareas tareas1 = tareaRepository.findById(id).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        tareas1.setTarea(tarea.getTarea());
        tareas1.setEstado(tarea.getEstado());
        tareas1.setFechaCreacion(tarea.getFechaCreacion());
        return tareaRepository.save(tareas1);
    }

    @Override
    public void deleteTarea(Long id) {
        tareaRepository.deleteById(id);
    }
}
