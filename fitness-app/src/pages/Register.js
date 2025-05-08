import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ Error al registrar: " + error.message);
      return;
    }

    const user = data.user;

    if (user) {
      // Insertar en tabla perfiles (opcional)
      const { error: perfilError } = await supabase.from("perfiles").insert([
        {
          id: user.id,
          nombre: nombre,
        },
      ]);

      if (perfilError) {
        console.error("Error insertando perfil:", perfilError.message);
      }
    }

    alert("✅ Registro exitoso. Revisa tu correo para verificar tu cuenta.");
    nav("/login");
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "auto",
      paddingTop: "4rem",
      padding: "1.5rem",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    }}>
      <h2 style={{ textAlign: "center", color: "#00c8a0" }}>Crear Cuenta</h2>
      <form onSubmit={handleRegister}>
        <label>Nombre</label>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <label>Correo</label>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña segura"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>
          Registrarme
        </button>
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        ¿Ya tienes cuenta?{" "}
        <span
          onClick={() => nav("/login")}
          style={{ color: "#00c8a0", cursor: "pointer", fontWeight: "bold" }}
        >
          Inicia sesión
        </span>
      </p>
    </div>
  );
}
