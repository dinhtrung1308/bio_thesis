import logo from "../../assets/img/login1.svg";
import { Divider, Radio, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
import "./login.css";
import { TextField, Button } from "@mui/material";
import { AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  let navigate = useNavigate();
  function navigateToDetail() {
    navigate("signal");
  }
  function navigateToSignUp() {
    navigate("signup");
  }
  return (
    <div className="login1-container">
      <img src={logo} className="login1-img"/>
      <div className="login1-form">
        <div className="login1-form-title">
          <Typography
          style={{ color: "#D8F0FC", fontSize: 56, fontWeight: "bold" }}>
            Đăng nhập
          </Typography>
        </div>
        <div className="login-form-body">
          <div className="login-form-body-account">
            <div className="login1-form-body-account-input">
              <Typography 
              style={{ color: "#D8F0FC", fontSize: 28, fontWeight: 700, marginBottom: "0.25rem" }}>
                SĐT
              </Typography>
              <TextField
              fullWidth
              type="text"
              placeholder="0917778485"
              style={{
                backgroundColor: "hsla(244, 16%, 92%, .6)",
                borderRadius: "8px",
                border: "1px solid #fff",
                transition: "border 0.4s"
              }}/>
                <Typography
                style={{ color: "#D8F0FC", fontSize: 28, fontWeight: 700, marginBottom: "0.25rem" }}>
                    Mật khẩu
                </Typography>

              <div className="login1-box">
                <TextField
                fullWidth  
                type="password"
                placeholder="************"
                style={{
                  backgroundColor: "hsla(244, 16%, 92%, .6)",
                  borderRadius: "8px",
                  border: "1px solid #fff",
                  transition: "border 0.4s",
                }}/>
                <AiOutlineEyeInvisible 
                style={{
                  width: "max-content",
                  height: "max-content",
                  position: "absolute",
                  right: "0.75rem",
                  top: 0,
                  bottom: 0,
                  margin: "auto 0",
                  fontSize: "1.25rem",
                  cursor: "pointer"
                }}
                />
              </div>
            </div>

            <Button
              variant="contained"
              size="large"
              onClick={navigateToDetail}
              style={{
                backgroundColor: "rgba(255, 52, 78, 0.75)",
                borderRadius: "40px",
                padding: "14px 2rem",
                width: "100%",
                color: "#fff",
                fontSize: "small",
                fontWeight: "bold",
                boxShadow: "0 6px 24px #F0A2A4",
                marginBottom: "1rem",
                cursor: "pointer"
              }}
            >
              Đăng nhập
            </Button>
            <div className="login-form-body-account-extra"></div>
          </div>

          <div className="login-form-body-account">
            <Typography
            style={{ color: "rgba(0, 0, 0, 0.25)", fontSize: "18px" }}>
              Bạn đã có tài khoản chưa?{" "}
              <span 
              style={{ color: "rgba(255, 52, 78, 0.75)", cursor: "pointer" }}
              onClick={navigateToSignUp}>
                Đăng ký
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
