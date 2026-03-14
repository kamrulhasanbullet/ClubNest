import { Outlet } from "react-router";
import { Footer } from "../pages/shared/Footer/Footer";

export const MainLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};
