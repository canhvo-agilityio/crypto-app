import { Outlet } from "react-router";
import Navbar from "./Navbar";
import BottomTab from "./BottomTab";

const MainLayout = () => {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <BottomTab />
      </div>
      <Outlet />
    </>
  );
};

export default MainLayout;