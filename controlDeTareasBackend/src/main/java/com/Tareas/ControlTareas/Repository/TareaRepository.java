package com.Tareas.ControlTareas.Repository;

import com.Tareas.ControlTareas.Entity.Tareas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tareas,Long> {

    List<Tareas> findAllByUserId(Long id);


}