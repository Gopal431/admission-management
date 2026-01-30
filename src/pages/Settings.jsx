import { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
    Card, 
    Tabs, 
    Button, 
    Input, 
    Form, 
    Modal, 
    message, 
    Table, 
    Tag, 
    Space, 
    Row, 
    Col, 
    Switch, 
    Upload, 
    Avatar, 
    Typography,
    Badge,
    Select,
    Divider,
    List
} from 'antd';
import { 
    PlusOutlined, 
    DeleteOutlined, 
    EditOutlined, 
    SettingOutlined, 
    BgColorsOutlined, 
    UserOutlined, 
    SafetyCertificateOutlined, 
    UploadOutlined,
    BankOutlined,
    GlobalOutlined,
    BellOutlined,
    DollarCircleOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function Settings() {
  const { settings, updateSettings } = useData();
  const { courses, feeTypes, users, institute: generalSettings } = settings;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentType, setCurrentType] = useState(''); // 'course', 'fee', 'user'
  const [form] = Form.useForm();

  const handleDelete = (type, id) => {
    if (type === 'course') updateSettings('courses', courses.filter(c => c.id !== id));
    if (type === 'fee') updateSettings('feeTypes', feeTypes.filter(f => f.id !== id));
    if (type === 'user') updateSettings('users', users.filter(u => u.id !== id));
    message.success('Item deleted successfully');
  };

  const handleAdd = (type) => {
      setCurrentType(type);
      setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const newItem = { id: Date.now(), ...values };
      if (currentType === 'course') updateSettings('courses', [...courses, newItem]);
      if (currentType === 'fee') updateSettings('feeTypes', [...feeTypes, newItem]);
      if (currentType === 'user') updateSettings('users', [...users, { ...newItem, status: 'Active' }]);

      setIsModalVisible(false);
      form.resetFields();
      message.success('Added successfully');
    });
  };

  // Columns for Tables
  const courseColumns = [
    { title: 'Course Name', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
    { title: 'Code', dataIndex: 'code', key: 'code', render: t => <Tag color="blue">{t}</Tag> },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    { title: 'Intake', dataIndex: 'intake', key: 'intake', render: i => <Tag color="green">{i}</Tag> },
    { 
        title: 'Actions', 
        key: 'actions', 
        render: (_, r) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete('course', r.id)} />
    }
  ];

  const feeColumns = [
      { title: 'Fee Head', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
      { title: 'Frequency', dataIndex: 'frequency', key: 'frequency', render: f => <Tag color="cyan">{f}</Tag> },
      { title: 'Type', dataIndex: 'mandatory', key: 'mandatory', render: m => m ? <Badge status="error" text="Mandatory" /> : <Badge status="success" text="Optional" /> },
      { 
        title: 'Actions', 
        key: 'actions', 
        render: (_, r) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete('fee', r.id)} />
      }
  ];

  const userColumns = [
      { title: 'Name', dataIndex: 'name', key: 'name', render: t => <Space><Avatar icon={<UserOutlined />} /> {t}</Space> },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Role', dataIndex: 'role', key: 'role', render: r => <Tag color={r === 'Super Admin' ? 'gold' : 'blue'}>{r}</Tag> },
      { title: 'Status', dataIndex: 'status', key: 'status', render: s => <Tag color="success">{s}</Tag> },
      { 
        title: 'Actions', 
        key: 'actions', 
        render: (_, r) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete('user', r.id)} />
      }
  ];

  return (
    <div style={{ padding: '24px' }}>
      
      {/* Header Section */}
      <div style={{ 
          background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
                <SettingOutlined /> System Configuration
            </h1>
            <p style={{ margin: '8px 0 0', opacity: 0.8 }}>Manage institute details, courses, fees, and user access.</p>
          </div>
          <div>
              <Button ghost icon={<GlobalOutlined />}>Website Settings</Button>
          </div>
      </div>

      <Card bodyStyle={{ padding: 0 }} style={{ overflow: 'hidden', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Tabs 
            tabPosition="left" 
            defaultActiveKey="1"
            size="large"
            tabBarStyle={{ width: 220, paddingTop: 20, background: '#fafafa', height: '600px' }}
        >
          {/* General Settings */}
          <TabPane tab={<span><BankOutlined /> General Profile</span>} key="1">
             <div style={{ padding: '24px' }}>
                 <Title level={4}>Institute Profile</Title>
                 <Divider />
                 <Form layout="vertical" initialValues={generalSettings}>
                     <Row gutter={24}>
                         <Col span={12}>
                             <Form.Item label="Institute Name" name="instituteName">
                                 <Input size="large" />
                             </Form.Item>
                             <Form.Item label="Official Email" name="email">
                                 <Input size="large" />
                             </Form.Item>
                         </Col>
                         <Col span={12}>
                             <Form.Item label="Address" name="address">
                                 <Input.TextArea rows={4} />
                             </Form.Item>
                         </Col>
                     </Row>
                     <Row gutter={24}>
                         <Col span={12}>
                             <Form.Item label="Institute Logo">
                                 <Upload>
                                     <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                 </Upload>
                             </Form.Item>
                         </Col>
                         <Col span={12}>
                             <Form.Item label="Contact Phone" name="phone">
                                 <Input />
                             </Form.Item>
                         </Col>
                     </Row>
                     <Button type="primary" size="large">Save Changes</Button>
                 </Form>
             </div>
          </TabPane>

          {/* User Management */}
          <TabPane tab={<span><SafetyCertificateOutlined /> User Management</span>} key="2">
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                     <Title level={4} style={{ margin: 0 }}>System Users</Title>
                     <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd('user')}>Add User</Button>
                </div>
                <Table columns={userColumns} dataSource={users} rowKey="id" pagination={false} scroll={{ x: true }} />
              </div>
          </TabPane>

          {/* Courses */}
          <TabPane tab={<span><BgColorsOutlined /> Courses & Intake</span>} key="3">
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                     <Title level={4} style={{ margin: 0 }}>Course Management</Title>
                     <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd('course')}>Add Course</Button>
                </div>
                <Table columns={courseColumns} dataSource={courses} rowKey="id" pagination={false} scroll={{ x: true }} />
              </div>
          </TabPane>

          {/* Fee Structure */}
          <TabPane tab={<span><DollarCircleOutlined /> Fee Configuration</span>} key="4">
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                     <Title level={4} style={{ margin: 0 }}>Fee Heads & Structure</Title>
                     <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd('fee')}>Add Fee Head</Button>
                </div>
                <Table columns={feeColumns} dataSource={feeTypes} rowKey="id" pagination={false} scroll={{ x: true }} />
                
                <Divider />
                <Title level={5}>Payment Gateway</Title>
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                    <Space>
                        <Switch checked /> <Text strong>Enable Online Payments</Text>
                    </Space>
                    <p style={{ marginTop: 8, color: '#666' }}>Razorpay Integration Active (Key: rzp_test_...) </p>
                </div>
              </div>
          </TabPane>

           {/* Notifications */}
           <TabPane tab={<span><BellOutlined /> Notifications</span>} key="5">
             <div style={{ padding: '24px' }}>
                 <Title level={4}>Automated Alerts</Title>
                 <Divider />
                 <List
                    itemLayout="horizontal"
                    dataSource={[
                        { title: 'New Enquiry Alert', desc: 'Send email to admin when new enquiry is received' },
                        { title: 'Fee Payment Receipt', desc: 'Send SMS/Email to student on fee payment' },
                        { title: 'Daily Summary', desc: 'Email daily admission summary to Principal' }
                    ]}
                    renderItem={item => (
                        <List.Item actions={[<Switch defaultChecked />]}>
                            <List.Item.Meta
                                avatar={<BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                                title={item.title}
                                description={item.desc}
                            />
                        </List.Item>
                    )}
                 />
             </div>
          </TabPane>

        </Tabs>
      </Card>

      <Modal
        title={`Add New ${currentType === 'course' ? 'Course' : currentType === 'fee' ? 'Fee Type' : 'User'}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          {currentType === 'course' && (
             <>
                <Form.Item name="code" label="Course Code" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
                    <Input placeholder="e.g. 4 Years" />
                </Form.Item>
                <Form.Item name="intake" label="Intake Capacity">
                    <Input type="number" />
                </Form.Item>
             </>
          )}

          {currentType === 'fee' && (
             <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
               <Select options={[
                   { label: 'One-time', value: 'One-time' },
                   { label: 'Yearly', value: 'Yearly' },
                   { label: 'Semester', value: 'Semester' }
               ]} />
             </Form.Item>
          )}

          {currentType === 'user' && (
             <>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                    <Select options={[
                        { label: 'Super Admin', value: 'Super Admin' },
                        { label: 'Counselor', value: 'Counselor' },
                        { label: 'Accountant', value: 'Accountant' }
                    ]} />
                </Form.Item>
             </>
          )}

        </Form>
      </Modal>
    </div>
  );
}


