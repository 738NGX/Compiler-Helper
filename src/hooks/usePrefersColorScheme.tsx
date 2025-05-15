import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

/**
 * 返回当前系统首选的配色方案，并在用户系统主题切换时自动更新
 */
export function usePrefersColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    // 初始值：如果 window 不存在（SSR），默认为 light
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    if (!window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setScheme(e.matches ? 'dark' : 'light');
    };

    // 初始运行一次
    setScheme(mq.matches ? 'dark' : 'light');
    // 监听变化
    mq.addEventListener('change', handler);

    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);

  return scheme;
}
