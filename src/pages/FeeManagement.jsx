import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  Tabs,
  message,
  Tooltip
} from 'antd';
import {
  DollarCircleOutlined,
  BankOutlined,
  HistoryOutlined,
  PlusOutlined,
  SearchOutlined,
  FileTextOutlined,
  PrinterOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useData } from '../context/DataContext';

const { Option } = Select;

const FeeManagement = () => {
  const { payments, addPayment, students } = useData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Mock Fee Structure Data
  const [feeStructure, setFeeStructure] = useState([
    { id: 1, name: 'Tuition Fee (Annual)', amount: 50000, frequency: 'Yearly' },
    { id: 2, name: 'Hostel Fee (Sem 1)', amount: 35000, frequency: 'Semester' },
    { id: 3, name: 'Transport Fee', amount: 15000, frequency: 'Yearly' },
    { id: 4, name: 'Library Fee', amount: 2000, frequency: 'One-time' },
    { id: 5, name: 'Admission Fee', amount: 10000, frequency: 'One-time' }
  ]);

  // Calculations
  const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const todaysCollection = payments
    .filter(p => p.date === dayjs().format('YYYY-MM-DD'))
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  // Pending Fees (Mock logic: Assuming each student owes ~100k total, minus what they paid)
  // This is a simplification for the demo
  const pendingFees = useMemo(() => {
     let totalExpected = students.length * 100000; 
     return totalExpected - totalCollected;
  }, [totalCollected, students]);


  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = 
        p.studentName.toLowerCase().includes(searchText.toLowerCase()) || 
        p.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
        p.id.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesType = filterType === 'All' || p.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [payments, searchText, filterType]);

  const handleRecordPayment = (values) => {
    const student = students.find(s => s.id === values.studentId);
    const newPayment = {
      id: `PAY${Date.now()}`,
      studentId: values.studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
      amount: parseFloat(values.amount),
      date: values.date.format('YYYY-MM-DD'),
      type: values.type,
      method: values.method,
      status: 'Completed',
      transactionId: `TXN${Math.floor(Math.random() * 100000000)}`
    };

    addPayment(newPayment);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Payment recorded successfully');
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: text => <span style={{ fontFamily: 'monospace', color: '#666' }}>{text}</span>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text, record) => (
          <div>
              <div style={{ fontWeight: 500 }}>{text}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{record.studentId}</div>
          </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: text => <Tag color="blue">{text}</Tag>
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: amount => <span style={{ fontWeight: 600 }}>₹{amount.toLocaleString()}</span>,
        sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: text => (
          <Tag color={text === 'Online' ? 'green' : text === 'Cash' ? 'gold' : 'cyan'}>
              {text}
          </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Receipt">
             <Button icon={<FileTextOutlined />} size="small" onClick={() => message.info(`Receipt for ${record.id}`)}/>
          </Tooltip>
          <Tooltip title="Print">
             <Button icon={<PrinterOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const feeStructureColumns = [
      { title: 'Fee Type', dataIndex: 'name', key: 'name', render: t => <b>{t}</b> },
      { title: 'Amount', dataIndex: 'amount', key: 'amount', render: a => `₹${a.toLocaleString()}` },
      { title: 'Frequency', dataIndex: 'frequency', key: 'frequency', render: f => <Tag>{f}</Tag> },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Fee Management</h1>
            <p style={{ color: '#666', margin: 0 }}>Manage collections, track dues, and comprehensive financial reports.</p>
        </div>
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => setIsModalVisible(true)}
            style={{ background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', border: 'none' }}
        >
            Record Payment
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic 
                title={<span style={{ fontWeight: 600, color: '#389e0d' }}>Total Collected</span>}
                value={totalCollected} 
                precision={2} 
                prefix="₹" 
                valueStyle={{ color: '#389e0d', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ background: '#fff7e6', borderColor: '#ffd591' }}>
            <Statistic 
                title={<span style={{ fontWeight: 600, color: '#d46b08' }}>Estimated Pending</span>}
                value={pendingFees} 
                precision={2} 
                prefix="₹" 
                valueStyle={{ color: '#d46b08', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
           <Card bordered={false} style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Statistic 
                title={<span style={{ fontWeight: 600, color: '#096dd9' }}>Today's Collection</span>}
                value={todaysCollection} 
                precision={2} 
                prefix="₹" 
                valueStyle={{ color: '#096dd9', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
            defaultActiveKey="1"
            items={[
                {
                    key: '1',
                    label: <span><DollarCircleOutlined /> Transactions</span>,
                    children: (
                        <>
                             <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                                <Input 
                                    placeholder="Search by Student, ID, or Transaction..." 
                                    prefix={<SearchOutlined />} 
                                    style={{ width: 300 }}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                />
                                <Select defaultValue="All" style={{ width: 150 }} onChange={setFilterType}>
                                    <Option value="All">All Types</Option>
                                    <Option value="Tuition Fee">Tuition Fee</Option>
                                    <Option value="Hostel Fee">Hostel Fee</Option>
                                    <Option value="Admission Fee">Admission Fee</Option>
                                </Select>
                             </div>
                             <Table 
                                columns={columns} 
                                dataSource={filteredPayments} 
                                rowKey="id"
                                pagination={{ pageSize: 10 }} 
                                scroll={{ x: 'max-content' }}
                             />
                        </>
                    )
                },
                {
                    key: '2',
                    label: <span><BankOutlined /> Fee Structure</span>,
                    children: (
                        <Table 
                            columns={feeStructureColumns} 
                            dataSource={feeStructure} 
                            rowKey="id"
                            pagination={false}
                            style={{ maxWidth: 800 }}
                            scroll={{ x: 'max-content' }}
                        />
                    )
                }
            ]}
        />
      </Card>

      <Modal
        title="Record New Payment"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
            form={form}
            layout="vertical"
            onFinish={handleRecordPayment}
            initialValues={{
                date: dayjs(),
                method: 'Cash'
            }}
        >
            <Form.Item name="studentId" label="Select Student" rules={[{ required: true }]}>
                <Select placeholder="Search student..." showSearch optionFilterProp="children">
                    {students.map(s => (
                        <Option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.id})</Option>
                    ))}
                </Select>
            </Form.Item>
            
            <Row gutter={16}>
                <Col span={12}>
                     <Form.Item name="type" label="Fee Type" rules={[{ required: true }]}>
                        <Select>
                            {feeStructure.map(f => <Option key={f.id} value={f.name}>{f.name}</Option>)}
                            <Option value="Other">Other</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                        <Input type="number" prefix="₹" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                     <Form.Item name="method" label="Payment Method" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Before">Cash</Option>
                            <Option value="Online">Online / UPI</Option>
                            <Option value="Cheque">Cheque</Option>
                            <Option value="Bank Transfer">Bank Transfer</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                   <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                    Record Payment
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeeManagement;
