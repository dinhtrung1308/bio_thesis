import background from "../../assets/img/register.svg";
import { Divider, Radio, Typography } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  TreeSelect,
  Cascader,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
import SVGComponent from "./image.js";
import "./signup.css";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";

// import database from '@react-native-firebase/database';
import { db, db2 } from "../../firebase-config.js";
import { autocompleteClasses } from "@mui/material";
const SERVICE_ID = "service_6wo00kt";
const TEMPLATE_ID = "template_0kivkjr";
const PUBLIC_KEY = "Xj3O_cTCszKa2rLkp";

function SignUp() {
  const [componentSize, setComponentSize] = useState("large");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  let navigate = useNavigate();
  const handleSubmitEmail = (username, email, password) => {
    const templateParams = {
      username: username,
      email: email,
      password: password,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        navigate("/");
        setUserName("");
        setEmail("");
        setPassword("");
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );
  };
  const addUser = () => {
    addDoc(collection(db2, "accounts"), {
      username: username,
      timestamp: serverTimestamp(),
      password: password,
      email: email,
    }).then(handleSubmitEmail(username, email, password));
  };

  return (
    <div className="signup-container">
      <img src={background} className="signup-img" />
      <div className="signup-form">
        <div className="signup-form-title">
          <Typography 
          style={{ color: "#1F67B1", fontSize: 56, fontWeight: "bold" }}>
            Tạo tài khoản
          </Typography>
        </div>
        <div className="signup-form-body">
          <Form
            name="register"
            layout="vertical"
            onFinish={addUser}
          >

            {/* SĐT */}
            <Form.Item
              label="SĐT"
              name="sdt"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
              style={{
                rowGap: "0.75rem",
                margin: "1rem 5%",
              }}
            >
              <Input
                size="large"
                placeholder="SĐT"
                prefix={<UserOutlined className="site-form-item-icon" />}
                style={{ 
                  borderRadius: "10px",
                  border:"none", 
                  height: 50 }}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
              style={{
                rowGap: "0.75rem",
                margin: "1rem 5%",
              }}
            >
              <Input
                size="large"
                placeholder="Email"
                prefix={<MailOutlined className="site-form-item-icon" />}
                style={{ 
                  borderRadius: "10px",
                  border:"none", 
                  height: 50 }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
              style={{
                rowGap: "0.75rem",
                margin: "1rem 5%",
              }}
            >
              <Input
                size="large"
                placeholder="Mật khẩu"
                prefix={<LockOutlined className="site-form-item-icon" />}
                style={{ 
                  borderRadius: "10px",
                  border:"none", 
                  height: 50 }}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Item>

            {/* Button */}
            <Form.Item>
              <Button
                className="signup-button"
                style={{ 
                  backgroundColor: "rgba(255, 52, 78, 0.75)",
                  borderRadius: "40px",
                  padding: "14px 2rem",
                  border: "none",
                  width: "100%",
                  color: "#fff",
                  height: 50,
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "1rem",
                  boxShadow: "0 6px 24px #F0A2A4",
                }}
                htmlType="submit"
              >
                Đăng ký
              </Button>
            </Form.Item>
            <Form.Item>
              <Typography style={{ 
                color: "rgba(0, 0, 0, 0.25)", 
                fontSize: "18px",
              }}>
                Đã có tài khoản ? <a style={{ color: "rgba(255, 52, 78, 0.75)", cursor: "pointer" }} onClick={() => navigate("/")}>Đăng Nhập</a>
              </Typography>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
