import { Card, Row, Col, Table, Tag, Progress, Button, Select, DatePicker, Space } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  UserOutlined,
  ReloadOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ImprovedDashboard() {
  const { students, leads, payments, stats, monthlyStats: monthlyData, statusBreakdown } = useData();
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [animatedStats, setAnimatedStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    revenue: 0,
  });

  const statusData = statusBreakdown;
  
  // New Analytics Data
  const totalRevenue = useMemo(() => payments.reduce((acc, curr) => acc + curr.amount, 0), [payments]);
  
  const funnelData = useMemo(() => {
      const totalEnquiries = leads.length;
      const interested = leads.filter(e => e.status !== 'New' && e.status !== 'Lost').length;
      const visits = leads.filter(e => e.status === 'Visit Scheduled' || e.status === 'Admitted' || e.status === 'Application Submitted').length;
      const applications = students.length; 
      const admissions = students.filter(s => s.status === 'approved').length;

      return [
          { value: totalEnquiries, name: 'Enquiries', fill: '#0088FE' },
          { value: interested, name: 'Interested', fill: '#00C49F' },
          { value: visits, name: 'Visits', fill: '#FFBB28' },
          { value: applications, name: 'Applications', fill: '#FF8042' },
          { value: admissions, name: 'Admissions', fill: '#8884d8' }
      ];
  }, [students, leads]);

  const sourceData = useMemo(() => {
      const counts = {};
      leads.forEach(e => {
          counts[e.source] = (counts[e.source] || 0) + 1;
      });
      return Object.keys(counts).map(k => ({ name: k, count: counts[k] }));
  }, [leads]);


  // Animate stats on load
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalApplications: Math.floor(stats.totalApplications * progress),
        approved: Math.floor(stats.approved * progress),
        pending: Math.floor(stats.pending * progress),
        revenue: Math.floor(totalRevenue * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats({
            ...stats,
            revenue: totalRevenue
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats, totalRevenue]);

  const filteredStudents = useMemo(() => {
    if (filterStatus === 'all') return students;
    return students.filter((s) => s.status === filterStatus);
  }, [students, filterStatus]);

  const recentStudents = filteredStudents.slice(0, 10).map((student) => ({
    key: student.id,
    name: `${student.firstName} ${student.lastName}`,
    email: student.email,
    status: student.status,
    admissionDate: student.admissionDate,
    score: Math.floor(Math.random() * 100) + 1, // Mock score
  }));

  const statusColors = {
    approved: '#52c41a',
    pending: '#faad14',
    processing: '#1890ff',
    rejected: '#ff4d4f',
  };

  const approvalRate = ((stats.approved / stats.totalApplications) * 100).toFixed(1);
  const pendingRate = ((stats.pending / stats.totalApplications) * 100).toFixed(1);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag
          color={statusColors[status] || 'blue'}
          style={{ fontWeight: 500, textTransform: 'capitalize' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Progress
            percent={score}
            size="small"
            strokeColor={score > 75 ? '#52c41a' : score > 50 ? '#faad14' : '#ff4d4f'}
            style={{ width: '60px' }}
          />
          <span style={{ fontWeight: 500 }}>{score}</span>
        </div>
      ),
    },
    {
      title: 'Admission Date',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      sorter: (a, b) => new Date(a.admissionDate) - new Date(b.admissionDate),
    },
  ];

  // Common card style with fixed height
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '140px',
  };

  const cardBodyStyle = {
    height: '100%',
    padding: '20px',
  };

  const cardHoverHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    },
  };

  return (
    <div style={{ padding: '24px',  minHeight: '100vh' }}>
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: 'bold' }}>
              Admission Management Dashboard
            </h1>
            <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
              Monitor and manage student applications in real-time
            </p>
          </div>
          <Space>
            <RangePicker style={{ borderRadius: '6px' }} />
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              style={{ borderRadius: '6px', background: 'rgba(255,255,255,0.2)', border: 'none' }}
            >
              Refresh
            </Button>
          </Space>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle} bodyStyle={cardBodyStyle} hoverable {...cardHoverHandlers}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                  Total Applications
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
                  {animatedStats.totalApplications}
                </div>
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  <RiseOutlined /> +12% from last month
                </div>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileTextOutlined style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle} bodyStyle={cardBodyStyle} hoverable {...cardHoverHandlers}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                  Approved
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a', marginBottom: '8px' }}>
                  {animatedStats.approved}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  {approvalRate}% approval rate
                </div>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlined style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle} bodyStyle={cardBodyStyle} hoverable {...cardHoverHandlers}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                  Pending Review
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14', marginBottom: '8px' }}>
                  {animatedStats.pending}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Result awaiting
                </div>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ClockCircleOutlined style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle} bodyStyle={cardBodyStyle} hoverable {...cardHoverHandlers}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>
                  Total Revenue
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', marginBottom: '8px' }}>
                  ₹{animatedStats.revenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Lifetime collection
                </div>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <DollarCircleOutlined style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                Monthly Admissions Trend
              </span>
            }
            bordered={false}
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none' }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#8c8c8c" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8c8c8c" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="admissions"
                  stroke="#1890ff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAdmissions)"
                />
                <Area
                  type="monotone"
                  dataKey="approvals"
                  stroke="#52c41a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorApprovals)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <span style={{ fontSize: '16px', fontWeight: 600 }}>
                Status Distribution
              </span>
            }
            bordered={false}
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none' }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart margin={{ top: 0, right: 80, left: 80, bottom: 0 }}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Admission Conversion Funnel</span>}
                bordered={false}
                style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none' }}
              >
                  <ResponsiveContainer width="100%" height={300}>
                    <FunnelChart>
                        <Tooltip />
                        <Funnel
                            dataKey="value"
                            data={funnelData}
                            isAnimationActive
                        >
                            <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                        </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
              </Card>
          </Col>
          <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Enquiry Sources</span>}
                bordered={false}
                style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none' }}
              >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sourceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                            {sourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                            ))}
                        </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              </Card>
          </Col>
      </Row>

      {/* Recent Students Table */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>Recent Applications</span>
            <Select
              defaultValue="all"
              style={{ width: 140, borderRadius: '6px' }}
              onChange={setFilterStatus}
            >
              <Option value="all">All Status</Option>
              <Option value="approved">Approved</Option>
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </div>
        }
        bordered={false}
        style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none' }}
      >
        <Table
          columns={columns}
          dataSource={recentStudents}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} applications`,
          }}
          style={{ overflowX: 'auto' }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}