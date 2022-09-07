import logo from "../../assets/img/login.jpg";
import { Divider, Radio, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";
import "./App.css";

function Login() {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  let navigate = useNavigate();
  function navigateToDetail() {
    console.log("abc");
    navigate("signal");
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <body>
        {/* <div className="login-title">
          <Typography.Title level={1} style={{ margin: 0, color: "#FF5D5C" }}>
            BIOTHESIS
          </Typography.Title>
        </div> */}
        <div className="login-form">
          <Typography.Title
            level={1}
            style={{ margin: 0, color: "#EF362F", fontWeight: "bold" }}
          >
            BIOTHESIS
          </Typography.Title>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                size={"large"}
                style={{ padding: "0 25px" }}
                onClick={() => {
                  console.log("abc");
                }}
              >
                Login
              </Button>
              <Button danger size="large">
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </body>
      <footer>Copyright by @Thu Phuong</footer>
    </div>
  );
}

export default Login;
