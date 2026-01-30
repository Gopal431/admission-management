
import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  message,
  Steps,
  Divider,
  Progress,
  Alert,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useData } from '../context/DataContext';

export default function ImprovedAdmissionForm() {
  const { addStudent } = useData();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newStudent = {
        id: `STU${Date.now()}`,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
        gender: values.gender,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        qualification: values.qualification,
        cgpa: values.cgpa,
        admissionDate: dayjs().format('YYYY-MM-DD'),
        status: 'pending',
        documents: [], // Handle documents properly in real app
        remarks: ''
      };

      addStudent(newStudent);

      message.success({
        content: 'Admission application submitted successfully! 🎉',
        duration: 5,
        style: { marginTop: '20vh' },
      });
      form.resetFields();
      setCurrentStep(0);
      setCompletedSteps([]);
    } catch (error) {
      console.error(error);
      message.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      // Get field names for current step
      const fieldsToValidate = getStepFields(currentStep);
      await form.validateFields(fieldsToValidate);
      
      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('Please fill all required fields correctly');
    }
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'];
      case 1:
        return ['address', 'city', 'state', 'zipCode'];
      case 2:
        return ['qualification', 'cgpa'];
      case 3:
        return []; // File validation usually handled separately or loosely
      default:
        return [];
    }
  };

  const steps = [
    {
      title: 'Personal Info',
      description: 'Basic details',
      icon: <UserOutlined />,
    },
    {
      title: 'Address',
      description: 'Contact info',
      icon: <HomeOutlined />,
    },
    {
      title: 'Education',
      description: 'Qualifications',
      icon: <BookOutlined />,
    },
    {
      title: 'Documents',
      description: 'Upload proofs',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Review',
      description: 'Verify & Submit',
      icon: <CheckCircleOutlined />,
    },
  ];

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: 'bold' }}>
          Student Admission Application
        </h1>
        <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
          Complete the form below to submit your admission application
        </p>
      </div>

      {/* Progress Card */}
      <Card
        bordered={false}
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: 'none',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#262626' }}>Application Progress</span>
            <span style={{ fontWeight: 600, color: '#5f45fb' }}>
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress
            percent={progressPercent}
            strokeColor={{
              '0%': '#5f45fb',
              '100%': '#2da7d6',
            }}
            strokeWidth={10}
            showInfo={false}
            style={{ marginBottom: '16px' }}
          />
        </div>
        <Steps
          current={currentStep}
          items={steps.map((step, index) => ({
            ...step,
            status: completedSteps.includes(index) ? 'finish' : index === currentStep ? 'process' : 'wait',
          }))}
          style={{ marginBottom: '0' }}
        />
      </Card>

      {/* Form Card */}
      <Card
        bordered={false}
        style={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: 'none',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark="optional"
        >
          {/* Step 1: Personal Information */}
          {currentStep === 0 && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    color: '#5f45fb',
                    marginBottom: '8px',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                >
                  Personal Information
                </h2>
                <p style={{ color: '#8c8c8c', margin: 0 }}>
                  Please provide your basic personal details
                </p>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>First Name</span>}
                    name="firstName"
                    rules={[
                      { required: true, message: 'Please enter first name' },
                      { min: 2, message: 'First name must be at least 2 characters' },
                    ]}
                  >
                    <Input
                      placeholder="Enter first name"
                      prefix={<UserOutlined style={{ color: '#5f45fb' }} />}
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Last Name</span>}
                    name="lastName"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                  >
                    <Input
                      placeholder="Enter last name"
                      prefix={<UserOutlined style={{ color: '#5f45fb' }} />}
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Email Address</span>}
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input
                      placeholder="your.email@example.com"
                      prefix={<MailOutlined style={{ color: '#5f45fb' }} />}
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Phone Number</span>}
                    name="phone"
                    rules={[
                      { required: true, message: 'Please enter phone number' },
                      {
                        pattern: /^[+]?[0-9-]{10,}$/,
                        message: 'Please enter a valid phone number',
                      },
                    ]}
                  >
                    <Input
                      placeholder="+1 (555) 000-0000"
                      prefix={<PhoneOutlined style={{ color: '#5f45fb' }} />}
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Date of Birth</span>}
                    name="dateOfBirth"
                    rules={[{ required: true, message: 'Please select date of birth' }]}
                  >
                    <DatePicker
                      style={{ width: '100%', borderRadius: '8px' }}
                      size="large"
                      format="DD/MM/YYYY"
                      placeholder="Select date"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Gender</span>}
                    name="gender"
                    rules={[{ required: true, message: 'Please select gender' }]}
                  >
                    <Select placeholder="Select gender" size="large" style={{ borderRadius: '8px' }}>
                      <Select.Option value="male">Male</Select.Option>
                      <Select.Option value="female">Female</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                      <Select.Option value="prefer-not-to-say">Prefer not to say</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    color: '#5f45fb',
                    marginBottom: '8px',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                >
                  Address Information
                </h2>
                <p style={{ color: '#8c8c8c', margin: 0 }}>
                  Provide your current residential address
                </p>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Street Address</span>}
                    name="address"
                    rules={[{ required: true, message: 'Please enter street address' }]}
                  >
                    <Input
                      placeholder="Enter your street address"
                      prefix={<EnvironmentOutlined style={{ color: '#5f45fb' }} />}
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>City</span>}
                    name="city"
                    rules={[{ required: true, message: 'Please enter city' }]}
                  >
                    <Input
                      placeholder="Enter city"
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>State</span>}
                    name="state"
                    rules={[{ required: true, message: 'Please enter state' }]}
                  >
                    <Input
                      placeholder="Enter state"
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Zip Code</span>}
                    name="zipCode"
                    rules={[
                      { required: true, message: 'Please enter zip code' },
                      { pattern: /^[0-9]{5,6}$/, message: 'Please enter a valid zip code' },
                    ]}
                  >
                    <Input
                      placeholder="Enter zip code"
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 3: Education */}
          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    color: '#5f45fb',
                    marginBottom: '8px',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                >
                  Educational Qualifications
                </h2>
                <p style={{ color: '#8c8c8c', margin: 0 }}>
                  Tell us about your academic background
                </p>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>Highest Qualification</span>}
                    name="qualification"
                    rules={[{ required: true, message: 'Please select qualification' }]}
                  >
                    <Select
                      placeholder="Select your qualification"
                      size="large"
                      style={{ borderRadius: '8px' }}
                    >
                      <Select.Option value="12th Pass (Science)">
                        12th Pass (Science)
                      </Select.Option>
                      <Select.Option value="12th Pass (Commerce)">
                        12th Pass (Commerce)
                      </Select.Option>
                      <Select.Option value="12th Pass (Arts)">12th Pass (Arts)</Select.Option>
                      <Select.Option value="Diploma">Diploma</Select.Option>
                      <Select.Option value="Bachelor's Degree">Bachelor's Degree</Select.Option>
                      <Select.Option value="Master's Degree">Master's Degree</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 500 }}>CGPA / Percentage</span>}
                    name="cgpa"
                    rules={[
                      { required: true, message: 'Please enter CGPA' },
                      {
                        type: 'number',
                        min: 0,
                        max: 10,
                        message: 'CGPA must be between 0 and 10',
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter CGPA (0-10)"
                      step={0.01}
                      min={0}
                      max={10}
                      prefix={<FileTextOutlined style={{ color: '#5f45fb' }} />}
                      size="large"
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Alert
                message="Academic Performance"
                description="Your CGPA will be used to evaluate your admission eligibility. Make sure to enter accurate information."
                type="info"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ color: '#5f45fb', marginBottom: '8px', fontSize: '20px', fontWeight: 600 }}>
                  Upload Documents
                </h2>
                <p style={{ color: '#8c8c8c', margin: 0 }}>
                  Please upload the necessary documents for verification
                </p>
              </div>

              <Row gutter={[16, 16]}>
                 <Col xs={24} md={8}>
                     <Form.Item
                        name="doc10th"
                        label="10th Marksheet"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="PDF or Image, max 2MB"
                     >
                         <div className="upload-box" style={{ border: '1px dashed #d9d9d9', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                             <p><FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} /></p>
                             <p>Click or drag file to upload</p>
                         </div>
                     </Form.Item>
                 </Col>
                 <Col xs={24} md={8}>
                     <Form.Item
                        name="doc12th"
                        label="12th Marksheet"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="PDF or Image, max 2MB"
                     >
                         <div className="upload-box" style={{ border: '1px dashed #d9d9d9', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                             <p><FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} /></p>
                             <p>Click or drag file to upload</p>
                         </div>
                     </Form.Item>
                 </Col>
                 <Col xs={24} md={8}>
                     <Form.Item
                        name="docId"
                        label="ID Proof (Aadhar/Passport)"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="PDF or Image, max 2MB"
                     >
                         <div className="upload-box" style={{ border: '1px dashed #d9d9d9', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                             <p><FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} /></p>
                             <p>Click or drag file to upload</p>
                         </div>
                     </Form.Item>
                 </Col>
              </Row>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 4 && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    color: '#5f45fb',
                    marginBottom: '8px',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                >
                  Review Your Application
                </h2>
                <p style={{ color: '#8c8c8c', margin: 0 }}>
                  Please review all information carefully before submission
                </p>
              </div>

              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(95, 69, 251, 0.05) 0%, rgba(45, 167, 214, 0.05) 100%)',
                  border: '1px solid #e8e8e8',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ color: '#5f45fb', marginBottom: '16px', fontSize: '16px' }}>
                  Personal Information
                </h3>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8c8c8c', fontSize: '12px', display: 'block' }}>
                        Full Name
                      </span>
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>
                        {form.getFieldValue('firstName')} {form.getFieldValue('lastName')}
                      </span>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8c8c8c', fontSize: '12px', display: 'block' }}>
                        Email Address
                      </span>
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>
                        {form.getFieldValue('email')}
                      </span>
                    </div>
                  </Col>
                  {/* ... other fields ... */}
                </Row>
              </Card>

              <Alert
                message="Ready to Submit"
                description="By clicking Submit, you confirm that all information provided is accurate and complete. Your application will be reviewed by our admissions team."
                type="success"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <Divider style={{ margin: '24px 0' }} />
          <Row justify="space-between" gutter={[16, 16]}>
            <Col>
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                size="large"
                icon={<ArrowLeftOutlined />}
                style={{ borderRadius: '8px' }}
              >
                Previous
              </Button>
            </Col>
            <Col>
              {currentStep < 4 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  size="large"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
                    border: 'none',
                  }}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  iconPosition="end"
                  style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #5f45fb 0%, #2da7d6 100%)',
                    border: 'none',
                  }}
                >
                  Submit Application
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      </Card>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}