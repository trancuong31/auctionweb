import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import NavBar from "./NavBar";

const MainLayout = () => (
  <>
    <Header />
    <NavBar />
    <main className="md:px-4 max-w-[1800px] mx-auto p-5">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
