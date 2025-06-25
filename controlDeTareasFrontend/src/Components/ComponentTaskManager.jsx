import React, { useState } from "react";
import ComponentButtons from "./ComponentButtons";
import ComponentTasks from "./ComponentTasks";

export default function TaskManager({ tareas, setTareas }) {
  const [activeButton, setActiveButton] = useState("Todas");

  return (
    <div>
      <ComponentButtons activeButton={activeButton} setActiveButton={setActiveButton} />
      <ComponentTasks activeButton={activeButton} tareas={tareas ?? []} setTareas={setTareas} />
    </div>
  );
}
