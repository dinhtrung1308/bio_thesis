import {
  ContainerOutlined,
  ReconciliationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import logo from "../../assets/img/logo.png";
import { Button, Menu } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import "./history.css";
import { Space, Typography, DatePicker, List, Modal } from "antd";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  withTheme,
} from "@mui/material";

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
  where,
} from "firebase/firestore";
import { db, db2 } from "../../firebase-config.js";

import { NavLink, useNavigate } from "react-router-dom";
Chart.register(...registerables);

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Meta } = Card;

const currentDate = moment().format("DD-MM-YYYY").split("-");
const currentDay = currentDate[0];
const currentMonth = currentDate[1];
const currentYear = currentDate[2];

let activeLink = "link active";
let normalLink = "link";

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
  if (sys <= 90 || dia <= 60) return "Huyết Áp Thấp";
  else if (sys <= 120 || dia <= 80) return "Huyết Áp Bình Thường";
  else if (sys > 120 || dia > 80) return " Huyết Áp Cao";
}
function convertArrayToDays(data) {
  let labels = [];

  for (let i = 0; i < data.length; i++) {
    labels.push(moment.unix(data[i]?.insert_at.seconds).format("HH:mm:ss"));
  }
  return labels;
}
function convertArrayToSYS(data) {
  let sys = [];

  for (let i = 0; i < data.length; i++) {
    sys.push(data[i].sys);
  }
  return sys;
}
function convertArrayToDIA(data) {
  let dia = [];

  for (let i = 0; i < data.length; i++) {
    dia.push(data[i].dia);
  }
  return dia;
}
function convertArrayToHeartRate(data) {
  let heart_rate = [];

  for (let i = 0; i < data.length; i++) {
    heart_rate.push(data[i].heart_rate);
  }
  return heart_rate;
}
function calculateAverageSYS(data) {
  let sum = 0;
  let avg = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Number(data[i].sys);
  }
  avg = sum / data.length;
  return avg;
}
function calculateAverageDIA(data) {
  let sum = 0;
  let avg = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Number(data[i].dia);
  }
  avg = sum / data.length;
  return avg;
}
function calculateAverageHeartRate(data) {
  let sum = 0;
  let avg = 0;
  for (let i = 0; i < data.length; i++) {
    sum += Number(data[i].heart_rate);
  }
  avg = sum / data.length;
  return avg;
}

