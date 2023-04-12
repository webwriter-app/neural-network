(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();var K=window,gt=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yt=Symbol(),Ot=new WeakMap,Qt=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(gt&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Ot.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ot.set(t,e))}return e}toString(){return this.cssText}},ge=e=>new Qt(typeof e=="string"?e:e+"",void 0,yt),te=(e,...t)=>{const s=e.length===1?e[0]:t.reduce((i,r,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[o+1],e[0]);return new Qt(s,e,yt)},ye=(e,t)=>{gt?e.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet):t.forEach(s=>{const i=document.createElement("style"),r=K.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=s.cssText,e.appendChild(i)})},Pt=gt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const i of t.cssRules)s+=i.cssText;return ge(s)})(e):e,st,J=window,xt=J.trustedTypes,Ae=xt?xt.emptyScript:"",Nt=J.reactiveElementPolyfillSupport,vt={toAttribute(e,t){switch(t){case Boolean:e=e?Ae:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},ee=(e,t)=>t!==e&&(t==t||e==e),it={attribute:!0,type:String,converter:vt,reflect:!1,hasChanged:ee},b=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach((t,s)=>{const i=this._$Ep(s,t);i!==void 0&&(this._$Ev.set(i,s),e.push(i))}),e}static createProperty(e,t=it){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const s=typeof e=="symbol"?Symbol():"__"+e,i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Object.defineProperty(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){return{get(){return this[t]},set(i){const r=this[e];this[t]=i,this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||it}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,s=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of s)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const i of s)t.unshift(Pt(i))}else e!==void 0&&t.push(Pt(e));return t}static _$Ep(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}u(){var e;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)===null||s===void 0||s.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;const t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return ye(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(t=>{var s;return(s=t.hostConnected)===null||s===void 0?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(t=>{var s;return(s=t.hostDisconnected)===null||s===void 0?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EO(e,t,s=it){var i;const r=this.constructor._$Ep(e,s);if(r!==void 0&&s.reflect===!0){const o=(((i=s.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?s.converter:vt).toAttribute(t,s.type);this._$El=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(e,t){var s;const i=this.constructor,r=i._$Ev.get(e);if(r!==void 0&&this._$El!==r){const o=i.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)===null||s===void 0?void 0:s.fromAttribute)!==void 0?o.converter:vt;this._$El=r,this[r]=n.fromAttribute(t,o.type),this._$El=null}}requestUpdate(e,t,s){let i=!0;e!==void 0&&(((s=s||this.constructor.getPropertyOptions(e)).hasChanged||ee)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),s.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,s))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,r)=>this[r]=i),this._$Ei=void 0);let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),(e=this._$ES)===null||e===void 0||e.forEach(i=>{var r;return(r=i.hostUpdate)===null||r===void 0?void 0:r.call(i)}),this.update(s)):this._$Ek()}catch(i){throw t=!1,this._$Ek(),i}t&&this._$AE(s)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach(s=>{var i;return(i=s.hostUpdated)===null||i===void 0?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((t,s)=>this._$EO(s,this[s],t)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};b.finalized=!0,b.elementProperties=new Map,b.elementStyles=[],b.shadowRootOptions={mode:"open"},Nt==null||Nt({ReactiveElement:b}),((st=J.reactiveElementVersions)!==null&&st!==void 0?st:J.reactiveElementVersions=[]).push("1.6.1");var rt,Y=window,O=Y.trustedTypes,Tt=O?O.createPolicy("lit-html",{createHTML:e=>e}):void 0,f=`lit$${(Math.random()+"").slice(9)}$`,se="?"+f,be=`<${se}>`,P=document,j=(e="")=>P.createComment(e),z=e=>e===null||typeof e!="object"&&typeof e!="function",ie=Array.isArray,Ee=e=>ie(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ut=/-->/g,Rt=/>/g,g=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ht=/'/g,Mt=/"/g,re=/^(?:script|style|textarea|title)$/i,Se=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),we=Se(1),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),kt=new WeakMap,S=P.createTreeWalker(P,129,null,!1),Ce=(e,t)=>{const s=e.length-1,i=[];let r,o=t===2?"<svg>":"",n=M;for(let l=0;l<s;l++){const d=e[l];let u,a,c=-1,$=0;for(;$<d.length&&(n.lastIndex=$,a=n.exec(d),a!==null);)$=n.lastIndex,n===M?a[1]==="!--"?n=Ut:a[1]!==void 0?n=Rt:a[2]!==void 0?(re.test(a[2])&&(r=RegExp("</"+a[2],"g")),n=g):a[3]!==void 0&&(n=g):n===g?a[0]===">"?(n=r!=null?r:M,c=-1):a[1]===void 0?c=-2:(c=n.lastIndex-a[2].length,u=a[1],n=a[3]===void 0?g:a[3]==='"'?Mt:Ht):n===Mt||n===Ht?n=g:n===Ut||n===Rt?n=M:(n=g,r=void 0);const _=n===g&&e[l+1].startsWith("/>")?" ":"";o+=n===M?d+be:c>=0?(i.push(u),d.slice(0,c)+"$lit$"+d.slice(c)+f+_):d+f+(c===-2?(i.push(void 0),l):_)}const h=o+(e[s]||"<?>")+(t===2?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[Tt!==void 0?Tt.createHTML(h):h,i]},F=class{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0;const n=e.length-1,h=this.parts,[l,d]=Ce(e,t);if(this.el=F.createElement(l,s),S.currentNode=this.el.content,t===2){const u=this.el.content,a=u.firstChild;a.remove(),u.append(...a.childNodes)}for(;(i=S.nextNode())!==null&&h.length<n;){if(i.nodeType===1){if(i.hasAttributes()){const u=[];for(const a of i.getAttributeNames())if(a.endsWith("$lit$")||a.startsWith(f)){const c=d[o++];if(u.push(a),c!==void 0){const $=i.getAttribute(c.toLowerCase()+"$lit$").split(f),_=/([.?@])?(.*)/.exec(c);h.push({type:1,index:r,name:_[2],strings:$,ctor:_[1]==="."?Pe:_[1]==="?"?Ne:_[1]==="@"?Te:tt})}else h.push({type:6,index:r})}for(const a of u)i.removeAttribute(a)}if(re.test(i.tagName)){const u=i.textContent.split(f),a=u.length-1;if(a>0){i.textContent=O?O.emptyScript:"";for(let c=0;c<a;c++)i.append(u[c],j()),S.nextNode(),h.push({type:2,index:++r});i.append(u[a],j())}}}else if(i.nodeType===8)if(i.data===se)h.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(f,u+1))!==-1;)h.push({type:7,index:r}),u+=f.length-1}r++}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s}};function x(e,t,s=e,i){var r,o,n,h;if(t===A)return t;let l=i!==void 0?(r=s._$Co)===null||r===void 0?void 0:r[i]:s._$Cl;const d=z(t)?void 0:t._$litDirective$;return(l==null?void 0:l.constructor)!==d&&((o=l==null?void 0:l._$AO)===null||o===void 0||o.call(l,!1),d===void 0?l=void 0:(l=new d(e),l._$AT(e,s,i)),i!==void 0?((n=(h=s)._$Co)!==null&&n!==void 0?n:h._$Co=[])[i]=l:s._$Cl=l),l!==void 0&&(t=x(e,l._$AS(e,t.values),l,i)),t}var Oe=class{constructor(e,t){this.u=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(e){var t;const{el:{content:s},parts:i}=this._$AD,r=((t=e==null?void 0:e.creationScope)!==null&&t!==void 0?t:P).importNode(s,!0);S.currentNode=r;let o=S.nextNode(),n=0,h=0,l=i[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new Q(o,o.nextSibling,this,e):l.type===1?d=new l.ctor(o,l.name,l.strings,this,e):l.type===6&&(d=new Ue(o,this,e)),this.u.push(d),l=i[++h]}n!==(l==null?void 0:l.index)&&(o=S.nextNode(),n++)}return r}p(e){let t=0;for(const s of this.u)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},Q=class{constructor(e,t,s,i){var r;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cm=(r=i==null?void 0:i.isConnected)===null||r===void 0||r}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cm}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=x(this,e,t),z(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==A&&this.g(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ee(e)?this.k(e):this.g(e)}O(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}g(e){this._$AH!==p&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){var t;const{values:s,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=F.createElement(i.h,this.options)),i);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===r)this._$AH.p(s);else{const o=new Oe(r,this),n=o.v(this.options);o.p(s),this.T(n),this._$AH=o}}_$AC(e){let t=kt.get(e.strings);return t===void 0&&kt.set(e.strings,t=new F(e)),t}k(e){ie(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new Q(this.O(j()),this.O(j()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)===null||s===void 0||s.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cm=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},tt=class{constructor(e,t,s,i,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,s,i){const r=this.strings;let o=!1;if(r===void 0)e=x(this,e,t,0),o=!z(e)||e!==this._$AH&&e!==A,o&&(this._$AH=e);else{const n=e;let h,l;for(e=r[0],h=0;h<r.length-1;h++)l=x(this,n[s+h],t,h),l===A&&(l=this._$AH[h]),o||(o=!z(l)||l!==this._$AH[h]),l===p?e=p:e!==p&&(e+=(l!=null?l:"")+r[h+1]),this._$AH[h]=l}o&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},Pe=class extends tt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},xe=O?O.emptyScript:"",Ne=class extends tt{constructor(){super(...arguments),this.type=4}j(e){e&&e!==p?this.element.setAttribute(this.name,xe):this.element.removeAttribute(this.name)}},Te=class extends tt{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){var s;if((e=(s=x(this,e,t,0))!==null&&s!==void 0?s:p)===A)return;const i=this._$AH,r=e===p&&i!==p||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==p&&(i===p||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&s!==void 0?s:this.element,e):this._$AH.handleEvent(e)}},Ue=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){x(this,e)}},Lt=Y.litHtmlPolyfillSupport;Lt==null||Lt(F,Q),((rt=Y.litHtmlVersions)!==null&&rt!==void 0?rt:Y.litHtmlVersions=[]).push("2.6.1");var Re=(e,t,s)=>{var i,r;const o=(i=s==null?void 0:s.renderBefore)!==null&&i!==void 0?i:t;let n=o._$litPart$;if(n===void 0){const h=(r=s==null?void 0:s.renderBefore)!==null&&r!==void 0?r:null;o._$litPart$=n=new Q(t.insertBefore(j(),h),h,void 0,s!=null?s:{})}return n._$AI(e),n},ot,nt,L=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var e,t;const s=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=s.firstChild),s}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Dt=Re(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Dt)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Dt)===null||e===void 0||e.setConnected(!1)}render(){return A}};L.finalized=!0,L._$litElement$=!0,(ot=globalThis.litElementHydrateSupport)===null||ot===void 0||ot.call(globalThis,{LitElement:L});var jt=globalThis.litElementPolyfillSupport;jt==null||jt({LitElement:L});((nt=globalThis.litElementVersions)!==null&&nt!==void 0?nt:globalThis.litElementVersions=[]).push("3.2.0");/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/var He=te`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`,Me=te`
  ${He}

  :host {
    --border-color: var(--sl-color-neutral-200);
    --border-radius: var(--sl-border-radius-medium);
    --border-width: 1px;
    --padding: var(--sl-spacing-large);

    display: inline-block;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-small);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
  }

  .card__image {
    display: flex;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
  }

  .card__image::slotted(img) {
    display: block;
    width: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    border-bottom: solid var(--border-width) var(--border-color);
    padding: calc(var(--padding) / 2) var(--padding);
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card:not(.card--has-image) .card__header {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .card__body {
    display: block;
    padding: var(--padding);
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }
`,ke=class{constructor(e,...t){this.slotNames=[],(this.host=e).addController(this),this.slotNames=t,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&e.textContent.trim()!=="")return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if(t.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!t.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(e){return this.host.querySelector(`:scope > [slot="${e}"]`)!==null}test(e){return e==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(e){const t=e.target;(this.slotNames.includes("[default]")&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()}},Le={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},je=e=>(...t)=>({_$litDirective$:e,values:t}),ze=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/*! Bundled license information:

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/var De=je(class extends ze{constructor(e){var t;if(super(e),e.type!==Le.ATTRIBUTE||e.name!=="class"||((t=e.strings)===null||t===void 0?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var s,i;if(this.nt===void 0){this.nt=new Set,e.strings!==void 0&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter(o=>o!=="")));for(const o in t)t[o]&&!(!((s=this.st)===null||s===void 0)&&s.has(o))&&this.nt.add(o);return this.render(t)}const r=e.element.classList;this.nt.forEach(o=>{o in t||(r.remove(o),this.nt.delete(o))});for(const o in t){const n=!!t[o];n===this.nt.has(o)||((i=this.st)===null||i===void 0?void 0:i.has(o))||(n?(r.add(o),this.nt.add(o)):(r.remove(o),this.nt.delete(o)))}return A}});/*! Bundled license information:

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/var oe=Object.defineProperty,Be=Object.defineProperties,Ie=Object.getOwnPropertyDescriptor,Ve=Object.getOwnPropertyDescriptors,zt=Object.getOwnPropertySymbols,We=Object.prototype.hasOwnProperty,qe=Object.prototype.propertyIsEnumerable,Dt=(e,t,s)=>t in e?oe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,ne=(e,t)=>{for(var s in t||(t={}))We.call(t,s)&&Dt(e,s,t[s]);if(zt)for(var s of zt(t))qe.call(t,s)&&Dt(e,s,t[s]);return e},Ke=(e,t)=>Be(e,Ve(t)),At=(e,t,s,i)=>{for(var r=i>1?void 0:i?Ie(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&oe(t,s,r),r},Ze=e=>t=>typeof t=="function"?((s,i)=>(customElements.define(s,i),i))(e,t):((s,i)=>{const{kind:r,elements:o}=i;return{kind:r,elements:o,finisher(n){customElements.define(s,n)}}})(e,t),Je=(e,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?Ke(ne({},t),{finisher(s){s.createProperty(t.key,e)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(s){s.createProperty(t.key,e)}};function le(e){return(t,s)=>s!==void 0?((i,r,o)=>{r.constructor.createProperty(o,i)})(e,t,s):Je(e,t)}var lt;((lt=window.HTMLSlotElement)===null||lt===void 0?void 0:lt.prototype.assignedElements)!=null;var bt=class extends L{emit(e,t){const s=new CustomEvent(e,ne({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(s),s}};At([le()],bt.prototype,"dir",2);At([le()],bt.prototype,"lang",2);/*! Bundled license information:

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/var $t=class extends bt{constructor(){super(...arguments),this.hasSlotController=new ke(this,"footer","header","image")}render(){return we`
      <div
        part="base"
        class=${De({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};$t.styles=Me;$t=At([Ze("sl-card")],$t);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Z=window,Et=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,St=Symbol(),Bt=new WeakMap;class ae{constructor(t,s,i){if(this._$cssResult$=!0,i!==St)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o;const s=this.t;if(Et&&t===void 0){const i=s!==void 0&&s.length===1;i&&(t=Bt.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Bt.set(s,t))}return t}toString(){return this.cssText}}const Ye=e=>new ae(typeof e=="string"?e:e+"",void 0,St),he=(e,...t)=>{const s=e.length===1?e[0]:t.reduce((i,r,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[o+1],e[0]);return new ae(s,e,St)},de=(e,t)=>{Et?e.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet):t.forEach(s=>{const i=document.createElement("style"),r=Z.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=s.cssText,e.appendChild(i)})},It=Et?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let s="";for(const i of t.cssRules)s+=i.cssText;return Ye(s)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var at;const X=window,Vt=X.trustedTypes,Fe=Vt?Vt.emptyScript:"",Wt=X.reactiveElementPolyfillSupport,_t={toAttribute(e,t){switch(t){case Boolean:e=e?Fe:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=e!==null;break;case Number:s=e===null?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch{s=null}}return s}},ce=(e,t)=>t!==e&&(t==t||e==e),ht={attribute:!0,type:String,converter:_t,reflect:!1,hasChanged:ce};class E extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var s;this.finalize(),((s=this.h)!==null&&s!==void 0?s:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((s,i)=>{const r=this._$Ep(i,s);r!==void 0&&(this._$Ev.set(r,i),t.push(r))}),t}static createProperty(t,s=ht){if(s.state&&(s.attribute=!1),this.finalize(),this.elementProperties.set(t,s),!s.noAccessor&&!this.prototype.hasOwnProperty(t)){const i=typeof t=="symbol"?Symbol():"__"+t,r=this.getPropertyDescriptor(t,i,s);r!==void 0&&Object.defineProperty(this.prototype,t,r)}}static getPropertyDescriptor(t,s,i){return{get(){return this[s]},set(r){const o=this[t];this[s]=r,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||ht}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const s=this.properties,i=[...Object.getOwnPropertyNames(s),...Object.getOwnPropertySymbols(s)];for(const r of i)this.createProperty(r,s[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const s=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)s.unshift(It(r))}else t!==void 0&&s.push(It(t));return s}static _$Ep(t,s){const i=s.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(s=>s(this))}addController(t){var s,i;((s=this._$ES)!==null&&s!==void 0?s:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var s;(s=this._$ES)===null||s===void 0||s.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,s)=>{this.hasOwnProperty(s)&&(this._$Ei.set(s,this[s]),delete this[s])})}createRenderRoot(){var t;const s=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return de(s,this.constructor.elementStyles),s}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(s=>{var i;return(i=s.hostConnected)===null||i===void 0?void 0:i.call(s)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(s=>{var i;return(i=s.hostDisconnected)===null||i===void 0?void 0:i.call(s)})}attributeChangedCallback(t,s,i){this._$AK(t,i)}_$EO(t,s,i=ht){var r;const o=this.constructor._$Ep(t,i);if(o!==void 0&&i.reflect===!0){const n=(((r=i.converter)===null||r===void 0?void 0:r.toAttribute)!==void 0?i.converter:_t).toAttribute(s,i.type);this._$El=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,s){var i;const r=this.constructor,o=r._$Ev.get(t);if(o!==void 0&&this._$El!==o){const n=r.getPropertyOptions(o),h=typeof n.converter=="function"?{fromAttribute:n.converter}:((i=n.converter)===null||i===void 0?void 0:i.fromAttribute)!==void 0?n.converter:_t;this._$El=o,this[o]=h.fromAttribute(s,n.type),this._$El=null}}requestUpdate(t,s,i){let r=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||ce)(this[t],s)?(this._$AL.has(t)||this._$AL.set(t,s),i.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,i))):r=!1),!this.isUpdatePending&&r&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(s){Promise.reject(s)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((r,o)=>this[o]=r),this._$Ei=void 0);let s=!1;const i=this._$AL;try{s=this.shouldUpdate(i),s?(this.willUpdate(i),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var o;return(o=r.hostUpdate)===null||o===void 0?void 0:o.call(r)}),this.update(i)):this._$Ek()}catch(r){throw s=!1,this._$Ek(),r}s&&this._$AE(i)}willUpdate(t){}_$AE(t){var s;(s=this._$ES)===null||s===void 0||s.forEach(i=>{var r;return(r=i.hostUpdated)===null||r===void 0?void 0:r.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((s,i)=>this._$EO(i,this[i],s)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}E.finalized=!0,E.elementProperties=new Map,E.elementStyles=[],E.shadowRootOptions={mode:"open"},Wt==null||Wt({ReactiveElement:E}),((at=X.reactiveElementVersions)!==null&&at!==void 0?at:X.reactiveElementVersions=[]).push("1.6.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var dt;const G=window,N=G.trustedTypes,qt=N?N.createPolicy("lit-html",{createHTML:e=>e}):void 0,m=`lit$${(Math.random()+"").slice(9)}$`,ue="?"+m,Xe=`<${ue}>`,T=document,D=(e="")=>T.createComment(e),B=e=>e===null||typeof e!="object"&&typeof e!="function",pe=Array.isArray,Ge=e=>pe(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Kt=/-->/g,Zt=/>/g,y=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Jt=/'/g,Yt=/"/g,ve=/^(?:script|style|textarea|title)$/i,Qe=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),$e=Qe(1),U=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ft=new WeakMap,w=T.createTreeWalker(T,129,null,!1),ts=(e,t)=>{const s=e.length-1,i=[];let r,o=t===2?"<svg>":"",n=k;for(let l=0;l<s;l++){const d=e[l];let u,a,c=-1,$=0;for(;$<d.length&&(n.lastIndex=$,a=n.exec(d),a!==null);)$=n.lastIndex,n===k?a[1]==="!--"?n=Kt:a[1]!==void 0?n=Zt:a[2]!==void 0?(ve.test(a[2])&&(r=RegExp("</"+a[2],"g")),n=y):a[3]!==void 0&&(n=y):n===y?a[0]===">"?(n=r!=null?r:k,c=-1):a[1]===void 0?c=-2:(c=n.lastIndex-a[2].length,u=a[1],n=a[3]===void 0?y:a[3]==='"'?Yt:Jt):n===Yt||n===Jt?n=y:n===Kt||n===Zt?n=k:(n=y,r=void 0);const _=n===y&&e[l+1].startsWith("/>")?" ":"";o+=n===k?d+Xe:c>=0?(i.push(u),d.slice(0,c)+"$lit$"+d.slice(c)+m+_):d+m+(c===-2?(i.push(void 0),l):_)}const h=o+(e[s]||"<?>")+(t===2?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[qt!==void 0?qt.createHTML(h):h,i]};class I{constructor({strings:t,_$litType$:s},i){let r;this.parts=[];let o=0,n=0;const h=t.length-1,l=this.parts,[d,u]=ts(t,s);if(this.el=I.createElement(d,i),w.currentNode=this.el.content,s===2){const a=this.el.content,c=a.firstChild;c.remove(),a.append(...c.childNodes)}for(;(r=w.nextNode())!==null&&l.length<h;){if(r.nodeType===1){if(r.hasAttributes()){const a=[];for(const c of r.getAttributeNames())if(c.endsWith("$lit$")||c.startsWith(m)){const $=u[n++];if(a.push(c),$!==void 0){const _=r.getAttribute($.toLowerCase()+"$lit$").split(m),W=/([.?@])?(.*)/.exec($);l.push({type:1,index:o,name:W[2],strings:_,ctor:W[1]==="."?ss:W[1]==="?"?rs:W[1]==="@"?os:et})}else l.push({type:6,index:o})}for(const c of a)r.removeAttribute(c)}if(ve.test(r.tagName)){const a=r.textContent.split(m),c=a.length-1;if(c>0){r.textContent=N?N.emptyScript:"";for(let $=0;$<c;$++)r.append(a[$],D()),w.nextNode(),l.push({type:2,index:++o});r.append(a[c],D())}}}else if(r.nodeType===8)if(r.data===ue)l.push({type:2,index:o});else{let a=-1;for(;(a=r.data.indexOf(m,a+1))!==-1;)l.push({type:7,index:o}),a+=m.length-1}o++}}static createElement(t,s){const i=T.createElement("template");return i.innerHTML=t,i}}function R(e,t,s=e,i){var r,o,n,h;if(t===U)return t;let l=i!==void 0?(r=s._$Co)===null||r===void 0?void 0:r[i]:s._$Cl;const d=B(t)?void 0:t._$litDirective$;return(l==null?void 0:l.constructor)!==d&&((o=l==null?void 0:l._$AO)===null||o===void 0||o.call(l,!1),d===void 0?l=void 0:(l=new d(e),l._$AT(e,s,i)),i!==void 0?((n=(h=s)._$Co)!==null&&n!==void 0?n:h._$Co=[])[i]=l:s._$Cl=l),l!==void 0&&(t=R(e,l._$AS(e,t.values),l,i)),t}class es{constructor(t,s){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var s;const{el:{content:i},parts:r}=this._$AD,o=((s=t==null?void 0:t.creationScope)!==null&&s!==void 0?s:T).importNode(i,!0);w.currentNode=o;let n=w.nextNode(),h=0,l=0,d=r[0];for(;d!==void 0;){if(h===d.index){let u;d.type===2?u=new V(n,n.nextSibling,this,t):d.type===1?u=new d.ctor(n,d.name,d.strings,this,t):d.type===6&&(u=new ns(n,this,t)),this.u.push(u),d=r[++l]}h!==(d==null?void 0:d.index)&&(n=w.nextNode(),h++)}return o}p(t){let s=0;for(const i of this.u)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,s),s+=i.strings.length-2):i._$AI(t[s])),s++}}class V{constructor(t,s,i,r){var o;this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=i,this.options=r,this._$Cm=(o=r==null?void 0:r.isConnected)===null||o===void 0||o}get _$AU(){var t,s;return(s=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&s!==void 0?s:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const s=this._$AM;return s!==void 0&&t.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=R(this,t,s),B(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==U&&this.g(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ge(t)?this.k(t):this.g(t)}O(t,s=this._$AB){return this._$AA.parentNode.insertBefore(t,s)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==v&&B(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){var s;const{values:i,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=I.createElement(r.h,this.options)),r);if(((s=this._$AH)===null||s===void 0?void 0:s._$AD)===o)this._$AH.p(i);else{const n=new es(o,this),h=n.v(this.options);n.p(i),this.T(h),this._$AH=n}}_$AC(t){let s=Ft.get(t.strings);return s===void 0&&Ft.set(t.strings,s=new I(t)),s}k(t){pe(this._$AH)||(this._$AH=[],this._$AR());const s=this._$AH;let i,r=0;for(const o of t)r===s.length?s.push(i=new V(this.O(D()),this.O(D()),this,this.options)):i=s[r],i._$AI(o),r++;r<s.length&&(this._$AR(i&&i._$AB.nextSibling,r),s.length=r)}_$AR(t=this._$AA.nextSibling,s){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,s);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var s;this._$AM===void 0&&(this._$Cm=t,(s=this._$AP)===null||s===void 0||s.call(this,t))}}class et{constructor(t,s,i,r,o){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=s,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=v}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,s=this,i,r){const o=this.strings;let n=!1;if(o===void 0)t=R(this,t,s,0),n=!B(t)||t!==this._$AH&&t!==U,n&&(this._$AH=t);else{const h=t;let l,d;for(t=o[0],l=0;l<o.length-1;l++)d=R(this,h[i+l],s,l),d===U&&(d=this._$AH[l]),n||(n=!B(d)||d!==this._$AH[l]),d===v?t=v:t!==v&&(t+=(d!=null?d:"")+o[l+1]),this._$AH[l]=d}n&&!r&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}}class ss extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}}const is=N?N.emptyScript:"";class rs extends et{constructor(){super(...arguments),this.type=4}j(t){t&&t!==v?this.element.setAttribute(this.name,is):this.element.removeAttribute(this.name)}}class os extends et{constructor(t,s,i,r,o){super(t,s,i,r,o),this.type=5}_$AI(t,s=this){var i;if((t=(i=R(this,t,s,0))!==null&&i!==void 0?i:v)===U)return;const r=this._$AH,o=t===v&&r!==v||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==v&&(r===v||o);o&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var s,i;typeof this._$AH=="function"?this._$AH.call((i=(s=this.options)===null||s===void 0?void 0:s.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}}class ns{constructor(t,s,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){R(this,t)}}const Xt=G.litHtmlPolyfillSupport;Xt==null||Xt(I,V),((dt=G.litHtmlVersions)!==null&&dt!==void 0?dt:G.litHtmlVersions=[]).push("2.6.1");const ls=(e,t,s)=>{var i,r;const o=(i=s==null?void 0:s.renderBefore)!==null&&i!==void 0?i:t;let n=o._$litPart$;if(n===void 0){const h=(r=s==null?void 0:s.renderBefore)!==null&&r!==void 0?r:null;o._$litPart$=n=new V(t.insertBefore(D(),h),h,void 0,s!=null?s:{})}return n._$AI(e),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ct,ut;class C extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;const i=super.createRenderRoot();return(t=(s=this.renderOptions).renderBefore)!==null&&t!==void 0||(s.renderBefore=i.firstChild),i}update(t){const s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ls(s,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return U}}C.finalized=!0,C._$litElement$=!0,(ct=globalThis.litElementHydrateSupport)===null||ct===void 0||ct.call(globalThis,{LitElement:C});const Gt=globalThis.litElementPolyfillSupport;Gt==null||Gt({LitElement:C});((ut=globalThis.litElementVersions)!==null&&ut!==void 0?ut:globalThis.litElementVersions=[]).push("3.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _e=e=>t=>typeof t=="function"?((s,i)=>(customElements.define(s,i),i))(e,t):((s,i)=>{const{kind:r,elements:o}=i;return{kind:r,elements:o,finisher(n){customElements.define(s,n)}}})(e,t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const as=(e,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(s){s.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(s){s.createProperty(t.key,e)}};function wt(e){return(t,s)=>s!==void 0?((i,r,o)=>{r.constructor.createProperty(o,i)})(e,t,s):as(e,t)}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var pt;((pt=window.HTMLSlotElement)===null||pt===void 0?void 0:pt.prototype.assignedElements)!=null;const fe=new WeakMap;function hs(e,t){let s=t;for(;s;){if(fe.get(s)===e)return!0;s=Object.getPrototypeOf(s)}return!1}function ds(e){return t=>{if(hs(e,t))return t;const s=e(t);return fe.set(s,e),s}}const q=!!ShadowRoot.prototype.createElement,cs=e=>class extends e{static get scopedElements(){return{}}static get shadowRootOptions(){return this.__shadowRootOptions}static set shadowRootOptions(s){this.__shadowRootOptions=s}static get elementStyles(){return this.__elementStyles}static set elementStyles(s){this.__elementStyles=s}constructor(...s){super(),this.renderOptions=this.renderOptions||void 0}get registry(){return this.constructor.__registry}set registry(s){this.constructor.__registry=s}createRenderRoot(){const{scopedElements:s,shadowRootOptions:i,elementStyles:r}=this.constructor;if(!this.registry||this.registry===this.constructor.__registry&&!Object.prototype.hasOwnProperty.call(this.constructor,"__registry")){this.registry=q?new CustomElementRegistry:customElements;for(const[l,d]of Object.entries(s))this.defineScopedElement(l,d)}const n={mode:"open",...i,customElements:this.registry},h=this.attachShadow(n);return q&&(this.renderOptions.creationScope=h),h instanceof ShadowRoot&&(de(h,r),this.renderOptions.renderBefore=this.renderOptions.renderBefore||h.firstChild),h}createScopedElement(s){return(q?this.shadowRoot:document).createElement(s)}defineScopedElement(s,i){const r=this.registry.get(s);return r&&q===!1&&r!==i&&console.error([`You are trying to re-register the "${s}" custom element with a different class via ScopedElementsMixin.`,"This is only possible with a CustomElementRegistry.","Your browser does not support this feature so you will need to load a polyfill for it.",'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.','e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"><\/script>" as your first script tag.',"For more details you can visit https://open-wc.org/docs/development/scoped-elements/"].join(`
`)),r?this.registry.get(s):this.registry.define(s,i)}getScopedTagName(s){return s}static getScopedTagName(s){return s}},me=ds(cs);var us=Object.defineProperty,ps=Object.getOwnPropertyDescriptor,Ct=(e,t,s,i)=>{for(var r=i>1?void 0:i?ps(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&us(t,s,r),r};class H extends me(C){connectedCallback(){super.connectedCallback(),this.getAttributeNames().forEach(t=>this.setAttribute(t,this.getAttribute(t)))}}H.shadowRootOptions={...me(C).shadowRootOptions,delegatesFocus:!0};Ct([wt({type:Boolean,attribute:!0,reflect:!0})],H.prototype,"printable",2);Ct([wt({type:Boolean,attribute:!0,reflect:!0})],H.prototype,"editable",2);Ct([wt({type:Boolean,attribute:!0,reflect:!0})],H.prototype,"analyzable",2);const vs=he`

  *{
    font-family: var(--sl-font-sans);
  }
`;var $s=Object.defineProperty,_s=Object.getOwnPropertyDescriptor,fs=(e,t,s,i)=>{for(var r=i>1?void 0:i?_s(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&$s(t,s,r),r};let ft=class extends H{render(){return $e`
        <sl-card class="card-header">
            <div slot="header">
                Neural Network
                <sl-icon-button name="gear" label="Settings"></sl-icon-button>
            </div>

            Network visualization here
        </sl-card>
    `}};ft.styles=he`
    .card-header [slot='header'] {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-header h3 {
      margin: 0;
    }

    .card-header sl-icon-button {
      font-size: var(--sl-font-size-medium);
    }
  `;ft=fs([_e("neural-network-card")],ft);var ms=Object.defineProperty,gs=Object.getOwnPropertyDescriptor,ys=(e,t,s,i)=>{for(var r=i>1?void 0:i?gs(t,s):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(r=(i?n(t,s,r):n(r))||r);return i&&r&&ms(t,s,r),r};let mt=class extends H{render(){return $e`
      <neural-network-card></neural-network-card>
    `}};mt.styles=[vs];mt=ys([_e("ww-machinelearningvisualizer")],mt);
