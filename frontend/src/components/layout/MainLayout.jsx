import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import NavBar from "./NavBar";
const MainLayout = () => (
  <>
    <Header />
    <NavBar />
    <main className="px-4 md:px-8">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
