import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosHttp from "../utils/httpConfig";

const PrivateRoute = () => {
  const [login] = useState(JSON.parse(localStorage.getItem("login")));
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthenticated(JSON.parse(localStorage.getItem("authenticated")));
    localStorage.setItem("authenticated", authenticated);
    localStorage.setItem("login", login);

    const token = localStorage.getItem("token");
    const permissionsRaw = localStorage.getItem("permissions");

    // If no token, enforce clean logout to avoid half-signed-in state
    if (!token) {
      localStorage.removeItem("login");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("permissions");
      return;
    }

    // If token exists but permissions missing, try to bootstrap from API
    if (token && !permissionsRaw) {
      (async () => {
        try {
          const res = await axiosHttp.get("/auth/me");
          const userData = res?.data?.data || {};
          const perms = Array.isArray(userData?.role?.permissions)
            ? userData.role.permissions
            : [];
          if (perms.length) {
            localStorage.setItem("permissions", JSON.stringify(perms));
          }
        } catch (err) {
          // On failure (e.g., expired token), force logout and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("login");
          localStorage.removeItem("authenticated");
          localStorage.removeItem("permissions");
          navigate(`${process.env.PUBLIC_URL}/login`, { replace: true });
        }
      })();
    }
  }, []);
  return login || authenticated ? (
    <Outlet />
  ) : (
    <Navigate exact to={`${process.env.PUBLIC_URL}/login`} />
  );
};

export default PrivateRoute;
