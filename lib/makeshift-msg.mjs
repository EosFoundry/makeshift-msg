import{inspect as e}from"node:util";import t from"node:process";import r from"node:os";import o from"node:tty";function n(e){return null!==e&&"object"==typeof e}function i(e,t,r=".",o){if(!n(t))return i(e,{},r,o);const s=Object.assign({},t);for(const t in e){if("__proto__"===t||"constructor"===t)continue;const l=e[t];null!=l&&(o&&o(s,t,l,r)||(Array.isArray(l)&&Array.isArray(s[t])?s[t]=[...l,...s[t]]:n(l)&&n(s[t])?s[t]=i(l,s[t],(r?`${r}.`:"")+t.toString(),o):s[t]=l))}return s}const s=(...e)=>e.reduce(((e,t)=>i(e,t,"",l)),{});var l;const c=(e=0)=>t=>`[${t+e}m`,a=(e=0)=>t=>`[${38+e};5;${t}m`,u=(e=0)=>(t,r,o)=>`[${38+e};2;${t};${r};${o}m`,g={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],overline:[53,55],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],gray:[90,39],grey:[90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgGray:[100,49],bgGrey:[100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]}};Object.keys(g.modifier);Object.keys(g.color),Object.keys(g.bgColor);const h=function(){const e=new Map;for(const[t,r]of Object.entries(g)){for(const[t,o]of Object.entries(r))g[t]={open:`[${o[0]}m`,close:`[${o[1]}m`},r[t]=g[t],e.set(o[0],o[1]);Object.defineProperty(g,t,{value:r,enumerable:!1})}return Object.defineProperty(g,"codes",{value:e,enumerable:!1}),g.color.close="[39m",g.bgColor.close="[49m",g.color.ansi=c(),g.color.ansi256=a(),g.color.ansi16m=u(),g.bgColor.ansi=c(10),g.bgColor.ansi256=a(10),g.bgColor.ansi16m=u(10),Object.defineProperties(g,{rgbToAnsi256:{value:(e,t,r)=>e===t&&t===r?e<8?16:e>248?231:Math.round((e-8)/247*24)+232:16+36*Math.round(e/255*5)+6*Math.round(t/255*5)+Math.round(r/255*5),enumerable:!1},hexToRgb:{value(e){const t=/[a-f\d]{6}|[a-f\d]{3}/i.exec(e.toString(16));if(!t)return[0,0,0];let[r]=t;3===r.length&&(r=[...r].map((e=>e+e)).join(""));const o=Number.parseInt(r,16);return[o>>16&255,o>>8&255,255&o]},enumerable:!1},hexToAnsi256:{value:e=>g.rgbToAnsi256(...g.hexToRgb(e)),enumerable:!1},ansi256ToAnsi:{value(e){if(e<8)return 30+e;if(e<16)return e-8+90;let t,r,o;if(e>=232)t=(10*(e-232)+8)/255,r=t,o=t;else{const n=(e-=16)%36;t=Math.floor(e/36)/5,r=Math.floor(n/6)/5,o=n%6/5}const n=2*Math.max(t,r,o);if(0===n)return 30;let i=30+(Math.round(o)<<2|Math.round(r)<<1|Math.round(t));return 2===n&&(i+=60),i},enumerable:!1},rgbToAnsi:{value:(e,t,r)=>g.ansi256ToAnsi(g.rgbToAnsi256(e,t,r)),enumerable:!1},hexToAnsi:{value:e=>g.ansi256ToAnsi(g.hexToAnsi256(e)),enumerable:!1}}),g}();function f(e,r=t.argv){const o=e.startsWith("-")?"":1===e.length?"-":"--",n=r.indexOf(o+e),i=r.indexOf("--");return-1!==n&&(-1===i||n<i)}const{env:b}=t;let d;function m(e,{streamIsTTY:o,sniffFlags:n=!0}={}){const i=function(){if("FORCE_COLOR"in b)return"true"===b.FORCE_COLOR?1:"false"===b.FORCE_COLOR?0:0===b.FORCE_COLOR.length?1:Math.min(Number.parseInt(b.FORCE_COLOR,10),3)}();void 0!==i&&(d=i);const s=n?d:i;if(0===s)return 0;if(n){if(f("color=16m")||f("color=full")||f("color=truecolor"))return 3;if(f("color=256"))return 2}if(e&&!o&&void 0===s)return 0;const l=s||0;if("dumb"===b.TERM)return l;if("win32"===t.platform){const e=r.release().split(".");return Number(e[0])>=10&&Number(e[2])>=10586?Number(e[2])>=14931?3:2:1}if("CI"in b)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI","GITHUB_ACTIONS","BUILDKITE","DRONE"].some((e=>e in b))||"codeship"===b.CI_NAME?1:l;if("TEAMCITY_VERSION"in b)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(b.TEAMCITY_VERSION)?1:0;if("TF_BUILD"in b&&"AGENT_NAME"in b)return 1;if("truecolor"===b.COLORTERM)return 3;if("TERM_PROGRAM"in b){const e=Number.parseInt((b.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(b.TERM_PROGRAM){case"iTerm.app":return e>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(b.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(b.TERM)||"COLORTERM"in b?1:l}function p(e,t={}){return function(e){return 0!==e&&{level:e,hasBasic:!0,has256:e>=2,has16m:e>=3}}(m(e,{streamIsTTY:e&&e.isTTY,...t}))}f("no-color")||f("no-colors")||f("color=false")||f("color=never")?d=0:(f("color")||f("colors")||f("color=true")||f("color=always"))&&(d=1);const v={stdout:p({isTTY:o.isatty(1)}),stderr:p({isTTY:o.isatty(2)})};function O(e,t,r){let o=e.indexOf(t);if(-1===o)return e;const n=t.length;let i=0,s="";do{s+=e.slice(i,o)+t+r,i=o+n,o=e.indexOf(t,i)}while(-1!==o);return s+=e.slice(i),s}const{stdout:T,stderr:y}=v,R=Symbol("GENERATOR"),_=Symbol("STYLER"),A=Symbol("IS_EMPTY"),E=["ansi","ansi","ansi256","ansi16m"],M=Object.create(null),C=e=>{const t=(...e)=>e.join(" ");return((e,t={})=>{if(t.level&&!(Number.isInteger(t.level)&&t.level>=0&&t.level<=3))throw new Error("The `level` option should be an integer from 0 to 3");const r=T?T.level:0;e.level=void 0===t.level?r:t.level})(t,e),Object.setPrototypeOf(t,w.prototype),t};function w(e){return C(e)}Object.setPrototypeOf(w.prototype,Function.prototype);for(const[e,t]of Object.entries(h))M[e]={get(){const r=x(this,j(t.open,t.close,this[_]),this[A]);return Object.defineProperty(this,e,{value:r}),r}};M.visible={get(){const e=x(this,this[_],!0);return Object.defineProperty(this,"visible",{value:e}),e}};const B=(e,t,r,...o)=>"rgb"===e?"ansi16m"===t?h[r].ansi16m(...o):"ansi256"===t?h[r].ansi256(h.rgbToAnsi256(...o)):h[r].ansi(h.rgbToAnsi(...o)):"hex"===e?B("rgb",t,r,...h.hexToRgb(...o)):h[r][e](...o),L=["rgb","hex","ansi256"];for(const e of L){M[e]={get(){const{level:t}=this;return function(...r){const o=j(B(e,E[t],"color",...r),h.color.close,this[_]);return x(this,o,this[A])}}};M["bg"+e[0].toUpperCase()+e.slice(1)]={get(){const{level:t}=this;return function(...r){const o=j(B(e,E[t],"bgColor",...r),h.bgColor.close,this[_]);return x(this,o,this[A])}}}}const I=Object.defineProperties((()=>{}),{...M,level:{enumerable:!0,get(){return this[R].level},set(e){this[R].level=e}}}),j=(e,t,r)=>{let o,n;return void 0===r?(o=e,n=t):(o=r.openAll+e,n=t+r.closeAll),{open:e,close:t,openAll:o,closeAll:n,parent:r}},x=(e,t,r)=>{const o=(...e)=>N(o,1===e.length?""+e[0]:e.join(" "));return Object.setPrototypeOf(o,I),o[R]=e,o[_]=t,o[A]=r,o},N=(e,t)=>{if(e.level<=0||!t)return e[A]?"":t;let r=e[_];if(void 0===r)return t;const{openAll:o,closeAll:n}=r;if(t.includes(""))for(;void 0!==r;)t=O(t,r.close,r.open),r=r.parent;const i=t.indexOf("\n");return-1!==i&&(t=function(e,t,r,o){let n=0,i="";do{const s="\r"===e[o-1];i+=e.slice(n,s?o-1:o)+t+(s?"\r\n":"\n")+r,n=o+1,o=e.indexOf("\n",n)}while(-1!==o);return i+=e.slice(n),i}(t,n,o,i)),o+t+n};Object.defineProperties(w.prototype,M);const P=w();function S(e){return e.replace(/[^A-Za-z0-9]/g,"").toLowerCase().replace(/-(.)/g,(function(e,t){return t.toUpperCase()}))}w({level:y?y.level:0});const $={all:0,debug:1,deviceEvent:2,info:3,warn:4,error:5,fatal:98,none:99},Y={host:"",logLevel:"all",prompt:" => ",showTime:!1,symbol:{debug:"dbg",info:"",deviceEvent:"",warn:"(!)",error:"[!]",fatal:"{x_X}"},terminal:!0},G={debug:P.gray,info:P.white,deviceEvent:P.green,warn:P.yellow,error:P.red,fatal:P.redBright};function k(e,t){G[e]=t}function F(e){G.warn=e}function U(e){return JSON.stringify(e,null,2)}function V(t,r){return e(t,{colors:!0,depth:r})}function D(t){return e(t,{colors:!0,depth:2})}class H{_debug=()=>{};_info=()=>{};_deviceEvent=()=>{};_warn=()=>{};_error=()=>{};_fatal=()=>{};_defaultLogger(e,t){console.log(e)}prompt=" => ";host="";logLevel="all";terminal=!0;showTime=!1;showMillis=!1;get time(){const e=new Date;let t="",r="",o="";e.getHours()<10&&(t="0"),e.getMinutes()<10&&(r="0"),e.getSeconds()<10&&(o="0"),t+=e.getHours(),r+=e.getMinutes(),o+=e.getSeconds();let n=t+":"+r+":"+o;return this.showMillis&&(n+=":"+e.getMilliseconds()),P.grey(n)}ps(e){let t="";return!0===this.showTime&&(t+=this.time+" "),""!==this.symbol[e]&&(t+=G[e](this.symbol[e])+" "),t+=G[e](this.host)+this.prompt,t}symbol;assignOptions(e,t){for(const r in t)"object"!=typeof e[r]?e[r]=t[r]||e[r]:this.assignOptions(e[r],t[r])}getLevelLoggers(){return{debug:this._debug,info:this._info,deviceEvent:this._deviceEvent,warn:this._warn,error:this._error,fatal:this._fatal}}logger=this._defaultLogger;resetLogger(){this.logger=this._defaultLogger}constructor(e=Y){const t=s(e,Y);this.assignOptions(this,t),this.spawnLevelLoggers()}spawnLevelLoggers(){for(let e in this.symbol){let t=e;this["_"+e]=e=>{let r=`${this.ps(t)}${o=e,"string"==typeof o?o:D(o)}`;var o;return $[this.logLevel]<=$[t]&&this.logger(r,t),r}}}}export{H as Msg,Y as defaultMsgOptions,S as filterName,$ as logRank,D as nspct2,V as nspect,k as setColorize,F as setWarn,U as strfy};
