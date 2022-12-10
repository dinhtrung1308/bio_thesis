import {
  ContainerOutlined,
  ReconciliationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../../assets/img/logo.png";
import { Button, Menu } from "antd";
import React, { useState } from "react";
import "./relative.css";
import {
  Space,
  Typography,
  DatePicker,
  List,
  Skeleton,
  Avatar,
  Modal,
  InputNumber,
} from "antd";
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
import { NavLink,useNavigate } from "react-router-dom";

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

let activeLink = "link active";
let normalLink = "link";

// const items = [
//   getItem("Home", "1", <PieChartOutlined />),
//   getItem("History", "2", <ReconciliationOutlined />),
//   getItem("Family", "3", <UsergroupAddOutlined />),
// ];

const menuItems = [
  {
    text: "Dashboard",
    path: "/signal",
    icon: <PieChartOutlined />
  },
  {
    text: "History",
    path: "/history",
    icon: <ReconciliationOutlined />
  },
  {
    text: "Relatives",
    path: "/relatives",
    icon: <UsergroupAddOutlined />
  }
]

const list = [
  {
    name: {
      last: "Phuong",
    },
    role: "daughter",
  },
  {
    name: {
      last: "Phuong",
    },
    role: "daughter",
  },
  {
    name: {
      last: "Phuong",
    },
    role: "daughter",
  },
];
const records = [
  {
    id: "1",
    date: "08/04/2022",
    hour: "10:19",
    status: "Normal",
    sys: 136,
    dia: 78,
    heartrate: 83,
  },
  {
    id: "2",
    date: "09/04/2022",
    hour: "10:31",
    status: "Normal",
    sys: 113,
    dia: 60,
    heartrate: 83,
  },
  {
    id: "3",
    date: "09/04/2022",
    hour: "15:20",
    status: "Normal",
    sys: 119,
    dia: 68,
    heartrate: 83,
  },
  {
    id: "4",
    date: "09/04/2022",
    hour: "16:42",
    status: "Normal",
    sys: 125,
    dia: 71,
  },
  {
    id: "5",
    date: "10/04/2022",
    hour: "09:30",
    status: "Normal",
    sys: 116,
    dia: 70,
    heartrate: 83,
  },
  {
    id: "6",
    date: "10/04/2022",
    hour: "10:17",
    status: "Normal",
    sys: 111,
    dia: 65,
  },
  {
    id: "7",
    date: "10/04/2022",
    hour: "14:01",
    status: "Normal",
    sys: 112,
    dia: 63,
    heartrate: 83,
  },
  {
    id: "8",
    date: "10/04/2022",
    hour: "14:59",
    status: "Normal",
    sys: 142,
    dia: 72,
  },
  {
    id: "9",
    date: "11/04/2022",
    hour: "09:42",
    status: "Normal",
    sys: 112,
    dia: 62,
    heartrate: 83,
  },
  {
    id: "10",
    date: "11/04/2022",
    hour: "10:16",
    status: "Normal",
    sys: 106,
    dia: 59,
    heartrate: 83,
  },
  {
    id: "11",
    date: "11/04/2022",
    hour: "10:40",
    status: "Normal",
    sys: 105,
    dia: 58,
    heartrate: 83,
  },
  {
    id: "12",
    date: "11/04/2022",
    hour: "14:44",
    status: "Normal",
    sys: 123,
    dia: 61,
  },
  {
    id: "13",
    date: "11/04/2022",
    hour: "16:18",
    status: "Normal",
    sys: 111,
    dia: 68,
    heartrate: 83,
  },
  {
    id: "14",
    date: "12/04/2022",
    hour: "01:22",
    status: "Normal",
    sys: 113,
    dia: 64,
    heartrate: 83,
  },
  {
    id: "15",
    date: "11/04/2022",
    hour: "15:58",
    status: "Normal",
    sys: 125,
    dia: 72,
    heartrate: 83,
  },
];
const Relatives = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  let navigate = useNavigate();

  function showModal() {
    setIsModalOpen(true);
  }

  const handleOk = () => {
    list.push(...{ name: "Trung", phoneNumber: phoneNumber });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative-layout">
      {/* Sidebar */}
      <div className={collapsed? "sidebar-container" :"sidebar-container close"}>
        <div className="top">
          <div className="logoDiv">
            <div className="logo-img">
              <img src={logo} alt="logo"/>
            </div>
            <div className="logo-text">
              <span className="name">BioThesis</span>
              <span className="application">Application</span>
            </div>
          </div>
          <button onClick={() =>setCollapsed(!collapsed)} className={collapsed? "toggle toggle-in" : "toggle toggle-out"}>
              <span></span>
              <span></span>
              <span></span>
          </button>
        </div>

        <div className="menu">
            <div className="top-content">
              {menuItems.map((item, index) => (
                  <NavLink to={item.path} key={index} className={({ isActive }) => isActive ? activeLink : normalLink}>
                      <div className="icon">{item.icon}</div>
                      <div className="text">{item.text}</div>
                  </NavLink>
              ))}
            </div>

            <div className="bottom-content" >
              <NavLink to="/logout" className="link logout">
                  <div className="icon"><LogoutOutlined /></div>
                  <div className="text">Log Out</div>
              </NavLink>
            </div>
        </div>
        
      </div>

      {/* Content */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginTop: "10px", marginLeft: "10px" }}>
          <Title level={2}>Family</Title>
          <Button
            style={{ float: "right", marginRight: "10px" }}
            type="primary"
            onClick={showModal}
          >
            Add +
          </Button>
          <Modal
            title="Find member"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Phone Number :</p>
            <InputNumber
              addonBefore={<UserOutlined />}
              style={{ width: "100%" }}
              onChange={(e) => {
                setPhoneNumber(e);
              }}
            />
          </Modal>
        </div>
        <Divider />
        {/* <div style={{ marginTop: "10px", marginLeft: "10px", width: "80%" }}>
          <RangePicker
            onFocus={(e) => {
              console.log(e);
            }}
          />
        </div> */}
        <div style={{ marginTop: "10px", marginLeft: "10px", width: "85%" }}>
          <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => (
              <List.Item actions={[<a key="list-loadmore-edit"></a>]}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={item.picture?.large} />}
                    title={item.name?.last}
                    description={item.role}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Relatives;
