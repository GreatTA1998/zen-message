import{S as z,i as C,s as F,w as L,x as Q,y as X,q as I,o as S,B as Y,e as v,k as y,t as M,l as R,c as N,m as T,a as P,d as f,h as V,f as k,b as J,g as m,O as w,J as U,N as q,p as Z,P as A,_ as G,n as H,Z as K,U as W,V as $,X as j}from"../chunks/vendor-f53b4472.js";import{P as ee,u as te,d as se}from"../chunks/PhoneLogin-5d69dbd4.js";import"../chunks/singletons-d1fb5791.js";function x(l){let t,r;return t=new ee({props:{canTakeInternationalNumbers:!0}}),{c(){L(t.$$.fragment)},l(s){Q(t.$$.fragment,s)},m(s,o){X(t,s,o),r=!0},i(s){r||(I(t.$$.fragment,s),r=!0)},o(s){S(t.$$.fragment,s),r=!1},d(s){Y(t,s)}}}function ne(l){let t,r,s,o,p,i,_,d,c,h,b,u,g,O,B,n=!l[3]&&x();return{c(){t=v("input"),r=y(),s=v("div"),o=v("input"),p=y(),i=v("button"),_=M("Send message"),d=y(),c=v("div"),h=M("Or create an account"),b=y(),n&&n.c(),u=R(),this.h()},l(e){t=N(e,"INPUT",{style:!0,placeholder:!0}),r=T(e),s=N(e,"DIV",{});var a=P(s);o=N(a,"INPUT",{placeholder:!0}),a.forEach(f),p=T(e),i=N(e,"BUTTON",{style:!0});var D=P(i);_=V(D,"Send message"),D.forEach(f),d=T(e),c=N(e,"DIV",{});var E=P(c);h=V(E,"Or create an account"),E.forEach(f),b=T(e),n&&n.l(e),u=R(),this.h()},h(){k(t,"width","300px"),k(t,"box-sizing","border-box"),J(t,"placeholder","Type message here..."),J(o,"placeholder","Your name e.g. John"),k(i,"margin-top","12px"),k(i,"height","30px"),k(i,"width","300px")},m(e,a){m(e,t,a),w(t,l[0]),l[7](t),m(e,r,a),m(e,s,a),U(s,o),w(o,l[1]),m(e,p,a),m(e,i,a),U(i,_),m(e,d,a),m(e,c,a),U(c,h),m(e,b,a),n&&n.m(e,a),m(e,u,a),g=!0,O||(B=[q(t,"input",l[6]),q(o,"input",l[8]),q(i,"click",l[4])],O=!0)},p(e,[a]){a&1&&t.value!==e[0]&&w(t,e[0]),a&2&&o.value!==e[1]&&w(o,e[1]),e[3]?n&&(H(),S(n,1,1,()=>{n=null}),Z()):n?a&8&&I(n,1):(n=x(),n.c(),I(n,1),n.m(u.parentNode,u))},i(e){g||(I(n),g=!0)},o(e){S(n),g=!1},d(e){e&&f(t),l[7](null),e&&f(r),e&&f(s),e&&f(p),e&&f(i),e&&f(d),e&&f(c),e&&f(b),n&&n.d(e),e&&f(u),O=!1,A(B)}}}function re({params:l}){return{props:{uid:l.uid}}}function ie(l,t,r){let s;G(l,te,u=>r(3,s=u));let{uid:o}=t,p="",i="",_;console.log("uid =",o);function d(){if(!i||!p){alert("Need both message and name");return}const u=W(se,"users",o);$(u,{messageRequestNames:j(i),messageRequestObjects:j({content:p,senderName:i})}),alert("updated user")}function c(){p=this.value,r(0,p)}function h(u){K[u?"unshift":"push"](()=>{_=u,r(2,_)})}function b(){i=this.value,r(1,i)}return l.$$set=u=>{"uid"in u&&r(5,o=u.uid)},[p,i,_,s,d,o,c,h,b]}class oe extends z{constructor(t){super();C(this,t,ie,ne,F,{uid:5})}}export{oe as default,re as load};