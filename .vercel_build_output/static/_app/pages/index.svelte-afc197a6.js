var Be=Object.defineProperty;var pe=Object.getOwnPropertySymbols;var Ae=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable;var me=(s,e,t)=>e in s?Be(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,_e=(s,e)=>{for(var t in e||(e={}))Ae.call(e,t)&&me(s,t,e[t]);if(pe)for(var t of pe(e))Oe.call(e,t)&&me(s,t,e[t]);return s};import{L as He,M as je,S as Me,i as Se,s as he,l as Q,g as V,e as I,t as R,k as W,c as D,a as C,h as P,d as h,m as B,f as m,J as p,j as re,N as ue,b as M,O as ae,P as j,Q as q,K as ee,R as fe,T as Fe,U as Le,v as qe,V as Re,W as G,X as $,Y as Ye,Z as ce,_ as Pe,o as te,p as ze,q as ie,$ as oe,a0 as Ke,a1 as Je,a2 as Ze,n as We,a3 as Ge,a4 as Qe,a5 as ge,w as Xe,x as xe,y as $e,B as et}from"../chunks/vendor-7aec64b3.js";const tt={apiKey:"AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc",authDomain:"project-z-e00fd.firebaseapp.com",projectId:"project-z-e00fd",storageBucket:"project-z-e00fd.appspot.com",messagingSenderId:"37588438028",appId:"1:37588438028:web:82c870a2fe6af985d67229",measurementId:"G-W20KMPGM93"};He(tt);var J=je();const ve=function(s,e={month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit",timeZone:"utc"}){const t=new Date(s);let i=t.getTimezoneOffset()*6e4;return new Date(t-i).toLocaleDateString("en-US",e)};function ye(s,e,t){const i=s.slice();return i[14]=e[t],i}function be(s,e,t){const i=s.slice();return i[17]=e[t],i}function we(s){let e,t=s[2].messages,i=[];for(let l=0;l<t.length;l+=1)i[l]=ke(be(s,t,l));return{c(){for(let l=0;l<i.length;l+=1)i[l].c();e=Q()},l(l){for(let n=0;n<i.length;n+=1)i[n].l(l);e=Q()},m(l,n){for(let o=0;o<i.length;o+=1)i[o].m(l,n);V(l,e,n)},p(l,n){if(n&4){t=l[2].messages;let o;for(o=0;o<t.length;o+=1){const a=be(l,t,o);i[o]?i[o].p(a,n):(i[o]=ke(a),i[o].c(),i[o].m(e.parentNode,e))}for(;o<i.length;o+=1)i[o].d(1);i.length=t.length}},d(l){ue(i,l),l&&h(e)}}}function ke(s){let e,t,i=s[17].content+"",l,n,o,a=ve(s[17].timestamp)+"",f,r;return{c(){e=I("div"),t=I("p"),l=R(i),n=W(),o=I("p"),f=R(a),r=W(),this.h()},l(c){e=D(c,"DIV",{style:!0});var v=C(e);t=D(v,"P",{});var E=C(t);l=P(E,i),E.forEach(h),n=B(v),o=D(v,"P",{style:!0});var y=C(o);f=P(y,a),y.forEach(h),r=B(v),v.forEach(h),this.h()},h(){m(o,"margin-left","auto"),m(o,"margin-right","0"),m(e,"display","flex")},m(c,v){V(c,e,v),p(e,t),p(t,l),p(e,n),p(e,o),p(o,f),p(e,r)},p(c,v){v&4&&i!==(i=c[17].content+"")&&re(l,i),v&4&&a!==(a=ve(c[17].timestamp)+"")&&re(f,a)},d(c){c&&h(e)}}}function Ie(s){let e,t=s[14]+"",i,l,n,o;function a(){return s[9](s[14])}return{c(){e=I("div"),i=R(t),l=W(),this.h()},l(f){e=D(f,"DIV",{class:!0,style:!0});var r=C(e);i=P(r,t),l=B(r),r.forEach(h),this.h()},h(){M(e,"class","clickable-option svelte-tz8lu4"),m(e,"margin-left","20px"),ae(e,"highlighted-box",s[1]===s[14])},m(f,r){V(f,e,r),p(e,i),p(e,l),n||(o=j(e,"click",a),n=!0)},p(f,r){s=f,r&10&&ae(e,"highlighted-box",s[1]===s[14])},d(f){f&&h(e),n=!1,o()}}}function it(s){let e,t,i,l,n,o,a,f,r,c,v,E,y,d=s[2].messages&&we(s),g=s[3],_=[];for(let b=0;b<g.length;b+=1)_[b]=Ie(ye(s,g,b));return{c(){e=I("div"),d&&d.c(),t=W(),i=I("input"),l=W(),n=I("div"),o=I("div"),a=R("Hope for a reply:"),f=W();for(let b=0;b<_.length;b+=1)_[b].c();r=W(),c=I("button"),v=R("Send message"),this.h()},l(b){e=D(b,"DIV",{});var k=C(e);d&&d.l(k),t=B(k),i=D(k,"INPUT",{style:!0,placeholder:!0}),l=B(k),n=D(k,"DIV",{style:!0});var w=C(n);o=D(w,"DIV",{style:!0});var O=C(o);a=P(O,"Hope for a reply:"),O.forEach(h),f=B(w);for(let z=0;z<_.length;z+=1)_[z].l(w);w.forEach(h),r=B(k),c=D(k,"BUTTON",{style:!0});var U=C(c);v=P(U,"Send message"),U.forEach(h),k.forEach(h),this.h()},h(){m(i,"width","100%"),M(i,"placeholder","Type message here..."),m(o,"color","grey"),m(n,"display","flex"),m(n,"margin-top","10px"),m(n,"align-items","center"),m(c,"margin-top","12px"),m(c,"height","30px"),m(c,"width","410px")},m(b,k){V(b,e,k),d&&d.m(e,null),p(e,t),p(e,i),q(i,s[0]),p(e,l),p(e,n),p(n,o),p(o,a),p(n,f);for(let w=0;w<_.length;w+=1)_[w].m(n,null);p(e,r),p(e,c),p(c,v),E||(y=[j(i,"input",s[8]),j(c,"click",s[4])],E=!0)},p(b,[k]){if(b[2].messages?d?d.p(b,k):(d=we(b),d.c(),d.m(e,t)):d&&(d.d(1),d=null),k&1&&i.value!==b[0]&&q(i,b[0]),k&10){g=b[3];let w;for(w=0;w<g.length;w+=1){const O=ye(b,g,w);_[w]?_[w].p(O,k):(_[w]=Ie(O),_[w].c(),_[w].m(n,null))}for(;w<_.length;w+=1)_[w].d(1);_.length=g.length}},i:ee,o:ee,d(b){b&&h(e),d&&d.d(),ue(_,b),E=!1,fe(y)}}}function lt(s,e,t){let{friendUID:i}=e,{currentUser:l}=e,{chatRoomID:n}=e;const o=Fe(),a=Le(o,"sendTextMessage");let f,r=["real-time","today","this week","anytime"],c="anytime",v={messages:[]};qe(()=>{Re(G(J,"chats",n),g=>{if(console.log("Current data: ",g.data()),g.data()){t(2,v=g.data());const _=G(J,"users",l.uid);$(_,{friendUIDsWithNewMessages:Ye(n)})}})});async function E(){console.log("sendMessage()");const g=G(J,"chats",n);$(g,{messages:ce({content:f,timestamp:Date.now()})});const _=l.uid,b=G(J,"users",_);$(b,{friendUIDsWithNewMessages:ce(n)});const k=await Pe(b);switch(c){case"anytime":break;case"real-time":console.log("sending text to ,",k.data().phoneNumber),a({content:`${l.name} wrote "${f}"`,toWho:k.data().phoneNumber})}t(0,f="")}function y(){f=this.value,t(0,f)}const d=g=>t(1,c=g);return s.$$set=g=>{"friendUID"in g&&t(5,i=g.friendUID),"currentUser"in g&&t(6,l=g.currentUser),"chatRoomID"in g&&t(7,n=g.chatRoomID)},[f,c,v,r,E,i,l,n,y,d]}class nt extends Me{constructor(e){super();Se(this,e,lt,it,he,{friendUID:5,currentUser:6,chatRoomID:7})}}function De(s,e,t){const i=s.slice();return i[33]=e[t],i}function Ee(s,e,t){const i=s.slice();return i[36]=e[t],i}function st(s){let e,t,i,l,n,o,a,f,r,c,v,E,y,d,g,_,b,k,w,O=s[4].friends,U=[];for(let u=0;u<O.length;u+=1)U[u]=Ne(Ee(s,O,u));let z=s[11]&&Ue(s);return{c(){e=I("h2"),t=R("Friends"),i=W();for(let u=0;u<U.length;u+=1)U[u].c();l=W(),n=I("button"),o=R("Add person"),a=W(),z&&z.c(),f=W(),r=I("h2"),c=R("Family"),v=R(`
      No family...

      `),E=I("h2"),y=R("Editable category"),d=R(`
      Coming soon...

      `),g=I("h2"),_=R("Everyone else"),b=R(`
      No new message requests yet...`),this.h()},l(u){e=D(u,"H2",{class:!0});var S=C(e);t=P(S,"Friends"),S.forEach(h),i=B(u);for(let X=0;X<U.length;X+=1)U[X].l(u);l=B(u),n=D(u,"BUTTON",{style:!0});var T=C(n);o=P(T,"Add person"),T.forEach(h),a=B(u),z&&z.l(u),f=B(u),r=D(u,"H2",{class:!0,style:!0});var K=C(r);c=P(K,"Family"),K.forEach(h),v=P(u,`
      No family...

      `),E=D(u,"H2",{class:!0,style:!0});var F=C(E);y=P(F,"Editable category"),F.forEach(h),d=P(u,`
      Coming soon...

      `),g=D(u,"H2",{class:!0,style:!0});var x=C(g);_=P(x,"Everyone else"),x.forEach(h),b=P(u,`
      No new message requests yet...`),this.h()},h(){M(e,"class","message-group-title svelte-ewe8mg"),m(n,"margin-top","20px"),M(r,"class","message-group-title svelte-ewe8mg"),m(r,"margin-top","50px"),M(E,"class","message-group-title svelte-ewe8mg"),m(E,"margin-top","50px"),M(g,"class","message-group-title svelte-ewe8mg"),m(g,"margin-top","50px")},m(u,S){V(u,e,S),p(e,t),V(u,i,S);for(let T=0;T<U.length;T+=1)U[T].m(u,S);V(u,l,S),V(u,n,S),p(n,o),V(u,a,S),z&&z.m(u,S),V(u,f,S),V(u,r,S),p(r,c),V(u,v,S),V(u,E,S),p(E,y),V(u,d,S),V(u,g,S),p(g,_),V(u,b,S),k||(w=j(n,"click",s[23]),k=!0)},p(u,S){if(S[0]&1072){O=u[4].friends;let T;for(T=0;T<O.length;T+=1){const K=Ee(u,O,T);U[T]?U[T].p(K,S):(U[T]=Ne(K),U[T].c(),U[T].m(l.parentNode,l))}for(;T<U.length;T+=1)U[T].d(1);U.length=O.length}u[11]?z?z.p(u,S):(z=Ue(u),z.c(),z.m(f.parentNode,f)):z&&(z.d(1),z=null)},d(u){u&&h(e),u&&h(i),ue(U,u),u&&h(l),u&&h(n),u&&h(a),z&&z.d(u),u&&h(f),u&&h(r),u&&h(v),u&&h(E),u&&h(d),u&&h(g),u&&h(b),k=!1,w()}}}function ot(s){let e;function t(n,o){return n[8]?rt:at}let i=t(s),l=i(s);return{c(){l.c(),e=Q()},l(n){l.l(n),e=Q()},m(n,o){l.m(n,o),V(n,e,o)},p(n,o){i===(i=t(n))&&l?l.p(n,o):(l.d(1),l=i(n),l&&(l.c(),l.m(e.parentNode,e)))},d(n){l.d(n),n&&h(e)}}}function Ne(s){let e,t,i=s[36].name+"",l,n=s[10].includes(s[36].uid)?"New messages":"",o,a,f;function r(){return s[22](s[36])}return{c(){e=I("div"),t=I("span"),l=R(i),o=R(n),this.h()},l(c){e=D(c,"DIV",{style:!0,class:!0});var v=C(e);t=D(v,"SPAN",{style:!0,class:!0});var E=C(t);l=P(E,i),o=P(E,n),E.forEach(h),v.forEach(h),this.h()},h(){m(t,"margin-left","5px"),M(t,"class","svelte-ewe8mg"),m(e,"border","solid orange"),m(e,"height","40px"),m(e,"display","flex"),m(e,"align-items","center"),M(e,"class","svelte-ewe8mg"),ae(e,"highlighted-box",s[36].uid===s[5])},m(c,v){V(c,e,v),p(e,t),p(t,l),p(t,o),a||(f=j(e,"click",r),a=!0)},p(c,v){s=c,v[0]&16&&i!==(i=s[36].name+"")&&re(l,i),v[0]&1040&&n!==(n=s[10].includes(s[36].uid)?"New messages":"")&&re(o,n),v[0]&48&&ae(e,"highlighted-box",s[36].uid===s[5])},d(c){c&&h(e),a=!1,f()}}}function Ue(s){let e,t,i,l,n=s[14],o=[];for(let a=0;a<n.length;a+=1)o[a]=Ve(De(s,n,a));return{c(){e=I("div"),t=R("Here are all accounts:"),i=W();for(let a=0;a<o.length;a+=1)o[a].c();l=Q()},l(a){e=D(a,"DIV",{});var f=C(e);t=P(f,"Here are all accounts:"),f.forEach(h),i=B(a);for(let r=0;r<o.length;r+=1)o[r].l(a);l=Q()},m(a,f){V(a,e,f),p(e,t),V(a,i,f);for(let r=0;r<o.length;r+=1)o[r].m(a,f);V(a,l,f)},p(a,f){if(f[0]&49168){n=a[14];let r;for(r=0;r<n.length;r+=1){const c=De(a,n,r);o[r]?o[r].p(c,f):(o[r]=Ve(c),o[r].c(),o[r].m(l.parentNode,l))}for(;r<o.length;r+=1)o[r].d(1);o.length=n.length}},d(a){a&&h(e),a&&h(i),ue(o,a),a&&h(l)}}}function Te(s){let e,t,i=s[33].name+"",l,n,o,a;function f(){return s[24](s[33])}return{c(){e=I("div"),t=I("button"),l=R(i),n=W(),this.h()},l(r){e=D(r,"DIV",{style:!0});var c=C(e);t=D(c,"BUTTON",{style:!0});var v=C(t);l=P(v,i),v.forEach(h),n=B(c),c.forEach(h),this.h()},h(){m(t,"margin-left","20px"),m(e,"margin-top","10px")},m(r,c){V(r,e,c),p(e,t),p(t,l),p(e,n),o||(a=j(t,"click",f),o=!0)},p(r,c){s=r},d(r){r&&h(e),o=!1,a()}}}function Ve(s){let e,t=s[33].uid!==s[4].uid&&Te(s);return{c(){t&&t.c(),e=Q()},l(i){t&&t.l(i),e=Q()},m(i,l){t&&t.m(i,l),V(i,e,l)},p(i,l){i[33].uid!==i[4].uid?t?t.p(i,l):(t=Te(i),t.c(),t.m(e.parentNode,e)):t&&(t.d(1),t=null)},d(i){t&&t.d(i),i&&h(e)}}}function rt(s){let e,t,i,l,n,o,a;return{c(){e=I("div"),t=I("input"),i=W(),l=I("button"),n=R("Confirm code"),this.h()},l(f){e=D(f,"DIV",{style:!0});var r=C(e);t=D(r,"INPUT",{label:!0,placeholder:!0}),i=B(r),l=D(r,"BUTTON",{});var c=C(l);n=P(c,"Confirm code"),c.forEach(h),r.forEach(h),this.h()},h(){M(t,"label","6-digit code"),M(t,"placeholder","123456"),m(e,"display","flex")},m(f,r){V(f,e,r),p(e,t),q(t,s[9]),p(e,i),p(e,l),p(l,n),o||(a=[j(t,"input",s[21]),j(l,"click",s[13])],o=!0)},p(f,r){r[0]&512&&t.value!==f[9]&&q(t,f[9])},d(f){f&&h(e),o=!1,fe(a)}}}function at(s){let e,t,i,l,n,o,a,f,r,c,v,E,y,d,g,_,b,k,w,O,U,z,u,S,T,K,F,x,X,le;return{c(){e=I("div"),t=I("b"),i=R("What problem does this solve:"),l=R(`
          Everytime someone messages us, we get a notification IMMEDIATELY, regardless of whether the message is time-sensitive, or even important. 
          Even if you try to ignore it, visually they go to the top of our chat list; multiply that by all the people you message across time, and it's a disaster for productivity and mental health.

          `),n=I("br"),o=I("br"),a=W(),f=I("b"),r=R("How this app is different"),c=W(),v=I("ol"),E=I("li"),y=R(`Messages have no notifications by default unless the other person specifies it's time-sensitive e.g. "Before Monday" / "This week"`),d=W(),g=I("li"),_=R("Left-side is organized intentionally - NOT by whoever messaged you most recently"),b=W(),k=I("div"),w=I("input"),O=W(),U=I("input"),z=W(),u=I("input"),S=W(),T=I("input"),K=W(),F=I("div"),x=R("Sign Up"),this.h()},l(H){e=D(H,"DIV",{style:!0});var N=C(e);t=D(N,"B",{});var A=C(t);i=P(A,"What problem does this solve:"),A.forEach(h),l=P(N,`
          Everytime someone messages us, we get a notification IMMEDIATELY, regardless of whether the message is time-sensitive, or even important. 
          Even if you try to ignore it, visually they go to the top of our chat list; multiply that by all the people you message across time, and it's a disaster for productivity and mental health.

          `),n=D(N,"BR",{}),o=D(N,"BR",{}),a=B(N),f=D(N,"B",{});var L=C(f);r=P(L,"How this app is different"),L.forEach(h),c=B(N),v=D(N,"OL",{});var Y=C(v);E=D(Y,"LI",{});var ne=C(E);y=P(ne,`Messages have no notifications by default unless the other person specifies it's time-sensitive e.g. "Before Monday" / "This week"`),ne.forEach(h),d=B(Y),g=D(Y,"LI",{});var se=C(g);_=P(se,"Left-side is organized intentionally - NOT by whoever messaged you most recently"),se.forEach(h),Y.forEach(h),N.forEach(h),b=B(H),k=D(H,"DIV",{style:!0});var Z=C(k);w=D(Z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),O=B(Z),U=D(Z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),z=B(Z),u=D(Z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),S=B(Z),T=D(Z,"INPUT",{type:!0,id:!0,minlength:!0,maxlength:!0,placeholder:!0,style:!0}),K=B(Z),F=D(Z,"DIV",{id:!0,style:!0});var de=C(F);x=P(de,"Sign Up"),de.forEach(h),Z.forEach(h),this.h()},h(){m(e,"font-family","Roboto, sans-serif"),m(e,"font-size","1.5rem"),m(e,"color","grey"),m(e,"margin-top","20px"),M(w,"type","tel"),M(w,"id","phone-input-1"),M(w,"minlength","2"),M(w,"maxlength","3"),M(w,"placeholder","+1"),m(w,"width","36px"),m(w,"height","40px"),m(w,"font-size","2rem"),m(w,"margin-right","10px"),M(U,"type","tel"),M(U,"id","phone-input-1"),M(U,"minlength","3"),M(U,"maxlength","3"),M(U,"placeholder","339"),m(U,"width","54px"),m(U,"height","40px"),m(U,"font-size","2rem"),m(U,"margin-right","10px"),M(u,"type","tel"),M(u,"id","phone-input-2"),M(u,"minlength","3"),M(u,"maxlength","3"),M(u,"placeholder","676"),m(u,"width","54px"),m(u,"height","40px"),m(u,"font-size","2rem"),m(u,"margin-right","10px"),M(T,"type","tel"),M(T,"id","phone-input-3"),M(T,"minlength","4"),M(T,"maxlength","4"),M(T,"placeholder","1234"),m(T,"width","76px"),m(T,"height","40px"),m(T,"font-size","2rem"),m(T,"margin-right","10px"),M(F,"id","sign-in-button"),m(F,"border","solid"),m(F,"padding","6px"),m(k,"display","flex"),m(k,"justify-content","center"),m(k,"align-items","center"),m(k,"width","400px"),m(k,"margin-top","25px")},m(H,N){V(H,e,N),p(e,t),p(t,i),p(e,l),p(e,n),p(e,o),p(e,a),p(e,f),p(f,r),p(e,c),p(e,v),p(v,E),p(E,y),p(v,d),p(v,g),p(g,_),V(H,b,N),V(H,k,N),p(k,w),q(w,s[7]),p(k,O),p(k,U),q(U,s[0]),p(k,z),p(k,u),q(u,s[1]),p(k,S),p(k,T),q(T,s[2]),p(k,K),p(k,F),p(F,x),X||(le=[j(w,"input",s[17]),j(U,"input",s[18]),j(u,"input",s[19]),j(T,"input",s[20]),j(F,"click",s[12])],X=!0)},p(H,N){N[0]&128&&q(w,H[7]),N[0]&1&&q(U,H[0]),N[0]&2&&q(u,H[1]),N[0]&4&&q(T,H[2])},d(H){H&&h(e),H&&h(b),H&&h(k),X=!1,fe(le)}}}function ut(s){let e,t,i,l,n,o,a,f,r,c,v,E;return{c(){e=I("div"),t=R("Click any chat on the left-side"),i=W(),l=I("div"),n=R("Set your name here"),o=W(),a=I("input"),f=W(),r=I("button"),c=R("Update name"),this.h()},l(y){e=D(y,"DIV",{style:!0});var d=C(e);t=P(d,"Click any chat on the left-side"),d.forEach(h),i=B(y),l=D(y,"DIV",{});var g=C(l);n=P(g,"Set your name here"),g.forEach(h),o=B(y),a=D(y,"INPUT",{placeholder:!0}),f=B(y),r=D(y,"BUTTON",{});var _=C(r);c=P(_,"Update name"),_.forEach(h),this.h()},h(){m(e,"margin-top","18px"),M(a,"placeholder","John Apple")},m(y,d){V(y,e,d),p(e,t),V(y,i,d),V(y,l,d),p(l,n),V(y,o,d),V(y,a,d),q(a,s[6]),V(y,f,d),V(y,r,d),p(r,c),v||(E=[j(a,"input",s[25]),j(r,"click",s[16])],v=!0)},p(y,d){d[0]&64&&a.value!==y[6]&&q(a,y[6])},i:ee,o:ee,d(y){y&&h(e),y&&h(i),y&&h(l),y&&h(o),y&&h(a),y&&h(f),y&&h(r),v=!1,fe(E)}}}function ft(s){let e=s[5],t,i,l=Ce(s);return{c(){l.c(),t=Q()},l(n){l.l(n),t=Q()},m(n,o){l.m(n,o),V(n,t,o),i=!0},p(n,o){o[0]&32&&he(e,e=n[5])?(We(),te(l,1,1,ee),ze(),l=Ce(n),l.c(),ie(l),l.m(t.parentNode,t)):l.p(n,o)},i(n){i||(ie(l),i=!0)},o(n){te(l),i=!1},d(n){n&&h(t),l.d(n)}}}function Ce(s){let e,t;return e=new nt({props:{chatRoomID:s[3],friendUID:s[5],currentUser:s[4]}}),{c(){Xe(e.$$.fragment)},l(i){xe(e.$$.fragment,i)},m(i,l){$e(e,i,l),t=!0},p(i,l){const n={};l[0]&8&&(n.chatRoomID=i[3]),l[0]&32&&(n.friendUID=i[5]),l[0]&16&&(n.currentUser=i[4]),e.$set(n)},i(i){t||(ie(e.$$.fragment,i),t=!0)},o(i){te(e.$$.fragment,i),t=!1},d(i){et(e,i)}}}function ct(s){let e,t,i,l,n,o,a;function f(d,g){return d[4]?st:ot}let r=f(s),c=r(s);const v=[ft,ut],E=[];function y(d,g){return d[5]&&d[4]&&d[3]?0:d[4]?1:-1}return~(n=y(s))&&(o=E[n]=v[n](s)),{c(){e=I("div"),t=I("div"),c.c(),i=W(),l=I("div"),o&&o.c(),this.h()},l(d){e=D(d,"DIV",{style:!0});var g=C(e);t=D(g,"DIV",{});var _=C(t);c.l(_),_.forEach(h),i=B(g),l=D(g,"DIV",{style:!0});var b=C(l);o&&o.l(b),b.forEach(h),g.forEach(h),this.h()},h(){m(l,"width","60%"),m(l,"margin-left","20px"),m(l,"margin-top","5px"),m(e,"display","flex"),m(e,"padding-left","20px"),m(e,"padding-right","20px")},m(d,g){V(d,e,g),p(e,t),c.m(t,null),p(e,i),p(e,l),~n&&E[n].m(l,null),a=!0},p(d,g){r===(r=f(d))&&c?c.p(d,g):(c.d(1),c=r(d),c&&(c.c(),c.m(t,null)));let _=n;n=y(d),n===_?~n&&E[n].p(d,g):(o&&(We(),te(E[_],1,1,()=>{E[_]=null}),ze()),~n?(o=E[n],o?o.p(d,g):(o=E[n]=v[n](d),o.c()),ie(o,1),o.m(l,null)):o=null)},i(d){a||(ie(o),a=!0)},o(d){te(o),a=!1},d(d){d&&h(e),c.d(),~n&&E[n].d()}}}function ht(s,e,t){let i="",l,n="+1",o="",a="",f="",r,c="",v="",E=[];function y(){console.log("signInWithPhone()"),window.recaptchaVerifier||(window.recaptchaVerifier=new Ge("sign-in-button",{size:"invisible",callback:A=>{console.log("reCAPTCHA solved =",A)}},oe()),l=window.recaptchaVerifier),N();function N(){const A=`${n} ${o}-${a}-${f}`;print(oe(),A,l),Qe(oe(),A,l).then(L=>{console.log("confirmation result =",L),t(8,r=L),window.confirmationResult=L}).catch(L=>{alert(L),console.log("error =",L),window.recaptchaVerifier.render().then(function(Y){grecaptcha.reset(Y)})})}}function d(){console.log("phoneConfirmCode =",c),window.confirmationResult.confirm(c).then(N=>{}).catch(N=>{alert(N)})}const g=oe();let _=null,b="",k=[],w=!1;const O=Ke(J,"users");Je(O).then(N=>{N.docs.forEach(A=>{k.push(_e({uid:A.id},A.data()))})});async function U({name:N,uid:A}){for(const se of _.friends)if(se.uid===A){alert("You're already friends"),t(11,w=!1);return}const L=G(J,"users",_.uid);await $(L,{friends:ce({name:N,uid:A})});const Y=_.uid<A?_.uid+A:A+_.uid,ne=G(J,"chats",Y);await ge(ne,{participantUIDs:[A,_.uid],messages:[]}),t(11,w=!1)}Ze(g,async N=>{if(N){const A=G(J,"users",N.uid),L=await Pe(A);if(L.exists())t(4,_=L.data());else{const Y={uid:N.uid,name:N.displayName||"John Apple",phoneNumber:N.phoneNumber,friends:[],family:[],VIPs:[],everyoneElse:[]};await ge(G(J,"users",N.uid),Y),t(4,_=Y)}Re(G(J,"users",N.uid),Y=>{t(4,_=Y.data()),_.friendUIDsWithNewMessages&&t(10,E=_.friendUIDsWithNewMessages)})}});async function z(){await $(G(J,"users",_.uid),{name:i}),t(6,i=""),alert("successfully updated")}function u(){n=this.value,t(7,n)}function S(){o=this.value,t(0,o)}function T(){a=this.value,t(1,a)}function K(){f=this.value,t(2,f)}function F(){c=this.value,t(9,c)}const x=N=>t(5,b=N.uid),X=()=>t(11,w=!w),le=N=>U(N);function H(){i=this.value,t(6,i)}return s.$$.update=()=>{s.$$.dirty[0]&56&&b&&(t(3,v=_.uid<b?_.uid+b:b+_.uid),console.log("chatRoomID =",v)),s.$$.dirty[0]&1&&o.length===3&&document.getElementById("phone-input-2").focus(),s.$$.dirty[0]&2&&a.length===3&&document.getElementById("phone-input-3").focus(),s.$$.dirty[0]&4&&f.length===4&&y()},[o,a,f,v,_,b,i,n,r,c,E,w,y,d,k,U,z,u,S,T,K,F,x,X,le,H]}class mt extends Me{constructor(e){super();Se(this,e,ht,ct,he,{},null,[-1,-1])}}export{mt as default};
