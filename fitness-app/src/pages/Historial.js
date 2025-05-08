import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";


export default function Historial() {
  const [sesiones, setSesiones] = useState([]);
 

  useEffect(() => {
    const cargar = async () => {
      const { data: auth } = await supabase.auth.getUser();
      

      const { data, error } = await supabase
        .from("sesiones_realizadas")
        .select("*, rutinas(nombre)")
        .eq("usuario_id", auth.user.id)
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error cargando sesiones:", error);
        return;
      }

      setSesiones(data);
    };

    cargar();
  }, []);

  return (
    <div>


      <main style={{ padding: "2rem" }}>
        <h2>📋 Historial de Sesiones</h2>

        {sesiones.length === 0 ? (
          <p>No hay sesiones registradas.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sesiones.map((s) => (
              <li key={s.id} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
                <strong>{s.rutinas?.nombre || "Rutina eliminada"}</strong>
                <br />
                🗓 {new Date(s.fecha).toLocaleString()}
                <br />
                ⏱ {s.tiempo_real} min — {s.completada ? "✅ Completada" : "🟡 Incompleta"}
                <details style={{ marginTop: "0.5rem" }}>
                  <summary>Ver ejercicios</summary>
                  <ul>
                    {s.ejercicios_realizados?.map((e, i) => (
                      <li key={i}>
                        • {e.ejercicio}: {e.duracion} min
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        )}
      </main>

    </div>
  );
}
