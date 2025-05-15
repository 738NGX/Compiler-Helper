import logoDark from "./logo-dark.png";
import logoLight from "./logo-light.png";
import {
  GithubOutlined
} from '@ant-design/icons';

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              src={logoLight}
              alt="React Router"
              className="block w-full dark:hidden"
            />
            <img
              src={logoDark}
              alt="React Router"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <div className="max-w-[500px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <h3><b>关于本项目</b></h3>
            <p>1. 本项目主要为编译原理期末复习自用,包含了一些笔记整理和工具的实现.</p>
            <p>2. 本项目使用Vite+React19+AntDesign进行搭建,也作为前端学习自用项目.</p>
            {resources.map(({ href, text, icon }) => (
              <p key={href}>
                <div className="flex items-center gap-3">
                  {icon}
                  <a
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <b>{text}</b>
                  </a>
                </div>
              </p>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: "https://github.com/738NGX/Compiler-Helper",
    text: "Github仓库",
    icon: <GithubOutlined />,
  },
];
