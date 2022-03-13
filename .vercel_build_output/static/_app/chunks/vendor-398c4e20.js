function zt(){}function Yl(t,e){for(const n in e)t[n]=e[n];return t}function Xa(t){return t()}function No(){return Object.create(null)}function mn(t){t.forEach(Xa)}function Ql(t){return typeof t=="function"}function Zl(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function eh(t){return Object.keys(t).length===0}function zv(t,e,n,i){if(t){const s=Ja(t,e,n,i);return t[0](s)}}function Ja(t,e,n,i){return t[1]&&i?Yl(n.ctx.slice(),t[1](i(e))):n.ctx}function Wv(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const r=[],o=Math.max(e.dirty.length,s.length);for(let a=0;a<o;a+=1)r[a]=e.dirty[a]|s[a];return r}return e.dirty|s}return e.dirty}function Xv(t,e,n,i,s,r){if(s){const o=Ja(e,n,i,r);t.p(o,s)}}function Jv(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}let Ri=!1;function th(){Ri=!0}function nh(){Ri=!1}function ih(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function sh(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const l=e[u];l.claim_order!==void 0&&c.push(l)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,l=(s>0&&e[n[s]].claim_order<=u?s+1:ih(1,s,d=>e[n[d]].claim_order,u))-1;i[c]=n[l]+1;const h=l+1;n[h]=c,s=Math.max(h,s)}const r=[],o=[];let a=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(r.push(e[c-1]);a>=c;a--)o.push(e[a]);a--}for(;a>=0;a--)o.push(e[a]);r.reverse(),o.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<o.length;c++){for(;u<r.length&&o[c].claim_order>=r[u].claim_order;)u++;const l=u<r.length?r[u]:null;t.insertBefore(o[c],l)}}function rh(t,e){if(Ri){for(sh(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Yv(t,e,n){Ri&&!n?rh(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function oh(t){t.parentNode.removeChild(t)}function Qv(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function ah(t){return document.createElement(t)}function lr(t){return document.createTextNode(t)}function Zv(){return lr(" ")}function ew(){return lr("")}function tw(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function nw(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function ch(t){return Array.from(t.childNodes)}function uh(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function Ya(t,e,n,i,s=!1){uh(t);const r=(()=>{for(let o=t.claim_info.last_index;o<t.length;o++){const a=t[o];if(e(a)){const c=n(a);return c===void 0?t.splice(o,1):t[o]=c,s||(t.claim_info.last_index=o),a}}for(let o=t.claim_info.last_index-1;o>=0;o--){const a=t[o];if(e(a)){const c=n(a);return c===void 0?t.splice(o,1):t[o]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=o,a}}return i()})();return r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,r}function lh(t,e,n,i){return Ya(t,s=>s.nodeName===e,s=>{const r=[];for(let o=0;o<s.attributes.length;o++){const a=s.attributes[o];n[a.name]||r.push(a.name)}r.forEach(o=>s.removeAttribute(o))},()=>i(e))}function iw(t,e,n){return lh(t,e,n,ah)}function hh(t,e){return Ya(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>lr(e),!0)}function sw(t){return hh(t," ")}function rw(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function ow(t,e){t.value=e==null?"":e}function aw(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function cw(t,e,n){t.classList[n?"add":"remove"](e)}let tn;function Wt(t){tn=t}function hr(){if(!tn)throw new Error("Function called outside component initialization");return tn}function uw(t){hr().$$.on_mount.push(t)}function lw(t){hr().$$.after_update.push(t)}function hw(t,e){hr().$$.context.set(t,e)}const Ht=[],Ro=[],Wn=[],Do=[],Qa=Promise.resolve();let Os=!1;function Za(){Os||(Os=!0,Qa.then(ec))}function dw(){return Za(),Qa}function Ps(t){Wn.push(t)}const fs=new Set;let Bn=0;function ec(){const t=tn;do{for(;Bn<Ht.length;){const e=Ht[Bn];Bn++,Wt(e),dh(e.$$)}for(Wt(null),Ht.length=0,Bn=0;Ro.length;)Ro.pop()();for(let e=0;e<Wn.length;e+=1){const n=Wn[e];fs.has(n)||(fs.add(n),n())}Wn.length=0}while(Ht.length);for(;Do.length;)Do.pop()();Os=!1,fs.clear(),Wt(t)}function dh(t){if(t.fragment!==null){t.update(),mn(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Ps)}}const Xn=new Set;let Be;function fw(){Be={r:0,c:[],p:Be}}function pw(){Be.r||mn(Be.c),Be=Be.p}function fh(t,e){t&&t.i&&(Xn.delete(t),t.i(e))}function gw(t,e,n,i){if(t&&t.o){if(Xn.has(t))return;Xn.add(t),Be.c.push(()=>{Xn.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}}function mw(t,e){const n={},i={},s={$$scope:1};let r=t.length;for(;r--;){const o=t[r],a=e[r];if(a){for(const c in o)c in a||(i[c]=1);for(const c in a)s[c]||(n[c]=a[c],s[c]=1);t[r]=a}else for(const c in o)s[c]=1}for(const o in i)o in n||(n[o]=void 0);return n}function yw(t){return typeof t=="object"&&t!==null?t:{}}function vw(t){t&&t.c()}function ww(t,e){t&&t.l(e)}function ph(t,e,n,i){const{fragment:s,on_mount:r,on_destroy:o,after_update:a}=t.$$;s&&s.m(e,n),i||Ps(()=>{const c=r.map(Xa).filter(Ql);o?o.push(...c):mn(c),t.$$.on_mount=[]}),a.forEach(Ps)}function gh(t,e){const n=t.$$;n.fragment!==null&&(mn(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function mh(t,e){t.$$.dirty[0]===-1&&(Ht.push(t),Za(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function _w(t,e,n,i,s,r,o,a=[-1]){const c=tn;Wt(t);const u=t.$$={fragment:null,ctx:null,props:r,update:zt,not_equal:s,bound:No(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:No(),dirty:a,skip_bound:!1,root:e.target||c.$$.root};o&&o(u.root);let l=!1;if(u.ctx=n?n(t,e.props||{},(h,d,...g)=>{const m=g.length?g[0]:d;return u.ctx&&s(u.ctx[h],u.ctx[h]=m)&&(!u.skip_bound&&u.bound[h]&&u.bound[h](m),l&&mh(t,h)),d}):[],u.update(),l=!0,mn(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){th();const h=ch(e.target);u.fragment&&u.fragment.l(h),h.forEach(oh)}else u.fragment&&u.fragment.c();e.intro&&fh(t.$$.fragment),ph(t,e.target,e.anchor,e.customElement),nh(),ec()}Wt(c)}class Ew{$destroy(){gh(this,1),this.$destroy=zt}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!eh(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const ut=[];function Iw(t,e=zt){let n;const i=new Set;function s(a){if(Zl(t,a)&&(t=a,n)){const c=!ut.length;for(const u of i)u[1](),ut.push(u,t);if(c){for(let u=0;u<ut.length;u+=2)ut[u][0](ut[u+1]);ut.length=0}}}function r(a){s(a(t))}function o(a,c=zt){const u=[a,c];return i.add(u),i.size===1&&(n=e(s)||zt),a(t),()=>{i.delete(u),i.size===0&&(n(),n=null)}}return{set:s,update:r,subscribe:o}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let s=t.charCodeAt(i);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},yh=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const s=t[n++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=t[n++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=t[n++],o=t[n++],a=t[n++],c=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[i++]=String.fromCharCode(55296+(c>>10)),e[i++]=String.fromCharCode(56320+(c&1023))}else{const r=t[n++],o=t[n++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},nc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<t.length;s+=3){const r=t[s],o=s+1<t.length,a=o?t[s+1]:0,c=s+2<t.length,u=c?t[s+2]:0,l=r>>2,h=(r&3)<<4|a>>4;let d=(a&15)<<2|u>>6,g=u&63;c||(g=64,o||(d=64)),i.push(n[l],n[h],n[d],n[g])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(tc(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):yh(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<t.length;){const r=n[t.charAt(s++)],a=s<t.length?n[t.charAt(s)]:0;++s;const u=s<t.length?n[t.charAt(s)]:64;++s;const h=s<t.length?n[t.charAt(s)]:64;if(++s,r==null||a==null||u==null||h==null)throw Error();const d=r<<2|a>>4;if(i.push(d),u!==64){const g=a<<4&240|u>>2;if(i.push(g),h!==64){const m=u<<6&192|h;i.push(m)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},ic=function(t){const e=tc(t);return nc.encodeByteArray(e,!0)},vh=function(t){try{return nc.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(){return typeof navigator!="undefined"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function sc(){return typeof window!="undefined"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test($())}function rc(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function oc(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function _h(){return $().indexOf("Electron/")>=0}function ac(){const t=$();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Eh(){return $().indexOf("MSAppHost/")>=0}function Ih(){return typeof indexedDB=="object"}function Th(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var r;e(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sh="FirebaseError";class xe extends Error{constructor(e,n,i){super(n);this.code=e,this.customData=i,this.name=Sh,Object.setPrototypeOf(this,xe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,yn.prototype.create)}}class yn{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?bh(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new xe(s,a,i)}}function bh(t,e){return t.replace(Ah,(n,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const Ah=/\{\$([^}]+)}/g;function kh(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ri(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const s of n){if(!i.includes(s))return!1;const r=t[s],o=e[s];if(Oo(r)&&Oo(o)){if(!ri(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!n.includes(s))return!1;return!0}function Oo(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(t){const e=[];for(const[n,i]of Object.entries(t))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function Ch(t,e){const n=new Nh(t,e);return n.subscribe.bind(n)}class Nh{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,i){let s;if(e===void 0&&n===void 0&&i===void 0)throw new Error("Missing Observer.");Rh(e,["next","error","complete"])?s=e:s={next:e,error:n,complete:i},s.next===void 0&&(s.next=ps),s.error===void 0&&(s.error=ps),s.complete===void 0&&(s.complete=ps);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(i){typeof console!="undefined"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Rh(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function ps(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(t){return t&&t._delegate?t._delegate:t}class De{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $e="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dh{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new wh;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ph(e))try{this.getOrInitializeService({instanceIdentifier:$e})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=$e){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=$e){return this.instances.has(e)}getOptions(e=$e){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(e,n){var i;const s=this.normalizeInstanceIdentifier(n),r=(i=this.onInitCallbacks.get(s))!==null&&i!==void 0?i:new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(!!i)for(const s of i)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Oh(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=$e){return this.component?this.component.multipleInstances?e:$e:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Oh(t){return t===$e?void 0:t}function Ph(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lh{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Dh(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var N;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(N||(N={}));const Mh={debug:N.DEBUG,verbose:N.VERBOSE,info:N.INFO,warn:N.WARN,error:N.ERROR,silent:N.SILENT},xh=N.INFO,Uh={[N.DEBUG]:"log",[N.VERBOSE]:"log",[N.INFO]:"info",[N.WARN]:"warn",[N.ERROR]:"error"},Vh=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),s=Uh[e];if(s)console[s](`[${i}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class dr{constructor(e){this.name=e,this._logLevel=xh,this._logHandler=Vh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in N))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Mh[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,N.DEBUG,...e),this._logHandler(this,N.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,N.VERBOSE,...e),this._logHandler(this,N.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,N.INFO,...e),this._logHandler(this,N.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,N.WARN,...e),this._logHandler(this,N.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,N.ERROR,...e),this._logHandler(this,N.ERROR,...e)}}function Fh(t){return Array.prototype.slice.call(t)}function cc(t){return new Promise(function(e,n){t.onsuccess=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function fr(t,e,n){var i,s=new Promise(function(r,o){i=t[e].apply(t,n),cc(i).then(r,o)});return s.request=i,s}function $h(t,e,n){var i=fr(t,e,n);return i.then(function(s){if(!!s)return new nn(s,i.request)})}function Dt(t,e,n){n.forEach(function(i){Object.defineProperty(t.prototype,i,{get:function(){return this[e][i]},set:function(s){this[e][i]=s}})})}function pr(t,e,n,i){i.forEach(function(s){s in n.prototype&&(t.prototype[s]=function(){return fr(this[e],s,arguments)})})}function Di(t,e,n,i){i.forEach(function(s){s in n.prototype&&(t.prototype[s]=function(){return this[e][s].apply(this[e],arguments)})})}function uc(t,e,n,i){i.forEach(function(s){s in n.prototype&&(t.prototype[s]=function(){return $h(this[e],s,arguments)})})}function it(t){this._index=t}Dt(it,"_index",["name","keyPath","multiEntry","unique"]);pr(it,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]);uc(it,"_index",IDBIndex,["openCursor","openKeyCursor"]);function nn(t,e){this._cursor=t,this._request=e}Dt(nn,"_cursor",["direction","key","primaryKey","value"]);pr(nn,"_cursor",IDBCursor,["update","delete"]);["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(nn.prototype[t]=function(){var e=this,n=arguments;return Promise.resolve().then(function(){return e._cursor[t].apply(e._cursor,n),cc(e._request).then(function(i){if(!!i)return new nn(i,e._request)})})})});function pe(t){this._store=t}pe.prototype.createIndex=function(){return new it(this._store.createIndex.apply(this._store,arguments))};pe.prototype.index=function(){return new it(this._store.index.apply(this._store,arguments))};Dt(pe,"_store",["name","keyPath","indexNames","autoIncrement"]);pr(pe,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]);uc(pe,"_store",IDBObjectStore,["openCursor","openKeyCursor"]);Di(pe,"_store",IDBObjectStore,["deleteIndex"]);function vn(t){this._tx=t,this.complete=new Promise(function(e,n){t.oncomplete=function(){e()},t.onerror=function(){n(t.error)},t.onabort=function(){n(t.error)}})}vn.prototype.objectStore=function(){return new pe(this._tx.objectStore.apply(this._tx,arguments))};Dt(vn,"_tx",["objectStoreNames","mode"]);Di(vn,"_tx",IDBTransaction,["abort"]);function Oi(t,e,n){this._db=t,this.oldVersion=e,this.transaction=new vn(n)}Oi.prototype.createObjectStore=function(){return new pe(this._db.createObjectStore.apply(this._db,arguments))};Dt(Oi,"_db",["name","version","objectStoreNames"]);Di(Oi,"_db",IDBDatabase,["deleteObjectStore","close"]);function Pi(t){this._db=t}Pi.prototype.transaction=function(){return new vn(this._db.transaction.apply(this._db,arguments))};Dt(Pi,"_db",["name","version","objectStoreNames"]);Di(Pi,"_db",IDBDatabase,["close"]);["openCursor","openKeyCursor"].forEach(function(t){[pe,it].forEach(function(e){t in e.prototype&&(e.prototype[t.replace("open","iterate")]=function(){var n=Fh(arguments),i=n[n.length-1],s=this._store||this._index,r=s[t].apply(s,n.slice(0,-1));r.onsuccess=function(){i(r.result)}})})});[it,pe].forEach(function(t){t.prototype.getAll||(t.prototype.getAll=function(e,n){var i=this,s=[];return new Promise(function(r){i.iterateCursor(e,function(o){if(!o){r(s);return}if(s.push(o.value),n!==void 0&&s.length==n){r(s);return}o.continue()})})})});function Bh(t,e,n){var i=fr(indexedDB,"open",[t,e]),s=i.request;return s&&(s.onupgradeneeded=function(r){n&&n(new Oi(s.result,r.oldVersion,s.transaction))}),i.then(function(r){return new Pi(r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qh{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(jh(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function jh(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ls="@firebase/app",Po="0.7.18";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gr=new dr("@firebase/app"),Hh="@firebase/app-compat",Kh="@firebase/analytics-compat",Gh="@firebase/analytics",zh="@firebase/app-check-compat",Wh="@firebase/app-check",Xh="@firebase/auth",Jh="@firebase/auth-compat",Yh="@firebase/database",Qh="@firebase/database-compat",Zh="@firebase/functions",ed="@firebase/functions-compat",td="@firebase/installations",nd="@firebase/installations-compat",id="@firebase/messaging",sd="@firebase/messaging-compat",rd="@firebase/performance",od="@firebase/performance-compat",ad="@firebase/remote-config",cd="@firebase/remote-config-compat",ud="@firebase/storage",ld="@firebase/storage-compat",hd="@firebase/firestore",dd="@firebase/firestore-compat",fd="firebase",pd="9.6.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lc="[DEFAULT]",gd={[Ls]:"fire-core",[Hh]:"fire-core-compat",[Gh]:"fire-analytics",[Kh]:"fire-analytics-compat",[Wh]:"fire-app-check",[zh]:"fire-app-check-compat",[Xh]:"fire-auth",[Jh]:"fire-auth-compat",[Yh]:"fire-rtdb",[Qh]:"fire-rtdb-compat",[Zh]:"fire-fn",[ed]:"fire-fn-compat",[td]:"fire-iid",[nd]:"fire-iid-compat",[id]:"fire-fcm",[sd]:"fire-fcm-compat",[rd]:"fire-perf",[od]:"fire-perf-compat",[ad]:"fire-rc",[cd]:"fire-rc-compat",[ud]:"fire-gcs",[ld]:"fire-gcs-compat",[hd]:"fire-fst",[dd]:"fire-fst-compat","fire-js":"fire-js",[fd]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi=new Map,Ms=new Map;function md(t,e){try{t.container.addComponent(e)}catch(n){gr.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function ze(t){const e=t.name;if(Ms.has(e))return gr.debug(`There were multiple attempts to register component ${e}.`),!1;Ms.set(e,t);for(const n of oi.values())md(n,t);return!0}function Li(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yd={["no-app"]:"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",["bad-app-name"]:"Illegal App name: '{$appName}",["duplicate-app"]:"Firebase App named '{$appName}' already exists with different options or config",["app-deleted"]:"Firebase App named '{$appName}' already deleted",["invalid-app-argument"]:"firebase.{$appName}() takes either no argument or a Firebase App instance.",["invalid-log-argument"]:"First argument to `onLog` must be null or a function.",["storage-open"]:"Error thrown when opening storage. Original error: {$originalErrorMessage}.",["storage-get"]:"Error thrown when reading from storage. Original error: {$originalErrorMessage}.",["storage-set"]:"Error thrown when writing to storage. Original error: {$originalErrorMessage}.",["storage-delete"]:"Error thrown when deleting from storage. Original error: {$originalErrorMessage}."},Oe=new yn("app","Firebase",yd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new De("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Oe.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wn=pd;function Tw(t,e={}){typeof e!="object"&&(e={name:e});const n=Object.assign({name:lc,automaticDataCollectionEnabled:!1},e),i=n.name;if(typeof i!="string"||!i)throw Oe.create("bad-app-name",{appName:String(i)});const s=oi.get(i);if(s){if(ri(t,s.options)&&ri(n,s.config))return s;throw Oe.create("duplicate-app",{appName:i})}const r=new Lh(i);for(const a of Ms.values())r.addComponent(a);const o=new vd(t,n,r);return oi.set(i,o),o}function mr(t=lc){const e=oi.get(t);if(!e)throw Oe.create("no-app",{appName:t});return e}function de(t,e,n){var i;let s=(i=gd[t])!==null&&i!==void 0?i:t;n&&(s+=`-${n}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),gr.warn(a.join(" "));return}ze(new De(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wd="firebase-heartbeat-database",_d=1,We="firebase-heartbeat-store";let gs=null;function yr(){return gs||(gs=Bh(wd,_d,t=>{switch(t.oldVersion){case 0:t.createObjectStore(We)}}).catch(t=>{throw Oe.create("storage-open",{originalErrorMessage:t.message})})),gs}async function Ed(t){try{return(await yr()).transaction(We).objectStore(We).get(vr(t))}catch(e){throw Oe.create("storage-get",{originalErrorMessage:e.message})}}async function ms(t,e){try{const i=(await yr()).transaction(We,"readwrite");return await i.objectStore(We).put(e,vr(t)),i.complete}catch(n){throw Oe.create("storage-set",{originalErrorMessage:n.message})}}async function Id(t){try{const n=(await yr()).transaction(We,"readwrite");return await n.objectStore(We).delete(vr(t)),n.complete}catch(e){throw Oe.create("storage-delete",{originalErrorMessage:e.message})}}function vr(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Td=1024,Sd=30*24*60*60*1e3;class bd{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Cd(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Ad();if(this._heartbeatsCache===null&&(this._heartbeatsCache=await this._heartbeatsCachePromise),!this._heartbeatsCache.some(s=>s.date===i))return this._heartbeatsCache.push({date:i,userAgent:n}),this._heartbeatsCache=this._heartbeatsCache.filter(s=>{const r=new Date(s.date).valueOf();return Date.now()-r<=Sd}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache===null)return"";const{heartbeatsToSend:e,unsentEntries:n}=kd(this._heartbeatsCache),i=ic(JSON.stringify({version:2,heartbeats:e}));return n.length>0?(this._heartbeatsCache=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache=null,this._storage.deleteAll()),i}}function Ad(){return new Date().toISOString().substring(0,10)}function kd(t,e=Td){const n=[];let i=t.slice();for(const s of t){const r=n.find(o=>o.userAgent===s.userAgent);if(r){if(r.dates.push(s.date),Lo(n)>e){r.dates.pop();break}}else if(n.push({userAgent:s.userAgent,dates:[s.date]}),Lo(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class Cd{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ih()?Th().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ed(this.app);return(n==null?void 0:n.heartbeats)||[]}else return[]}async overwrite(e){if(await this._canUseIndexedDBPromise)return ms(this.app,{heartbeats:e})}async add(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return ms(this.app,{heartbeats:[...i,...e]})}else return}async delete(e){if(await this._canUseIndexedDBPromise){const i=await this.read();return ms(this.app,{heartbeats:i.filter(s=>!e.includes(s))})}else return}async deleteAll(){if(await this._canUseIndexedDBPromise)return Id(this.app)}}function Lo(t){return ic(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nd(t){ze(new De("platform-logger",e=>new qh(e),"PRIVATE")),ze(new De("heartbeat",e=>new bd(e),"PRIVATE")),de(Ls,Po,t),de(Ls,Po,"esm2017"),de("fire-js","")}Nd("");var Rd="firebase",Dd="9.6.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */de(Rd,Dd,"app");var Od=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},y,wr=wr||{},I=Od||self;function ai(){}function xs(t){var e=typeof t;return e=e!="object"?e:t?Array.isArray(t)?"array":e:"null",e=="array"||e=="object"&&typeof t.length=="number"}function _n(t){var e=typeof t;return e=="object"&&t!=null||e=="function"}function Pd(t){return Object.prototype.hasOwnProperty.call(t,ys)&&t[ys]||(t[ys]=++Ld)}var ys="closure_uid_"+(1e9*Math.random()>>>0),Ld=0;function Md(t,e,n){return t.call.apply(t.bind,arguments)}function xd(t,e,n){if(!t)throw Error();if(2<arguments.length){var i=Array.prototype.slice.call(arguments,2);return function(){var s=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(s,i),t.apply(e,s)}}return function(){return t.apply(e,arguments)}}function G(t,e,n){return Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?G=Md:G=xd,G.apply(null,arguments)}function qn(t,e){var n=Array.prototype.slice.call(arguments,1);return function(){var i=n.slice();return i.push.apply(i,arguments),t.apply(this,i)}}function J(t,e){function n(){}n.prototype=e.prototype,t.Z=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.Vb=function(i,s,r){for(var o=Array(arguments.length-2),a=2;a<arguments.length;a++)o[a-2]=arguments[a];return e.prototype[s].apply(i,o)}}function Ue(){this.s=this.s,this.o=this.o}var Ud=0,Vd={};Ue.prototype.s=!1;Ue.prototype.na=function(){if(!this.s&&(this.s=!0,this.M(),Ud!=0)){var t=Pd(this);delete Vd[t]}};Ue.prototype.M=function(){if(this.o)for(;this.o.length;)this.o.shift()()};const hc=Array.prototype.indexOf?function(t,e){return Array.prototype.indexOf.call(t,e,void 0)}:function(t,e){if(typeof t=="string")return typeof e!="string"||e.length!=1?-1:t.indexOf(e,0);for(let n=0;n<t.length;n++)if(n in t&&t[n]===e)return n;return-1},dc=Array.prototype.forEach?function(t,e,n){Array.prototype.forEach.call(t,e,n)}:function(t,e,n){const i=t.length,s=typeof t=="string"?t.split(""):t;for(let r=0;r<i;r++)r in s&&e.call(n,s[r],r,t)};function Fd(t){e:{var e=Df;const n=t.length,i=typeof t=="string"?t.split(""):t;for(let s=0;s<n;s++)if(s in i&&e.call(void 0,i[s],s,t)){e=s;break e}e=-1}return 0>e?null:typeof t=="string"?t.charAt(e):t[e]}function Mo(t){return Array.prototype.concat.apply([],arguments)}function _r(t){const e=t.length;if(0<e){const n=Array(e);for(let i=0;i<e;i++)n[i]=t[i];return n}return[]}function ci(t){return/^[\s\xa0]*$/.test(t)}var xo=String.prototype.trim?function(t){return t.trim()}:function(t){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(t)[1]};function te(t,e){return t.indexOf(e)!=-1}function vs(t,e){return t<e?-1:t>e?1:0}var ne;e:{var Uo=I.navigator;if(Uo){var Vo=Uo.userAgent;if(Vo){ne=Vo;break e}}ne=""}function Er(t,e,n){for(const i in t)e.call(n,t[i],i,t)}function fc(t){const e={};for(const n in t)e[n]=t[n];return e}var Fo="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function pc(t,e){let n,i;for(let s=1;s<arguments.length;s++){i=arguments[s];for(n in i)t[n]=i[n];for(let r=0;r<Fo.length;r++)n=Fo[r],Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}}function Ir(t){return Ir[" "](t),t}Ir[" "]=ai;function $d(t){var e=jd;return Object.prototype.hasOwnProperty.call(e,9)?e[9]:e[9]=t(9)}var Bd=te(ne,"Opera"),wt=te(ne,"Trident")||te(ne,"MSIE"),gc=te(ne,"Edge"),Us=gc||wt,mc=te(ne,"Gecko")&&!(te(ne.toLowerCase(),"webkit")&&!te(ne,"Edge"))&&!(te(ne,"Trident")||te(ne,"MSIE"))&&!te(ne,"Edge"),qd=te(ne.toLowerCase(),"webkit")&&!te(ne,"Edge");function yc(){var t=I.document;return t?t.documentMode:void 0}var ui;e:{var ws="",_s=function(){var t=ne;if(mc)return/rv:([^\);]+)(\)|;)/.exec(t);if(gc)return/Edge\/([\d\.]+)/.exec(t);if(wt)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(t);if(qd)return/WebKit\/(\S+)/.exec(t);if(Bd)return/(?:Version)[ \/]?(\S+)/.exec(t)}();if(_s&&(ws=_s?_s[1]:""),wt){var Es=yc();if(Es!=null&&Es>parseFloat(ws)){ui=String(Es);break e}}ui=ws}var jd={};function Hd(){return $d(function(){let t=0;const e=xo(String(ui)).split("."),n=xo("9").split("."),i=Math.max(e.length,n.length);for(let o=0;t==0&&o<i;o++){var s=e[o]||"",r=n[o]||"";do{if(s=/(\d*)(\D*)(.*)/.exec(s)||["","","",""],r=/(\d*)(\D*)(.*)/.exec(r)||["","","",""],s[0].length==0&&r[0].length==0)break;t=vs(s[1].length==0?0:parseInt(s[1],10),r[1].length==0?0:parseInt(r[1],10))||vs(s[2].length==0,r[2].length==0)||vs(s[2],r[2]),s=s[3],r=r[3]}while(t==0)}return 0<=t})}var Vs;if(I.document&&wt){var $o=yc();Vs=$o||parseInt(ui,10)||void 0}else Vs=void 0;var Kd=Vs,Gd=function(){if(!I.addEventListener||!Object.defineProperty)return!1;var t=!1,e=Object.defineProperty({},"passive",{get:function(){t=!0}});try{I.addEventListener("test",ai,e),I.removeEventListener("test",ai,e)}catch{}return t}();function Q(t,e){this.type=t,this.g=this.target=e,this.defaultPrevented=!1}Q.prototype.h=function(){this.defaultPrevented=!0};function sn(t,e){if(Q.call(this,t?t.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,t){var n=this.type=t.type,i=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.g=e,e=t.relatedTarget){if(mc){e:{try{Ir(e.nodeName);var s=!0;break e}catch{}s=!1}s||(e=null)}}else n=="mouseover"?e=t.fromElement:n=="mouseout"&&(e=t.toElement);this.relatedTarget=e,i?(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0):(this.clientX=t.clientX!==void 0?t.clientX:t.pageX,this.clientY=t.clientY!==void 0?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType=typeof t.pointerType=="string"?t.pointerType:zd[t.pointerType]||"",this.state=t.state,this.i=t,t.defaultPrevented&&sn.Z.h.call(this)}}J(sn,Q);var zd={2:"touch",3:"pen",4:"mouse"};sn.prototype.h=function(){sn.Z.h.call(this);var t=this.i;t.preventDefault?t.preventDefault():t.returnValue=!1};var En="closure_listenable_"+(1e6*Math.random()|0),Wd=0;function Xd(t,e,n,i,s){this.listener=t,this.proxy=null,this.src=e,this.type=n,this.capture=!!i,this.ia=s,this.key=++Wd,this.ca=this.fa=!1}function Mi(t){t.ca=!0,t.listener=null,t.proxy=null,t.src=null,t.ia=null}function xi(t){this.src=t,this.g={},this.h=0}xi.prototype.add=function(t,e,n,i,s){var r=t.toString();t=this.g[r],t||(t=this.g[r]=[],this.h++);var o=$s(t,e,i,s);return-1<o?(e=t[o],n||(e.fa=!1)):(e=new Xd(e,this.src,r,!!i,s),e.fa=n,t.push(e)),e};function Fs(t,e){var n=e.type;if(n in t.g){var i=t.g[n],s=hc(i,e),r;(r=0<=s)&&Array.prototype.splice.call(i,s,1),r&&(Mi(e),t.g[n].length==0&&(delete t.g[n],t.h--))}}function $s(t,e,n,i){for(var s=0;s<t.length;++s){var r=t[s];if(!r.ca&&r.listener==e&&r.capture==!!n&&r.ia==i)return s}return-1}var Tr="closure_lm_"+(1e6*Math.random()|0),Is={};function vc(t,e,n,i,s){if(i&&i.once)return _c(t,e,n,i,s);if(Array.isArray(e)){for(var r=0;r<e.length;r++)vc(t,e[r],n,i,s);return null}return n=Ar(n),t&&t[En]?t.N(e,n,_n(i)?!!i.capture:!!i,s):wc(t,e,n,!1,i,s)}function wc(t,e,n,i,s,r){if(!e)throw Error("Invalid event type");var o=_n(s)?!!s.capture:!!s,a=br(t);if(a||(t[Tr]=a=new xi(t)),n=a.add(e,n,i,o,r),n.proxy)return n;if(i=Jd(),n.proxy=i,i.src=t,i.listener=n,t.addEventListener)Gd||(s=o),s===void 0&&(s=!1),t.addEventListener(e.toString(),i,s);else if(t.attachEvent)t.attachEvent(Ic(e.toString()),i);else if(t.addListener&&t.removeListener)t.addListener(i);else throw Error("addEventListener and attachEvent are unavailable.");return n}function Jd(){function t(n){return e.call(t.src,t.listener,n)}var e=Yd;return t}function _c(t,e,n,i,s){if(Array.isArray(e)){for(var r=0;r<e.length;r++)_c(t,e[r],n,i,s);return null}return n=Ar(n),t&&t[En]?t.O(e,n,_n(i)?!!i.capture:!!i,s):wc(t,e,n,!0,i,s)}function Ec(t,e,n,i,s){if(Array.isArray(e))for(var r=0;r<e.length;r++)Ec(t,e[r],n,i,s);else i=_n(i)?!!i.capture:!!i,n=Ar(n),t&&t[En]?(t=t.i,e=String(e).toString(),e in t.g&&(r=t.g[e],n=$s(r,n,i,s),-1<n&&(Mi(r[n]),Array.prototype.splice.call(r,n,1),r.length==0&&(delete t.g[e],t.h--)))):t&&(t=br(t))&&(e=t.g[e.toString()],t=-1,e&&(t=$s(e,n,i,s)),(n=-1<t?e[t]:null)&&Sr(n))}function Sr(t){if(typeof t!="number"&&t&&!t.ca){var e=t.src;if(e&&e[En])Fs(e.i,t);else{var n=t.type,i=t.proxy;e.removeEventListener?e.removeEventListener(n,i,t.capture):e.detachEvent?e.detachEvent(Ic(n),i):e.addListener&&e.removeListener&&e.removeListener(i),(n=br(e))?(Fs(n,t),n.h==0&&(n.src=null,e[Tr]=null)):Mi(t)}}}function Ic(t){return t in Is?Is[t]:Is[t]="on"+t}function Yd(t,e){if(t.ca)t=!0;else{e=new sn(e,this);var n=t.listener,i=t.ia||t.src;t.fa&&Sr(t),t=n.call(i,e)}return t}function br(t){return t=t[Tr],t instanceof xi?t:null}var Ts="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ar(t){return typeof t=="function"?t:(t[Ts]||(t[Ts]=function(e){return t.handleEvent(e)}),t[Ts])}function q(){Ue.call(this),this.i=new xi(this),this.P=this,this.I=null}J(q,Ue);q.prototype[En]=!0;q.prototype.removeEventListener=function(t,e,n,i){Ec(this,t,e,n,i)};function z(t,e){var n,i=t.I;if(i)for(n=[];i;i=i.I)n.push(i);if(t=t.P,i=e.type||e,typeof e=="string")e=new Q(e,t);else if(e instanceof Q)e.target=e.target||t;else{var s=e;e=new Q(i,t),pc(e,s)}if(s=!0,n)for(var r=n.length-1;0<=r;r--){var o=e.g=n[r];s=jn(o,i,!0,e)&&s}if(o=e.g=t,s=jn(o,i,!0,e)&&s,s=jn(o,i,!1,e)&&s,n)for(r=0;r<n.length;r++)o=e.g=n[r],s=jn(o,i,!1,e)&&s}q.prototype.M=function(){if(q.Z.M.call(this),this.i){var t=this.i,e;for(e in t.g){for(var n=t.g[e],i=0;i<n.length;i++)Mi(n[i]);delete t.g[e],t.h--}}this.I=null};q.prototype.N=function(t,e,n,i){return this.i.add(String(t),e,!1,n,i)};q.prototype.O=function(t,e,n,i){return this.i.add(String(t),e,!0,n,i)};function jn(t,e,n,i){if(e=t.i.g[String(e)],!e)return!0;e=e.concat();for(var s=!0,r=0;r<e.length;++r){var o=e[r];if(o&&!o.ca&&o.capture==n){var a=o.listener,c=o.ia||o.src;o.fa&&Fs(t.i,o),s=a.call(c,i)!==!1&&s}}return s&&!i.defaultPrevented}var kr=I.JSON.stringify;function Qd(){var t=Sc;let e=null;return t.g&&(e=t.g,t.g=t.g.next,t.g||(t.h=null),e.next=null),e}class Zd{constructor(){this.h=this.g=null}add(e,n){const i=Tc.get();i.set(e,n),this.h?this.h.next=i:this.g=i,this.h=i}}var Tc=new class{constructor(t,e){this.i=t,this.j=e,this.h=0,this.g=null}get(){let t;return 0<this.h?(this.h--,t=this.g,this.g=t.next,t.next=null):t=this.i(),t}}(()=>new ef,t=>t.reset());class ef{constructor(){this.next=this.g=this.h=null}set(e,n){this.h=e,this.g=n,this.next=null}reset(){this.next=this.g=this.h=null}}function tf(t){I.setTimeout(()=>{throw t},0)}function Cr(t,e){Bs||nf(),qs||(Bs(),qs=!0),Sc.add(t,e)}var Bs;function nf(){var t=I.Promise.resolve(void 0);Bs=function(){t.then(sf)}}var qs=!1,Sc=new Zd;function sf(){for(var t;t=Qd();){try{t.h.call(t.g)}catch(n){tf(n)}var e=Tc;e.j(t),100>e.h&&(e.h++,t.next=e.g,e.g=t)}qs=!1}function Ui(t,e){q.call(this),this.h=t||1,this.g=e||I,this.j=G(this.kb,this),this.l=Date.now()}J(Ui,q);y=Ui.prototype;y.da=!1;y.S=null;y.kb=function(){if(this.da){var t=Date.now()-this.l;0<t&&t<.8*this.h?this.S=this.g.setTimeout(this.j,this.h-t):(this.S&&(this.g.clearTimeout(this.S),this.S=null),z(this,"tick"),this.da&&(Nr(this),this.start()))}};y.start=function(){this.da=!0,this.S||(this.S=this.g.setTimeout(this.j,this.h),this.l=Date.now())};function Nr(t){t.da=!1,t.S&&(t.g.clearTimeout(t.S),t.S=null)}y.M=function(){Ui.Z.M.call(this),Nr(this),delete this.g};function Rr(t,e,n){if(typeof t=="function")n&&(t=G(t,n));else if(t&&typeof t.handleEvent=="function")t=G(t.handleEvent,t);else throw Error("Invalid listener argument");return 2147483647<Number(e)?-1:I.setTimeout(t,e||0)}function bc(t){t.g=Rr(()=>{t.g=null,t.i&&(t.i=!1,bc(t))},t.j);const e=t.h;t.h=null,t.m.apply(null,e)}class rf extends Ue{constructor(e,n){super();this.m=e,this.j=n,this.h=null,this.i=!1,this.g=null}l(e){this.h=arguments,this.g?this.i=!0:bc(this)}M(){super.M(),this.g&&(I.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function rn(t){Ue.call(this),this.h=t,this.g={}}J(rn,Ue);var Bo=[];function Ac(t,e,n,i){Array.isArray(n)||(n&&(Bo[0]=n.toString()),n=Bo);for(var s=0;s<n.length;s++){var r=vc(e,n[s],i||t.handleEvent,!1,t.h||t);if(!r)break;t.g[r.key]=r}}function kc(t){Er(t.g,function(e,n){this.g.hasOwnProperty(n)&&Sr(e)},t),t.g={}}rn.prototype.M=function(){rn.Z.M.call(this),kc(this)};rn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};function Vi(){this.g=!0}Vi.prototype.Aa=function(){this.g=!1};function of(t,e,n,i,s,r){t.info(function(){if(t.g)if(r)for(var o="",a=r.split("&"),c=0;c<a.length;c++){var u=a[c].split("=");if(1<u.length){var l=u[0];u=u[1];var h=l.split("_");o=2<=h.length&&h[1]=="type"?o+(l+"="+u+"&"):o+(l+"=redacted&")}}else o=null;else o=r;return"XMLHTTP REQ ("+i+") [attempt "+s+"]: "+e+`
`+n+`
`+o})}function af(t,e,n,i,s,r,o){t.info(function(){return"XMLHTTP RESP ("+i+") [ attempt "+s+"]: "+e+`
`+n+`
`+r+" "+o})}function ht(t,e,n,i){t.info(function(){return"XMLHTTP TEXT ("+e+"): "+uf(t,n)+(i?" "+i:"")})}function cf(t,e){t.info(function(){return"TIMEOUT: "+e})}Vi.prototype.info=function(){};function uf(t,e){if(!t.g)return e;if(!e)return null;try{var n=JSON.parse(e);if(n){for(t=0;t<n.length;t++)if(Array.isArray(n[t])){var i=n[t];if(!(2>i.length)){var s=i[1];if(Array.isArray(s)&&!(1>s.length)){var r=s[0];if(r!="noop"&&r!="stop"&&r!="close")for(var o=1;o<s.length;o++)s[o]=""}}}}return kr(n)}catch{return e}}var st={},qo=null;function Fi(){return qo=qo||new q}st.Ma="serverreachability";function Cc(t){Q.call(this,st.Ma,t)}J(Cc,Q);function on(t){const e=Fi();z(e,new Cc(e,t))}st.STAT_EVENT="statevent";function Nc(t,e){Q.call(this,st.STAT_EVENT,t),this.stat=e}J(Nc,Q);function ie(t){const e=Fi();z(e,new Nc(e,t))}st.Na="timingevent";function Rc(t,e){Q.call(this,st.Na,t),this.size=e}J(Rc,Q);function In(t,e){if(typeof t!="function")throw Error("Fn must not be null and must be a function");return I.setTimeout(function(){t()},e)}var $i={NO_ERROR:0,lb:1,yb:2,xb:3,sb:4,wb:5,zb:6,Ja:7,TIMEOUT:8,Cb:9},Dc={qb:"complete",Mb:"success",Ka:"error",Ja:"abort",Eb:"ready",Fb:"readystatechange",TIMEOUT:"timeout",Ab:"incrementaldata",Db:"progress",tb:"downloadprogress",Ub:"uploadprogress"};function Dr(){}Dr.prototype.h=null;function jo(t){return t.h||(t.h=t.i())}function Oc(){}var Tn={OPEN:"a",pb:"b",Ka:"c",Bb:"d"};function Or(){Q.call(this,"d")}J(Or,Q);function Pr(){Q.call(this,"c")}J(Pr,Q);var js;function Bi(){}J(Bi,Dr);Bi.prototype.g=function(){return new XMLHttpRequest};Bi.prototype.i=function(){return{}};js=new Bi;function Sn(t,e,n,i){this.l=t,this.j=e,this.m=n,this.X=i||1,this.V=new rn(this),this.P=lf,t=Us?125:void 0,this.W=new Ui(t),this.H=null,this.i=!1,this.s=this.A=this.v=this.K=this.F=this.Y=this.B=null,this.D=[],this.g=null,this.C=0,this.o=this.u=null,this.N=-1,this.I=!1,this.O=0,this.L=null,this.aa=this.J=this.$=this.U=!1,this.h=new Pc}function Pc(){this.i=null,this.g="",this.h=!1}var lf=45e3,Hs={},li={};y=Sn.prototype;y.setTimeout=function(t){this.P=t};function Ks(t,e,n){t.K=1,t.v=ji(Ee(e)),t.s=n,t.U=!0,Lc(t,null)}function Lc(t,e){t.F=Date.now(),bn(t),t.A=Ee(t.v);var n=t.A,i=t.X;Array.isArray(i)||(i=[String(i)]),Bc(n.h,"t",i),t.C=0,n=t.l.H,t.h=new Pc,t.g=au(t.l,n?e:null,!t.s),0<t.O&&(t.L=new rf(G(t.Ia,t,t.g),t.O)),Ac(t.V,t.g,"readystatechange",t.gb),e=t.H?fc(t.H):{},t.s?(t.u||(t.u="POST"),e["Content-Type"]="application/x-www-form-urlencoded",t.g.ea(t.A,t.u,t.s,e)):(t.u="GET",t.g.ea(t.A,t.u,null,e)),on(1),of(t.j,t.u,t.A,t.m,t.X,t.s)}y.gb=function(t){t=t.target;const e=this.L;e&&me(t)==3?e.l():this.Ia(t)};y.Ia=function(t){try{if(t==this.g)e:{const l=me(this.g);var e=this.g.Da();const h=this.g.ba();if(!(3>l)&&(l!=3||Us||this.g&&(this.h.h||this.g.ga()||zo(this.g)))){this.I||l!=4||e==7||(e==8||0>=h?on(3):on(2)),qi(this);var n=this.g.ba();this.N=n;t:if(Mc(this)){var i=zo(this.g);t="";var s=i.length,r=me(this.g)==4;if(!this.h.i){if(typeof TextDecoder=="undefined"){qe(this),Xt(this);var o="";break t}this.h.i=new I.TextDecoder}for(e=0;e<s;e++)this.h.h=!0,t+=this.h.i.decode(i[e],{stream:r&&e==s-1});i.splice(0,s),this.h.g+=t,this.C=0,o=this.h.g}else o=this.g.ga();if(this.i=n==200,af(this.j,this.u,this.A,this.m,this.X,l,n),this.i){if(this.$&&!this.J){t:{if(this.g){var a,c=this.g;if((a=c.g?c.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!ci(a)){var u=a;break t}}u=null}if(n=u)ht(this.j,this.m,n,"Initial handshake response via X-HTTP-Initial-Response"),this.J=!0,Gs(this,n);else{this.i=!1,this.o=3,ie(12),qe(this),Xt(this);break e}}this.U?(xc(this,l,o),Us&&this.i&&l==3&&(Ac(this.V,this.W,"tick",this.fb),this.W.start())):(ht(this.j,this.m,o,null),Gs(this,o)),l==4&&qe(this),this.i&&!this.I&&(l==4?iu(this.l,this):(this.i=!1,bn(this)))}else n==400&&0<o.indexOf("Unknown SID")?(this.o=3,ie(12)):(this.o=0,ie(13)),qe(this),Xt(this)}}}catch{}finally{}};function Mc(t){return t.g?t.u=="GET"&&t.K!=2&&t.l.Ba:!1}function xc(t,e,n){let i=!0,s;for(;!t.I&&t.C<n.length;)if(s=hf(t,n),s==li){e==4&&(t.o=4,ie(14),i=!1),ht(t.j,t.m,null,"[Incomplete Response]");break}else if(s==Hs){t.o=4,ie(15),ht(t.j,t.m,n,"[Invalid Chunk]"),i=!1;break}else ht(t.j,t.m,s,null),Gs(t,s);Mc(t)&&s!=li&&s!=Hs&&(t.h.g="",t.C=0),e!=4||n.length!=0||t.h.h||(t.o=1,ie(16),i=!1),t.i=t.i&&i,i?0<n.length&&!t.aa&&(t.aa=!0,e=t.l,e.g==t&&e.$&&!e.L&&(e.h.info("Great, no buffering proxy detected. Bytes received: "+n.length),qr(e),e.L=!0,ie(11))):(ht(t.j,t.m,n,"[Invalid Chunked Response]"),qe(t),Xt(t))}y.fb=function(){if(this.g){var t=me(this.g),e=this.g.ga();this.C<e.length&&(qi(this),xc(this,t,e),this.i&&t!=4&&bn(this))}};function hf(t,e){var n=t.C,i=e.indexOf(`
`,n);return i==-1?li:(n=Number(e.substring(n,i)),isNaN(n)?Hs:(i+=1,i+n>e.length?li:(e=e.substr(i,n),t.C=i+n,e)))}y.cancel=function(){this.I=!0,qe(this)};function bn(t){t.Y=Date.now()+t.P,Uc(t,t.P)}function Uc(t,e){if(t.B!=null)throw Error("WatchDog timer not null");t.B=In(G(t.eb,t),e)}function qi(t){t.B&&(I.clearTimeout(t.B),t.B=null)}y.eb=function(){this.B=null;const t=Date.now();0<=t-this.Y?(cf(this.j,this.A),this.K!=2&&(on(3),ie(17)),qe(this),this.o=2,Xt(this)):Uc(this,this.Y-t)};function Xt(t){t.l.G==0||t.I||iu(t.l,t)}function qe(t){qi(t);var e=t.L;e&&typeof e.na=="function"&&e.na(),t.L=null,Nr(t.W),kc(t.V),t.g&&(e=t.g,t.g=null,e.abort(),e.na())}function Gs(t,e){try{var n=t.l;if(n.G!=0&&(n.g==t||zs(n.i,t))){if(n.I=t.N,!t.J&&zs(n.i,t)&&n.G==3){try{var i=n.Ca.g.parse(e)}catch{i=null}if(Array.isArray(i)&&i.length==3){var s=i;if(s[0]==0)e:if(!n.u){if(n.g)if(n.g.F+3e3<t.F)pi(n),Gi(n);else break e;Br(n),ie(18)}else n.ta=s[1],0<n.ta-n.U&&37500>s[2]&&n.N&&n.A==0&&!n.v&&(n.v=In(G(n.ab,n),6e3));if(1>=Hc(n.i)&&n.ka){try{n.ka()}catch{}n.ka=void 0}}else je(n,11)}else if((t.J||n.g==t)&&pi(n),!ci(e))for(s=n.Ca.g.parse(e),e=0;e<s.length;e++){let u=s[e];if(n.U=u[0],u=u[1],n.G==2)if(u[0]=="c"){n.J=u[1],n.la=u[2];const l=u[3];l!=null&&(n.ma=l,n.h.info("VER="+n.ma));const h=u[4];h!=null&&(n.za=h,n.h.info("SVER="+n.za));const d=u[5];d!=null&&typeof d=="number"&&0<d&&(i=1.5*d,n.K=i,n.h.info("backChannelRequestTimeoutMs_="+i)),i=n;const g=t.g;if(g){const m=g.g?g.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(m){var r=i.i;!r.g&&(te(m,"spdy")||te(m,"quic")||te(m,"h2"))&&(r.j=r.l,r.g=new Set,r.h&&(xr(r,r.h),r.h=null))}if(i.D){const b=g.g?g.g.getResponseHeader("X-HTTP-Session-Id"):null;b&&(i.sa=b,L(i.F,i.D,b))}}n.G=3,n.j&&n.j.xa(),n.$&&(n.O=Date.now()-t.F,n.h.info("Handshake RTT: "+n.O+"ms")),i=n;var o=t;if(i.oa=ou(i,i.H?i.la:null,i.W),o.J){Kc(i.i,o);var a=o,c=i.K;c&&a.setTimeout(c),a.B&&(qi(a),bn(a)),i.g=o}else tu(i);0<n.l.length&&zi(n)}else u[0]!="stop"&&u[0]!="close"||je(n,7);else n.G==3&&(u[0]=="stop"||u[0]=="close"?u[0]=="stop"?je(n,7):$r(n):u[0]!="noop"&&n.j&&n.j.wa(u),n.A=0)}}on(4)}catch{}}function df(t){if(t.R&&typeof t.R=="function")return t.R();if(typeof t=="string")return t.split("");if(xs(t)){for(var e=[],n=t.length,i=0;i<n;i++)e.push(t[i]);return e}e=[],n=0;for(i in t)e[n++]=t[i];return e}function Lr(t,e){if(t.forEach&&typeof t.forEach=="function")t.forEach(e,void 0);else if(xs(t)||typeof t=="string")dc(t,e,void 0);else{if(t.T&&typeof t.T=="function")var n=t.T();else if(t.R&&typeof t.R=="function")n=void 0;else if(xs(t)||typeof t=="string"){n=[];for(var i=t.length,s=0;s<i;s++)n.push(s)}else for(s in n=[],i=0,t)n[i++]=s;i=df(t),s=i.length;for(var r=0;r<s;r++)e.call(void 0,i[r],n&&n[r],t)}}function Ot(t,e){this.h={},this.g=[],this.i=0;var n=arguments.length;if(1<n){if(n%2)throw Error("Uneven number of arguments");for(var i=0;i<n;i+=2)this.set(arguments[i],arguments[i+1])}else if(t)if(t instanceof Ot)for(n=t.T(),i=0;i<n.length;i++)this.set(n[i],t.get(n[i]));else for(i in t)this.set(i,t[i])}y=Ot.prototype;y.R=function(){Mr(this);for(var t=[],e=0;e<this.g.length;e++)t.push(this.h[this.g[e]]);return t};y.T=function(){return Mr(this),this.g.concat()};function Mr(t){if(t.i!=t.g.length){for(var e=0,n=0;e<t.g.length;){var i=t.g[e];Xe(t.h,i)&&(t.g[n++]=i),e++}t.g.length=n}if(t.i!=t.g.length){var s={};for(n=e=0;e<t.g.length;)i=t.g[e],Xe(s,i)||(t.g[n++]=i,s[i]=1),e++;t.g.length=n}}y.get=function(t,e){return Xe(this.h,t)?this.h[t]:e};y.set=function(t,e){Xe(this.h,t)||(this.i++,this.g.push(t)),this.h[t]=e};y.forEach=function(t,e){for(var n=this.T(),i=0;i<n.length;i++){var s=n[i],r=this.get(s);t.call(e,r,s,this)}};function Xe(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var Vc=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function ff(t,e){if(t){t=t.split("&");for(var n=0;n<t.length;n++){var i=t[n].indexOf("="),s=null;if(0<=i){var r=t[n].substring(0,i);s=t[n].substring(i+1)}else r=t[n];e(r,s?decodeURIComponent(s.replace(/\+/g," ")):"")}}}function Je(t,e){if(this.i=this.s=this.j="",this.m=null,this.o=this.l="",this.g=!1,t instanceof Je){this.g=e!==void 0?e:t.g,hi(this,t.j),this.s=t.s,di(this,t.i),fi(this,t.m),this.l=t.l,e=t.h;var n=new an;n.i=e.i,e.g&&(n.g=new Ot(e.g),n.h=e.h),Ho(this,n),this.o=t.o}else t&&(n=String(t).match(Vc))?(this.g=!!e,hi(this,n[1]||"",!0),this.s=Jt(n[2]||""),di(this,n[3]||"",!0),fi(this,n[4]),this.l=Jt(n[5]||"",!0),Ho(this,n[6]||"",!0),this.o=Jt(n[7]||"")):(this.g=!!e,this.h=new an(null,this.g))}Je.prototype.toString=function(){var t=[],e=this.j;e&&t.push(Kt(e,Ko,!0),":");var n=this.i;return(n||e=="file")&&(t.push("//"),(e=this.s)&&t.push(Kt(e,Ko,!0),"@"),t.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n=this.m,n!=null&&t.push(":",String(n))),(n=this.l)&&(this.i&&n.charAt(0)!="/"&&t.push("/"),t.push(Kt(n,n.charAt(0)=="/"?vf:yf,!0))),(n=this.h.toString())&&t.push("?",n),(n=this.o)&&t.push("#",Kt(n,_f)),t.join("")};function Ee(t){return new Je(t)}function hi(t,e,n){t.j=n?Jt(e,!0):e,t.j&&(t.j=t.j.replace(/:$/,""))}function di(t,e,n){t.i=n?Jt(e,!0):e}function fi(t,e){if(e){if(e=Number(e),isNaN(e)||0>e)throw Error("Bad port number "+e);t.m=e}else t.m=null}function Ho(t,e,n){e instanceof an?(t.h=e,Ef(t.h,t.g)):(n||(e=Kt(e,wf)),t.h=new an(e,t.g))}function L(t,e,n){t.h.set(e,n)}function ji(t){return L(t,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),t}function pf(t){return t instanceof Je?Ee(t):new Je(t,void 0)}function gf(t,e,n,i){var s=new Je(null,void 0);return t&&hi(s,t),e&&di(s,e),n&&fi(s,n),i&&(s.l=i),s}function Jt(t,e){return t?e?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):""}function Kt(t,e,n){return typeof t=="string"?(t=encodeURI(t).replace(e,mf),n&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null}function mf(t){return t=t.charCodeAt(0),"%"+(t>>4&15).toString(16)+(t&15).toString(16)}var Ko=/[#\/\?@]/g,yf=/[#\?:]/g,vf=/[#\?]/g,wf=/[#\?@]/g,_f=/#/g;function an(t,e){this.h=this.g=null,this.i=t||null,this.j=!!e}function Ve(t){t.g||(t.g=new Ot,t.h=0,t.i&&ff(t.i,function(e,n){t.add(decodeURIComponent(e.replace(/\+/g," ")),n)}))}y=an.prototype;y.add=function(t,e){Ve(this),this.i=null,t=Pt(this,t);var n=this.g.get(t);return n||this.g.set(t,n=[]),n.push(e),this.h+=1,this};function Fc(t,e){Ve(t),e=Pt(t,e),Xe(t.g.h,e)&&(t.i=null,t.h-=t.g.get(e).length,t=t.g,Xe(t.h,e)&&(delete t.h[e],t.i--,t.g.length>2*t.i&&Mr(t)))}function $c(t,e){return Ve(t),e=Pt(t,e),Xe(t.g.h,e)}y.forEach=function(t,e){Ve(this),this.g.forEach(function(n,i){dc(n,function(s){t.call(e,s,i,this)},this)},this)};y.T=function(){Ve(this);for(var t=this.g.R(),e=this.g.T(),n=[],i=0;i<e.length;i++)for(var s=t[i],r=0;r<s.length;r++)n.push(e[i]);return n};y.R=function(t){Ve(this);var e=[];if(typeof t=="string")$c(this,t)&&(e=Mo(e,this.g.get(Pt(this,t))));else{t=this.g.R();for(var n=0;n<t.length;n++)e=Mo(e,t[n])}return e};y.set=function(t,e){return Ve(this),this.i=null,t=Pt(this,t),$c(this,t)&&(this.h-=this.g.get(t).length),this.g.set(t,[e]),this.h+=1,this};y.get=function(t,e){return t?(t=this.R(t),0<t.length?String(t[0]):e):e};function Bc(t,e,n){Fc(t,e),0<n.length&&(t.i=null,t.g.set(Pt(t,e),_r(n)),t.h+=n.length)}y.toString=function(){if(this.i)return this.i;if(!this.g)return"";for(var t=[],e=this.g.T(),n=0;n<e.length;n++){var i=e[n],s=encodeURIComponent(String(i));i=this.R(i);for(var r=0;r<i.length;r++){var o=s;i[r]!==""&&(o+="="+encodeURIComponent(String(i[r]))),t.push(o)}}return this.i=t.join("&")};function Pt(t,e){return e=String(e),t.j&&(e=e.toLowerCase()),e}function Ef(t,e){e&&!t.j&&(Ve(t),t.i=null,t.g.forEach(function(n,i){var s=i.toLowerCase();i!=s&&(Fc(this,i),Bc(this,s,n))},t)),t.j=e}var If=class{constructor(t,e){this.h=t,this.g=e}};function qc(t){this.l=t||Tf,I.PerformanceNavigationTiming?(t=I.performance.getEntriesByType("navigation"),t=0<t.length&&(t[0].nextHopProtocol=="hq"||t[0].nextHopProtocol=="h2")):t=!!(I.g&&I.g.Ea&&I.g.Ea()&&I.g.Ea().Zb),this.j=t?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}var Tf=10;function jc(t){return t.h?!0:t.g?t.g.size>=t.j:!1}function Hc(t){return t.h?1:t.g?t.g.size:0}function zs(t,e){return t.h?t.h==e:t.g?t.g.has(e):!1}function xr(t,e){t.g?t.g.add(e):t.h=e}function Kc(t,e){t.h&&t.h==e?t.h=null:t.g&&t.g.has(e)&&t.g.delete(e)}qc.prototype.cancel=function(){if(this.i=Gc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const t of this.g.values())t.cancel();this.g.clear()}};function Gc(t){if(t.h!=null)return t.i.concat(t.h.D);if(t.g!=null&&t.g.size!==0){let e=t.i;for(const n of t.g.values())e=e.concat(n.D);return e}return _r(t.i)}function Ur(){}Ur.prototype.stringify=function(t){return I.JSON.stringify(t,void 0)};Ur.prototype.parse=function(t){return I.JSON.parse(t,void 0)};function Sf(){this.g=new Ur}function bf(t,e,n){const i=n||"";try{Lr(t,function(s,r){let o=s;_n(s)&&(o=kr(s)),e.push(i+r+"="+encodeURIComponent(o))})}catch(s){throw e.push(i+"type="+encodeURIComponent("_badmap")),s}}function Af(t,e){const n=new Vi;if(I.Image){const i=new Image;i.onload=qn(Hn,n,i,"TestLoadImage: loaded",!0,e),i.onerror=qn(Hn,n,i,"TestLoadImage: error",!1,e),i.onabort=qn(Hn,n,i,"TestLoadImage: abort",!1,e),i.ontimeout=qn(Hn,n,i,"TestLoadImage: timeout",!1,e),I.setTimeout(function(){i.ontimeout&&i.ontimeout()},1e4),i.src=t}else e(!1)}function Hn(t,e,n,i,s){try{e.onload=null,e.onerror=null,e.onabort=null,e.ontimeout=null,s(i)}catch{}}function An(t){this.l=t.$b||null,this.j=t.ib||!1}J(An,Dr);An.prototype.g=function(){return new Hi(this.l,this.j)};An.prototype.i=function(t){return function(){return t}}({});function Hi(t,e){q.call(this),this.D=t,this.u=e,this.m=void 0,this.readyState=Vr,this.status=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.v=new Headers,this.h=null,this.C="GET",this.B="",this.g=!1,this.A=this.j=this.l=null}J(Hi,q);var Vr=0;y=Hi.prototype;y.open=function(t,e){if(this.readyState!=Vr)throw this.abort(),Error("Error reopening a connection");this.C=t,this.B=e,this.readyState=1,cn(this)};y.send=function(t){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const e={headers:this.v,method:this.C,credentials:this.m,cache:void 0};t&&(e.body=t),(this.D||I).fetch(new Request(this.B,e)).then(this.Va.bind(this),this.ha.bind(this))};y.abort=function(){this.response=this.responseText="",this.v=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted."),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,kn(this)),this.readyState=Vr};y.Va=function(t){if(this.g&&(this.l=t,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=t.headers,this.readyState=2,cn(this)),this.g&&(this.readyState=3,cn(this),this.g)))if(this.responseType==="arraybuffer")t.arrayBuffer().then(this.Ta.bind(this),this.ha.bind(this));else if(typeof I.ReadableStream!="undefined"&&"body"in t){if(this.j=t.body.getReader(),this.u){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.A=new TextDecoder;zc(this)}else t.text().then(this.Ua.bind(this),this.ha.bind(this))};function zc(t){t.j.read().then(t.Sa.bind(t)).catch(t.ha.bind(t))}y.Sa=function(t){if(this.g){if(this.u&&t.value)this.response.push(t.value);else if(!this.u){var e=t.value?t.value:new Uint8Array(0);(e=this.A.decode(e,{stream:!t.done}))&&(this.response=this.responseText+=e)}t.done?kn(this):cn(this),this.readyState==3&&zc(this)}};y.Ua=function(t){this.g&&(this.response=this.responseText=t,kn(this))};y.Ta=function(t){this.g&&(this.response=t,kn(this))};y.ha=function(){this.g&&kn(this)};function kn(t){t.readyState=4,t.l=null,t.j=null,t.A=null,cn(t)}y.setRequestHeader=function(t,e){this.v.append(t,e)};y.getResponseHeader=function(t){return this.h&&this.h.get(t.toLowerCase())||""};y.getAllResponseHeaders=function(){if(!this.h)return"";const t=[],e=this.h.entries();for(var n=e.next();!n.done;)n=n.value,t.push(n[0]+": "+n[1]),n=e.next();return t.join(`\r
`)};function cn(t){t.onreadystatechange&&t.onreadystatechange.call(t)}Object.defineProperty(Hi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(t){this.m=t?"include":"same-origin"}});var kf=I.JSON.parse;function U(t){q.call(this),this.headers=new Ot,this.u=t||null,this.h=!1,this.C=this.g=null,this.H="",this.m=0,this.j="",this.l=this.F=this.v=this.D=!1,this.B=0,this.A=null,this.J=Wc,this.K=this.L=!1}J(U,q);var Wc="",Cf=/^https?$/i,Nf=["POST","PUT"];y=U.prototype;y.ea=function(t,e,n,i){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.H+"; newUri="+t);e=e?e.toUpperCase():"GET",this.H=t,this.j="",this.m=0,this.D=!1,this.h=!0,this.g=this.u?this.u.g():js.g(),this.C=this.u?jo(this.u):jo(js),this.g.onreadystatechange=G(this.Fa,this);try{this.F=!0,this.g.open(e,String(t),!0),this.F=!1}catch(r){Go(this,r);return}t=n||"";const s=new Ot(this.headers);i&&Lr(i,function(r,o){s.set(o,r)}),i=Fd(s.T()),n=I.FormData&&t instanceof I.FormData,!(0<=hc(Nf,e))||i||n||s.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),s.forEach(function(r,o){this.g.setRequestHeader(o,r)},this),this.J&&(this.g.responseType=this.J),"withCredentials"in this.g&&this.g.withCredentials!==this.L&&(this.g.withCredentials=this.L);try{Yc(this),0<this.B&&((this.K=Rf(this.g))?(this.g.timeout=this.B,this.g.ontimeout=G(this.pa,this)):this.A=Rr(this.pa,this.B,this)),this.v=!0,this.g.send(t),this.v=!1}catch(r){Go(this,r)}};function Rf(t){return wt&&Hd()&&typeof t.timeout=="number"&&t.ontimeout!==void 0}function Df(t){return t.toLowerCase()=="content-type"}y.pa=function(){typeof wr!="undefined"&&this.g&&(this.j="Timed out after "+this.B+"ms, aborting",this.m=8,z(this,"timeout"),this.abort(8))};function Go(t,e){t.h=!1,t.g&&(t.l=!0,t.g.abort(),t.l=!1),t.j=e,t.m=5,Xc(t),Ki(t)}function Xc(t){t.D||(t.D=!0,z(t,"complete"),z(t,"error"))}y.abort=function(t){this.g&&this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1,this.m=t||7,z(this,"complete"),z(this,"abort"),Ki(this))};y.M=function(){this.g&&(this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1),Ki(this,!0)),U.Z.M.call(this)};y.Fa=function(){this.s||(this.F||this.v||this.l?Jc(this):this.cb())};y.cb=function(){Jc(this)};function Jc(t){if(t.h&&typeof wr!="undefined"&&(!t.C[1]||me(t)!=4||t.ba()!=2)){if(t.v&&me(t)==4)Rr(t.Fa,0,t);else if(z(t,"readystatechange"),me(t)==4){t.h=!1;try{const a=t.ba();e:switch(a){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var e=!0;break e;default:e=!1}var n;if(!(n=e)){var i;if(i=a===0){var s=String(t.H).match(Vc)[1]||null;if(!s&&I.self&&I.self.location){var r=I.self.location.protocol;s=r.substr(0,r.length-1)}i=!Cf.test(s?s.toLowerCase():"")}n=i}if(n)z(t,"complete"),z(t,"success");else{t.m=6;try{var o=2<me(t)?t.g.statusText:""}catch{o=""}t.j=o+" ["+t.ba()+"]",Xc(t)}}finally{Ki(t)}}}}function Ki(t,e){if(t.g){Yc(t);const n=t.g,i=t.C[0]?ai:null;t.g=null,t.C=null,e||z(t,"ready");try{n.onreadystatechange=i}catch{}}}function Yc(t){t.g&&t.K&&(t.g.ontimeout=null),t.A&&(I.clearTimeout(t.A),t.A=null)}function me(t){return t.g?t.g.readyState:0}y.ba=function(){try{return 2<me(this)?this.g.status:-1}catch{return-1}};y.ga=function(){try{return this.g?this.g.responseText:""}catch{return""}};y.Qa=function(t){if(this.g){var e=this.g.responseText;return t&&e.indexOf(t)==0&&(e=e.substring(t.length)),kf(e)}};function zo(t){try{if(!t.g)return null;if("response"in t.g)return t.g.response;switch(t.J){case Wc:case"text":return t.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in t.g)return t.g.mozResponseArrayBuffer}return null}catch{return null}}y.Da=function(){return this.m};y.La=function(){return typeof this.j=="string"?this.j:String(this.j)};function Of(t){let e="";return Er(t,function(n,i){e+=i,e+=":",e+=n,e+=`\r
`}),e}function Fr(t,e,n){e:{for(i in n){var i=!1;break e}i=!0}i||(n=Of(n),typeof t=="string"?n!=null&&encodeURIComponent(String(n)):L(t,e,n))}function jt(t,e,n){return n&&n.internalChannelParams&&n.internalChannelParams[t]||e}function Qc(t){this.za=0,this.l=[],this.h=new Vi,this.la=this.oa=this.F=this.W=this.g=this.sa=this.D=this.aa=this.o=this.P=this.s=null,this.Za=this.V=0,this.Xa=jt("failFast",!1,t),this.N=this.v=this.u=this.m=this.j=null,this.X=!0,this.I=this.ta=this.U=-1,this.Y=this.A=this.C=0,this.Pa=jt("baseRetryDelayMs",5e3,t),this.$a=jt("retryDelaySeedMs",1e4,t),this.Ya=jt("forwardChannelMaxRetries",2,t),this.ra=jt("forwardChannelRequestTimeoutMs",2e4,t),this.qa=t&&t.xmlHttpFactory||void 0,this.Ba=t&&t.Yb||!1,this.K=void 0,this.H=t&&t.supportsCrossDomainXhr||!1,this.J="",this.i=new qc(t&&t.concurrentRequestLimit),this.Ca=new Sf,this.ja=t&&t.fastHandshake||!1,this.Ra=t&&t.Wb||!1,t&&t.Aa&&this.h.Aa(),t&&t.forceLongPolling&&(this.X=!1),this.$=!this.ja&&this.X&&t&&t.detectBufferingProxy||!1,this.ka=void 0,this.O=0,this.L=!1,this.B=null,this.Wa=!t||t.Xb!==!1}y=Qc.prototype;y.ma=8;y.G=1;function $r(t){if(Zc(t),t.G==3){var e=t.V++,n=Ee(t.F);L(n,"SID",t.J),L(n,"RID",e),L(n,"TYPE","terminate"),Cn(t,n),e=new Sn(t,t.h,e,void 0),e.K=2,e.v=ji(Ee(n)),n=!1,I.navigator&&I.navigator.sendBeacon&&(n=I.navigator.sendBeacon(e.v.toString(),"")),!n&&I.Image&&(new Image().src=e.v,n=!0),n||(e.g=au(e.l,null),e.g.ea(e.v)),e.F=Date.now(),bn(e)}ru(t)}y.hb=function(t){try{this.h.info("Origin Trials invoked: "+t)}catch{}};function Gi(t){t.g&&(qr(t),t.g.cancel(),t.g=null)}function Zc(t){Gi(t),t.u&&(I.clearTimeout(t.u),t.u=null),pi(t),t.i.cancel(),t.m&&(typeof t.m=="number"&&I.clearTimeout(t.m),t.m=null)}function Ss(t,e){t.l.push(new If(t.Za++,e)),t.G==3&&zi(t)}function zi(t){jc(t.i)||t.m||(t.m=!0,Cr(t.Ha,t),t.C=0)}function Pf(t,e){return Hc(t.i)>=t.i.j-(t.m?1:0)?!1:t.m?(t.l=e.D.concat(t.l),!0):t.G==1||t.G==2||t.C>=(t.Xa?0:t.Ya)?!1:(t.m=In(G(t.Ha,t,e),su(t,t.C)),t.C++,!0)}y.Ha=function(t){if(this.m)if(this.m=null,this.G==1){if(!t){this.V=Math.floor(1e5*Math.random()),t=this.V++;const s=new Sn(this,this.h,t,void 0);let r=this.s;if(this.P&&(r?(r=fc(r),pc(r,this.P)):r=this.P),this.o===null&&(s.H=r),this.ja)e:{for(var e=0,n=0;n<this.l.length;n++){t:{var i=this.l[n];if("__data__"in i.g&&(i=i.g.__data__,typeof i=="string")){i=i.length;break t}i=void 0}if(i===void 0)break;if(e+=i,4096<e){e=n;break e}if(e===4096||n===this.l.length-1){e=n+1;break e}}e=1e3}else e=1e3;e=eu(this,s,e),n=Ee(this.F),L(n,"RID",t),L(n,"CVER",22),this.D&&L(n,"X-HTTP-Session-Id",this.D),Cn(this,n),this.o&&r&&Fr(n,this.o,r),xr(this.i,s),this.Ra&&L(n,"TYPE","init"),this.ja?(L(n,"$req",e),L(n,"SID","null"),s.$=!0,Ks(s,n,null)):Ks(s,n,e),this.G=2}}else this.G==3&&(t?Wo(this,t):this.l.length==0||jc(this.i)||Wo(this))};function Wo(t,e){var n;e?n=e.m:n=t.V++;const i=Ee(t.F);L(i,"SID",t.J),L(i,"RID",n),L(i,"AID",t.U),Cn(t,i),t.o&&t.s&&Fr(i,t.o,t.s),n=new Sn(t,t.h,n,t.C+1),t.o===null&&(n.H=t.s),e&&(t.l=e.D.concat(t.l)),e=eu(t,n,1e3),n.setTimeout(Math.round(.5*t.ra)+Math.round(.5*t.ra*Math.random())),xr(t.i,n),Ks(n,i,e)}function Cn(t,e){t.j&&Lr({},function(n,i){L(e,i,n)})}function eu(t,e,n){n=Math.min(t.l.length,n);var i=t.j?G(t.j.Oa,t.j,t):null;e:{var s=t.l;let r=-1;for(;;){const o=["count="+n];r==-1?0<n?(r=s[0].h,o.push("ofs="+r)):r=0:o.push("ofs="+r);let a=!0;for(let c=0;c<n;c++){let u=s[c].h;const l=s[c].g;if(u-=r,0>u)r=Math.max(0,s[c].h-100),a=!1;else try{bf(l,o,"req"+u+"_")}catch{i&&i(l)}}if(a){i=o.join("&");break e}}}return t=t.l.splice(0,n),e.D=t,i}function tu(t){t.g||t.u||(t.Y=1,Cr(t.Ga,t),t.A=0)}function Br(t){return t.g||t.u||3<=t.A?!1:(t.Y++,t.u=In(G(t.Ga,t),su(t,t.A)),t.A++,!0)}y.Ga=function(){if(this.u=null,nu(this),this.$&&!(this.L||this.g==null||0>=this.O)){var t=2*this.O;this.h.info("BP detection timer enabled: "+t),this.B=In(G(this.bb,this),t)}};y.bb=function(){this.B&&(this.B=null,this.h.info("BP detection timeout reached."),this.h.info("Buffering proxy detected and switch to long-polling!"),this.N=!1,this.L=!0,ie(10),Gi(this),nu(this))};function qr(t){t.B!=null&&(I.clearTimeout(t.B),t.B=null)}function nu(t){t.g=new Sn(t,t.h,"rpc",t.Y),t.o===null&&(t.g.H=t.s),t.g.O=0;var e=Ee(t.oa);L(e,"RID","rpc"),L(e,"SID",t.J),L(e,"CI",t.N?"0":"1"),L(e,"AID",t.U),Cn(t,e),L(e,"TYPE","xmlhttp"),t.o&&t.s&&Fr(e,t.o,t.s),t.K&&t.g.setTimeout(t.K);var n=t.g;t=t.la,n.K=1,n.v=ji(Ee(e)),n.s=null,n.U=!0,Lc(n,t)}y.ab=function(){this.v!=null&&(this.v=null,Gi(this),Br(this),ie(19))};function pi(t){t.v!=null&&(I.clearTimeout(t.v),t.v=null)}function iu(t,e){var n=null;if(t.g==e){pi(t),qr(t),t.g=null;var i=2}else if(zs(t.i,e))n=e.D,Kc(t.i,e),i=1;else return;if(t.I=e.N,t.G!=0){if(e.i)if(i==1){n=e.s?e.s.length:0,e=Date.now()-e.F;var s=t.C;i=Fi(),z(i,new Rc(i,n,e,s)),zi(t)}else tu(t);else if(s=e.o,s==3||s==0&&0<t.I||!(i==1&&Pf(t,e)||i==2&&Br(t)))switch(n&&0<n.length&&(e=t.i,e.i=e.i.concat(n)),s){case 1:je(t,5);break;case 4:je(t,10);break;case 3:je(t,6);break;default:je(t,2)}}}function su(t,e){let n=t.Pa+Math.floor(Math.random()*t.$a);return t.j||(n*=2),n*e}function je(t,e){if(t.h.info("Error code "+e),e==2){var n=null;t.j&&(n=null);var i=G(t.jb,t);n||(n=new Je("//www.google.com/images/cleardot.gif"),I.location&&I.location.protocol=="http"||hi(n,"https"),ji(n)),Af(n.toString(),i)}else ie(2);t.G=0,t.j&&t.j.va(e),ru(t),Zc(t)}y.jb=function(t){t?(this.h.info("Successfully pinged google.com"),ie(2)):(this.h.info("Failed to ping google.com"),ie(1))};function ru(t){t.G=0,t.I=-1,t.j&&((Gc(t.i).length!=0||t.l.length!=0)&&(t.i.i.length=0,_r(t.l),t.l.length=0),t.j.ua())}function ou(t,e,n){let i=pf(n);if(i.i!="")e&&di(i,e+"."+i.i),fi(i,i.m);else{const s=I.location;i=gf(s.protocol,e?e+"."+s.hostname:s.hostname,+s.port,n)}return t.aa&&Er(t.aa,function(s,r){L(i,r,s)}),e=t.D,n=t.sa,e&&n&&L(i,e,n),L(i,"VER",t.ma),Cn(t,i),i}function au(t,e,n){if(e&&!t.H)throw Error("Can't create secondary domain capable XhrIo object.");return e=n&&t.Ba&&!t.qa?new U(new An({ib:!0})):new U(t.qa),e.L=t.H,e}function cu(){}y=cu.prototype;y.xa=function(){};y.wa=function(){};y.va=function(){};y.ua=function(){};y.Oa=function(){};function gi(){if(wt&&!(10<=Number(Kd)))throw Error("Environmental error: no available transport.")}gi.prototype.g=function(t,e){return new le(t,e)};function le(t,e){q.call(this),this.g=new Qc(e),this.l=t,this.h=e&&e.messageUrlParams||null,t=e&&e.messageHeaders||null,e&&e.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.g.s=t,t=e&&e.initMessageHeaders||null,e&&e.messageContentType&&(t?t["X-WebChannel-Content-Type"]=e.messageContentType:t={"X-WebChannel-Content-Type":e.messageContentType}),e&&e.ya&&(t?t["X-WebChannel-Client-Profile"]=e.ya:t={"X-WebChannel-Client-Profile":e.ya}),this.g.P=t,(t=e&&e.httpHeadersOverwriteParam)&&!ci(t)&&(this.g.o=t),this.A=e&&e.supportsCrossDomainXhr||!1,this.v=e&&e.sendRawJson||!1,(e=e&&e.httpSessionIdParam)&&!ci(e)&&(this.g.D=e,t=this.h,t!==null&&e in t&&(t=this.h,e in t&&delete t[e])),this.j=new Lt(this)}J(le,q);le.prototype.m=function(){this.g.j=this.j,this.A&&(this.g.H=!0);var t=this.g,e=this.l,n=this.h||void 0;t.Wa&&(t.h.info("Origin Trials enabled."),Cr(G(t.hb,t,e))),ie(0),t.W=e,t.aa=n||{},t.N=t.X,t.F=ou(t,null,t.W),zi(t)};le.prototype.close=function(){$r(this.g)};le.prototype.u=function(t){if(typeof t=="string"){var e={};e.__data__=t,Ss(this.g,e)}else this.v?(e={},e.__data__=kr(t),Ss(this.g,e)):Ss(this.g,t)};le.prototype.M=function(){this.g.j=null,delete this.j,$r(this.g),delete this.g,le.Z.M.call(this)};function uu(t){Or.call(this);var e=t.__sm__;if(e){e:{for(const n in e){t=n;break e}t=void 0}(this.i=t)&&(t=this.i,e=e!==null&&t in e?e[t]:void 0),this.data=e}else this.data=t}J(uu,Or);function lu(){Pr.call(this),this.status=1}J(lu,Pr);function Lt(t){this.g=t}J(Lt,cu);Lt.prototype.xa=function(){z(this.g,"a")};Lt.prototype.wa=function(t){z(this.g,new uu(t))};Lt.prototype.va=function(t){z(this.g,new lu(t))};Lt.prototype.ua=function(){z(this.g,"b")};gi.prototype.createWebChannel=gi.prototype.g;le.prototype.send=le.prototype.u;le.prototype.open=le.prototype.m;le.prototype.close=le.prototype.close;$i.NO_ERROR=0;$i.TIMEOUT=8;$i.HTTP_ERROR=6;Dc.COMPLETE="complete";Oc.EventType=Tn;Tn.OPEN="a";Tn.CLOSE="b";Tn.ERROR="c";Tn.MESSAGE="d";q.prototype.listen=q.prototype.N;U.prototype.listenOnce=U.prototype.O;U.prototype.getLastError=U.prototype.La;U.prototype.getLastErrorCode=U.prototype.Da;U.prototype.getStatus=U.prototype.ba;U.prototype.getResponseJson=U.prototype.Qa;U.prototype.getResponseText=U.prototype.ga;U.prototype.send=U.prototype.ea;var Lf=function(){return new gi},Mf=function(){return Fi()},bs=$i,xf=Dc,Uf=st,Xo={rb:0,ub:1,vb:2,Ob:3,Tb:4,Qb:5,Rb:6,Pb:7,Nb:8,Sb:9,PROXY:10,NOPROXY:11,Lb:12,Hb:13,Ib:14,Gb:15,Jb:16,Kb:17,nb:18,mb:19,ob:20},Vf=An,Kn=Oc,Ff=U;const Jo="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}re.UNAUTHENTICATED=new re(null),re.GOOGLE_CREDENTIALS=new re("google-credentials-uid"),re.FIRST_PARTY=new re("first-party-uid"),re.MOCK_USER=new re("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Mt="9.6.7";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye=new dr("@firebase/firestore");function Yo(){return Ye.logLevel}function _(t,...e){if(Ye.logLevel<=N.DEBUG){const n=e.map(jr);Ye.debug(`Firestore (${Mt}): ${t}`,...n)}}function Pe(t,...e){if(Ye.logLevel<=N.ERROR){const n=e.map(jr);Ye.error(`Firestore (${Mt}): ${t}`,...n)}}function Qo(t,...e){if(Ye.logLevel<=N.WARN){const n=e.map(jr);Ye.warn(`Firestore (${Mt}): ${t}`,...n)}}function jr(t){if(typeof t=="string")return t;try{return e=t,JSON.stringify(e)}catch{return t}/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T(t="Unexpected state"){const e=`FIRESTORE (${Mt}) INTERNAL ASSERTION FAILED: `+t;throw Pe(e),new Error(e)}function D(t,e){t||T()}function S(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class v extends xe{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $f{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Bf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(re.UNAUTHENTICATED))}shutdown(){}}class qf{constructor(e){this.t=e,this.currentUser=re.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){let i=this.i;const s=c=>this.i!==i?(i=this.i,n(c)):Promise.resolve();let r=new we;this.o=()=>{this.i++,this.currentUser=this.u(),r.resolve(),r=new we,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const c=r;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},a=c=>{_("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.auth.addAuthTokenListener(this.o),o()};this.t.onInit(c=>a(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?a(c):(_("FirebaseAuthCredentialsProvider","Auth not yet detected"),r.resolve(),r=new we)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(i=>this.i!==e?(_("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(D(typeof i.accessToken=="string"),new $f(i.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const e=this.auth&&this.auth.getUid();return D(e===null||typeof e=="string"),new re(e)}}class jf{constructor(e,n,i){this.type="FirstParty",this.user=re.FIRST_PARTY,this.headers=new Map,this.headers.set("X-Goog-AuthUser",n);const s=e.auth.getAuthHeaderValueForFirstParty([]);s&&this.headers.set("Authorization",s),i&&this.headers.set("X-Goog-Iam-Authorization-Token",i)}}class Hf{constructor(e,n,i){this.h=e,this.l=n,this.m=i}getToken(){return Promise.resolve(new jf(this.h,this.l,this.m))}start(e,n){e.enqueueRetryable(()=>n(re.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Kf{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Gf{constructor(e){this.g=e,this.forceRefresh=!1,this.appCheck=null,this.p=null}start(e,n){const i=r=>{r.error!=null&&_("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);const o=r.token!==this.p;return this.p=r.token,_("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(r.token):Promise.resolve()};this.o=r=>{e.enqueueRetryable(()=>i(r))};const s=r=>{_("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=r,this.appCheck.addTokenListener(this.o)};this.g.onInit(r=>s(r)),setTimeout(()=>{if(!this.appCheck){const r=this.g.getImmediate({optional:!0});r?s(r):_("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(D(typeof n.token=="string"),this.p=n.token,new Kf(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=i=>this.I(i),this.T=i=>n.writeSequenceNumber(i))}I(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.T&&this.T(e),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zf(t){const e=typeof self!="undefined"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let i=0;i<t;i++)n[i]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Hr.A=-1;class hu{static R(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let i="";for(;i.length<20;){const s=zf(40);for(let r=0;r<s.length;++r)i.length<20&&s[r]<n&&(i+=e.charAt(s[r]%e.length))}return i}}function R(t,e){return t<e?-1:t>e?1:0}function _t(t,e,n){return t.length===e.length&&t.every((i,s)=>n(i,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new v(f.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new v(f.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new v(f.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new v(f.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return ce.fromMillis(Date.now())}static fromDate(e){return ce.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),i=Math.floor(1e6*(e-1e3*n));return new ce(n,i)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?R(this.nanoseconds,e.nanoseconds):R(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e){this.timestamp=e}static fromTimestamp(e){return new A(e)}static min(){return new A(new ce(0,0))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zo(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function rt(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function du(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un{constructor(e,n,i){n===void 0?n=0:n>e.length&&T(),i===void 0?i=e.length-n:i>e.length-n&&T(),this.segments=e,this.offset=n,this.len=i}get length(){return this.len}isEqual(e){return un.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof un?e.forEach(i=>{n.push(i)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,i=this.limit();n<i;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const i=Math.min(e.length,n.length);for(let s=0;s<i;s++){const r=e.get(s),o=n.get(s);if(r<o)return-1;if(r>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class O extends un{construct(e,n,i){return new O(e,n,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}static fromString(...e){const n=[];for(const i of e){if(i.indexOf("//")>=0)throw new v(f.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);n.push(...i.split("/").filter(s=>s.length>0))}return new O(n)}static emptyPath(){return new O([])}}const Wf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class oe extends un{construct(e,n,i){return new oe(e,n,i)}static isValidIdentifier(e){return Wf.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),oe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new oe(["__name__"])}static fromServerFormat(e){const n=[];let i="",s=0;const r=()=>{if(i.length===0)throw new v(f.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(i),i=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new v(f.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new v(f.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=c,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(i+=a,s++):(r(),s++)}if(r(),o)throw new v(f.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new oe(n)}static emptyPath(){return new oe([])}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln{constructor(e){this.fields=e,e.sort(oe.comparator)}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return _t(this.fields,e.fields,(n,i)=>n.isEqual(i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e){this.binaryString=e}static fromBase64String(e){const n=atob(e);return new X(n)}static fromUint8Array(e){const n=function(i){let s="";for(let r=0;r<i.length;++r)s+=String.fromCharCode(i[r]);return s}(e);return new X(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const n=new Uint8Array(e.length);for(let i=0;i<e.length;i++)n[i]=e.charCodeAt(i);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return R(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}X.EMPTY_BYTE_STRING=new X("");const Xf=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Le(t){if(D(!!t),typeof t=="string"){let e=0;const n=Xf.exec(t);if(D(!!n),n[1]){let s=n[1];s=(s+"000000000").substr(0,9),e=Number(s)}const i=new Date(t);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:x(t.seconds),nanos:x(t.nanos)}}function x(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Et(t){return typeof t=="string"?X.fromBase64String(t):X.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fu(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function pu(t){const e=t.mapValue.fields.__previous_value__;return fu(e)?pu(e):e}function hn(t){const e=Le(t.mapValue.fields.__local_write_time__.timestampValue);return new ce(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(e,n,i,s,r,o,a,c){this.databaseId=e,this.appId=n,this.persistenceKey=i,this.host=s,this.ssl=r,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.useFetchStreams=c}}class It{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new It("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof It&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xt(t){return t==null}function mi(t){return t===0&&1/t==-1/0}function Yf(t){return typeof t=="number"&&Number.isInteger(t)&&!mi(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E{constructor(e){this.path=e}static fromPath(e){return new E(O.fromString(e))}static fromName(e){return new E(O.fromString(e).popFirst(5))}static empty(){return new E(O.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&O.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return O.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new E(new O(e.slice()))}}function Qe(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?fu(t)?4:10:T()}function fe(t,e){if(t===e)return!0;const n=Qe(t);if(n!==Qe(e))return!1;switch(n){case 0:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return hn(t).isEqual(hn(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const r=Le(i.timestampValue),o=Le(s.timestampValue);return r.seconds===o.seconds&&r.nanos===o.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Et(i.bytesValue).isEqual(Et(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return x(i.geoPointValue.latitude)===x(s.geoPointValue.latitude)&&x(i.geoPointValue.longitude)===x(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return x(i.integerValue)===x(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const r=x(i.doubleValue),o=x(s.doubleValue);return r===o?mi(r)===mi(o):isNaN(r)&&isNaN(o)}return!1}(t,e);case 9:return _t(t.arrayValue.values||[],e.arrayValue.values||[],fe);case 10:return function(i,s){const r=i.mapValue.fields||{},o=s.mapValue.fields||{};if(Zo(r)!==Zo(o))return!1;for(const a in r)if(r.hasOwnProperty(a)&&(o[a]===void 0||!fe(r[a],o[a])))return!1;return!0}(t,e);default:return T()}}function dn(t,e){return(t.values||[]).find(n=>fe(n,e))!==void 0}function Tt(t,e){if(t===e)return 0;const n=Qe(t),i=Qe(e);if(n!==i)return R(n,i);switch(n){case 0:return 0;case 1:return R(t.booleanValue,e.booleanValue);case 2:return function(s,r){const o=x(s.integerValue||s.doubleValue),a=x(r.integerValue||r.doubleValue);return o<a?-1:o>a?1:o===a?0:isNaN(o)?isNaN(a)?0:-1:1}(t,e);case 3:return ea(t.timestampValue,e.timestampValue);case 4:return ea(hn(t),hn(e));case 5:return R(t.stringValue,e.stringValue);case 6:return function(s,r){const o=Et(s),a=Et(r);return o.compareTo(a)}(t.bytesValue,e.bytesValue);case 7:return function(s,r){const o=s.split("/"),a=r.split("/");for(let c=0;c<o.length&&c<a.length;c++){const u=R(o[c],a[c]);if(u!==0)return u}return R(o.length,a.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,r){const o=R(x(s.latitude),x(r.latitude));return o!==0?o:R(x(s.longitude),x(r.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return function(s,r){const o=s.values||[],a=r.values||[];for(let c=0;c<o.length&&c<a.length;++c){const u=Tt(o[c],a[c]);if(u)return u}return R(o.length,a.length)}(t.arrayValue,e.arrayValue);case 10:return function(s,r){const o=s.fields||{},a=Object.keys(o),c=r.fields||{},u=Object.keys(c);a.sort(),u.sort();for(let l=0;l<a.length&&l<u.length;++l){const h=R(a[l],u[l]);if(h!==0)return h;const d=Tt(o[a[l]],c[u[l]]);if(d!==0)return d}return R(a.length,u.length)}(t.mapValue,e.mapValue);default:throw T()}}function ea(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return R(t,e);const n=Le(t),i=Le(e),s=R(n.seconds,i.seconds);return s!==0?s:R(n.nanos,i.nanos)}function pt(t){return Ws(t)}function Ws(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(i){const s=Le(i);return`time(${s.seconds},${s.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?Et(t.bytesValue).toBase64():"referenceValue"in t?(n=t.referenceValue,E.fromName(n).toString()):"geoPointValue"in t?`geo(${(e=t.geoPointValue).latitude},${e.longitude})`:"arrayValue"in t?function(i){let s="[",r=!0;for(const o of i.values||[])r?r=!1:s+=",",s+=Ws(o);return s+"]"}(t.arrayValue):"mapValue"in t?function(i){const s=Object.keys(i.fields||{}).sort();let r="{",o=!0;for(const a of s)o?o=!1:r+=",",r+=`${a}:${Ws(i.fields[a])}`;return r+"}"}(t.mapValue):T();var e,n}function ta(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function Xs(t){return!!t&&"integerValue"in t}function Kr(t){return!!t&&"arrayValue"in t}function na(t){return!!t&&"nullValue"in t}function ia(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Jn(t){return!!t&&"mapValue"in t}function Yt(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return rt(t.mapValue.fields,(n,i)=>e.mapValue.fields[n]=Yt(i)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Yt(t.arrayValue.values[n]);return e}return Object.assign({},t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(e){this.value=e}static empty(){return new ae({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let i=0;i<e.length-1;++i)if(n=(n.mapValue.fields||{})[e.get(i)],!Jn(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Yt(n)}setAll(e){let n=oe.emptyPath(),i={},s=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const c=this.getFieldsMap(n);this.applyChanges(c,i,s),i={},s=[],n=a.popLast()}o?i[a.lastSegment()]=Yt(o):s.push(a.lastSegment())});const r=this.getFieldsMap(n);this.applyChanges(r,i,s)}delete(e){const n=this.field(e.popLast());Jn(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return fe(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let i=0;i<e.length;++i){let s=n.mapValue.fields[e.get(i)];Jn(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},n.mapValue.fields[e.get(i)]=s),n=s}return n.mapValue.fields}applyChanges(e,n,i){rt(n,(s,r)=>e[s]=r);for(const s of i)delete e[s]}clone(){return new ae(Yt(this.value))}}function gu(t){const e=[];return rt(t.fields,(n,i)=>{const s=new oe([n]);if(Jn(i)){const r=gu(i.mapValue).fields;if(r.length===0)e.push(s);else for(const o of r)e.push(s.child(o))}else e.push(s)}),new ln(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e,n,i,s,r,o){this.key=e,this.documentType=n,this.version=i,this.readTime=s,this.data=r,this.documentState=o}static newInvalidDocument(e){return new Y(e,0,A.min(),A.min(),ae.empty(),0)}static newFoundDocument(e,n,i){return new Y(e,1,n,A.min(),i,0)}static newNoDocument(e,n){return new Y(e,2,n,A.min(),ae.empty(),0)}static newUnknownDocument(e,n){return new Y(e,3,n,A.min(),ae.empty(),2)}convertToFoundDocument(e,n){return this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ae.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ae.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Y&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Y(this.key,this.documentType,this.version,this.readTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qf{constructor(e,n=null,i=[],s=[],r=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=i,this.filters=s,this.limit=r,this.startAt=o,this.endAt=a,this.P=null}}function sa(t,e=null,n=[],i=[],s=null,r=null,o=null){return new Qf(t,e,n,i,s,r,o)}function Gr(t){const e=S(t);if(e.P===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(i=>{return(s=i).field.canonicalString()+s.op.toString()+pt(s.value);var s}).join(","),n+="|ob:",n+=e.orderBy.map(i=>function(s){return s.field.canonicalString()+s.dir}(i)).join(","),xt(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(i=>pt(i)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(i=>pt(i)).join(",")),e.P=n}return e.P}function Zf(t){let e=t.path.canonicalString();return t.collectionGroup!==null&&(e+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(e+=`, filters: [${t.filters.map(n=>{return`${(i=n).field.canonicalString()} ${i.op} ${pt(i.value)}`;var i}).join(", ")}]`),xt(t.limit)||(e+=", limit: "+t.limit),t.orderBy.length>0&&(e+=`, orderBy: [${t.orderBy.map(n=>function(i){return`${i.field.canonicalString()} (${i.dir})`}(n)).join(", ")}]`),t.startAt&&(e+=", startAt: ",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(n=>pt(n)).join(",")),t.endAt&&(e+=", endAt: ",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(n=>pt(n)).join(",")),`Target(${e})`}function zr(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let s=0;s<t.orderBy.length;s++)if(!ap(t.orderBy[s],e.orderBy[s]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let s=0;s<t.filters.length;s++)if(n=t.filters[s],i=e.filters[s],n.op!==i.op||!n.field.isEqual(i.field)||!fe(n.value,i.value))return!1;var n,i;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!oa(t.startAt,e.startAt)&&oa(t.endAt,e.endAt)}function Js(t){return E.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}class se extends class{}{constructor(e,n,i){super(),this.field=e,this.op=n,this.value=i}static create(e,n,i){return e.isKeyField()?n==="in"||n==="not-in"?this.v(e,n,i):new ep(e,n,i):n==="array-contains"?new ip(e,i):n==="in"?new sp(e,i):n==="not-in"?new rp(e,i):n==="array-contains-any"?new op(e,i):new se(e,n,i)}static v(e,n,i){return n==="in"?new tp(e,i):new np(e,i)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.V(Tt(n,this.value)):n!==null&&Qe(this.value)===Qe(n)&&this.V(Tt(n,this.value))}V(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return T()}}S(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}}class ep extends se{constructor(e,n,i){super(e,n,i),this.key=E.fromName(i.referenceValue)}matches(e){const n=E.comparator(e.key,this.key);return this.V(n)}}class tp extends se{constructor(e,n){super(e,"in",n),this.keys=mu("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class np extends se{constructor(e,n){super(e,"not-in",n),this.keys=mu("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function mu(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(i=>E.fromName(i.referenceValue))}class ip extends se{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Kr(n)&&dn(n.arrayValue,this.value)}}class sp extends se{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&dn(this.value.arrayValue,n)}}class rp extends se{constructor(e,n){super(e,"not-in",n)}matches(e){if(dn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!dn(this.value.arrayValue,n)}}class op extends se{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Kr(n)||!n.arrayValue.values)&&n.arrayValue.values.some(i=>dn(this.value.arrayValue,i))}}class yi{constructor(e,n){this.position=e,this.inclusive=n}}class Qt{constructor(e,n="asc"){this.field=e,this.dir=n}}function ap(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}function ra(t,e,n){let i=0;for(let s=0;s<t.position.length;s++){const r=e[s],o=t.position[s];if(r.field.isKeyField()?i=E.comparator(E.fromName(o.referenceValue),n.key):i=Tt(o,n.data.field(r.field)),r.dir==="desc"&&(i*=-1),i!==0)break}return i}function oa(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!fe(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e,n=null,i=[],s=[],r=null,o="F",a=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=i,this.filters=s,this.limit=r,this.limitType=o,this.startAt=a,this.endAt=c,this.D=null,this.C=null,this.startAt,this.endAt}}function cp(t,e,n,i,s,r,o,a){return new Nn(t,e,n,i,s,r,o,a)}function Wi(t){return new Nn(t)}function Yn(t){return!xt(t.limit)&&t.limitType==="F"}function vi(t){return!xt(t.limit)&&t.limitType==="L"}function yu(t){return t.explicitOrderBy.length>0?t.explicitOrderBy[0].field:null}function vu(t){for(const e of t.filters)if(e.S())return e.field;return null}function wu(t){return t.collectionGroup!==null}function fn(t){const e=S(t);if(e.D===null){e.D=[];const n=vu(e),i=yu(e);if(n!==null&&i===null)n.isKeyField()||e.D.push(new Qt(n)),e.D.push(new Qt(oe.keyField(),"asc"));else{let s=!1;for(const r of e.explicitOrderBy)e.D.push(r),r.field.isKeyField()&&(s=!0);if(!s){const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";e.D.push(new Qt(oe.keyField(),r))}}}return e.D}function Ze(t){const e=S(t);if(!e.C)if(e.limitType==="F")e.C=sa(e.path,e.collectionGroup,fn(e),e.filters,e.limit,e.startAt,e.endAt);else{const n=[];for(const r of fn(e)){const o=r.dir==="desc"?"asc":"desc";n.push(new Qt(r.field,o))}const i=e.endAt?new yi(e.endAt.position,!e.endAt.inclusive):null,s=e.startAt?new yi(e.startAt.position,!e.startAt.inclusive):null;e.C=sa(e.path,e.collectionGroup,n,e.filters,e.limit,i,s)}return e.C}function up(t,e,n){return new Nn(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Xi(t,e){return zr(Ze(t),Ze(e))&&t.limitType===e.limitType}function _u(t){return`${Gr(Ze(t))}|lt:${t.limitType}`}function Ys(t){return`Query(target=${Zf(Ze(t))}; limitType=${t.limitType})`}function Wr(t,e){return e.isFoundDocument()&&function(n,i){const s=i.key.path;return n.collectionGroup!==null?i.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(s):E.isDocumentKey(n.path)?n.path.isEqual(s):n.path.isImmediateParentOf(s)}(t,e)&&function(n,i){for(const s of n.explicitOrderBy)if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(n,i){for(const s of n.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(n,i){return!(n.startAt&&!function(s,r,o){const a=ra(s,r,o);return s.inclusive?a<=0:a<0}(n.startAt,fn(n),i)||n.endAt&&!function(s,r,o){const a=ra(s,r,o);return s.inclusive?a>=0:a>0}(n.endAt,fn(n),i))}(t,e)}function Eu(t){return(e,n)=>{let i=!1;for(const s of fn(t)){const r=lp(s,e,n);if(r!==0)return r;i=i||s.field.isKeyField()}return 0}}function lp(t,e,n){const i=t.field.isKeyField()?E.comparator(e.key,n.key):function(s,r,o){const a=r.data.field(s),c=o.data.field(s);return a!==null&&c!==null?Tt(a,c):T()}(t.field,e,n);switch(t.dir){case"asc":return i;case"desc":return-1*i;default:return T()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(t,e){if(t.N){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:mi(e)?"-0":e}}function Tu(t){return{integerValue:""+t}}function hp(t,e){return Yf(e)?Tu(e):Iu(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(){this._=void 0}}function dp(t,e,n){return t instanceof wi?function(i,s){const r={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&(r.fields.__previous_value__=s),{mapValue:r}}(n,e):t instanceof St?bu(t,e):t instanceof bt?Au(t,e):function(i,s){const r=Su(i,s),o=aa(r)+aa(i.k);return Xs(r)&&Xs(i.k)?Tu(o):Iu(i.O,o)}(t,e)}function fp(t,e,n){return t instanceof St?bu(t,e):t instanceof bt?Au(t,e):n}function Su(t,e){return t instanceof _i?Xs(n=e)||function(i){return!!i&&"doubleValue"in i}(n)?e:{integerValue:0}:null;var n}class wi extends Ji{}class St extends Ji{constructor(e){super(),this.elements=e}}function bu(t,e){const n=ku(e);for(const i of t.elements)n.some(s=>fe(s,i))||n.push(i);return{arrayValue:{values:n}}}class bt extends Ji{constructor(e){super(),this.elements=e}}function Au(t,e){let n=ku(e);for(const i of t.elements)n=n.filter(s=>!fe(s,i));return{arrayValue:{values:n}}}class _i extends Ji{constructor(e,n){super(),this.O=e,this.k=n}}function aa(t){return x(t.integerValue||t.doubleValue)}function ku(t){return Kr(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(e,n){this.field=e,this.transform=n}}function pp(t,e){return t.field.isEqual(e.field)&&function(n,i){return n instanceof St&&i instanceof St||n instanceof bt&&i instanceof bt?_t(n.elements,i.elements,fe):n instanceof _i&&i instanceof _i?fe(n.k,i.k):n instanceof wi&&i instanceof wi}(t.transform,e.transform)}class gp{constructor(e,n){this.version=e,this.transformResults=n}}class He{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new He}static exists(e){return new He(void 0,e)}static updateTime(e){return new He(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Qn(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Yi{}function mp(t,e,n){t instanceof Qi?function(i,s,r){const o=i.value.clone(),a=la(i.fieldTransforms,s,r.transformResults);o.setAll(a),s.convertToFoundDocument(r.version,o).setHasCommittedMutations()}(t,e,n):t instanceof Ut?function(i,s,r){if(!Qn(i.precondition,s))return void s.convertToUnknownDocument(r.version);const o=la(i.fieldTransforms,s,r.transformResults),a=s.data;a.setAll(Nu(i)),a.setAll(o),s.convertToFoundDocument(r.version,a).setHasCommittedMutations()}(t,e,n):function(i,s,r){s.convertToNoDocument(r.version).setHasCommittedMutations()}(0,e,n)}function Qs(t,e,n){t instanceof Qi?function(i,s,r){if(!Qn(i.precondition,s))return;const o=i.value.clone(),a=ha(i.fieldTransforms,r,s);o.setAll(a),s.convertToFoundDocument(ua(s),o).setHasLocalMutations()}(t,e,n):t instanceof Ut?function(i,s,r){if(!Qn(i.precondition,s))return;const o=ha(i.fieldTransforms,r,s),a=s.data;a.setAll(Nu(i)),a.setAll(o),s.convertToFoundDocument(ua(s),a).setHasLocalMutations()}(t,e,n):function(i,s){Qn(i.precondition,s)&&s.convertToNoDocument(A.min())}(t,e)}function yp(t,e){let n=null;for(const i of t.fieldTransforms){const s=e.data.field(i.field),r=Su(i.transform,s||null);r!=null&&(n==null&&(n=ae.empty()),n.set(i.field,r))}return n||null}function ca(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(n,i){return n===void 0&&i===void 0||!(!n||!i)&&_t(n,i,(s,r)=>pp(s,r))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}function ua(t){return t.isFoundDocument()?t.version:A.min()}class Qi extends Yi{constructor(e,n,i,s=[]){super(),this.key=e,this.value=n,this.precondition=i,this.fieldTransforms=s,this.type=0}}class Ut extends Yi{constructor(e,n,i,s,r=[]){super(),this.key=e,this.data=n,this.fieldMask=i,this.precondition=s,this.fieldTransforms=r,this.type=1}}function Nu(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const i=t.data.field(n);e.set(n,i)}}),e}function la(t,e,n){const i=new Map;D(t.length===n.length);for(let s=0;s<n.length;s++){const r=t[s],o=r.transform,a=e.data.field(r.field);i.set(r.field,fp(o,a,n[s]))}return i}function ha(t,e,n){const i=new Map;for(const s of t){const r=s.transform,o=n.data.field(s.field);i.set(s.field,dp(r,o,e))}return i}class vp extends Yi{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}}class wp extends Yi{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _p{constructor(e){this.count=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var M,k;function Ep(t){switch(t){default:return T();case f.CANCELLED:case f.UNKNOWN:case f.DEADLINE_EXCEEDED:case f.RESOURCE_EXHAUSTED:case f.INTERNAL:case f.UNAVAILABLE:case f.UNAUTHENTICATED:return!1;case f.INVALID_ARGUMENT:case f.NOT_FOUND:case f.ALREADY_EXISTS:case f.PERMISSION_DENIED:case f.FAILED_PRECONDITION:case f.ABORTED:case f.OUT_OF_RANGE:case f.UNIMPLEMENTED:case f.DATA_LOSS:return!0}}function Ru(t){if(t===void 0)return Pe("GRPC error has no .code"),f.UNKNOWN;switch(t){case M.OK:return f.OK;case M.CANCELLED:return f.CANCELLED;case M.UNKNOWN:return f.UNKNOWN;case M.DEADLINE_EXCEEDED:return f.DEADLINE_EXCEEDED;case M.RESOURCE_EXHAUSTED:return f.RESOURCE_EXHAUSTED;case M.INTERNAL:return f.INTERNAL;case M.UNAVAILABLE:return f.UNAVAILABLE;case M.UNAUTHENTICATED:return f.UNAUTHENTICATED;case M.INVALID_ARGUMENT:return f.INVALID_ARGUMENT;case M.NOT_FOUND:return f.NOT_FOUND;case M.ALREADY_EXISTS:return f.ALREADY_EXISTS;case M.PERMISSION_DENIED:return f.PERMISSION_DENIED;case M.FAILED_PRECONDITION:return f.FAILED_PRECONDITION;case M.ABORTED:return f.ABORTED;case M.OUT_OF_RANGE:return f.OUT_OF_RANGE;case M.UNIMPLEMENTED:return f.UNIMPLEMENTED;case M.DATA_LOSS:return f.DATA_LOSS;default:return T()}}(k=M||(M={}))[k.OK=0]="OK",k[k.CANCELLED=1]="CANCELLED",k[k.UNKNOWN=2]="UNKNOWN",k[k.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",k[k.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",k[k.NOT_FOUND=5]="NOT_FOUND",k[k.ALREADY_EXISTS=6]="ALREADY_EXISTS",k[k.PERMISSION_DENIED=7]="PERMISSION_DENIED",k[k.UNAUTHENTICATED=16]="UNAUTHENTICATED",k[k.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",k[k.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",k[k.ABORTED=10]="ABORTED",k[k.OUT_OF_RANGE=11]="OUT_OF_RANGE",k[k.UNIMPLEMENTED=12]="UNIMPLEMENTED",k[k.INTERNAL=13]="INTERNAL",k[k.UNAVAILABLE=14]="UNAVAILABLE",k[k.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e,n){this.comparator=e,this.root=n||K.EMPTY}insert(e,n){return new j(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,K.BLACK,null,null))}remove(e){return new j(this.comparator,this.root.remove(e,this.comparator).copy(null,null,K.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return n.value;i<0?n=n.left:i>0&&(n=n.right)}return null}indexOf(e){let n=0,i=this.root;for(;!i.isEmpty();){const s=this.comparator(e,i.key);if(s===0)return n+i.left.size;s<0?i=i.left:(n+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,i)=>(e(n,i),!1))}toString(){const e=[];return this.inorderTraversal((n,i)=>(e.push(`${n}:${i}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Gn(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Gn(this.root,e,this.comparator,!1)}getReverseIterator(){return new Gn(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Gn(this.root,e,this.comparator,!0)}}class Gn{constructor(e,n,i,s){this.isReverse=s,this.nodeStack=[];let r=1;for(;!e.isEmpty();)if(r=n?i(e.key,n):1,s&&(r*=-1),r<0)e=this.isReverse?e.left:e.right;else{if(r===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class K{constructor(e,n,i,s,r){this.key=e,this.value=n,this.color=i!=null?i:K.RED,this.left=s!=null?s:K.EMPTY,this.right=r!=null?r:K.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,i,s,r){return new K(e!=null?e:this.key,n!=null?n:this.value,i!=null?i:this.color,s!=null?s:this.left,r!=null?r:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,i){let s=this;const r=i(e,s.key);return s=r<0?s.copy(null,null,null,s.left.insert(e,n,i),null):r===0?s.copy(null,n,null,null,null):s.copy(null,null,null,null,s.right.insert(e,n,i)),s.fixUp()}removeMin(){if(this.left.isEmpty())return K.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let i,s=this;if(n(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,n),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),n(e,s.key)===0){if(s.right.isEmpty())return K.EMPTY;i=s.right.min(),s=s.copy(i.key,i.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,n))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,K.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,K.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw T();const e=this.left.check();if(e!==this.right.check())throw T();return e+(this.isRed()?0:1)}}K.EMPTY=null,K.RED=!0,K.BLACK=!1;K.EMPTY=new class{constructor(){this.size=0}get key(){throw T()}get value(){throw T()}get color(){throw T()}get left(){throw T()}get right(){throw T()}copy(t,e,n,i,s){return this}insert(t,e,n){return new K(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.comparator=e,this.data=new j(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,i)=>(e(n),!1))}forEachInRange(e,n){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const s=i.getNext();if(this.comparator(s.key,e[1])>=0)return;n(s.key)}}forEachWhile(e,n){let i;for(i=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new da(this.data.getIterator())}getIteratorFrom(e){return new da(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(i=>{n=n.add(i)}),n}isEqual(e){if(!(e instanceof W)||this.size!==e.size)return!1;const n=this.data.getIterator(),i=e.data.getIterator();for(;n.hasNext();){const s=n.getNext().key,r=i.getNext().key;if(this.comparator(s,r)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new W(this.comparator);return n.data=e,n}}class da{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ip=new j(E.comparator);function et(){return Ip}const Tp=new j(E.comparator);function Zs(){return Tp}const Sp=new j(E.comparator),bp=new W(E.comparator);function P(...t){let e=bp;for(const n of t)e=e.add(n);return e}const Ap=new W(R);function Du(){return Ap}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e,n,i,s,r){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=i,this.documentUpdates=s,this.resolvedLimboDocuments=r}static createSynthesizedRemoteEventForCurrentChange(e,n){const i=new Map;return i.set(e,Rn.createSynthesizedTargetChangeForCurrentChange(e,n)),new Zi(A.min(),i,Du(),et(),P())}}class Rn{constructor(e,n,i,s,r){this.resumeToken=e,this.current=n,this.addedDocuments=i,this.modifiedDocuments=s,this.removedDocuments=r}static createSynthesizedTargetChangeForCurrentChange(e,n){return new Rn(X.EMPTY_BYTE_STRING,n,P(),P(),P())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(e,n,i,s){this.M=e,this.removedTargetIds=n,this.key=i,this.$=s}}class Ou{constructor(e,n){this.targetId=e,this.F=n}}class Pu{constructor(e,n,i=X.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=n,this.resumeToken=i,this.cause=s}}class fa{constructor(){this.B=0,this.L=ga(),this.U=X.EMPTY_BYTE_STRING,this.q=!1,this.K=!0}get current(){return this.q}get resumeToken(){return this.U}get G(){return this.B!==0}get j(){return this.K}W(e){e.approximateByteSize()>0&&(this.K=!0,this.U=e)}H(){let e=P(),n=P(),i=P();return this.L.forEach((s,r)=>{switch(r){case 0:e=e.add(s);break;case 2:n=n.add(s);break;case 1:i=i.add(s);break;default:T()}}),new Rn(this.U,this.q,e,n,i)}J(){this.K=!1,this.L=ga()}Y(e,n){this.K=!0,this.L=this.L.insert(e,n)}X(e){this.K=!0,this.L=this.L.remove(e)}Z(){this.B+=1}tt(){this.B-=1}et(){this.K=!0,this.q=!0}}class kp{constructor(e){this.nt=e,this.st=new Map,this.it=et(),this.rt=pa(),this.ot=new W(R)}ct(e){for(const n of e.M)e.$&&e.$.isFoundDocument()?this.ut(n,e.$):this.at(n,e.key,e.$);for(const n of e.removedTargetIds)this.at(n,e.key,e.$)}ht(e){this.forEachTarget(e,n=>{const i=this.lt(n);switch(e.state){case 0:this.ft(n)&&i.W(e.resumeToken);break;case 1:i.tt(),i.G||i.J(),i.W(e.resumeToken);break;case 2:i.tt(),i.G||this.removeTarget(n);break;case 3:this.ft(n)&&(i.et(),i.W(e.resumeToken));break;case 4:this.ft(n)&&(this.dt(n),i.W(e.resumeToken));break;default:T()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.st.forEach((i,s)=>{this.ft(s)&&n(s)})}_t(e){const n=e.targetId,i=e.F.count,s=this.wt(n);if(s){const r=s.target;if(Js(r))if(i===0){const o=new E(r.path);this.at(n,o,Y.newNoDocument(o,A.min()))}else D(i===1);else this.gt(n)!==i&&(this.dt(n),this.ot=this.ot.add(n))}}yt(e){const n=new Map;this.st.forEach((r,o)=>{const a=this.wt(o);if(a){if(r.current&&Js(a.target)){const c=new E(a.target.path);this.it.get(c)!==null||this.It(o,c)||this.at(o,c,Y.newNoDocument(c,e))}r.j&&(n.set(o,r.H()),r.J())}});let i=P();this.rt.forEach((r,o)=>{let a=!0;o.forEachWhile(c=>{const u=this.wt(c);return!u||u.purpose===2||(a=!1,!1)}),a&&(i=i.add(r))}),this.it.forEach((r,o)=>o.setReadTime(e));const s=new Zi(e,n,this.ot,this.it,i);return this.it=et(),this.rt=pa(),this.ot=new W(R),s}ut(e,n){if(!this.ft(e))return;const i=this.It(e,n.key)?2:0;this.lt(e).Y(n.key,i),this.it=this.it.insert(n.key,n),this.rt=this.rt.insert(n.key,this.Et(n.key).add(e))}at(e,n,i){if(!this.ft(e))return;const s=this.lt(e);this.It(e,n)?s.Y(n,1):s.X(n),this.rt=this.rt.insert(n,this.Et(n).delete(e)),i&&(this.it=this.it.insert(n,i))}removeTarget(e){this.st.delete(e)}gt(e){const n=this.lt(e).H();return this.nt.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}Z(e){this.lt(e).Z()}lt(e){let n=this.st.get(e);return n||(n=new fa,this.st.set(e,n)),n}Et(e){let n=this.rt.get(e);return n||(n=new W(R),this.rt=this.rt.insert(e,n)),n}ft(e){const n=this.wt(e)!==null;return n||_("WatchChangeAggregator","Detected inactive target",e),n}wt(e){const n=this.st.get(e);return n&&n.G?null:this.nt.Tt(e)}dt(e){this.st.set(e,new fa),this.nt.getRemoteKeysForTarget(e).forEach(n=>{this.at(e,n,null)})}It(e,n){return this.nt.getRemoteKeysForTarget(e).has(n)}}function pa(){return new j(E.comparator)}function ga(){return new j(E.comparator)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cp=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),Np=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))();class Rp{constructor(e,n){this.databaseId=e,this.N=n}}function Ei(t,e){return t.N?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Lu(t,e){return t.N?e.toBase64():e.toUint8Array()}function Dp(t,e){return Ei(t,e.toTimestamp())}function _e(t){return D(!!t),A.fromTimestamp(function(e){const n=Le(e);return new ce(n.seconds,n.nanos)}(t))}function Xr(t,e){return function(n){return new O(["projects",n.projectId,"databases",n.database])}(t).child("documents").child(e).canonicalString()}function Mu(t){const e=O.fromString(t);return D(Vu(e)),e}function er(t,e){return Xr(t.databaseId,e.path)}function As(t,e){const n=Mu(e);if(n.get(1)!==t.databaseId.projectId)throw new v(f.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new v(f.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new E(xu(n))}function tr(t,e){return Xr(t.databaseId,e)}function Op(t){const e=Mu(t);return e.length===4?O.emptyPath():xu(e)}function nr(t){return new O(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function xu(t){return D(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function ma(t,e,n){return{name:er(t,e),fields:n.value.mapValue.fields}}function Pp(t,e){let n;if("targetChange"in e){e.targetChange;const i=function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:T()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],r=function(c,u){return c.N?(D(u===void 0||typeof u=="string"),X.fromBase64String(u||"")):(D(u===void 0||u instanceof Uint8Array),X.fromUint8Array(u||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(c){const u=c.code===void 0?f.UNKNOWN:Ru(c.code);return new v(u,c.message||"")}(o);n=new Pu(i,s,r,a||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const s=As(t,i.document.name),r=_e(i.document.updateTime),o=new ae({mapValue:{fields:i.document.fields}}),a=Y.newFoundDocument(s,r,o),c=i.targetIds||[],u=i.removedTargetIds||[];n=new Zn(c,u,a.key,a)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const s=As(t,i.document),r=i.readTime?_e(i.readTime):A.min(),o=Y.newNoDocument(s,r),a=i.removedTargetIds||[];n=new Zn([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const s=As(t,i.document),r=i.removedTargetIds||[];n=new Zn([],r,s,null)}else{if(!("filter"in e))return T();{e.filter;const i=e.filter;i.targetId;const s=i.count||0,r=new _p(s),o=i.targetId;n=new Ou(o,r)}}return n}function Lp(t,e){let n;if(e instanceof Qi)n={update:ma(t,e.key,e.value)};else if(e instanceof vp)n={delete:er(t,e.key)};else if(e instanceof Ut)n={update:ma(t,e.key,e.data),updateMask:Hp(e.fieldMask)};else{if(!(e instanceof wp))return T();n={verify:er(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(i=>function(s,r){const o=r.transform;if(o instanceof wi)return{fieldPath:r.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(o instanceof St)return{fieldPath:r.field.canonicalString(),appendMissingElements:{values:o.elements}};if(o instanceof bt)return{fieldPath:r.field.canonicalString(),removeAllFromArray:{values:o.elements}};if(o instanceof _i)return{fieldPath:r.field.canonicalString(),increment:o.k};throw T()}(0,i))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Dp(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:T()}(t,e.precondition)),n}function Mp(t,e){return t&&t.length>0?(D(e!==void 0),t.map(n=>function(i,s){let r=i.updateTime?_e(i.updateTime):_e(s);return r.isEqual(A.min())&&(r=_e(s)),new gp(r,i.transformResults||[])}(n,e))):[]}function xp(t,e){return{documents:[tr(t,e.path)]}}function Up(t,e){const n={structuredQuery:{}},i=e.path;e.collectionGroup!==null?(n.parent=tr(t,i),n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(n.parent=tr(t,i.popLast()),n.structuredQuery.from=[{collectionId:i.lastSegment()}]);const s=function(c){if(c.length===0)return;const u=c.map(l=>function(h){if(h.op==="=="){if(ia(h.value))return{unaryFilter:{field:lt(h.field),op:"IS_NAN"}};if(na(h.value))return{unaryFilter:{field:lt(h.field),op:"IS_NULL"}}}else if(h.op==="!="){if(ia(h.value))return{unaryFilter:{field:lt(h.field),op:"IS_NOT_NAN"}};if(na(h.value))return{unaryFilter:{field:lt(h.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:lt(h.field),op:Bp(h.op),value:h.value}}}(l));return u.length===1?u[0]:{compositeFilter:{op:"AND",filters:u}}}(e.filters);s&&(n.structuredQuery.where=s);const r=function(c){if(c.length!==0)return c.map(u=>function(l){return{field:lt(l.field),direction:$p(l.dir)}}(u))}(e.orderBy);r&&(n.structuredQuery.orderBy=r);const o=function(c,u){return c.N||xt(u)?u:{value:u}}(t,e.limit);var a;return o!==null&&(n.structuredQuery.limit=o),e.startAt&&(n.structuredQuery.startAt={before:(a=e.startAt).inclusive,values:a.position}),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),n}function Vp(t){let e=Op(t.parent);const n=t.structuredQuery,i=n.from?n.from.length:0;let s=null;if(i>0){D(i===1);const l=n.from[0];l.allDescendants?s=l.collectionId:e=e.child(l.collectionId)}let r=[];n.where&&(r=Uu(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(l=>function(h){return new Qt(dt(h.field),function(d){switch(d){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(h.direction))}(l)));let a=null;n.limit&&(a=function(l){let h;return h=typeof l=="object"?l.value:l,xt(h)?null:h}(n.limit));let c=null;n.startAt&&(c=function(l){const h=!!l.before,d=l.values||[];return new yi(d,h)}(n.startAt));let u=null;return n.endAt&&(u=function(l){const h=!l.before,d=l.values||[];return new yi(d,h)}(n.endAt)),cp(e,s,o,r,a,"F",c,u)}function Fp(t,e){const n=function(i,s){switch(s){case 0:return null;case 1:return"existence-filter-mismatch";case 2:return"limbo-document";default:return T()}}(0,e.purpose);return n==null?null:{"goog-listen-tags":n}}function Uu(t){return t?t.unaryFilter!==void 0?[jp(t)]:t.fieldFilter!==void 0?[qp(t)]:t.compositeFilter!==void 0?t.compositeFilter.filters.map(e=>Uu(e)).reduce((e,n)=>e.concat(n)):T():[]}function $p(t){return Cp[t]}function Bp(t){return Np[t]}function lt(t){return{fieldPath:t.canonicalString()}}function dt(t){return oe.fromServerFormat(t.fieldPath)}function qp(t){return se.create(dt(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return T()}}(t.fieldFilter.op),t.fieldFilter.value)}function jp(t){switch(t.unaryFilter.op){case"IS_NAN":const e=dt(t.unaryFilter.field);return se.create(e,"==",{doubleValue:NaN});case"IS_NULL":const n=dt(t.unaryFilter.field);return se.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=dt(t.unaryFilter.field);return se.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const s=dt(t.unaryFilter.field);return se.create(s,"!=",{nullValue:"NULL_VALUE"});default:return T()}}function Hp(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Vu(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kp="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Gp{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&T(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new p((i,s)=>{this.nextCallback=r=>{this.wrapSuccess(e,r).next(i,s)},this.catchCallback=r=>{this.wrapFailure(n,r).next(i,s)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof p?n:p.resolve(n)}catch(n){return p.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):p.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):p.reject(n)}static resolve(e){return new p((n,i)=>{n(e)})}static reject(e){return new p((n,i)=>{i(e)})}static waitFor(e){return new p((n,i)=>{let s=0,r=0,o=!1;e.forEach(a=>{++s,a.next(()=>{++r,o&&r===s&&n()},c=>i(c))}),o=!0,r===s&&n()})}static or(e){let n=p.resolve(!1);for(const i of e)n=n.next(s=>s?p.resolve(s):i());return n}static forEach(e,n){const i=[];return e.forEach((s,r)=>{i.push(n.call(this,s,r))}),this.waitFor(i)}}function Dn(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e,n,i,s){this.batchId=e,this.localWriteTime=n,this.baseMutations=i,this.mutations=s}applyToRemoteDocument(e,n){const i=n.mutationResults;for(let s=0;s<this.mutations.length;s++){const r=this.mutations[s];r.key.isEqual(e.key)&&mp(r,e,i[s])}}applyToLocalView(e){for(const n of this.baseMutations)n.key.isEqual(e.key)&&Qs(n,e,this.localWriteTime);for(const n of this.mutations)n.key.isEqual(e.key)&&Qs(n,e,this.localWriteTime)}applyToLocalDocumentSet(e){this.mutations.forEach(n=>{const i=e.get(n.key),s=i;this.applyToLocalView(s),i.isValidDocument()||s.convertToNoDocument(A.min())})}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),P())}isEqual(e){return this.batchId===e.batchId&&_t(this.mutations,e.mutations,(n,i)=>ca(n,i))&&_t(this.baseMutations,e.baseMutations,(n,i)=>ca(n,i))}}class Jr{constructor(e,n,i,s){this.batch=e,this.commitVersion=n,this.mutationResults=i,this.docVersions=s}static from(e,n,i){D(e.mutations.length===i.length);let s=Sp;const r=e.mutations;for(let o=0;o<r.length;o++)s=s.insert(r[o].key,i[o].version);return new Jr(e,n,i,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wp{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e,n,i,s,r=A.min(),o=A.min(),a=X.EMPTY_BYTE_STRING){this.target=e,this.targetId=n,this.purpose=i,this.sequenceNumber=s,this.snapshotVersion=r,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a}withSequenceNumber(e){return new Ke(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken)}withResumeToken(e,n){return new Ke(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e)}withLastLimboFreeSnapshotVersion(e){return new Ke(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xp{constructor(e){this.Ht=e}}function Jp(t){const e=Vp({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?up(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yp{constructor(){this.xe=new Qp}addToCollectionParentIndex(e,n){return this.xe.add(n),p.resolve()}getCollectionParents(e,n){return p.resolve(this.xe.getEntries(n))}addFieldIndex(e,n){return p.resolve()}deleteFieldIndex(e,n){return p.resolve()}getDocumentsMatchingTarget(e,n,i){return p.resolve(P())}getFieldIndex(e,n){return p.resolve(null)}getFieldIndexes(e,n){return p.resolve([])}getNextCollectionGroupToUpdate(e){return p.resolve(null)}updateCollectionGroup(e,n,i){return p.resolve()}updateIndexEntries(e,n){return p.resolve()}}class Qp{constructor(){this.index={}}add(e){const n=e.lastSegment(),i=e.popLast(),s=this.index[n]||new W(O.comparator),r=!s.has(i);return this.index[n]=s.add(i),r}has(e){const n=e.lastSegment(),i=e.popLast(),s=this.index[n];return s&&s.has(i)}getEntries(e){return(this.index[e]||new W(O.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e){this.ze=e}next(){return this.ze+=2,this.ze}static He(){return new At(0)}static Je(){return new At(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function On(t){if(t.code!==f.FAILED_PRECONDITION||t.message!==Kp)throw t;_("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={}}get(e){const n=this.mapKeyFn(e),i=this.inner[n];if(i!==void 0){for(const[s,r]of i)if(this.equalsFn(s,e))return r}}has(e){return this.get(e)!==void 0}set(e,n){const i=this.mapKeyFn(e),s=this.inner[i];if(s!==void 0){for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return void(s[r]=[e,n]);s.push([e,n])}else this.inner[i]=[[e,n]]}delete(e){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return!1;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return i.length===1?delete this.inner[n]:i.splice(s,1),!0;return!1}forEach(e){rt(this.inner,(n,i)=>{for(const[s,r]of i)e(s,r)})}isEmpty(){return du(this.inner)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zp{constructor(){this.changes=new Pn(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Y.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const i=this.changes.get(n);return i!==void 0?p.resolve(i):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(e,n,i){this.qn=e,this.gs=n,this.indexManager=i}ys(e,n){return this.gs.getAllMutationBatchesAffectingDocumentKey(e,n).next(i=>this.ps(e,n,i))}ps(e,n,i){return this.qn.getEntry(e,n).next(s=>{for(const r of i)r.applyToLocalView(s);return s})}Is(e,n){e.forEach((i,s)=>{for(const r of n)r.applyToLocalView(s)})}Es(e,n){return this.qn.getEntries(e,n).next(i=>this.Ts(e,i).next(()=>i))}Ts(e,n){return this.gs.getAllMutationBatchesAffectingDocumentKeys(e,n).next(i=>this.Is(n,i))}As(e,n,i){return function(s){return E.isDocumentKey(s.path)&&s.collectionGroup===null&&s.filters.length===0}(n)?this.Rs(e,n.path):wu(n)?this.Ps(e,n,i):this.bs(e,n,i)}Rs(e,n){return this.ys(e,new E(n)).next(i=>{let s=Zs();return i.isFoundDocument()&&(s=s.insert(i.key,i)),s})}Ps(e,n,i){const s=n.collectionGroup;let r=Zs();return this.indexManager.getCollectionParents(e,s).next(o=>p.forEach(o,a=>{const c=function(u,l){return new Nn(l,null,u.explicitOrderBy.slice(),u.filters.slice(),u.limit,u.limitType,u.startAt,u.endAt)}(n,a.child(s));return this.bs(e,c,i).next(u=>{u.forEach((l,h)=>{r=r.insert(l,h)})})}).next(()=>r))}bs(e,n,i){let s;return this.qn.getAll(e,n.path,i).next(r=>(s=r,this.gs.getAllMutationBatchesAffectingQuery(e,n))).next(r=>{for(const o of r)for(const a of o.mutations){const c=a.key;let u=s.get(c);u==null&&(u=Y.newInvalidDocument(c),s=s.insert(c,u)),Qs(a,u,o.localWriteTime),u.isFoundDocument()||(s=s.remove(c))}}).next(()=>(s.forEach((r,o)=>{Wr(n,o)||(s=s.remove(r))}),s))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(e,n,i,s){this.targetId=e,this.fromCache=n,this.vs=i,this.Vs=s}static Ss(e,n){let i=P(),s=P();for(const r of n.docChanges)switch(r.type){case 0:i=i.add(r.doc.key);break;case 1:s=s.add(r.doc.key)}return new Yr(e,n.fromCache,i,s)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{Ds(e){this.Cs=e}As(e,n,i,s){return function(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}(n)||i.isEqual(A.min())?this.Ns(e,n):this.Cs.Es(e,s).next(r=>{const o=this.xs(n,r);return(Yn(n)||vi(n))&&this.ks(n.limitType,o,s,i)?this.Ns(e,n):(Yo()<=N.DEBUG&&_("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Ys(n)),this.Cs.As(e,n,i).next(a=>(o.forEach(c=>{a=a.insert(c.key,c)}),a)))})}xs(e,n){let i=new W(Eu(e));return n.forEach((s,r)=>{Wr(e,r)&&(i=i.add(r))}),i}ks(e,n,i,s){if(i.size!==n.size)return!0;const r=e==="F"?n.last():n.first();return!!r&&(r.hasPendingWrites||r.version.compareTo(s)>0)}Ns(e,n){return Yo()<=N.DEBUG&&_("QueryEngine","Using full collection scan to execute query:",Ys(n)),this.Cs.As(e,n,A.min())}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(e,n,i,s){this.persistence=e,this.Os=n,this.O=s,this.Ms=new j(R),this.$s=new Pn(r=>Gr(r),zr),this.Fs=A.min(),this.Bs=e.getRemoteDocumentCache(),this.Un=e.getTargetCache(),this.Kn=e.getBundleCache(),this.Ls(i)}Ls(e){this.indexManager=this.persistence.getIndexManager(e),this.gs=this.persistence.getMutationQueue(e,this.indexManager),this.Us=new eg(this.Bs,this.gs,this.indexManager),this.Bs.setIndexManager(this.indexManager),this.Os.Ds(this.Us)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.Ms))}}function ig(t,e,n,i){return new ng(t,e,n,i)}async function Fu(t,e){const n=S(t);return await n.persistence.runTransaction("Handle user change","readonly",i=>{let s;return n.gs.getAllMutationBatches(i).next(r=>(s=r,n.Ls(e),n.gs.getAllMutationBatches(i))).next(r=>{const o=[],a=[];let c=P();for(const u of s){o.push(u.batchId);for(const l of u.mutations)c=c.add(l.key)}for(const u of r){a.push(u.batchId);for(const l of u.mutations)c=c.add(l.key)}return n.Us.Es(i,c).next(u=>({qs:u,removedBatchIds:o,addedBatchIds:a}))})})}function sg(t,e){const n=S(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",i=>{const s=e.batch.keys(),r=n.Bs.newChangeBuffer({trackRemovals:!0});return function(o,a,c,u){const l=c.batch,h=l.keys();let d=p.resolve();return h.forEach(g=>{d=d.next(()=>u.getEntry(a,g)).next(m=>{const b=c.docVersions.get(g);D(b!==null),m.version.compareTo(b)<0&&(l.applyToRemoteDocument(m,c),m.isValidDocument()&&(m.setReadTime(c.commitVersion),u.addEntry(m)))})}),d.next(()=>o.gs.removeMutationBatch(a,l))}(n,i,e,r).next(()=>r.apply(i)).next(()=>n.gs.performConsistencyCheck(i)).next(()=>n.Us.Es(i,s))})}function $u(t){const e=S(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Un.getLastRemoteSnapshotVersion(n))}function rg(t,e){const n=S(t),i=e.snapshotVersion;let s=n.Ms;return n.persistence.runTransaction("Apply remote event","readwrite-primary",r=>{const o=n.Bs.newChangeBuffer({trackRemovals:!0});s=n.Ms;const a=[];e.targetChanges.forEach((u,l)=>{const h=s.get(l);if(!h)return;a.push(n.Un.removeMatchingKeys(r,u.removedDocuments,l).next(()=>n.Un.addMatchingKeys(r,u.addedDocuments,l)));let d=h.withSequenceNumber(r.currentSequenceNumber);e.targetMismatches.has(l)?d=d.withResumeToken(X.EMPTY_BYTE_STRING,A.min()).withLastLimboFreeSnapshotVersion(A.min()):u.resumeToken.approximateByteSize()>0&&(d=d.withResumeToken(u.resumeToken,i)),s=s.insert(l,d),function(g,m,b){return g.resumeToken.approximateByteSize()===0||m.snapshotVersion.toMicroseconds()-g.snapshotVersion.toMicroseconds()>=3e8?!0:b.addedDocuments.size+b.modifiedDocuments.size+b.removedDocuments.size>0}(h,d,u)&&a.push(n.Un.updateTargetData(r,d))});let c=et();if(e.documentUpdates.forEach(u=>{e.resolvedLimboDocuments.has(u)&&a.push(n.persistence.referenceDelegate.updateLimboDocument(r,u))}),a.push(og(r,o,e.documentUpdates).next(u=>{c=u})),!i.isEqual(A.min())){const u=n.Un.getLastRemoteSnapshotVersion(r).next(l=>n.Un.setTargetsMetadata(r,r.currentSequenceNumber,i));a.push(u)}return p.waitFor(a).next(()=>o.apply(r)).next(()=>n.Us.Ts(r,c)).next(()=>c)}).then(r=>(n.Ms=s,r))}function og(t,e,n){let i=P();return n.forEach(s=>i=i.add(s)),e.getEntries(t,i).next(s=>{let r=et();return n.forEach((o,a)=>{const c=s.get(o);a.isNoDocument()&&a.version.isEqual(A.min())?(e.removeEntry(o,a.readTime),r=r.insert(o,a)):!c.isValidDocument()||a.version.compareTo(c.version)>0||a.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(a),r=r.insert(o,a)):_("LocalStore","Ignoring outdated watch update for ",o,". Current version:",c.version," Watch version:",a.version)}),r})}function ag(t,e){const n=S(t);return n.persistence.runTransaction("Get next mutation batch","readonly",i=>(e===void 0&&(e=-1),n.gs.getNextMutationBatchAfterBatchId(i,e)))}function cg(t,e){const n=S(t);return n.persistence.runTransaction("Allocate target","readwrite",i=>{let s;return n.Un.getTargetData(i,e).next(r=>r?(s=r,p.resolve(s)):n.Un.allocateTargetId(i).next(o=>(s=new Ke(e,o,0,i.currentSequenceNumber),n.Un.addTargetData(i,s).next(()=>s))))}).then(i=>{const s=n.Ms.get(i.targetId);return(s===null||i.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(n.Ms=n.Ms.insert(i.targetId,i),n.$s.set(e,i.targetId)),i})}async function ir(t,e,n){const i=S(t),s=i.Ms.get(e),r=n?"readwrite":"readwrite-primary";try{n||await i.persistence.runTransaction("Release target",r,o=>i.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Dn(o))throw o;_("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}i.Ms=i.Ms.remove(e),i.$s.delete(s.target)}function ya(t,e,n){const i=S(t);let s=A.min(),r=P();return i.persistence.runTransaction("Execute query","readonly",o=>function(a,c,u){const l=S(a),h=l.$s.get(u);return h!==void 0?p.resolve(l.Ms.get(h)):l.Un.getTargetData(c,u)}(i,o,Ze(e)).next(a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,i.Un.getMatchingKeysForTargetId(o,a.targetId).next(c=>{r=c})}).next(()=>i.Os.As(o,e,n?s:A.min(),n?r:P())).next(a=>({documents:a,Ks:r})))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug{constructor(e){this.O=e,this.Ws=new Map,this.zs=new Map}getBundleMetadata(e,n){return p.resolve(this.Ws.get(n))}saveBundleMetadata(e,n){var i;return this.Ws.set(n.id,{id:(i=n).id,version:i.version,createTime:_e(i.createTime)}),p.resolve()}getNamedQuery(e,n){return p.resolve(this.zs.get(n))}saveNamedQuery(e,n){return this.zs.set(n.name,function(i){return{name:i.name,query:Jp(i.bundledQuery),readTime:_e(i.readTime)}}(n)),p.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lg{constructor(){this.overlays=new j(E.comparator),this.Hs=new Map}getOverlay(e,n){return p.resolve(this.overlays.get(n))}saveOverlays(e,n,i){return i.forEach(s=>{this.Yt(e,n,s)}),p.resolve()}removeOverlaysForBatchId(e,n,i){const s=this.Hs.get(i);return s!==void 0&&(s.forEach(r=>this.overlays=this.overlays.remove(r)),this.Hs.delete(i)),p.resolve()}getOverlaysForCollection(e,n,i){const s=new Map,r=n.length+1,o=new E(n.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const c=a.getNext().value,u=c.getKey();if(!n.isPrefixOf(u.path))break;u.path.length===r&&c.largestBatchId>i&&s.set(c.getKey(),c)}return p.resolve(s)}getOverlaysForCollectionGroup(e,n,i,s){let r=new j((u,l)=>u-l);const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===n&&u.largestBatchId>i){let l=r.get(u.largestBatchId);l===null&&(l=new Map,r=r.insert(u.largestBatchId,l)),l.set(u.getKey(),u)}}const a=new Map,c=r.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((u,l)=>a.set(l,u)),!(a.size>=s)););return p.resolve(a)}Yt(e,n,i){if(i===null)return;const s=this.overlays.get(i.key);s!==null&&this.Hs.get(s.largestBatchId).delete(i.key),this.overlays=this.overlays.insert(i.key,new Wp(n,i));let r=this.Hs.get(n);r===void 0&&(r=new Set,this.Hs.set(n,r)),r.add(i.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(){this.Js=new W(F.Ys),this.Xs=new W(F.Zs)}isEmpty(){return this.Js.isEmpty()}addReference(e,n){const i=new F(e,n);this.Js=this.Js.add(i),this.Xs=this.Xs.add(i)}ti(e,n){e.forEach(i=>this.addReference(i,n))}removeReference(e,n){this.ei(new F(e,n))}ni(e,n){e.forEach(i=>this.removeReference(i,n))}si(e){const n=new E(new O([])),i=new F(n,e),s=new F(n,e+1),r=[];return this.Xs.forEachInRange([i,s],o=>{this.ei(o),r.push(o.key)}),r}ii(){this.Js.forEach(e=>this.ei(e))}ei(e){this.Js=this.Js.delete(e),this.Xs=this.Xs.delete(e)}ri(e){const n=new E(new O([])),i=new F(n,e),s=new F(n,e+1);let r=P();return this.Xs.forEachInRange([i,s],o=>{r=r.add(o.key)}),r}containsKey(e){const n=new F(e,0),i=this.Js.firstAfterOrEqual(n);return i!==null&&e.isEqual(i.key)}}class F{constructor(e,n){this.key=e,this.oi=n}static Ys(e,n){return E.comparator(e.key,n.key)||R(e.oi,n.oi)}static Zs(e,n){return R(e.oi,n.oi)||E.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hg{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.gs=[],this.ci=1,this.ui=new W(F.Ys)}checkEmpty(e){return p.resolve(this.gs.length===0)}addMutationBatch(e,n,i,s){const r=this.ci;this.ci++,this.gs.length>0&&this.gs[this.gs.length-1];const o=new zp(r,n,i,s);this.gs.push(o);for(const a of s)this.ui=this.ui.add(new F(a.key,r)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return p.resolve(o)}lookupMutationBatch(e,n){return p.resolve(this.ai(n))}getNextMutationBatchAfterBatchId(e,n){const i=n+1,s=this.hi(i),r=s<0?0:s;return p.resolve(this.gs.length>r?this.gs[r]:null)}getHighestUnacknowledgedBatchId(){return p.resolve(this.gs.length===0?-1:this.ci-1)}getAllMutationBatches(e){return p.resolve(this.gs.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const i=new F(n,0),s=new F(n,Number.POSITIVE_INFINITY),r=[];return this.ui.forEachInRange([i,s],o=>{const a=this.ai(o.oi);r.push(a)}),p.resolve(r)}getAllMutationBatchesAffectingDocumentKeys(e,n){let i=new W(R);return n.forEach(s=>{const r=new F(s,0),o=new F(s,Number.POSITIVE_INFINITY);this.ui.forEachInRange([r,o],a=>{i=i.add(a.oi)})}),p.resolve(this.li(i))}getAllMutationBatchesAffectingQuery(e,n){const i=n.path,s=i.length+1;let r=i;E.isDocumentKey(r)||(r=r.child(""));const o=new F(new E(r),0);let a=new W(R);return this.ui.forEachWhile(c=>{const u=c.key.path;return!!i.isPrefixOf(u)&&(u.length===s&&(a=a.add(c.oi)),!0)},o),p.resolve(this.li(a))}li(e){const n=[];return e.forEach(i=>{const s=this.ai(i);s!==null&&n.push(s)}),n}removeMutationBatch(e,n){D(this.fi(n.batchId,"removed")===0),this.gs.shift();let i=this.ui;return p.forEach(n.mutations,s=>{const r=new F(s.key,n.batchId);return i=i.delete(r),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.ui=i})}Qe(e){}containsKey(e,n){const i=new F(n,0),s=this.ui.firstAfterOrEqual(i);return p.resolve(n.isEqual(s&&s.key))}performConsistencyCheck(e){return this.gs.length,p.resolve()}fi(e,n){return this.hi(e)}hi(e){return this.gs.length===0?0:e-this.gs[0].batchId}ai(e){const n=this.hi(e);return n<0||n>=this.gs.length?null:this.gs[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dg{constructor(e){this.di=e,this.docs=new j(E.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const i=n.key,s=this.docs.get(i),r=s?s.size:0,o=this.di(n);return this.docs=this.docs.insert(i,{document:n.mutableCopy(),size:o}),this.size+=o-r,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const i=this.docs.get(n);return p.resolve(i?i.document.mutableCopy():Y.newInvalidDocument(n))}getEntries(e,n){let i=et();return n.forEach(s=>{const r=this.docs.get(s);i=i.insert(s,r?r.document.mutableCopy():Y.newInvalidDocument(s))}),p.resolve(i)}getAll(e,n,i){let s=et();const r=new E(n.child("")),o=this.docs.getIteratorFrom(r);for(;o.hasNext();){const{key:a,value:{document:c}}=o.getNext();if(!n.isPrefixOf(a.path))break;a.path.length>n.length+1||c.readTime.compareTo(i)<=0||(s=s.insert(c.key,c.mutableCopy()))}return p.resolve(s)}_i(e,n){return p.forEach(this.docs,i=>n(i))}newChangeBuffer(e){return new fg(this)}getSize(e){return p.resolve(this.size)}}class fg extends Zp{constructor(e){super(),this.Tn=e}applyChanges(e){const n=[];return this.changes.forEach((i,s)=>{s.isValidDocument()?n.push(this.Tn.addEntry(e,s)):this.Tn.removeEntry(i)}),p.waitFor(n)}getFromCache(e,n){return this.Tn.getEntry(e,n)}getAllFromCache(e,n){return this.Tn.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pg{constructor(e){this.persistence=e,this.wi=new Pn(n=>Gr(n),zr),this.lastRemoteSnapshotVersion=A.min(),this.highestTargetId=0,this.mi=0,this.gi=new Qr,this.targetCount=0,this.yi=At.He()}forEachTarget(e,n){return this.wi.forEach((i,s)=>n(s)),p.resolve()}getLastRemoteSnapshotVersion(e){return p.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return p.resolve(this.mi)}allocateTargetId(e){return this.highestTargetId=this.yi.next(),p.resolve(this.highestTargetId)}setTargetsMetadata(e,n,i){return i&&(this.lastRemoteSnapshotVersion=i),n>this.mi&&(this.mi=n),p.resolve()}Ze(e){this.wi.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.yi=new At(n),this.highestTargetId=n),e.sequenceNumber>this.mi&&(this.mi=e.sequenceNumber)}addTargetData(e,n){return this.Ze(n),this.targetCount+=1,p.resolve()}updateTargetData(e,n){return this.Ze(n),p.resolve()}removeTargetData(e,n){return this.wi.delete(n.target),this.gi.si(n.targetId),this.targetCount-=1,p.resolve()}removeTargets(e,n,i){let s=0;const r=[];return this.wi.forEach((o,a)=>{a.sequenceNumber<=n&&i.get(a.targetId)===null&&(this.wi.delete(o),r.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)}),p.waitFor(r).next(()=>s)}getTargetCount(e){return p.resolve(this.targetCount)}getTargetData(e,n){const i=this.wi.get(n)||null;return p.resolve(i)}addMatchingKeys(e,n,i){return this.gi.ti(n,i),p.resolve()}removeMatchingKeys(e,n,i){this.gi.ni(n,i);const s=this.persistence.referenceDelegate,r=[];return s&&n.forEach(o=>{r.push(s.markPotentiallyOrphaned(e,o))}),p.waitFor(r)}removeMatchingKeysForTargetId(e,n){return this.gi.si(n),p.resolve()}getMatchingKeysForTargetId(e,n){const i=this.gi.ri(n);return p.resolve(i)}containsKey(e,n){return p.resolve(this.gi.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gg{constructor(e,n){this.pi={},this.overlays={},this.Nn=new Hr(0),this.xn=!1,this.xn=!0,this.referenceDelegate=e(this),this.Un=new pg(this),this.indexManager=new Yp,this.qn=function(i){return new dg(i)}(i=>this.referenceDelegate.Ii(i)),this.O=new Xp(n),this.Kn=new ug(this.O)}start(){return Promise.resolve()}shutdown(){return this.xn=!1,Promise.resolve()}get started(){return this.xn}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new lg,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let i=this.pi[e.toKey()];return i||(i=new hg(n,this.referenceDelegate),this.pi[e.toKey()]=i),i}getTargetCache(){return this.Un}getRemoteDocumentCache(){return this.qn}getBundleCache(){return this.Kn}runTransaction(e,n,i){_("MemoryPersistence","Starting transaction:",e);const s=new mg(this.Nn.next());return this.referenceDelegate.Ei(),i(s).next(r=>this.referenceDelegate.Ti(s).next(()=>r)).toPromise().then(r=>(s.raiseOnCommittedEvent(),r))}Ai(e,n){return p.or(Object.values(this.pi).map(i=>()=>i.containsKey(e,n)))}}class mg extends Gp{constructor(e){super(),this.currentSequenceNumber=e}}class Zr{constructor(e){this.persistence=e,this.Ri=new Qr,this.Pi=null}static bi(e){return new Zr(e)}get vi(){if(this.Pi)return this.Pi;throw T()}addReference(e,n,i){return this.Ri.addReference(i,n),this.vi.delete(i.toString()),p.resolve()}removeReference(e,n,i){return this.Ri.removeReference(i,n),this.vi.add(i.toString()),p.resolve()}markPotentiallyOrphaned(e,n){return this.vi.add(n.toString()),p.resolve()}removeTarget(e,n){this.Ri.si(n.targetId).forEach(s=>this.vi.add(s.toString()));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,n.targetId).next(s=>{s.forEach(r=>this.vi.add(r.toString()))}).next(()=>i.removeTargetData(e,n))}Ei(){this.Pi=new Set}Ti(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return p.forEach(this.vi,i=>{const s=E.fromPath(i);return this.Vi(e,s).next(r=>{r||n.removeEntry(s,A.min())})}).next(()=>(this.Pi=null,n.apply(e)))}updateLimboDocument(e,n){return this.Vi(e,n).next(i=>{i?this.vi.delete(n.toString()):this.vi.add(n.toString())})}Ii(e){return 0}Vi(e,n){return p.or([()=>p.resolve(this.Ri.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ai(e,n)])}}class va{constructor(){this.activeTargetIds=Du()}Ci(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ni(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Di(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class yg{constructor(){this._r=new va,this.wr={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,i){}addLocalQueryTarget(e){return this._r.Ci(e),this.wr[e]||"not-current"}updateQueryState(e,n,i){this.wr[e]=n}removeLocalQueryTarget(e){this._r.Ni(e)}isLocalQueryTarget(e){return this._r.activeTargetIds.has(e)}clearQueryState(e){delete this.wr[e]}getAllActiveQueryTargets(){return this._r.activeTargetIds}isActiveQueryTarget(e){return this._r.activeTargetIds.has(e)}start(){return this._r=new va,Promise.resolve()}handleUserChange(e,n,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vg{mr(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa{constructor(){this.gr=()=>this.yr(),this.pr=()=>this.Ir(),this.Er=[],this.Tr()}mr(e){this.Er.push(e)}shutdown(){window.removeEventListener("online",this.gr),window.removeEventListener("offline",this.pr)}Tr(){window.addEventListener("online",this.gr),window.addEventListener("offline",this.pr)}yr(){_("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.Er)e(0)}Ir(){_("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.Er)e(1)}static Vt(){return typeof window!="undefined"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wg={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _g{constructor(e){this.Ar=e.Ar,this.Rr=e.Rr}Pr(e){this.br=e}vr(e){this.Vr=e}onMessage(e){this.Sr=e}close(){this.Rr()}send(e){this.Ar(e)}Dr(){this.br()}Cr(e){this.Vr(e)}Nr(e){this.Sr(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eg extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http";this.kr=n+"://"+e.host,this.Or="projects/"+this.databaseId.projectId+"/databases/"+this.databaseId.database+"/documents"}Mr(e,n,i,s,r){const o=this.$r(e,n);_("RestConnection","Sending: ",o,i);const a={};return this.Fr(a,s,r),this.Br(e,o,a,i).then(c=>(_("RestConnection","Received: ",c),c),c=>{throw Qo("RestConnection",`${e} failed with error: `,c,"url: ",o,"request:",i),c})}Lr(e,n,i,s,r){return this.Mr(e,n,i,s,r)}Fr(e,n,i){e["X-Goog-Api-Client"]="gl-js/ fire/"+Mt,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((s,r)=>e[r]=s),i&&i.headers.forEach((s,r)=>e[r]=s)}$r(e,n){const i=wg[e];return`${this.kr}/v1/${n}:${i}`}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams}Br(e,n,i,s){return new Promise((r,o)=>{const a=new Ff;a.listenOnce(xf.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case bs.NO_ERROR:const u=a.getResponseJson();_("Connection","XHR received:",JSON.stringify(u)),r(u);break;case bs.TIMEOUT:_("Connection",'RPC "'+e+'" timed out'),o(new v(f.DEADLINE_EXCEEDED,"Request time out"));break;case bs.HTTP_ERROR:const l=a.getStatus();if(_("Connection",'RPC "'+e+'" failed with status:',l,"response text:",a.getResponseText()),l>0){const h=a.getResponseJson().error;if(h&&h.status&&h.message){const d=function(g){const m=g.toLowerCase().replace(/_/g,"-");return Object.values(f).indexOf(m)>=0?m:f.UNKNOWN}(h.status);o(new v(d,h.message))}else o(new v(f.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new v(f.UNAVAILABLE,"Connection failed."));break;default:T()}}finally{_("Connection",'RPC "'+e+'" completed.')}});const c=JSON.stringify(s);a.send(n,"POST",c,i,15)})}Ur(e,n,i){const s=[this.kr,"/","google.firestore.v1.Firestore","/",e,"/channel"],r=Lf(),o=Mf(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling};this.useFetchStreams&&(a.xmlHttpFactory=new Vf({})),this.Fr(a.initMessageHeaders,n,i),sc()||oc()||_h()||ac()||Eh()||rc()||(a.httpHeadersOverwriteParam="$httpHeaders");const c=s.join("");_("Connection","Creating WebChannel: "+c,a);const u=r.createWebChannel(c,a);let l=!1,h=!1;const d=new _g({Ar:m=>{h?_("Connection","Not sending because WebChannel is closed:",m):(l||(_("Connection","Opening WebChannel transport."),u.open(),l=!0),_("Connection","WebChannel sending:",m),u.send(m))},Rr:()=>u.close()}),g=(m,b,C)=>{m.listen(b,H=>{try{C(H)}catch(ee){setTimeout(()=>{throw ee},0)}})};return g(u,Kn.EventType.OPEN,()=>{h||_("Connection","WebChannel transport opened.")}),g(u,Kn.EventType.CLOSE,()=>{h||(h=!0,_("Connection","WebChannel transport closed"),d.Cr())}),g(u,Kn.EventType.ERROR,m=>{h||(h=!0,Qo("Connection","WebChannel transport errored:",m),d.Cr(new v(f.UNAVAILABLE,"The operation could not be completed")))}),g(u,Kn.EventType.MESSAGE,m=>{var b;if(!h){const C=m.data[0];D(!!C);const H=C,ee=H.error||((b=H[0])===null||b===void 0?void 0:b.error);if(ee){_("Connection","WebChannel received error:",ee);const ge=ee.status;let Se=function(Bt){const qt=M[Bt];if(qt!==void 0)return Ru(qt)}(ge),$t=ee.message;Se===void 0&&(Se=f.INTERNAL,$t="Unknown error status: "+ge+" with message "+ee.message),h=!0,d.Cr(new v(Se,$t)),u.close()}else _("Connection","WebChannel received:",C),d.Nr(C)}}),g(o,Uf.STAT_EVENT,m=>{m.stat===Xo.PROXY?_("Connection","Detected buffering proxy"):m.stat===Xo.NOPROXY&&_("Connection","Detected no buffering proxy")}),setTimeout(()=>{d.Dr()},0),d}}function ks(){return typeof document!="undefined"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(t){return new Rp(t,!0)}class Bu{constructor(e,n,i=1e3,s=1.5,r=6e4){this.Sn=e,this.timerId=n,this.qr=i,this.Kr=s,this.Gr=r,this.jr=0,this.Qr=null,this.Wr=Date.now(),this.reset()}reset(){this.jr=0}zr(){this.jr=this.Gr}Hr(e){this.cancel();const n=Math.floor(this.jr+this.Jr()),i=Math.max(0,Date.now()-this.Wr),s=Math.max(0,n-i);s>0&&_("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.jr} ms, delay with jitter: ${n} ms, last attempt: ${i} ms ago)`),this.Qr=this.Sn.enqueueAfterDelay(this.timerId,s,()=>(this.Wr=Date.now(),e())),this.jr*=this.Kr,this.jr<this.qr&&(this.jr=this.qr),this.jr>this.Gr&&(this.jr=this.Gr)}Yr(){this.Qr!==null&&(this.Qr.skipDelay(),this.Qr=null)}cancel(){this.Qr!==null&&(this.Qr.cancel(),this.Qr=null)}Jr(){return(Math.random()-.5)*this.jr}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{constructor(e,n,i,s,r,o,a,c){this.Sn=e,this.Xr=i,this.Zr=s,this.eo=r,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=c,this.state=0,this.no=0,this.so=null,this.io=null,this.stream=null,this.ro=new Bu(e,n)}oo(){return this.state===1||this.state===5||this.co()}co(){return this.state===2||this.state===3}start(){this.state!==4?this.auth():this.uo()}async stop(){this.oo()&&await this.close(0)}ao(){this.state=0,this.ro.reset()}ho(){this.co()&&this.so===null&&(this.so=this.Sn.enqueueAfterDelay(this.Xr,6e4,()=>this.lo()))}fo(e){this._o(),this.stream.send(e)}async lo(){if(this.co())return this.close(0)}_o(){this.so&&(this.so.cancel(),this.so=null)}wo(){this.io&&(this.io.cancel(),this.io=null)}async close(e,n){this._o(),this.wo(),this.ro.cancel(),this.no++,e!==4?this.ro.reset():n&&n.code===f.RESOURCE_EXHAUSTED?(Pe(n.toString()),Pe("Using maximum backoff delay to prevent overloading the backend."),this.ro.zr()):n&&n.code===f.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.mo(),this.stream.close(),this.stream=null),this.state=e,await this.listener.vr(n)}mo(){}auth(){this.state=1;const e=this.yo(this.no),n=this.no;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([i,s])=>{this.no===n&&this.po(i,s)},i=>{e(()=>{const s=new v(f.UNKNOWN,"Fetching auth token failed: "+i.message);return this.Io(s)})})}po(e,n){const i=this.yo(this.no);this.stream=this.Eo(e,n),this.stream.Pr(()=>{i(()=>(this.state=2,this.io=this.Sn.enqueueAfterDelay(this.Zr,1e4,()=>(this.co()&&(this.state=3),Promise.resolve())),this.listener.Pr()))}),this.stream.vr(s=>{i(()=>this.Io(s))}),this.stream.onMessage(s=>{i(()=>this.onMessage(s))})}uo(){this.state=5,this.ro.Hr(async()=>{this.state=0,this.start()})}Io(e){return _("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}yo(e){return n=>{this.Sn.enqueueAndForget(()=>this.no===e?n():(_("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Ig extends qu{constructor(e,n,i,s,r,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,i,s,o),this.O=r}Eo(e,n){return this.eo.Ur("Listen",e,n)}onMessage(e){this.ro.reset();const n=Pp(this.O,e),i=function(s){if(!("targetChange"in s))return A.min();const r=s.targetChange;return r.targetIds&&r.targetIds.length?A.min():r.readTime?_e(r.readTime):A.min()}(e);return this.listener.To(n,i)}Ao(e){const n={};n.database=nr(this.O),n.addTarget=function(s,r){let o;const a=r.target;return o=Js(a)?{documents:xp(s,a)}:{query:Up(s,a)},o.targetId=r.targetId,r.resumeToken.approximateByteSize()>0?o.resumeToken=Lu(s,r.resumeToken):r.snapshotVersion.compareTo(A.min())>0&&(o.readTime=Ei(s,r.snapshotVersion.toTimestamp())),o}(this.O,e);const i=Fp(this.O,e);i&&(n.labels=i),this.fo(n)}Ro(e){const n={};n.database=nr(this.O),n.removeTarget=e,this.fo(n)}}class Tg extends qu{constructor(e,n,i,s,r,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,i,s,o),this.O=r,this.Po=!1}get bo(){return this.Po}start(){this.Po=!1,this.lastStreamToken=void 0,super.start()}mo(){this.Po&&this.vo([])}Eo(e,n){return this.eo.Ur("Write",e,n)}onMessage(e){if(D(!!e.streamToken),this.lastStreamToken=e.streamToken,this.Po){this.ro.reset();const n=Mp(e.writeResults,e.commitTime),i=_e(e.commitTime);return this.listener.Vo(i,n)}return D(!e.writeResults||e.writeResults.length===0),this.Po=!0,this.listener.So()}Do(){const e={};e.database=nr(this.O),this.fo(e)}vo(e){const n={streamToken:this.lastStreamToken,writes:e.map(i=>Lp(this.O,i))};this.fo(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sg extends class{}{constructor(e,n,i,s){super(),this.authCredentials=e,this.appCheckCredentials=n,this.eo=i,this.O=s,this.Co=!1}No(){if(this.Co)throw new v(f.FAILED_PRECONDITION,"The client has already been terminated.")}Mr(e,n,i){return this.No(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,r])=>this.eo.Mr(e,n,i,s,r)).catch(s=>{throw s.name==="FirebaseError"?(s.code===f.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new v(f.UNKNOWN,s.toString())})}Lr(e,n,i){return this.No(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,r])=>this.eo.Lr(e,n,i,s,r)).catch(s=>{throw s.name==="FirebaseError"?(s.code===f.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new v(f.UNKNOWN,s.toString())})}terminate(){this.Co=!0}}class bg{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.xo=0,this.ko=null,this.Oo=!0}Mo(){this.xo===0&&(this.$o("Unknown"),this.ko=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.ko=null,this.Fo("Backend didn't respond within 10 seconds."),this.$o("Offline"),Promise.resolve())))}Bo(e){this.state==="Online"?this.$o("Unknown"):(this.xo++,this.xo>=1&&(this.Lo(),this.Fo(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.$o("Offline")))}set(e){this.Lo(),this.xo=0,e==="Online"&&(this.Oo=!1),this.$o(e)}$o(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}Fo(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Oo?(Pe(n),this.Oo=!1):_("OnlineStateTracker",n)}Lo(){this.ko!==null&&(this.ko.cancel(),this.ko=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ag{constructor(e,n,i,s,r){this.localStore=e,this.datastore=n,this.asyncQueue=i,this.remoteSyncer={},this.Uo=[],this.qo=new Map,this.Ko=new Set,this.Go=[],this.jo=r,this.jo.mr(o=>{i.enqueueAndForget(async()=>{ot(this)&&(_("RemoteStore","Restarting streams for network reachability change."),await async function(a){const c=S(a);c.Ko.add(4),await Ln(c),c.Qo.set("Unknown"),c.Ko.delete(4),await ts(c)}(this))})}),this.Qo=new bg(i,s)}}async function ts(t){if(ot(t))for(const e of t.Go)await e(!0)}async function Ln(t){for(const e of t.Go)await e(!1)}function ju(t,e){const n=S(t);n.qo.has(e.targetId)||(n.qo.set(e.targetId,e),no(n)?to(n):Vt(n).co()&&eo(n,e))}function Hu(t,e){const n=S(t),i=Vt(n);n.qo.delete(e),i.co()&&Ku(n,e),n.qo.size===0&&(i.co()?i.ho():ot(n)&&n.Qo.set("Unknown"))}function eo(t,e){t.Wo.Z(e.targetId),Vt(t).Ao(e)}function Ku(t,e){t.Wo.Z(e),Vt(t).Ro(e)}function to(t){t.Wo=new kp({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),Tt:e=>t.qo.get(e)||null}),Vt(t).start(),t.Qo.Mo()}function no(t){return ot(t)&&!Vt(t).oo()&&t.qo.size>0}function ot(t){return S(t).Ko.size===0}function Gu(t){t.Wo=void 0}async function kg(t){t.qo.forEach((e,n)=>{eo(t,e)})}async function Cg(t,e){Gu(t),no(t)?(t.Qo.Bo(e),to(t)):t.Qo.set("Unknown")}async function Ng(t,e,n){if(t.Qo.set("Online"),e instanceof Pu&&e.state===2&&e.cause)try{await async function(i,s){const r=s.cause;for(const o of s.targetIds)i.qo.has(o)&&(await i.remoteSyncer.rejectListen(o,r),i.qo.delete(o),i.Wo.removeTarget(o))}(t,e)}catch(i){_("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),i),await Ii(t,i)}else if(e instanceof Zn?t.Wo.ct(e):e instanceof Ou?t.Wo._t(e):t.Wo.ht(e),!n.isEqual(A.min()))try{const i=await $u(t.localStore);n.compareTo(i)>=0&&await function(s,r){const o=s.Wo.yt(r);return o.targetChanges.forEach((a,c)=>{if(a.resumeToken.approximateByteSize()>0){const u=s.qo.get(c);u&&s.qo.set(c,u.withResumeToken(a.resumeToken,r))}}),o.targetMismatches.forEach(a=>{const c=s.qo.get(a);if(!c)return;s.qo.set(a,c.withResumeToken(X.EMPTY_BYTE_STRING,c.snapshotVersion)),Ku(s,a);const u=new Ke(c.target,a,1,c.sequenceNumber);eo(s,u)}),s.remoteSyncer.applyRemoteEvent(o)}(t,n)}catch(i){_("RemoteStore","Failed to raise snapshot:",i),await Ii(t,i)}}async function Ii(t,e,n){if(!Dn(e))throw e;t.Ko.add(1),await Ln(t),t.Qo.set("Offline"),n||(n=()=>$u(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{_("RemoteStore","Retrying IndexedDB access"),await n(),t.Ko.delete(1),await ts(t)})}function zu(t,e){return e().catch(n=>Ii(t,n,e))}async function ns(t){const e=S(t),n=Me(e);let i=e.Uo.length>0?e.Uo[e.Uo.length-1].batchId:-1;for(;Rg(e);)try{const s=await ag(e.localStore,i);if(s===null){e.Uo.length===0&&n.ho();break}i=s.batchId,Dg(e,s)}catch(s){await Ii(e,s)}Wu(e)&&Xu(e)}function Rg(t){return ot(t)&&t.Uo.length<10}function Dg(t,e){t.Uo.push(e);const n=Me(t);n.co()&&n.bo&&n.vo(e.mutations)}function Wu(t){return ot(t)&&!Me(t).oo()&&t.Uo.length>0}function Xu(t){Me(t).start()}async function Og(t){Me(t).Do()}async function Pg(t){const e=Me(t);for(const n of t.Uo)e.vo(n.mutations)}async function Lg(t,e,n){const i=t.Uo.shift(),s=Jr.from(i,e,n);await zu(t,()=>t.remoteSyncer.applySuccessfulWrite(s)),await ns(t)}async function Mg(t,e){e&&Me(t).bo&&await async function(n,i){if(s=i.code,Ep(s)&&s!==f.ABORTED){const r=n.Uo.shift();Me(n).ao(),await zu(n,()=>n.remoteSyncer.rejectFailedWrite(r.batchId,i)),await ns(n)}var s}(t,e),Wu(t)&&Xu(t)}async function _a(t,e){const n=S(t);n.asyncQueue.verifyOperationInProgress(),_("RemoteStore","RemoteStore received new credentials");const i=ot(n);n.Ko.add(3),await Ln(n),i&&n.Qo.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ko.delete(3),await ts(n)}async function xg(t,e){const n=S(t);e?(n.Ko.delete(2),await ts(n)):e||(n.Ko.add(2),await Ln(n),n.Qo.set("Unknown"))}function Vt(t){return t.zo||(t.zo=function(e,n,i){const s=S(e);return s.No(),new Ig(n,s.eo,s.authCredentials,s.appCheckCredentials,s.O,i)}(t.datastore,t.asyncQueue,{Pr:kg.bind(null,t),vr:Cg.bind(null,t),To:Ng.bind(null,t)}),t.Go.push(async e=>{e?(t.zo.ao(),no(t)?to(t):t.Qo.set("Unknown")):(await t.zo.stop(),Gu(t))})),t.zo}function Me(t){return t.Ho||(t.Ho=function(e,n,i){const s=S(e);return s.No(),new Tg(n,s.eo,s.authCredentials,s.appCheckCredentials,s.O,i)}(t.datastore,t.asyncQueue,{Pr:Og.bind(null,t),vr:Mg.bind(null,t),So:Pg.bind(null,t),Vo:Lg.bind(null,t)}),t.Go.push(async e=>{e?(t.Ho.ao(),await ns(t)):(await t.Ho.stop(),t.Uo.length>0&&(_("RemoteStore",`Stopping write stream with ${t.Uo.length} pending writes`),t.Uo=[]))})),t.Ho}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(e,n,i,s,r){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=i,this.op=s,this.removalCallback=r,this.deferred=new we,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}static createAndSchedule(e,n,i,s,r){const o=Date.now()+i,a=new io(e,n,o,s,r);return a.start(i),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new v(f.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function so(t,e){if(Pe("AsyncQueue",`${e}: ${t}`),Dn(t))return new v(f.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.comparator=e?(n,i)=>e(n,i)||E.comparator(n.key,i.key):(n,i)=>E.comparator(n.key,i.key),this.keyedMap=Zs(),this.sortedSet=new j(this.comparator)}static emptySet(e){return new gt(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,i)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof gt)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;n.hasNext();){const s=n.getNext().key,r=i.getNext().key;if(!s.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const i=new gt;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=n,i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ea{constructor(){this.Jo=new j(E.comparator)}track(e){const n=e.doc.key,i=this.Jo.get(n);i?e.type!==0&&i.type===3?this.Jo=this.Jo.insert(n,e):e.type===3&&i.type!==1?this.Jo=this.Jo.insert(n,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.Jo=this.Jo.insert(n,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.Jo=this.Jo.insert(n,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.Jo=this.Jo.remove(n):e.type===1&&i.type===2?this.Jo=this.Jo.insert(n,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.Jo=this.Jo.insert(n,{type:2,doc:e.doc}):T():this.Jo=this.Jo.insert(n,e)}Yo(){const e=[];return this.Jo.inorderTraversal((n,i)=>{e.push(i)}),e}}class kt{constructor(e,n,i,s,r,o,a,c){this.query=e,this.docs=n,this.oldDocs=i,this.docChanges=s,this.mutatedKeys=r,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=c}static fromInitialDocuments(e,n,i,s){const r=[];return n.forEach(o=>{r.push({type:0,doc:o})}),new kt(e,n,gt.emptySet(n),r,i,s,!0,!1)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Xi(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,i=e.docChanges;if(n.length!==i.length)return!1;for(let s=0;s<n.length;s++)if(n[s].type!==i[s].type||!n[s].doc.isEqual(i[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ug{constructor(){this.Xo=void 0,this.listeners=[]}}class Vg{constructor(){this.queries=new Pn(e=>_u(e),Xi),this.onlineState="Unknown",this.Zo=new Set}}async function ro(t,e){const n=S(t),i=e.query;let s=!1,r=n.queries.get(i);if(r||(s=!0,r=new Ug),s)try{r.Xo=await n.onListen(i)}catch(o){const a=so(o,`Initialization of query '${Ys(e.query)}' failed`);return void e.onError(a)}n.queries.set(i,r),r.listeners.push(e),e.tc(n.onlineState),r.Xo&&e.ec(r.Xo)&&ao(n)}async function oo(t,e){const n=S(t),i=e.query;let s=!1;const r=n.queries.get(i);if(r){const o=r.listeners.indexOf(e);o>=0&&(r.listeners.splice(o,1),s=r.listeners.length===0)}if(s)return n.queries.delete(i),n.onUnlisten(i)}function Fg(t,e){const n=S(t);let i=!1;for(const s of e){const r=s.query,o=n.queries.get(r);if(o){for(const a of o.listeners)a.ec(s)&&(i=!0);o.Xo=s}}i&&ao(n)}function $g(t,e,n){const i=S(t),s=i.queries.get(e);if(s)for(const r of s.listeners)r.onError(n);i.queries.delete(e)}function ao(t){t.Zo.forEach(e=>{e.next()})}class co{constructor(e,n,i){this.query=e,this.nc=n,this.sc=!1,this.ic=null,this.onlineState="Unknown",this.options=i||{}}ec(e){if(!this.options.includeMetadataChanges){const i=[];for(const s of e.docChanges)s.type!==3&&i.push(s);e=new kt(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0)}let n=!1;return this.sc?this.rc(e)&&(this.nc.next(e),n=!0):this.oc(e,this.onlineState)&&(this.cc(e),n=!0),this.ic=e,n}onError(e){this.nc.error(e)}tc(e){this.onlineState=e;let n=!1;return this.ic&&!this.sc&&this.oc(this.ic,e)&&(this.cc(this.ic),n=!0),n}oc(e,n){if(!e.fromCache)return!0;const i=n!=="Offline";return(!this.options.uc||!i)&&(!e.docs.isEmpty()||n==="Offline")}rc(e){if(e.docChanges.length>0)return!0;const n=this.ic&&this.ic.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}cc(e){e=kt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache),this.sc=!0,this.nc.next(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{constructor(e){this.key=e}}class Yu{constructor(e){this.key=e}}class Bg{constructor(e,n){this.query=e,this.dc=n,this._c=null,this.current=!1,this.wc=P(),this.mutatedKeys=P(),this.mc=Eu(e),this.gc=new gt(this.mc)}get yc(){return this.dc}Ic(e,n){const i=n?n.Ec:new Ea,s=n?n.gc:this.gc;let r=n?n.mutatedKeys:this.mutatedKeys,o=s,a=!1;const c=Yn(this.query)&&s.size===this.query.limit?s.last():null,u=vi(this.query)&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((l,h)=>{const d=s.get(l),g=Wr(this.query,h)?h:null,m=!!d&&this.mutatedKeys.has(d.key),b=!!g&&(g.hasLocalMutations||this.mutatedKeys.has(g.key)&&g.hasCommittedMutations);let C=!1;d&&g?d.data.isEqual(g.data)?m!==b&&(i.track({type:3,doc:g}),C=!0):this.Tc(d,g)||(i.track({type:2,doc:g}),C=!0,(c&&this.mc(g,c)>0||u&&this.mc(g,u)<0)&&(a=!0)):!d&&g?(i.track({type:0,doc:g}),C=!0):d&&!g&&(i.track({type:1,doc:d}),C=!0,(c||u)&&(a=!0)),C&&(g?(o=o.add(g),r=b?r.add(l):r.delete(l)):(o=o.delete(l),r=r.delete(l)))}),Yn(this.query)||vi(this.query))for(;o.size>this.query.limit;){const l=Yn(this.query)?o.last():o.first();o=o.delete(l.key),r=r.delete(l.key),i.track({type:1,doc:l})}return{gc:o,Ec:i,ks:a,mutatedKeys:r}}Tc(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,i){const s=this.gc;this.gc=e.gc,this.mutatedKeys=e.mutatedKeys;const r=e.Ec.Yo();r.sort((u,l)=>function(h,d){const g=m=>{switch(m){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return T()}};return g(h)-g(d)}(u.type,l.type)||this.mc(u.doc,l.doc)),this.Ac(i);const o=n?this.Rc():[],a=this.wc.size===0&&this.current?1:0,c=a!==this._c;return this._c=a,r.length!==0||c?{snapshot:new kt(this.query,e.gc,s,r,e.mutatedKeys,a===0,c,!1),Pc:o}:{Pc:o}}tc(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({gc:this.gc,Ec:new Ea,mutatedKeys:this.mutatedKeys,ks:!1},!1)):{Pc:[]}}bc(e){return!this.dc.has(e)&&!!this.gc.has(e)&&!this.gc.get(e).hasLocalMutations}Ac(e){e&&(e.addedDocuments.forEach(n=>this.dc=this.dc.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.dc=this.dc.delete(n)),this.current=e.current)}Rc(){if(!this.current)return[];const e=this.wc;this.wc=P(),this.gc.forEach(i=>{this.bc(i.key)&&(this.wc=this.wc.add(i.key))});const n=[];return e.forEach(i=>{this.wc.has(i)||n.push(new Yu(i))}),this.wc.forEach(i=>{e.has(i)||n.push(new Ju(i))}),n}vc(e){this.dc=e.Ks,this.wc=P();const n=this.Ic(e.documents);return this.applyChanges(n,!0)}Vc(){return kt.fromInitialDocuments(this.query,this.gc,this.mutatedKeys,this._c===0)}}class qg{constructor(e,n,i){this.query=e,this.targetId=n,this.view=i}}class jg{constructor(e){this.key=e,this.Sc=!1}}class Hg{constructor(e,n,i,s,r,o){this.localStore=e,this.remoteStore=n,this.eventManager=i,this.sharedClientState=s,this.currentUser=r,this.maxConcurrentLimboResolutions=o,this.Dc={},this.Cc=new Pn(a=>_u(a),Xi),this.Nc=new Map,this.xc=new Set,this.kc=new j(E.comparator),this.Oc=new Map,this.Mc=new Qr,this.$c={},this.Fc=new Map,this.Bc=At.Je(),this.onlineState="Unknown",this.Lc=void 0}get isPrimaryClient(){return this.Lc===!0}}async function Kg(t,e){const n=tm(t);let i,s;const r=n.Cc.get(e);if(r)i=r.targetId,n.sharedClientState.addLocalQueryTarget(i),s=r.view.Vc();else{const o=await cg(n.localStore,Ze(e));n.isPrimaryClient&&ju(n.remoteStore,o);const a=n.sharedClientState.addLocalQueryTarget(o.targetId);i=o.targetId,s=await Gg(n,e,i,a==="current")}return s}async function Gg(t,e,n,i){t.Uc=(l,h,d)=>async function(g,m,b,C){let H=m.view.Ic(b);H.ks&&(H=await ya(g.localStore,m.query,!1).then(({documents:Se})=>m.view.Ic(Se,H)));const ee=C&&C.targetChanges.get(m.targetId),ge=m.view.applyChanges(H,g.isPrimaryClient,ee);return Ta(g,m.targetId,ge.Pc),ge.snapshot}(t,l,h,d);const s=await ya(t.localStore,e,!0),r=new Bg(e,s.Ks),o=r.Ic(s.documents),a=Rn.createSynthesizedTargetChangeForCurrentChange(n,i&&t.onlineState!=="Offline"),c=r.applyChanges(o,t.isPrimaryClient,a);Ta(t,n,c.Pc);const u=new qg(e,n,r);return t.Cc.set(e,u),t.Nc.has(n)?t.Nc.get(n).push(e):t.Nc.set(n,[e]),c.snapshot}async function zg(t,e){const n=S(t),i=n.Cc.get(e),s=n.Nc.get(i.targetId);if(s.length>1)return n.Nc.set(i.targetId,s.filter(r=>!Xi(r,e))),void n.Cc.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(i.targetId),n.sharedClientState.isActiveQueryTarget(i.targetId)||await ir(n.localStore,i.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(i.targetId),Hu(n.remoteStore,i.targetId),sr(n,i.targetId)}).catch(On)):(sr(n,i.targetId),await ir(n.localStore,i.targetId,!0))}async function Wg(t,e,n){const i=nm(t);try{const s=await function(r,o){const a=S(r),c=ce.now(),u=o.reduce((h,d)=>h.add(d.key),P());let l;return a.persistence.runTransaction("Locally write mutations","readwrite",h=>a.Us.Es(h,u).next(d=>{l=d;const g=[];for(const m of o){const b=yp(m,l.get(m.key));b!=null&&g.push(new Ut(m.key,b,gu(b.value.mapValue),He.exists(!0)))}return a.gs.addMutationBatch(h,c,g,o)})).then(h=>(h.applyToLocalDocumentSet(l),{batchId:h.batchId,changes:l}))}(i.localStore,e);i.sharedClientState.addPendingMutation(s.batchId),function(r,o,a){let c=r.$c[r.currentUser.toKey()];c||(c=new j(R)),c=c.insert(o,a),r.$c[r.currentUser.toKey()]=c}(i,s.batchId,n),await Mn(i,s.changes),await ns(i.remoteStore)}catch(s){const r=so(s,"Failed to persist write");n.reject(r)}}async function Qu(t,e){const n=S(t);try{const i=await rg(n.localStore,e);e.targetChanges.forEach((s,r)=>{const o=n.Oc.get(r);o&&(D(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.Sc=!0:s.modifiedDocuments.size>0?D(o.Sc):s.removedDocuments.size>0&&(D(o.Sc),o.Sc=!1))}),await Mn(n,i,e)}catch(i){await On(i)}}function Ia(t,e,n){const i=S(t);if(i.isPrimaryClient&&n===0||!i.isPrimaryClient&&n===1){const s=[];i.Cc.forEach((r,o)=>{const a=o.view.tc(e);a.snapshot&&s.push(a.snapshot)}),function(r,o){const a=S(r);a.onlineState=o;let c=!1;a.queries.forEach((u,l)=>{for(const h of l.listeners)h.tc(o)&&(c=!0)}),c&&ao(a)}(i.eventManager,e),s.length&&i.Dc.To(s),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function Xg(t,e,n){const i=S(t);i.sharedClientState.updateQueryState(e,"rejected",n);const s=i.Oc.get(e),r=s&&s.key;if(r){let o=new j(E.comparator);o=o.insert(r,Y.newNoDocument(r,A.min()));const a=P().add(r),c=new Zi(A.min(),new Map,new W(R),o,a);await Qu(i,c),i.kc=i.kc.remove(r),i.Oc.delete(e),uo(i)}else await ir(i.localStore,e,!1).then(()=>sr(i,e,n)).catch(On)}async function Jg(t,e){const n=S(t),i=e.batch.batchId;try{const s=await sg(n.localStore,e);el(n,i,null),Zu(n,i),n.sharedClientState.updateMutationState(i,"acknowledged"),await Mn(n,s)}catch(s){await On(s)}}async function Yg(t,e,n){const i=S(t);try{const s=await function(r,o){const a=S(r);return a.persistence.runTransaction("Reject batch","readwrite-primary",c=>{let u;return a.gs.lookupMutationBatch(c,o).next(l=>(D(l!==null),u=l.keys(),a.gs.removeMutationBatch(c,l))).next(()=>a.gs.performConsistencyCheck(c)).next(()=>a.Us.Es(c,u))})}(i.localStore,e);el(i,e,n),Zu(i,e),i.sharedClientState.updateMutationState(e,"rejected",n),await Mn(i,s)}catch(s){await On(s)}}function Zu(t,e){(t.Fc.get(e)||[]).forEach(n=>{n.resolve()}),t.Fc.delete(e)}function el(t,e,n){const i=S(t);let s=i.$c[i.currentUser.toKey()];if(s){const r=s.get(e);r&&(n?r.reject(n):r.resolve(),s=s.remove(e)),i.$c[i.currentUser.toKey()]=s}}function sr(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const i of t.Nc.get(e))t.Cc.delete(i),n&&t.Dc.qc(i,n);t.Nc.delete(e),t.isPrimaryClient&&t.Mc.si(e).forEach(i=>{t.Mc.containsKey(i)||tl(t,i)})}function tl(t,e){t.xc.delete(e.path.canonicalString());const n=t.kc.get(e);n!==null&&(Hu(t.remoteStore,n),t.kc=t.kc.remove(e),t.Oc.delete(n),uo(t))}function Ta(t,e,n){for(const i of n)i instanceof Ju?(t.Mc.addReference(i.key,e),Qg(t,i)):i instanceof Yu?(_("SyncEngine","Document no longer in limbo: "+i.key),t.Mc.removeReference(i.key,e),t.Mc.containsKey(i.key)||tl(t,i.key)):T()}function Qg(t,e){const n=e.key,i=n.path.canonicalString();t.kc.get(n)||t.xc.has(i)||(_("SyncEngine","New document in limbo: "+n),t.xc.add(i),uo(t))}function uo(t){for(;t.xc.size>0&&t.kc.size<t.maxConcurrentLimboResolutions;){const e=t.xc.values().next().value;t.xc.delete(e);const n=new E(O.fromString(e)),i=t.Bc.next();t.Oc.set(i,new jg(n)),t.kc=t.kc.insert(n,i),ju(t.remoteStore,new Ke(Ze(Wi(n.path)),i,2,Hr.A))}}async function Mn(t,e,n){const i=S(t),s=[],r=[],o=[];i.Cc.isEmpty()||(i.Cc.forEach((a,c)=>{o.push(i.Uc(c,e,n).then(u=>{if(u){i.isPrimaryClient&&i.sharedClientState.updateQueryState(c.targetId,u.fromCache?"not-current":"current"),s.push(u);const l=Yr.Ss(c.targetId,u);r.push(l)}}))}),await Promise.all(o),i.Dc.To(s),await async function(a,c){const u=S(a);try{await u.persistence.runTransaction("notifyLocalViewChanges","readwrite",l=>p.forEach(c,h=>p.forEach(h.vs,d=>u.persistence.referenceDelegate.addReference(l,h.targetId,d)).next(()=>p.forEach(h.Vs,d=>u.persistence.referenceDelegate.removeReference(l,h.targetId,d)))))}catch(l){if(!Dn(l))throw l;_("LocalStore","Failed to update sequence numbers: "+l)}for(const l of c){const h=l.targetId;if(!l.fromCache){const d=u.Ms.get(h),g=d.snapshotVersion,m=d.withLastLimboFreeSnapshotVersion(g);u.Ms=u.Ms.insert(h,m)}}}(i.localStore,r))}async function Zg(t,e){const n=S(t);if(!n.currentUser.isEqual(e)){_("SyncEngine","User change. New user:",e.toKey());const i=await Fu(n.localStore,e);n.currentUser=e,function(s,r){s.Fc.forEach(o=>{o.forEach(a=>{a.reject(new v(f.CANCELLED,r))})}),s.Fc.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await Mn(n,i.qs)}}function em(t,e){const n=S(t),i=n.Oc.get(e);if(i&&i.Sc)return P().add(i.key);{let s=P();const r=n.Nc.get(e);if(!r)return s;for(const o of r){const a=n.Cc.get(o);s=s.unionWith(a.view.yc)}return s}}function tm(t){const e=S(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Qu.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=em.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Xg.bind(null,e),e.Dc.To=Fg.bind(null,e.eventManager),e.Dc.qc=$g.bind(null,e.eventManager),e}function nm(t){const e=S(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Jg.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Yg.bind(null,e),e}class im{constructor(){this.synchronizeTabs=!1}async initialize(e){this.O=es(e.databaseInfo.databaseId),this.sharedClientState=this.Gc(e),this.persistence=this.jc(e),await this.persistence.start(),this.gcScheduler=this.Qc(e),this.localStore=this.Wc(e)}Qc(e){return null}Wc(e){return ig(this.persistence,new tg,e.initialUser,this.O)}jc(e){return new gg(Zr.bi,this.O)}Gc(e){return new yg}async terminate(){this.gcScheduler&&this.gcScheduler.stop(),await this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class sm{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>Ia(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=Zg.bind(null,this.syncEngine),await xg(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new Vg}createDatastore(e){const n=es(e.databaseInfo.databaseId),i=(s=e.databaseInfo,new Eg(s));var s;return function(r,o,a,c){return new Sg(r,o,a,c)}(e.authCredentials,e.appCheckCredentials,i,n)}createRemoteStore(e){return n=this.localStore,i=this.datastore,s=e.asyncQueue,r=a=>Ia(this.syncEngine,a,0),o=wa.Vt()?new wa:new vg,new Ag(n,i,s,r,o);var n,i,s,r,o}createSyncEngine(e,n){return function(i,s,r,o,a,c,u){const l=new Hg(i,s,r,o,a,c);return u&&(l.Lc=!0),l}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}terminate(){return async function(e){const n=S(e);_("RemoteStore","RemoteStore shutting down."),n.Ko.add(5),await Ln(n),n.jo.shutdown(),n.Qo.set("Unknown")}(this.remoteStore)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Hc(this.observer.next,e)}error(e){this.observer.error?this.Hc(this.observer.error,e):console.error("Uncaught Error in snapshot listener:",e)}Jc(){this.muted=!0}Hc(e,n){this.muted||setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rm{constructor(e,n,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=i,this.databaseInfo=s,this.user=re.UNAUTHENTICATED,this.clientId=hu.R(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(i,async r=>{_("FirestoreClient","Received user=",r.uid),await this.authCredentialListener(r),this.user=r}),this.appCheckCredentials.start(i,r=>(_("FirestoreClient","Received new app check token=",r),this.appCheckCredentialListener(r,this.user)))}async getConfiguration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new v(f.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const e=new we;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this.onlineComponents&&await this.onlineComponents.terminate(),this.offlineComponents&&await this.offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const i=so(n,"Failed to shutdown persistence");e.reject(i)}}),e.promise}}async function om(t,e){t.asyncQueue.verifyOperationInProgress(),_("FirestoreClient","Initializing OfflineComponentProvider");const n=await t.getConfiguration();await e.initialize(n);let i=n.initialUser;t.setCredentialChangeListener(async s=>{i.isEqual(s)||(await Fu(e.localStore,s),i=s)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t.offlineComponents=e}async function am(t,e){t.asyncQueue.verifyOperationInProgress();const n=await cm(t);_("FirestoreClient","Initializing OnlineComponentProvider");const i=await t.getConfiguration();await e.initialize(n,i),t.setCredentialChangeListener(s=>_a(e.remoteStore,s)),t.setAppCheckTokenChangeListener((s,r)=>_a(e.remoteStore,r)),t.onlineComponents=e}async function cm(t){return t.offlineComponents||(_("FirestoreClient","Using default OfflineComponentProvider"),await om(t,new im)),t.offlineComponents}async function nl(t){return t.onlineComponents||(_("FirestoreClient","Using default OnlineComponentProvider"),await am(t,new sm)),t.onlineComponents}function um(t){return nl(t).then(e=>e.syncEngine)}async function Ti(t){const e=await nl(t),n=e.eventManager;return n.onListen=Kg.bind(null,e.syncEngine),n.onUnlisten=zg.bind(null,e.syncEngine),n}function lm(t,e,n={}){const i=new we;return t.asyncQueue.enqueueAndForget(async()=>function(s,r,o,a,c){const u=new lo({next:h=>{r.enqueueAndForget(()=>oo(s,l));const d=h.docs.has(o);!d&&h.fromCache?c.reject(new v(f.UNAVAILABLE,"Failed to get document because the client is offline.")):d&&h.fromCache&&a&&a.source==="server"?c.reject(new v(f.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(h)},error:h=>c.reject(h)}),l=new co(Wi(o.path),u,{includeMetadataChanges:!0,uc:!0});return ro(s,l)}(await Ti(t),t.asyncQueue,e,n,i)),i.promise}function hm(t,e,n={}){const i=new we;return t.asyncQueue.enqueueAndForget(async()=>function(s,r,o,a,c){const u=new lo({next:h=>{r.enqueueAndForget(()=>oo(s,l)),h.fromCache&&a.source==="server"?c.reject(new v(f.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(h)},error:h=>c.reject(h)}),l=new co(o,u,{includeMetadataChanges:!0,uc:!0});return ro(s,l)}(await Ti(t),t.asyncQueue,e,n,i)),i.promise}const Sa=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function il(t,e,n){if(!n)throw new v(f.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function dm(t,e,n,i){if(e===!0&&i===!0)throw new v(f.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function ba(t){if(!E.isDocumentKey(t))throw new v(f.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Aa(t){if(E.isDocumentKey(t))throw new v(f.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function is(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":T()}function he(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new v(f.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=is(t);throw new v(f.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ka{constructor(e){var n;if(e.host===void 0){if(e.ssl!==void 0)throw new v(f.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new v(f.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.useFetchStreams=!!e.useFetchStreams,dm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling)}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(e,n,i){this._authCredentials=n,this._appCheckCredentials=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ka({}),this._settingsFrozen=!1,e instanceof It?this._databaseId=e:(this._app=e,this._databaseId=function(s){if(!Object.prototype.hasOwnProperty.apply(s.options,["projectId"]))throw new v(f.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new It(s.options.projectId)}(e))}get app(){if(!this._app)throw new v(f.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new v(f.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ka(e),e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new Bf;switch(n.type){case"gapi":const i=n.client;return D(!(typeof i!="object"||i===null||!i.auth||!i.auth.getAuthHeaderValueForFirstParty)),new Hf(i,n.sessionIndex||"0",n.iamToken||null);case"provider":return n.client;default:throw new v(f.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const n=Sa.get(e);n&&(_("ComponentProvider","Removing Datastore"),Sa.delete(e),n.terminate())}(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(e,n,i){this.converter=n,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Re(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Z(this.firestore,e,this._key)}}class Ft{constructor(e,n,i){this.converter=n,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Ft(this.firestore,e,this._query)}}class Re extends Ft{constructor(e,n,i){super(e,n,Wi(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Z(this.firestore,null,new E(e))}withConverter(e){return new Re(this.firestore,e,this._path)}}function Sw(t,e,...n){if(t=B(t),il("collection","path",e),t instanceof ho){const i=O.fromString(e,...n);return Aa(i),new Re(t,null,i)}{if(!(t instanceof Z||t instanceof Re))throw new v(f.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=t._path.child(O.fromString(e,...n));return Aa(i),new Re(t.firestore,null,i)}}function bw(t,e,...n){if(t=B(t),arguments.length===1&&(e=hu.R()),il("doc","path",e),t instanceof ho){const i=O.fromString(e,...n);return ba(i),new Z(t,null,new E(i))}{if(!(t instanceof Z||t instanceof Re))throw new v(f.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=t._path.child(O.fromString(e,...n));return ba(i),new Z(t.firestore,t instanceof Re?t.converter:null,new E(i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fm{constructor(){this.hu=Promise.resolve(),this.lu=[],this.fu=!1,this.du=[],this._u=null,this.wu=!1,this.mu=!1,this.gu=[],this.ro=new Bu(this,"async_queue_retry"),this.yu=()=>{const n=ks();n&&_("AsyncQueue","Visibility state changed to "+n.visibilityState),this.ro.Yr()};const e=ks();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.yu)}get isShuttingDown(){return this.fu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.pu(),this.Iu(e)}enterRestrictedMode(e){if(!this.fu){this.fu=!0,this.mu=e||!1;const n=ks();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.yu)}}enqueue(e){if(this.pu(),this.fu)return new Promise(()=>{});const n=new we;return this.Iu(()=>this.fu&&this.mu?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.lu.push(e),this.Eu()))}async Eu(){if(this.lu.length!==0){try{await this.lu[0](),this.lu.shift(),this.ro.reset()}catch(e){if(!Dn(e))throw e;_("AsyncQueue","Operation failed with retryable error: "+e)}this.lu.length>0&&this.ro.Hr(()=>this.Eu())}}Iu(e){const n=this.hu.then(()=>(this.wu=!0,e().catch(i=>{this._u=i,this.wu=!1;const s=function(r){let o=r.message||"";return r.stack&&(o=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),o}(i);throw Pe("INTERNAL UNHANDLED ERROR: ",s),i}).then(i=>(this.wu=!1,i))));return this.hu=n,n}enqueueAfterDelay(e,n,i){this.pu(),this.gu.indexOf(e)>-1&&(n=0);const s=io.createAndSchedule(this,e,n,i,r=>this.Tu(r));return this.du.push(s),s}pu(){this._u&&T()}verifyOperationInProgress(){}async Au(){let e;do e=this.hu,await e;while(e!==this.hu)}Ru(e){for(const n of this.du)if(n.timerId===e)return!0;return!1}Pu(e){return this.Au().then(()=>{this.du.sort((n,i)=>n.targetTimeMs-i.targetTimeMs);for(const n of this.du)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Au()})}bu(e){this.gu.push(e)}Tu(e){const n=this.du.indexOf(e);this.du.splice(n,1)}}function Ca(t){return function(e,n){if(typeof e!="object"||e===null)return!1;const i=e;for(const s of n)if(s in i&&typeof i[s]=="function")return!0;return!1}(t,["next","error","complete"])}class tt extends ho{constructor(e,n,i){super(e,n,i),this.type="firestore",this._queue=new fm,this._persistenceKey="name"in e?e.name:"[DEFAULT]"}_terminate(){return this._firestoreClient||sl(this),this._firestoreClient.terminate()}}function Aw(t=mr()){return Li(t,"firestore").getImmediate()}function ss(t){return t._firestoreClient||sl(t),t._firestoreClient.verifyNotTerminated(),t._firestoreClient}function sl(t){var e;const n=t._freezeSettings(),i=function(s,r,o,a){return new Jf(s,r,o,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,a.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,n);t._firestoreClient=new rm(t._authCredentials,t._appCheckCredentials,t._queue,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new v(f.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new oe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ct(X.fromBase64String(e))}catch(n){throw new v(f.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Ct(X.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fo{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new v(f.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new v(f.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return R(this._lat,e._lat)||R(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pm=/^__.*__$/;class gm{constructor(e,n,i){this.data=e,this.fieldMask=n,this.fieldTransforms=i}toMutation(e,n){return this.fieldMask!==null?new Ut(e,this.data,this.fieldMask,n,this.fieldTransforms):new Qi(e,this.data,n,this.fieldTransforms)}}class rl{constructor(e,n,i){this.data=e,this.fieldMask=n,this.fieldTransforms=i}toMutation(e,n){return new Ut(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function ol(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw T()}}class os{constructor(e,n,i,s,r,o){this.settings=e,this.databaseId=n,this.O=i,this.ignoreUndefinedProperties=s,r===void 0&&this.vu(),this.fieldTransforms=r||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Vu(){return this.settings.Vu}Su(e){return new os(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.O,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Du(e){var n;const i=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.Su({path:i,Cu:!1});return s.Nu(e),s}xu(e){var n;const i=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.Su({path:i,Cu:!1});return s.vu(),s}ku(e){return this.Su({path:void 0,Cu:!0})}Ou(e){return Si(e,this.settings.methodName,this.settings.Mu||!1,this.path,this.settings.$u)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Nu(this.path.get(e))}Nu(e){if(e.length===0)throw this.Ou("Document fields must not be empty");if(ol(this.Vu)&&pm.test(e))throw this.Ou('Document fields cannot begin and end with "__"')}}class mm{constructor(e,n,i){this.databaseId=e,this.ignoreUndefinedProperties=n,this.O=i||es(e)}Fu(e,n,i,s=!1){return new os({Vu:e,methodName:n,$u:i,path:oe.emptyPath(),Cu:!1,Mu:s},this.databaseId,this.O,this.ignoreUndefinedProperties)}}function po(t){const e=t._freezeSettings(),n=es(t._databaseId);return new mm(t._databaseId,!!e.ignoreUndefinedProperties,n)}function ym(t,e,n,i,s,r={}){const o=t.Fu(r.merge||r.mergeFields?2:0,e,n,s);go("Data must be an object, but it was:",o,i);const a=cl(i,o);let c,u;if(r.merge)c=new ln(o.fieldMask),u=o.fieldTransforms;else if(r.mergeFields){const l=[];for(const h of r.mergeFields){const d=rr(e,h,n);if(!o.contains(d))throw new v(f.INVALID_ARGUMENT,`Field '${d}' is specified in your field mask but missing from your input data.`);ll(l,d)||l.push(d)}c=new ln(l),u=o.fieldTransforms.filter(h=>c.covers(h.field))}else c=null,u=o.fieldTransforms;return new gm(new ae(a),c,u)}class as extends xn{_toFieldTransform(e){if(e.Vu!==2)throw e.Vu===1?e.Ou(`${this._methodName}() can only appear at the top level of your update data`):e.Ou(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof as}}function al(t,e,n){return new os({Vu:3,$u:e.settings.$u,methodName:t._methodName,Cu:n},e.databaseId,e.O,e.ignoreUndefinedProperties)}class vm extends xn{constructor(e,n){super(e),this.Bu=n}_toFieldTransform(e){const n=al(this,e,!0),i=this.Bu.map(r=>at(r,n)),s=new St(i);return new Cu(e.path,s)}isEqual(e){return this===e}}class wm extends xn{constructor(e,n){super(e),this.Bu=n}_toFieldTransform(e){const n=al(this,e,!0),i=this.Bu.map(r=>at(r,n)),s=new bt(i);return new Cu(e.path,s)}isEqual(e){return this===e}}function _m(t,e,n,i){const s=t.Fu(1,e,n);go("Data must be an object, but it was:",s,i);const r=[],o=ae.empty();rt(i,(c,u)=>{const l=mo(e,c,n);u=B(u);const h=s.xu(l);if(u instanceof as)r.push(l);else{const d=at(u,h);d!=null&&(r.push(l),o.set(l,d))}});const a=new ln(r);return new rl(o,a,s.fieldTransforms)}function Em(t,e,n,i,s,r){const o=t.Fu(1,e,n),a=[rr(e,i,n)],c=[s];if(r.length%2!=0)throw new v(f.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<r.length;d+=2)a.push(rr(e,r[d])),c.push(r[d+1]);const u=[],l=ae.empty();for(let d=a.length-1;d>=0;--d)if(!ll(u,a[d])){const g=a[d];let m=c[d];m=B(m);const b=o.xu(g);if(m instanceof as)u.push(g);else{const C=at(m,b);C!=null&&(u.push(g),l.set(g,C))}}const h=new ln(u);return new rl(l,h,o.fieldTransforms)}function Im(t,e,n,i=!1){return at(n,t.Fu(i?4:3,e))}function at(t,e){if(ul(t=B(t)))return go("Unsupported field value:",e,t),cl(t,e);if(t instanceof xn)return function(n,i){if(!ol(i.Vu))throw i.Ou(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Ou(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.Cu&&e.Vu!==4)throw e.Ou("Nested arrays are not supported");return function(n,i){const s=[];let r=0;for(const o of n){let a=at(o,i.ku(r));a==null&&(a={nullValue:"NULL_VALUE"}),s.push(a),r++}return{arrayValue:{values:s}}}(t,e)}return function(n,i){if((n=B(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return hp(i.O,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=ce.fromDate(n);return{timestampValue:Ei(i.O,s)}}if(n instanceof ce){const s=new ce(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Ei(i.O,s)}}if(n instanceof fo)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Ct)return{bytesValue:Lu(i.O,n._byteString)};if(n instanceof Z){const s=i.databaseId,r=n.firestore._databaseId;if(!r.isEqual(s))throw i.Ou(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Xr(n.firestore._databaseId||i.databaseId,n._key.path)}}throw i.Ou(`Unsupported field value: ${is(n)}`)}(t,e)}function cl(t,e){const n={};return du(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):rt(t,(i,s)=>{const r=at(s,e.Du(i));r!=null&&(n[i]=r)}),{mapValue:{fields:n}}}function ul(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof ce||t instanceof fo||t instanceof Ct||t instanceof Z||t instanceof xn)}function go(t,e,n){if(!ul(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const i=is(n);throw i==="an object"?e.Ou(t+" a custom object"):e.Ou(t+" "+i)}}function rr(t,e,n){if((e=B(e))instanceof rs)return e._internalPath;if(typeof e=="string")return mo(t,e);throw Si("Field path arguments must be of type string or ",t,!1,void 0,n)}const Tm=new RegExp("[~\\*/\\[\\]]");function mo(t,e,n){if(e.search(Tm)>=0)throw Si(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new rs(...e.split("."))._internalPath}catch{throw Si(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Si(t,e,n,i,s){const r=i&&!i.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(r||o)&&(c+=" (found",r&&(c+=` in field ${i}`),o&&(c+=` in document ${s}`),c+=")"),new v(f.INVALID_ARGUMENT,a+t+c)}function ll(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e,n,i,s,r){this._firestore=e,this._userDataWriter=n,this._key=i,this._document=s,this._converter=r}get id(){return this._key.path.lastSegment()}get ref(){return new Z(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Sm(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(yo("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class Sm extends hl{data(){return super.data()}}function yo(t,e){return typeof e=="string"?mo(t,e):e instanceof rs?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class dl extends hl{constructor(e,n,i,s,r,o){super(e,n,i,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=r}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new ei(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const i=this._document.data.field(yo("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,n.serverTimestamps)}}}class ei extends dl{data(e={}){return super.data(e)}}class fl{constructor(e,n,i,s){this._firestore=e,this._userDataWriter=n,this._snapshot=s,this.metadata=new Gt(s.hasPendingWrites,s.fromCache),this.query=i}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(i=>{e.call(n,new ei(this._firestore,this._userDataWriter,i.key,i,new Gt(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new v(f.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let r=0;return i._snapshot.docChanges.map(o=>({type:"added",doc:new ei(i._firestore,i._userDataWriter,o.doc.key,o.doc,new Gt(i._snapshot.mutatedKeys.has(o.doc.key),i._snapshot.fromCache),i.query.converter),oldIndex:-1,newIndex:r++}))}{let r=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(o=>s||o.type!==3).map(o=>{const a=new ei(i._firestore,i._userDataWriter,o.doc.key,o.doc,new Gt(i._snapshot.mutatedKeys.has(o.doc.key),i._snapshot.fromCache),i.query.converter);let c=-1,u=-1;return o.type!==0&&(c=r.indexOf(o.doc.key),r=r.delete(o.doc.key)),o.type!==1&&(r=r.add(o.doc),u=r.indexOf(o.doc.key)),{type:bm(o.type),doc:a,oldIndex:c,newIndex:u}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function bm(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return T()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pl(t){if(vi(t)&&t.explicitOrderBy.length===0)throw new v(f.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Am{}function kw(t,...e){for(const n of e)t=n._apply(t);return t}class km extends Am{constructor(e,n,i){super(),this.Uu=e,this.qu=n,this.Ku=i,this.type="where"}_apply(e){const n=po(e.firestore),i=function(s,r,o,a,c,u,l){let h;if(c.isKeyField()){if(u==="array-contains"||u==="array-contains-any")throw new v(f.INVALID_ARGUMENT,`Invalid Query. You can't perform '${u}' queries on documentId().`);if(u==="in"||u==="not-in"){Ra(l,u);const g=[];for(const m of l)g.push(Na(a,s,m));h={arrayValue:{values:g}}}else h=Na(a,s,l)}else u!=="in"&&u!=="not-in"&&u!=="array-contains-any"||Ra(l,u),h=Im(o,r,l,u==="in"||u==="not-in");const d=se.create(c,u,h);return function(g,m){if(m.S()){const C=vu(g);if(C!==null&&!C.isEqual(m.field))throw new v(f.INVALID_ARGUMENT,`Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${C.toString()}' and '${m.field.toString()}'`);const H=yu(g);H!==null&&Cm(g,m.field,H)}const b=function(C,H){for(const ee of C.filters)if(H.indexOf(ee.op)>=0)return ee.op;return null}(g,function(C){switch(C){case"!=":return["!=","not-in"];case"array-contains":return["array-contains","array-contains-any","not-in"];case"in":return["array-contains-any","in","not-in"];case"array-contains-any":return["array-contains","array-contains-any","in","not-in"];case"not-in":return["array-contains","array-contains-any","in","not-in","!="];default:return[]}}(m.op));if(b!==null)throw b===m.op?new v(f.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${m.op.toString()}' filter.`):new v(f.INVALID_ARGUMENT,`Invalid query. You cannot use '${m.op.toString()}' filters with '${b.toString()}' filters.`)}(s,d),d}(e._query,"where",n,e.firestore._databaseId,this.Uu,this.qu,this.Ku);return new Ft(e.firestore,e.converter,function(s,r){const o=s.filters.concat([r]);return new Nn(s.path,s.collectionGroup,s.explicitOrderBy.slice(),o,s.limit,s.limitType,s.startAt,s.endAt)}(e._query,i))}}function Cw(t,e,n){const i=e,s=yo("where",t);return new km(s,i,n)}function Na(t,e,n){if(typeof(n=B(n))=="string"){if(n==="")throw new v(f.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!wu(e)&&n.indexOf("/")!==-1)throw new v(f.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const i=e.path.child(O.fromString(n));if(!E.isDocumentKey(i))throw new v(f.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return ta(t,new E(i))}if(n instanceof Z)return ta(t,n._key);throw new v(f.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${is(n)}.`)}function Ra(t,e){if(!Array.isArray(t)||t.length===0)throw new v(f.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);if(t.length>10)throw new v(f.INVALID_ARGUMENT,`Invalid Query. '${e.toString()}' filters support a maximum of 10 elements in the value array.`)}function Cm(t,e,n){if(!n.isEqual(e))throw new v(f.INVALID_ARGUMENT,`Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${e.toString()}' and so you must also use '${e.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${n.toString()}' instead.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{convertValue(e,n="none"){switch(Qe(e)){case 0:return null;case 1:return e.booleanValue;case 2:return x(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Et(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 10:return this.convertObject(e.mapValue,n);default:throw T()}}convertObject(e,n){const i={};return rt(e.fields,(s,r)=>{i[s]=this.convertValue(r,n)}),i}convertGeoPoint(e){return new fo(x(e.latitude),x(e.longitude))}convertArray(e,n){return(e.values||[]).map(i=>this.convertValue(i,n))}convertServerTimestamp(e,n){switch(n){case"previous":const i=pu(e);return i==null?null:this.convertValue(i,n);case"estimate":return this.convertTimestamp(hn(e));default:return null}}convertTimestamp(e){const n=Le(e);return new ce(n.seconds,n.nanos)}convertDocumentKey(e,n){const i=O.fromString(e);D(Vu(i));const s=new It(i.get(1),i.get(3)),r=new E(i.popFirst(5));return s.isEqual(n)||Pe(`Document ${r} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rm(t,e,n){let i;return i=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nw(t){t=he(t,Z);const e=he(t.firestore,tt);return lm(ss(e),t._key).then(n=>ml(e,t,n))}class vo extends Nm{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ct(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Z(this.firestore,null,n)}}function Rw(t){t=he(t,Ft);const e=he(t.firestore,tt),n=ss(e),i=new vo(e);return pl(t._query),hm(n,t._query).then(s=>new fl(e,i,t,s))}function Dw(t,e,n){t=he(t,Z);const i=he(t.firestore,tt),s=Rm(t.converter,e,n);return gl(i,[ym(po(i),"setDoc",t._key,s,t.converter!==null,n).toMutation(t._key,He.none())])}function Ow(t,e,n,...i){t=he(t,Z);const s=he(t.firestore,tt),r=po(s);let o;return o=typeof(e=B(e))=="string"||e instanceof rs?Em(r,"updateDoc",t._key,e,n,i):_m(r,"updateDoc",t._key,e),gl(s,[o.toMutation(t._key,He.exists(!0))])}function Pw(t,...e){var n,i,s;t=B(t);let r={includeMetadataChanges:!1},o=0;typeof e[o]!="object"||Ca(e[o])||(r=e[o],o++);const a={includeMetadataChanges:r.includeMetadataChanges};if(Ca(e[o])){const h=e[o];e[o]=(n=h.next)===null||n===void 0?void 0:n.bind(h),e[o+1]=(i=h.error)===null||i===void 0?void 0:i.bind(h),e[o+2]=(s=h.complete)===null||s===void 0?void 0:s.bind(h)}let c,u,l;if(t instanceof Z)u=he(t.firestore,tt),l=Wi(t._key.path),c={next:h=>{e[o]&&e[o](ml(u,t,h))},error:e[o+1],complete:e[o+2]};else{const h=he(t,Ft);u=he(h.firestore,tt),l=h._query;const d=new vo(u);c={next:g=>{e[o]&&e[o](new fl(u,d,h,g))},error:e[o+1],complete:e[o+2]},pl(t._query)}return function(h,d,g,m){const b=new lo(m),C=new co(d,b,g);return h.asyncQueue.enqueueAndForget(async()=>ro(await Ti(h),C)),()=>{b.Jc(),h.asyncQueue.enqueueAndForget(async()=>oo(await Ti(h),C))}}(ss(u),l,a,c)}function gl(t,e){return function(n,i){const s=new we;return n.asyncQueue.enqueueAndForget(async()=>Wg(await um(n),i,s)),s.promise}(ss(t),e)}function ml(t,e,n){const i=n.docs.get(e._key),s=new vo(t);return new dl(t,s,e._key,i,new Gt(n.hasPendingWrites,n.fromCache),e.converter)}function Lw(...t){return new vm("arrayUnion",t)}function Mw(...t){return new wm("arrayRemove",t)}(function(t,e=!0){(function(n){Mt=n})(wn),ze(new De("firestore",(n,{options:i})=>{const s=n.getProvider("app").getImmediate(),r=new tt(s,new qf(n.getProvider("auth-internal")),new Gf(n.getProvider("app-check-internal")));return i=Object.assign({useFetchStreams:e},i),r._setSettings(i),r},"PUBLIC")),de(Jo,"3.4.5",t),de(Jo,"3.4.5","esm2017")})();/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function wo(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,i=Object.getOwnPropertySymbols(t);s<i.length;s++)e.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(t,i[s])&&(n[i[s]]=t[i[s]]);return n}function yl(){return{["dependent-sdk-initialized-before-auth"]:"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Dm=yl,vl=new yn("auth","Firebase",yl());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Da=new dr("@firebase/auth");function ti(t,...e){Da.logLevel<=N.ERROR&&Da.error(`Auth (${wn}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(t,...e){throw _o(t,...e)}function ue(t,...e){return _o(t,...e)}function Om(t,e,n){const i=Object.assign(Object.assign({},Dm()),{[e]:n});return new yn("auth","Firebase",i).create(e,{appName:t.name})}function _o(t,...e){if(typeof t!="string"){const n=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=t.name),t._errorFactory.create(n,...i)}return vl.create(t,...e)}function w(t,e,...n){if(!t)throw _o(e,...n)}function ye(t){const e="INTERNAL ASSERTION FAILED: "+t;throw ti(e),new Error(e)}function Te(t,e){t||ye(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oa=new Map;function ve(t){Te(t instanceof Function,"Expected a class definition");let e=Oa.get(t);return e?(Te(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Oa.set(t,e),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pm(t,e){const n=Li(t,"auth");if(n.isInitialized()){const s=n.getImmediate(),r=n.getOptions();if(ri(r,e!=null?e:{}))return s;Ie(s,"already-initialized")}return n.initialize({options:e})}function Lm(t,e){const n=(e==null?void 0:e.persistence)||[],i=(Array.isArray(n)?n:[n]).map(ve);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function or(){var t;return typeof self!="undefined"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function wl(){return Pa()==="http:"||Pa()==="https:"}function Pa(){var t;return typeof self!="undefined"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mm(){return typeof navigator!="undefined"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(wl()||rc()||"connection"in navigator)?navigator.onLine:!0}function xm(){if(typeof navigator=="undefined")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un{constructor(e,n){this.shortDelay=e,this.longDelay=n,Te(n>e,"Short delay should be less than long delay!"),this.isMobile=sc()||oc()}get(){return Mm()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eo(t,e){Te(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{static initialize(e,n,i){this.fetchImpl=e,n&&(this.headersImpl=n),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self!="undefined"&&"fetch"in self)return self.fetch;ye("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self!="undefined"&&"Headers"in self)return self.Headers;ye("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self!="undefined"&&"Response"in self)return self.Response;ye("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Um={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"internal-error",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vm=new Un(3e4,6e4);function ct(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Fe(t,e,n,i,s={}){return El(t,s,async()=>{let r={},o={};i&&(e==="GET"?o=i:r={body:JSON.stringify(i)});const a=Rt(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();return c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode),_l.fetch()(Il(t,t.config.apiHost,n,a),Object.assign({method:e,headers:c,referrerPolicy:"no-referrer"},r))})}async function El(t,e,n){t._canInitEmulator=!1;const i=Object.assign(Object.assign({},Um),e);try{const s=new Fm(t),r=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw ni(t,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const a=r.ok?o.errorMessage:o.error.message,[c,u]=a.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw ni(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw ni(t,"email-already-in-use",o);const l=i[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Om(t,l,u);Ie(t,l)}}catch(s){if(s instanceof xe)throw s;Ie(t,"network-request-failed")}}async function cs(t,e,n,i,s={}){const r=await Fe(t,e,n,i,s);return"mfaPendingCredential"in r&&Ie(t,"multi-factor-auth-required",{_serverResponse:r}),r}function Il(t,e,n,i){const s=`${e}${n}?${i}`;return t.config.emulator?Eo(t.config,s):`${t.config.apiScheme}://${s}`}class Fm{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,i)=>{this.timer=setTimeout(()=>i(ue(this.auth,"network-request-failed")),Vm.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ni(t,e,n){const i={appName:t.name};n.email&&(i.email=n.email),n.phoneNumber&&(i.phoneNumber=n.phoneNumber);const s=ue(t,e,i);return s.customData._tokenResponse=n,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $m(t,e){return Fe(t,"POST","/v1/accounts:delete",e)}async function Bm(t,e){return Fe(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(t){if(!!t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function qm(t,e=!1){const n=B(t),i=await n.getIdToken(e),s=Io(i);w(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const r=typeof s.firebase=="object"?s.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:s,token:i,authTime:Zt(Cs(s.auth_time)),issuedAtTime:Zt(Cs(s.iat)),expirationTime:Zt(Cs(s.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function Cs(t){return Number(t)*1e3}function Io(t){const[e,n,i]=t.split(".");if(e===void 0||n===void 0||i===void 0)return ti("JWT malformed, contained fewer than 3 sections"),null;try{const s=vh(n);return s?JSON.parse(s):(ti("Failed to decode base64 JWT payload"),null)}catch(s){return ti("Caught error parsing JWT payload as JSON",s),null}}function jm(t){const e=Io(t);return w(e,"internal-error"),w(typeof e.exp!="undefined","internal-error"),w(typeof e.iat!="undefined","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pn(t,e,n=!1){if(n)return e;try{return await e}catch(i){throw i instanceof xe&&Hm(i)&&t.auth.currentUser===t&&await t.auth.signOut(),i}}function Hm({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Km{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){!this.isRunning||(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const s=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Zt(this.lastLoginAt),this.creationTime=Zt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bi(t){var e;const n=t.auth,i=await t.getIdToken(),s=await pn(t,Bm(n,{idToken:i}));w(s==null?void 0:s.users.length,n,"internal-error");const r=s.users[0];t._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?Wm(r.providerUserInfo):[],a=zm(t.providerData,o),c=t.isAnonymous,u=!(t.email&&r.passwordHash)&&!(a!=null&&a.length),l=c?u:!1,h={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new Tl(r.createdAt,r.lastLoginAt),isAnonymous:l};Object.assign(t,h)}async function Gm(t){const e=B(t);await bi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function zm(t,e){return[...t.filter(i=>!e.some(s=>s.providerId===i.providerId)),...e]}function Wm(t){return t.map(e=>{var{providerId:n}=e,i=wo(e,["providerId"]);return{providerId:n,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xm(t,e){const n=await El(t,{},async()=>{const i=Rt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:r}=t.config,o=Il(t,s,"/v1/token",`key=${r}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",_l.fetch()(o,{method:"POST",headers:a,body:i})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){w(e.idToken,"internal-error"),w(typeof e.idToken!="undefined","internal-error"),w(typeof e.refreshToken!="undefined","internal-error");const n="expiresIn"in e&&typeof e.expiresIn!="undefined"?Number(e.expiresIn):jm(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}async getToken(e,n=!1){return w(!this.accessToken||this.refreshToken,e,"user-token-expired"),!n&&this.accessToken&&!this.isExpired?this.accessToken:this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:i,refreshToken:s,expiresIn:r}=await Xm(e,n);this.updateTokensAndExpiration(i,s,Number(r))}updateTokensAndExpiration(e,n,i){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,n){const{refreshToken:i,accessToken:s,expirationTime:r}=n,o=new gn;return i&&(w(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),s&&(w(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),r&&(w(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new gn,this.toJSON())}_performRefresh(){return ye("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(t,e){w(typeof t=="string"||typeof t=="undefined","internal-error",{appName:e})}class Ge{constructor(e){var{uid:n,auth:i,stsTokenManager:s}=e,r=wo(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Km(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=i,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Tl(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const n=await pn(this,this.stsTokenManager.getToken(this.auth,e));return w(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return qm(this,e)}reload(){return Gm(this)}_assign(e){this!==e&&(w(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){return new Ge(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}))}_onReload(e){w(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),n&&await bi(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){const e=await this.getIdToken();return await pn(this,$m(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var i,s,r,o,a,c,u,l;const h=(i=n.displayName)!==null&&i!==void 0?i:void 0,d=(s=n.email)!==null&&s!==void 0?s:void 0,g=(r=n.phoneNumber)!==null&&r!==void 0?r:void 0,m=(o=n.photoURL)!==null&&o!==void 0?o:void 0,b=(a=n.tenantId)!==null&&a!==void 0?a:void 0,C=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,H=(u=n.createdAt)!==null&&u!==void 0?u:void 0,ee=(l=n.lastLoginAt)!==null&&l!==void 0?l:void 0,{uid:ge,emailVerified:Se,isAnonymous:$t,providerData:Bt,stsTokenManager:qt}=n;w(ge&&qt,e,"internal-error");const Xl=gn.fromJSON(this.name,qt);w(typeof ge=="string",e,"internal-error"),be(h,e.name),be(d,e.name),w(typeof Se=="boolean",e,"internal-error"),w(typeof $t=="boolean",e,"internal-error"),be(g,e.name),be(m,e.name),be(b,e.name),be(C,e.name),be(H,e.name),be(ee,e.name);const ds=new Ge({uid:ge,auth:e,email:d,emailVerified:Se,displayName:h,isAnonymous:$t,photoURL:m,phoneNumber:g,tenantId:b,stsTokenManager:Xl,createdAt:H,lastLoginAt:ee});return Bt&&Array.isArray(Bt)&&(ds.providerData=Bt.map(Jl=>Object.assign({},Jl))),C&&(ds._redirectEventId=C),ds}static async _fromIdTokenResponse(e,n,i=!1){const s=new gn;s.updateFromServerResponse(n);const r=new Ge({uid:n.localId,auth:e,stsTokenManager:s,isAnonymous:i});return await bi(r),r}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sl{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Sl.type="NONE";const La=Sl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ii(t,e,n){return`firebase:${t}:${e}:${n}`}class mt{constructor(e,n,i){this.persistence=e,this.auth=n,this.userKey=i;const{config:s,name:r}=this.auth;this.fullUserKey=ii(this.userKey,s.apiKey,r),this.fullPersistenceKey=ii("persistence",s.apiKey,r),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ge._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,i="authUser"){if(!n.length)return new mt(ve(La),e,i);const s=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let r=s[0]||ve(La);const o=ii(i,e.config.apiKey,e.name);let a=null;for(const u of n)try{const l=await u._get(o);if(l){const h=Ge._fromJSON(e,l);u!==r&&(a=h),r=u;break}}catch{}const c=s.filter(u=>u._shouldAllowMigration);return!r._shouldAllowMigration||!c.length?new mt(r,e,i):(r=c[0],a&&await r._set(o,a.toJSON()),await Promise.all(n.map(async u=>{if(u!==r)try{await u._remove(o)}catch{}})),new mt(r,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(kl(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(bl(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Nl(e))return"Blackberry";if(Rl(e))return"Webos";if(To(e))return"Safari";if((e.includes("chrome/")||Al(e))&&!e.includes("edge/"))return"Chrome";if(Cl(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=t.match(n);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function bl(t=$()){return/firefox\//i.test(t)}function To(t=$()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Al(t=$()){return/crios\//i.test(t)}function kl(t=$()){return/iemobile/i.test(t)}function Cl(t=$()){return/android/i.test(t)}function Nl(t=$()){return/blackberry/i.test(t)}function Rl(t=$()){return/webos/i.test(t)}function us(t=$()){return/iphone|ipad|ipod/i.test(t)}function Jm(t=$()){var e;return us(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Ym(){return ac()&&document.documentMode===10}function Dl(t=$()){return us(t)||Cl(t)||Rl(t)||Nl(t)||/windows phone/i.test(t)||kl(t)}function Qm(){try{return!!(window&&window!==window.top)}catch{return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ol(t,e=[]){let n;switch(t){case"Browser":n=Ma($());break;case"Worker":n=`${Ma($())}-${t}`;break;default:n=t}const i=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${wn}/${i}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(e,n){this.app=e,this.config=n,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new xa(this),this.idTokenSubscription=new xa(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=vl,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=n.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ve(n)),this._initializationPromise=this.queue(async()=>{var i,s;if(!this._deleted&&(this.persistenceManager=await mt.create(this,e),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e)}}async initializeCurrentUser(e){var n;let i=await this.assertedPersistence.getCurrentUser();if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const s=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,r=i==null?void 0:i._redirectEventId,o=await this.tryRedirectSignIn(e);(!s||s===r)&&(o==null?void 0:o.user)&&(i=o.user)}return i?i._redirectEventId?(w(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)):this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await bi(e)}catch(n){if(n.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=xm()}async _delete(){this._deleted=!0}async updateCurrentUser(e){const n=e?B(e):null;return n&&w(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e){if(!this._deleted)return e&&w(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null)}setPersistence(e){return this.queue(async()=>{await this.assertedPersistence.setPersistence(ve(e))})}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new yn("auth","Firebase",e())}onAuthStateChanged(e,n,i){return this.registerStateListener(this.authStateSubscription,e,n,i)}onIdTokenChanged(e,n,i){return this.registerStateListener(this.idTokenSubscription,e,n,i)}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const i=await this.getOrInitRedirectPersistenceManager(n);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ve(e)||this._popupRedirectResolver;w(n,this,"argument-error"),this.redirectPersistenceManager=await mt.create(this,[ve(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,i;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,i,s){if(this._deleted)return()=>{};const r=typeof n=="function"?n:n.next.bind(n),o=this._isInitialized?Promise.resolve():this._initializationPromise;return w(o,this,"internal-error"),o.then(()=>r(this.currentUser)),typeof n=="function"?e.addObserver(n,i,s):e.addObserver(n)}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&(this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh()),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return w(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ol(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={["X-Client-Version"]:this.clientVersion};return this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId),e}}function Vn(t){return B(t)}class xa{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ch(n=>this.observer=n)}get next(){return w(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return ye("not implemented")}_getIdTokenResponse(e){return ye("not implemented")}_linkToIdToken(e,n){return ye("not implemented")}_getReauthenticationResolver(e){return ye("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yt(t,e){return cs(t,"POST","/v1/accounts:signInWithIdp",ct(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ey="http://localhost";class nt extends So{constructor(){super(...arguments);this.pendingToken=null}static _fromParams(e){const n=new nt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Ie("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:s}=n,r=wo(n,["providerId","signInMethod"]);if(!i||!s)return null;const o=new nt(i,s);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return yt(e,n)}_linkToIdToken(e,n){const i=this.buildRequest();return i.idToken=n,yt(e,i)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,yt(e,n)}buildRequest(){const e={requestUri:ey,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Rt(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ty(t,e){return Fe(t,"POST","/v1/accounts:sendVerificationCode",ct(t,e))}async function ny(t,e){return cs(t,"POST","/v1/accounts:signInWithPhoneNumber",ct(t,e))}async function iy(t,e){const n=await cs(t,"POST","/v1/accounts:signInWithPhoneNumber",ct(t,e));if(n.temporaryProof)throw ni(t,"account-exists-with-different-credential",n);return n}const sy={USER_NOT_FOUND:"user-not-found"};async function ry(t,e){const n=Object.assign(Object.assign({},e),{operation:"REAUTH"});return cs(t,"POST","/v1/accounts:signInWithPhoneNumber",ct(t,n),sy)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en extends So{constructor(e){super("phone","phone");this.params=e}static _fromVerification(e,n){return new en({verificationId:e,verificationCode:n})}static _fromTokenResponse(e,n){return new en({phoneNumber:e,temporaryProof:n})}_getIdTokenResponse(e){return ny(e,this._makeVerificationRequest())}_linkToIdToken(e,n){return iy(e,Object.assign({idToken:n},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return ry(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:n,verificationId:i,verificationCode:s}=this.params;return e&&n?{temporaryProof:e,phoneNumber:n}:{sessionInfo:i,code:s}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:n,verificationCode:i,phoneNumber:s,temporaryProof:r}=e;return!i&&!n&&!s&&!r?null:new en({verificationId:n,verificationCode:i,phoneNumber:s,temporaryProof:r})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn extends Pl{constructor(){super(...arguments);this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae extends Fn{constructor(){super("facebook.com")}static credential(e){return nt._fromParams({providerId:Ae.PROVIDER_ID,signInMethod:Ae.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ae.credentialFromTaggedObject(e)}static credentialFromError(e){return Ae.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ae.credential(e.oauthAccessToken)}catch{return null}}}Ae.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ae.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke extends Fn{constructor(){super("google.com");this.addScope("profile")}static credential(e,n){return nt._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:i}=e;if(!n&&!i)return null;try{return ke.credential(n,i)}catch{return null}}}ke.GOOGLE_SIGN_IN_METHOD="google.com";ke.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce extends Fn{constructor(){super("github.com")}static credential(e){return nt._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ce.credential(e.oauthAccessToken)}catch{return null}}}Ce.GITHUB_SIGN_IN_METHOD="github.com";Ce.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne extends Fn{constructor(){super("twitter.com")}static credential(e,n){return nt._fromParams({providerId:Ne.PROVIDER_ID,signInMethod:Ne.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ne.credentialFromTaggedObject(e)}static credentialFromError(e){return Ne.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:i}=e;if(!n||!i)return null;try{return Ne.credential(n,i)}catch{return null}}}Ne.TWITTER_SIGN_IN_METHOD="twitter.com";Ne.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,i,s=!1){const r=await Ge._fromIdTokenResponse(e,i,s),o=Ua(i);return new Nt({user:r,providerId:o,_tokenResponse:i,operationType:n})}static async _forOperation(e,n,i){await e._updateTokensIfNecessary(i,!0);const s=Ua(i);return new Nt({user:e,providerId:s,_tokenResponse:i,operationType:n})}}function Ua(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai extends xe{constructor(e,n,i,s){var r;super(n.code,n.message);this.operationType=i,this.user=s,Object.setPrototypeOf(this,Ai.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:n.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,n,i,s){return new Ai(e,n,i,s)}}function Ll(t,e,n,i){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?Ai._fromErrorAndOperation(t,r,e,i):r})}async function oy(t,e,n=!1){const i=await pn(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Nt._forOperation(t,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ay(t,e,n=!1){const{auth:i}=t,s="reauthenticate";try{const r=await pn(t,Ll(i,s,e,t),n);w(r.idToken,i,"internal-error");const o=Io(r.idToken);w(o,i,"internal-error");const{sub:a}=o;return w(t.uid===a,i,"user-mismatch"),Nt._forOperation(t,s,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&Ie(i,"user-mismatch"),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ml(t,e,n=!1){const i="signIn",s=await Ll(t,i,e),r=await Nt._fromIdTokenResponse(t,i,s);return n||await t._updateCurrentUser(r.user),r}async function cy(t,e){return Ml(Vn(t),e)}function xw(t,e,n,i){return B(t).onAuthStateChanged(e,n,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uy(t,e){return Fe(t,"POST","/v2/accounts/mfaEnrollment:start",ct(t,e))}const ki="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xl{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ki,"1"),this.storage.removeItem(ki),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ly(){const t=$();return To(t)||us(t)}const hy=1e3,dy=10;class Ul extends xl{constructor(){super(()=>window.localStorage,"LOCAL");this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=ly()&&Qm(),this.fallbackToPolling=Dl(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const i=this.storage.getItem(n),s=this.localCache[n];i!==s&&e(n,s,i)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,c)=>{this.notifyListeners(o,c)});return}const i=e.key;if(n?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){const o=this.storage.getItem(i);if(e.newValue!==o)e.newValue!==null?this.storage.setItem(i,e.newValue):this.storage.removeItem(i);else if(this.localCache[i]===e.newValue&&!n)return}const s=()=>{const o=this.storage.getItem(i);!n&&this.localCache[i]===o||this.notifyListeners(i,o)},r=this.storage.getItem(i);Ym()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,dy):s()}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:i}),!0)})},hy)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ul.type="LOCAL";const fy=Ul;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl extends xl{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Vl.type="SESSION";const Fl=Vl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function py(t){return Promise.all(t.map(async e=>{try{const n=await e;return{fulfilled:!0,value:n}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(s=>s.isListeningto(e));if(n)return n;const i=new ls(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:i,eventType:s,data:r}=n.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:i,eventType:s});const a=Array.from(o).map(async u=>u(n.origin,r)),c=await py(a);n.ports[0].postMessage({status:"done",eventId:i,eventType:s,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ls.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bo(t="",e=10){let n="";for(let i=0;i<e;i++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,i=50){const s=typeof MessageChannel!="undefined"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let r,o;return new Promise((a,c)=>{const u=bo("",20);s.port1.start();const l=setTimeout(()=>{c(new Error("unsupported_event"))},i);o={messageChannel:s,onMessage(h){const d=h;if(d.data.eventId===u)switch(d.data.status){case"ack":clearTimeout(l),r=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),a(d.data.response);break;default:clearTimeout(l),clearTimeout(r),c(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(){return window}function my(t){V().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ao(){return typeof V().WorkerGlobalScope!="undefined"&&typeof V().importScripts=="function"}async function yy(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function vy(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function wy(){return Ao()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $l="firebaseLocalStorageDb",_y=1,Ci="firebaseLocalStorage",Bl="fbase_key";class $n{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function hs(t,e){return t.transaction([Ci],e?"readwrite":"readonly").objectStore(Ci)}function Ey(){const t=indexedDB.deleteDatabase($l);return new $n(t).toPromise()}function ar(){const t=indexedDB.open($l,_y);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const i=t.result;try{i.createObjectStore(Ci,{keyPath:Bl})}catch(s){n(s)}}),t.addEventListener("success",async()=>{const i=t.result;i.objectStoreNames.contains(Ci)?e(i):(i.close(),await Ey(),e(await ar()))})})}async function Va(t,e,n){const i=hs(t,!0).put({[Bl]:e,value:n});return new $n(i).toPromise()}async function Iy(t,e){const n=hs(t,!1).get(e),i=await new $n(n).toPromise();return i===void 0?null:i.value}function Fa(t,e){const n=hs(t,!0).delete(e);return new $n(n).toPromise()}const Ty=800,Sy=3;class ql{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ar(),this.db)}async _withRetries(e){let n=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(n++>Sy)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Ao()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ls._getInstance(wy()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await yy(),!this.activeServiceWorker)return;this.sender=new gy(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);!i||((e=i[0])===null||e===void 0?void 0:e.fulfilled)&&((n=i[0])===null||n===void 0?void 0:n.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||vy()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ar();return await Va(e,ki,"1"),await Fa(e,ki),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(i=>Va(i,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(i=>Iy(i,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Fa(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const r=hs(s,!1).getAll();return new $n(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],i=new Set;for(const{fbase_key:s,value:r}of e)i.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(r)&&(this.notifyListeners(s,r),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!i.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ty)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ql.type="LOCAL";const by=ql;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ay(t,e){return Fe(t,"POST","/v2/accounts/mfaSignIn:start",ct(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ky(t){return(await Fe(t,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cy(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}function jl(t){return new Promise((e,n)=>{const i=document.createElement("script");i.setAttribute("src",t),i.onload=e,i.onerror=s=>{const r=ue("internal-error");r.customData=s,n(r)},i.type="text/javascript",i.charset="UTF-8",Cy().appendChild(i)})}function Hl(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ny=500,Ry=6e4,zn=1e12;class Dy{constructor(e){this.auth=e,this.counter=zn,this._widgets=new Map}render(e,n){const i=this.counter;return this._widgets.set(i,new Oy(e,this.auth.name,n||{})),this.counter++,i}reset(e){var n;const i=e||zn;(n=this._widgets.get(i))===null||n===void 0||n.delete(),this._widgets.delete(i)}getResponse(e){var n;const i=e||zn;return((n=this._widgets.get(i))===null||n===void 0?void 0:n.getResponse())||""}async execute(e){var n;const i=e||zn;return(n=this._widgets.get(i))===null||n===void 0||n.execute(),""}}class Oy{constructor(e,n,i){this.params=i,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const s=typeof e=="string"?document.getElementById(e):e;w(s,"argument-error",{appName:n}),this.container=s,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=Py(50);const{callback:e,"expired-callback":n}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,n)try{n()}catch{}this.isVisible&&this.execute()},Ry)},Ny))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function Py(t){const e=[],n="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let i=0;i<t;i++)e.push(n.charAt(Math.floor(Math.random()*n.length)));return e.join("")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns=Hl("rcb"),Ly=new Un(3e4,6e4),My="https://www.google.com/recaptcha/api.js?";class xy{constructor(){this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!V().grecaptcha}load(e,n=""){return w(Uy(n),e,"argument-error"),this.shouldResolveImmediately(n)?Promise.resolve(V().grecaptcha):new Promise((i,s)=>{const r=V().setTimeout(()=>{s(ue(e,"network-request-failed"))},Ly.get());V()[Ns]=()=>{V().clearTimeout(r),delete V()[Ns];const a=V().grecaptcha;if(!a){s(ue(e,"internal-error"));return}const c=a.render;a.render=(u,l)=>{const h=c(u,l);return this.counter++,h},this.hostLanguage=n,i(a)};const o=`${My}?${Rt({onload:Ns,render:"explicit",hl:n})}`;jl(o).catch(()=>{clearTimeout(r),s(ue(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){return!!V().grecaptcha&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function Uy(t){return t.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(t)}class Vy{async load(e){return new Dy(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="recaptcha",Fy={theme:"light",type:"image"};class Uw{constructor(e,n=Object.assign({},Fy),i){this.parameters=n,this.type=Kl,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=Vn(i),this.isInvisible=this.parameters.size==="invisible",w(typeof document!="undefined",this.auth,"operation-not-supported-in-this-environment");const s=typeof e=="string"?document.getElementById(e):e;w(s,this.auth,"argument-error"),this.container=s,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new Vy:new xy,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),n=this.getAssertedRecaptcha(),i=n.getResponse(e);return i||new Promise(s=>{const r=o=>{!o||(this.tokenChangeListeners.delete(r),s(o))};this.tokenChangeListeners.add(r),this.isInvisible&&n.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){w(!this.parameters.sitekey,this.auth,"argument-error"),w(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),w(typeof document!="undefined",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return n=>{if(this.tokenChangeListeners.forEach(i=>i(n)),typeof e=="function")e(n);else if(typeof e=="string"){const i=V()[e];typeof i=="function"&&i(n)}}}assertNotDestroyed(){w(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const n=document.createElement("div");e.appendChild(n),e=n}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){w(wl()&&!Ao(),this.auth,"internal-error"),await $y(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await ky(this.auth);w(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return w(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function $y(){let t=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}t=()=>e(),window.addEventListener("load",t)}).catch(e=>{throw t&&window.removeEventListener("load",t),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{constructor(e,n){this.verificationId=e,this.onConfirmation=n}confirm(e){const n=en._fromVerification(this.verificationId,e);return this.onConfirmation(n)}}async function Vw(t,e,n){const i=Vn(t),s=await qy(i,e,B(n));return new By(s,r=>cy(i,r))}async function qy(t,e,n){var i;const s=await n.verify();try{w(typeof s=="string",t,"argument-error"),w(n.type===Kl,t,"argument-error");let r;if(typeof e=="string"?r={phoneNumber:e}:r=e,"session"in r){const o=r.session;if("phoneNumber"in r)return w(o.type==="enroll",t,"internal-error"),(await uy(t,{idToken:o.credential,phoneEnrollmentInfo:{phoneNumber:r.phoneNumber,recaptchaToken:s}})).phoneSessionInfo.sessionInfo;{w(o.type==="signin",t,"internal-error");const a=((i=r.multiFactorHint)===null||i===void 0?void 0:i.uid)||r.multiFactorUid;return w(a,t,"missing-multi-factor-info"),(await Ay(t,{mfaPendingCredential:o.credential,mfaEnrollmentId:a,phoneSignInInfo:{recaptchaToken:s}})).phoneResponseInfo.sessionInfo}}else{const{sessionInfo:o}=await ty(t,{phoneNumber:r.phoneNumber,recaptchaToken:s});return o}}finally{n._reset()}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jy(t,e){return e?ve(e):(w(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko extends So{constructor(e){super("custom","custom");this.params=e}_getIdTokenResponse(e){return yt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return yt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return yt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Hy(t){return Ml(t.auth,new ko(t),t.bypassAuthState)}function Ky(t){const{auth:e,user:n}=t;return w(n,e,"internal-error"),ay(n,new ko(t),t.bypassAuthState)}async function Gy(t){const{auth:e,user:n}=t;return w(n,e,"internal-error"),oy(n,new ko(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gl{constructor(e,n,i,s,r=!1){this.auth=e,this.resolver=i,this.user=s,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:i,postBody:s,tenantId:r,error:o,type:a}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:i,tenantId:r||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Hy;case"linkViaPopup":case"linkViaRedirect":return Gy;case"reauthViaPopup":case"reauthViaRedirect":return Ky;default:Ie(this.auth,"internal-error")}}resolve(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zy=new Un(2e3,1e4);class ft extends Gl{constructor(e,n,i,s,r){super(e,n,s,r);this.provider=i,this.authWindow=null,this.pollId=null,ft.currentPopupAction&&ft.currentPopupAction.cancel(),ft.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return w(e,this.auth,"internal-error"),e}async onExecution(){Te(this.filter.length===1,"Popup operations only handle one event");const e=bo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ue(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(ue(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ft.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,i;if(!((i=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ue(this.auth,"popup-closed-by-user"))},2e3);return}this.pollId=window.setTimeout(e,zy.get())};e()}}ft.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wy="pendingRedirect",Rs=new Map;class Xy extends Gl{constructor(e,n,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,i);this.eventId=null}async execute(){let e=Rs.get(this.auth._key());if(!e){try{const i=await Jy(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(n){e=()=>Promise.reject(n)}Rs.set(this.auth._key(),e)}return this.bypassAuthState||Rs.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Jy(t,e){const n=Qy(e),i=Yy(t);if(!await i._isAvailable())return!1;const s=await i._get(n)==="true";return await i._remove(n),s}function Yy(t){return ve(t._redirectPersistence)}function Qy(t){return ii(Wy,t.config.apiKey,t.name)}async function Zy(t,e,n=!1){const i=Vn(t),s=jy(i,e),o=await new Xy(i,s,n).execute();return o&&!n&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ev=10*60*1e3;class tv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(n=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!nv(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var i;if(e.error&&!zl(e)){const s=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";n.onError(ue(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const i=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=ev&&this.cachedEventUids.clear(),this.cachedEventUids.has($a(e))}saveEventToCache(e){this.cachedEventUids.add($a(e)),this.lastProcessedEventTime=Date.now()}}function $a(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function zl({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function nv(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return zl(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iv(t,e={}){return Fe(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,rv=/^https?/;async function ov(t){if(t.config.emulator)return;const{authorizedDomains:e}=await iv(t);for(const n of e)try{if(av(n))return}catch{}Ie(t,"unauthorized-domain")}function av(t){const e=or(),{protocol:n,hostname:i}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&i===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===i}if(!rv.test(n))return!1;if(sv.test(t))return i===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(i)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cv=new Un(3e4,6e4);function Ba(){const t=V().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function uv(t){return new Promise((e,n)=>{var i,s,r;function o(){Ba(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ba(),n(ue(t,"network-request-failed"))},timeout:cv.get()})}if(!((s=(i=V().gapi)===null||i===void 0?void 0:i.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((r=V().gapi)===null||r===void 0)&&r.load)o();else{const a=Hl("iframefcb");return V()[a]=()=>{gapi.load?o():n(ue(t,"network-request-failed"))},jl(`https://apis.google.com/js/api.js?onload=${a}`).catch(c=>n(c))}}).catch(e=>{throw si=null,e})}let si=null;function lv(t){return si=si||uv(t),si}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv=new Un(5e3,15e3),dv="__/auth/iframe",fv="emulator/auth/iframe",pv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},gv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function mv(t){const e=t.config;w(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Eo(e,fv):`https://${t.config.authDomain}/${dv}`,i={apiKey:e.apiKey,appName:t.name,v:wn},s=gv.get(t.config.apiHost);s&&(i.eid=s);const r=t._getFrameworks();return r.length&&(i.fw=r.join(",")),`${n}?${Rt(i).slice(1)}`}async function yv(t){const e=await lv(t),n=V().gapi;return w(n,t,"internal-error"),e.open({where:document.body,url:mv(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:pv,dontclear:!0},i=>new Promise(async(s,r)=>{await i.restyle({setHideOnLeave:!1});const o=ue(t,"network-request-failed"),a=V().setTimeout(()=>{r(o)},hv.get());function c(){V().clearTimeout(a),s(i)}i.ping(c).then(c,()=>{r(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},wv=500,_v=600,Ev="_blank",Iv="http://localhost";class qa{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Tv(t,e,n,i=wv,s=_v){const r=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let a="";const c=Object.assign(Object.assign({},vv),{width:i.toString(),height:s.toString(),top:r,left:o}),u=$().toLowerCase();n&&(a=Al(u)?Ev:n),bl(u)&&(e=e||Iv,c.scrollbars="yes");const l=Object.entries(c).reduce((d,[g,m])=>`${d}${g}=${m},`,"");if(Jm(u)&&a!=="_self")return Sv(e||"",a),new qa(null);const h=window.open(e||"",a,l);w(h,t,"popup-blocked");try{h.focus()}catch{}return new qa(h)}function Sv(t,e){const n=document.createElement("a");n.href=t,n.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bv="__/auth/handler",Av="emulator/auth/handler";function ja(t,e,n,i,s,r){w(t.config.authDomain,t,"auth-domain-config-required"),w(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:i,v:wn,eventId:s};if(e instanceof Pl){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",kh(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[c,u]of Object.entries(r||{}))o[c]=u}if(e instanceof Fn){const c=e.getScopes().filter(u=>u!=="");c.length>0&&(o.scopes=c.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const c of Object.keys(a))a[c]===void 0&&delete a[c];return`${kv(t)}?${Rt(a).slice(1)}`}function kv({config:t}){return t.emulator?Eo(t,Av):`https://${t.authDomain}/${bv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ds="webStorageSupport";class Cv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Fl,this._completeRedirectFn=Zy}async _openPopup(e,n,i,s){var r;Te((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=ja(e,n,i,or(),s);return Tv(e,o,bo())}async _openRedirect(e,n,i,s){return await this._originValidation(e),my(ja(e,n,i,or(),s)),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:s,promise:r}=this.eventManagers[n];return s?Promise.resolve(s):(Te(r,"If manager is not set, promise should be"),r)}const i=this.initAndGetManager(e);return this.eventManagers[n]={promise:i},i.catch(()=>{delete this.eventManagers[n]}),i}async initAndGetManager(e){const n=await yv(e),i=new tv(e);return n.register("authEvent",s=>(w(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:i.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=n,i}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Ds,{type:Ds},s=>{var r;const o=(r=s==null?void 0:s[0])===null||r===void 0?void 0:r[Ds];o!==void 0&&n(!!o),Ie(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=ov(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Dl()||To()||us()}}const Nv=Cv;var Ha="@firebase/auth",Ka="0.19.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(i=>{var s;e(((s=i)===null||s===void 0?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);!n||(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){w(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dv(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";default:return}}function Ov(t){ze(new De("auth",(e,{options:n})=>{const i=e.getProvider("app").getImmediate(),{apiKey:s,authDomain:r}=i.options;return(o=>{w(s&&!s.includes(":"),"invalid-api-key",{appName:o.name}),w(!(r!=null&&r.includes(":")),"argument-error",{appName:o.name});const a={apiKey:s,authDomain:r,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ol(t)},c=new Zm(o,a);return Lm(c,n),c})(i)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,i)=>{e.getProvider("auth-internal").initialize()})),ze(new De("auth-internal",e=>{const n=Vn(e.getProvider("auth").getImmediate());return(i=>new Rv(i))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),de(Ha,Ka,Dv(t)),de(Ha,Ka,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fw(t=mr()){const e=Li(t,"auth");return e.isInitialized()?e.getImmediate():Pm(t,{popupRedirectResolver:Nv,persistence:[by,fy,Fl]})}Ov("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pv="type.googleapis.com/google.protobuf.Int64Value",Lv="type.googleapis.com/google.protobuf.UInt64Value";function Wl(t,e){const n={};for(const i in t)t.hasOwnProperty(i)&&(n[i]=e(t[i]));return n}function cr(t){if(t==null)return null;if(t instanceof Number&&(t=t.valueOf()),typeof t=="number"&&isFinite(t)||t===!0||t===!1||Object.prototype.toString.call(t)==="[object String]")return t;if(t instanceof Date)return t.toISOString();if(Array.isArray(t))return t.map(e=>cr(e));if(typeof t=="function"||typeof t=="object")return Wl(t,e=>cr(e));throw new Error("Data cannot be encoded in JSON: "+t)}function Ni(t){if(t==null)return t;if(t["@type"])switch(t["@type"]){case Pv:case Lv:{const e=Number(t.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+t);return e}default:throw new Error("Data cannot be decoded from JSON: "+t)}return Array.isArray(t)?t.map(e=>Ni(e)):typeof t=="function"||typeof t=="object"?Wl(t,e=>Ni(e)):t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Co="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ga={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class vt extends xe{constructor(e,n,i){super(`${Co}/${e}`,n||"");this.details=i}}function Mv(t){if(t>=200&&t<300)return"ok";switch(t){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function xv(t,e){let n=Mv(t),i=n,s;try{const r=e&&e.error;if(r){const o=r.status;if(typeof o=="string"){if(!Ga[o])return new vt("internal","internal");n=Ga[o],i=o}const a=r.message;typeof a=="string"&&(i=a),s=r.details,s!==void 0&&(s=Ni(s))}}catch{}return n==="ok"?null:new vt(n,i,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uv{constructor(e,n,i){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||e.get().then(s=>this.auth=s,()=>{}),this.messaging||n.get().then(s=>this.messaging=s,()=>{}),this.appCheck||i.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(!!this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(){if(this.appCheck){const e=await this.appCheck.getToken();return e.error?null:e.token}return null}async getContext(){const e=await this.getAuthToken(),n=await this.getMessagingToken(),i=await this.getAppCheckToken();return{authToken:e,messagingToken:n,appCheckToken:i}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ur="us-central1";function Vv(t){let e=null;return{promise:new Promise((n,i)=>{e=setTimeout(()=>{i(new vt("deadline-exceeded","deadline-exceeded"))},t)}),cancel:()=>{e&&clearTimeout(e)}}}class Fv{constructor(e,n,i,s,r=ur,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new Uv(n,i,s),this.cancelAllRequests=new Promise(a=>{this.deleteService=()=>Promise.resolve(a())});try{const a=new URL(r);this.customDomain=a.origin,this.region=ur}catch{this.customDomain=null,this.region=r}}_delete(){return this.deleteService()}_url(e){const n=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${n}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${n}.cloudfunctions.net/${e}`}}function $v(t,e,n){return i=>qv(t,e,i,n||{})}async function Bv(t,e,n,i){n["Content-Type"]="application/json";let s;try{s=await i(t,{method:"POST",body:JSON.stringify(e),headers:n})}catch{return{status:0,json:null}}let r=null;try{r=await s.json()}catch{}return{status:s.status,json:r}}async function qv(t,e,n,i){const s=t._url(e);n=cr(n);const r={data:n},o={},a=await t.contextProvider.getContext();a.authToken&&(o.Authorization="Bearer "+a.authToken),a.messagingToken&&(o["Firebase-Instance-ID-Token"]=a.messagingToken),a.appCheckToken!==null&&(o["X-Firebase-AppCheck"]=a.appCheckToken);const c=i.timeout||7e4,u=Vv(c),l=await Promise.race([Bv(s,r,o,t.fetchImpl),u.promise,t.cancelAllRequests]);if(u.cancel(),!l)throw new vt("cancelled","Firebase Functions instance was deleted.");const h=xv(l.status,l.json);if(h)throw h;if(!l.json)throw new vt("internal","Response is not valid JSON object.");let d=l.json.data;if(typeof d=="undefined"&&(d=l.json.result),typeof d=="undefined")throw new vt("internal","Response is missing data field.");return{data:Ni(d)}}const za="@firebase/functions",Wa="0.7.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jv="auth-internal",Hv="app-check-internal",Kv="messaging-internal";function Gv(t,e){const n=(i,{instanceIdentifier:s})=>{const r=i.getProvider("app").getImmediate(),o=i.getProvider(jv),a=i.getProvider(Kv),c=i.getProvider(Hv);return new Fv(r,o,a,c,s,t)};ze(new De(Co,n,"PUBLIC").setMultipleInstances(!0)),de(za,Wa,e),de(za,Wa,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $w(t=mr(),e=ur){return Li(B(t),Co).getImmediate({identifier:e})}function Bw(t,e,n){return $v(B(t),e,n)}Gv(fetch.bind(self));export{Ow as $,yw as A,gh as B,Yl as C,Iw as D,dw as E,zv as F,Xv as G,Jv as H,Wv as I,rh as J,zt as K,Tw as L,Aw as M,cw as N,tw as O,ow as P,Qv as Q,mn as R,Ew as S,$w as T,Bw as U,Sw as V,kw as W,Cw as X,Rw as Y,Pw as Z,bw as _,ch as a,Mw as a0,Lw as a1,Nw as a2,Fw as a3,xw as a4,Uw as a5,Vw as a6,Dw as a7,nw as b,iw as c,oh as d,ah as e,aw as f,Yv as g,hh as h,_w as i,rw as j,Zv as k,ew as l,sw as m,fw as n,gw as o,pw as p,fh as q,hw as r,Zl as s,lr as t,lw as u,uw as v,vw as w,ww as x,ph as y,mw as z};
