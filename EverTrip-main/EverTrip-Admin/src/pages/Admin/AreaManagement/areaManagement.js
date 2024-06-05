import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined,
    StopOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Select,
    InputNumber
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import campgroundApi from "../../../apis/campgroundApi";
import "./areaManagement.css";
import { getItemFromLocalStorage } from '../../../apis/storageService';
import uploadFileApi from '../../../apis/uploadFileApi';
import categoryApi from '../../../apis/categoryApi';

const { Option } = Select;


const AreaManagement = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }


    const handleOkUser = async (values) => {
        setLoading(true);
        const formData = {
            "name": values.name,
            "address": values.address,
            "description": values.description,
            "image": file,
            "amenities": values.amenities,
            "price": values.price,
            "gps_location": values.gps_location,
            "regulations": values.regulations,
            "policies": values.policies,
            "id_user": getItemFromLocalStorage("user").id,
            "status": "denied",
            "max_guests": values.max_guests,
            "id_category": values.id_category
        };
        try {
            return campgroundApi.createCampground(formData).then(response => {
                if (response.error == "Tên khu cắm trại đã tồn tại.") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên khu cắm trại đã tồn tại.',

                    });
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khu cắm trại thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khu cắm trại thành công',
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
        const formData = {
            "name": values.name,
            "address": values.address,
            "description": values.description,
            "image": file,
            "amenities": values.amenities,
            "price": values.price,
            "gps_location": values.gps_location,
            "regulations": values.regulations,
            "policies": values.policies,
            "id_user": getItemFromLocalStorage("user").id,
            "status": values.status,
            "max_guests": values.max_guests,
            "id_category": values.id_category
        };
        try {
            return campgroundApi.updateCampground(id, formData).then(response => {
                if (response.error == "Tên loại khu cắm trại đã tồn tại.") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên loại khu cắm trại đã tồn tại.',

                    });
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khu cắm trại thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khu cắm trại thành công',
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

                await campgroundApi.getAllCampgrounds().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            } else {
                await campgroundApi.getCampgroundsByUserId(user.id).then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            }
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await campgroundApi.deleteCampground(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa vì nó đã được sử dụng trong một sự kiện hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khu cắm trại khu cắm trại thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khu cắm trại khu cắm trại thành công',

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
            try {
                const response = await campgroundApi.getCampgroundById(id);
                setId(id);
                if (response) {
                    const { name, id_category, address, description, image, amenities, price, gps_location, regulations, policies, id_user, status, max_guests } = response;

                    // Set các trường về lại form
                    form2.setFieldsValue({
                        name,
                        address,
                        description,
                        image,
                        amenities,
                        price,
                        gps_location,
                        regulations,
                        policies,
                        id_user,
                        status,
                        max_guests,
                        id_category
                    });
                }
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleUnBanAccount = async (data) => {
        console.log(data);

        try {
            await campgroundApi.approveCampground(data.id).then(response => {
                if (response.message === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Phê duyệt thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Phê duyệt thành công',

                    });
                }
                handleCategoryList();
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleBanAccount = async (data) => {
        console.log(data);
        try {
            await campgroundApi.denyCampground(data.id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Từ chối thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Từ chối thành công',

                    });
                }
                handleCategoryList();

            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleFilter = async (name) => {
        try {
            const user = getItemFromLocalStorage("user");
            if (user.role == "isAdmin") {
                const res = await campgroundApi.searchCampgrounds(name.target.value);
                setCategory(res);
            } else {
                const res = await campgroundApi.searchCampgroundsByUser(name.target.value, user.id);
                setCategory(res);
            }
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

    // Function to open modal
    const openDescriptionModal = (description) => {
        setSelectedDescription(description);
        setDescriptionModalVisible(true);
    };

    // Function to close modal
    const closeDescriptionModal = () => {
        setDescriptionModalVisible(false);
    };


    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '10%'
        },
        {
            title: 'Tên',
            dataIndex: 'name', // Trường dữ liệu tương ứng
            key: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address', // Trường dữ liệu tương ứng
            key: 'address',
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'category_name', // Trường dữ liệu tương ứng
            key: 'category_name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            className: 'description-column',
        },
        {
            title: 'Giá',
            dataIndex: 'price', // Trường dữ liệu tương ứng
            key: 'price',
        },
        {
            title: 'Vị trí GPS',
            dataIndex: 'gps_location', // Trường dữ liệu tương ứng
            key: 'gps_location',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status', // Trường dữ liệu tương ứng
            key: 'status',
            render: (status) => (
                <span>
                    {status === 'approved' ? 'Phê duyệt' : 'chờ phê duyệt'}
                </span>
            ),
        },
        {
            title: 'Số khách tối đa',
            dataIndex: 'max_guests', // Trường dữ liệu tương ứng
            key: 'max_guests',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Button
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                                onClick={() => openDescriptionModal(record.description)}>Chi tiết</Button>

                            {getItemFromLocalStorage("user").role !== "isAdmin" ? (
                                <>
                                    <Button
                                        size="small"
                                        icon={<EditOutlined />}
                                        style={{ marginTop: 10, width: 150, borderRadius: 15, height: 30 }}
                                        onClick={() => handleEditCategory(record.id)}
                                    >{"Chỉnh sửa"}
                                    </Button>
                                    <div
                                        style={{ marginTop: 10 }}>
                                        <Popconfirm
                                            title="Bạn có chắc chắn xóa khu cắm trại khu cắm trại này?"
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
                                </>) :
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div>
                                            <Popconfirm
                                                title="Bạn muốn phê duyệt khu cắm trại này?"
                                                onConfirm={() => handleUnBanAccount(record)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    size="small"
                                                    icon={<CheckCircleOutlined />}
                                                    style={{ width: 170, borderRadius: 15, height: 30 }}
                                                >
                                                    {"Phê duyệt"}
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                        <div style={{ marginTop: 10 }}>
                                            <Popconfirm
                                                title="Bạn muốn từ chối khu cắm trại này?"
                                                onConfirm={() => handleBanAccount(record)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    size="small"
                                                    icon={<StopOutlined />}
                                                    style={{ width: 170, borderRadius: 15, height: 30 }}
                                                >
                                                    {"chờ phê duyệt"}
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    </div>

                                </>
                            }

                        </div>
                    </Row>
                </div >
            ),
        },
    ];

    const [categoryCamping, setCategoryCamping] = useState();


    useEffect(() => {
        (async () => {
            try {
                await categoryApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setCategoryCamping(res.categories);
                    setLoading(false);
                });

                const user = getItemFromLocalStorage("user");
                if (user.role == "isAdmin") {

                    await campgroundApi.getAllCampgrounds().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await campgroundApi.getCampgroundsByUserId(user.id).then((res) => {
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
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý khu cắm trại</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Modal
                        title="Mô tả chi tiết"
                        visible={descriptionModalVisible}
                        onCancel={closeDescriptionModal}
                        footer={null}
                    >
                        <p>{selectedDescription}</p>
                    </Modal>

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
                                                {getItemFromLocalStorage("user").role !== "isAdmin" ? <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo khu cắm trại</Button> : null}
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
                    title="Tạo khu cắm trại mới"
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
                        name="campgroundCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa chỉ" />
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
                            name="id_category"
                            label="Danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categoryCamping?.map(fieldType => (
                                    <Select.Option key={fieldType.id} value={fieldType.id}>
                                        {fieldType.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="amenities"
                            label="Tiện nghi"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng tiện nghi!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Tiện nghi" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Giá" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="gps_location"
                            label="Vị trí GPS (16, 108)"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vị trí gps!',
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.reject('Vui lòng nhập vị trí gps!');
                                        }
                                        const regex = /^\d+(\.\d+)?\s*,\s*\d+(\.\d+)?$/; // Biểu thức chính quy để kiểm tra số và dấu phẩy
                                        if (regex.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Vui lòng nhập vị trí GPS đúng định dạng (chỉ số và dấu phẩy).');
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="Vị trí GPS" />
                        </Form.Item>

                        <Form.Item
                            name="regulations"
                            label="Quy định"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập quy định!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Quy định" />
                        </Form.Item>
                        <Form.Item
                            name="policies"
                            label="Chính sách"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chính sách!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Chính sách" />
                        </Form.Item>
                        <Form.Item
                            name="max_guests"
                            label="Số khách tối đa"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số khách tối đa!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Số khách tối đa" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="attachment"
                            label="Chọn ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh!',
                                },
                            ]}
                        >

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChangeImage}
                                id="avatar"
                                name="file"
                            />
                        </Form.Item>
                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa khu cắm trại khu cắm trại"
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
                        name="campgroundCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa chỉ" />
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
                            name="id_category"
                            label="Danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categoryCamping?.map(fieldType => (
                                    <Select.Option key={fieldType.id} value={fieldType.id}>
                                        {fieldType.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="amenities"
                            label="Tiện nghi"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng tiện nghi!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Tiện nghi" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Giá" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="gps_location"
                            label="Vị trí GPS"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập vị trí gps cách nhau bằng dấu ,!',
                                },
                            ]}
                        >
                            <Input placeholder="Vị trí GPS" />
                        </Form.Item>
                        <Form.Item
                            name="regulations"
                            label="Quy định"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập quy định!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Quy định" />
                        </Form.Item>
                        <Form.Item
                            name="policies"
                            label="Chính sách"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chính sách!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Chính sách" />
                        </Form.Item>
                        <Form.Item
                            name="max_guests"
                            label="Số khách tối đa"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số khách tối đa!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Số khách tối đa" style={{ width: '100%' }} />
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
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default AreaManagement;