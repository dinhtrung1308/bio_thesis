import logo from "../../assets/img/login.jpg";
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
import "./App.css";
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
    <div className="signup__container">
      <div className="form">
        <div className="form__left">
          <SVGComponent style={{ maxWidth: "300px" }} />
          <div className="form__left-title">
            <Typography style={{ color: "#FF344EBF" }}>
              Tạo tài khoản
            </Typography>
          </div>
        </div>
        <div className="form__right">
          <Form
            layout="horizontal"
            size="large"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onFinish={addUser}
          >
            <Form.Item
              name="sdt"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <Input
                size="large"
                placeholder="SĐT"
                prefix={<UserOutlined />}
                style={{ borderRadius: "30px", height: 50 }}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <Input
                size="large"
                placeholder="Email"
                prefix={<MailOutlined />}
                style={{ borderRadius: "30px", height: 50 }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <Input
                size="large"
                placeholder="Mật khẩu"
                prefix={<LockOutlined />}
                style={{ borderRadius: "30px", height: 50 }}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ borderRadius: "30px", height: 50, width: 120 }}
                danger
                htmlType="submit"
              >
                Đăng ký
              </Button>
            </Form.Item>
            <Form.Item>
              <Typography style={{ color: "#fff", fontSize: "20px" }}>
                Đã có tài khoản ? <a onClick={() => navigate("/")}>Đăng Nhập</a>
              </Typography>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
