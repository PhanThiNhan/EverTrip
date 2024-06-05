import {
  LeftSquareOutlined
} from "@ant-design/icons";
import {
  Breadcrumb, Button, Card, Form,
  Input, Modal,
  notification, Radio, Select, Spin, Steps, Typography
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import productApi from "../../../apis/productApi";
import bookingApi from "../../../apis/bookingApi";


const { Meta } = Card;
const { Option } = Select;

const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { TextArea } = Input;

const Pay = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderTotal, setOrderTotal] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dataForm, setDataForm] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("paymentId");
  const [lengthForm, setLengthForm] = useState();
  const [form] = Form.useForm();
  const [template_feedback, setTemplateFeedback] = useState();
  let { id } = useParams();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  const hideModal = () => {
    setVisible(false);
  };

  const accountCreate = async (values) => {
    if (values.billing === "paypal") {
      localStorage.setItem("description", values.description);
      localStorage.setItem("address", values.address);
      try {
        const approvalUrl = await handlePayment(values);
        console.log(approvalUrl);
        if (approvalUrl) {
          window.location.href = approvalUrl; // Chuyển hướng đến URL thanh toán PayPal
        } else {
          notification["error"]({
            message: `Thông báo`,
            description: "Thanh toán thất bại",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        notification["error"]({
          message: `Thông báo`,
          description: "Thanh toán thất bại",
        });
      }
    } else {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const user_id = userData.id;
        const address = values.address;
        const paymentMethod = values.billing;
        const note = values.description;
        const status = "pending";
        const promotion = localStorage.getItem("promotion");

        for (const product of cart) {
          const discount = (product.price * promotion) / 100;

          const formatData = {
            user_id,
            address,
            payment_method: paymentMethod,
            campground_id: product.id,
            note,
            status,
            quantity: product.quantity,
            start_date: product.start_date,
            end_date: product.end_date,
            total_price: (product.price - discount),
          };

          console.log(formatData);

          await bookingApi.createBooking(formatData).then((response) => {
            console.log(response);
            if (response.error === "Insufficient quantity for one or more products.") {
              notification["error"]({
                message: `Thông báo`,
                description: "Sản phẩm đã hết hàng!",
              });
              return;
            }

            if (response === undefined) {
              notification["error"]({
                message: `Thông báo`,
                description: "Đặt hàng thất bại",
              });
            } else {
              notification["success"]({
                message: `Thông báo`,
                description: "Đặt hàng thành công",
              });
              form.resetFields();
            }
          }).catch(error => {
            console.error("Error:", error);
            notification["error"]({
              message: `Thông báo`,
              description: "Đặt hàng thất bại",
            });
          });
        }

        history.push("/final-pay");
        localStorage.removeItem("cart");
        localStorage.removeItem("promotion");
        localStorage.removeItem("cartLength");
      } catch (error) {
        console.error("Error:", error);
        notification["error"]({
          message: `Thông báo`,
          description: "Đặt hàng thất bại",
        });
      }

      setTimeout(function () {
        setLoading(false);
      }, 1000);
    }
  };


  const handlePayment = async (values) => {
    try {
      const productPayment = {
        price: "800",
        description: values.bookingDetails,
        return_url: "http://localhost:3500" + location.pathname,
        cancel_url: "http://localhost:3500" + location.pathname,
      };
      const response = await axiosClient.post("/payment/pay", productPayment);
      if (response.approvalUrl) {
        localStorage.setItem("session_paypal", response.accessToken);
        return response.approvalUrl; // Trả về URL thanh toán
      } else {
        notification["error"]({
          message: `Thông báo`,
          description: "Thanh toán thất bại",
        });
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleModalConfirm = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const paymentId = queryParams.get("paymentId");
      // const token = queryParams.get('token');
      const PayerID = queryParams.get("PayerID");
      const token = localStorage.getItem("session_paypal");
      const description = localStorage.getItem("description");
      const address = localStorage.getItem("address");

      // Gọi API executePayment để thực hiện thanh toán
      const response = await axiosClient.get("/payment/executePayment", {
        params: {
          paymentId,
          token,
          PayerID,
        },
      });

      console.log(response)

      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const user_id = userData.id;
        const paymentMethod = "paypal";
        const note = description;
        const status = "approved";
        const promotion = localStorage.getItem("promotion");

        for (const product of cart) {
          const discount = (product.price * promotion) / 100;

          const formatData = {
            user_id,
            address,
            payment_method: paymentMethod,
            campground_id: product.id,
            note,
            status,
            quantity: product.quantity,
            start_date: product.start_date,
            end_date: product.end_date,
            total_price: (product.price - discount),
          };

          console.log(formatData);

          await bookingApi.createBooking(formatData).then((response) => {
            console.log(response);
            if (response.error === "Insufficient quantity for one or more products.") {
              notification["error"]({
                message: `Thông báo`,
                description: "Sản phẩm đã hết hàng!",
              });
              return;
            }

            if (response === undefined) {
              notification["error"]({
                message: `Thông báo`,
                description: "Đặt hàng thất bại",
              });
            } else {
              notification["success"]({
                message: `Thông báo`,
                description: "Đặt hàng thành công",
              });
              form.resetFields();
            }
          }).catch(error => {
            console.error("Error:", error);
            notification["error"]({
              message: `Thông báo`,
              description: "Đặt hàng thất bại",
            });
          });
        }

        history.push("/final-pay");
        localStorage.removeItem("cart");
        localStorage.removeItem("promotion");
        localStorage.removeItem("cartLength");
      } catch (error) {
        console.error("Error:", error);
        notification["error"]({
          message: `Thông báo`,
          description: "Đặt hàng thất bại",
        });
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error executing payment:", error);
      // Xử lý lỗi
    }
  };

  const CancelPay = () => {
    form.resetFields();
    history.push("/cart");
  };

  useEffect(() => {
    (async () => {
      try {
        if (paymentId) {
          setShowModal(true);
        }

        await productApi.getDetailProduct(id).then((item) => {
          setProductDetail(item);
        });
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);
        console.log(user);
        form.setFieldsValue({
          name: user.username,
          email: user.email,
          phone: user.phone,
        });
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log(cart);

        const transformedData = cart.map(
          ({ _id: product, quantity, promotion, price }) => ({ product, quantity, promotion, price })
        );
        let totalPrice = 0;

        for (let i = 0; i < transformedData.length; i++) {
          let product = transformedData[i];
          console.log(product);
          let price = product.promotion * product.quantity;
          totalPrice += price;
        }

        setOrderTotal(totalPrice);
        setProductDetail(transformedData);
        console.log(transformedData);
        setUserData(user);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div class="py-5">
      <Spin spinning={false}>
        <Card className="container">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/cart">
                  <LeftSquareOutlined style={{ fontSize: "24px" }} />
                  <span> Quay lại giỏ hàng</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Thanh toán</span>
                </Breadcrumb.Item>
              </Breadcrumb>

              <div className="payment_progress">
                <Steps
                  current={1}
                  percent={60}
                  items={[
                    {
                      title: "Chọn sản phẩm",
                    },
                    {
                      title: "Thanh toán",
                    },
                    {
                      title: "Hoàn thành",
                    },
                  ]}
                />
              </div>

              <div className="information_pay">
                <Form
                  form={form}
                  onFinish={accountCreate}
                  name="eventCreate"
                  layout="vertical"
                  initialValues={{
                    residence: ["zhejiang", "hangzhou", "xihu"],
                    prefix: "86",
                  }}
                  scrollToFirstError
                >
                  <Form.Item
                    name="name"
                    label="Tên"
                    hasFeedback
                    style={{ marginBottom: 10 }}
                  >
                    <Input disabled placeholder="Tên" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    hasFeedback
                    style={{ marginBottom: 10 }}
                  >
                    <Input disabled placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    hasFeedback
                    style={{ marginBottom: 10 }}
                  >
                    <Input disabled placeholder="Số điện thoại" />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập địa chỉ",
                      },
                      // { max: 20, message: 'Password maximum 20 characters.' },
                      // { min: 6, message: 'Password at least 6 characters.' },
                    ]}
                    style={{ marginBottom: 15 }}
                  >
                    <Input placeholder="Địa chỉ" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Lưu ý cho đơn hàng"
                    hasFeedback
                    style={{ marginBottom: 15 }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lưu ý đơn hàng",
                      },
                      // { max: 20, message: 'Password maximum 20 characters.' },
                      // { min: 6, message: 'Password at least 6 characters.' },
                    ]}
                  >
                    <Input.TextArea rows={4} placeholder="Lưu ý" />
                  </Form.Item>

                  <Form.Item
                    name="billing"
                    label="Phương thức thanh toán"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phương thức thanh toán!",
                      },
                    ]}
                    style={{ marginBottom: 10 }}
                  >
                    <Radio.Group>
                      <Radio value={"cod"}>COD</Radio>
                      <Radio value={"paypal"}>PAYPAL</Radio>
                      {/* <Radio value={2}>B</Radio> */}
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      style={{
                        background: "#FF8000",
                        color: "#FFFFFF",
                        float: "right",
                        marginTop: 20,
                        marginLeft: 8,
                      }}
                      htmlType="submit"
                    >
                      Hoàn thành
                    </Button>
                    <Button
                      style={{
                        background: "#FF8000",
                        color: "#FFFFFF",
                        float: "right",
                        marginTop: 20,
                      }}
                      onClick={CancelPay}
                    >
                      Trở về
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </Card>
        <Modal
          visible={showModal}
          onOk={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        >
          <p>Bạn có chắc chắn muốn xác nhận thanh toán?</p>
        </Modal>
      </Spin>
    </div>
  );
};

export default Pay;
