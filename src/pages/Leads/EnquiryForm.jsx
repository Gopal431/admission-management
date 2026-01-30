'use client';

import { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message,
  Row,
  Col,
  Result,
} from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BookOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { useData } from '../../context/DataContext'

const { Option } = Select

export default function EnquiryForm() {
    const { addLead } = useData()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [enquiryId, setEnquiryId] = useState('')

  const generateEnquiryId = () => {
    const timestamp = Date.now().toString().slice(-6)
    return `ENQ2024${timestamp}`
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newId = generateEnquiryId()
      setEnquiryId(newId)

      const newLead = {
          enquiryId: newId,
          ...values,
          status: 'New',
          date: new Date().toISOString().split('T')[0],
          assignedCounsellor: 'Unassigned',
          followUpLog: [],
          nextFollowUp: null
      }

      addLead(newLead)

      // Simulate Auto-Acknowledgements
      message.success('Enquiry captured successfully!')
      message.info(`ACK Sent: SMS & WhatsApp sent to ${values.mobile}`)
      message.info(`ACK Sent: Brochure emailed to ${values.email}`)

      setSubmitted(true)
      form.resetFields()
    } catch (error) {
      message.error('Failed to capture enquiry.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setEnquiryId('')
  }

  if (submitted) {
    return (
      <Card bordered={false} style={{ padding: '40px', textAlign: 'center' }}>
        <Result
          status="success"
          title="Enquiry Captured Successfully!"
          subTitle={`Enquiry ID: ${enquiryId}. An acknowledgement has been sent to the student.`}
          extra={[
            <Button type="primary" key="new" onClick={handleReset}>
              Capture Another Enquiry
            </Button>,
          ]}
        />
      </Card>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '24px', color: '#1890ff', fontWeight: 'bold' }}>
        Capture New Enquiry
      </h1>

      <Card bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Student Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter student name' },
                  { min: 2, message: 'Name must be at least 2 characters' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter student name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mobile Number"
                name="mobile"
                rules={[
                  { required: true, message: 'Please enter mobile number' },
                  { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10-digit number' },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { type: 'email', message: 'Please enter valid email' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="City / Location"
                name="city"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="Enter city" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Course Interest"
                name="course"
                rules={[{ required: true, message: 'Please select a course' }]}
              >
                <Select placeholder="Select course">
                  <Option value="B.Tech CS">B.Tech CS</Option>
                  <Option value="B.Tech ME">B.Tech ME</Option>
                  <Option value="BBA">BBA</Option>
                  <Option value="MBA">MBA</Option>
                  <Option value="M.Tech">M.Tech</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Source of Enquiry"
                name="source"
                rules={[{ required: true, message: 'Please select source' }]}
              >
                <Select placeholder="Select source">
                  <Option value="Walk-in">Walk-in</Option>
                  <Option value="Phone Call">Phone Call</Option>
                  <Option value="Website">Website Form</Option>
                  <Option value="Referral">Referral</Option>
                  <Option value="Social Media">Social Media</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: '20px' }}>
             <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} block size="large">
                Submit Enquiry
             </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
