'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Statistic,
  Select,
  Input,
  Drawer,
  Timeline,
  Avatar,
  Divider,
  Form,
  DatePicker,
  message,
  Tabs
} from 'antd';
import {
  PhoneOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  MailOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  EditOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useData } from '../../context/DataContext';

const { TextArea } = Input;
const { Option } = Select;

export default function LeadDashboard({ onNavigate }) {
  const { leads, updateLead, leadStats: stats } = useData();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(lower) ||
          l.mobile.includes(searchText) ||
          l.city.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [leads, statusFilter, searchText]);

  const handleManageLead = (lead) => {
    setSelectedLead(lead);
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedLead(null);
    form.resetFields();
  };

  const handleLogActivity = (values) => {
    const newLog = {
      date: dayjs().format('YYYY-MM-DD'),
      action: values.action,
      notes: values.notes,
    };
    
    // Update local state - in real app this would be an API call
    const updatedLeadData = {
        ...selectedLead,
        followUpLog: [newLog, ...(selectedLead.followUpLog || [])],
        nextFollowUp: values.nextFollowUp ? values.nextFollowUp.format('YYYY-MM-DD') : selectedLead.nextFollowUp
    };

    updateLead(selectedLead.enquiryId, updatedLeadData);
    setSelectedLead(updatedLeadData);
    form.resetFields();
    message.success('Activity logged successfully');
  };

  const handleScheduleVisit = () => {
    form.setFieldsValue({
        action: 'Visit',
        notes: 'Campus Visit Scheduled'
    });
    // Scroll to form
    const formElement = document.getElementById('activity-form');
    if(formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const columns = [
    {
      title: 'Enquiry ID',
      dataIndex: 'enquiryId',
      key: 'enquiryId',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
          <Space>
              <Avatar style={{ backgroundColor: '#1890ff' }}>{text[0]}</Avatar>
              <div>
                  <div style={{ fontWeight: 'bold' }}>{text}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}><EnvironmentOutlined /> {record.city}</div>
              </div>
          </Space>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span><PhoneOutlined /> {record.mobile}</span>
          <span style={{ fontSize: '12px', color: '#888' }}>{record.email}</span>
        </Space>
      ),
    },
    {
      title: 'Course & Status',
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size={2}>
           <span>{record.course}</span>
           <Tag color={
              record.status === 'New' ? 'blue' :
              record.status === 'Contacted' ? 'orange' :
              record.status === 'Admitted' ? 'green' :
              record.status === 'Lost' ? 'red' : 'geekblue'
           }>{record.status.toUpperCase()}</Tag>
        </Space>
      )
    },
    {
      title: 'Next Follow-up',
      dataIndex: 'nextFollowUp',
      key: 'nextFollowUp',
      render: (date) => (
         <Tag icon={<CalendarOutlined />} color={date ? 'purple' : 'default'}>
            {date || 'Not Scheduled'}
         </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleManageLead(record)}>
           Manage Lead
        </Button>
      ),
    },
  ];

  const visitColumns = [
      ...columns.filter(c => c.key !== 'status'),
      {
          title: 'Visit Date',
          dataIndex: 'nextFollowUp',
          key: 'visitDate',
          render: (date) => <Tag color="geekblue" icon={<CalendarOutlined />}>{date}</Tag>
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space>
             <Button type="primary" size="small" onClick={() => handleManageLead(record)}>View</Button>
             <Button size="small" style={{ borderColor: 'green', color: 'green' }}>Complete</Button>
          </Space>
        ),
      }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: '#1890ff', fontWeight: 'bold', fontSize: '24px' }}>Lead Management</h1>
            <p style={{ margin: '4px 0 0', color: '#666' }}>Track and manage student enquiries from initial contact to admission.</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<UserOutlined />}
            onClick={() => onNavigate && onNavigate('new-enquiry')}
          >
            New Enquiry
          </Button>
      </div>

      {/* Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6} md={4}>
           <Card size="small" style={{ borderRadius: '8px' }}><Statistic title="Total Leads" value={stats.total} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
           <Card size="small" style={{ borderRadius: '8px' }}><Statistic title="New Enquiries" value={stats.new} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
           <Card size="small" style={{ borderRadius: '8px' }}><Statistic title="Hot (Interested)" value={stats.interested} valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
           <Card size="small" style={{ borderRadius: '8px' }}><Statistic title="Visits Scheduled" value={stats.visitScheduled} valueStyle={{ color: '#722ed1' }} /></Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
           <Card size="small" style={{ borderRadius: '8px' }}><Statistic title="Converted" value={stats.converted} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
           <Card size="small" style={{ borderRadius: '8px' }}><Statistic title="Lost" value={stats.lost} valueStyle={{ color: '#ff4d4f' }} /></Card>
        </Col>
      </Row>

      <Tabs 
        defaultActiveKey="1" 
        type="card"
        items={[
            {
                key: '1',
                label: 'All Enquiries',
                children: (
                    <>
                        {/* Filter Row */}
                        <Card style={{ marginBottom: '20px', borderRadius: '8px' }}>
                            <Row gutter={16} align="middle">
                                <Col flex="auto">
                                <Input
                                    size="large" 
                                    placeholder="Search by Name, Mobile, City..." 
                                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    style={{ borderRadius: '6px' }}
                                />
                                </Col>
                                <Col flex="200px">
                                <Select
                                    size="large"
                                    style={{ width: '100%' }} 
                                    value={statusFilter} 
                                    onChange={setStatusFilter}
                                    options={[
                                        { label: 'All Statuses', value: 'all' },
                                        { label: 'New', value: 'New' },
                                        { label: 'Contacted', value: 'Contacted' },
                                        { label: 'Interested', value: 'Interested' },
                                        { label: 'Visit Scheduled', value: 'Visit Scheduled' },
                                        { label: 'Admitted', value: 'Admitted' },
                                        { label: 'Lost', value: 'Lost' },
                                    ]}
                                />
                                </Col>
                            </Row>
                        </Card>

                        <Table 
                            columns={columns} 
                            dataSource={filteredLeads} 
                            rowKey="enquiryId"
                            pagination={{ pageSize: 10 }}
                            style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0' }}
                            scroll={{ x: 'max-content' }}
                        />
                    </>
                )
            },
            {
                key: '2',
                label: <span><CalendarOutlined /> Scheduled Visits</span>,
                children: (
                    <Table 
                        columns={visitColumns}
                        dataSource={leads.filter(l => l.status === 'Visit Scheduled' || l.nextFollowUp)}
                        rowKey="enquiryId"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                    />
                )
            }
        ]}
      />

      {/* Drawer for Lead Details */}
      <Drawer
        title="Lead Details & Follow-up"
        placement="right"
        width={600}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        styles={{ body: { paddingBottom: 80 } }}
      >
        {selectedLead && (
           <>
             {/* Header Section */}
             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Space size="middle">
                    <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <div>
                        <h2 style={{ margin: 0 }}>{selectedLead.name}</h2>
                        <div style={{ color: '#666' }}>{selectedLead.enquiryId}</div>
                        <Tag color="blue" style={{ marginTop: '5px' }}>{selectedLead.course}</Tag>
                    </div>
                </Space>
                <Tag color={
                   selectedLead.status === 'New' ? 'blue' :
                   selectedLead.status === 'Contacted' ? 'orange' :
                   selectedLead.status === 'Admitted' ? 'green' : 'default'
                } style={{ fontSize: '14px', padding: '4px 8px' }}>
                    {selectedLead.status}
                </Tag>
             </div>

             {/* Quick Info */}
             <Card size="small" style={{ background: '#f5f5f5', marginBottom: '20px', borderRadius: '8px' }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div style={{ color: '#888', fontSize: '12px' }}>MOBILE</div>
                        <div>{selectedLead.mobile}</div>
                    </Col>
                    <Col span={12}>
                        <div style={{ color: '#888', fontSize: '12px' }}>EMAIL</div>
                        <div>{selectedLead.email}</div>
                    </Col>
                    <Col span={12}>
                        <div style={{ color: '#888', fontSize: '12px' }}>CITY</div>
                        <div>{selectedLead.city}</div>
                    </Col>
                    <Col span={12}>
                        <div style={{ color: '#888', fontSize: '12px' }}>SOURCE</div>
                        <div>{selectedLead.source}</div>
                    </Col>
                </Row>
             </Card>

             {/* Quick Actions */}
             <div style={{ marginBottom: '24px' }}>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Quick Actions</div>
                 <Space wrap>
                     <Button icon={<PhoneOutlined />} onClick={() => window.open(`tel:${selectedLead.mobile}`)}>Call</Button>
                     <Button icon={<WhatsAppOutlined />} style={{ color: '#25D366', borderColor: '#25D366' }} onClick={() => window.open(`https://wa.me/${selectedLead.mobile}`)}>WhatsApp</Button>
                     <Button icon={<MailOutlined />} onClick={() => window.open(`mailto:${selectedLead.email}`)}>Email</Button>
                     <Button icon={<CalendarOutlined />} type="dashed" onClick={handleScheduleVisit}>Schedule Visit</Button>
                 </Space>
             </div>

             <Divider />

             {/* Log Activity Form */}
             <div id="activity-form" style={{ marginBottom: '24px', background: '#f0f5ff', padding: '16px', borderRadius: '8px', border: '1px solid #d6e4ff' }}>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#1d39c4' }}>Log New Activity</div>
                 <Form layout="vertical" form={form} onFinish={handleLogActivity}>
                     <Row gutter={16}>
                         <Col span={12}>
                             <Form.Item name="action" label="Activity Type" rules={[{ required: true }]}>
                                 <Select placeholder="Select action">
                                     <Option value="Call">Call</Option>
                                     <Option value="WhatsApp">WhatsApp Message</Option>
                                     <Option value="Email">Email Sent</Option>
                                     <Option value="Visit">Campus Visit</Option>
                                     <Option value="Counseling">Counseling Session</Option>
                                 </Select>
                             </Form.Item>
                         </Col>
                         <Col span={12}>
                             <Form.Item name="nextFollowUp" label="Next Follow-up">
                                 <DatePicker style={{ width: '100%' }} />
                             </Form.Item>
                         </Col>
                     </Row>
                     <Form.Item name="notes" label="Notes" rules={[{ required: true }]}>
                         <TextArea rows={2} placeholder="Enter details about the interaction..." />
                     </Form.Item>
                     <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>Log Activity</Button>
                 </Form>
             </div>

             {/* Activity Timeline */}
             <div>
                 <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>Activity History</div>
                 <Timeline
                    items={[
                       ...(selectedLead.followUpLog || []).map((log, idx) => ({
                          color: 'blue',
                          children: (
                             <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}>{log.action}</span>
                                    <span style={{ fontSize: '12px', color: '#999' }}>{log.date}</span>
                                </div>
                                <p style={{ margin: 0, color: '#666' }}>{log.notes}</p>
                             </div>
                          )
                       })),
                       { color: 'green', children: 'Enquiry Received', label: selectedLead.date }
                    ]}
                 />
             </div>
           </>
        )}
      </Drawer>
    </div>
  );
}
