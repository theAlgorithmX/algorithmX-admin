import React from "react";
import { Link } from "react-router-dom";
import { Image } from "../../AbstractElements";

const SidebarLogo = () => {
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
