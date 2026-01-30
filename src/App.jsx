import { useState } from 'react'
import { Layout, Menu, theme, Button, Drawer } from 'antd'
import {
  DashboardOutlined,
  FormOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  FileExcelOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarCircleOutlined,
  SettingOutlined,
  UserAddOutlined,
  TeamOutlined
} from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import AdmissionForm from './pages/AdmissionForm'
import StudentsList from './pages/StudentsList'
import DocumentManagement from './pages/DocumentManagement'
import StatusTracking from './pages/StatusTracking'
import Reports from './pages/Reports'
import LeadDashboard from './pages/Leads/LeadDashboard'
import EnquiryForm from './pages/Leads/EnquiryForm'
import FeeManagement from './pages/FeeManagement'
import Settings from './pages/Settings'
import { DataProvider } from './context/DataContext'
import './App.css'

const { Header, Sider, Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('dashboard')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const { token } = theme.useToken()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible)
  }

  const handleMenuClick = (key) => {
    setSelectedKey(key)
    setDrawerVisible(false)
  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'lead-dashboard',
      icon: <TeamOutlined />,
      label: 'Leads & Enquiries',
    },
    {
      key: 'new-enquiry',
      icon: <UserAddOutlined />,
      label: 'Capture Enquiry',
    },
    {
      key: 'admission-form',
      icon: <FormOutlined />,
      label: 'Admission Form',
    },
    {
      key: 'students-list',
      icon: <UnorderedListOutlined />,
      label: 'Students Database',
    },
    {
      key: 'documents',
      icon: <FileTextOutlined />,
      label: 'Documents',
    },
    {
      key: 'fee-management',
      icon: <DollarCircleOutlined />,
      label: 'Fee Management',
    },
    {
      key: 'status',
      icon: <CheckCircleOutlined />,
      label: 'Status Tracking',
    },
    {
      key: 'reports',
      icon: <FileExcelOutlined />,
      label: 'Reports & Export',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'System Settings',
    },
  ]

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />
      case 'lead-dashboard':
        return <LeadDashboard onNavigate={handleMenuClick} />
      case 'new-enquiry':
        return <EnquiryForm />
      case 'admission-form':
        return <AdmissionForm />
      case 'students-list':
        return <StudentsList />
      case 'documents':
        return <DocumentManagement />
      case 'fee-management':
        return <FeeManagement />
      case 'status':
        return <StatusTracking />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <DataProvider>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Desktop Sidebar */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={280}
          style={{
            background: token.colorBgContainer,
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
          }}
          className="ant-layout-sider fixed-sidebar"
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true)
            }
          }}
        >
          <div
            style={{
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: `1px solid ${token.colorBorder}`,
              fontSize: '18px',
              fontWeight: 'bold',
              color: token.colorPrimary,
              padding: '0 16px',
            }}
          >
            {!collapsed && <span>Admission Management </span>}
            {collapsed && <span style={{ fontSize: '20px' }}>A</span>}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={(e) => handleMenuClick(e.key)}
            style={{ border: 'none' }}
          />
        </Sider>

        <Layout className={`site-layout ${collapsed ? 'collapsed' : ''}`} style={{ minHeight: '100vh' }}>

          <Header
            style={{
              padding: '0 24px',
              background: token.colorBgContainer,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapsed}
                style={{ fontSize: '16px' }}
              />
              <h1
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: token.colorTextHeading,
                  display: 'none',
                }}
                className="desktop-title"
              >
                Admission Management System
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuFoldOutlined />}
              onClick={toggleDrawer}
              style={{ fontSize: '16px', display: 'none' }}
              className="mobile-menu-btn"
            />
          </Header>

          <Content
            style={{
              padding: '24px',
              background: '#fafafa',
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>

        {/* Mobile Drawer Navigation */}
        <Drawer
          title="Navigation"
          placement="left"
          onClose={toggleDrawer}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="vertical"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={(e) => handleMenuClick(e.key)}
            style={{ border: 'none' }}
          />
        </Drawer>
      </Layout>
    </DataProvider>
  )
}

export default App
