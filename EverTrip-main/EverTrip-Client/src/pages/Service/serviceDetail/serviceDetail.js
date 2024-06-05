import {
  Breadcrumb, Button, Card, Carousel, Col, Form,
  Input,
  Rate, Row,
  Spin
} from "antd";

import * as PANOLENS from 'panolens';

import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import servicesApi from "../../../apis/servicesApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import "./serviceDetail.css";

const { TextArea } = Input;

const ServiceDetail = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState();
  const [form] = Form.useForm();
  let { id } = useParams();
  const history = useHistory();

  const addCart = (product) => {
    console.log(product);
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex !== -1) {
      // If product already exists in the cart, increase its quantity
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    } else {
      // If product does not exist in the cart, add it to the cart
      updatedItems = [...existingItems, { ...product, quantity: 1 }];
    }
    console.log(updatedItems.length);
    setCartLength(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    window.location.reload(true);
  };

  const paymentCard = (product) => {
    console.log(product);
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex !== -1) {
      // If product already exists in the cart, increase its quantity
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    } else {
      // If product does not exist in the cart, add it to the cart
      updatedItems = [...existingItems, { ...product, quantity: 1 }];
    }
    console.log(updatedItems.length);
    setCartLength(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    history.push("/cart");
  };
  const handleReadMore = (id) => {
    console.log(id);
    history.push("/service-detail/" + id);
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

        await servicesApi.getServiceById(id).then((item) => {
          setProductDetail(item[0]);
          const panorama = new PANOLENS.ImagePanorama(item.image);
          const viewer = new PANOLENS.Viewer({ container: document.getElementById('panolens-viewer') });
          viewer.add(panorama);
          setProductReview(item.reviews);
          setProductReviewCount(item.reviewStats);
          setAvgRating(item.avgRating);
        });
        servicesApi.getAllServices().then((items) => {
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
                  <span>Dịch vụ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>{productDetail.name}</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <Row gutter={12} style={{ marginTop: 20 }}>
              <Col span={8}>
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
              <Col span={16}>
                <div className="price">
                  <h1 className="product_name">{productDetail.name}</h1>
                  <Rate disabled value={avgRating} className="rate" />
                </div>
                <Card
                  className="card_total"
                  bordered={false}
                  style={{ width: "50%" }}
                >
                  <div>
                    <div className="price_product">
                      {productDetail?.price?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}đ /Ngày
                    </div>

                  </div>
                  <div class="box-product-promotion">
                    <div class="box-product-promotion-header">
                      <p>Thông tin dịch vụ</p>
                    </div>
                    <div class="box-content-promotion">
                      <p class="box-product-promotion-number"></p>
                      <a>
                        <p>Địa chỉ: {productDetail.location}</p>
                        <p>Giờ bắt dầu cho thuê: từ {productDetail.operating_hours} giờ</p>
                      </a>
                    </div>
                  </div>

                  <div className="box_cart_1">
                    {/* <Button
                      type="primary"
                      className="by"
                      size={"large"}
                      onClick={() => paymentCard(productDetail)}
                      disabled={productDetail?.status === 'Unavailable' || productDetail?.status === 'Discontinued'}
                    >
                      Mua ngay
                    </Button>
                    <Button
                      type="primary"
                      className="cart"
                      size={"large"}
                      onClick={() => addCart(productDetail)}
                      disabled={productDetail?.status === 'Unavailable' || productDetail?.status === 'Discontinued'}
                    >
                      Thêm vào giỏ
                    </Button> */}
                  </div>
                </Card>
              </Col>
            </Row>
            <div className="describe">
              <div className="title_total">
                Giới thiệu: "{productDetail.name}"
              </div>
              <div
                className="describe_detail_description"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              ></div>
            </div>


            <div className="price" style={{ marginTop: 40 }}>
              <h1 className="product_name">Dịch vụ bạn có thể quan tâm</h1>
            </div>
            {/* <div className="title_total" style={{ marginTop: 20 }}>
              Hình ảnh 360:
            </div>
            <div id="panolens-viewer" style={{ width: '100%', height: '500px', marginTop: 20 }}></div> */}

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
                  key={item._id}
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

export default ServiceDetail;
