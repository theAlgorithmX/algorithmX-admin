import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "react-feather";

import { LI, UL, P } from "../../../AbstractElements";
import { Admin, LogOut } from "../../../Constant";

const UserHeader = () => {
  const history = useNavigate();
  const [name, setName] = useState("AlgorithmX");
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));

  useEffect(() => {
    setName(localStorage.getItem("Name") ? localStorage.getItem("Name") : name);
  }, []);

  const Logout = () => {
    localStorage.clear(); // call the method to clear storage
    history(`${process.env.PUBLIC_URL}/login`);
  };

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        {/* <Image
          attrImage={{
            className: "b-r-10 m-0",
            src: `${authenticated ? auth0_profile.picture : profile}`,
            alt: "",
          }}
        /> */}
        <div className="media-body">
          <span>{authenticated ? auth0_profile.name : name}</span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            {Admin} <i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      <UL
        attrUL={{ className: "simple-list profile-dropdown onhover-show-div" }}
      >
        {/* <LI
          attrLI={{
            onClick: () =>
              UserMenuRedirect(
                `${process.env.PUBLIC_URL}/app/users/profile/${layoutURL}`
              ),
          }}
        >
          <User />
          <span>{Account} </span>
        </LI>
        <LI
          attrLI={{
            onClick: () =>
              UserMenuRedirect(
                `${process.env.PUBLIC_URL}/app/email-app/${layoutURL}`
              ),
          }}
        >
          <Mail />
          <span>{Inbox}</span>
        </LI> */}
        {/* <LI
          attrLI={{
            onClick: () =>
              UserMenuRedirect(
                `${process.env.PUBLIC_URL}/app/todo-app/todo/${layoutURL}`
              ),
          }}
        >
          <FileText />
          <span>{Taskboard}</span>
        </LI> */}
        <LI attrLI={{ onClick: Logout }}>
          <LogIn />
          <span>{LogOut}</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
