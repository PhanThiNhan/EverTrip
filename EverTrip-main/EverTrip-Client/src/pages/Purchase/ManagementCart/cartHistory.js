import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import {
  Breadcrumb, Button, Card,
  Modal,
  Popconfirm,
  Spin, Table, Tag,
  notification
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import productApi from "../../../apis/productApi";
import "./cartHistory.css";
import bookingApi from '../../../apis/bookingApi';

const CartHistory = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  let { id } = useParams();
  const history = useHistory();


  const handleCancelOrder = (order) => {
    console.log(order);
    Modal.confirm({
      title: 'Xác nhận hủy vé',
      content: 'Bạn có chắc muốn hủy vé này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        handleUpdateOrder(order.id);
      },
    });
  };


  const handleUpdateOrder = async (id) => {
    setLoading(true);
    try {
      const categoryList = {
        "status": "rejected"
      }
      await axiosClient.put("/bookings/" + id, categoryList).then(response => {
        if (response === undefined) {
          notification["error"]({
            message: `Thông báo`,
            description:
              'Hủy vé thất bại',
          });
        }
        else {
          notification["success"]({
            message: `Thông báo`,
            description:
              'Hủy vé thành công',
          });
        }
      })

      handleList();
      setLoading(false);

    } catch (error) {
      throw error;
    }
  }

  const columns = [
    {
      title: "Mã vé",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tên Khu cắm trại",
      dataIndex: "campground_name",
      key: "campground_name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) => <span>{moment(start_date).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) => <span>{moment(end_date).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (slugs) => (
        <span >
          {slugs === "rejected" ? <Tag style={{ width: 160, textAlign: "center" }} color="red">Đã hủy</Tag> : slugs === "approved" ? <Tag style={{ width: 160, textAlign: "center" }} color="geekblue" key={slugs}>
            Đã Thanh Toán
          </Tag> : slugs === "final" ? <Tag color="green" style={{ width: 160, textAlign: "center" }}>Đã thanh toán và xác nhận</Tag> : <Tag color="blue" style={{ width: 160, textAlign: "center" }}>Chưa thanh toán</Tag>}
        </span>
      ),
    },
    {
      title: "Tổng tiền cọc",
      dataIndex: "total_price",
      key: "total_price",
      render: (total_price) => (
        <div>
          {Number(total_price)?.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div>
          {record.status !== 'rejected' && (
            <div style={{ marginTop: 10 }}>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleCancelOrder(record)}
                style={{ width: 150, borderRadius: 15, height: 30 }}
              >
                {"Hủy vé"}
              </Button>
            </div>
          )}
        </div>
      ),
    }
    
  ];



  const handleList = () => {
    (async () => {
      try {
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);

        await bookingApi.getBookingsByUser(user.id).then((item) => {
          console.log(item);
          setOrderList(item);
        });
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
  }


  useEffect(() => {
    handleList();
    window.scrollTo(0, 0);
  }, []);

  // Thêm vào component của bạn
  const handleProductClick = (id) => {
    history.push("/product-detail/" + id);
  };

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Quản lý vé đặt</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div className="container" style={{ marginBottom: 30 }}>

              <br></br>
              <Card>
                <Table
                  columns={columns}
                  dataSource={orderList}
                  rowKey="id"
                  pagination={{ position: ["bottomCenter"] }}
                />
              </Card>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default CartHistory;
