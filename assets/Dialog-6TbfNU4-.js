import{r as c,K as ue,h as V,j as u,P as j,d as at,e as ot,g as X,i as F,k as re,l as it,S as ct,D as st,M as lt,n as I,X as ut,B as Y}from"./index-Cg5_u33F.js";import{u as dt}from"./index-BVdG0zwh.js";var z=0;function ft(){c.useEffect(()=>{const e=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",e[0]??de()),document.body.insertAdjacentElement("beforeend",e[1]??de()),z++,()=>{z===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(t=>t.remove()),z--}},[])}function de(){const e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}var q="focusScope.autoFocusOnMount",Z="focusScope.autoFocusOnUnmount",fe={bubbles:!1,cancelable:!0},vt="FocusScope",Ce=c.forwardRef((e,t)=>{const{loop:n=!1,trapped:r=!1,onMountAutoFocus:a,onUnmountAutoFocus:o,...l}=e,[i,m]=c.useState(null),v=ue(a),h=ue(o),f=c.useRef(null),p=V(t,s=>m(s)),y=c.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;c.useEffect(()=>{if(r){let s=function(b){if(y.paused||!i)return;const E=b.target;i.contains(E)?f.current=E:N(f.current,{select:!0})},d=function(b){if(y.paused||!i)return;const E=b.relatedTarget;E!==null&&(i.contains(E)||N(f.current,{select:!0}))},g=function(b){if(document.activeElement===document.body)for(const C of b)C.removedNodes.length>0&&N(i)};document.addEventListener("focusin",s),document.addEventListener("focusout",d);const x=new MutationObserver(g);return i&&x.observe(i,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",s),document.removeEventListener("focusout",d),x.disconnect()}}},[r,i,y.paused]),c.useEffect(()=>{if(i){ge.add(y);const s=document.activeElement;if(!i.contains(s)){const g=new CustomEvent(q,fe);i.addEventListener(q,v),i.dispatchEvent(g),g.defaultPrevented||(gt(bt(xe(i)),{select:!0}),document.activeElement===s&&N(i))}return()=>{i.removeEventListener(q,v),setTimeout(()=>{const g=new CustomEvent(Z,fe);i.addEventListener(Z,h),i.dispatchEvent(g),g.defaultPrevented||N(s??document.body,{select:!0}),i.removeEventListener(Z,h),ge.remove(y)},0)}}},[i,v,h,y]);const w=c.useCallback(s=>{if(!n&&!r||y.paused)return;const d=s.key==="Tab"&&!s.altKey&&!s.ctrlKey&&!s.metaKey,g=document.activeElement;if(d&&g){const x=s.currentTarget,[b,E]=mt(x);b&&E?!s.shiftKey&&g===E?(s.preventDefault(),n&&N(b,{select:!0})):s.shiftKey&&g===b&&(s.preventDefault(),n&&N(E,{select:!0})):g===x&&s.preventDefault()}},[n,r,y.paused]);return u.jsx(j.div,{tabIndex:-1,...l,ref:p,onKeyDown:w})});Ce.displayName=vt;function gt(e,{select:t=!1}={}){const n=document.activeElement;for(const r of e)if(N(r,{select:t}),document.activeElement!==n)return}function mt(e){const t=xe(e),n=ve(t,e),r=ve(t.reverse(),e);return[n,r]}function xe(e){const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const a=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||a?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function ve(e,t){for(const n of e)if(!ht(n,{upTo:t}))return n}function ht(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}function pt(e){return e instanceof HTMLInputElement&&"select"in e}function N(e,{select:t=!1}={}){if(e&&e.focus){const n=document.activeElement;e.focus({preventScroll:!0}),e!==n&&pt(e)&&t&&e.select()}}var ge=yt();function yt(){let e=[];return{add(t){const n=e[0];t!==n&&(n==null||n.pause()),e=me(e,t),e.unshift(t)},remove(t){var n;e=me(e,t),(n=e[0])==null||n.resume()}}}function me(e,t){const n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function bt(e){return e.filter(t=>t.tagName!=="A")}var Et=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},O=new WeakMap,L=new WeakMap,W={},Q=0,we=function(e){return e&&(e.host||we(e.parentNode))},Ct=function(e,t){return t.map(function(n){if(e.contains(n))return n;var r=we(n);return r&&e.contains(r)?r:(console.error("aria-hidden",n,"in not contained inside",e,". Doing nothing"),null)}).filter(function(n){return!!n})},xt=function(e,t,n,r){var a=Ct(t,Array.isArray(e)?e:[e]);W[n]||(W[n]=new WeakMap);var o=W[n],l=[],i=new Set,m=new Set(a),v=function(f){!f||i.has(f)||(i.add(f),v(f.parentNode))};a.forEach(v);var h=function(f){!f||m.has(f)||Array.prototype.forEach.call(f.children,function(p){if(i.has(p))h(p);else try{var y=p.getAttribute(r),w=y!==null&&y!=="false",s=(O.get(p)||0)+1,d=(o.get(p)||0)+1;O.set(p,s),o.set(p,d),l.push(p),s===1&&w&&L.set(p,!0),d===1&&p.setAttribute(n,"true"),w||p.setAttribute(r,"true")}catch(g){console.error("aria-hidden: cannot operate on ",p,g)}})};return h(t),i.clear(),Q++,function(){l.forEach(function(f){var p=O.get(f)-1,y=o.get(f)-1;O.set(f,p),o.set(f,y),p||(L.has(f)||f.removeAttribute(r),L.delete(f)),y||f.removeAttribute(n)}),Q--,Q||(O=new WeakMap,O=new WeakMap,L=new WeakMap,W={})}},wt=function(e,t,n){n===void 0&&(n="data-aria-hidden");var r=Array.from(Array.isArray(e)?e:[e]),a=Et(e);return a?(r.push.apply(r,Array.from(a.querySelectorAll("[aria-live]"))),xt(r,a,n,"aria-hidden")):function(){return null}},D=function(){return D=Object.assign||function(t){for(var n,r=1,a=arguments.length;r<a;r++){n=arguments[r];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},D.apply(this,arguments)};function Se(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]]);return n}function St(e,t,n){if(n||arguments.length===2)for(var r=0,a=t.length,o;r<a;r++)(o||!(r in t))&&(o||(o=Array.prototype.slice.call(t,0,r)),o[r]=t[r]);return e.concat(o||Array.prototype.slice.call(t))}var H="right-scroll-bar-position",U="width-before-scroll-bar",Dt="with-scroll-bars-hidden",Nt="--removed-body-scroll-bar-size";function J(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function Rt(e,t){var n=c.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var a=n.value;a!==r&&(n.value=r,n.callback(r,a))}}}})[0];return n.callback=t,n.facade}var Pt=typeof window<"u"?c.useLayoutEffect:c.useEffect,he=new WeakMap;function Ot(e,t){var n=Rt(null,function(r){return e.forEach(function(a){return J(a,r)})});return Pt(function(){var r=he.get(n);if(r){var a=new Set(r),o=new Set(e),l=n.current;a.forEach(function(i){o.has(i)||J(i,null)}),o.forEach(function(i){a.has(i)||J(i,l)})}he.set(n,e)},[e]),n}function At(e){return e}function Tt(e,t){t===void 0&&(t=At);var n=[],r=!1,a={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(o){var l=t(o,r);return n.push(l),function(){n=n.filter(function(i){return i!==l})}},assignSyncMedium:function(o){for(r=!0;n.length;){var l=n;n=[],l.forEach(o)}n={push:function(i){return o(i)},filter:function(){return n}}},assignMedium:function(o){r=!0;var l=[];if(n.length){var i=n;n=[],i.forEach(o),l=n}var m=function(){var h=l;l=[],h.forEach(o)},v=function(){return Promise.resolve().then(m)};v(),n={push:function(h){l.push(h),v()},filter:function(h){return l=l.filter(h),n}}}};return a}function kt(e){e===void 0&&(e={});var t=Tt(null);return t.options=D({async:!0,ssr:!1},e),t}var De=function(e){var t=e.sideCar,n=Se(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return c.createElement(r,D({},n))};De.isSideCarExport=!0;function jt(e,t){return e.useMedium(t),De}var Ne=kt(),ee=function(){},G=c.forwardRef(function(e,t){var n=c.useRef(null),r=c.useState({onScrollCapture:ee,onWheelCapture:ee,onTouchMoveCapture:ee}),a=r[0],o=r[1],l=e.forwardProps,i=e.children,m=e.className,v=e.removeScrollBar,h=e.enabled,f=e.shards,p=e.sideCar,y=e.noIsolation,w=e.inert,s=e.allowPinchZoom,d=e.as,g=d===void 0?"div":d,x=e.gapMode,b=Se(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),E=p,C=Ot([n,t]),P=D(D({},b),a);return c.createElement(c.Fragment,null,h&&c.createElement(E,{sideCar:Ne,removeScrollBar:v,shards:f,noIsolation:y,inert:w,setCallbacks:o,allowPinchZoom:!!s,lockRef:n,gapMode:x}),l?c.cloneElement(c.Children.only(i),D(D({},P),{ref:C})):c.createElement(g,D({},P,{className:m,ref:C}),i))});G.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};G.classNames={fullWidth:U,zeroRight:H};var It=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Mt(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=It();return t&&e.setAttribute("nonce",t),e}function Ft(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function _t(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Lt=function(){var e=0,t=null;return{add:function(n){e==0&&(t=Mt())&&(Ft(t,n),_t(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},Wt=function(){var e=Lt();return function(t,n){c.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},Re=function(){var e=Wt(),t=function(n){var r=n.styles,a=n.dynamic;return e(r,a),null};return t},Bt={left:0,top:0,right:0,gap:0},te=function(e){return parseInt(e||"",10)||0},$t=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],a=t[e==="padding"?"paddingRight":"marginRight"];return[te(n),te(r),te(a)]},Ht=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Bt;var t=$t(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},Ut=Re(),k="data-scroll-locked",Kt=function(e,t,n,r){var a=e.left,o=e.top,l=e.right,i=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(Dt,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(i,"px ").concat(r,`;
  }
  body[`).concat(k,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(a,`px;
    padding-top: `).concat(o,`px;
    padding-right: `).concat(l,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(i,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(H,` {
    right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(U,` {
    margin-right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(H," .").concat(H,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(U," .").concat(U,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(k,`] {
    `).concat(Nt,": ").concat(i,`px;
  }
`)},pe=function(){var e=parseInt(document.body.getAttribute(k)||"0",10);return isFinite(e)?e:0},Vt=function(){c.useEffect(function(){return document.body.setAttribute(k,(pe()+1).toString()),function(){var e=pe()-1;e<=0?document.body.removeAttribute(k):document.body.setAttribute(k,e.toString())}},[])},Gt=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,a=r===void 0?"margin":r;Vt();var o=c.useMemo(function(){return Ht(a)},[a]);return c.createElement(Ut,{styles:Kt(o,!t,a,n?"":"!important")})},ne=!1;if(typeof window<"u")try{var B=Object.defineProperty({},"passive",{get:function(){return ne=!0,!0}});window.addEventListener("test",B,B),window.removeEventListener("test",B,B)}catch{ne=!1}var A=ne?{passive:!1}:!1,Xt=function(e){return e.tagName==="TEXTAREA"},Pe=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!Xt(e)&&n[t]==="visible")},Yt=function(e){return Pe(e,"overflowY")},zt=function(e){return Pe(e,"overflowX")},ye=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var a=Oe(e,r);if(a){var o=Ae(e,r),l=o[1],i=o[2];if(l>i)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},qt=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},Zt=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},Oe=function(e,t){return e==="v"?Yt(t):zt(t)},Ae=function(e,t){return e==="v"?qt(t):Zt(t)},Qt=function(e,t){return e==="h"&&t==="rtl"?-1:1},Jt=function(e,t,n,r,a){var o=Qt(e,window.getComputedStyle(t).direction),l=o*r,i=n.target,m=t.contains(i),v=!1,h=l>0,f=0,p=0;do{var y=Ae(e,i),w=y[0],s=y[1],d=y[2],g=s-d-o*w;(w||g)&&Oe(e,i)&&(f+=g,p+=w),i instanceof ShadowRoot?i=i.host:i=i.parentNode}while(!m&&i!==document.body||m&&(t.contains(i)||t===i));return(h&&Math.abs(f)<1||!h&&Math.abs(p)<1)&&(v=!0),v},$=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},be=function(e){return[e.deltaX,e.deltaY]},Ee=function(e){return e&&"current"in e?e.current:e},en=function(e,t){return e[0]===t[0]&&e[1]===t[1]},tn=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},nn=0,T=[];function rn(e){var t=c.useRef([]),n=c.useRef([0,0]),r=c.useRef(),a=c.useState(nn++)[0],o=c.useState(Re)[0],l=c.useRef(e);c.useEffect(function(){l.current=e},[e]),c.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(a));var s=St([e.lockRef.current],(e.shards||[]).map(Ee),!0).filter(Boolean);return s.forEach(function(d){return d.classList.add("allow-interactivity-".concat(a))}),function(){document.body.classList.remove("block-interactivity-".concat(a)),s.forEach(function(d){return d.classList.remove("allow-interactivity-".concat(a))})}}},[e.inert,e.lockRef.current,e.shards]);var i=c.useCallback(function(s,d){if("touches"in s&&s.touches.length===2||s.type==="wheel"&&s.ctrlKey)return!l.current.allowPinchZoom;var g=$(s),x=n.current,b="deltaX"in s?s.deltaX:x[0]-g[0],E="deltaY"in s?s.deltaY:x[1]-g[1],C,P=s.target,M=Math.abs(b)>Math.abs(E)?"h":"v";if("touches"in s&&M==="h"&&P.type==="range")return!1;var _=ye(M,P);if(!_)return!0;if(_?C=M:(C=M==="v"?"h":"v",_=ye(M,P)),!_)return!1;if(!r.current&&"changedTouches"in s&&(b||E)&&(r.current=C),!C)return!0;var le=r.current||C;return Jt(le,d,s,le==="h"?b:E)},[]),m=c.useCallback(function(s){var d=s;if(!(!T.length||T[T.length-1]!==o)){var g="deltaY"in d?be(d):$(d),x=t.current.filter(function(C){return C.name===d.type&&(C.target===d.target||d.target===C.shadowParent)&&en(C.delta,g)})[0];if(x&&x.should){d.cancelable&&d.preventDefault();return}if(!x){var b=(l.current.shards||[]).map(Ee).filter(Boolean).filter(function(C){return C.contains(d.target)}),E=b.length>0?i(d,b[0]):!l.current.noIsolation;E&&d.cancelable&&d.preventDefault()}}},[]),v=c.useCallback(function(s,d,g,x){var b={name:s,delta:d,target:g,should:x,shadowParent:an(g)};t.current.push(b),setTimeout(function(){t.current=t.current.filter(function(E){return E!==b})},1)},[]),h=c.useCallback(function(s){n.current=$(s),r.current=void 0},[]),f=c.useCallback(function(s){v(s.type,be(s),s.target,i(s,e.lockRef.current))},[]),p=c.useCallback(function(s){v(s.type,$(s),s.target,i(s,e.lockRef.current))},[]);c.useEffect(function(){return T.push(o),e.setCallbacks({onScrollCapture:f,onWheelCapture:f,onTouchMoveCapture:p}),document.addEventListener("wheel",m,A),document.addEventListener("touchmove",m,A),document.addEventListener("touchstart",h,A),function(){T=T.filter(function(s){return s!==o}),document.removeEventListener("wheel",m,A),document.removeEventListener("touchmove",m,A),document.removeEventListener("touchstart",h,A)}},[]);var y=e.removeScrollBar,w=e.inert;return c.createElement(c.Fragment,null,w?c.createElement(o,{styles:tn(a)}):null,y?c.createElement(Gt,{gapMode:e.gapMode}):null)}function an(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const on=jt(Ne,rn);var Te=c.forwardRef(function(e,t){return c.createElement(G,D({},e,{ref:t,sideCar:on}))});Te.classNames=G.classNames;var ae="Dialog",[ke,Rn]=ot(ae),[cn,S]=ke(ae),je=e=>{const{__scopeDialog:t,children:n,open:r,defaultOpen:a,onOpenChange:o,modal:l=!0}=e,i=c.useRef(null),m=c.useRef(null),[v=!1,h]=at({prop:r,defaultProp:a,onChange:o});return u.jsx(cn,{scope:t,triggerRef:i,contentRef:m,contentId:X(),titleId:X(),descriptionId:X(),open:v,onOpenChange:h,onOpenToggle:c.useCallback(()=>h(f=>!f),[h]),modal:l,children:n})};je.displayName=ae;var Ie="DialogTrigger",Me=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=S(Ie,n),o=V(t,a.triggerRef);return u.jsx(j.button,{type:"button","aria-haspopup":"dialog","aria-expanded":a.open,"aria-controls":a.contentId,"data-state":se(a.open),...r,ref:o,onClick:F(e.onClick,a.onOpenToggle)})});Me.displayName=Ie;var oe="DialogPortal",[sn,Fe]=ke(oe,{forceMount:void 0}),_e=e=>{const{__scopeDialog:t,forceMount:n,children:r,container:a}=e,o=S(oe,t);return u.jsx(sn,{scope:t,forceMount:n,children:c.Children.map(r,l=>u.jsx(re,{present:n||o.open,children:u.jsx(it,{asChild:!0,container:a,children:l})}))})};_e.displayName=oe;var K="DialogOverlay",Le=c.forwardRef((e,t)=>{const n=Fe(K,e.__scopeDialog),{forceMount:r=n.forceMount,...a}=e,o=S(K,e.__scopeDialog);return o.modal?u.jsx(re,{present:r||o.open,children:u.jsx(ln,{...a,ref:t})}):null});Le.displayName=K;var ln=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=S(K,n);return u.jsx(Te,{as:ct,allowPinchZoom:!0,shards:[a.contentRef],children:u.jsx(j.div,{"data-state":se(a.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),R="DialogContent",We=c.forwardRef((e,t)=>{const n=Fe(R,e.__scopeDialog),{forceMount:r=n.forceMount,...a}=e,o=S(R,e.__scopeDialog);return u.jsx(re,{present:r||o.open,children:o.modal?u.jsx(un,{...a,ref:t}):u.jsx(dn,{...a,ref:t})})});We.displayName=R;var un=c.forwardRef((e,t)=>{const n=S(R,e.__scopeDialog),r=c.useRef(null),a=V(t,n.contentRef,r);return c.useEffect(()=>{const o=r.current;if(o)return wt(o)},[]),u.jsx(Be,{...e,ref:a,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:F(e.onCloseAutoFocus,o=>{var l;o.preventDefault(),(l=n.triggerRef.current)==null||l.focus()}),onPointerDownOutside:F(e.onPointerDownOutside,o=>{const l=o.detail.originalEvent,i=l.button===0&&l.ctrlKey===!0;(l.button===2||i)&&o.preventDefault()}),onFocusOutside:F(e.onFocusOutside,o=>o.preventDefault())})}),dn=c.forwardRef((e,t)=>{const n=S(R,e.__scopeDialog),r=c.useRef(!1),a=c.useRef(!1);return u.jsx(Be,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:o=>{var l,i;(l=e.onCloseAutoFocus)==null||l.call(e,o),o.defaultPrevented||(r.current||(i=n.triggerRef.current)==null||i.focus(),o.preventDefault()),r.current=!1,a.current=!1},onInteractOutside:o=>{var m,v;(m=e.onInteractOutside)==null||m.call(e,o),o.defaultPrevented||(r.current=!0,o.detail.originalEvent.type==="pointerdown"&&(a.current=!0));const l=o.target;((v=n.triggerRef.current)==null?void 0:v.contains(l))&&o.preventDefault(),o.detail.originalEvent.type==="focusin"&&a.current&&o.preventDefault()}})}),Be=c.forwardRef((e,t)=>{const{__scopeDialog:n,trapFocus:r,onOpenAutoFocus:a,onCloseAutoFocus:o,...l}=e,i=S(R,n),m=c.useRef(null),v=V(t,m);return ft(),u.jsxs(u.Fragment,{children:[u.jsx(Ce,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:a,onUnmountAutoFocus:o,children:u.jsx(st,{role:"dialog",id:i.contentId,"aria-describedby":i.descriptionId,"aria-labelledby":i.titleId,"data-state":se(i.open),...l,ref:v,onDismiss:()=>i.onOpenChange(!1)})}),u.jsxs(u.Fragment,{children:[u.jsx(fn,{titleId:i.titleId}),u.jsx(gn,{contentRef:m,descriptionId:i.descriptionId})]})]})}),ie="DialogTitle",$e=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=S(ie,n);return u.jsx(j.h2,{id:a.titleId,...r,ref:t})});$e.displayName=ie;var He="DialogDescription",Ue=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=S(He,n);return u.jsx(j.p,{id:a.descriptionId,...r,ref:t})});Ue.displayName=He;var Ke="DialogClose",ce=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=S(Ke,n);return u.jsx(j.button,{type:"button",...r,ref:t,onClick:F(e.onClick,()=>a.onOpenChange(!1))})});ce.displayName=Ke;function se(e){return e?"open":"closed"}var Ve="DialogTitleWarning",[Pn,Ge]=lt(Ve,{contentName:R,titleName:ie,docsSlug:"dialog"}),fn=({titleId:e})=>{const t=Ge(Ve),n=`\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;return c.useEffect(()=>{e&&(document.getElementById(e)||console.error(n))},[n,e]),null},vn="DialogDescriptionWarning",gn=({contentRef:e,descriptionId:t})=>{const r=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Ge(vn).contentName}}.`;return c.useEffect(()=>{var o;const a=(o=e.current)==null?void 0:o.getAttribute("aria-describedby");t&&a&&(document.getElementById(t)||console.warn(r))},[r,e,t]),null},mn=je,On=Me,hn=_e,Xe=Le,Ye=We,ze=$e,qe=Ue,pn=ce;const yn=mn,bn=hn,Ze=c.forwardRef(({className:e,...t},n)=>u.jsx(Xe,{ref:n,className:I("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...t}));Ze.displayName=Xe.displayName;const Qe=c.forwardRef(({className:e,children:t,...n},r)=>u.jsxs(bn,{children:[u.jsx(Ze,{}),u.jsxs(Ye,{ref:r,className:I("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950",e),...n,children:[t,u.jsxs(pn,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400",children:[u.jsx(ut,{className:"h-4 w-4"}),u.jsx("span",{className:"sr-only",children:"Close"})]})]})]}));Qe.displayName=Ye.displayName;const Je=({className:e,...t})=>u.jsx("div",{className:I("flex flex-col space-y-1.5 text-center sm:text-left",e),...t});Je.displayName="DialogHeader";const et=({className:e,...t})=>u.jsx("div",{className:I("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...t});et.displayName="DialogFooter";const tt=c.forwardRef(({className:e,...t},n)=>u.jsx(ze,{ref:n,className:I("text-lg font-semibold leading-none tracking-tight",e),...t}));tt.displayName=ze.displayName;const nt=c.forwardRef(({className:e,...t},n)=>u.jsx(qe,{ref:n,className:I("text-sm text-neutral-500 dark:text-neutral-400",e),...t}));nt.displayName=qe.displayName;const rt=c.createContext(null);function En({children:e,...t}){return u.jsx(rt.Provider,{value:t,children:e})}function An(){const[e,t]=c.useState(!1),n=c.useCallback(()=>{t(!0)},[]),r=c.useCallback(()=>{t(!1)},[]),a=c.useCallback(()=>{t(l=>!l)},[]),o=c.useCallback(l=>{t(l)},[]);return{isOpen:e,handleOpen:o,openDialog:n,closeDialog:r,toggleDialog:a}}function Tn(){const e=c.useContext(rt);if(!e)throw new Error("useDialogContext must be used within a DialogProvider");return e}function Cn({children:e,...t}){return u.jsx(En,{...t,children:u.jsx(yn,{open:t.isOpen,onOpenChange:t.handleOpen,children:u.jsx(Qe,{className:"bg-light-surfaceContainerLowest p-0 gap-0",children:e})})})}function xn({title:e}){return u.jsxs(Je,{className:"flex gap-2 flex-row items-center px-6 pt-6 pb-2",children:[u.jsx(tt,{className:"flex-1",children:u.jsx("span",{className:"text-light-onSurface text-title-large",children:e})}),u.jsx(nt,{})]})}function wn({children:e}){return u.jsx("div",{className:"px-6 py-2",children:e})}function Sn({onClickPrimaryBtn:e,labelPrimaryBtn:t,primaryBtnState:n,primaryBtResource:r,primaryBtnAction:a,onClickSecondaryBtn:o,labelSecondaryBtn:l="Cancelar",secondaryBtnState:i,dirty:m}){const v=dt({dirty:m,buttonState:n});return u.jsxs(et,{className:"flex px-6 pb-6 pt-2",children:[o?u.jsx(Y,{variant:"quaternary",onClick:o,label:l,state:i}):u.jsx(ce,{asChild:!0,children:u.jsx(Y,{variant:"quaternary",label:l,state:i})}),u.jsx(Y,{variant:"primary",onClick:e,label:t,state:v,type:"submit",resource:r,action:a})]})}const kn=Object.assign(Cn,{Header:xn,Body:wn,Footer:Sn});export{pn as C,qe as D,Ce as F,Xe as O,hn as P,Te as R,On as T,mn as a,ze as b,Ye as c,En as d,nt as e,An as f,Tn as g,wt as h,kn as i,ft as u};
