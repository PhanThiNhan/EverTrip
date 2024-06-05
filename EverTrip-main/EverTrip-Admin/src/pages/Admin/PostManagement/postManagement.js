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
import postsApi from "../../../apis/postsApi";
import "./postManagement.css";
import { getItemFromLocalStorage } from '../../../apis/storageService';
import uploadFileApi from '../../../apis/uploadFileApi';

const { Option } = Select;


const PostManagement = () => {

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
            "title": values.title,
            "content": values.content,
            "image": file,
            "video": values.video,
            "location": values.location,
            "id_user": getItemFromLocalStorage("user").id,
        };
        try {
            return postsApi.createPost(formData).then(response => {
                if (response.error == "Tên bài đăng đã tồn tại.") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên bài đăng đã tồn tại.',

                    });
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo bài đăng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo bài đăng thành công',
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
            "title": values.title,
            "content": values.content,
            "image": file,
            "video": values.video,
            "location": values.location,
            "id_user": getItemFromLocalStorage("user").id,
        };
        try {
            return postsApi.updatePost(id, formData).then(response => {
                if (response.error == "Tên loại bài đăng đã tồn tại.") {
                    setLoading(false);
                    return notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên loại bài đăng đã tồn tại.',

                    });
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa bài đăng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa bài đăng thành công',
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

                await postsApi.getAllPosts().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            } else {
                await postsApi.getPostsByUserId(user.id).then((res) => {
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
            await postsApi.deletePost(id).then(response => {
                if (response.message === "Không thể xóa bài viết vì nó đang được tham chiếu bởi các bản ghi khác") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa bài viết vì nó đang được tham chiếu bởi các bản ghi khác",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa bài đăng bài đăng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa bài đăng bài đăng thành công',

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
                const response = await postsApi.getPostById(id);
                setId(id);
                if (response) {
                    const { title, content, image, video, location, id_user } = response[0];

                    // Set các trường về lại form
                    form2.setFieldsValue({
                        title,
                        content,
                        image,
                        video,
                        location,
                        id_user
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
            await postsApi.approvePost(data.id).then(response => {
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
            await postsApi.denyPost(data.id).then(response => {
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

                const res = await postsApi.searchPosts(name.target.value);
                setCategory(res);
            }else{
                const res = await postsApi.searchPostsByUser(name.target.value, user.id);
                setCategory(res);
            }
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleLinkClick = (event, link) => {
        event.preventDefault();
        window.open(link, '_blank');
    };



    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '10%'
        },
        {
            title: 'Video',
            key: 'video',
            render: (record) => {

                return (
                    <a href={record.video} onClick={(event) => handleLinkClick(event, record.video)} target="_blank" rel="noopener noreferrer">Xem video</a>
                );
            },
        },

        {
            title: 'Tên',
            dataIndex: 'title', // Thay đổi tên trường dữ liệu tương ứng
            key: 'title',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'location', // Thay đổi tên trường dữ liệu tương ứng
            key: 'location',
        },
        {
            title: 'Mô tả',
            dataIndex: 'content', // Thay đổi tên trường dữ liệu tương ứng
            key: 'content',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span>
                    {status === 'approved' ? 'Phê duyệt' : 'chờ phê duyệt'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        {getItemFromLocalStorage("user").role !== "isAdmin" ? (
                            <>
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                    onClick={() => handleEditCategory(record.id)}
                                >{"Chỉnh sửa"}
                                </Button>
                                <div
                                    style={{ marginLeft: 10 }}>
                                    <Popconfirm
                                        title="Bạn có chắc chắn xóa bài đăng bài đăng này?"
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
                                            title="Bạn muốn phê duyệt bài đăng này?"
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
                                            title="Bạn muốn từ chối bài đăng này?"
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

                    await postsApi.getAllPosts().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await postsApi.getPostsByUserId(user.id).then((res) => {
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
                                <span>Quản lý bài đăng</span>
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
                                                {getItemFromLocalStorage("user").role !== "isAdmin" ? <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo bài đăng</Button> : null}
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
                    title="Tạo bài đăng mới"
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
                            name="title"
                            label="Tiêu đề"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiêu đề!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Nội dung"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nội dung!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Nội dung" />
                        </Form.Item>
                        <Form.Item
                            name="video"
                            label="Video"
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Video" />
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

                <Modal
                    title="Chỉnh sửa bài đăng bài đăng"
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
                            name="title"
                            label="Tiêu đề"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiêu đề!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Nội dung"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nội dung!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Nội dung" />
                        </Form.Item>
                        <Form.Item
                            name="video"
                            label="Video"
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Video" />
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

export default PostManagement;