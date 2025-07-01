import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => (
  <>
    <Header />
    <main className="px-4 md:px-8">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
