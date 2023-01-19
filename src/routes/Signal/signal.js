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
import "./signal.css";
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
} from "firebase/firestore";
// import database from '@react-native-firebase/database';
import { db, db2 } from "../../firebase-config.js";
import useWindowDimensions from "../../hook/useWindowHook";
import informationImage from "../../assets/img/information.png";
import Title from "antd/lib/skeleton/Title";
import { ToastContainer, toast } from "react-toastify";
import { PREDICT_API } from "../../api/index";
import "react-toastify/dist/ReactToastify.css";

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
async function createAnalyzeObject(obj) {
  return fetch(`${PREDICT_API}`, {
    method: "POST",
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  }).then((response) => response.json());
  // .then((data) => {
  //   console.log("Success:", data);
  // })
  // .catch((error) => {
  //   console.error("Error:", error);
  // });
}

const Signal = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [hei, setHei] = useState("");
  const [weight, setWeight] = useState("");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [heartrate, setHeartrate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [resultStatus, setResultStatus] = useState("");

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
  const handleChangeGender = (value) => {
    console.log(value);
    setGender(value);
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

  let activeLink = "link active";
  let normalLink = "link";

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

  const handleAnalyze = async () => {
    const analyzeObject = await createAnalyzeObject({
      gender,
      age,
      weight,
      hei,
      sys,
      dia,
      heartrate,
    });
    console.log(analyzeObject);
    if (analyzeObject.disease !== null) {
      toast.success("Chẩn đoán thành công!", { autoClose: 1000 });
      setOpenDialog(true);
      setResultStatus(analyzeObject.disease);
    } else {
      toast.error("Chẩn đoán không thành công!", { autoClose: 1000 });
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(!openDialog);
  };
  const handleSaveStatus = async () => {
    const result = await addDoc(historyCollectionRef, {
      dia: dia,
      sys: sys,
      heart_rate: heartrate,
      condition: resultStatus,
      insert_at: new Date(),
    });
    toast.success("Lưu thành công!", { autoClose: 1000 });
    setOpenDialog(false);
  };

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
              <div className="text">Log Out</div>
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
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* <div
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            marginBottom: "20px",
          }}
        >
          <Text strong>Xin Chào, Thu Phương</Text>
        </div> */}
        {/* <div className="container">
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
            Tìm Thiết Bị
          </Button>
        </div> */}
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
                        "Huyết Áp Thấp"
                          ? "#7e22ff"
                          : checkCondition(data.Signal2, data.Signal1) ===
                            "Huyết Áp Bình Thường"
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
                        "Huyết Áp Thấp"
                          ? "#7e22ff"
                          : checkCondition(data.Signal2, data.Signal1) ===
                            "Huyết Áp Bình Thường"
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
                  >
                    <Option value="">Select Gender</Option>
                    <Option value="1">Male</Option>
                    <Option value="0">Female</Option>
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
                    onChange={handleChangeGender}
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
              <Typography.Title level={2}> Hồ sơ cá nhân</Typography.Title>
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
                    justifyContent: "space-evenly",
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
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "100px",
                      }}
                    >
                      <Typography style={{ fontSize: 20 }}>Tuổi :</Typography>
                      <Input
                        placeholder="Vui lòng nhập tuổi"
                        name="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        style={{
                          width: 180,
                        }}
                        required
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
                      <Typography style={{ fontSize: 20 }}>
                        Giới tính :
                      </Typography>
                      <Select
                        defaultValue=""
                        style={{
                          width: 180,
                        }}
                        onChange={handleChangeGender}
                        required
                      >
                        <Option value="" disabled selected hidden>
                          Chọn Giới Tính
                        </Option>
                        <Option value="1">Nam</Option>
                        <Option value="0">Nữ</Option>
                      </Select>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontSize: 20 }}>
                        Chiều cao :
                      </Typography>
                      <Input
                        placeholder="Vui lòng nhập chiều cao"
                        name="hei"
                        type="number"
                        value={hei}
                        onChange={(e) => setHei(e.target.value)}
                        style={{
                          width: 180,
                        }}
                        required
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
                      <Typography style={{ fontSize: 20 }}>
                        Cân nặng :
                      </Typography>
                      <Input
                        placeholder="Vui lòng nhập cân nặng"
                        name="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        style={{
                          width: 180,
                        }}
                        required
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
                        SYS :
                      </Typography>
                      <Input
                        placeholder="Vui lòng nhập sys"
                        name="sys"
                        type="number"
                        value={sys}
                        onChange={(e) => setSys(e.target.value)}
                        style={{
                          width: 180,
                        }}
                        required
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                        DIA :
                      </Typography>
                      <Input
                        placeholder="Vui lòng nhập dia"
                        name="dia"
                        value={dia}
                        onChange={(e) => setDia(e.target.value)}
                        type="number"
                        style={{
                          width: 180,
                        }}
                        required
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                        Nhịp tim :
                      </Typography>
                      <Input
                        placeholder="Vui lòng nhập nhịp tim"
                        name="heartrate"
                        value={heartrate}
                        onChange={(e) => setHeartrate(e.target.value)}
                        type="number"
                        style={{
                          width: 180,
                        }}
                        required
                      />
                    </div>
                    {/* <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography>Tình trạng :</Typography>

                      <Select
                        defaultValue="normal"
                        style={{
                          width: 180,
                        }}
                        onChange={handleChange}
                      >
                        <Option value="normal">Bình Thường</Option>
                        <Option value="good">Tốt</Option>
                        <Option value="bad">Không Khỏe</Option>
                        <Option value="stressed">Căng Thẳng</Option>
                        <Option value="troubleeating">Khó Ăn</Option>
                        <Option value="drunk">Say Xỉn</Option>
                        <Option value="smoked">Hút Thuốc</Option>
                      </Select>
                    </div> */}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "40px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "flex-start",
                      }}
                    >
                      <Typography style={{fontWeight: "thin" }}>
                        &nbsp;
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
                      <Typography style={{fontWeight: "thin" }}>
                        &nbsp;
                      </Typography>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "flex-start",
                      }}
                    >
                      <Typography style={{fontWeight: "thin" }}>
                        cm
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
                      <Typography style={{fontWeight: "thin" }}>
                        kg
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
                      <Typography style={{fontWeight: "thin" }}>
                        mmHg
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
                      <Typography style={{fontWeight: "thin" }}>
                        mmHg
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
                      <Typography style={{fontWeight: "thin" }}>
                        bpm
                      </Typography>
                    </div>
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 40,
                    }}
                  >
                    <Image width={300} src={informationImage} />
                    <Button
                      size="large"
                      style={{
                        height: 60,
                        borderRadius: "40px",
                        color: "#1890ff",
                        borderColor: "#1890ff",
                        fontSize: 28,
                      }}
                      onClick={handleAnalyze}
                    >
                      Chẩn đoán
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
            {/* <Col xs={24} sm={24} md={24} lg={24}>
              <Typography.Title level={2}> Thông số</Typography.Title>
            </Col> */}

            {/* <Col xs={1} sm={1} md={1} lg={1}></Col> */}
          </Row>
        )}
      </div>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Kết quả chẩn đoán"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {resultStatus}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveStatus}>Lưu kết quả</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signal;
