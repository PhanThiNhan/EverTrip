import {
  Breadcrumb, Button, Card, Col, Form,
  List, Row,
  Spin
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import productApi from "../../../apis/productApi";
import campgroundApi from "../../../apis/campgroundApi";

import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import "./productList.css";


const ProductList = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);

  let { id } = useParams();
  const history = useHistory();
  const match = useRouteMatch();

  const handleReadMore = (id) => {
    console.log(id);
    history.push("/product-detail/" + id);
    window.location.reload();
  };

  const handleCategoryDetails = (id) => {
    const newPath = match.url.replace(/\/[^/]+$/, `/${id}`);
    history.push(newPath);
    window.location.reload();
  };

  const handleSearchPrice = async (minPrice, maxPrice) => {
    try {
      const dataForm = {
        page: 1,
        limit: 50,
        minPrice: minPrice,
        maxPrice: maxPrice,
      };
      await axiosClient.post("/product/searchByPrice", dataForm)
        .then((response) => {
          if (response === undefined) {
            setLoading(false);
          } else {
            // Lọc các sản phẩm có trạng thái là "Available"
            setProductDetail(response.data.docs);
            setLoading(false);
          }
        });
    } catch (error) {
      throw error;
    }
  };


  const handleSearchClick = () => {
    // Gọi hàm tìm kiếm theo giá
    handleSearchPrice(minPrice, maxPrice);
  };

  useEffect(() => {
    (async () => {
      try {

        const response = await productApi.getCategory({ limit: 50, page: 1 });
        setCategories(response.categories);

        await campgroundApi.getCampgroundsByUserCampgroundId(id).then((response) => {
          // Lọc danh sách sản phẩm chỉ lấy những sản phẩm có trạng thái là 'Available'
          const availableProducts = response.filter(product => product.status !== 'denied');

          // Cập nhật state với danh sách sản phẩm chỉ có trạng thái 'Available'
          setProductDetail(availableProducts);
        });
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);

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
                  <span>Khu cắm trại</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div className="container box">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryDetails(category.id)}
                  className="menu-item-1"
                >
                  <div className="menu-category-1">{category.name}</div>
                </div>
              ))}
            </div>
            {/* <div className="container">
                    <Button type="primary" onClick={() => handleSearchClick()}>
                        Search theo giá sản phẩm
                    </Button>
                    <Slider
                        range
                        min={0}
                        max={250000}
                        value={[minPrice, maxPrice]}
                        onChange={handleSliderChange}
                        onAfterChange={() => handleSearchClick()}
                    />
                </div> */}
            <div
              className="list-products container"
              key="1"
              style={{ marginTop: 0, marginBottom: 50 }}
            >
              <Row>
                <Col span={12}>
                  <div className="title-category">
                    <div class="title">
                      <h3 style={{ paddingTop: "30px" }}>Danh sách khu cắm trại</h3>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="button-category">
                  </div>
                </Col>
              </Row>
              <div className="container mx-auto mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {productDetail.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
                      onClick={() => handleReadMore(item.id)}
                    >
                      <div className="relative">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                        ) : (
                          <img
                            src={require("../../../assets/image/NoImageAvailable.jpg")}
                            alt="No Image Available"
                            className="w-full h-40 object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                        <p className="text-gray-600 description">{item.description}</p>
                        <div className="flex justify-between mt-4">
                          <p className="text-gray-700">
                            {item.price && numberWithCommas(Number(item.price))}đ/ngày
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductList;
