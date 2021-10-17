void 0===process.env.NODE_ENV&&(process.env.NODE_ENV="production"),(()=>{var e={159:(e,r,t)=>{t(495).config({path:"./.env"}),e.exports={client:"mysql2",connection:{host:process.env.DB_HOST,database:process.env.DB_NAME,user:process.env.DB_USER,password:process.env.DB_PASS}}},118:e=>{e.exports.UY=function(e){return e}},173:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>l});const n=require("body-parser");var s=t.n(n);const o=require("knex");var i=t.n(o);const a=require("crypto-js");var d=t.n(a),u=t(146),c=function(e,r,t,n){return new(t||(t=Promise))((function(s,o){function i(e){try{d(n.next(e))}catch(e){o(e)}}function a(e){try{d(n.throw(e))}catch(e){o(e)}}function d(e){var r;e.done?s(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(i,a)}d((n=n.apply(e,r||[])).next())}))},p=function(e,r,t,n){return new(t||(t=Promise))((function(s,o){function i(e){try{d(n.next(e))}catch(e){o(e)}}function a(e){try{d(n.throw(e))}catch(e){o(e)}}function d(e){var r;e.done?s(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(i,a)}d((n=n.apply(e,r||[])).next())}))};const l=({app:e,resolve:r})=>{const n=i()(t(159)),o=d().SHA256,a=(0,u.Router)();a.use(s().json()),a.use(((e,r,t)=>{return s=void 0,o=void 0,a=function*(){var r;const s=null===(r=e.headers.authorization)||void 0===r?void 0:r.toLowerCase().replace("bearer ","").trim();if(!s)return t();const o=yield n.table("tokens").where({token:s,isActive:!0}).first();if(!o)return t();const i=yield n.table("users").where({id:o.userId}).first();if(!i)return t();e.user=i,e.token=o,t()},new((i=void 0)||(i=Promise))((function(e,r){function t(e){try{d(a.next(e))}catch(e){r(e)}}function n(e){try{d(a.throw(e))}catch(e){r(e)}}function d(r){var s;r.done?e(r.value):(s=r.value,s instanceof i?s:new i((function(e){e(s)}))).then(t,n)}d((a=a.apply(s,o||[])).next())}));var s,o,i,a})),(({dbConnection:e,crypter:r})=>t=>(t.post("/auth/sign-out",((r,t,n)=>c(void 0,void 0,void 0,(function*(){r.user?(yield e.table("tokens").where({id:r.token.id}).update({isActive:!1}),t.status(200).send({message:"Успешная деавторизация"}),n()):t.status(401).send({error:"Вы не авторизованы"})})))),t.post("/auth/sign-in",((t,n,s)=>c(void 0,void 0,void 0,(function*(){if(t.user)return void n.status(403).send({error:"Вы уже авторизованы"});const s=t.body,o=yield e.table("users").where({login:s.login}).first();if(!o)return void n.status(401).send({login:["Пользователь не найден"]});if(r(s.password).toString()!==o.password)return void n.status(401).send({login:["Пользователь не найден"]});const i=r(`${s.login}-${Date.now()}`).toString();yield e.table("tokens").insert({token:i,userId:o.id}),n.status(200).send({data:(e=>{var{password:r}=e;return function(e,r){var t={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(n=Object.getOwnPropertySymbols(e);s<n.length;s++)r.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(e,n[s])&&(t[n[s]]=e[n[s]])}return t}(e,["password"])})(o),token:i})})))),t))({dbConnection:n,crypter:o})(a),(({dbConnection:e})=>r=>{r.get("/departments",((r,t)=>p(void 0,void 0,void 0,(function*(){const n=e.table("departments").orderBy("order"),{parentId:s}=r.query||{};s&&n.where("parentId","=",s),t.status(200).send({departments:yield n})})))),r.get("/departments/:id",((r,t)=>p(void 0,void 0,void 0,(function*(){const n=yield e.table("departments").where({id:+r.params.id}).first();if(!n)return t.status(404).send({message:"Департамент не найден"});t.status(200).send(n)})))),r.get("/departments/:id/persons",((r,t)=>p(void 0,void 0,void 0,(function*(){const n=e.table("departmentsPersons").select(["position","order","persons.*"]).join("persons","persons.id","departmentsPersons.personId").where({departmentId:+r.params.id}).groupBy("departmentsPersons.personId").orderBy("departmentsPersons.order");t.status(200).send({persons:yield n})})))),r.get("/departments/:departmentId/persons/:personId",((r,t)=>p(void 0,void 0,void 0,(function*(){const n=yield e.table("departmentsPersons").select(["position","order","persons.*"]).join("persons","persons.id","departmentsPersons.personId").where({departmentId:+r.params.departmentId,personId:+r.params.personId}).first();if(!n)return t.status(404).send({message:"Контакт не найден"});t.status(200).send(Object.assign(Object.assign({},n),{contacts:yield e.where({personId:n.id}).from("contacts"),departments:yield e.table("departmentsPersons").select(["position","departments.*"]).where({personId:n.id}).join("departments","departments.id","departmentsPersons.departmentId")}))}))))})({dbConnection:n,crypter:o})(a),e.use(r.urlPath("/api"),a)}},492:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>o});const n=require("compression");var s=t.n(n);const o=(0,t(118).UY)((({app:e})=>{e.use(s()({threshold:0}))}))},549:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>n});const n=(0,t(118).UY)((({app:e,resolve:r,render:t,serve:n})=>{e.get(r.urlPath("*"),((e,r)=>{r.setHeader("Content-Type","text/html"),t({req:e,res:r}).then((e=>{r.send(e)})).catch((e=>{e.url?e.code?r.redirect(e.code,e.url):r.redirect(e.url):404===e.code?r.status(404).send("404 | Page Not Found"):r.status(500).send("500 | Internal Server Error")}))}))}))},495:e=>{"use strict";e.exports=require("dotenv")},146:e=>{"use strict";e.exports=require("express")}},r={};function t(n){var s=r[n];if(void 0!==s)return s.exports;var o=r[n]={exports:{}};return e[n](o,o.exports,t),o.exports}t.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return t.d(r,{a:r}),r},t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};(()=>{"use strict";t.r(n);const e=require("path");var r=t(146),s=t.n(r);const o=require("@vue/server-renderer"),i=require("@quasar/ssr-helpers/create-renderer");var a=t.n(i);const d=require("./render-template.js");var u=t.n(d);const c=require("./quasar.server-manifest.json");var p=t.n(c);const l=require("./quasar.client-manifest.json");var v=t.n(l);const f=s()(),m=e=>e||"/",y=__dirname,h=(0,e.join)(__dirname,"www");function b(){return(0,e.join)(h,...arguments)}const g=(e,r={})=>s().static(b(e),{...r,maxAge:void 0===r.maxAge?2592e6:r.maxAge}),w=a()({vueRenderToString:o.renderToString,basedir:__dirname,serverManifest:p(),clientManifest:v()});var P;f.use(m("/"),g(".")),(P={app:f,resolve:{urlPath:m,root(){return(0,e.join)(y,...arguments)},public:b},publicPath:"/",folders:{root:y,public:h},render:e=>w(e,u()),serve:{static:g}},Promise.all([Promise.resolve().then(t.bind(t,492)),Promise.resolve().then(t.bind(t,173)),Promise.resolve().then(t.bind(t,549))]).then((async e=>{const r=e.map((e=>e.default));for(let e=0;e<r.length;e++)try{await r[e](P)}catch(e){return void console.error("[Quasar SSR] middleware error:",e)}}))).then((()=>{const e=process.env.PORT||3e3;f.listen(e,(()=>{console.log("Server listening at port "+e)}))}))})(),module.exports=n})();