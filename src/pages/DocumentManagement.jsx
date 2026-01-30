

import { useState, useMemo } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Upload,
  Modal,
  Select,
  Row,
  Col,
  Tag,
  Empty,
  Input,
  message,
  Statistic,
  Tabs,
  Badge
} from 'antd'
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import '../styles/DocumentManagement.css'
import { useData } from '../context/DataContext'

export default function DocumentManagement() {
  const { students, updateStudent } = useData()
  // Derive flat list of documents from students
  const documents = useMemo(() => 
      students.flatMap((student) => 
          (student.documents || []).map(d => ({
              ...d, 
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              status: d.status || 'Pending'
          }))
      ),
  [students]);

  const [searchText, setSearchText] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('all')
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedStudentForUpload, setSelectedStudentForUpload] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [activeTab, setActiveTab] = useState('all');

  const filteredDocuments = useMemo(() => {
    let result = documents

    if (activeTab !== 'all') {
        result = result.filter(d => d.status.toLowerCase() === activeTab.toLowerCase());
    }

    if (selectedStudent !== 'all') {
      result = result.filter((doc) => doc.studentId === selectedStudent)
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase()
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(lowerSearch) ||
          doc.type.toLowerCase().includes(lowerSearch),
      )
    }

    return result
  }, [documents, selectedStudent, searchText, activeTab])

  const getFileIcon = (fileType) => {
    const lower = fileType.toLowerCase()
    if (lower.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />
    if (lower.includes('image')) return <FileImageOutlined style={{ color: '#faad14' }} />
    if (lower.includes('text')) return <FileTextOutlined style={{ color: '#1890ff' }} />
    return <FileOutlined style={{ color: '#666' }} />
  }

  const handleUpload = () => {
    if (!selectedFile || !selectedStudentForUpload || !documentType) {
      message.error('Please fill all fields')
      return
    }

    const newDoc = {
      id: `DOC${Date.now()}`,
      name: selectedFile.name,
      type: documentType,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    }

    const student = students.find(s => s.id === selectedStudentForUpload);
    if(student) {
        updateStudent(student.id, {
            ...student,
            documents: [...(student.documents || []), newDoc]
        });
        message.success('Document uploaded successfully!')
        setUploadModalVisible(false)
        setSelectedFile(null)
        setSelectedStudentForUpload('')
        setDocumentType('')
    }
  }

  const handleDelete = (docId) => {
    const student = students.find(s => (s.documents || []).some(d => d.id === docId));
    if(student) {
        const updatedDocs = student.documents.filter(d => d.id !== docId);
        updateStudent(student.id, { ...student, documents: updatedDocs });
        message.success('Document deleted');
    }
  }

  const handleStatusChange = (docId, newStatus) => {
      const student = students.find(s => (s.documents || []).some(d => d.id === docId));
      if(student) {
          const updatedDocs = student.documents.map(d => d.id === docId ? { ...d, status: newStatus } : d);
          updateStudent(student.id, { ...student, documents: updatedDocs });
          message.success(`Document marked as ${newStatus}`);
      }
  }

  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {getFileIcon(record.type)}
          {name}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a, b) => new Date(a.uploadDate) - new Date(b.uploadDate),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
          <Tag color={
              status === 'Verified' ? 'success' : 
              status === 'Rejected' ? 'error' : 'warning'
          } icon={
              status === 'Verified' ? <CheckCircleOutlined /> : 
              status === 'Rejected' ? <CloseCircleOutlined /> : <ClockCircleOutlined />
          }>
              {status}
          </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => message.info('Download: ' + record.name)}
          >
            view
          </Button>
          {record.status === 'Pending' && (
              <>
                <Button type="text" size="small" style={{ color: 'green' }} onClick={() => handleStatusChange(record.id, 'Verified')}>Approve</Button>
                <Button type="text" size="small" style={{ color: 'red' }} onClick={() => handleStatusChange(record.id, 'Rejected')}>Reject</Button>
              </>
          )}
          <Button
            danger
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px', color: '#1890ff', fontWeight: 'bold' }}>
        Document Management
      </h1>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Documents"
              value={documents.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Verification"
              value={documents.filter((d) => d.status === 'Pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search documents"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={selectedStudent}
              onChange={setSelectedStudent}
              placeholder="Filter by student"
              options={[
                { label: 'All Students', value: 'all' },
                ...students.map((s) => ({
                  label: `${s.firstName} ${s.lastName}`,
                  value: s.id,
                })),
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button
              block
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setUploadModalVisible(true)}
            >
              Upload Document
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block icon={<ClearOutlined />} onClick={() => {
              setSearchText('')
              setSelectedStudent('all')
            }}>
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
                { key: 'all', label: 'All Documents' },
                { key: 'pending', label: <Badge dot={documents.some(d => d.status === 'Pending')} offset={[5, 0]}>Pending Verification</Badge> },
                { key: 'verified', label: 'Verified' },
                { key: 'rejected', label: 'Rejected' },
            ]}
        />
        <Table
            columns={columns}
            dataSource={filteredDocuments.map((doc) => ({ ...doc, key: doc.id }))}
            pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Modal
        title="Upload Document"
        open={uploadModalVisible}
        onOk={handleUpload}
        onCancel={() => setUploadModalVisible(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Select Student:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Choose a student"
              value={selectedStudentForUpload}
              onChange={setSelectedStudentForUpload}
              options={students.map((s) => ({
                label: `${s.firstName} ${s.lastName}`,
                value: s.id,
              }))}
            />
          </div>
          <div>
            <label>Document Type:</label>
            <Input
              placeholder="e.g., PDF, Image, Text"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            />
          </div>
          <Upload
            onChange={(info) => {
              if (info.fileList.length > 0) {
                setSelectedFile(info.fileList[0].originFileObj)
              }
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </div>
      </Modal>
    </div>
  )
}
