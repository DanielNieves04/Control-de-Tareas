import React, { useState } from "react";
import ComponentButtons from "./ComponentButtons";
import ComponentTasks from "./ComponentTasks";

export default function TaskManager() {
  const [activeButton, setActiveButton] = useState("Todas");

  return (
    <div>
      <ComponentButtons activeButton={activeButton} setActiveButton={setActiveButton} />
      <ComponentTasks activeButton={activeButton} />
    </div>
  );
}
