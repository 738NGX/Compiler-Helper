import{g as L,I as N,u as U,a as W,_ as b,b as l,c as _,d as S,e as q,f as x,h as F,i as G}from"./presets-B67F0CB-.js";import{r as s,p as h}from"./chunk-D4RADZKF-D4_s_IH5.js";function R(n){var o;return n==null||(o=n.getRootNode)===null||o===void 0?void 0:o.call(n)}function H(n){return R(n)instanceof ShadowRoot}function J(n){return H(n)?R(n):null}function K(n){return n.replace(/-(.)/g,function(o,e){return e.toUpperCase()})}function M(n,o){W(n,"[@ant-design/icons] ".concat(o))}function k(n){return b(n)==="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(b(n.icon)==="object"||typeof n.icon=="function")}function I(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Object.keys(n).reduce(function(o,e){var r=n[e];switch(e){case"class":o.className=r,delete o.class;break;default:delete o[e],o[K(e)]=r}return o},{})}function v(n,o,e){return e?h.createElement(n.tag,l(l({key:o},I(n.attrs)),e),(n.children||[]).map(function(r,a){return v(r,"".concat(o,"-").concat(n.tag,"-").concat(a))})):h.createElement(n.tag,l({key:o},I(n.attrs)),(n.children||[]).map(function(r,a){return v(r,"".concat(o,"-").concat(n.tag,"-").concat(a))}))}function E(n){return L(n)[0]}function z(n){return n?Array.isArray(n)?n:[n]:[]}var Q=`
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`,V=function(o){var e=s.useContext(N),r=e.csp,a=e.prefixCls,c=e.layer,t=Q;a&&(t=t.replace(/anticon/g,a)),c&&(t="@layer ".concat(c,` {
`).concat(t,`
}`)),s.useEffect(function(){var m=o.current,f=J(m);U(t,"@ant-design-icons",{prepend:!c,csp:r,attachTo:f})},[])},X=["icon","className","onClick","style","primaryColor","secondaryColor"],C={primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1};function Y(n){var o=n.primaryColor,e=n.secondaryColor;C.primaryColor=o,C.secondaryColor=e||E(o),C.calculated=!!e}function Z(){return l({},C)}var d=function(o){var e=o.icon,r=o.className,a=o.onClick,c=o.style,t=o.primaryColor,m=o.secondaryColor,f=_(o,X),y=s.useRef(),u=C;if(t&&(u={primaryColor:t,secondaryColor:m||E(t)}),V(y),M(k(e),"icon should be icon definiton, but got ".concat(e)),!k(e))return null;var i=e;return i&&typeof i.icon=="function"&&(i=l(l({},i),{},{icon:i.icon(u.primaryColor,u.secondaryColor)})),v(i.icon,"svg-".concat(i.name),l(l({className:r,onClick:a,style:c,"data-icon":i.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},f),{},{ref:y}))};d.displayName="IconReact";d.getTwoToneColors=Z;d.setTwoToneColors=Y;function $(n){var o=z(n),e=S(o,2),r=e[0],a=e[1];return d.setTwoToneColors({primaryColor:r,secondaryColor:a})}function nn(){var n=d.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var on=["className","icon","spin","rotate","tabIndex","onClick","twoToneColor"];$(G.primary);var T=s.forwardRef(function(n,o){var e=n.className,r=n.icon,a=n.spin,c=n.rotate,t=n.tabIndex,m=n.onClick,f=n.twoToneColor,y=_(n,on),u=s.useContext(N),i=u.prefixCls,g=i===void 0?"anticon":i,j=u.rootClassName,A=q(j,g,x(x({},"".concat(g,"-").concat(r.name),!!r.name),"".concat(g,"-spin"),!!a||r.name==="loading"),e),p=t;p===void 0&&m&&(p=-1);var P=c?{msTransform:"rotate(".concat(c,"deg)"),transform:"rotate(".concat(c,"deg)")}:void 0,B=z(f),w=S(B,2),O=w[0],D=w[1];return s.createElement("span",F({role:"img","aria-label":r.name},y,{ref:o,tabIndex:p,onClick:m,className:A}),s.createElement(d,{icon:r,primaryColor:O,secondaryColor:D,style:P}))});T.displayName="AntdIcon";T.getTwoToneColor=nn;T.setTwoToneColor=$;export{T as I,J as g};
