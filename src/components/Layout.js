import { Outlet, Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "./Footer";
import Welcome from "./Welcome";

const Layout = () => {
  return (
    <main className="App">
      <Nav />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
