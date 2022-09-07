import bluetoothIcon from "../../assets/img/bluetoothicon.svg";
import {
  ContainerOutlined,
  ReconciliationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useState, useEffect } from "react";
import "./App.css";
import { Space, Typography } from "antd";
import { Col, Row } from "antd";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ref, onValue, push, update, remove } from "firebase/database";
// import database from '@react-native-firebase/database';
import { db } from "../../firebase-config.js";
const { Text, Link } = Typography;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Home", "1", <PieChartOutlined />),
  getItem("History", "2", <ReconciliationOutlined />),
  getItem("Family", "3", <UsergroupAddOutlined />),
];
let options = {
  filters: [
    { services: ["heart_rate"] },
    { services: [0x1802, 0x1803] },
    { services: ["c48e6067-5295-48d3-8d5c-0395f61792b1"] },
    { name: "ExampleName" },
    { namePrefix: "Prefix" },
  ],
  optionalServices: ["battery_service"],
};

const Signal = () => {
  const [collapsed, setCollapsed] = useState(true);
  let navigate = useNavigate();
  const [data, setData] = useState({
    Signal1: 0,
    Signal2: 0,
    Signal3: 0,
  });
  useEffect(() => {
    return onValue(
      ref(db, "/UsersData/tbtz8pfqGzfks9jL9iEKz151OVp1"),
      (querySnapShot) => {
        let data = querySnapShot.val() || {};
        let todoItems = { ...data };
        setData(todoItems);
      }
    );
  }, []);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  function navigateToTab2(e) {
    if (e.key === "2") {
      navigate("/history");
    } else if (e.key === "3") {
      navigate("/relatives");
    }
  }

  return (
    <div className="signal-layout">
      <div
        style={{
          width: "max-content",
          minHeight: "100vh",
          backgroundColor: "#001529",
        }}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          onClick={(e) => {
            navigateToTab2(e);
          }}
        />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            marginBottom: "20px",
          }}
        >
          <Text strong>Hello, Thu Phuong</Text>
        </div>
        <div className="container">
          <Button className="pulse-button" shape="circle">
            <img
              src={bluetoothIcon}
              className="bluetooth-logo"
              alt="logo"
              style={{
                width: "60px",
                height: "60px",
              }}
            />
          </Button>
          <Button
            onClick={() => {
              navigator.bluetooth
                .requestDevice({ acceptAllDevices: true })
                .then((device) => {
                  console.log(device);
                });
            }}
          >
            Find Devices
          </Button>
        </div>
        <div
          style={{
            margin: "30px 10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card
            bordered={false}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              minWidth: 200,
            }}
          >
            <p>SYS: {data.Signal1}</p>
            <p>DIA: {data.Signal2}</p>
            <p>Heart rate: {data.Signal3}</p>
          </Card>
          <Button
            style={{ width: "40%", margin: "20px auto" }}
            type="primary"
            size="small"
          >
            Calculate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signal;
