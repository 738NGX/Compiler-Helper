import './App.css'
import { Outlet } from 'react-router'
import { ConfigProvider, theme, Layout } from 'antd'
import GlobalNav from './components/global-nav/global-nav'
const { Content, Footer } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

function App() {
  return (
    <>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Layout hasSider>
          <div className="sidebar" style={siderStyle}>
            <div className="demo-logo-vertical" />
            <GlobalNav />
          </div>
          <Layout>
            <Content className="content" style={{ padding: '1rem', overflow: 'initial' }}>
              <Outlet />
            </Content>
            <Footer className="content" style={{ textAlign: 'center' }}>
              Compiler-Helper ©{new Date().getFullYear()} 738ngx.site
            </Footer>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App
