import { useState, useMemo } from 'react'
import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Select,
  DatePicker,
  Table,
  Tag,
  Statistic,
  Tabs,
  Empty,
  message,
} from 'antd'
import {
  FileExcelOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  PrinterOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import '../styles/Reports.css'
import { useData } from '../context/DataContext'

export default function Reports() {
  const { students, stats, statusBreakdown, payments } = useData()
  const [reportType, setReportType] = useState('admissions') // 'admissions' or 'fees'
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState(null)

  // Fee Stats
  const feeStats = useMemo(() => {
      const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
      const today = payments.filter(p => p.date === dayjs().format('YYYY-MM-DD')).reduce((acc, curr) => acc + curr.amount, 0);
      const online = payments.filter(p => p.method !== 'Cash').length;
      const cash = payments.filter(p => p.method === 'Cash').length;
      return { total, today, online, cash };
  }, [payments]);

  const filteredData = useMemo(() => {
    let result = reportType === 'admissions' ? students : payments;

    if (reportType === 'admissions') {
        if (statusFilter !== 'all') {
          result = result.filter((s) => s.status === statusFilter)
        }
        if (dateRange && dateRange[0] && dateRange[1]) {
          const startDate = dateRange[0].format('YYYY-MM-DD')
          const endDate = dateRange[1].format('YYYY-MM-DD')
          result = result.filter(
            (s) => s.admissionDate >= startDate && s.admissionDate <= endDate,
          )
        }
    } else {
        // Fee Filters
        if (dateRange && dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].format('YYYY-MM-DD')
            const endDate = dateRange[1].format('YYYY-MM-DD')
            result = result.filter(
              (p) => p.date >= startDate && p.date <= endDate,
            )
        }
    }

    return result
  }, [students, payments, statusFilter, dateRange, reportType])

  const statusColors = {
    approved: '#52c41a',
    pending: '#faad14',
    processing: '#1890ff',
    rejected: '#ff4d4f',
  }

  const handleExportExcel = () => {
    let dataToExport = [];
    let sheetName = "";

    if (reportType === 'admissions') {
        sheetName = 'Admissions Report';
        dataToExport = filteredData.map((s) => ({
            'Student ID': s.id,
            'First Name': s.firstName,
            'Last Name': s.lastName,
            Email: s.email,
            Phone: s.phone,
            City: s.city,
            Qualification: s.qualification,
            CGPA: s.cgpa,
            Status: s.status,
            'Admission Date': s.admissionDate,
        }));
    } else {
        sheetName = 'Fee Report';
        dataToExport = filteredData.map((p) => ({
            'Transaction ID': p.transactionId,
            'Student Name': p.studentName,
            'Amount': p.amount,
            'Date': p.date,
            'Type': p.type,
            'Method': p.method,
            'Status': p.status
        }));
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, `${sheetName.toLowerCase().replace(' ', '-')}-${new Date().getTime()}.xlsx`)
    message.success('Excel report downloaded!')
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    const title = reportType === 'admissions' ? 'Admission Management Report' : 'Fee Collection Report';
    
    doc.setFontSize(16)
    doc.text(title, 14, 22)
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32)

    if (reportType === 'admissions') {
        const columns = ['ID', 'Name', 'Email', 'City', 'Status', 'CGPA', 'Date']
        const rows = filteredData.map((s) => [
        s.id,
        `${s.firstName} ${s.lastName}`,
        s.email,
        s.city,
        s.status,
        (s.cgpa !== undefined && s.cgpa !== null) ? Number(s.cgpa).toFixed(2) : 'N/A',
        s.admissionDate,
        ])
        doc.autoTable({ head: [columns], body: rows, startY: 40 })
    } else {
        const columns = ['Txn ID', 'Student', 'Amount', 'Date', 'Type', 'Method']
        const rows = filteredData.map((p) => [
            p.transactionId,
            p.studentName,
            p.amount.toString(),
            p.date,
            p.type,
            p.method
        ])
        doc.autoTable({ head: [columns], body: rows, startY: 40 })
    }

    doc.save(`${reportType}-report-${new Date().getTime()}.pdf`)
    message.success('PDF report downloaded!')
  }

  const admissionColumns = [
    {
      title: 'Student Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'CGPA',
      dataIndex: 'cgpa',
      key: 'cgpa',
      render: (cgpa) => (cgpa !== undefined && cgpa !== null) ? Number(cgpa).toFixed(2) : 'N/A',
    },
    {
      title: 'Admission Date',
      dataIndex: 'admissionDate',
      key: 'admissionDate',
    },
  ]

  const feeColumns = [
      { title: 'Transaction ID', dataIndex: 'transactionId', key: 'txnId' },
      { title: 'Student', dataIndex: 'studentName', key: 'student' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount', render: a => `₹${a.toLocaleString()}` },
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Type', dataIndex: 'type', key: 'type' },
      { title: 'Method', dataIndex: 'method', key: 'method', render: m => <Tag>{m}</Tag> },
  ]

  const barChartData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Processing', value: stats.processing },
    { name: 'Rejected', value: stats.rejected },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#1890ff', fontWeight: 'bold' }}>
            Reports & Export
        </h1>
        <Select 
            value={reportType} 
            onChange={setReportType} 
            style={{ width: 200 }} 
            size="large"
        >
            <Select.Option value="admissions">Admissions Report</Select.Option>
            <Select.Option value="fees">Fee Collection Report</Select.Option>
        </Select>
      </div>

      {reportType === 'admissions' ? (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic title="Total Applications" value={stats.totalApplications} />
                </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic
                    title="Approved"
                    value={stats.approved}
                    valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic
                    title="Pending"
                    value={stats.pending}
                    valueStyle={{ color: '#faad14' }}
                    />
                </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                <Card>
                    <Statistic
                    title="Rejected"
                    value={stats.rejected}
                    valueStyle={{ color: '#ff4d4f' }}
                    />
                </Card>
                </Col>
            </Row>
          </>
      ) : (
           <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                <Card>
                    <Statistic title="Total Revenue" value={feeStats.total} prefix="₹" precision={2}/>
                </Card>
                </Col>
                <Col xs={24} sm={8}>
                <Card>
                    <Statistic title="Online Transactions" value={feeStats.online} valueStyle={{ color: '#1890ff' }}/>
                </Card>
                </Col>
                <Col xs={24} sm={8}>
                <Card>
                    <Statistic title="Cash Transactions" value={feeStats.cash} valueStyle={{ color: '#faad14' }}/>
                </Card>
                </Col>
            </Row>
      )}

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
             {reportType === 'admissions' && (
                <Select
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
                style={{ width: '100%' }}
                options={[
                    { label: 'All Status', value: 'all' },
                    { label: 'Approved', value: 'approved' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Rejected', value: 'rejected' },
                ]}
                />
             )}
          </Col>
          <Col xs={24} sm={12} md={8}>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
          <Col xs={24} sm={12} md={10}>
            <Space wrap>
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={handleExportExcel}
              >
                Export Excel
              </Button>
              <Button
                type="default"
                icon={<FilePdfOutlined />}
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {reportType === 'admissions' && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} md={12}>
            <Card title="Status Distribution" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1890ff" />
                </BarChart>
                </ResponsiveContainer>
            </Card>
            </Col>
            <Col xs={24} md={12}>
            <Card title="Status Breakdown" bordered={false}>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            </Card>
            </Col>
        </Row>
      )}

      <Card title={reportType === 'admissions' ? "Admissions Detail" : "Transactions Detail"} bordered={false}>
        {filteredData.length === 0 ? (
          <Empty description="No data available for selected filters" />
        ) : (
          <Table
            columns={reportType === 'admissions' ? admissionColumns : feeColumns}
            dataSource={filteredData.map((s) => ({ ...s, key: s.id || s.transactionId }))}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
    </div>
  )
}

