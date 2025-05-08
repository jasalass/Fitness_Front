import { useState } from "react";
import { supabase } from "../supabaseClient";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado", "Domingo"];

export default function CrearRutina({ userId, onRutinaCreada }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dia, setDia] = useState("Lunes");
  const [ejercicios, setEjercicios] = useState([{ nombre: "", duracion: 5 }]);

  const agregarEjercicio = () => {
    setEjercicios([...ejercicios, { nombre: "", duracion: 5 }]);
  };

  const actualizarEjercicio = (i, campo, valor) => {
    const copia = [...ejercicios];
    copia[i][campo] = valor;
    setEjercicios(copia);
  };

  const guardarRutina = async () => {
    if (!nombre.trim()) return alert("Nombre requerido");
    if (!userId) return alert("Usuario no autenticado");

    const payload = {
      nombre,
      descripcion,
      dia_semana: dia,
      usuario_id: userId,
    };

    console.log("➡️ Insertando rutina:", payload);

    const { data: rutina, error } = await supabase
      .from("rutinas")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ Error creando rutina:", error);
      return alert("Error creando rutina");
    }

    console.log("✅ Rutina creada:", rutina);

    // Insertar ejercicios asociados
    const ejerciciosData = ejercicios
      .filter((e) => e.nombre.trim())
      .map((e, i) => ({
        rutina_id: rutina.id,
        ejercicio: e.nombre.trim(),
        duracion_min: parseInt(e.duracion),
        orden: i,
      }));

    if (ejerciciosData.length === 0) return alert("Debe agregar al menos un ejercicio válido");

    const { error: errorEj } = await supabase.from("rutina_ejercicios").insert(ejerciciosData);

    if (errorEj) {
      console.error("❌ Error insertando ejercicios:", errorEj);
      return alert("Error guardando ejercicios");
    }

    alert("✅ Rutina creada exitosamente");
    onRutinaCreada?.();

    // Reiniciar formulario
    setNombre("");
    setDescripcion("");
    setDia("Lunes");
    setEjercicios([{ nombre: "", duracion: 5 }]);
  };

  return (
    <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Crear nueva rutina</h3>
      <input
        placeholder="Nombre de la rutina"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <label>Día de la semana:</label>
      <select value={dia} onChange={(e) => setDia(e.target.value)} style={{ marginBottom: "1rem" }}>
        {diasSemana.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>

      <h4>Ejercicios:</h4>
      {ejercicios.map((e, i) => (
        <div key={i} style={{ marginBottom: "0.5rem" }}>
          <input
            placeholder="Nombre del ejercicio"
            value={e.nombre}
            onChange={(ev) => actualizarEjercicio(i, "nombre", ev.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="number"
            min="1"
            value={e.duracion}
            onChange={(ev) => actualizarEjercicio(i, "duracion", ev.target.value)}
            style={{ width: "60px" }}
          />
          <span> min</span>
        </div>
      ))}

      <button onClick={agregarEjercicio} style={{ marginRight: "1rem" }}>
        + Añadir ejercicio
      </button>
      <button onClick={guardarRutina}>💾 Guardar rutina</button>
    </div>
  );
}
