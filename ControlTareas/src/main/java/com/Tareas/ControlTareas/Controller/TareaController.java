package com.Tareas.ControlTareas.Controller;

import com.Tareas.ControlTareas.Entity.Tareas;
import com.Tareas.ControlTareas.Service.TareasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tareas")
@CrossOrigin(origins = "*")
public class TareaController {
    @Autowired
    TareasService tareasService;

    @GetMapping("/findAllTareas")
    public List<Tareas> findAllTareas(){
        return tareasService.findAllTareas();
    }

    @GetMapping("/findAllTareasByUser/{userId}")
    public List<Tareas> findAllTareasByUser(@PathVariable long userId){
        return tareasService.findAllTareasByUser(userId);
    }

    @PostMapping("/saveTarea")
    public Tareas saveTareas(@RequestBody Tareas tareas){
        return tareasService.saveTarea(tareas);
    }

    @PutMapping("/updateTarea/{id}")
    public Tareas updateTarea(@RequestBody Tareas tareas, @PathVariable Long id){
        return tareasService.updateTarea(tareas,id);
    }

    @DeleteMapping("/deleteTarea/{id}")
    public String deleteTarea(@PathVariable Long id){
        tareasService.deleteTarea(id);
        return "Tarea eliminada exitosamente";
    }
}