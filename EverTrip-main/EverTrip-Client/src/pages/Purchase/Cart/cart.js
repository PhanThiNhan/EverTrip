import {
  CreditCardOutlined,
  LeftSquareOutlined
} from "@ant-design/icons";
import {
  Breadcrumb, Button, Card, Col, Divider, Form,
  InputNumber, Layout, Row,
  Spin, Statistic, Table,
  Input,
  notification,
  message
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import eventApi from "../../../apis/eventApi";
import "./cart.css";

import voucherApi from "../../../apis/voucherApi";

const { Content } = Layout;

const Cart = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState();
  const [cartTotal, setCartTotal] = useState();
  const [form] = Form.useForm();
  let { id } = useParams();
  const history = useHistory();
  const [allQuantitiesValid, setAllQuantitiesValid] = useState(true);


  const handlePay = () => {
    history.push("/pay");
  };

  const deleteCart = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartLength");
    window.location.reload(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!newQuantity || newQuantity < 1) {
      alert("Đã vô")
      message.error("Số lượng phải lớn hơn hoặc bằng 1");
      setAllQuantitiesValid(false);
      return;
    }
    setAllQuantitiesValid(true);

    console.log(newQuantity);
    // Tìm kiếm sản phẩm trong giỏ hàng
    const updatedCart = productDetail.map((item) => {
      if (item.id === productId) {
        // Cập nhật số lượng và tính toán tổng tiền
        item.quantity = newQuantity;
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setProductDetail(updatedCart);
  };

  const handleDelete = async (productId) => {
    const updatedCart = JSON.parse(localStorage.getItem("cart"));
    const filteredCart = updatedCart.filter(
      (product) => product.id !== productId
    );
    localStorage.setItem("cart", JSON.stringify(filteredCart));
    setCartLength(cartLength - 1);
    setProductDetail(filteredCart);
  };

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => <img src={image} style={{ height: 80 }} />,
      width: "10%",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <a>
          {Number(text)?.toLocaleString("vi", { style: "currency", currency: "VND" })}
        </a>
      ),
    },
    {
      title: "Số lượng người",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          defaultValue={text}
          onBlur={(e) => {
            const value = e.target.value;
            if (!value || value < 1) {
              message.error("Số lượng phải lớn hơn hoặc bằng 1");
              setAllQuantitiesValid(false);

            }
          }}
          onChange={(value) => {
            if (value && value >= 1) {
              updateQuantity(record.id, value);
            }
          }}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "price",
      key: "price",
      render: (price, record) => (
        <div>
          <div className="groupButton">
            {(Number(price)).toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button type="danger" onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  const [category, setCategory] = useState(null);

  const handleCart = () => {
    (async () => {
      try {
        await voucherApi.getAllvoucher().then((res) => {
          console.log(res);
          setCategory(res);
          setLoading(false);
        });
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setProductDetail(cart);
        console.log(cart);
        const cartLength = localStorage.getItem("cartLength");
        setCartLength(cartLength);
        const total = cart.reduce(
          (acc, item) => acc + Number(item.price),
          0
        );
        console.log(total)
        setCartTotal(total);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
  }

  useEffect(() => {
    handleCart();
    window.scrollTo(0, 0);
  }, []);

  const [phanTramKhuyenMai, setPhanTramKhuyenMai] = useState("");
  const [discountTotal, setDiscountTotal] = useState("");
  const [totalCart, setTotalCart] = useState("");
  let initialCartTotal = cartTotal;

  const handleInputChange = (e) => {
    const { value } = e.target;
    const foundCategory = category.find((item) => item.voucher_code === value);

    if (foundCategory) {
      // Lấy danh sách cart từ localStorage
      const currentDate = new Date();
      const expiryDate = new Date(foundCategory.expiry_date);

      if (currentDate > expiryDate) {
        // Nếu mã voucher đã hết hạn, thông báo lỗi và không áp dụng mã
        notification.error({ message: 'Mã khuyến mãi đã hết hạn. Vui lòng thử mã khác!' });
        return;
      }

      const cartFromLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];

      // Kiểm tra id_user của các phần tử trong cart
      const isSameUser = cartFromLocalStorage.every((item) => item.id_user === foundCategory.id_user);

      if (!isSameUser) {
        // Nếu id_user không khớp, thông báo lỗi và không áp dụng mã
        notification.error({ message: 'Mã này của khu cắm trại khác, không thể áp dụng.' });
        return;
      }

      // Lưu trữ giá trị ban đầu của cartTotal nếu chưa có
      const initialCartTotal = localStorage.getItem('initialCartTotal') ? parseFloat(localStorage.getItem('initialCartTotal')) : cartTotal;
      if (!localStorage.getItem('initialCartTotal')) {
        localStorage.setItem('initialCartTotal', initialCartTotal);
      }

      setTotalCart(initialCartTotal); // Sử dụng giá trị ban đầu của cartTotal
      localStorage.setItem("promotion", foundCategory.discount_rate);

      setPhanTramKhuyenMai(foundCategory.discount_rate);
      const discount = (initialCartTotal * foundCategory.discount_rate) / 100;
      setDiscountTotal(discount);
      setCartTotal(initialCartTotal - discount);
    } else {
      handleCart();
      localStorage.removeItem("promotion");
      setDiscountTotal(0);

      localStorage.removeItem("initialCartTotal"); // Xóa giá trị ban đầu khi mã không hợp lệ
      notification.error({ message: 'Mã khuyến mãi không đúng. Vui lòng thử lại!' });
      setPhanTramKhuyenMai(""); // Nếu không tìm thấy, gán lại giá trị rỗng
    }
  };



  return (
    <div>
      <div class="py-5">
        <Spin spinning={false}>
          <Card className="container">
            <div className="box_cart">
              <Layout className="box_cart">
                <Content className="site-layout-background">
                  <Breadcrumb>
                    <Breadcrumb.Item href="http://localhost:3500/product-list/643cd88879b4192efedda4e6">
                      <LeftSquareOutlined style={{ fontSize: "24px" }} />
                      <span> Tiếp tục tham quan</span>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                  <hr></hr>
                  <br></br>
                  <Row>
                    <Col span={12}>
                      <h4>
                        <strong>{cartLength}</strong> Khu cắm trại
                      </h4>
                    </Col>
                    <Col span={12}>
                      <Button type="default" danger style={{ float: "right" }}>
                        <span onClick={() => deleteCart()}>Xóa tất cả</span>
                      </Button>
                    </Col>
                  </Row>
                  <br></br>
                  <Table
                    columns={columns}
                    dataSource={productDetail}
                    pagination={false}
                  />
                  <br></br>
                  <Divider orientation="left">Chính sách</Divider>
                  <Row justify="start">
                    <Col>
                      <ol>
                        <li>
                          Sản phẩm chuẩn chất lượng, đúng với hình ảnh và video mà dịch vụ cắm trại cung cấp với giá cả tốt trên thị trường.
                        </li>
                        <li>
                          Dịch vụ khách hàng chu đáo, nhiệt tình, tận tâm.
                        </li>
                        <li>
                          Đổi trả sản phẩm nếu có lỗi từ nhà sản xuất theo quy định của dịch vụ cắm trại:<br></br>
                          - Sản phẩm phải còn nguyên, chưa qua sử dụng, giặt tẩy, không bị bẩn hoặc bị hư hỏng bởi các tác nhân bên ngoài. <br></br>
                          - Sản phẩm hư hỏng do vận chuyển hoặc do nhà sản xuất.
                          <br></br>
                          - Không đủ số lượng, không đủ bộ như trong đơn hàng.
                        </li>
                      </ol>
                    </Col>

                  </Row>
                  <br></br>
                  <Input
                    type="text"
                    placeholder="Nhập mã khuyến mãi"
                    onBlur={handleInputChange}
                    style={{ width: 300, marginBottom: 10 }}
                  />
                  <p>Phần trăm khuyến mãi: {phanTramKhuyenMai}</p>
                  <Divider orientation="right">
                    <p>Thanh toán</p>
                  </Divider>
                  <Row justify="end">
                    <Col>
                      <h6>Tổng {cartLength} sản phẩm</h6>

                      <Statistic
                        title="Tổng tiền:"
                        value={`${Math.round(totalCart || cartTotal).toFixed(0)}`}
                        precision={0}
                      />
                      <Statistic
                        title="Số tiền giảm:"
                        value={`${Math.round(discountTotal).toFixed(0)}`}
                        precision={0}
                      />
                      <Statistic
                        title="Thành tiền (đã bao gồm VAT)."
                        value={`${Math.round(cartTotal).toFixed(0)}`}
                        precision={0}
                      />

                        <Button
                          style={{ marginTop: 16 }}
                          type="primary"
                          onClick={() => handlePay()}
                          disabled={!allQuantitiesValid}
                        >
                          Thanh toán ngay{" "}
                          <CreditCardOutlined style={{ fontSize: "20px" }} />
                        </Button>
                      
                    </Col>
                  </Row>
                </Content>
              </Layout>
            </div>
          </Card>
        </Spin>
      </div>
    </div>
  );
};

export default Cart;
