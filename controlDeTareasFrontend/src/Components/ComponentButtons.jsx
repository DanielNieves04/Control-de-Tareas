import '../Styles/StyleButtons.css'
import React from "react";

export default function ComponentButtons({ activeButton, setActiveButton }) {

    function cambiarColor(event) {
      setActiveButton(event.target.innerText);
    }
  
    return (
      <div className="buttons">
        {["Todas", "Por hacer", "Haciendo", "Hecha"].map((label, index) => (
          <button
            key={index}
            onClick={cambiarColor}
            style={{
              backgroundColor: activeButton === label ? "#5f4bb6" : "#f6f6f6",
              color: activeButton === label ? "#ffffff" : "#202a25",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    );
}
