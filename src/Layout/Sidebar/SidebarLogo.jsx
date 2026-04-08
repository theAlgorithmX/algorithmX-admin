import React, { useContext } from "react";
import { Grid } from "react-feather";
import { Link } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";
import { Image } from "../../AbstractElements";
import CubaIcon from "../../assets/images/logo/logo.png";

const SidebarLogo = () => {
  const { mixLayout, toggleSidebar, toggleIcon, layout, layoutURL } =
    useContext(CustomizerContext);

  const openCloseSidebar = () => {
    toggleSidebar(!toggleIcon);
  };

  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  return (
    <div className="logo-wrapper">
      <Link to="/dashboard/default/Dubai">
        {" "}
        {/* 👈 Add your desired URL here */}
        <Image
          attrImage={{
            className: "img-fluid d-inline h-[50px] w-[50px] mb-[5px]",
            src: `${process.env.PUBLIC_URL}/images/logo5.webp`,
            alt: "AlgorithmX logo",
          }}
        />
      </Link>
      {/* <div className="back-btn" onClick={() => openCloseSidebar()}>
        <i className="fa fa-angle-left"></i>
      </div>
      <div className="toggle-sidebar" onClick={openCloseSidebar}>
        <Grid className="status_toggle middle sidebar-toggle" />
      </div> */}
    </div>
  );
};

export default SidebarLogo;
