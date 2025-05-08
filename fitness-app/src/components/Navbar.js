import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ user }) {
  const nav = useNavigate();
  const [nombre, setNombre] = useState("");

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/login");
  };

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("perfiles")
        .select("nombre")
        .eq("id", user.id)
        .single();

      if (error) {
        console.warn("No se pudo obtener el perfil:", error.message);
      } else {
        setNombre(data?.nombre || "");
      }
    };

    cargarPerfil();
  }, [user]);

  return (
    <nav style={{
      background: "#00c8a0",
      color: "#fff",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span
          style={{ cursor: "pointer", fontWeight: "bold", fontSize: "1.2rem" }}
          onClick={() => nav("/")}
        >
          🏋️ FitnessApp
        </span>
        <button onClick={() => nav("/")} style={{ padding: "0.3rem 0.8rem" }}>Inicio</button>
        <button onClick={() => nav("/historial")} style={{ padding: "0.3rem 0.8rem" }}>Historial</button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span>
          👤 {nombre || user?.email || "Usuario"}
        </span>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
