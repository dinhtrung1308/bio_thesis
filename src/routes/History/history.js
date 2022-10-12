import {
  ContainerOutlined,
  ReconciliationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import "./App.css";
import { Space, Typography, DatePicker, List } from "antd";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

import { Col, Row } from "antd";
import { Card } from "antd";
import { Divider } from "antd";
import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, db2 } from "../../firebase-config.js";

import { useNavigate } from "react-router-dom";
Chart.register(...registerables);

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Meta } = Card;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
function checkCondition(sys, dia) {
  if (sys <= 90 || dia <= 60) return "Low Blood Pressure";
  else if (sys <= 120 || dia <= 80) return "Normal Blood Pressure";
  else if (sys > 120 || dia > 80) return " High Blood Pressure";
}

const items = [
  getItem("Home", "1", <PieChartOutlined />),
  getItem("History", "2", <ReconciliationOutlined />),
  getItem("Family", "3", <UsergroupAddOutlined />),
];
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Time series",
    },
  },
};
const data = [
  {
    title: "Title 1",
  },
  {
    title: "Title 2",
  },
  {
    title: "Title 3",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
  {
    title: "Title 4",
  },
];
const labels = [
  "23:42:48",
  "23:46:16",
  "00:13:23",
  "20:03:41",
  "20:04:45",
  "22:22:55",
];

const data2 = {
  labels,
  datasets: [
    {
      label: "SYS",
      data: [123, 123, 123, 123, 60, 60],
      borderColor: "rgb(126, 229, 0)",
      backgroundColor: "rgba(126, 229, 0, 0.5)",
    },
    {
      label: "DIA",
      data: [91, 91, 12, 75, 85, 85],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "Heart rate",
      data: [43, 43, 43, 43, 43, 43],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};
const records = [
  {
    id: "1",
    date: "08/04/2022",
    hour: "10:19",
    status: "Normal Blood Pressure",
    sys: 136,
    dia: 78,
    heartrate: 83,
  },
  {
    id: "2",
    date: "09/04/2022",
    hour: "10:31",
    status: "Normal Blood Pressure",
    sys: 113,
    dia: 60,
    heartrate: 83,
  },
  {
    id: "3",
    date: "09/04/2022",
    hour: "15:20",
    status: "Normal Blood Pressure",
    sys: 119,
    dia: 68,
    heartrate: 83,
  },
  {
    id: "4",
    date: "09/04/2022",
    hour: "16:42",
    status: "Normal Blood Pressure",
    sys: 125,
    dia: 71,
  },
  {
    id: "5",
    date: "10/04/2022",
    hour: "09:30",
    status: "Normal Blood Pressure",
    sys: 116,
    dia: 70,
    heartrate: 83,
  },
  {
    id: "6",
    date: "10/04/2022",
    hour: "10:17",
    status: "Normal Blood Pressure",
    sys: 111,
    dia: 65,
  },
  {
    id: "7",
    date: "10/04/2022",
    hour: "14:01",
    status: "Normal Blood Pressure",
    sys: 112,
    dia: 63,
    heartrate: 83,
  },
  {
    id: "8",
    date: "10/04/2022",
    hour: "14:59",
    status: "Normal Blood Pressure",
    sys: 142,
    dia: 72,
  },
  {
    id: "9",
    date: "11/04/2022",
    hour: "09:42",
    status: "Normal Blood Pressure",
    sys: 112,
    dia: 62,
    heartrate: 83,
  },
  {
    id: "10",
    date: "11/04/2022",
    hour: "10:16",
    status: "Normal Blood Pressure",
    sys: 106,
    dia: 59,
    heartrate: 83,
  },
  {
    id: "11",
    date: "11/04/2022",
    hour: "10:40",
    status: "Normal Blood Pressure",
    sys: 105,
    dia: 58,
    heartrate: 83,
  },
  {
    id: "12",
    date: "11/04/2022",
    hour: "14:44",
    status: "Normal Blood Pressure",
    sys: 123,
    dia: 61,
  },
  {
    id: "13",
    date: "11/04/2022",
    hour: "16:18",
    status: "Normal Blood Pressure",
    sys: 111,
    dia: 68,
    heartrate: 83,
  },
  {
    id: "14",
    date: "12/04/2022",
    hour: "01:22",
    status: "Normal Blood Pressure",
    sys: 113,
    dia: 64,
    heartrate: 83,
  },
  {
    id: "15",
    date: "11/04/2022",
    hour: "15:58",
    status: "Normal Blood Pressure",
    sys: 125,
    dia: 72,
    heartrate: 83,
  },
];
const History = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [record, setRecord] = useState([]);

  let navigate = useNavigate();
  const historyCollectionRef = collection(db2, "history");
  const q = query(historyCollectionRef, orderBy("insert_at", "desc"));

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(q);
      setRecord(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  function navigateToTab2(e) {
    if (e.key === "1") {
      navigate("/signal");
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
          defaultSelectedKeys={["2"]}
          defaultOpenKeys={["sub2"]}
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
          alignItems: "center",
        }}
      >
        <div style={{ marginTop: "10px", marginLeft: "10px" }}>
          <Title level={2}>History</Title>
        </div>
        <Divider />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography.Title level={2} style={{ width: "80%" }}>
            {" "}
            Time-series Chart
          </Typography.Title>

          <div
            style={{
              marginTop: "10px",
              marginLeft: "10px",
              width: "80%",
              minWidth: "300px",
              boxShadow: "rgb(0 0 0 / 35%) 0px 5px 15px",
              padding: "40px",
              borderRadius: "40px",
            }}
          >
            <Line options={options} data={data2} />
          </div>

          <Typography.Title
            level={2}
            style={{
              width: "80%",
              marginTop: "4rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {" "}
            Records
            <RangePicker
              onFocus={(e) => {
                console.log(e);
              }}
            />
          </Typography.Title>
          <div style={{ marginTop: "30px", marginLeft: "10px", width: "85%" }}>
            <List
              grid={{
                gutter: 16,
                column: 1,
              }}
              dataSource={record}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{
                      boxShadow: "rgb(0 0 0 / 35%) 0px 5px 15px",
                      borderRadius: "40px",
                    }}
                  >
                    <Meta
                      title={moment
                        .unix(item.insert_at.seconds)
                        .format("DD/MM/YYYY")}
                      description={moment
                        .unix(item.insert_at.seconds)
                        .format("HH:mm:ss")}
                    />
                    <Divider></Divider>
                    <div
                      style={{
                        display: "flex",
                        gap: "10rem",
                      }}
                    >
                      <div style={{ display: "flex", gap: " 50px" }}>
                        <p style={{ fontSize: "18px" }}>
                          Heart rate:{" "}
                          <span style={{ fontWeight: 900 }}>
                            {" "}
                            {item.heart_rate}{" "}
                          </span>
                          {"bpm"}
                        </p>

                        <p style={{ fontSize: "18px" }}>
                          SYS:{" "}
                          <span style={{ fontWeight: 900 }}>{item.sys}</span>{" "}
                          {"mmHg"}
                        </p>
                        <p style={{ fontSize: "18px" }}>
                          DIA:{" "}
                          <span style={{ fontWeight: 900 }}>{item.dia}</span>{" "}
                          {"mmHg"}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: "18px" }}>
                          Status:{" "}
                          <span
                            style={{
                              color:
                                checkCondition(item.sys, item.dia) ===
                                "Low Blood Pressure"
                                  ? "#7e22ff"
                                  : checkCondition(item.sys, item.dia) ===
                                    "Normal Blood Pressure"
                                  ? "#a7e519"
                                  : "#EE2727",
                              fontWeight: "bold",
                            }}
                          >
                            {console.log(checkCondition(item.sys, item.dia))}
                            {checkCondition(item.sys, item.dia)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
