import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ user, children }) {
  return (
    <>
      <Navbar user={user} />
      <main style={{ padding: "2rem" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
