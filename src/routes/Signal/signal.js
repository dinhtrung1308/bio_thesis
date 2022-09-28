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
import { Button, Menu, Select, Timeline, Input } from "antd";
import React, { useState, useEffect } from "react";
import "./App.css";
import { Space, Typography } from "antd";
import { Col, Row } from "antd";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ref, onValue, push, update, remove } from "firebase/database";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import database from '@react-native-firebase/database';
import { db, db2 } from "../../firebase-config.js";
const { Text, Link } = Typography;
const { Option } = Select;

function checkCondition(sys, dia) {
  if (sys <= 90 || dia <= 60) return "Low";
  else if (sys <= 120 || dia <= 80) return "Normal";
  else if (sys > 120 || dia > 80) return " High blood pressure";
}
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
  const [record, setRecord] = useState({
    sys: 0,
    dia: 0,
    heartRate: 0,
    insertAt: "",
  });
  let navigate = useNavigate();
  const [data, setData] = useState({
    Signal1: 0,
    Signal2: 0,
    Signal3: 0,
  });
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const historyCollectionRef = collection(db2, "history");
  const saveRecord = async (data) => {
    await addDoc(historyCollectionRef, {
      dia: data.Signal1,
      sys: data.Signal2,
      heart_rate: data.Signal3,
      insert_at: new Date(),
    });
    console.log(saveRecord);
  };
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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            alignItems: "center",
          }}
        >
          <Card
            bordered={false}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              minWidth: 272,
              maxWidth: 600,
              marginBottom: "20px",
            }}
          >
            <p>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>SYS:</span>{" "}
              <span style={{ fontSize: "18px" }}>{data.Signal1}</span>
            </p>
            <p>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>DIA:</span>{" "}
              <span style={{ fontSize: "18px" }}>{data.Signal2}</span>
            </p>
            <p>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>
                Heart rate:
              </span>{" "}
              <span style={{ fontSize: "18px" }}>{data.Signal3}</span>
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p>
                <span style={{ fontSize: "18px", fontWeight: 800 }}>
                  Status:
                </span>{" "}
                <span
                  style={{
                    height: "10px",
                    width: "10px",
                    fontWeight: "bold",
                    backgroundColor:
                      checkCondition(data.Signal1, data.Signal2) === "Low"
                        ? "#7e22ff"
                        : checkCondition(data.Signal1, data.Signal2) ===
                          "Normal"
                        ? "#a7e519"
                        : "#a7e519",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                ></span>{" "}
                <span
                  style={{
                    color:
                      checkCondition(data.Signal1, data.Signal2) === "Low"
                        ? "#7e22ff"
                        : checkCondition(data.Signal1, data.Signal2) ===
                          "Normal"
                        ? "#a7e519"
                        : "#a7e519",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  {checkCondition(data.Signal1, data.Signal2)}
                </span>
              </p>
            </div>
          </Card>
          <Timeline style={{}}>
            <Timeline.Item>
              <Card
                bordered={false}
                title="Age"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  minWidth: 240,
                  maxWidth: 600,
                }}
              >
                <Input
                  placeholder="Please write your age"
                  name="age"
                  type="number"
                  style={{
                    width: 180,
                  }}
                />
              </Card>
            </Timeline.Item>
            <Timeline.Item>
              <Card
                bordered={false}
                title="Gender"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  minWidth: 240,
                  maxWidth: 600,
                }}
              >
                <Select
                  defaultValue=""
                  style={{
                    width: 180,
                  }}
                  onChange={handleChange}
                >
                  <Option value="" disabled selected hidden>
                    Select Gender
                  </Option>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Card>
            </Timeline.Item>
            <Timeline.Item>
              <Card
                bordered={false}
                title="Condition"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  minWidth: 240,
                  maxWidth: 600,
                }}
              >
                <Select
                  defaultValue="normal"
                  style={{
                    width: 180,
                  }}
                  onChange={handleChange}
                >
                  <Option value="normal">Normal</Option>
                  <Option value="good">Good</Option>
                  <Option value="bad">Bad</Option>
                  <Option value="stressed">Stressed</Option>
                  <Option value="troubleeating">Trouble Eating</Option>
                  <Option value="drunk">Drunk</Option>
                  <Option value="smoked">Smoked</Option>
                </Select>
              </Card>
            </Timeline.Item>
          </Timeline>

          <Button
            style={{ width: "40%", margin: "20px auto", maxWidth: 120 }}
            type="primary"
            size="small"
            onClick={() => {
              console.log(data);
              // setRecord({
              //   dia: data.Signal1,
              //   sys: data.Signal2,
              //   heartRate: data.Signal3,
              //   insertAt: new Date(),
              // });
              saveRecord(data);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signal;
