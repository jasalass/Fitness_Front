import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Historial from "./pages/Historial";
import EjecutarRutina from "./pages/EjecutarRutina";
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {user && (
          <>
            <Route
              path="/"
              element={
                <Layout user={user}>
                  <Dashboard user={user} />
                </Layout>
              }
            />
            <Route
              path="/historial"
              element={
                <Layout user={user}>
                  <Historial />
                </Layout>
              }
            />
            <Route
              path="/rutina/:rutinaId"
              element={
                <Layout user={user}>
                  <EjecutarRutina />
                </Layout>
              }
            />
          </>
        )}

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
