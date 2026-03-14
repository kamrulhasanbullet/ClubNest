import { NavBar } from "../pages/shared/NavBar/NavBar";
import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};