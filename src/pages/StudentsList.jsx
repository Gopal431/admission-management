import { useState, useMemo } from 'react'
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Select,
  Modal,
  Divider,
  Descriptions,
  Empty,
} from 'antd'
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ClearOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import '../styles/StudentsList.css'
import { useData } from '../context/DataContext'

export default function StudentsList() {
  const { students, deleteStudent } = useData()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const [genderFilter, setGenderFilter] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)

  const filteredStudents = useMemo(() => {
    let result = students

    if (searchText) {
      const lowerSearch = searchText.toLowerCase()
      result = result.filter(
        (student) =>
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(lowerSearch) ||
          student.email.toLowerCase().includes(lowerSearch) ||
          student.phone.includes(searchText),
      )
    }

    if (statusFilter.length > 0) {
      result = result.filter((student) => statusFilter.includes(student.status))
    }

    if (genderFilter.length > 0) {
      result = result.filter((student) => genderFilter.includes(student.gender))
    }

    return result
  }, [students, searchText, statusFilter, genderFilter])

  const handleDelete = (id) => {
    setStudentToDelete(id)
    setDeleteModalVisible(true)
  }

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete)
      setDeleteModalVisible(false)
      setStudentToDelete(null)
    }
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
    setDetailsModalVisible(true)
  }

  const handleClearFilters = () => {
    setSearchText('')
    setStatusFilter([])
    setGenderFilter([])
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          {record.firstName} {record.lastName}
        </Button>
      ),
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          {email}
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Space>
          <PhoneOutlined style={{ color: '#1890ff' }} />
          {phone}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          approved: 'green',
          pending: 'orange',
          processing: 'blue',
          rejected: 'red',
        }
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>
      },
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Rejected', value: 'rejected' },
      ],
    },
    {
      title: 'CGPA',
      dataIndex: 'cgpa',
      key: 'cgpa',
      render: (cgpa) => (cgpa !== undefined && cgpa !== null) ? Number(cgpa).toFixed(2) : 'N/A',
      sorter: (a, b) => (a.cgpa || 0) - (b.cgpa || 0),
    },
    {
      title: 'Admission Date',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
      sorter: (a, b) =>
        new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const statusColors = {
    approved: '#52c41a',
    pending: '#faad14',
    processing: '#1890ff',
    rejected: '#ff4d4f',
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px', color: '#1890ff', fontWeight: 'bold' }}>
        Student Database
      </h1>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search by name, email, or phone"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              mode="multiple"
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'Approved', value: 'approved' },
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Rejected', value: 'rejected' },
              ]}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              mode="multiple"
              placeholder="Filter by gender"
              value={genderFilter}
              onChange={setGenderFilter}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              block
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
              className="clear-filters-btn"
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: '16px', backgroundColor: '#f0f5ff' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <FilterOutlined style={{ color: '#1890ff' }} />
              <span style={{ fontWeight: 500 }}>
                Showing {filteredStudents.length} of {students.length} students
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        {filteredStudents.length === 0 ? (
          <Empty description="No students found matching your criteria" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredStudents.map((student) => ({
              ...student,
              key: student.id,
            }))}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>

      <Modal
        title="Student Details"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedStudent && (
          <div>
            <Descriptions
              bordered
              column={2}
              size="small"
              items={[
                {
                  key: 'id',
                  label: 'Student ID',
                  children: selectedStudent.id,
                },
                {
                  key: 'name',
                  label: 'Full Name',
                  children: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
                },
                {
                  key: 'email',
                  label: 'Email',
                  children: selectedStudent.email,
                },
                {
                  key: 'phone',
                  label: 'Phone',
                  children: selectedStudent.phone,
                },
                {
                  key: 'dob',
                  label: 'Date of Birth',
                  children: selectedStudent.dateOfBirth,
                },
                {
                  key: 'gender',
                  label: 'Gender',
                  children: selectedStudent.gender.charAt(0).toUpperCase() + selectedStudent.gender.slice(1),
                },
                {
                  key: 'address',
                  label: 'Address',
                  children: selectedStudent.address,
                  span: 2,
                },
                {
                  key: 'city',
                  label: 'City',
                  children: selectedStudent.city,
                },
                {
                  key: 'state',
                  label: 'State',
                  children: selectedStudent.state,
                },
                {
                  key: 'zipCode',
                  label: 'Zip Code',
                  children: selectedStudent.zipCode,
                },
                {
                  key: 'qualification',
                  label: 'Qualification',
                  children: selectedStudent.qualification,
                  span: 2,
                },
                {
                  key: 'cgpa',
                  label: 'CGPA',
                  children: selectedStudent.cgpa.toFixed(2),
                },
                {
                  key: 'admissionDate',
                  label: 'Admission Date',
                  children: selectedStudent.admissionDate,
                },
                {
                  key: 'status',
                  label: 'Status',
                  children: (
                    <Tag color={statusColors[selectedStudent.status]}>
                      {selectedStudent.status.toUpperCase()}
                    </Tag>
                  ),
                },
              ]}
            />
            {selectedStudent.remarks && (
              <>
                <Divider />
                <h4>Remarks</h4>
                <p>{selectedStudent.remarks}</p>
              </>
            )}
            {selectedStudent.documents.length > 0 && (
              <>
                <Divider />
                <h4>Documents</h4>
                <Table
                  columns={[
                    { title: 'Document Name', dataIndex: 'name', key: 'name' },
                    { title: 'Type', dataIndex: 'type', key: 'type' },
                    { title: 'Upload Date', dataIndex: 'uploadDate', key: 'uploadDate' },
                  ]}
                  dataSource={selectedStudent.documents}
                  pagination={false}
                  size="small"
                />
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okType="danger"
      >
        <p>Are you sure you want to delete this student record?</p>
        <p style={{ color: '#ff4d4f' }}>
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
