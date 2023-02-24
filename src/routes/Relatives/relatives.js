import {
  ContainerOutlined,
  ReconciliationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../../assets/img/logo.png";
import { Button, Menu } from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import "./relative.css";
import { Space, Typography, DatePicker, Avatar, Modal } from "antd";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  withTheme,
} from "@mui/material";

import { Col, Row } from "antd";
import { Divider, Input, Card } from "antd";
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
import { ToastContainer, toast } from "react-toastify";
import { db, db2 } from "../../firebase-config.js";

import { NavLink, useNavigate } from "react-router-dom";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";

Chart.register(...registerables);
toast.configure();

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Meta } = Card;
const { Search } = Input;

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
    text: "Chẩn đoán",
    path: "/signal",
    icon: <PieChartOutlined />,
  },
  {
    text: "Lịch sử",
    path: "/history",
    icon: <ReconciliationOutlined />,
  },
  {
    text: "Người thân",
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

const Relatives = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [record, setRecord] = useState([]);
  const [friendsRecord, setFriendsRecord] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRelativeModalOpen, setIsRelativeModalOpen] = useState(false);
  const [historyMeasurement, setHistoryMeasurement] = useState([]);
  const [modalData, setModalData] = useState({});
  const [nickname, setNickname] = useState('');

  let navigate = useNavigate();
  const historyCollectionRef = collection(db2, "friends");
  const user = JSON.parse(sessionStorage.getItem("account"));
  const q = query(historyCollectionRef, where("user_id", "==", user?.username));
  const history = collection(db2, "history");

  const historyQuery = query(
    history,
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
    const getMeasurements = async () => {
      const data = await getDocs(historyQuery);
      setHistoryMeasurement(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) || []);
    };

    getMeasurements();
  }, []);
  
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(q);
      setFriendsRecord(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  const showModalAddFriends = () => {
    setIsModalOpen(true);
  };
  const handleCloseRelativeDetail = () => {
    setIsRelativeModalOpen(false);
  };

  const calculateAverage = (data, properties) =>{
    let sums = {};
  for (let property of properties) {
    sums[property] = 0;
  }

  for (let i = 0; i < data.length; i++) {
    for (let property of properties) {
      sums[property] += Number(data[i][property]);
    }
  }

  let avg = {};
  for (let property of properties) {
    avg[property] = sums[property] / data.length;
  }

  return avg;
  };

  const handleOpenRelativeDetail = (e,relativeId, nickname) => {
    setNickname(nickname);
    const filterData = historyMeasurement?.filter(x => x.uid === relativeId);
    const averageData = filterData.length !== 0 ? calculateAverage(filterData, ['sys','dia','heart_rate']) : {};

    setModalData(() => averageData);

    setIsRelativeModalOpen(true);
  };
  const handleAddFriends = async () => {
    if (record.length) {
      const friendsCollectionRef = collection(db2, "friends");
      const user = JSON.parse(sessionStorage.getItem("account"));
      const result = await addDoc(friendsCollectionRef, {
        user_id: user.username,
        nickname: record[0].email,
        phone_number: record[0].username,
        role: "mặc định",
      });
      toast.success("Thêm bạn thành công!", { autoClose: 1000 });
      setIsModalOpen(false);
      return;
    }
    setIsModalOpen(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const onSearch = async (value) => {
    const db = collection(db2, "accounts");

    const queryFriends = query(db, where("username", "==", value));
    const data = await getDocs(queryFriends);
    setRecord(() => data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const handleUpdateRole = (e, id) => {
    // const user = JSON.parse(sessionStorage.getItem("account"));
   
    const docRef = doc(db2, "friends", id);

    const data = {
      role: e.value,
    };

    updateDoc(docRef, data)
      .then((docRef) => {
        toast.success("Chỉnh sửa mối quan hệ thành công!", { autoClose: 1000 });
      })
      .catch((error) => {
        console.log(error);
      });
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
            <NavLink to="/" className="link logout">
              <div className="icon">
                <LogoutOutlined />
              </div>
              <div className="text">Thoát</div>
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
        <div
          style={{
            margin: "30px 30px auto auto",
          }}
        >
          <Button
            size="large"
            type="primary"
            style={{
              borderRadius: "25px",
              fontWeight: "bold",
              fontSize: 16,
            }}
            onClick={showModalAddFriends}
          >
            Thêm bạn bè
          </Button>
        </div>
        <Divider />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
          }}
        >
          <Typography.Title level={2}> Danh sách bạn bè</Typography.Title>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 72,
              width: "100%",
              alignItems: "flex-start",
              marginTop: 20,
            }}
          >
            {!!friendsRecord?.length &&
              friendsRecord?.map((item) => (
                <div
                  key={item.id}
                  style={{
                    marginBottom: "95px",
                    // marginLeft: "10px",
                    width: "320px",
                    height: "240px",
                    // boxShadow: "rgb(0 0 0 / 35%) 0px 5px 15px",
                    padding: "20px",
                    borderRadius: "40px",
                    background: "#EAF2F6",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 20,
                  }}
                  onClick={(e) => handleOpenRelativeDetail(e,item.phone_number, item.nickname.charAt(0).toUpperCase())}
                >
                  <Avatar
                    size={90}
                    style={{
                      color: "#f56a00",
                      backgroundColor: "#fde3cf",
                      fontSize: 40,
                    }}
                  >
                    {item.nickname.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <div
                      style={{
                        width: 170,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: "bold",
                          width: 100,
                          fontSize: 16,
                        }}
                      >
                        SĐT:
                      </Typography>
                      <Typography
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {item.phone_number}
                      </Typography>
                    </div>
                    <div
                      style={{
                        width: 170,
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: "bold",
                          width: 100,
                          fontSize: 16,
                        }}
                      >
                        Mối quan hệ:
                      </Typography>
                      {/* <Typography
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {item.role}
                      </Typography> */}
                      <div onClick={(e) => e.stopPropagation()}>
                      <EditText
                        style={{ fontSize: 16, margin: 0, padding: 0 }}
                        name="role"
                        defaultValue={item.role}
                        // value={height || "Mặc định"}
                        // onChange={(e) => setHeight(e.target.value)}
                        onSave={(e) => handleUpdateRole(e, item.id)}
                      />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Modal
        title="Tìm kiếm bằng SĐT"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button type="primary" onClick={handleAddFriends}>
            Thêm
          </Button>,
        ]}
      >
        <Search
          placeholder="Nhập số điện thoại"
          allowClear
          onSearch={onSearch}
          style={{ width: 200 }}
        />
        <Divider></Divider>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {!!record.length ? (
            <div>
              <TableContainer>
                <Table sx={{ minWidth: 472 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>SĐT</TableCell>
                      <TableCell align="right">Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {record[0]?.username}
                      </TableCell>
                      <TableCell align="right">{record[0]?.email}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div>
              <Typography>Chưa có tài khoản phù hợp</Typography>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        title="20/02/2023"
        open={isRelativeModalOpen}
        footer={null}
        onCancel={handleCloseRelativeDetail}
      >
        {Object.keys(modalData).length === 0  ? (
          <div>
          <Typography>Không có dữ liệu người dùng</Typography>
          </div>
        ) : (<div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 40,
            alignItems: "center",
          }}
        >
          <Avatar
            size={90}
            style={{
              color: "#f56a00",
              backgroundColor: "#fde3cf",
              fontSize: 40,
            }}
          >
            {nickname}
          </Avatar>
          <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 150,
                  fontSize: 16,
                }}
              >
                SYS:
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 200,
                  fontSize: 16,
                }}
              >
                {Math.round(modalData.sys)}
              </Typography>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 150,
                  fontSize: 16,
                }}
              >
                DIA:
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 200,
                  fontSize: 16,
                }}
              >
                {Math.round(modalData.dia)}
              </Typography>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 150,
                  fontSize: 16,
                }}
              >
                Nhịp tim:
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 200,
                  fontSize: 16,
                }}
              >
                {Math.round(modalData.heart_rate)}
              </Typography>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 150,
                  fontSize: 16,
                }}
              >
                Trạng thái:
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  width: 200,
                  fontSize: 16,
                }}
              >
                {checkCondition(Math.round(modalData.sys), Math.round(modalData.dia))}
              </Typography>
            </div>
          </div>
        </div>)}
        
      </Modal>
    </div>
  );
};

export default Relatives;
