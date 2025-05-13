import React, { useState } from "react";
import "../Styles/StyleLogin.css";

export default function LoginComponent({ onLoginSuccess, onLoginClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
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

      if (onLoginSuccess) {
        onLoginSuccess(email); // Pasar email al padre
      }
    } catch (err) {
      setError(err.message);
      
    } finally {
      setLoading(false);
      onLoginClose(); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>INICIO DE SECIÓN</h2>
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
        <button type="button" onClick={onLoginClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
