import React, { Fragment, useState, useContext } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Btn, H4, P } from "../AbstractElements";
import { EmailAddress, Password, RememberPassword, SignIn } from "../Constant";
import { useNavigate } from "react-router-dom";
// import man from "../assets/images/dashboard/profile.png";
import CustomizerContext from "../_helper/Customizer";
import { ToastContainer, toast } from "react-toastify";
import CryptoJS from "crypto-js";
import axiosHttp from "../utils/httpConfig";

const Signin = ({ selected }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { layoutURL } = useContext(CustomizerContext);

  // Encryption key - in production, this should be stored securely
  // and potentially fetched from environment variables
  const ENCRYPTION_KEY = "crypt_algo@01";

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Encrypt the password using CryptoJS
  const encryptPassword = (plainPassword) => {
    return CryptoJS.AES.encrypt(plainPassword, ENCRYPTION_KEY).toString();
  };

  const loginAuth = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Encrypt the password before sending
      const encryptedPassword = encryptPassword(password);

      const response = await axiosHttp.post("/auth/sign-in", {
        email,
        password: encryptedPassword,
      });

      if (response.status === 200) {
        localStorage.setItem("login", JSON.stringify(true));
        localStorage.setItem("token", response?.data?.data?.token);

        // Store user details and permissions for sidebar filtering
        const userData = response?.data?.data || {};
        if (Array.isArray(userData?.role?.permissions))
          localStorage.setItem(
            "permissions",
            JSON.stringify(userData.role.permissions)
          );

        toast.success("Successfully logged in!");
        navigate(`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`);
      } else {
        toast.error(response.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Container fluid={true} className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form" onSubmit={loginAuth}>
                  <H4>
                    {selected === "simpleLogin" ? "" : "Welcome to Admin Panel"}
                  </H4>
                  <P>{"Enter your email & password to login"}</P>
                  <FormGroup>
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </FormGroup>
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">{Password}</Label>
                    <div className="position-relative">
                      <Input
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        type={togglePassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <div
                        className="show-hide"
                        onClick={() => setTogglePassword(!togglePassword)}
                      >
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </FormGroup>
                  <div className="position-relative form-group mb-0">
                    <div className="checkbox">
                      <Input id="checkbox1" type="checkbox" />
                      <Label className="text-muted" for="checkbox1">
                        {RememberPassword}
                      </Label>
                    </div>
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-2",
                        disabled: loading,
                      }}
                    >
                      {loading ? "Signing in..." : SignIn}
                    </Btn>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default Signin;