const menuItems = [
  {
    text: "Dashboard",
    path: "/signal",
    icon: <PieChartOutlined />,
  },
  {
    text: "History",
    path: "/history",
    icon: <ReconciliationOutlined />,
  },
  {
    text: "Relatives",
    path: "/relatives",
    icon: <UsergroupAddOutlined />,
  },
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

const History = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [record, setRecord] = useState([]);
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();
  const historyCollectionRef = collection(db2, "history");
  const q = query(
    historyCollectionRef,
    where(
      "insert_at",
      ">=",
      new Date(`${currentYear}-${currentMonth}-${currentDay}`)
    ),
    where(
      "insert_at",
      "<=",
      new Date(`${currentYear}-${currentMonth}-${parseInt(currentDay) + 1}`)
    ),
    orderBy("insert_at", "desc")
  );

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(q);
      console.log(data);
      setRecord(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) || []);
    };

    getUsers();
  }, []);

  const showDetail = () => {
    setOpen(!open);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="history-layout">
      {/* Sidebar */}
      <div
        className={collapsed ? "sidebar-container" : "sidebar-container close"}
      >
        <div className="top">
          <div className="logoDiv">
            <div className="logo-img">
              <img src={logo} alt="logo" />
            </div>
            <div className="logo-text">
              <span className="name">BioThesis</span>
              <span className="application">Application</span>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={collapsed ? "toggle toggle-in" : "toggle toggle-out"}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="menu">
          <div className="top-content">
            {menuItems.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <div className="icon">{item.icon}</div>
                <div className="text">{item.text}</div>
              </NavLink>
            ))}
          </div>

          <div className="bottom-content">
            <NavLink to="/detail" className="link">
              <div className="icon">
                <SettingOutlined />
              </div>
              <div className="text">Setting</div>
            </NavLink>
            <NavLink to="/" className="link logout">
              <div className="icon">
                <LogoutOutlined />
              </div>
              <div className="text">Log Out</div>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "20px",
        }}
      >
        <div style={{ marginTop: "10px", marginLeft: "10px" }}>
          <Title level={2}>Lịch Sử</Title>
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
            Biểu đồ theo thời gian
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
              background: "white",
            }}
          >
            <Line
              options={options}
              data={{
                labels: convertArrayToDays(record),
                datasets: [
                  {
                    label: "SYS",
                    data: convertArrayToSYS(record),
                    borderColor: "rgb(126, 229, 0)",
                    backgroundColor: "rgba(126, 229, 0, 0.5)",
                  },
                  {
                    label: "DIA",
                    data: convertArrayToDIA(record),
                    borderColor: "rgb(53, 162, 235)",
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                  },
                  {
                    label: "Heart rate",
                    data: convertArrayToHeartRate(record),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
            />
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
            Số liệu trung bình
            {/* <RangePicker
              onFocus={(e) => {
                console.log(e);
              }}
            /> */}
          </Typography.Title>
          <div style={{ marginTop: "30px", marginLeft: "10px", width: "85%" }}>
            <Card
              style={{
                boxShadow: "rgb(0 0 0 / 35%) 0px 5px 15px",
                borderRadius: "40px",
              }}
              onClick={showDetail}
            >
              <Meta
                title={moment
                  .unix(record[0]?.insert_at.seconds)
                  .format("DD/MM/YYYY")}
              />
              <Divider></Divider>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2rem",
                }}
              >
                <div style={{ display: "flex", gap: " 50px" }}>
                  <p style={{ fontSize: "18px" }}>
                    Nhịp tim:{" "}
                    <span style={{ fontWeight: 900 }}>
                      {" "}
                      {Math.round(calculateAverageHeartRate(record))}{" "}
                    </span>
                    {"bpm"}
                  </p>

                  <p style={{ fontSize: "18px" }}>
                    SYS:{" "}
                    <span style={{ fontWeight: 900 }}>
                      {Math.round(calculateAverageSYS(record))}
                    </span>{" "}
                    {"mmHg"}
                  </p>
                  <p style={{ fontSize: "18px" }}>
                    DIA:{" "}
                    <span style={{ fontWeight: 900 }}>
                      {Math.round(calculateAverageDIA(record))}
                    </span>{" "}
                    {"mmHg"}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "18px" }}>
                    Trạng thái gần nhất:{" "}
                    <span
                      style={{
                        color:
                          checkCondition(
                            calculateAverageSYS(record),
                            calculateAverageDIA(record)
                          ) === "Huyết Áp Thấp"
                            ? "#7e22ff"
                            : checkCondition(
                                calculateAverageSYS(record),
                                calculateAverageDIA(record)
                              ) === "Huyết Áp Bình Thường"
                            ? "#a7e519"
                            : "#EE2727",
                        fontWeight: "bold",
                      }}
                    >
                      {record?.[0]?.condition}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "18px" }}>
                    Số lần đo:{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {record.length}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        title="Chi tiết"
        open={open}
        footer={null}
        width={900}
        onCancel={handleCancel}
      >
        <TableContainer component={Paper} style={{ height: 500 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell align="right">Nhịp tim</TableCell>
                <TableCell align="right">SYS&nbsp;(mmHg)</TableCell>
                <TableCell align="right">DIA&nbsp;(mmHg)</TableCell>
                <TableCell align="right">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {moment.unix(item.insert_at.seconds).format("HH:mm:ss")}
                  </TableCell>
                  <TableCell align="right">{item.heart_rate}</TableCell>
                  <TableCell align="right">{item.sys}</TableCell>
                  <TableCell align="right">{item.dia}</TableCell>
                  <TableCell align="right">
                    {checkCondition(item.sys, item.dia)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </div>
  );
};

export default History;
