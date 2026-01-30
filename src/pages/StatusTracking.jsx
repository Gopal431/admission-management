import { useState, useMemo } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Select,
  Row,
  Col,
  Tag,
  Steps,
  Empty,
  Statistic,
  Timeline,
  message,
} from 'antd'
import {
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
  FilterOutlined,
  ClearOutlined,
} from '@ant-design/icons'
import '../styles/StatusTracking.css'
import { useData } from '../context/DataContext'

export default function StatusTracking() {
  const { students, updateStudent } = useData()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusRemarks, setStatusRemarks] = useState('')
  const [statusHistory, setStatusHistory] = useState({})

  const filteredStudents = useMemo(() => {
    let result = students

    if (searchText) {
      const lowerSearch = searchText.toLowerCase()
      result = result.filter(
        (student) =>
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(lowerSearch) ||
          student.email.toLowerCase().includes(lowerSearch),
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((student) => student.status === statusFilter)
    }

    return result
  }, [students, searchText, statusFilter])

  const statusColorMap = {
    pending: 'orange',
    approved: 'green',
    processing: 'blue',
    rejected: 'red',
  }

  const statusIconMap = {
    pending: <ClockCircleOutlined />,
    approved: <CheckCircleOutlined />,
    processing: <ClockCircleOutlined />,
    rejected: <ExclamationCircleOutlined />,
  }

  const handleStatusUpdate = (student) => {
    setSelectedStudent(student)
    setStatusModalVisible(true)
  }

  const confirmStatusUpdate = () => {
    if (!newStatus || !statusRemarks.trim()) {
      message.error('Please fill all fields')
      return
    }

    updateStudent(selectedStudent.id, { 
        ...selectedStudent, 
        status: newStatus 
    });

    const history = statusHistory[selectedStudent.id] || []
    setStatusHistory({
      ...statusHistory,
      [selectedStudent.id]: [
        ...history,
        {
          timestamp: new Date().toLocaleString(),
          status: newStatus,
          remarks: statusRemarks,
        },
      ],
    })

    message.success('Status updated successfully!')
    setStatusModalVisible(false)
    setNewStatus('')
    setStatusRemarks('')
  }

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Current Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColorMap[status]} icon={statusIconMap[status]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Admission Date',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleStatusUpdate(record)}
        >
          Update Status
        </Button>
      ),
    },
  ]

  const getStatusPercentage = (status) => {
    const count = students.filter((s) => s.status === status).length
    return Math.round((count / students.length) * 100)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px', color: '#1890ff', fontWeight: 'bold' }}>
        Status Tracking & Workflow
      </h1>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved"
              value={getStatusPercentage('approved')}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={getStatusPercentage('pending')}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Processing"
              value={getStatusPercentage('processing')}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rejected"
              value={getStatusPercentage('rejected')}
              suffix="%"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search students"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button block icon={<ClearOutlined />} onClick={() => {
              setSearchText('')
              setStatusFilter('all')
            }}>
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        {filteredStudents.length === 0 ? (
          <Empty description="No students found" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredStudents.map((s) => ({ ...s, key: s.id }))}
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        )}
      </Card>

      <Modal
        title="Update Admission Status"
        open={statusModalVisible}
        onOk={confirmStatusUpdate}
        onCancel={() => setStatusModalVisible(false)}
      >
        {selectedStudent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p><strong>Student:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</p>
              <p><strong>Current Status:</strong> <Tag color={statusColorMap[selectedStudent.status]}>{selectedStudent.status}</Tag></p>
            </div>
            <div>
              <label>New Status:</label>
              <Select
                value={newStatus}
                onChange={setNewStatus}
                style={{ width: '100%' }}
                placeholder="Select new status"
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Processing', value: 'processing' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Rejected', value: 'rejected' },
                ]}
              />
            </div>
            <div>
              <label>Remarks:</label>
              <textarea
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                placeholder="Add remarks"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d9d9d9',
                  minHeight: '80px',
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
