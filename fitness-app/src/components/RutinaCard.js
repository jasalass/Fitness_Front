import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RutinaCard({ rutina, onIniciar, onEditar, onEliminar }) {
  const nav = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '1rem',
        marginTop: '1rem',
        backgroundColor: '#fff',
        boxShadow: hover
          ? '0 6px 12px rgba(0, 200, 160, 0.15)'
          : '0 2px 5px rgba(0, 0, 0, 0.05)',
        transform: hover ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <strong style={{ color: '#222', fontSize: '1.1rem' }}>{rutina.nombre}</strong>
      <p style={{ margin: '0.5rem 0', fontSize: '0.95rem', color: '#555' }}>
        {rutina.descripcion || 'Sin descripción'}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginTop: '0.5rem',
        }}
      >
        <button
          onClick={() => nav(`/rutina/${rutina.id}`)}
          style={{
            backgroundColor: '#00c8a0',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 0.8rem',
            borderRadius: '6px',
            cursor: 'pointer',
            flex: '1',
            transition: 'background 0.3s ease',
          }}
        >
          ▶️ Iniciar
        </button>

        <button
          onClick={() => onEditar(rutina)}
          style={{
            backgroundColor: '#ffc107',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 0.8rem',
            borderRadius: '6px',
            cursor: 'pointer',
            flex: '1',
            transition: 'background 0.3s ease',
          }}
        >
          ✏️ Editar
        </button>

        <button
          onClick={() => onEliminar(rutina.id)}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 0.8rem',
            borderRadius: '6px',
            cursor: 'pointer',
            flex: '1',
            transition: 'background 0.3s ease',
          }}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}
