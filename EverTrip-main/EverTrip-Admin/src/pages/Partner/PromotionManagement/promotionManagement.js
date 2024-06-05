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
import voucherApi from "../../../apis/voucherApi";
import "./promotionManagement.css";
import moment from 'moment';
import dayjs from 'dayjs';
import { getItemFromLocalStorage } from '../../../apis/storageService';

const { Option } = Select;

const PromotionManagement = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        // eslint-disable-next-line no-useless-catch
        try {
            const voucherData = {
                "voucher_code": values.voucher_code,
                "discount_rate": values.discount_rate,
                "voucher_type": values.voucher_type,
                "description": values.description,
                "expiry_date": values.expiry_date.format("YYYY-MM-DD"),
                "quantity": values.quantity,
                "max_discount": values.max_discount,
                "id_user": getItemFromLocalStorage("user").id,

            };

            return voucherApi.createVoucher(voucherData).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên voucher không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo voucher thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo voucher thành công',
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
                "voucher_code": values.voucher_code,
                "discount_rate": values.discount_rate,
                "voucher_type": values.voucher_type,
                "description": values.description,
                "expiry_date": values.expiry_date.format("YYYY-MM-DD"),
                "quantity": values.quantity,
                "max_discount": values.max_discount,
            }
            return voucherApi.updateVoucher(id, categoryList).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên voucher không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa voucher thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa voucher thành công',
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

                await voucherApi.getAllvoucher().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            } else {
                await voucherApi.getVoucherByUserId(user.id).then((res) => {
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
            await voucherApi.deleteVoucher(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa voucher vì nó đã được sử dụng trong một sự kiện hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa voucher thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa voucher thành công',

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
                const response = await voucherApi.getVoucherById(id);
                setId(id);
                form2.setFieldsValue({
                    voucher_code: response[0].voucher_code,
                    discount_rate: response[0].discount_rate,
                    voucher_type: response[0].voucher_type,
                    description: response[0].description,
                    expiry_date: moment(response[0].expiry_date),
                    quantity: response[0].quantity,
                    max_discount: response[0].max_discount
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
            const user = getItemFromLocalStorage("user");
            if (user.role == "isAdmin") {
                const res = await voucherApi.searchvoucher(name.target.value);
                setCategory(res);
            } else {
                const res = await voucherApi.searchVoucherByUser(name.target.value, user.id);
                setCategory(res);
            }
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Mã khuyến mãi',
            dataIndex: 'voucher_code',
            key: 'voucher_code',
        },
        {
            title: 'Tỷ lệ giảm giá (%)',
            dataIndex: 'discount_rate',
            key: 'discount_rate',
            render: (text) => `${parseFloat(text).toFixed(2)}%`,
        },
        {
            title: 'Loại voucher',
            dataIndex: 'voucher_type',
            key: 'voucher_type',
            render: (text) => {
                // Thực hiện xử lý dựa trên loại voucher, ví dụ: nếu voucher_type là 1 thì hiển thị "Loại 1", ...
                return `Loại ${text}`;
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiry_date',
            key: 'expiry_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giảm tối đa',
            dataIndex: 'max_discount',
            key: 'max_discount',
            render: (text) => `$${parseFloat(text).toFixed(2)}`,
        },
        {
            title: 'Người tạo',
            dataIndex: 'id_user',
            key: 'id_user',
            // Bạn có thể thêm logic để hiển thị tên người tạo dựa trên id_user nếu cần
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
                                title="Bạn có chắc chắn xóa voucher này?"
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

                    await voucherApi.getAllvoucher().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await voucherApi.getVoucherByUserId(user.id).then((res) => {
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
                                <span>Quản lý voucher</span>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo voucher</Button>
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
                    title="Tạo voucher mới"
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
                                name="voucher_code"
                                label="Mã voucher"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mã voucher!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Mã voucher" />
                            </Form.Item>

                            <Form.Item
                                name="discount_rate"
                                label="Phần trăm voucher"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập phần trăm voucher!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input type="number" placeholder="Phần trăm voucher" />
                            </Form.Item>

                            <Form.Item
                                name="expiry_date"
                                label="Ngày hết hạn"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày hết hạn!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <DatePicker style={{ width: '100%' }} />
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
                                name="max_discount"
                                label="Giảm tối đa"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giảm tối đa!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Giảm tối đa" style={{ width: '100%' }} />
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
                                name="voucher_type"
                                label="Loại voucher"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại voucher!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn loại voucher">
                                    <Select.Option value="1">Loại 1</Select.Option>
                                    <Select.Option value="2">Loại 2</Select.Option>
                                </Select>
                            </Form.Item>
                        </Spin>
                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa voucher"
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
                                name="voucher_code"
                                label="Mã voucher"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mã voucher!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Mã voucher" />
                            </Form.Item>

                            <Form.Item
                                name="discount_rate"
                                label="Phần trăm voucher"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập phần trăm voucher!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input type="number" placeholder="Phần trăm voucher" />
                            </Form.Item>

                            <Form.Item
                                name="expiry_date"
                                label="Ngày hết hạn"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày hết hạn!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <DatePicker style={{ width: '100%' }} />
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
                                name="max_discount"
                                label="Giảm tối đa"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giảm tối đa!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Giảm tối đa" style={{ width: '100%' }} />
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
                                name="voucher_type"
                                label="Loại voucher"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại voucher!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn loại voucher">
                                    <Select.Option value="1">Loại 1</Select.Option>
                                    <Select.Option value="2">Loại 2</Select.Option>
                                </Select>
                            </Form.Item>
                        </Spin>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default PromotionManagement;