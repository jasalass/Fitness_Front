import CrearRutina from "../components/CrearRutina";
import SemanaView from "../components/SemanaView";
import { supabase } from "../supabaseClient";
import { useState } from "react";

export default function Dashboard({ user }) {
  const [refrescar, setRefrescar] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div>
      <h1>Bienvenido, {user.email}</h1>
      <button onClick={logout}>Cerrar sesión</button>
      <CrearRutina userId={user.id} onRutinaCreada={() => setRefrescar(!refrescar)} />
      <SemanaView userId={user.id} key={refrescar} />
    </div>
  );
}
