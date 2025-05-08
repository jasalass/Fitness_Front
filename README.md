# 🏋️ FitnessApp - Frontend

Este repositorio contiene el **frontend desarrollado en React** de FitnessApp, una aplicación web que permite planificar y registrar rutinas de ejercicio utilizando Supabase como backend.

## 🚀 Demo en producción

👉 [Ver demo desplegada](https://fitnessappdemo.netlify.app/login)

---

## ⚙️ Tecnologías utilizadas

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- HTML + CSS personalizado
- React Router DOM
- REST API con Supabase JS Client

---

## 📂 Estructura del proyecto

```
/src
  /components      → Navbar, RutinaCard, Layout, etc.
  /pages           → Login, Register, Dashboard, EjecutarRutina, Historial
  App.js           → Rutas principales
  supabaseClient.js
/public
  _redirects       → Redirección SPA para Netlify
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_SUPABASE_URL=https://<tu-proyecto>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=ey...
```

---

## 📦 Instalación local

```bash
git clone https://github.com/jasalass/Fitness_Front.git
cd Fitness_Front
npm install
npm run dev
```

---

## 🧪 Usuario de prueba

```
Correo:     usuario@prueba
Contraseña: 123456
```

---

## 📝 Licencia

MIT — libre para fines educativos y demostrativos.
