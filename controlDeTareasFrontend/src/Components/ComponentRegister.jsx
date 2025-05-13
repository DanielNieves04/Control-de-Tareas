import React, {useState} from 'react';

export default function RegisterComponent({ onRegisterSuccess, onRegisterClose }) { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
    
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });
      
            if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.message || "Error al registrar usuario");
            }
      
            const data = await response.json();
            localStorage.setItem("token", data.token);
            if (onRegisterSuccess) onRegisterSuccess(data.token);
          } catch (err) {
            setError('Error al registrar');
          } finally {
            setLoading(false);
          }
    };

  return (  
<div className="modal-overlay">
      <div className="modal">
        <div className="login" onClick={onRegisterSuccess}>
          <h2>INICIO DE SECIÓN</h2>
          <form onSubmit={handleRegister}>
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
            <label htmlFor="confirm-password">Confirmar Contraseña</label>
            <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            {error && <p className="error-user">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Registrarme"}
            </button>
          </form>
          <button type="button" onClick={onRegisterClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

