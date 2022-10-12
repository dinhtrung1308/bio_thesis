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
import { Button, Menu, Select, Timeline, Input, Modal } from "antd";
import {
  HeartFilled,
  InfoCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import "./App.css";
import { Space, Typography } from "antd";
import { Col, Row, Image } from "antd";
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
import useWindowDimensions from "../../hook/useWindowHook";
import informationImage from "../../assets/img/information.png";
import Title from "antd/lib/skeleton/Title";
const { Text, Link } = Typography;
const { Option } = Select;
function checkCondition(sys, dia) {
  if (sys <= 90 || dia <= 60) return "Low Blood Pressure";
  else if (sys <= 120 || dia <= 80) return "Normal Blood Pressure";
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
const { confirm } = Modal;

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
  const [isRender, setRender] = useState(false);
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
  const { height, width } = useWindowDimensions();
  console.log(height, width);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const isResult = sessionStorage.getItem("isResult");

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
  const showConfirm = (data) => {
    confirm({
      title: "Do you want to save?",
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        saveRecord(data);
      },
      onCancel() {},
    });
  };

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
        {width < 750 && (
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
                        checkCondition(data.Signal2, data.Signal1) ===
                        "Low Blood Pressure"
                          ? "#7e22ff"
                          : checkCondition(data.Signal2, data.Signal1) ===
                            "Normal Blood Pressure"
                          ? "#a7e519"
                          : "#EE2727",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  ></span>{" "}
                  <span
                    style={{
                      color:
                        checkCondition(data.Signal2, data.Signal1) ===
                        "Low Blood Pressure"
                          ? "#7e22ff"
                          : checkCondition(data.Signal2, data.Signal1) ===
                            "Normal Blood Pressure"
                          ? "#a7e519"
                          : "#a7e519",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    {checkCondition(data.Signal2, data.Signal1)}
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
        )}
        {width >= 750 && (
          <Row style={{ marginBottom: "40px", padding: "4rem 10rem" }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Typography.Title level={2}> User profile</Typography.Title>
            </Col>
            <Col xs={12} sm={12} md={24} lg={24}>
              <Card
                bordered={true}
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  marginBottom: "20px",
                  borderRadius: " 40px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "30px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "68px",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Age :</Typography>
                      <Input
                        placeholder="Please write your age"
                        name="age"
                        type="number"
                        style={{
                          width: 180,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "45px",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Gender :</Typography>
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
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Condition :</Typography>

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
                    </div>
                  </div>
                  <div>
                    <Image width={200} src={informationImage} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Typography.Title level={2}> Statistics</Typography.Title>
            </Col>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <Col xs={9} sm={9} md={9} lg={9}>
                <Card
                  bordered={true}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    marginBottom: "20px",
                    borderRadius: " 30px",
                    height: "250px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "unset",
                        gap: "20px ",
                      }}
                    >
                      <HeartFilled
                        style={{
                          color: "#FA3B3B",
                          fontSize: "30px",
                        }}
                      />
                      <Typography.Title level={4}>
                        {" "}
                        Heart rate:
                      </Typography.Title>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <Typography.Title
                        level={1}
                        style={{
                          color: "#EA1F1F",
                          fontWeight: "800",
                          fontSize: "100px",
                        }}
                      >
                        {data.Signal3}
                      </Typography.Title>
                      <Typography.Title
                        level={5}
                        style={{ color: "#EA1F1F", fontWeight: "800" }}
                      >
                        (bpm)
                      </Typography.Title>
                    </div>
                  </div>
                </Card>
              </Col>
              {/* <Col xs={4} sm={4} md={4} lg={4}></Col> */}
              <Col xs={9} sm={9} md={9} lg={9}>
                <Card
                  className="info-card"
                  bordered={true}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    marginBottom: "20px",
                    borderRadius: " 30px",
                    height: "250px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "20px ",
                      }}
                    >
                      <Typography.Title level={4}> SYS:</Typography.Title>
                      <Typography.Title level={1}>
                        {data.Signal1}
                      </Typography.Title>
                      <Typography.Title level={4}>{"mmHg"}</Typography.Title>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: "20px ",
                      }}
                    >
                      <Typography.Title level={4}> DIA:</Typography.Title>
                      <Typography.Title level={1}>
                        {data.Signal2}
                      </Typography.Title>
                      <Typography.Title level={4}>{"mmHg"}</Typography.Title>
                    </div>
                  </div>
                </Card>
              </Col>
            </div>

            {/* <Col xs={1} sm={1} md={1} lg={1}></Col> */}

            <Button
              style={{
                width: "40%",
                margin: "5rem auto",
                height: "100px",
                borderRadius: "40px",
                color: "#1890ff",
                borderColor: "#1890ff",

                fontSize: "24px",
              }}
              size="large"
              onClick={() => {
                sessionStorage.setItem("isResult", true);
                setRender(true);
                // setRecord({
                //   dia: data.Signal1,
                //   sys: data.Signal2,
                //   heartRate: data.Signal3,
                //   insertAt: new Date(),
                // });
                // saveRecord(data);
                // showConfirm(data);
              }}
            >
              Diagnose
            </Button>
            {isResult && (
              <>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Typography.Title level={2}> Result</Typography.Title>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card
                    bordered={true}
                    style={{
                      width: "60%",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      marginBottom: "20px",
                      borderRadius: " 30px",
                      height: "250px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "40px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: " space-around",
                          alignItems: "baseline",
                          width: "100%",
                          gap: "20px ",
                        }}
                      >
                        {/* <SmileTwoTone style={{ fontSize: "30px" }} /> */}
                        <Typography.Title level={2}> Status:</Typography.Title>
                        <InfoCircleFilled style={{ fontSize: "20px" }} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            height: "10px",
                            width: "10px",
                            fontWeight: "bold",
                            backgroundColor:
                              checkCondition(data.Signal2, data.Signal1) ===
                              "Low Blood Pressure"
                                ? "#7e22ff"
                                : checkCondition(data.Signal2, data.Signal1) ===
                                  "Normal Blood Pressure"
                                ? "#a7e519"
                                : "#EE2727",
                            borderRadius: "50%",
                            display: "inline-block",
                          }}
                        ></span>{" "}
                        <span
                          style={{
                            color:
                              checkCondition(data.Signal2, data.Signal1) ===
                              "Low Blood Pressure"
                                ? "#7e22ff"
                                : checkCondition(data.Signal2, data.Signal1) ===
                                  "Normal Blood Pressure"
                                ? "#a7e519"
                                : "#EE2727",
                            fontWeight: "bold",
                            fontSize: "40px",
                          }}
                        >
                          {checkCondition(data.Signal2, data.Signal1)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Button
                  style={{
                    width: "40%",
                    margin: "20px auto",
                    maxWidth: 240,
                    height: "100px",
                    borderRadius: "40px",
                    fontSize: "26px",
                  }}
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
                    // saveRecord(data);
                    showConfirm(data);
                  }}
                >
                  Save
                </Button>
              </>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Signal;
