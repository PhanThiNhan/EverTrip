import Texty from "rc-texty";
import React, { useEffect, useRef, useState } from "react";
import campgroundApi from "../../apis/campgroundApi";
import servicesApi from "../../apis/servicesApi";

import triangleTopRight from "../../assets/icon/Triangle-Top-Right.svg";
import "../Home/home.css";

import {
  BackTop,
  Carousel,
  Col,
  Row,
  Spin,
  Space
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useHistory } from "react-router-dom";
import { numberWithCommas } from "../../utils/common";

const Home = () => {
  const [productList, setProductList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const history = useHistory();


  const handleReadMore = (id) => {
    console.log(id);
    history.push("product-detail/" + id);
  };

  const handleReadMore2 = (id) => {
    console.log(id);
    history.push("service-detail/" + id);
  };


  useEffect(() => {
    (async () => {
      try {
        const response = await campgroundApi.getAllCampgrounds({
          page: 1,
          limit: 10,
        });

        // Filter out items with status 'denied'
        const filteredResponse = response.filter(item => item.status !== 'denied');

        // Update the product list with the filtered response
        setProductList(filteredResponse);

        const response2 = await servicesApi.getAllServices({
          page: 1,
          limit: 10,
        });
        setServiceList(response2);

      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }




    })();
  }, []);

  return (
    <Spin spinning={false}>
      <div
        style={{
          background: "#FFFFFF",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
        className="home"
      >
        <div
          style={{ background: "#FFFFFF" }}
          className="banner-promotion"
        >
          <Row justify="center" align="top" key="1">
            <Col span={24}>
              <Carousel autoplay className="carousel-image">

                <div className="img">
                  <img
                    style={{ width: "100%", height: 680 }}
                    src="https://bizweb.dktcdn.net/100/209/162/themes/946925/assets/slider_3.jpg?1712664064217"
                    alt=""
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 680 }}
                    src="https://bizweb.dktcdn.net/100/209/162/themes/946925/assets/slider_2.jpg?1712664064217"
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 680 }}
                    src="https://bizweb.dktcdn.net/100/209/162/themes/946925/assets/slider_1.jpg?1712664064217"
                  />
                </div>
              </Carousel>

            </Col>
          </Row>
          <div className="product-promotion">
            <div class="product-card">
              <div class="product-image">
                <img
                  src="https://bizweb.dktcdn.net/thumb/large/100/209/162/themes/946925/assets/season_coll_1_img.png?1712664064217"
                  alt="Khu cắm Trại 1"
                />
              </div>
              <div class="product-name">Lều cắm trại</div>
            </div>
            <div class="product-card">
              <div class="product-image">
                <img
                  src="https://bizweb.dktcdn.net/thumb/large/100/209/162/themes/946925/assets/season_coll_2_img.png?1712664064217"
                  alt="Khu cắm Trại 2"
                />
              </div>
              <div class="product-name">Ghế dã ngoại</div>
            </div>
            <div class="product-card">
              <div class="product-image">
                <img
                  src="https://bizweb.dktcdn.net/thumb/large/100/209/162/themes/946925/assets/season_coll_3_img.png?1712664064217"
                  alt="Khu cắm Trại 3"
                />
              </div>
              <div class="product-name">Bàn dã ngoại</div>
            </div>
            <div class="product-card">
              <div class="product-image">
                <img
                  src="https://bizweb.dktcdn.net/thumb/large/100/209/162/themes/946925/assets/season_coll_4_img.png?1712664064217"
                  alt="Khu cắm Trại 2"
                />
              </div>
              <div class="product-name">Bếp nướng than BBQ</div>
            </div>
            <div class="product-card">
              <div class="product-image">
                <img
                  src="https://bizweb.dktcdn.net/thumb/large/100/209/162/themes/946925/assets/season_coll_6_img.png?1712664064217"
                  alt="Khu cắm Trại 3"
                />
              </div>
              <div class="product-name">Đèn lều, quạt tích điện</div>
            </div>
            <div class="product-card">
              <div class="product-image">
                <img
                  src="https://bizweb.dktcdn.net/thumb/large/100/209/162/themes/946925/assets/season_coll_5_img.png?1712664064217"
                  alt="Khu cắm Trại 2"
                />
              </div>
              <div class="product-name">Bến gas dã ngoại</div>
            </div>
          </div>
        </div>


        <div className="image-one">
          <div className="texty-demo">
            <Texty>Khuyến Mãi</Texty>
          </div>
          <div className="texty-title">
            <p>
              Khu cắm Trại <strong style={{ color: "#3b1d82" }}>Mới</strong>
            </p>
          </div>

          <div className="list-products container" key="1">
            <Row gutter={[16, 16]} className="row-product">
              {productList.map((item) => (
                <Col
                  key={item.id}
                  xl={{ span: 6 }}
                  lg={{ span: 8 }}
                  md={{ span: 12 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className="col-product"
                  onClick={() => handleReadMore(item.id)}
                >
                  <div className="show-product">
                    <img
                      className="image-product"
                      src={item.image || require("../../assets/image/NoImageAvailable.jpg")}
                      alt="Product"
                    />
                    <div className="wrapper-products">
                      <Paragraph className="title-product" ellipsis={{ rows: 2 }}>
                        {item.name}
                      </Paragraph>
                      <Space direction="vertical">
                        <Paragraph>Địa chỉ: {item.address}</Paragraph>
                        <Paragraph>Số khách tối đa: {item.max_guests}</Paragraph>
                        <Paragraph className="price-product">
                          {numberWithCommas(Number(item?.price))} đ /Ngày
                        </Paragraph>
                      </Space>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        <div></div>

        <section class="py-10 bg-white sm:py-16 lg:py-24">
          <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="max-w-2xl mx-auto text-center">
              <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Cách thức đặt thuê lều trại</h2>
              <p class="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">Đăng ký tài khoản để bắt đầu trải nghiệm đặt thuê lều trại.</p>
            </div>

            <div class="relative mt-12 lg:mt-20">
              <div class="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                <img class="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" alt="" />
              </div>

              <div class="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
                <div>
                  <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                    <span class="text-xl font-semibold text-gray-700"> 1 </span>
                  </div>
                  <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Đăng ký tài khoản</h3>
                  <p class="mt-4 text-base text-gray-600">Bắt đầu bằng việc đăng ký tài khoản để có thể thuê lều trại.</p>
                </div>

                <div>
                  <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                    <span class="text-xl font-semibold text-gray-700"> 2 </span>
                  </div>
                  <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Chọn lều trại</h3>
                  <p class="mt-4 text-base text-gray-600">Chọn lều trại phù hợp và thêm vào giỏ hàng để tiến hành đặt thuê.</p>
                </div>

                <div>
                  <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                    <span class="text-xl font-semibold text-gray-700"> 3 </span>
                  </div>
                  <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Xác nhận và thanh toán</h3>
                  <p class="mt-4 text-base text-gray-600">Kiểm tra lại thông tin và hoàn tất thanh toán để đặt thuê lều trại.</p>
                </div>
              </div>
            </div>
          </div>
        </section>




        <div className="image-one">
          <div className="texty-demo">
            <Texty>Giờ Vàng</Texty>
          </div>
          <div className="texty-title">
            <p>
              Dịch Vụ <strong style={{ color: "#3b1d82" }}>Cho Cắm Trại</strong>
            </p>
          </div>

          <div className="list-products container" key="1">
            <Row gutter={[16, 16]} className="row-product">
              {serviceList.map((item) => (
                <Col
                  key={item.id}
                  xl={{ span: 6 }}
                  lg={{ span: 8 }}
                  md={{ span: 12 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className="col-product"
                  onClick={() => handleReadMore2(item.id)}
                >
                  <div className="show-product">
                    <img
                      className="image-product"
                      src={item.image || require("../../assets/image/NoImageAvailable.jpg")}
                      alt="Product"
                    />
                    <div className="wrapper-products">
                      <Paragraph className="title-product" ellipsis={{ rows: 2 }}>
                        {item.name}
                      </Paragraph>
                      <Space direction="vertical">
                        <Paragraph>Bắt đầu cho thuê từ: {item.operating_hours}h</Paragraph>
                        <Paragraph>Số lượng còn lại: {item.quantity}</Paragraph>
                        <Paragraph className="price-product">
                          {numberWithCommas(Number(item?.price))} đ /Ngày
                        </Paragraph>
                      </Space>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>

      <BackTop style={{ textAlign: "right" }} />
    </Spin>
  );
};

export default Home;
