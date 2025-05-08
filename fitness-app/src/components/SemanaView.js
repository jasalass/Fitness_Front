import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import RutinaCard from './RutinaCard';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

export default function SemanaView({ userId }) {
  const [rutinasPorDia, setRutinasPorDia] = useState({});

  useEffect(() => {
    const cargarRutinas = async () => {
      const { data, error } = await supabase
        .from('rutinas')
        .select('*')
        .eq('usuario_id', userId);

      if (error) {
        console.error('Error cargando rutinas:', error);
        return;
      }

      const agrupadas = {};
      diasSemana.forEach((dia) => (agrupadas[dia] = []));
      data.forEach((rutina) => {
        const dia = rutina.dia_semana || 'Lunes';
        if (!agrupadas[dia]) agrupadas[dia] = [];
        agrupadas[dia].push(rutina);
      });

      setRutinasPorDia(agrupadas);
    };

    if (userId) {
      cargarRutinas();
    }
  }, [userId]);

  const iniciarRutina = (rutina) => {
    alert(`Iniciando rutina: ${rutina.nombre}`);
  };

  const editarRutina = (rutina) => {
    alert(`Editar rutina: ${rutina.nombre}`);
  };

  const eliminarRutina = async (id) => {
    if (!window.confirm('¿Eliminar esta rutina?')) return;
    const { error } = await supabase.from('rutinas').delete().eq('id', id);
    if (error) alert('Error eliminando rutina');
    else {
      setRutinasPorDia((prev) => {
        const actualizado = { ...prev };
        for (const dia in actualizado) {
          actualizado[dia] = actualizado[dia].filter((r) => r.id !== id);
        }
        return actualizado;
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      marginTop: '2rem',
      justifyContent: 'center'
    }}>
      {diasSemana.map((dia) => (
        <div
          key={dia}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '1rem',
            minWidth: '250px',
            width: 'calc(100% / 3 - 2rem)',
            boxShadow: '0 2px 8px rgba(0, 200, 160, 0.1)',
            transition: 'transform 0.2s',
          }}
        >
          <h3 style={{ color: '#00c8a0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{dia}</h3>
          {(rutinasPorDia[dia] || []).length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#999' }}>Sin rutinas asignadas</p>
          ) : (
            rutinasPorDia[dia].map((rutina) => (
              <RutinaCard
                key={rutina.id}
                rutina={rutina}
                onIniciar={iniciarRutina}
                onEditar={editarRutina}
                onEliminar={eliminarRutina}
              />
            ))
          )}
        </div>
      ))}
    </div>
  );
}
