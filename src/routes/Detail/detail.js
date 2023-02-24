import logo from "../../assets/img/logo.png";
import {
  ReconciliationOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import { Button, Menu, Select, Timeline, Input, Modal } from "antd";
import {
  HeartFilled,
  InfoCircleFilled,
  ExclamationCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import "./detail.css";
import { Space, Typography } from "antd";
import { Col, Row, Image } from "antd";
import { Card } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { ref, onValue, push, update, remove } from "firebase/database";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
// import database from '@react-native-firebase/database';
import { db, db2 } from "../../firebase-config.js";
import useWindowDimensions from "../../hook/useWindowHook";
import informationImage from "../../assets/img/user.png";
import Title from "antd/lib/skeleton/Title";
import { ToastContainer, toast } from "react-toastify";
import { PREDICT_API } from "../../api/index";
import "react-toastify/dist/ReactToastify.css";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";

toast.configure();
const { Text, Link } = Typography;
const { Option } = Select;
function checkCondition(sys, dia) {
  if (sys <= 90 || dia <= 60) return "Huyết Áp Thấp";
  else if (sys <= 120 || dia <= 80) return "Huyết Áp Bình Thường";
  else if (sys > 120 || dia > 80) return " Cao Huyết Áp";
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const Detail = () => {
  const [details, setDetails] = useState([]);

  const [collapsed, setCollapsed] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  let navigate = useNavigate();

  let activeLink = "link active";
  let normalLink = "link";

  function navigateToTab2(e) {
    if (e.key === "2") {
      navigate("/history");
    } else if (e.key === "3") {
      navigate("/relatives");
    }
  }
  const handleUpdateDetail = () => {
    const user = JSON.parse(sessionStorage.getItem("account"));

    const docRef = doc(db2, "accounts", user.id);

    const data = {
      age: age || "",
      height: height || "",
      weight: weight || "",
      gender: gender || "",
    };

    updateDoc(docRef, data)
      .then((docRef) => {
        toast.success("Chỉnh sửa thông tin thành công!", { autoClose: 1000 });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("account"));
    const historyCollectionRef = collection(db2, "accounts");
    const q = query(
      historyCollectionRef,
      where("username", "==", user.username)
    );
    const getUserDetail = async () => {
      const data = await getDocs(q);
      const tempData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(tempData);
      if (data) {
        setDetails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setAge(tempData[0]?.age || "");
        setGender(tempData[0]?.gender || "");
        setHeight(tempData[0]?.height || "");
        setWeight(tempData[0]?.weight || "");

        return;
      }
      setDetails([]);
    };

    getUserDetail();
  }, []);

  return (
    <div className="signal-layout">
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
            <NavLink to="/detail" className="link logout">
              <div className="icon">
                <SettingOutlined />
              </div>
              <div className="text">Cài đặt</div>
            </NavLink>
            <NavLink to="/" className="link logout">
              <div className="icon">
                <LogoutOutlined />
              </div>
              <div className="text">Thoát</div>
            </NavLink>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Row style={{ marginBottom: "40px", padding: "4rem 10rem" }}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Typography.Title level={2}> Thông tin cá nhân</Typography.Title>
          </Col>
          <Col xs={12} sm={12} md={24} lg={24}>
            <Card
              bordered={true}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                marginBottom: "20px",
                borderRadius: " 40px",
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
                    gap: 40,
                  }}
                >
                  <Image width={300} src={informationImage} />
                </div>
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
                    <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                      Email :
                    </Typography>
                    <Typography style={{ fontSize: 20 }}>
                      {details[0]?.email || "Mặc định"}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                      SĐT :
                    </Typography>
                    <Typography style={{ fontSize: 20 }}>
                      {details[0]?.username || "Mặc định"}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                      Chiều cao :
                    </Typography>
                    {/* <Typography style={{ fontSize: 20 }}>
                      {details[0]?.height || "Mặc định"}
                    </Typography> */}
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <EditText
                        style={{ fontSize: 20 }}
                        name="height"
                        // defaultValue={"Mặc định"}
                        value={height || "Mặc định"}
                        onChange={(e) => setHeight(e.target.value)}
                        onSave={handleUpdateDetail}
                      />
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#23395d",
                        }}
                      >
                        cm
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                      Cân nặng :
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <EditText
                        style={{ fontSize: 20 }}
                        name="weight"
                        value={weight || "Mặc định"}
                        onChange={(e) => setWeight(e.target.value)}
                        onSave={handleUpdateDetail}
                      />
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#23395d",
                        }}
                      >
                        kg
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                      Tuổi :
                    </Typography>
                    <EditText
                      style={{ fontSize: 20 }}
                      name="age"
                      value={age || "Mặc định"}
                      onChange={(e) => setAge(e.target.value)}
                      onSave={handleUpdateDetail}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                      Giới tính :
                    </Typography>
                    <EditText
                      style={{ fontSize: 20 }}
                      name="gender"
                      value={gender || "Mặc định"}
                      onChange={(e) => setGender(e.target.value)}
                      onSave={handleUpdateDetail}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Detail;
