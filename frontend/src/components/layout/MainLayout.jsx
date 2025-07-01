import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => (
  <>
    <Header />
    <main className="">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
