var Ge=Object.defineProperty;var be=Object.getOwnPropertySymbols;var Ke=Object.prototype.hasOwnProperty,Qe=Object.prototype.propertyIsEnumerable;var ye=(o,e,t)=>e in o?Ge(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,ke=(o,e)=>{for(var t in e||(e={}))Ke.call(e,t)&&ye(o,t,e[t]);if(be)for(var t of be(e))Qe.call(e,t)&&ye(o,t,e[t]);return o};import{S as qe,i as Le,s as ve,l as J,g as U,e as v,k as V,c as b,a as N,m as M,d as p,f as h,b as E,J as d,K as $,L as ne,t as C,h as P,M as de,N as H,O as j,P as me,Q as Xe,R as xe,v as $e,T as He,U as G,V as te,W as _e,E as et,X as ge,Y as Fe,Z as we,j as X,D as tt,o as ie,p as je,q as se,_ as lt,$ as ce,a0 as it,a1 as st,a2 as nt,n as Ye,a3 as ot,a4 as rt,a5 as Ie,w as at,x as ut,y as ft,B as ct}from"../chunks/vendor-87f020b6.js";import{d as Y}from"../chunks/db-f3cf9e2e.js";const pe=function(o,e={month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit",timeZone:"utc"}){const t=new Date(o);let i=t.getTimezoneOffset()*6e4;return new Date(t-i).toLocaleDateString("en-US",e)};function De(o,e,t){const i=o.slice();return i[18]=e[t],i}function Ee(o,e,t){const i=o.slice();return i[21]=e[t],i[23]=t,i}function Ne(o){let e,t=o[5].messages,i=[];for(let l=0;l<t.length;l+=1)i[l]=Ue(Ee(o,t,l));return{c(){for(let l=0;l<i.length;l+=1)i[l].c();e=J()},l(l){for(let n=0;n<i.length;n+=1)i[n].l(l);e=J()},m(l,n){for(let s=0;s<i.length;s+=1)i[s].m(l,n);U(l,e,n)},p(l,n){if(n&41){t=l[5].messages;let s;for(s=0;s<t.length;s+=1){const u=Ee(l,t,s);i[s]?i[s].p(u,n):(i[s]=Ue(u),i[s].c(),i[s].m(e.parentNode,e))}for(;s<i.length;s+=1)i[s].d(1);i.length=t.length}},d(l){ne(i,l),l&&p(e)}}}function ht(o){let e,t=o[21].content+"",i,l,n,s=" "+pe(o[21].timestamp),u;return{c(){e=v("p"),i=C(t),l=V(),n=v("p"),u=C(s),this.h()},l(r){e=b(r,"P",{style:!0,class:!0});var a=N(e);i=P(a,t),a.forEach(p),l=M(r),n=b(r,"P",{style:!0,class:!0});var m=N(n);u=P(m,s),m.forEach(p),this.h()},h(){h(e,"margin-right","4px"),h(e,"margin-left","0"),h(e,"margin-bottom","4px"),E(e,"class","svelte-l9tbzz"),h(n,"font-size","0.8rem"),h(n,"color","grey"),h(n,"margin-left","0"),h(n,"margin-right","auto"),h(n,"margin-top","18px"),E(n,"class","svelte-l9tbzz")},m(r,a){U(r,e,a),d(e,i),U(r,l,a),U(r,n,a),d(n,u)},p(r,a){a&32&&t!==(t=r[21].content+"")&&X(i,t),a&32&&s!==(s=" "+pe(r[21].timestamp))&&X(u,s)},d(r){r&&p(e),r&&p(l),r&&p(n)}}}function dt(o){let e,t=o[21].content+"",i,l,n,s=" "+pe(o[21].timestamp),u;return{c(){e=v("p"),i=C(t),l=V(),n=v("p"),u=C(s),this.h()},l(r){e=b(r,"P",{style:!0,class:!0});var a=N(e);i=P(a,t),a.forEach(p),l=M(r),n=b(r,"P",{style:!0,class:!0});var m=N(n);u=P(m,s),m.forEach(p),this.h()},h(){h(e,"margin-left","auto"),h(e,"margin-right","0"),h(e,"margin-bottom","4px"),E(e,"class","svelte-l9tbzz"),h(n,"font-size","0.7rem"),h(n,"color","grey"),h(n,"margin-left","4px"),h(n,"margin-bottom","0px"),h(n,"margin-top","18px"),E(n,"class","svelte-l9tbzz")},m(r,a){U(r,e,a),d(e,i),U(r,l,a),U(r,n,a),d(n,u)},p(r,a){a&32&&t!==(t=r[21].content+"")&&X(i,t),a&32&&s!==(s=" "+pe(r[21].timestamp))&&X(u,s)},d(r){r&&p(e),r&&p(l),r&&p(n)}}}function ze(o){let e;return{c(){e=v("div"),this.h()},l(t){e=b(t,"DIV",{class:!0}),N(e).forEach(p),this.h()},h(){E(e,"class","svelte-l9tbzz")},m(t,i){U(t,e,i),o[10](e)},p:$,d(t){t&&p(e),o[10](null)}}}function Ue(o){let e,t,i;function l(r,a){return r[21].authorUID===r[0].uid?dt:ht}let n=l(o),s=n(o),u=o[23]===o[5].messages.length-1&&ze(o);return{c(){e=v("div"),s.c(),t=V(),u&&u.c(),i=V(),this.h()},l(r){e=b(r,"DIV",{style:!0,class:!0});var a=N(e);s.l(a),t=M(a),u&&u.l(a),i=M(a),a.forEach(p),this.h()},h(){h(e,"display","flex"),h(e,"width","280px"),h(e,"margin-right","20px"),E(e,"class","svelte-l9tbzz")},m(r,a){U(r,e,a),s.m(e,null),d(e,t),u&&u.m(e,null),d(e,i)},p(r,a){n===(n=l(r))&&s?s.p(r,a):(s.d(1),s=n(r),s&&(s.c(),s.m(e,t))),r[23]===r[5].messages.length-1?u?u.p(r,a):(u=ze(r),u.c(),u.m(e,i)):u&&(u.d(1),u=null)},d(r){r&&p(e),s.d(),u&&u.d()}}}function Te(o){let e,t=o[18]+"",i,l,n,s;function u(){return o[13](o[18])}return{c(){e=v("div"),i=C(t),l=V(),this.h()},l(r){e=b(r,"DIV",{class:!0,style:!0});var a=N(e);i=P(a,t),l=M(a),a.forEach(p),this.h()},h(){E(e,"class","clickable-option svelte-l9tbzz"),h(e,"margin-left","4px"),de(e,"highlighted-box",o[1]===o[18])},m(r,a){U(r,e,a),d(e,i),d(e,l),n||(s=H(e,"click",u),n=!0)},p(r,a){o=r,a&66&&de(e,"highlighted-box",o[1]===o[18])},d(r){r&&p(e),n=!1,s()}}}function pt(o){let e,t,i,l,n,s,u,r,a,m,y,I,O,w,k=o[5].messages&&Ne(o),S=o[6],R=[];for(let c=0;c<S.length;c+=1)R[c]=Te(De(o,S,c));return{c(){e=v("div"),t=v("div"),k&&k.c(),i=V(),l=v("input"),n=V(),s=v("div"),u=v("div"),r=C("Want reply:"),a=V();for(let c=0;c<R.length;c+=1)R[c].c();m=V(),y=v("button"),I=C("Send message"),this.h()},l(c){e=b(c,"DIV",{style:!0,class:!0});var f=N(e);t=b(f,"DIV",{style:!0,class:!0});var g=N(t);k&&k.l(g),g.forEach(p),i=M(f),l=b(f,"INPUT",{style:!0,placeholder:!0,class:!0}),n=M(f),s=b(f,"DIV",{style:!0,class:!0});var _=N(s);u=b(_,"DIV",{style:!0,class:!0});var T=N(u);r=P(T,"Want reply:"),T.forEach(p),a=M(_);for(let W=0;W<R.length;W+=1)R[W].l(_);_.forEach(p),m=M(f),y=b(f,"BUTTON",{style:!0,class:!0});var D=N(y);I=P(D,"Send message"),D.forEach(p),f.forEach(p),this.h()},h(){h(t,"height","200px"),h(t,"overflow-y","auto"),h(t,"overflow-x","hidden"),E(t,"class","svelte-l9tbzz"),h(l,"width","300px"),h(l,"box-sizing","border-box"),E(l,"placeholder","Type message here..."),E(l,"class","svelte-l9tbzz"),h(u,"color","grey"),E(u,"class","svelte-l9tbzz"),h(s,"display","flex"),h(s,"margin-top","5px"),h(s,"align-items","center"),h(s,"flex-wrap","nowrap"),E(s,"class","svelte-l9tbzz"),h(y,"margin-top","12px"),h(y,"height","30px"),h(y,"width","300px"),E(y,"class","svelte-l9tbzz"),h(e,"width","300px"),E(e,"class","svelte-l9tbzz")},m(c,f){U(c,e,f),d(e,t),k&&k.m(t,null),d(e,i),d(e,l),j(l,o[4]),o[12](l),d(e,n),d(e,s),d(s,u),d(u,r),d(s,a);for(let g=0;g<R.length;g+=1)R[g].m(s,null);d(e,m),d(e,y),d(y,I),O||(w=[H(l,"input",o[11]),H(y,"click",o[7])],O=!0)},p(c,[f]){if(c[5].messages?k?k.p(c,f):(k=Ne(c),k.c(),k.m(t,null)):k&&(k.d(1),k=null),f&16&&l.value!==c[4]&&j(l,c[4]),f&66){S=c[6];let g;for(g=0;g<S.length;g+=1){const _=De(c,S,g);R[g]?R[g].p(_,f):(R[g]=Te(_),R[g].c(),R[g].m(s,null))}for(;g<R.length;g+=1)R[g].d(1);R.length=S.length}},i:$,o:$,d(c){c&&p(e),k&&k.d(),o[12](null),ne(R,c),O=!1,me(w)}}}function mt(o,e){if(e||(e=100),o){var t=document.createElement("input");t.style.position="absolute",t.style.top=o.offsetTop+7+"px",t.style.left=o.offsetLeft+"px",t.style.height=0,t.style.opacity=0,document.body.appendChild(t),t.focus(),setTimeout(function(){o.focus(),o.click(),document.body.removeChild(t)},e)}}function _t(o,e,t){let{friendUID:i}=e,{currentUser:l}=e,{chatRoomID:n}=e;const s=Xe(),u=xe(s,"sendTextMessage");let r,a,m,y=["now","today","any time"],I="any time",O={messages:[]};$e(()=>{He(G(Y,"chats",n),async f=>{if(console.log("Current data: ",f.data()),f.data()){t(5,O=f.data());const g=G(Y,"users",l.uid);te(g,{friendUIDsWithNewMessages:_e(n)}),await et(),mt(r,300),a.scrollIntoView({block:"center",behavior:"smooth"})}})});async function w(){const f=G(Y,"chats",n);te(f,{messages:ge({content:m,timestamp:Date.now(),authorUID:l.uid})});const g=G(Y,"users",i);te(g,{friendUIDsWithNewMessages:ge(n)});const _=await Fe(g);switch(I){case"any time":break;case"now":console.log("sending text to ,",_.data().phoneNumber),u({content:`${l.name} wrote "${m}"`,toWho:_.data().phoneNumber})}t(4,m="")}function k(f){we[f?"unshift":"push"](()=>{a=f,t(3,a)})}function S(){m=this.value,t(4,m)}function R(f){we[f?"unshift":"push"](()=>{r=f,t(2,r)})}const c=f=>t(1,I=f);return o.$$set=f=>{"friendUID"in f&&t(8,i=f.friendUID),"currentUser"in f&&t(0,l=f.currentUser),"chatRoomID"in f&&t(9,n=f.chatRoomID)},o.$$.update=()=>{o.$$.dirty&2&&console.log("reply within =",I)},[l,I,r,a,m,O,y,w,i,n,k,S,R,c]}class gt extends qe{constructor(e){super();Le(this,e,_t,pt,ve,{friendUID:8,currentUser:0,chatRoomID:9})}}const he=tt(null);function Re(o,e,t){const i=o.slice();return i[39]=e[t],i}function Ve(o,e,t){const i=o.slice();return i[42]=e[t],i}function Me(o,e,t){const i=o.slice();return i[45]=e[t],i}function vt(o){let e,t,i,l,n,s,u,r,a,m,y,I,O,w,k,S,R,c=o[5].friends,f=[];for(let T=0;T<c.length;T+=1)f[T]=Ce(Me(o,c,T));let g=o[13]&&Pe(o),_=o[5].messageRequestNames instanceof Array&&We(o);return{c(){e=v("div"),t=v("h2"),i=C("People"),l=V();for(let T=0;T<f.length;T+=1)f[T].c();n=V(),s=v("button"),u=C("Add person"),r=V(),g&&g.c(),a=V(),m=v("h2"),y=C("Editable category"),I=C(`
        Coming soon...

        `),O=v("h2"),w=C("Outside Messages"),k=V(),_&&_.c(),this.h()},l(T){e=b(T,"DIV",{style:!0});var D=N(e);t=b(D,"H2",{class:!0});var W=N(t);i=P(W,"People"),W.forEach(p),l=M(D);for(let Q=0;Q<f.length;Q+=1)f[Q].l(D);n=M(D),s=b(D,"BUTTON",{style:!0});var A=N(s);u=P(A,"Add person"),A.forEach(p),r=M(D),g&&g.l(D),a=M(D),m=b(D,"H2",{class:!0,style:!0});var K=N(m);y=P(K,"Editable category"),K.forEach(p),I=P(D,`
        Coming soon...

        `),O=b(D,"H2",{class:!0,style:!0});var F=N(O);w=P(F,"Outside Messages"),F.forEach(p),k=M(D),_&&_.l(D),D.forEach(p),this.h()},h(){E(t,"class","message-group-title svelte-1637l9v"),h(s,"margin-top","20px"),E(m,"class","message-group-title svelte-1637l9v"),h(m,"margin-top","50px"),E(O,"class","message-group-title svelte-1637l9v"),h(O,"margin-top","50px"),h(e,"width","100px")},m(T,D){U(T,e,D),d(e,t),d(t,i),d(e,l);for(let W=0;W<f.length;W+=1)f[W].m(e,null);d(e,n),d(e,s),d(s,u),d(e,r),g&&g.m(e,null),d(e,a),d(e,m),d(m,y),d(e,I),d(e,O),d(O,w),d(e,k),_&&_.m(e,null),S||(R=H(s,"click",o[27]),S=!0)},p(T,D){if(D[0]&4144){c=T[5].friends;let W;for(W=0;W<c.length;W+=1){const A=Me(T,c,W);f[W]?f[W].p(A,D):(f[W]=Ce(A),f[W].c(),f[W].m(e,n))}for(;W<f.length;W+=1)f[W].d(1);f.length=c.length}T[13]?g?g.p(T,D):(g=Pe(T),g.c(),g.m(e,a)):g&&(g.d(1),g=null),T[5].messageRequestNames instanceof Array?_?_.p(T,D):(_=We(T),_.c(),_.m(e,null)):_&&(_.d(1),_=null)},d(T){T&&p(e),ne(f,T),g&&g.d(),_&&_.d(),S=!1,R()}}}function bt(o){let e;function t(n,s){return n[8]?yt:kt}let i=t(o),l=i(o);return{c(){l.c(),e=J()},l(n){l.l(n),e=J()},m(n,s){l.m(n,s),U(n,e,s)},p(n,s){i===(i=t(n))&&l?l.p(n,s):(l.d(1),l=i(n),l&&(l.c(),l.m(e.parentNode,e)))},d(n){l.d(n),n&&p(e)}}}function Ce(o){let e,t,i=o[45].name+"",l,n=o[12].includes(o[45].uid)?"New messages":"",s,u,r;function a(){return o[26](o[45])}return{c(){e=v("div"),t=v("span"),l=C(i),s=C(n),this.h()},l(m){e=b(m,"DIV",{style:!0,class:!0});var y=N(e);t=b(y,"SPAN",{style:!0,class:!0});var I=N(t);l=P(I,i),s=P(I,n),I.forEach(p),y.forEach(p),this.h()},h(){h(t,"margin-left","5px"),E(t,"class","svelte-1637l9v"),h(e,"border","solid orange"),h(e,"height","40px"),h(e,"display","flex"),h(e,"align-items","center"),E(e,"class","svelte-1637l9v"),de(e,"highlighted-box",o[45].uid===o[4])},m(m,y){U(m,e,y),d(e,t),d(t,l),d(t,s),u||(r=H(e,"click",a),u=!0)},p(m,y){o=m,y[0]&32&&i!==(i=o[45].name+"")&&X(l,i),y[0]&4128&&n!==(n=o[12].includes(o[45].uid)?"New messages":"")&&X(s,n),y[0]&48&&de(e,"highlighted-box",o[45].uid===o[4])},d(m){m&&p(e),u=!1,r()}}}function Pe(o){let e,t,i,l,n=o[16],s=[];for(let u=0;u<n.length;u+=1)s[u]=Se(Ve(o,n,u));return{c(){e=v("div"),t=C("Here are all accounts:"),i=V();for(let u=0;u<s.length;u+=1)s[u].c();l=J()},l(u){e=b(u,"DIV",{});var r=N(e);t=P(r,"Here are all accounts:"),r.forEach(p),i=M(u);for(let a=0;a<s.length;a+=1)s[a].l(u);l=J()},m(u,r){U(u,e,r),d(e,t),U(u,i,r);for(let a=0;a<s.length;a+=1)s[a].m(u,r);U(u,l,r)},p(u,r){if(r[0]&196640){n=u[16];let a;for(a=0;a<n.length;a+=1){const m=Ve(u,n,a);s[a]?s[a].p(m,r):(s[a]=Se(m),s[a].c(),s[a].m(l.parentNode,l))}for(;a<s.length;a+=1)s[a].d(1);s.length=n.length}},d(u){u&&p(e),u&&p(i),ne(s,u),u&&p(l)}}}function Oe(o){let e,t,i=o[42].name+"",l,n,s,u;function r(){return o[28](o[42])}return{c(){e=v("div"),t=v("button"),l=C(i),n=V(),this.h()},l(a){e=b(a,"DIV",{style:!0});var m=N(e);t=b(m,"BUTTON",{style:!0});var y=N(t);l=P(y,i),y.forEach(p),n=M(m),m.forEach(p),this.h()},h(){h(t,"margin-left","20px"),h(e,"margin-top","10px")},m(a,m){U(a,e,m),d(e,t),d(t,l),d(e,n),s||(u=H(t,"click",r),s=!0)},p(a,m){o=a},d(a){a&&p(e),s=!1,u()}}}function Se(o){let e,t=o[42].uid!==o[5].uid&&Oe(o);return{c(){t&&t.c(),e=J()},l(i){t&&t.l(i),e=J()},m(i,l){t&&t.m(i,l),U(i,e,l)},p(i,l){i[42].uid!==i[5].uid?t?t.p(i,l):(t=Oe(i),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null)},d(i){t&&t.d(i),i&&p(e)}}}function We(o){let e,t=o[5].messageRequestNames,i=[];for(let l=0;l<t.length;l+=1)i[l]=Ae(Re(o,t,l));return{c(){for(let l=0;l<i.length;l+=1)i[l].c();e=J()},l(l){for(let n=0;n<i.length;n+=1)i[n].l(l);e=J()},m(l,n){for(let s=0;s<i.length;s+=1)i[s].m(l,n);U(l,e,n)},p(l,n){if(n[0]&524320){t=l[5].messageRequestNames;let s;for(s=0;s<t.length;s+=1){const u=Re(l,t,s);i[s]?i[s].p(u,n):(i[s]=Ae(u),i[s].c(),i[s].m(e.parentNode,e))}for(;s<i.length;s+=1)i[s].d(1);i.length=t.length}},d(l){ne(i,l),l&&p(e)}}}function Ae(o){let e,t=o[39]+"",i,l,n,s;function u(){return o[29](o[39])}return{c(){e=v("div"),i=C(t),l=V(),this.h()},l(r){e=b(r,"DIV",{style:!0});var a=N(e);i=P(a,t),l=M(a),a.forEach(p),this.h()},h(){h(e,"border","solid blue"),h(e,"height","40px"),h(e,"display","flex"),h(e,"align-items","center")},m(r,a){U(r,e,a),d(e,i),d(e,l),n||(s=H(e,"click",u),n=!0)},p(r,a){o=r,a[0]&32&&t!==(t=o[39]+"")&&X(i,t)},d(r){r&&p(e),n=!1,s()}}}function yt(o){let e,t,i,l,n,s,u;return{c(){e=v("div"),t=v("input"),i=V(),l=v("button"),n=C("Confirm code"),this.h()},l(r){e=b(r,"DIV",{style:!0});var a=N(e);t=b(a,"INPUT",{label:!0,placeholder:!0}),i=M(a),l=b(a,"BUTTON",{});var m=N(l);n=P(m,"Confirm code"),m.forEach(p),a.forEach(p),this.h()},h(){E(t,"label","6-digit code"),E(t,"placeholder","123456"),h(e,"display","flex")},m(r,a){U(r,e,a),d(e,t),j(t,o[9]),d(e,i),d(e,l),d(l,n),s||(u=[H(t,"input",o[25]),H(l,"click",o[15])],s=!0)},p(r,a){a[0]&512&&t.value!==r[9]&&j(t,r[9])},d(r){r&&p(e),s=!1,me(u)}}}function kt(o){let e,t,i,l,n,s,u,r,a,m,y,I,O,w,k,S,R,c,f,g,_,T,D,W,A,K,F,Q,le,oe;return{c(){e=v("div"),t=v("b"),i=C("What problem does this solve:"),l=C(`
          Everytime someone messages us, we get a notification IMMEDIATELY, regardless of whether the message is time-sensitive, or even important. 
          Even if you try to ignore it, visually they go to the top of our chat list; 
          if you visited Messenger for a specific purpose, the top message distractions will help you forget what you were doing.
          Multiply that by all the people you message across time, and it's a disaster.

          `),n=v("br"),s=v("br"),u=V(),r=v("b"),a=C("How this app differs"),m=V(),y=v("ol"),I=v("li"),O=C(`Messages have no notifications by default unless the other person specifies it's time-sensitive e.g. "Before today" / "This week"`),w=V(),k=v("li"),S=C("Left-side is organized intentionally - NOT by whoever messaged you most recently"),R=V(),c=v("div"),f=v("input"),g=V(),_=v("input"),T=V(),D=v("input"),W=V(),A=v("input"),K=V(),F=v("div"),Q=C("Sign Up"),this.h()},l(L){e=b(L,"DIV",{style:!0});var q=N(e);t=b(q,"B",{});var re=N(t);i=P(re,"What problem does this solve:"),re.forEach(p),l=P(q,`
          Everytime someone messages us, we get a notification IMMEDIATELY, regardless of whether the message is time-sensitive, or even important. 
          Even if you try to ignore it, visually they go to the top of our chat list; 
          if you visited Messenger for a specific purpose, the top message distractions will help you forget what you were doing.
          Multiply that by all the people you message across time, and it's a disaster.

          `),n=b(q,"BR",{}),s=b(q,"BR",{}),u=M(q),r=b(q,"B",{});var ae=N(r);a=P(ae,"How this app differs"),ae.forEach(p),m=M(q),y=b(q,"OL",{});var ee=N(y);I=b(ee,"LI",{});var ue=N(I);O=P(ue,`Messages have no notifications by default unless the other person specifies it's time-sensitive e.g. "Before today" / "This week"`),ue.forEach(p),w=M(ee),k=b(ee,"LI",{});var fe=N(k);S=P(fe,"Left-side is organized intentionally - NOT by whoever messaged you most recently"),fe.forEach(p),ee.forEach(p),q.forEach(p),R=M(L),c=b(L,"DIV",{style:!0});var z=N(c);f=b(z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),g=M(z),_=b(z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),T=M(z),D=b(z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),W=M(z),A=b(z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),K=M(z),F=b(z,"DIV",{id:!0,style:!0});var B=N(F);Q=P(B,"Sign Up"),B.forEach(p),z.forEach(p),this.h()},h(){h(e,"font-family","Roboto, sans-serif"),h(e,"font-size","1.5rem"),h(e,"color","grey"),h(e,"margin-top","20px"),E(f,"type","tel"),E(f,"id","phone-input-1"),E(f,"minlength","2"),E(f,"maxlength","4"),E(f,"placeholder","+1"),h(f,"width","36px"),h(f,"height","40px"),h(f,"font-size","2rem"),h(f,"margin-right","10px"),E(_,"type","tel"),E(_,"id","phone-input-1"),E(_,"minlength","3"),E(_,"maxlength","3"),E(_,"placeholder","339"),h(_,"width","54px"),h(_,"height","40px"),h(_,"font-size","2rem"),h(_,"margin-right","10px"),E(D,"type","tel"),E(D,"id","phone-input-2"),E(D,"minlength","3"),E(D,"maxlength","3"),E(D,"placeholder","676"),h(D,"width","54px"),h(D,"height","40px"),h(D,"font-size","2rem"),h(D,"margin-right","10px"),E(A,"type","tel"),E(A,"id","phone-input-3"),E(A,"minlength","4"),E(A,"maxlength","4"),E(A,"placeholder","1234"),h(A,"width","76px"),h(A,"height","40px"),h(A,"font-size","2rem"),h(A,"margin-right","10px"),E(F,"id","sign-in-button"),h(F,"border","solid"),h(F,"padding","6px"),h(c,"display","flex"),h(c,"justify-content","center"),h(c,"align-items","center"),h(c,"width","400px"),h(c,"margin-top","25px")},m(L,q){U(L,e,q),d(e,t),d(t,i),d(e,l),d(e,n),d(e,s),d(e,u),d(e,r),d(r,a),d(e,m),d(e,y),d(y,I),d(I,O),d(y,w),d(y,k),d(k,S),U(L,R,q),U(L,c,q),d(c,f),j(f,o[7]),d(c,g),d(c,_),j(_,o[0]),d(c,T),d(c,D),j(D,o[1]),d(c,W),d(c,A),j(A,o[2]),d(c,K),d(c,F),d(F,Q),le||(oe=[H(f,"input",o[21]),H(_,"input",o[22]),H(D,"input",o[23]),H(A,"input",o[24]),H(F,"click",o[14])],le=!0)},p(L,q){q[0]&128&&j(f,L[7]),q[0]&1&&j(_,L[0]),q[0]&2&&j(D,L[1]),q[0]&4&&j(A,L[2])},d(L){L&&p(e),L&&p(R),L&&p(c),le=!1,me(oe)}}}function wt(o){let e,t,i,l,n,s,u,r,a,m,y,I,O,w=o[5].uid+"",k,S,R;return{c(){e=v("div"),t=C("Click any chat on the left-side"),i=V(),l=v("input"),n=V(),s=v("button"),u=C("Update name"),r=V(),a=v("div"),m=C("Give this link to your friends & family so they can message you without a zen-message account:"),y=V(),I=v("div"),O=C("zen-message.com/"),k=C(w),this.h()},l(c){e=b(c,"DIV",{style:!0});var f=N(e);t=P(f,"Click any chat on the left-side"),f.forEach(p),i=M(c),l=b(c,"INPUT",{placeholder:!0}),n=M(c),s=b(c,"BUTTON",{});var g=N(s);u=P(g,"Update name"),g.forEach(p),r=M(c),a=b(c,"DIV",{style:!0});var _=N(a);m=P(_,"Give this link to your friends & family so they can message you without a zen-message account:"),_.forEach(p),y=M(c),I=b(c,"DIV",{style:!0});var T=N(I);O=P(T,"zen-message.com/"),k=P(T,w),T.forEach(p),this.h()},h(){h(e,"margin-top","5px"),h(e,"margin-bottom","12px"),E(l,"placeholder","John Apple"),h(a,"margin-top","10px"),h(I,"font-size","0.8rem"),h(I,"color","blue")},m(c,f){U(c,e,f),d(e,t),U(c,i,f),U(c,l,f),j(l,o[6]),U(c,n,f),U(c,s,f),d(s,u),U(c,r,f),U(c,a,f),d(a,m),U(c,y,f),U(c,I,f),d(I,O),d(I,k),S||(R=[H(l,"input",o[31]),H(s,"click",o[18])],S=!0)},p(c,f){f[0]&64&&l.value!==c[6]&&j(l,c[6]),f[0]&32&&w!==(w=c[5].uid+"")&&X(k,w)},i:$,o:$,d(c){c&&p(e),c&&p(i),c&&p(l),c&&p(n),c&&p(s),c&&p(r),c&&p(a),c&&p(y),c&&p(I),S=!1,me(R)}}}function It(o){let e,t,i,l,n,s,u;return{c(){e=v("div"),t=C(o[10]),i=V(),l=v("button"),n=C("Resolve and delete")},l(r){e=b(r,"DIV",{});var a=N(e);t=P(a,o[10]),a.forEach(p),i=M(r),l=b(r,"BUTTON",{});var m=N(l);n=P(m,"Resolve and delete"),m.forEach(p)},m(r,a){U(r,e,a),d(e,t),U(r,i,a),U(r,l,a),d(l,n),s||(u=H(l,"click",o[30]),s=!0)},p(r,a){a[0]&1024&&X(t,r[10])},i:$,o:$,d(r){r&&p(e),r&&p(i),r&&p(l),s=!1,u()}}}function Dt(o){let e=o[4],t,i,l=Be(o);return{c(){l.c(),t=J()},l(n){l.l(n),t=J()},m(n,s){l.m(n,s),U(n,t,s),i=!0},p(n,s){s[0]&16&&ve(e,e=n[4])?(Ye(),ie(l,1,1,$),je(),l=Be(n),l.c(),se(l),l.m(t.parentNode,t)):l.p(n,s)},i(n){i||(se(l),i=!0)},o(n){ie(l),i=!1},d(n){n&&p(t),l.d(n)}}}function Be(o){let e,t;return e=new gt({props:{chatRoomID:o[3],friendUID:o[4],otherPersonUID:o[4],currentUser:o[5]}}),{c(){at(e.$$.fragment)},l(i){ut(e.$$.fragment,i)},m(i,l){ft(e,i,l),t=!0},p(i,l){const n={};l[0]&8&&(n.chatRoomID=i[3]),l[0]&16&&(n.friendUID=i[4]),l[0]&16&&(n.otherPersonUID=i[4]),l[0]&32&&(n.currentUser=i[5]),e.$set(n)},i(i){t||(se(e.$$.fragment,i),t=!0)},o(i){ie(e.$$.fragment,i),t=!1},d(i){ct(e,i)}}}function Et(o){let e,t,i,l,n,s,u;function r(w,k){return w[5]?vt:bt}let a=r(o),m=a(o);const y=[Dt,It,wt],I=[];function O(w,k){return w[4]&&w[5]&&w[3]?0:w[11]?1:w[5]?2:-1}return~(n=O(o))&&(s=I[n]=y[n](o)),{c(){e=v("div"),t=v("div"),m.c(),i=V(),l=v("div"),s&&s.c(),this.h()},l(w){e=b(w,"DIV",{style:!0});var k=N(e);t=b(k,"DIV",{});var S=N(t);m.l(S),S.forEach(p),i=M(k),l=b(k,"DIV",{style:!0});var R=N(l);s&&s.l(R),R.forEach(p),k.forEach(p),this.h()},h(){h(l,"width","320px"),h(l,"margin-left","5px"),h(l,"margin-top","5px"),h(e,"display","flex"),h(e,"padding-left","0px"),h(e,"padding-right","0px")},m(w,k){U(w,e,k),d(e,t),m.m(t,null),d(e,i),d(e,l),~n&&I[n].m(l,null),u=!0},p(w,k){a===(a=r(w))&&m?m.p(w,k):(m.d(1),m=a(w),m&&(m.c(),m.m(t,null)));let S=n;n=O(w),n===S?~n&&I[n].p(w,k):(s&&(Ye(),ie(I[S],1,1,()=>{I[S]=null}),je()),~n?(s=I[n],s?s.p(w,k):(s=I[n]=y[n](w),s.c()),se(s,1),s.m(l,null)):s=null)},i(w){u||(se(s),u=!0)},o(w){ie(s),u=!1},d(w){w&&p(e),m.d(),~n&&I[n].d()}}}function Nt(o,e,t){let i;lt(o,he,z=>t(5,i=z));let l="",n,s="+1",u="",r="",a="",m,y="",I="",O="",w="",k=[];function S(){console.log("signInWithPhone()"),window.recaptchaVerifier||(window.recaptchaVerifier=new ot("sign-in-button",{size:"invisible",callback:B=>{console.log("reCAPTCHA solved =",B)}},ce()),n=window.recaptchaVerifier),z();function z(){const B=`${s} ${u}-${r}-${a}`;print(ce(),B,n),rt(ce(),B,n).then(Z=>{console.log("confirmation result =",Z),t(8,m=Z),window.confirmationResult=Z}).catch(Z=>{alert(Z),console.log("error =",Z),window.recaptchaVerifier.render().then(function(x){grecaptcha.reset(x)})})}}function R(){console.log("phoneConfirmCode =",y),window.confirmationResult.confirm(y).then(z=>{}).catch(z=>{alert(z)})}const c=ce();let f="",g=[],_=!1;const T=it(Y,"users");st(T).then(z=>{z.docs.forEach(B=>{g.push(ke({uid:B.id},B.data()))})});async function D({name:z,uid:B}){for(const Ze of i.friends)if(Ze.uid===B){alert("You're already friends"),t(13,_=!1);return}const Z=G(Y,"users",i.uid);await te(Z,{friends:ge({name:z,uid:B})});const x=i.uid<B?i.uid+B:B+i.uid,Je=G(Y,"chats",x);await Ie(Je,{participantUIDs:[B,i.uid],messages:[]}),t(13,_=!1)}nt(c,async z=>{if(z){const B=G(Y,"users",z.uid),Z=await Fe(B);if(Z.exists())he.set(Z.data());else{const x={uid:z.uid,name:z.displayName||"John Apple",phoneNumber:z.phoneNumber,friends:[],family:[],VIPs:[],everyoneElse:[]};await Ie(G(Y,"users",z.uid),x),he.set(x)}He(G(Y,"users",z.uid),x=>{he.set(x.data()),i.friendUIDsWithNewMessages&&t(12,k=i.friendUIDsWithNewMessages)})}});async function W(){await te(G(Y,"users",i.uid),{name:l}),t(6,l=""),alert("successfully updated")}function A(z){t(4,f=""),t(11,w=z),t(10,O=i.messageRequestObjects.filter(B=>B.senderName===z)[0].content)}function K(z){const B=G(Y,"users",i.uid);te(B,{messageRequestObjects:_e({content:O,senderName:w}),messageRequestNames:_e(w)}),t(11,w=""),t(10,O="")}function F(){s=this.value,t(7,s)}function Q(){u=this.value,t(0,u)}function le(){r=this.value,t(1,r)}function oe(){a=this.value,t(2,a)}function L(){y=this.value,t(9,y)}const q=z=>t(4,f=z.uid),re=()=>t(13,_=!_),ae=z=>D(z),ee=z=>A(z),ue=()=>K();function fe(){l=this.value,t(6,l)}return o.$$.update=()=>{o.$$.dirty[0]&56&&f&&(t(3,I=i.uid<f?i.uid+f:f+i.uid),console.log("chatRoomID =",I)),o.$$.dirty[0]&1&&u.length===3&&document.getElementById("phone-input-2").focus(),o.$$.dirty[0]&2&&r.length===3&&document.getElementById("phone-input-3").focus(),o.$$.dirty[0]&4&&a.length===4&&S()},[u,r,a,I,f,i,l,s,m,y,O,w,k,_,S,R,g,D,W,A,K,F,Q,le,oe,L,q,re,ae,ee,ue,fe]}class Rt extends qe{constructor(e){super();Le(this,e,Nt,Et,ve,{},null,[-1,-1])}}export{Rt as default};
