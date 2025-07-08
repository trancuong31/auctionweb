import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import NavBar from "./NavBar";
const MainLayout = () => (
  <>
    <Header />
    <NavBar />
    <main className="md:px-8 max-w-[2000px] mx-auto p-10">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
