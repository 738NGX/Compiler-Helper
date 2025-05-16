import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { NavLink, useLocation } from 'react-router';
import {
  HomeOutlined,
  BookOutlined,
  FontSizeOutlined,
  AlignLeftOutlined,
} from '@ant-design/icons';

type BaseMenuItem = NonNullable<MenuProps['items']>[number];
type MenuItemWithPath = BaseMenuItem & {
  path?: string;
  children?: MenuItemWithPath[];
};

const items: MenuItemWithPath[] = [
  {
    key: '0',
    icon: <HomeOutlined />,
    label: <NavLink to="/Compiler-Helper/">主页</NavLink>,
    path: '/',
  },
  {
    key: '1',
    icon: <BookOutlined />,
    label: '第一章 引论',
    children: [
      { key: '11', label: <NavLink to="/Compiler-Helper/brief/1">主要知识点</NavLink>, path: '/brief/1' },
      { key: '12', label: <NavLink to="/Compiler-Helper/exercise/1">习题</NavLink>, path: '/exercise/1' },
    ],
  },
  {
    key: '2',
    icon: <FontSizeOutlined />,
    label: '第二章 词法分析',
    children: [
      { key: '21', label: <NavLink to="/Compiler-Helper/brief/2">主要知识点</NavLink>, path: '/brief/2' },
      { key: '22', label: <NavLink to="/Compiler-Helper/regex-converter">正规式转换器</NavLink>, path: '/regex-converter' },
    ],
  },
  {
    key: '3',
    icon: <AlignLeftOutlined />,
    label: '第三章 语法分析',
    children: [
      { key: '31', label: <NavLink to="/Compiler-Helper/brief/3">主要知识点</NavLink>, path: '/brief/3' },
      { key: '32', label: <NavLink to="/Compiler-Helper/leftmost-derivation">最左推导与分析树</NavLink>, path: '/leftmost-derivation' },
    ],
  },
];

const findKeyPath = (
  menuItems: MenuItemWithPath[],
  pathname: string,
  parentKeys: string[] = []
): string[] => {
  for (const item of menuItems) {
    const newKeys = [...parentKeys, String(item.key)];
    if (item.path === pathname) {
      return newKeys;
    }
    if (item.children) {
      const res = findKeyPath(item.children, pathname, newKeys);
      if (res.length) return res;
    }
  }
  return [];
};

export default function GlobalNav() {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    // 去掉 /Compiler-Helper 前缀
    const cleanPath = location.pathname.replace(/^\/Compiler-Helper/, '') || '/';
    const keyPath = findKeyPath(items, cleanPath);
    if (keyPath.length) {
      setSelectedKeys([keyPath[keyPath.length - 1]]);
      setOpenKeys(keyPath.slice(0, -1));
    } else {
      setSelectedKeys(['0']);
      setOpenKeys([]);
    }
  }, [location.pathname]);


  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    setOpenKeys(keys as string[]);
  };

  return (
    <Menu
      mode="inline"
      theme="dark"
      items={items}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={onOpenChange}
    />
  );
}
