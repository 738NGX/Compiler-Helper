// app/components/GlobalNav.tsx
import React, { useState } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  AlignLeftOutlined,
  FontSizeOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { usePrefersColorScheme } from '~/hooks/usePrefersColorScheme';
import { NavLink } from 'react-router';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: (<NavLink to="/">第一章 引论</NavLink>),
  },
  {
    key: '2',
    icon: <FontSizeOutlined />,
    label: '第二章 词法分析',
    children: [
      { key: '21', label: (<NavLink to="/regex-converter">正则式转换器</NavLink>) },
    ],
  },
  {
    key: '3',
    icon: <AlignLeftOutlined />,
    label: '第三章 语法分析',
    children: [
      { key: '31', label: 'Option 1' },
      { key: '32', label: 'Option 2' },
      { key: '33', label: 'Submenu' },
      { key: '34', label: 'Submenu 2' },
    ],
  },
];

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}
const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach(item => {
      if (item.key) key[item.key] = level;
      if (item.children) func(item.children, level + 1);
    });
  };
  func(items1);
  return key;
};
const levelKeys = getLevelKeys(items as LevelKeysProps[]);

export default function GlobalNav() {
  const [openKeys, setOpenKeys] = useState(['0', '0']);
  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const latest = keys.find(k => openKeys.indexOf(k) === -1);
    if (latest) {
      const repeatIndex = keys
        .filter(k => k !== latest)
        .findIndex(k => levelKeys[k] === levelKeys[latest]);
      setOpenKeys(
        keys
          .filter((_, i) => i !== repeatIndex)
          .filter(k => levelKeys[k] <= levelKeys[latest])
      );
    } else {
      setOpenKeys(keys);
    }
  };
  const scheme = usePrefersColorScheme().toString();

  return (
    <Menu
      mode="inline"
      style={{ width: 256 }}
      items={items}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      defaultSelectedKeys={['0']}
    />
  );
}
