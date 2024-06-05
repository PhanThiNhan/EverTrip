import {
  Breadcrumb, Button, Card, Carousel, Col, Form,
  Input,
  Rate, Row,
  Spin,
  Modal, DatePicker
} from "antd";

import * as PANOLENS from 'panolens';

import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import campgroundApi from "../../../apis/campgroundApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import "./productDetail.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import L from "leaflet";
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import moment from "moment";

const { TextArea } = Input;

const ProductDetail = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState();
  const [form] = Form.useForm();
  let { id } = useParams();
  const history = useHistory();

  const icon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (product) => {
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item.id === product.id
    );

    const isDifferentUser = existingItems.some(item => item.id_user !== product.id_user);

    if (isDifferentUser) {
      const confirmDelete = window.confirm('Giỏ hàng hiện tại chứa sản phẩm của người dùng khác. Bạn có muốn xóa toàn bộ giỏ hàng và thêm sản phẩm mới?');
      if (confirmDelete) {
        updatedItems = [{
          ...product,
          start_date: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
          end_date: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
        }];
        console.log(updatedItems)
      } else {
        setIsModalVisible(false);
        return; 
      }
    } else {
      if (existingItemIndex !== -1) {
        updatedItems = existingItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1, start_date: startDate ? moment(startDate).format('YYYY-MM-DD') : null, end_date: endDate ? moment(endDate).format('YYYY-MM-DD') : null } : item
        );
      } else {
        updatedItems = [...existingItems, { ...product, quantity: 1, start_date: startDate ? moment(startDate).format('YYYY-MM-DD') : null, end_date: endDate ? moment(endDate).format('YYYY-MM-DD') : null }];
      }
    }
    console.log(updatedItems)
    setCartLength(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    window.location.reload();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDateChange = (dates) => {
    setStartDate(dates ? dates[0] : null);
    setEndDate(dates ? dates[1] : null);
  };

  const handleReadMore = (id) => {
    console.log(id);
    history.push("/product-detail/" + id);
    window.location.reload();
  };


  const [reviews, setProductReview] = useState([]);
  const [reviewsCount, setProductReviewCount] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [user, setUser] = useState(null);

  const handleList = () => {
    (async () => {
      try {
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);
        setUser(user);

        await campgroundApi.getCampgroundById(id).then((item) => {
          setProductDetail(item);
       
          const [latitude, longitude] = item.gps_location.split(',').map(coord => coord.trim());
          console.log(latitude, longitude);
          setLatitude(latitude);
          setLongitude(longitude);
          updateMap();
          setProductReview(item.reviews);
          setProductReviewCount(item.reviewStats);
          setAvgRating(item.avgRating);
        });
        campgroundApi.getAllCampgrounds().then((items) => {
          const randomItems = getRandomItems(items, 4);
          setRecommend(randomItems);
        });
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
  }

  const getRandomItems = (array, numItems) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
  };


  useEffect(() => {
    handleList();
    window.scrollTo(0, 0);
  }, [cartLength]);

  const [mapKey, setMapKey] = useState(0);


  const updateMap = () => {
    setMapKey(prevKey => prevKey + 1);
  };

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);


  const handleMarkerClick = (data) => {
    var url = "https://www.google.com/maps/place/" + latitude + "," + longitude;
    window.open(url, "_blank");
  };

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  {/* <HomeOutlined /> */}
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="http://localhost:3500/product-list/643cd88879b4192efedda4e6">
                  {/* <AuditOutlined /> */}
                  <span>Khu cắm trại</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>{productDetail.name}</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <Row gutter={12} style={{ marginTop: 20 }}>
              <Col span={14}>
                {productDetail?.slide?.length > 0 ? (
                  <Carousel autoplay className="carousel-image">
                    {productDetail.slide.map((item) => (
                      <div className="img" key={item}>
                        <img
                          style={{ width: "50%", height: "50%", marginLeft: "100px" }}
                          src={item}
                          alt=""
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <Card className="card_image" bordered={false}>
                    <img src={productDetail.image} />
                    <div className="promotion"></div>
                  </Card>
                )}
              </Col>
              <div className="describe">
              <div className="title_total">
                Giới thiệu: "{productDetail.name}"
              </div>
              <div
                className="describe_detail_description"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              ></div>
            </div>
              <Col span={10}>
                <div className="price">
                  <h1 className="product_name">{productDetail.name}</h1>
                </div>
                <Card
                  className="card_total"
                  bordered={false}
                >
                  <div>
                    <div className="price_product">
                      {Number(productDetail?.price)?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}đ /Ngày
                    </div>

                  </div>
                  <div class="box-product-promotion">
                    <div class="box-product-promotion-header">
                      <p>Thông tin khu cắm trại</p>
                    </div>
                    <div class="box-content-promotion">
                      <p class="box-product-promotion-number"></p>
                      <a>
                        <p>Địa chỉ: {productDetail.address}</p>
                        <p>Sức chứa: {productDetail.max_guests}</p>
                        <p>Điều khoản: {productDetail.policies}</p>
                        <p>Tiện ích: {productDetail.amenities}</p>
                        <p>Quy định: {productDetail.regulations}</p>

                      </a>
                    </div>
                  </div>

                  <div className="box_cart_1">
                    <Button
                      type="primary"
                      className="by"
                      size={"large"}
                      onClick={() => showModal(productDetail)}
                      disabled={productDetail?.status === 'Unavailable' || productDetail?.status === 'Discontinued'}
                    >
                      Đặt lịch ngay
                    </Button>
                  </div>
                  <Modal title="Chọn ngày" visible={isModalVisible} onOk={() => handleOk(productDetail)} onCancel={handleCancel}>
                    <DatePicker.RangePicker onChange={handleDateChange} />
                  </Modal>
                </Card>
                <div style={{ marginTop: 15 }}>
                  <MapContainer style={{ height: 300 }} key={mapKey} center={[latitude, longitude]} zoom={16} scrollWheelZoom={false}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[latitude, longitude]} icon={icon}>
                      <div style={{ backgroundColor: 'white', padding: '5px' }}>
                        {productDetail?.price ? numberWithCommas(productDetail?.price) + " đ" : null}
                      </div>
                      <Popup>
                        <div>
                          <h3>{productDetail?.name}</h3>
                          <p>Địa chỉ: {productDetail?.address}</p>
                          <p>Giá: {productDetail?.price ? numberWithCommas(productDetail?.price) + " đ" : null} </p>
                          <Button type="primary" onClick={() => handleMarkerClick(productDetail)}>Chỉ đường</Button>
                        </div>
                      </Popup>
                    </Marker>
                    <div style={{ position: 'absolute', top: latitude, left: longitude }}>
                      {productDetail?.price ? numberWithCommas(productDetail?.price) + " đ" : null}
                    </div>
                  </MapContainer>
                </div>
              </Col>
            </Row>
          


            <div className="price" style={{ marginTop: 40 }}>
              <h1 className="product_name">Sản phẩm bạn có thể quan tâm</h1>
            </div>
        
            <Row
              style={{ marginTop: 40 }}
              gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
              className="row-product"
            >
              {recommend?.map((item) => (
                <Col
                  xl={{ span: 6 }}
                  lg={{ span: 6 }}
                  md={{ span: 12 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className="col-product"
                  onClick={() => handleReadMore(item.id)}
                  key={item.id}
                >
                  <div className="show-product">
                    {item.image ? (
                      <img className="image-product" src={item.image} />
                    ) : (
                      <img
                        className="image-product"
                        src={require("../../../assets/image/NoImageAvailable.jpg")}
                      />
                    )}
                    <div className="wrapper-products">
                      <Paragraph
                        className="title-product"
                        ellipsis={{ rows: 2 }}
                      >
                        {item.name}
                      </Paragraph>
                      <div className="price-amount">
                        <Paragraph className="price-product">
                          {numberWithCommas(Number(item.price))}đ/Ngày
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductDetail;
