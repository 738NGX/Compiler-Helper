import './App.css'
import { Outlet } from 'react-router'
import { ConfigProvider, theme, Layout, Button, Tooltip } from 'antd'
import GlobalNav from './components/global-nav/global-nav'
import { useEffect, useState } from 'react';
import { usePrefersColorScheme } from './hooks/usePrefersColorScheme';
import { createContext } from 'react';
import {
  GithubOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
};

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<{
  dark: boolean
  setDark: React.Dispatch<React.SetStateAction<boolean>>
}>({
  dark: false,
  setDark: () => { }
});

function App() {
  const [dark, setDark] = useState(usePrefersColorScheme() === 'dark');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const onSiderBreakpoint = (broken: boolean) => {
    if (broken) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <ConfigProvider theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        <Layout>
          <Header style={{ paddingRight: '1rem', paddingLeft: '2rem' }}>
            <div className="h-full flex items-center justify-between text-white">
              <h3>Compiler Helper by 738NGX</h3>
              <div>
                <a className='mr-2' href="https://github.com/738NGX/Compiler-Helper" target="_blank">
                  <Tooltip title="访问Github仓库">
                    <Button type='primary' shape="circle" icon={<GithubOutlined />} />
                  </Tooltip>
                </a>
                <Tooltip title={dark ? '切换到浅色模式' : '切换到深色模式'}>
                  <Button type='primary' onClick={() => setDark(!dark)} shape="circle" icon={dark ? <MoonOutlined /> : <SunOutlined />} />
                </Tooltip>
              </div>
            </div>
          </Header>
          <Layout hasSider>
            <Sider breakpoint="lg" width={256} onBreakpoint={onSiderBreakpoint} style={siderStyle} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
              <div className="demo-logo-vertical" />
              <GlobalNav />
            </Sider>
            <Layout>
              <Content className="content" style={{ padding: '1rem', overflow: 'initial' }}>
                <Outlet />
              </Content>
              <Footer className="content" style={{ textAlign: 'center' }}>
                Compiler-Helper ©{new Date().getFullYear()} 738ngx.site
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export default App
