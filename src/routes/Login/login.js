import logo from "../../assets/img/login.jpg";
import { Divider, Radio, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
import "./login.css";
import { TextField, Button } from "@mui/material";

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
    <div className="login-container">
      <div className="login-form">
        <div className="login-form-title">
          <Typography
            style={{ color: "#D8F0FC", fontSize: 56, fontWeight: "bold" }}
          >
            Đăng nhập
          </Typography>
        </div>
        <div
          className="login-form-body"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            className="login-form-body-account"
            style={{
              display: "flex",
              gap: 40,
              flexDirection: "column",
            }}
          >
            <div
              style={{ display: "flex", gap: 5, flexDirection: "column" }}
              className="login-form-body-account-input"
            >
              <Typography
                style={{ color: "#D8F0FC", fontSize: 28, fontWeight: 700 }}
              >
                SĐT
              </Typography>
              <TextField
                fullWidth
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "#fff",
                }}
              />
              <Typography
                style={{ color: "#D8F0FC", fontSize: 28, fontWeight: 700 }}
              >
                Mật khẩu
              </Typography>
              <TextField
                fullWidth
                type="password"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "#fff",
                }}
              />
            </div>

            <Button
              fullWidth
              variant="contained"
              style={{
                backgroundColor: "rgba(255, 52, 78, 0.75)",
                borderRadius: 40,
              }}
              size="large"
              onClick={navigateToDetail}
            >
              Đăng nhập
            </Button>
            <div className="login-form-body-account-extra"></div>
          </div>

          <div
            style={{ width: "fit-content", margin: "0 auto" }}
            className="login-form-body-account"
          >
            <Typography
              style={{ color: "rgba(0, 0, 0, 0.25)", fontSize: "18px" }}
            >
              Bạn đã có tài khoản chưa?{" "}
              <span
                style={{ color: "rgba(255, 52, 78, 0.75)", cursor: "pointer" }}
                onClick={navigateToSignUp}
              >
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
