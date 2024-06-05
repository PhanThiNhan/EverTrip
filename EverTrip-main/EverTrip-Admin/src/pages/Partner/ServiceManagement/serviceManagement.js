import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    DatePicker,
    Select,
    InputNumber
} from 'antd';
import { useEffect, useState } from 'react';
import servicesApi from "../../../apis/servicesApi";
import "./serviceManagement.css";
import moment from 'moment';
import dayjs from 'dayjs';
import { getItemFromLocalStorage } from '../../../apis/storageService';
import uploadFileApi from '../../../apis/uploadFileApi';

const { Option } = Select;

const ServiceManagement = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        // eslint-disable-next-line no-useless-catch
        try {
            const voucherData = {
                "name": values.name,
                "description": values.description,
                "image": file,
                "price": values.price,
                "operating_hours": values.operating_hours,
                "location": values.location,
                "quantity": values.quantity,
                "id_user": getItemFromLocalStorage("user").id,
            };


            return servicesApi.createService(voucherData).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên dịch vụ không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo dịch vụ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo dịch vụ thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        // eslint-disable-next-line no-useless-catch
        try {
            const categoryList = {
                "name": values.name,
                "description": values.description,
                "image": file ? file : values.image,
                "price": values.price,
                "operating_hours": values.operating_hours,
                "location": values.location,
                "quantity": values.quantity,
            }
            return servicesApi.updateService(id, categoryList).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên dịch vụ không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa dịch vụ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa dịch vụ thành công',
                    });
                    handleCategoryList();
                    setOpenModalUpdate(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            const user = getItemFromLocalStorage("user");
            if (user.role == "isAdmin") {

                await servicesApi.getAllServices().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            } else {
                await servicesApi.getServicesByUserId(user.id).then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            }
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await servicesApi.deleteService(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa dịch vụ vì nó đã được sử dụng trong một sự kiện hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa dịch vụ thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa dịch vụ thành công',

                    });
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            // eslint-disable-next-line no-useless-catch
            try {
                const response = await servicesApi.getServiceById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response[0].name,
                    description: response[0].description,
                    image: response[0].image,
                    price: response[0].price,
                    operating_hours: response[0].operating_hours,
                    location: response[0].location,
                    quantity: response[0].quantity,
                    id_user: response[0].id_user
                });
                console.log(form2);
                setLoading(false);

            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await servicesApi.searchServices(name.target.value);
            setCategory(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img src={text} alt="Service" style={{ maxWidth: '100px' }} />,
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => parseFloat(text).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }),
        }
        ,
        {
            title: 'Giờ làm việc',
            dataIndex: 'operating_hours',
            key: 'operating_hours',
        },
        {
            title: 'Địa điểm',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditCategory(record.id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div
                            style={{ marginLeft: 6 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa dịch vụ này?"
                                onConfirm={() => handleDeleteCategory(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >{"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div >
            ),
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                const user = getItemFromLocalStorage("user");
                if (user.role == "isAdmin") {

                    await servicesApi.getAllServices().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await servicesApi.getServicesByUserId(user.id).then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                }
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container-home'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý dịch vụ</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo tên"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo dịch vụ</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <Modal
                    title="Tạo dịch vụ mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="voucherCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>
                            <Form.Item
                                name="name"
                                label="Tên dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên dịch vụ" />
                            </Form.Item>

                            <Form.Item
                                name="price"
                                label="Giá dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Giá dịch vụ" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="operating_hours"
                                label="Giờ hoạt động (giờ:phút)"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giờ hoạt động!',
                                    },
                                    {
                                        pattern: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                                        message: 'Vui lòng nhập đúng định dạng giờ:phút (HH:mm)!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Giờ hoạt động" />
                            </Form.Item>

                            <Form.Item
                                name="location"
                                label="Địa điểm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập địa điểm!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Địa điểm" />
                            </Form.Item>

                            <Form.Item
                                name="quantity"
                                label="Số lượng"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số lượng" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input.TextArea placeholder="Mô tả" />
                            </Form.Item>

                            <Form.Item
                                name="attachment"
                                label="Chọn ảnh"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>


                </Modal>

                <Modal
                    title="Chỉnh sửa dịch vụ"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>
                            <Form.Item
                                name="name"
                                label="Tên dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên dịch vụ" />
                            </Form.Item>

                            <Form.Item
                                name="price"
                                label="Giá dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Giá dịch vụ" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="operating_hours"
                                label="Giờ hoạt động"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giờ hoạt động!',
                                    },
                                    
                                    {
                                        pattern: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                                        message: 'Vui lòng nhập đúng định dạng giờ:phút (HH:mm)!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Giờ hoạt động" />
                            </Form.Item>

                            <Form.Item
                                name="location"
                                label="Địa điểm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập địa điểm!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Địa điểm" />
                            </Form.Item>

                            <Form.Item
                                name="quantity"
                                label="Số lượng"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số lượng" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input.TextArea placeholder="Mô tả" />
                            </Form.Item>

                            <Form.Item name="image" label="Ảnh hiện tại">
                                <Input disabled value={form2.getFieldValue('image')} />
                            </Form.Item>

                            <Form.Item
                                name="attachment"
                                label="Chọn ảnh"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ServiceManagement;