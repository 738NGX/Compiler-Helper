import './App.css'
import { Outlet } from 'react-router'
import { ConfigProvider, theme, Layout } from 'antd'
import GlobalNav from './components/global-nav/global-nav'
import { useEffect, useState } from 'react';
import { usePrefersColorScheme } from './hooks/usePrefersColorScheme';
import { createContext } from 'react';
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

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<{
  dark: boolean
  setDark: React.Dispatch<React.SetStateAction<boolean>>
}>({
  dark: false,
  setDark: () => { }
});

function App() {
  const [dark, setDark] = useState(usePrefersColorScheme()=== 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <ConfigProvider theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
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
    </ThemeContext.Provider>
  )
}

export default App
