import logo from "../../assets/img/login1.svg";
import { Divider, Radio, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
import "./login.css";
import { TextField, Button, Alert } from "@mui/material";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { db, db2 } from "../../firebase-config.js";

toast.configure();

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const checkLogin = async () => {
    const historyCollectionRef = collection(db2, "accounts");
    const q = query(
      historyCollectionRef,
      where("username", "==", username),
      where("password", "==", password)
    );

    const result = await getDocs(q);
    if (!result.docs.length) {
      toast.error("Login Failed!", { autoClose: 1000 });
    } else {
      toast.success("Login Successful!", { autoClose: 1000 });
      navigate("signal");
    }
  };
  function navigateToDetail() {
    navigate("signal");
  }
  function navigateToSignUp() {
    navigate("signup");
  }
  return (
    <div className="login1-container">
      <img src={logo} className="login1-img" />
      <div className="login1-form">
        <div className="login1-form-title">
          <Typography
            style={{ color: "#1F67B1", fontSize: 56, fontWeight: "bold" }}
          >
            Đăng nhập
          </Typography>
        </div>
        <div className="login-form-body">
          <div className="login-form-body-account">
            <div className="login1-form-body-account-input">
              <Typography
                style={{
                  color: "#1F67B1",
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                }}
              >
                SĐT
              </Typography>
              <TextField
                fullWidth
                type="text"
                placeholder=""
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.37)",
                  borderRadius: "10px",
                  border: "none",
                  transition: "border 0.4s",
                }}
              />
              <Typography
                style={{
                  color: "#1F67B1",
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: "0.25rem",
                }}
              >
                Mật khẩu
              </Typography>

              <div className="login1-box">
                <TextField
                  fullWidth
                  type="password"
                  placeholder=""
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.37)",
                    borderRadius: "10px",
                    border: "none",
                    transition: "border 0.4s",
                  }}
                />
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
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            <Button
              variant="contained"
              size="large"
              onClick={checkLogin}
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
                cursor: "pointer",
              }}
            >
              Đăng nhập
            </Button>
            <div className="login-form-body-account-extra"></div>
          </div>

          <div className="login-form-body-account">
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
