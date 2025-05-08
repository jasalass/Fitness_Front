import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ Credenciales incorrectas.");
    } else {
      nav("/");
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "auto",
      paddingTop: "3rem",
      padding: "2rem",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    }}>
      <h1 style={{ color: "#00c8a0", textAlign: "center" }}>🏋️ FitnessApp</h1>
      <p style={{ marginBottom: "1.5rem", textAlign: "center", color: "#555" }}>
        Planifica tus entrenamientos semanales, ejecuta rutinas con temporizador y lleva el historial de tus progresos. Proyecto demo hecho con Supabase + React.
      </p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>
          Ingresar
        </button>
      </form>

      <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
        <p><strong>🔑 Usuario de prueba:</strong></p>
        <p>📧 <code>demo@usuario.com</code></p>
        <p>🔒 <code>123456</code></p>
      </div>

      <p style={{ marginTop: "2rem", textAlign: "center" }}>
        ¿No tienes cuenta?{" "}
        <span
          onClick={() => nav("/register")}
          style={{ color: "#00c8a0", cursor: "pointer", fontWeight: "bold" }}
        >
          Crear cuenta
        </span>
      </p>
    </div>
  );
}
