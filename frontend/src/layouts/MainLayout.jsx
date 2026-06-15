import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

import "./MainLayout.css"

const MainLayout = () => {

  return (

    <div className="layout">

      <Sidebar />

      <div className="main-content">

        <Header />

        <div className="page-content">

          <Outlet />

        </div>

      </div>

    </div>

  );

};

export default MainLayout;