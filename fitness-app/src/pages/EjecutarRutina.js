import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function EjecutarRutina() {
  const { rutinaId } = useParams();
  const navigate = useNavigate();

  const [rutina, setRutina] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [actual, setActual] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [enCurso, setEnCurso] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [acumulado, setAcumulado] = useState(0);
  const [userId, setUserId] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    const cargar = async () => {
      const { data: r } = await supabase.from("rutinas").select("*").eq("id", rutinaId).single();
      const { data: e } = await supabase
        .from("rutina_ejercicios")
        .select("*")
        .eq("rutina_id", rutinaId)
        .order("orden");

      setRutina(r);
      setEjercicios(e);
      if (e.length > 0) {
        setTiempo(e[0].duracion_min * 60);
        setEnCurso(true);
      }
    };

    if (rutinaId) cargar();
  }, [rutinaId]);

  const registrarSesion = useCallback(
    async (completa = false) => {
      const resumen = ejercicios.slice(0, actual + 1).map((e) => ({
        ejercicio: e.ejercicio,
        duracion: e.duracion_min,
      }));

      await supabase.from("sesiones_realizadas").insert([
        {
          rutina_id: rutinaId,
          usuario_id: userId,
          tiempo_real: acumulado,
          completada: completa,
          ejercicios_realizados: resumen,
        },
      ]);

      alert(completa ? "✅ Rutina completada y registrada" : "🛑 Rutina detenida y registrada parcialmente");
      navigate("/");
    },
    [acumulado, actual, ejercicios, navigate, rutinaId, userId]
  );

  const avanzar = useCallback(() => {
    clearInterval(timerRef.current);
    const duracion = ejercicios[actual]?.duracion_min ?? 0;
    setAcumulado((prev) => prev + duracion);

    if (actual + 1 < ejercicios.length) {
      setActual((prev) => prev + 1);
      setTiempo(ejercicios[actual + 1].duracion_min * 60);
    } else {
      setEnCurso(false);
      registrarSesion(true);
    }
  }, [actual, ejercicios, registrarSesion]);

  useEffect(() => {
    if (!enCurso || pausado || tiempo === 0) return;

    timerRef.current = setInterval(() => {
      setTiempo((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [tiempo, enCurso, pausado]);

  useEffect(() => {
    if (tiempo === 0 && enCurso && !pausado) {
      avanzar();
    }
  }, [tiempo, avanzar, enCurso, pausado]);

  const pausar = () => {
    setPausado(true);
    clearInterval(timerRef.current);
  };

  const reanudar = () => {
    setPausado(false);
  };

  const detener = () => {
    if (window.confirm("¿Deseas detener la rutina actual?")) {
      setEnCurso(false);
      registrarSesion(false);
    }
  };

  if (!rutina || ejercicios.length === 0) return <p>Cargando rutina...</p>;
  const actualE = ejercicios[actual];

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🏋️ Ejecutando: {rutina.nombre}</h2>

      {enCurso ? (
        <>
          <h3>Ejercicio: {actualE.ejercicio}</h3>
          <p>⏳ Tiempo restante: {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, "0")}</p>
          <p>✅ Tiempo acumulado: {acumulado} min</p>

          <div style={{ marginTop: "1rem" }}>
            {pausado ? (
              <button onClick={reanudar}>▶️ Reanudar</button>
            ) : (
              <button onClick={pausar}>⏸ Pausar</button>
            )}
            <button onClick={detener} style={{ marginLeft: "1rem" }}>🛑 Detener</button>
          </div>
        </>
      ) : (
        <h3>🏁 Rutina finalizada</h3>
      )}
    </main>
  );
}
