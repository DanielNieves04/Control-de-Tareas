import React, { useState } from "react";
import "../Styles/StyleLogin.css";

export default function LoginComponent({ onLoginSuccess, onLoginClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_URL_AUTH = "http://localhost:8080/api/auth";

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL_AUTH}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        onLoginClose(); // Cierra el modal de inicio de sesión
        onLoginSuccess(data.token, email); // Llama la función que abre el registro
      }, 2000);

    } catch (err) {
      setError("El usuario o la contraseña son incorrectos.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>INICIO DE SESIÓN</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-user">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
        {showSuccessModal && (
          <div className="success-modal-overlay">
            <div className="success-modal">
              <div className="modal-content">
                <p>¡Inicio de sesión exitoso! </p>
              </div>
            </div>
          </div>
        )}
        <button type="button" onClick={onLoginClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
