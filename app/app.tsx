import { Layout , ConfigProvider, theme } from "antd"
import GlobalNav from "./components/global-nav/global-nav";
import { Outlet } from "react-router";
import "./app.css";

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

export default function AppComponent(){
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Layout hasSider>
        <div className="sidebar" style={siderStyle}>
          <div className="demo-logo-vertical" />
          <GlobalNav />
        </div>
        <Layout>
          <Content className="content" style={{ overflow: 'initial' }}>
            <div
              style={{
                padding: 24,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer className="content" style={{ textAlign: 'center' }}>
            Compiler-Helper ©{new Date().getFullYear()} 738ngx.site
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}