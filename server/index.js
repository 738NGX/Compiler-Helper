var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, useLocation, NavLink, Outlet, Meta, Links, ScrollRestoration, Scripts, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import React, { createElement, useState, useEffect, useRef, useMemo } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Menu, Layout as Layout$1, theme, ConfigProvider, Row, Col, Anchor, Card, Input, Flex, Collapse, Table } from "antd";
import { HomeOutlined, BookOutlined, FontSizeOutlined, AlignLeftOutlined, GithubOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import mermaid from "mermaid";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const items = [
  {
    key: "0",
    icon: /* @__PURE__ */ jsx(HomeOutlined, {}),
    label: /* @__PURE__ */ jsx(NavLink, { to: "/", children: "主页" }),
    path: "/"
  },
  {
    key: "1",
    icon: /* @__PURE__ */ jsx(BookOutlined, {}),
    label: "第一章 引论",
    children: [
      { key: "11", label: /* @__PURE__ */ jsx(NavLink, { to: "/brief/1", children: "主要知识点" }), path: "/brief/1" },
      { key: "12", label: /* @__PURE__ */ jsx(NavLink, { to: "/exercise/1", children: "习题" }), path: "/exercise/1" }
    ]
  },
  {
    key: "2",
    icon: /* @__PURE__ */ jsx(FontSizeOutlined, {}),
    label: "第二章 词法分析",
    children: [
      { key: "21", label: /* @__PURE__ */ jsx(NavLink, { to: "/brief/2", children: "主要知识点" }), path: "/brief/2" },
      { key: "22", label: /* @__PURE__ */ jsx(NavLink, { to: "/regex-converter", children: "正规式转换器" }), path: "/regex-converter" }
    ]
  },
  {
    key: "3",
    icon: /* @__PURE__ */ jsx(AlignLeftOutlined, {}),
    label: "第三章 语法分析",
    children: [
      { key: "31", label: /* @__PURE__ */ jsx(NavLink, { to: "/brief/3", children: "主要知识点" }), path: "/brief/3" },
      { key: "32", label: /* @__PURE__ */ jsx(NavLink, { to: "/leftmost-derivation", children: "最左推导与分析树" }), path: "/leftmost-derivation" }
    ]
  }
];
const findKeyPath = (menuItems, pathname, parentKeys = []) => {
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
function GlobalNav() {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  useEffect(() => {
    const keyPath = findKeyPath(items, location.pathname);
    if (keyPath.length) {
      setSelectedKeys([keyPath[keyPath.length - 1]]);
      setOpenKeys(keyPath.slice(0, -1));
    } else {
      setSelectedKeys(["0"]);
      setOpenKeys([]);
    }
  }, [location.pathname]);
  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };
  return /* @__PURE__ */ jsx(
    Menu,
    {
      mode: "inline",
      style: { width: 256 },
      items,
      openKeys,
      selectedKeys,
      onOpenChange
    }
  );
}
const { Content, Footer } = Layout$1;
const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable"
};
function AppComponent() {
  const {
    token: { borderRadiusLG }
  } = theme.useToken();
  return /* @__PURE__ */ jsx(ConfigProvider, { theme: { algorithm: theme.darkAlgorithm }, children: /* @__PURE__ */ jsxs(Layout$1, { hasSider: true, children: [
    /* @__PURE__ */ jsxs("div", { className: "sidebar", style: siderStyle, children: [
      /* @__PURE__ */ jsx("div", { className: "demo-logo-vertical" }),
      /* @__PURE__ */ jsx(GlobalNav, {})
    ] }),
    /* @__PURE__ */ jsxs(Layout$1, { children: [
      /* @__PURE__ */ jsx(Content, { className: "content", style: { overflow: "initial" }, children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            padding: 24,
            borderRadius: borderRadiusLG
          },
          children: /* @__PURE__ */ jsx(Outlet, {})
        }
      ) }),
      /* @__PURE__ */ jsxs(Footer, { className: "content", style: { textAlign: "center" }, children: [
        "Compiler-Helper ©",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " 738ngx.site"
      ] })
    ] })
  ] }) });
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(AppComponent, {});
});
const ErrorBoundary$1 = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const logoDark = "/assets/logo-dark-Dy2ZgDH8.png";
const logoLight = "/assets/logo-light-FBOjPVRs.png";
function Welcome() {
  return /* @__PURE__ */ jsx("main", { className: "flex items-center justify-center pt-16 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center gap-16 min-h-0", children: [
    /* @__PURE__ */ jsx("header", { className: "flex flex-col items-center gap-9", children: /* @__PURE__ */ jsxs("div", { className: "w-[500px] max-w-[100vw] p-4", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: logoLight,
          alt: "React Router",
          className: "block w-full dark:hidden"
        }
      ),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: logoDark,
          alt: "React Router",
          className: "hidden w-full dark:block"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-[500px] w-full space-y-6 px-4", children: /* @__PURE__ */ jsxs("nav", { className: "rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsx("b", { children: "关于本项目" }) }),
      /* @__PURE__ */ jsx("p", { children: "1. 本项目主要为编译原理期末复习自用,包含了一些笔记整理和工具的实现." }),
      /* @__PURE__ */ jsx("p", { children: "2. 本项目使用Vite+React19+AntDesign进行搭建,也作为前端学习自用项目." }),
      resources.map(({ href, text, icon }) => /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        icon,
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300",
            href,
            target: "_blank",
            rel: "noreferrer",
            children: /* @__PURE__ */ jsx("b", { children: text })
          }
        )
      ] }) }, href))
    ] }) })
  ] }) });
}
const resources = [
  {
    href: "https://github.com/738NGX/Compiler-Helper",
    text: "Github仓库",
    icon: /* @__PURE__ */ jsx(GithubOutlined, {})
  }
];
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function MarkDownComponent({ content }) {
  const [items2, setItems] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const headers = Array.from(
        document.querySelectorAll(
          ".markdown-body h1[id], .markdown-body h2[id], .markdown-body h3[id], .markdown-body h4[id]"
        )
      );
      const newItems = headers.map((h) => ({
        key: h.id,
        href: `#${h.id}`,
        title: h.innerText.trim()
      }));
      setItems(newItems);
    }, 100);
    return () => clearTimeout(timer);
  }, [content]);
  return /* @__PURE__ */ jsxs(Row, { children: [
    /* @__PURE__ */ jsx(Col, { span: 16, children: /* @__PURE__ */ jsx("div", { className: "markdown-body", style: { margin: "0 20px" }, children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug], children: content }) }) }),
    /* @__PURE__ */ jsx(Col, { span: 8, children: /* @__PURE__ */ jsx(Anchor, { items: items2 }) })
  ] });
}
const brief_1 = `
# 第一章 主要知识点
《编译原理》（第3版）（以下简称“主教材”）中第1章通过简要介绍编译器的各个逻辑阶段，对全书的内容做一个概述。由于此章中出现的大部分概念在以后各章会有详细介绍，因此不要求在学习此章时就都能理解这些概念。主要应掌握下面两点。

1. 基本概念：源语言、目标语言、翻译器、编译器、解释器。
2. 编译器的各个逻辑阶段，各阶段的主要功能。
`;
const brief_2 = `
# 第二章 主要知识点
主教材第 2 章主要应掌握下面一些内容。

1. 词法分析器的作用和接口，用高级语言编写词法分析器等，它们与词法分析器的实现有关。大部分教材上都有这方面的例子，这些问题比较适合作为实践题，因此本书没有安排这方面的习题，但不要认为进行这样的实践对编译原理的学习不重要。

2. 掌握以下概念，它们之间转换的技巧、方法或算法。
   - 非形式描述的语言 ↔ 正规式 (↔ 表示两个方向的转换都要掌握)
   - 正规式 → NFA (非确定的有限自动机)
   - 非形式描述的语言 ↔ NFA
   - NFA → DFA (确定的有限自动机)
   - DFA → 最简 DFA
   - 非形式描述的语言 ↔ DFA (或最简 DFA)

作为习题来说，第 2 章的难点是为非形式描述的语言寻找一种形式描述（正规式、确定的或非确定的有限自动机），因为不存在这样的转换算法。
`;
const brief_3 = `
# 第三章 主要知识点
主教材第 3 章主要应掌握下面一些内容。

1. 文法和语言的基本知识。有些教材把这方面内容单独作为一章，但是把它和语法分析方法放在一起学习，可以理解得更深刻一些。
2. 自上而下的语法分析方法：预测分析器（递归下降分析方法）、非递归的预测分析器（分析表方法）、LL(1) 文法。能够编写简单语言的预测分析递归程序。
3. 自下而上的语法分析方法：SLR(1) 方法、规范 LR(1) 方法和 LALR(1) 方法。在这三种方法中，重点是 SLR(1) 方法，SLR(1) 方法理解透彻了，其他两种方法就容易理解了。对于简单的语言，要能够手工构造这三种分析方法的分析表。同时还要知道它们的区别所在，便于直接判断一些简单文法属于哪一类文法而无需构造分析表。
4. LR 方法如何用于二义文法。
5. 语法分析的错误恢复方法。
6. 现在编译器已很少使用算符优先分析方法，因此有些教材已不介绍这种方法。在习题中保留了它和其他分析方法的比较。

本章的难点是写文法。本课程虽不要求掌握如何验证文法产生的语言，但了解这方面的技巧对判断所写文法正确与否是极有帮助的，本章有这方面的例子。

更难的是要求所写的文法还需满足一定的约束 [非二义、LR(1)] 等，本章有多个详细分析的例子。
`;
const mdContents$1 = {
  "1": brief_1,
  "2": brief_2,
  "3": brief_3
};
const $id$1 = withComponentProps(function Brief() {
  const {
    id
  } = useParams();
  const md = mdContents$1[id] || "未找到对应内容";
  return /* @__PURE__ */ jsx(MarkDownComponent, {
    content: md
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $id$1
}, Symbol.toStringTag, { value: "Module" }));
const exercise_1 = `
# 第一章 习题
## 1.1 解释器和编译器有什么区别？

编译器将高级语言源程序翻译成低级语言程序（经常是机器语言程序），然后由虚拟机（或者是硬件）执行编译的结果程序。在 30 多年前的 BASIC 语言阶段，解释器的功能是这样介绍的：它将高级语言的源程序翻译成一种中间语言程序，然后对中间语言程序进行解释执行。因为在那个年代，解释器的两个功能（编译和解释）是合在一个程序中的，这个程序被称为解释器。进入 Java 语言时代，解释器的上述两个功能分离成两个程序，前一个程序称编译器，它把 Java 语言的程序翻译成一种中间语言程序，这种中间语言叫做字节码；后一个程序称为解释器，它对字节码程序进行解释执行。

为了避免混淆，用编译执行和解释执行这两个术语来加以区别。一般来说，解释执行的效率低于编译执行的效率，究竟相差多少，和所用的中间语言关系很大。一个极端是，没有编译阶段，直接对源程序进行解释执行，这时的执行效率最低。另一个极端是，没有解释阶段，编译器将源程序直接翻译成机器语言程序，这时的执行效率最高。实际的解释执行介于这两个极端之间，选择一种合适的中间语言。

为什么说解释执行的效率低，以上面的第一种极端情况作解释。对于编译执行来说，对源程序的词法分析、语法分析和语义分析只要进行一次；而对于解释执行来说，每次执行到源程序的某个语句，都要对它进行一次词法分析、语法分析和语义分析，确定了这个语句的含义后，才能执行该含义指定的计算。显然，反复分析循环体降低了解释执行的效率。所以解释执行都要寻找一种适合于解释的中间语言，以减少反复分析需要的时间。反过来，如果源语言没有循环构造，

如历史上的作业控制语言，那么解释执行的效率最高，因为它省去了复杂的代码生成和代码优化等工作。

像 Java 语言这种解释方式的优点是，与机器和平台无关的中间语言使得中间语言程序能通过网络传到其他站点上运行，只要那里有一个中间语言的解释器就可以了。


## 1.2 编译器的逻辑阶段可以怎样分组？

编译器的阶段从逻辑上可以分成两组：一是由词法分析、语法分析和语义分析构成的编译器的分析部分，二是由中间代码生成、代码生成和代码优化构成的编译器的综合部分。

另一种分组方式是分成前端和后端两部分，前端是指编译器中完成从源程序到中间表示的那部分程序，后端是指编译器中完成从中间表示到目标语言程序的那部分程序。它和上面的分组方式是有区别的，例如，有些处理从逻辑上看属于综合部分，但它可能是放在前端完成的。一个具体事例是，从逻辑上看，变量的存储分配属于综合部分，但编译器的前端知道了变量的类型后，也就知道了该变量需要多少存储单元，因此通常是在前端完成变量的存储分配。

还有一种分组方式是按遍来分。一个编译过程可以由一遍、两遍或多遍来完成。每一遍扫描的处理可完成一个阶段或多个阶段的工作。对于多遍的编译器，第一遍的输入是用户写的源程序，最后一遍的输出是目标语言程序，其余情况下则为上一遍的输出是下一遍的输入。

`;
const mdContents = {
  "1": exercise_1
};
const $id = withComponentProps(function Brief2() {
  const {
    id
  } = useParams();
  const md = mdContents[id] || "未找到对应内容";
  return /* @__PURE__ */ jsx(MarkDownComponent, {
    content: md
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $id
}, Symbol.toStringTag, { value: "Module" }));
function usePrefersColorScheme() {
  const [scheme, setScheme] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      setScheme(e.matches ? "dark" : "light");
    };
    setScheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);
  return scheme;
}
class FiniteAutomaton {
  constructor(startState, acceptStates, transitions) {
    __publicField(this, "startState");
    __publicField(this, "acceptStates");
    __publicField(this, "transitions");
    __publicField(this, "symbols");
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.transitions = transitions;
    this.symbols = Array.from(
      new Set(
        Object.values(transitions).flatMap((state) => Object.keys(state)).filter((sym) => sym !== "ε")
      )
    ).sort();
  }
  calculateEpsilonClosure(states) {
    var _a;
    const closure = /* @__PURE__ */ new Set();
    const stack = [...states];
    while (stack.length > 0) {
      const currentState = stack.pop();
      if (!closure.has(currentState)) {
        closure.add(currentState);
        const epsilonTransitions = ((_a = this.transitions[currentState]) == null ? void 0 : _a["ε"]) || [];
        for (const nextState of epsilonTransitions) {
          if (!closure.has(nextState)) {
            stack.push(nextState);
          }
        }
      }
    }
    return Array.from(closure).sort();
  }
}
mermaid.initialize({ startOnLoad: false });
function FiniteAutomatonComponent({
  fa,
  title,
  style
}) {
  var _a;
  const containerRef = useRef(null);
  const scheme = ((_a = usePrefersColorScheme()) == null ? void 0 : _a.toString()) === "dark" ? "dark" : "default";
  const [svg, setSvg] = useState("");
  const definition = useMemo(() => {
    const states = /* @__PURE__ */ new Set([
      fa.startState,
      ...fa.acceptStates,
      ...Object.keys(fa.transitions)
    ]);
    Object.values(fa.transitions).forEach(
      (m) => Object.values(m).forEach((arr) => arr.forEach((s) => states.add(s)))
    );
    let d = "";
    if (scheme === "dark") {
      d += `%%{init: { 'theme': 'dark' }}%%
`;
    }
    d += "flowchart LR\n";
    states.forEach((s) => {
      if (fa.acceptStates.includes(s)) {
        d += `  ${s}((( ${s} )))
`;
      } else {
        d += `  ${s}(( ${s} ))
`;
      }
    });
    d += `  start[[start]] --> ${fa.startState}
`;
    Object.entries(fa.transitions).forEach(
      ([from, map]) => Object.entries(map).forEach(
        ([sym, tos]) => tos.forEach((to) => {
          d += `  ${from} -->|${sym}| ${to}
`;
        })
      )
    );
    return d;
  }, [fa, scheme]);
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: scheme });
    const graphId = `fa-${Math.random().toString(36).slice(2)}`;
    mermaid.render(graphId, definition).then(({ svg: newSvg, bindFunctions }) => {
      setSvg(newSvg);
    }).catch((err) => {
      console.error("Mermaid 渲染失败：", err);
    });
  }, [definition, scheme]);
  return /* @__PURE__ */ jsx("div", { style: { ...style }, children: title ? /* @__PURE__ */ jsx(Card, { className: "min-w-[300px]", title, children: /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: "fa-diagram",
      dangerouslySetInnerHTML: { __html: svg }
    }
  ) }) : /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: "fa-diagram",
      dangerouslySetInnerHTML: { __html: svg }
    }
  ) });
}
function convertRegexToNFA(regex) {
  const EPSILON = "ε";
  let stateCounter = 0;
  const newState = () => {
    const num = stateCounter++;
    return `s${num < 10 ? "0" + num : num}`;
  };
  const isOperand = (token) => /[a-zA-Z0-9ε]/.test(token);
  const insertConcat = (re) => {
    let output = "";
    for (let i = 0; i < re.length; i++) {
      const c1 = re[i];
      const c2 = re[i + 1];
      output += c1;
      if (c2 && c1 !== "(" && c1 !== "|" && c2 !== ")" && c2 !== "|" && c2 !== "*" && c2 !== "+" && c2 !== "?") {
        output += ".";
      }
    }
    return output;
  };
  const toPostfix = (infix) => {
    const precedence = {
      "|": 1,
      ".": 2,
      "*": 3,
      "+": 3,
      "?": 3
    };
    const output = [];
    const stack2 = [];
    for (const token of infix) {
      if (isOperand(token)) {
        output.push(token);
      } else if (token === "(") {
        stack2.push(token);
      } else if (token === ")") {
        while (stack2.length && stack2[stack2.length - 1] !== "(") {
          output.push(stack2.pop());
        }
        stack2.pop();
      } else {
        while (stack2.length && stack2[stack2.length - 1] !== "(" && precedence[stack2[stack2.length - 1]] >= precedence[token]) {
          output.push(stack2.pop());
        }
        stack2.push(token);
      }
    }
    while (stack2.length) output.push(stack2.pop());
    return output;
  };
  const makeFrag = (start, accept) => ({
    start,
    accept,
    transitions: {}
  });
  const addTransition = (trans, from, symbol, to) => {
    if (!trans[from]) trans[from] = {};
    if (!trans[from][symbol]) trans[from][symbol] = [];
    trans[from][symbol].push(to);
  };
  const mergeConcat = (f1, f2) => {
    const merged = {
      start: f1.start,
      accept: f2.accept,
      transitions: { ...f1.transitions }
    };
    Object.entries(f2.transitions).forEach(([oldFrom, map]) => {
      const from = oldFrom === f2.start ? f1.accept : oldFrom;
      if (!merged.transitions[from]) merged.transitions[from] = {};
      Object.entries(map).forEach(([sym, tos]) => {
        if (!merged.transitions[from][sym]) merged.transitions[from][sym] = [];
        tos.forEach((to) => {
          merged.transitions[from][sym].push(to === f2.start ? f1.accept : to);
        });
      });
    });
    return merged;
  };
  const postfix = toPostfix(insertConcat(regex));
  const stack = [];
  postfix.forEach((token) => {
    if (isOperand(token)) {
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      addTransition(frag.transitions, start, token === EPSILON ? EPSILON : token, accept);
      stack.push(frag);
    } else if (token === ".") {
      const f2 = stack.pop(), f1 = stack.pop();
      stack.push(mergeConcat(f1, f2));
    } else if (token === "|") {
      const f2 = stack.pop(), f1 = stack.pop();
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, start, EPSILON, f2.start);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      addTransition(frag.transitions, f2.accept, EPSILON, accept);
      [f1, f2].forEach(
        (sub) => Object.entries(sub.transitions).forEach(([from, map]) => {
          if (!frag.transitions[from]) frag.transitions[from] = {};
          Object.entries(map).forEach(([sym, tos]) => {
            if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
            frag.transitions[from][sym].push(...tos);
          });
        })
      );
      stack.push(frag);
    } else if (token === "*") {
      const f1 = stack.pop();
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, start, EPSILON, accept);
      addTransition(frag.transitions, f1.accept, EPSILON, f1.start);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      Object.entries(f1.transitions).forEach(([from, map]) => {
        if (!frag.transitions[from]) frag.transitions[from] = {};
        Object.entries(map).forEach(([sym, tos]) => {
          if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
          frag.transitions[from][sym].push(...tos);
        });
      });
      stack.push(frag);
    } else if (token === "+") {
      const f1 = stack.pop();
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, f1.accept, EPSILON, f1.start);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      Object.entries(f1.transitions).forEach(([from, map]) => {
        if (!frag.transitions[from]) frag.transitions[from] = {};
        Object.entries(map).forEach(([sym, tos]) => {
          if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
          frag.transitions[from][sym].push(...tos);
        });
      });
      stack.push(frag);
    } else if (token === "?") {
      const f1 = stack.pop();
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, start, EPSILON, accept);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      Object.entries(f1.transitions).forEach(([from, map]) => {
        if (!frag.transitions[from]) frag.transitions[from] = {};
        Object.entries(map).forEach(([sym, tos]) => {
          if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
          frag.transitions[from][sym].push(...tos);
        });
      });
      stack.push(frag);
    }
  });
  const renumber = (start, accepts, trans) => {
    const queue = [start];
    const visited = /* @__PURE__ */ new Set([start]);
    const order = [];
    while (queue.length) {
      const u = queue.shift();
      order.push(u);
      Object.values(trans[u] || {}).flat().forEach((v) => {
        if (!visited.has(v)) {
          visited.add(v);
          queue.push(v);
        }
      });
    }
    const nameMap = {};
    order.forEach((old, i) => {
      nameMap[old] = `s${i < 10 ? "0" + i : i}`;
    });
    const newTrans2 = {};
    Object.entries(trans).forEach(([oldFrom, map]) => {
      const from = nameMap[oldFrom];
      newTrans2[from] = {};
      Object.entries(map).forEach(([sym, tos]) => {
        newTrans2[from][sym] = tos.map((to) => nameMap[to]);
      });
    });
    return {
      start: nameMap[start],
      accepts: accepts.map((a) => nameMap[a]),
      transitions: newTrans2
    };
  };
  const finalFrag = stack.pop();
  const { start: newStart, accepts: newAccepts, transitions: newTrans } = renumber(finalFrag.start, [finalFrag.accept], finalFrag.transitions);
  return new FiniteAutomaton(newStart, newAccepts, newTrans);
}
function getDfaResult(nfa) {
  const dfaResult = [];
  const symbols = nfa.symbols;
  const stateKey = (states) => states.join(",");
  const keyToDfaState = /* @__PURE__ */ new Map();
  let dfaStateCount = 0;
  const startStates = nfa.calculateEpsilonClosure([nfa.startState]);
  const startKey = stateKey(startStates);
  const startDfa = String.fromCharCode(65 + dfaStateCount);
  keyToDfaState.set(startKey, startDfa);
  const queue = [{
    nfaStates: startStates,
    dfaState: startDfa,
    isAccept: startStates.some((s) => nfa.acceptStates.includes(s)),
    transitions: {}
  }];
  while (queue.length) {
    const current = queue.shift();
    const { nfaStates } = current;
    const trans = {};
    nfaStates.forEach((state) => {
      Object.entries(nfa.transitions[state] || {}).forEach(([sym, tos]) => {
        if (!trans[sym]) trans[sym] = [];
        trans[sym].push(...tos);
      });
    });
    symbols.forEach((sym) => {
      const nextStates = nfa.calculateEpsilonClosure(trans[sym] || []);
      if (!nextStates.length) return;
      const nextKey = stateKey(nextStates);
      let nextDfa = keyToDfaState.get(nextKey);
      if (!nextDfa) {
        dfaStateCount++;
        nextDfa = String.fromCharCode(65 + dfaStateCount);
        keyToDfaState.set(nextKey, nextDfa);
        queue.push({
          nfaStates: nextStates,
          dfaState: nextDfa,
          isAccept: nextStates.some((s) => nfa.acceptStates.includes(s)),
          transitions: {}
        });
      }
      current.transitions[sym] = nextDfa;
    });
    dfaResult.push(current);
  }
  return { dfaResult, symbols };
}
function getNfa2DfaTransTable(nfa) {
  const { dfaResult, symbols } = getDfaResult(nfa);
  const dataSource = dfaResult.map((item) => {
    const nfaText = `{${item.nfaStates.join(",")}}`;
    const row = {
      key: item.dfaState,
      nfaStates: nfaText,
      dfaState: item.dfaState,
      type: item.isAccept ? "accept" : ""
    };
    symbols.forEach((sym) => {
      row[sym] = item.transitions[sym] || "";
    });
    return row;
  });
  const columns = [
    {
      title: "NFA STATE",
      dataIndex: "nfaStates",
      key: "nfaStates"
    },
    {
      title: "DFA STATE",
      dataIndex: "dfaState",
      key: "dfaState"
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type"
    },
    ...symbols.map((sym) => ({
      title: sym,
      dataIndex: sym,
      key: sym,
      render: (val) => val || "-"
    }))
  ];
  return { dataSource, columns };
}
function convertNFAToDFA(nfa) {
  const { dfaResult } = getDfaResult(nfa);
  const startState = dfaResult[0].dfaState;
  const acceptStates = dfaResult.filter((item) => item.isAccept).map((item) => item.dfaState);
  const transitions = {};
  dfaResult.forEach((item) => {
    const { dfaState, transitions: itemTransitions } = item;
    transitions[dfaState] = {};
    Object.entries(itemTransitions).forEach(([sym, to]) => {
      if (!transitions[dfaState][sym]) {
        transitions[dfaState][sym] = [];
      }
      transitions[dfaState][sym].push(to);
    });
  });
  return new FiniteAutomaton(startState, acceptStates, transitions);
}
function getMinDfaResult(dfa) {
  const symbols = Object.keys(dfa.transitions[Object.keys(dfa.transitions)[0]]);
  const acceptStates = dfa.acceptStates;
  const allStates = Object.keys(dfa.transitions);
  let partitions = [
    new Set(acceptStates),
    new Set(allStates.filter((s) => !acceptStates.includes(s)))
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < partitions.length; i++) {
      const group = partitions[i];
      const splitter = {};
      for (const state of group) {
        const sig = symbols.map((sym) => {
          const tgt = dfa.transitions[state][sym][0];
          return partitions.findIndex((p) => p.has(tgt));
        }).join(",");
        splitter[sig] = splitter[sig] || /* @__PURE__ */ new Set();
        splitter[sig].add(state);
      }
      const pieces = Object.values(splitter);
      if (pieces.length > 1) {
        partitions.splice(i, 1, ...pieces);
        changed = true;
        break;
      }
    }
  }
  const dfaResult = partitions.map((group) => {
    const states = Array.from(group);
    const repr = Array.from(group).join(",");
    const isAcceptGroup = states.some((s) => acceptStates.includes(s));
    const trans = {};
    symbols.forEach((sym) => {
      const tgt = dfa.transitions[states[0]][sym][0];
      const tgtGroup = partitions.find((p) => p.has(tgt));
      if (tgtGroup) trans[sym] = Array.from(tgtGroup).join(",");
    });
    return {
      dfaState: states,
      minDfaState: repr,
      isAccept: isAcceptGroup,
      transitions: trans
    };
  });
  return { dfaResult, symbols };
}
function getDfa2MinDfaTransTable(dfa) {
  const { dfaResult, symbols } = getMinDfaResult(dfa);
  const dataSource = dfaResult.map(
    (item) => {
      const { dfaState, minDfaState, isAccept, transitions } = item;
      const row = {
        key: minDfaState,
        dfaState: dfaState.join(","),
        minDfaState,
        isAccept: isAccept ? "accept" : "",
        ...transitions
      };
      symbols.forEach((sym) => {
        row[sym] = transitions[sym] || "-";
      });
      return row;
    }
  );
  const columns = [
    {
      title: "DFA STATE",
      dataIndex: "dfaState",
      key: "dfaState",
      render: (val) => val
    },
    {
      title: "Min-DFA STATE",
      dataIndex: "minDfaState",
      key: "minDfaState",
      render: (val) => val
    },
    {
      title: "TYPE",
      dataIndex: "isAccept",
      key: "isAccept",
      render: (val) => val
    },
    ...symbols.map((sym) => ({
      title: sym,
      dataIndex: sym,
      key: sym,
      render: (val) => val
    }))
  ];
  return { dataSource, columns };
}
function convertDFAToMinDFA(dfa) {
  var _a;
  const { dfaResult, symbols } = getMinDfaResult(dfa);
  const startState = ((_a = dfaResult.find((item) => item.dfaState.includes(dfa.startState))) == null ? void 0 : _a.minDfaState) || "";
  const acceptStates = dfaResult.filter((item) => item.isAccept).map((item) => item.minDfaState);
  const minDfaTransitions = {};
  dfaResult.forEach((item) => {
    const { minDfaState, transitions } = item;
    minDfaTransitions[minDfaState] = {};
    symbols.forEach((sym) => {
      const tgtState = transitions[sym];
      if (tgtState) {
        minDfaTransitions[minDfaState][sym] = [tgtState];
      }
    });
  });
  return new FiniteAutomaton(startState, acceptStates, minDfaTransitions);
}
const {
  Search: Search$1
} = Input;
function RegexResult({
  regexInput,
  style
}) {
  return /* @__PURE__ */ jsx("div", {
    className: "result",
    style,
    children: /* @__PURE__ */ jsx(Card, {
      className: "min-w-[300px]",
      title: "输入正规式",
      children: /* @__PURE__ */ jsx("p", {
        children: /* @__PURE__ */ jsx("b", {
          children: regexInput
        })
      })
    })
  });
}
const regexConverter = withComponentProps(function RegexConverter() {
  const [regexInput, setRegexInput] = useState("");
  const [nfaResult, setNfaResult] = useState(null);
  const [nfa2dfaTransTable, setNfa2dfaTransTable] = useState(null);
  const [dfaResult, setDfaResult] = useState(null);
  const [dfa2minDfaTransTable, setDfa2minDfaTransTable] = useState(null);
  const [minDfaResult, setMinDfaResult] = useState(null);
  const onConvert = (value) => {
    setRegexInput(value);
    const nfa = convertRegexToNFA(value);
    setNfaResult(nfa);
    const {
      dataSource,
      columns
    } = getNfa2DfaTransTable(nfa);
    setNfa2dfaTransTable({
      dataSource,
      columns
    });
    const dfa = convertNFAToDFA(nfa);
    setDfaResult(dfa);
    const {
      dataSource: dfaDataSource,
      columns: dfaColumns
    } = getDfa2MinDfaTransTable(dfa);
    setDfa2minDfaTransTable({
      dataSource: dfaDataSource,
      columns: dfaColumns
    });
    const minDfa = convertDFAToMinDFA(dfa);
    setMinDfaResult(minDfa);
    console.log(minDfa);
  };
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsxs(Flex, {
      justify: "space-around",
      children: [/* @__PURE__ */ jsxs(Card, {
        className: "min-w-[300px]",
        title: "正规式转换器",
        children: [/* @__PURE__ */ jsx("p", {
          children: "你可以输入一个正规式,程序首先将使用汤普森构造法将其构造为NFA,随后使用子集构造法将其构造为DFA,最后化简为Min-DFA."
        }), /* @__PURE__ */ jsx("p", {
          children: "注意:输入的正规式必须符合语法要求,否则转换会失败."
        }), /* @__PURE__ */ jsx("p", {
          children: "使用汤普森构造法时,可以先写出一些简单的NFA,然后对他们进行组合,你可以在右边的语法提示中找到一些例子."
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        className: "min-w-[400px]",
        title: "语法提示",
        style: {
          marginLeft: 16,
          marginRight: 16
        },
        children: [/* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "r = (s)",
            children: /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
              fa: convertRegexToNFA("(s)")
            })
          }]
        }), /* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "r = st",
            children: /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
              fa: convertRegexToNFA("st")
            })
          }]
        }), /* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "r = s|t",
            children: /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
              fa: convertRegexToNFA("s|t")
            })
          }]
        }), /* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "r = s*",
            children: /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
              fa: convertRegexToNFA("s*")
            })
          }]
        }), /* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "r = s+",
            children: /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
              fa: convertRegexToNFA("s+")
            })
          }]
        }), /* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "r = s?",
            children: /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
              fa: convertRegexToNFA("s?")
            })
          }]
        }), /* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "r = ε",
            children: /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
              fa: convertRegexToNFA("ε")
            })
          }]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        className: "min-w-[300px]",
        title: "输入示例",
        children: [/* @__PURE__ */ jsxs("ul", {
          className: "d",
          children: [/* @__PURE__ */ jsx("li", {
            children: "(a|b)*"
          }), /* @__PURE__ */ jsx("li", {
            children: "(a*|b*)*"
          }), /* @__PURE__ */ jsx("li", {
            children: "((ε|a)b*)*"
          }), /* @__PURE__ */ jsx("li", {
            children: "(a|b)*abb(a|b)*"
          })]
        }), /* @__PURE__ */ jsxs("p", {
          children: ["第一次作业: 将正则表达式", /* @__PURE__ */ jsx("b", {
            children: "(a|b)*a(a|b|ε)*"
          }), "转化为一个NFA,然后利用子集构造法将NFA转化为一个DFA."]
        })]
      })]
    }), /* @__PURE__ */ jsx(Search$1, {
      placeholder: "请输入需要转换的正规式",
      allowClear: true,
      enterButton: "转换",
      size: "large",
      onSearch: onConvert,
      style: {
        marginTop: 16
      }
    }), regexInput ? /* @__PURE__ */ jsx(RegexResult, {
      regexInput,
      style: {
        marginTop: 16
      }
    }) : null, regexInput ? nfaResult ? /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
      fa: nfaResult,
      title: "NFA",
      style: {
        marginTop: 16
      }
    }) : /* @__PURE__ */ jsx(Card, {
      title: "NFA",
      style: {
        marginTop: 16
      },
      children: /* @__PURE__ */ jsx("p", {
        children: "转换失败,请检查输入的正规式是否符合语法要求."
      })
    }) : null, regexInput ? /* @__PURE__ */ jsx(Card, {
      title: "NFA=>DFA状态转移表",
      style: {
        marginTop: 16
      },
      children: nfa2dfaTransTable ? /* @__PURE__ */ jsx(Table, {
        columns: nfa2dfaTransTable.columns,
        dataSource: nfa2dfaTransTable.dataSource
      }) : /* @__PURE__ */ jsx("p", {
        children: "转换失败,请检查输入的正规式是否符合语法要求."
      })
    }) : null, regexInput ? dfaResult ? /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
      fa: dfaResult,
      title: "DFA",
      style: {
        marginTop: 16
      }
    }) : /* @__PURE__ */ jsx(Card, {
      title: "DFA",
      style: {
        marginTop: 16
      },
      children: /* @__PURE__ */ jsx("p", {
        children: "转换失败,请检查输入的正规式是否符合语法要求."
      })
    }) : null, regexInput ? /* @__PURE__ */ jsx(Card, {
      title: "DFA=>Min-DFA状态转移表",
      style: {
        marginTop: 16
      },
      children: dfa2minDfaTransTable ? /* @__PURE__ */ jsx(Table, {
        columns: dfa2minDfaTransTable.columns,
        dataSource: dfa2minDfaTransTable.dataSource
      }) : /* @__PURE__ */ jsx("p", {
        children: "转换失败,请检查输入的正规式是否符合语法要求."
      })
    }) : null, regexInput ? minDfaResult ? /* @__PURE__ */ jsx(FiniteAutomatonComponent, {
      fa: minDfaResult,
      title: "Min-DFA",
      style: {
        marginTop: 16
      }
    }) : /* @__PURE__ */ jsx(Card, {
      title: "Min-DFA",
      style: {
        marginTop: 16
      },
      children: /* @__PURE__ */ jsx("p", {
        children: "转换失败,请检查输入的正规式是否符合语法要求."
      })
    }) : null]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: regexConverter
}, Symbol.toStringTag, { value: "Module" }));
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error in GenericParserViewer:", error, errorInfo);
  }
  render() {
    var _a;
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx(Card, { title: "错误", style: { margin: "1rem 0" }, children: /* @__PURE__ */ jsxs("p", { children: [
        "组件渲染出错：",
        (_a = this.state.error) == null ? void 0 : _a.message
      ] }) });
    }
    return /* @__PURE__ */ jsx(Fragment, { children: this.props.children });
  }
}
class GrammarParser {
  constructor(tokens, grammar, start) {
    __publicField(this, "tokens");
    __publicField(this, "pos", 0);
    __publicField(this, "derivation", []);
    __publicField(this, "grammar");
    __publicField(this, "start");
    this.tokens = tokens;
    this.grammar = grammar;
    this.start = start;
    this.derivation.push(start);
  }
  log(step) {
    this.derivation.push(step);
  }
  parseSymbol(sym) {
    if (!(sym in this.grammar)) {
      if (this.tokens[this.pos] === sym) {
        const node = { type: sym, value: sym };
        this.pos++;
        return node;
      }
      return null;
    }
    const prods = this.grammar[sym];
    const nonRec = prods.filter((p) => p[0] !== sym);
    const recs = prods.filter((p) => p[0] === sym).map((p) => p.slice(1));
    for (const prod of nonRec) {
      const savePos = this.pos;
      this.log(`${sym} → ${prod.join(" ") || "ε"}`);
      const children = [];
      let ok = true;
      for (const tok of prod) {
        if (tok === "ε") continue;
        const child = this.parseSymbol(tok);
        if (!child) {
          ok = false;
          break;
        }
        children.push(child);
      }
      if (!ok) {
        this.pos = savePos;
        this.derivation.pop();
        continue;
      }
      let leftNode = { type: sym, children: children.length ? children : void 0 };
      let extended = true;
      while (extended) {
        extended = false;
        for (const alpha of recs) {
          const pos1 = this.pos;
          this.log(`${sym} → ${sym} ${alpha.join(" ")}`);
          const tail = [];
          let ok2 = true;
          for (const tok of alpha) {
            if (tok === "ε") continue;
            const c = this.parseSymbol(tok);
            if (!c) {
              ok2 = false;
              break;
            }
            tail.push(c);
          }
          if (!ok2) {
            this.pos = pos1;
            this.derivation.pop();
            continue;
          }
          leftNode = { type: sym, children: [leftNode, ...tail] };
          extended = true;
          break;
        }
      }
      return leftNode;
    }
    return null;
  }
  run() {
    const ast = this.parseSymbol(this.start);
    if (!ast || this.pos < this.tokens.length) {
      throw new Error(`Parse error at token index ${this.pos}`);
    }
    return { ast, derivation: this.derivation };
  }
}
function tokenize(input, terminals) {
  const sorted = [...terminals].sort((a, b) => b.length - a.length);
  const tokens = [];
  let i = 0;
  while (i < input.length) {
    if (/\s/.test(input[i])) {
      i++;
      continue;
    }
    let matched = false;
    for (const term of sorted) {
      if (input.startsWith(term, i)) {
        tokens.push(term);
        i += term.length;
        matched = true;
        break;
      }
    }
    if (!matched) throw new Error(`Unknown symbol at position ${i}`);
  }
  return tokens;
}
function astToMermaid(node, id = 0, lines = []) {
  var _a;
  const label = node.value ? `${node.type}: ${node.value}` : node.type;
  lines.push(`node${id}["${label}"]`);
  let next = id + 1;
  (_a = node.children) == null ? void 0 : _a.forEach((child) => {
    const [_, newNext] = astToMermaid(child, next, lines);
    lines.push(`node${id} --> node${next}`);
    next = newNext;
  });
  return [lines, next];
}
function stringifyGrammar(grammar) {
  return Object.entries(grammar).map(([nonterminal, productions]) => `${nonterminal} -> ${productions.map((p) => p.join(" ")).join(" | ")}`).join("\n");
}
function GenericParserViewer({ expr, grammar, startSymbol }) {
  const [derivation, setDerivation] = useState([]);
  const [diagram, setDiagram] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const scheme = usePrefersColorScheme() === "dark" ? "dark" : "default";
  useEffect(() => {
    try {
      setError(null);
      const nonTerms = new Set(Object.keys(grammar));
      const terms = /* @__PURE__ */ new Set();
      Object.values(grammar).flat().flat().forEach((sym) => {
        if (!nonTerms.has(sym) && sym !== "ε") terms.add(sym);
      });
      const tokens = tokenize(expr, Array.from(terms));
      const parser = new GrammarParser(tokens, grammar, startSymbol);
      const { ast } = parser.run();
      const forms = [[startSymbol]];
      (function traverse(node) {
        if (!node.children) return;
        const lastForm = forms[forms.length - 1];
        const idx = lastForm.findIndex((sym) => sym === node.type);
        if (idx >= 0) {
          const replacement = node.children.map((child) => child.type);
          forms.push([...lastForm.slice(0, idx), ...replacement, ...lastForm.slice(idx + 1)]);
        }
        node.children.forEach(traverse);
      })(ast);
      setDerivation(forms.map((f) => f.join(" ")));
      const [lines] = astToMermaid(ast, 0, []);
      setDiagram(["graph TB", ...lines].join("\n"));
    } catch (err) {
      setError(err);
    }
  }, [expr, grammar, startSymbol]);
  useEffect(() => {
    if (error) return;
    mermaid.initialize({ startOnLoad: false, theme: scheme });
    if (!diagram) return;
    const id = `g${Math.random().toString(36).slice(2)}`;
    mermaid.render(id, diagram).then(({ svg: svg2 }) => setSvg(svg2)).catch((err) => setError(err));
  }, [diagram, scheme, error]);
  if (error) {
    return /* @__PURE__ */ jsx(Card, { title: "错误", style: { margin: "1rem 0" }, children: /* @__PURE__ */ jsxs("p", { children: [
      "解析或渲染出错：",
      error.message
    ] }) });
  }
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs("div", { className: "mt-4 mb-4", children: [
    /* @__PURE__ */ jsxs(Card, { className: "min-w-[300px]", title: "输入信息", children: [
      /* @__PURE__ */ jsxs("p", { style: { whiteSpace: "pre-wrap" }, children: [
        "输入文法:",
        /* @__PURE__ */ jsx("b", { children: "\n" + stringifyGrammar(grammar) })
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "开始符号: ",
        /* @__PURE__ */ jsx("b", { children: startSymbol })
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "目标表达式: ",
        /* @__PURE__ */ jsx("b", { children: expr })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 mb-4", children: /* @__PURE__ */ jsx(Card, { className: "min-w-[300px]", title: "最左推导", children: /* @__PURE__ */ jsx("ol", { className: "ml-4", children: derivation.map((step, i) => /* @__PURE__ */ jsxs("li", { children: [
      "=>",
      step
    ] }, i)) }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "min-w-[300px]", title: "分析树", children: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: svg } }) })
  ] }) });
}
const {
  TextArea
} = Input;
const {
  Search
} = Input;
function parseGrammar(input) {
  const lines = input.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  const grammar = {};
  for (const line of lines) {
    const parts = line.split("->");
    if (parts.length !== 2) {
      return null;
    }
    const lhs = parts[0].trim();
    const rhs = parts[1].trim();
    if (!lhs || !rhs) {
      return null;
    }
    if (grammar[lhs]) {
      return null;
    }
    const prods = [];
    for (const prod of rhs.split("|")) {
      const symbols = prod.trim().split(/\s+/);
      if (symbols.length === 0 || symbols.some((s) => s === "")) {
        return null;
      }
      prods.push(symbols);
    }
    grammar[lhs] = prods;
  }
  return grammar;
}
const example_1 = `假定文法如下:
exp -> exp addop term | term
addop -> + | -
term -> term mulop factor | factor
mulop -> *
factor -> ( exp ) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
写出下面表达式的最左推导和分析树:
(1) 3+4*5-6
(2) 3*(4-5+6)
(3) 3-(4+5*6)
`;
const example_2 = `假定文法如下:
statement -> if-stmt | other | ε
if-stmt -> if ( exp ) statement else-part
else-part -> else statement | ε
exp -> 0 | 1
(a) 画出句子“if(0) if (1) other else else other”相应的分析树
(b) 解释(a)中两个else的意义?
`;
const leftmostDerivation = withComponentProps(function LeftMostDerivation() {
  const [expr, setExpr] = useState("");
  const [grammerStr, setGrammerStr] = useState("");
  const [grammar, setGrammar] = useState(null);
  const [startSymbol, setStartSymbol] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(true);
  const onGrammerChange = (e) => {
    setShowResult(false);
    const value = e.target.value;
    setGrammerStr(value);
  };
  const onStartSymbolChange = (e) => {
    setShowResult(false);
    const value = e.target.value;
    setStartSymbol(value);
  };
  const onParse = (value) => {
    setShowResult(true);
    const parsedGrammar = parseGrammar(grammerStr);
    if (!parsedGrammar) {
      setCorrect(false);
      return;
    }
    setGrammar(parsedGrammar);
    if (!parsedGrammar[startSymbol]) {
      setCorrect(false);
      return;
    }
    setCorrect(true);
    setExpr(value);
  };
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsxs(Flex, {
      justify: "space-around",
      style: {
        marginBottom: 16
      },
      children: [/* @__PURE__ */ jsxs(Card, {
        className: "min-w-[300px]",
        title: "最左推导与分析树",
        children: [/* @__PURE__ */ jsx("p", {
          children: "为描述文法定义的语言,需要使用推导的概念.推导的意思是,把产生式看成重写规则,把符号串中的非终结符用其产生式右部的串来代替.若符号串α中有两个以上的非终结符号,则对推导的每一步坚持把α中的最左非终结符号进行替换,称为最左推导."
        }), /* @__PURE__ */ jsx("p", {
          children: "分析树是推导的图形表示.分析树上的每个分支结点都由非终结符标记,它的子结点由该非终结符本次推导所用产生式的右部的各符号从左到右依次来标记.分析树的叶结点由非终结符或终结符标记,所有这些标记从左到右构成一个句型."
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        className: "min-w-[300px]",
        title: "语法提示",
        style: {
          marginLeft: 16,
          marginRight: 16
        },
        children: [/* @__PURE__ */ jsx("p", {
          children: "使用该工具需要输入文法定义,开始符号,目标表达式."
        }), /* @__PURE__ */ jsx("p", {
          children: "文法定义为形如 A -> B | C D | ... 的格式,注意换行"
        }), /* @__PURE__ */ jsx("p", {
          children: "开始符号必须为文法定义中的非终止符."
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        className: "min-w-[400px]",
        title: "输入示例",
        children: [/* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 0
          },
          items: [{
            key: "1",
            label: "第二次作业1",
            children: /* @__PURE__ */ jsx("p", {
              style: {
                whiteSpace: "pre-wrap"
              },
              children: example_1
            })
          }]
        }), /* @__PURE__ */ jsx(Collapse, {
          size: "small",
          style: {
            marginTop: 8
          },
          items: [{
            key: "1",
            label: "第二次作业2",
            children: /* @__PURE__ */ jsx("p", {
              style: {
                whiteSpace: "pre-wrap"
              },
              children: example_2
            })
          }]
        })]
      })]
    }), /* @__PURE__ */ jsx(TextArea, {
      size: "large",
      rows: 10,
      placeholder: "请在这里输入文法定义",
      onChange: onGrammerChange,
      style: {
        marginBottom: 16
      }
    }), /* @__PURE__ */ jsx(Input, {
      size: "large",
      placeholder: "请在这里输入开始符号",
      onChange: onStartSymbolChange,
      style: {
        marginBottom: 16
      }
    }), /* @__PURE__ */ jsx(Search, {
      placeholder: "请输入需要分析的表达式",
      enterButton: "分析",
      size: "large",
      onSearch: onParse,
      style: {
        marginBottom: 16
      }
    }), showResult && /* @__PURE__ */ jsx("div", {
      children: correct ? /* @__PURE__ */ jsx(GenericParserViewer, {
        expr,
        grammar,
        startSymbol
      }) : /* @__PURE__ */ jsx(Card, {
        title: "分析结果",
        style: {
          marginTop: 16
        },
        children: "文法定义错误或开始符号不在文法中"
      })
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: leftmostDerivation
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DKJrwaIB.js", "imports": ["/assets/chunk-D4RADZKF-D4_s_IH5.js", "/assets/client-BNi0jpG0.js", "/assets/index-D4DweKH7.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DlXEsG-l.js", "imports": ["/assets/chunk-D4RADZKF-D4_s_IH5.js", "/assets/client-BNi0jpG0.js", "/assets/index-D4DweKH7.js", "/assets/presets-B67F0CB-.js", "/assets/EllipsisOutlined-DMfHtFdL.js", "/assets/index-D9LunClE.js", "/assets/AntdIcon-eqsStcNR.js", "/assets/useCSSVarCls-MKdiAhBR.js", "/assets/mediaQueryUtil-BSyvLspT.js"], "css": ["/assets/root-CFNB61bn.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home/home": { "id": "routes/home/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-Bkkdi39G.js", "imports": ["/assets/presets-B67F0CB-.js", "/assets/chunk-D4RADZKF-D4_s_IH5.js", "/assets/AntdIcon-eqsStcNR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/brief/$id": { "id": "routes/brief/$id", "parentId": "root", "path": "brief/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_id-BtFbzs5L.js", "imports": ["/assets/presets-B67F0CB-.js", "/assets/chunk-D4RADZKF-D4_s_IH5.js", "/assets/markdown-B-iucxVB.js", "/assets/useCSSVarCls-MKdiAhBR.js", "/assets/index-D4DweKH7.js", "/assets/useBreakpoint-57Y3d-K_.js", "/assets/mediaQueryUtil-BSyvLspT.js"], "css": ["/assets/markdown-D4JKo971.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/exercise/$id": { "id": "routes/exercise/$id", "parentId": "root", "path": "exercise/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_id-Dvok2i77.js", "imports": ["/assets/presets-B67F0CB-.js", "/assets/chunk-D4RADZKF-D4_s_IH5.js", "/assets/markdown-B-iucxVB.js", "/assets/useCSSVarCls-MKdiAhBR.js", "/assets/index-D4DweKH7.js", "/assets/useBreakpoint-57Y3d-K_.js", "/assets/mediaQueryUtil-BSyvLspT.js"], "css": ["/assets/markdown-D4JKo971.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/regex-converter/regex-converter": { "id": "routes/regex-converter/regex-converter", "parentId": "root", "path": "regex-converter", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/regex-converter-Bg0vEzyX.js", "imports": ["/assets/presets-B67F0CB-.js", "/assets/chunk-D4RADZKF-D4_s_IH5.js", "/assets/usePrefersColorScheme-Bi-WMh7j.js", "/assets/useCSSVarCls-MKdiAhBR.js", "/assets/index-D4DweKH7.js", "/assets/EllipsisOutlined-DMfHtFdL.js", "/assets/AntdIcon-eqsStcNR.js", "/assets/index-D9LunClE.js", "/assets/useBreakpoint-57Y3d-K_.js", "/assets/mediaQueryUtil-BSyvLspT.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/leftmost-derivation/leftmost-derivation": { "id": "routes/leftmost-derivation/leftmost-derivation", "parentId": "root", "path": "leftmost-derivation", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/leftmost-derivation-BW-ae-fq.js", "imports": ["/assets/presets-B67F0CB-.js", "/assets/chunk-D4RADZKF-D4_s_IH5.js", "/assets/usePrefersColorScheme-Bi-WMh7j.js", "/assets/EllipsisOutlined-DMfHtFdL.js", "/assets/index-D4DweKH7.js", "/assets/useCSSVarCls-MKdiAhBR.js", "/assets/AntdIcon-eqsStcNR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-06fa355c.js", "version": "06fa355c", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home/home": {
    id: "routes/home/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/brief/$id": {
    id: "routes/brief/$id",
    parentId: "root",
    path: "brief/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/exercise/$id": {
    id: "routes/exercise/$id",
    parentId: "root",
    path: "exercise/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/regex-converter/regex-converter": {
    id: "routes/regex-converter/regex-converter",
    parentId: "root",
    path: "regex-converter",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/leftmost-derivation/leftmost-derivation": {
    id: "routes/leftmost-derivation/leftmost-derivation",
    parentId: "root",
    path: "leftmost-derivation",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
