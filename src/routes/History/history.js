import {
  ContainerOutlined,
  ReconciliationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useState } from "react";
import "./App.css";
import { Space, Typography, DatePicker, List } from "antd";
import { Col, Row } from "antd";
import { Card } from "antd";
import { Divider } from "antd";

import { useNavigate } from "react-router-dom";

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

const items = [
  getItem("Home", "1", <PieChartOutlined />),
  getItem("History", "2", <ReconciliationOutlined />),
  getItem("Family", "3", <UsergroupAddOutlined />),
];
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
const History = () => {
  const [collapsed, setCollapsed] = useState(true);
  let navigate = useNavigate();

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
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginTop: "10px", marginLeft: "10px" }}>
          <Title level={2}>History</Title>
        </div>
        <Divider />
        <div style={{ marginTop: "10px", marginLeft: "10px", width: "80%" }}>
          <RangePicker
            onFocus={(e) => {
              console.log(e);
            }}
          />
        </div>
        <div style={{ marginTop: "10px", marginLeft: "10px", width: "85%" }}>
          <List
            grid={{
              gutter: 16,
              column: 1,
            }}
            dataSource={records}
            renderItem={(item) => (
              <List.Item>
                <Card>
                  <Meta title={item.date} description={item.hour} />
                  <Divider></Divider>
                  <p>SYS: {item.sys}</p>
                  <p>DIA: {item.dia}</p>
                  <p>Heart rate: {item.heartrate}</p>

                  <p>Status: {item.status}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default History;
