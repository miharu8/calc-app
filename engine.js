(function(g){
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
const F=(n,d=1)=>{if(d<0){n=-n;d=-d}const k=gcd(n,d)||1;return{n:n/k,d:d/k}};
const add=(a,b)=>F(a.n*b.d+b.n*a.d,a.d*b.d),mul=(a,b)=>F(a.n*b.n,a.d*b.d),neg=a=>F(-a.n,a.d),inv=a=>F(a.d,a.n),isz=a=>a.n===0,sub=(a,b)=>add(a,neg(b));
const fs=a=>a.d===1?''+a.n:a.n+'/'+a.d;
const dec=a=>{const v=a.n/a.d;return +v.toFixed(6)};
const bad=m=>{throw new Error(m)};
const cst=f=>isz(f)?{}:{'0,0':f};
const padd=(p,q)=>{const r={...p};for(const k in q){r[k]=r[k]?add(r[k],q[k]):q[k];if(isz(r[k]))delete r[k]}return r};
const pneg=p=>{const r={};for(const k in p)r[k]=neg(p[k]);return r};
const pmul=(p,q)=>{let r={};for(const a in p)for(const b in q){const[i,j]=a.split(',').map(Number),[k,l]=b.split(',').map(Number);r=padd(r,{[(i+k)+','+(j+l)]:mul(p[a],q[b])})}return r};
const isC=p=>Object.keys(p).every(k=>k==='0,0');
const cv=p=>p['0,0']||F(0);
const isq=n=>{const r=Math.round(Math.sqrt(n));return r*r===n?r:null};
function tok(s){
 s=s.replace(/²/g,'^2').replace(/³/g,'^3').normalize('NFKC').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/[−ー‐]/g,'-').replace(/\s+/g,'').replace(/<=|≦/g,'≤').replace(/>=|≧/g,'≥').replace(/sqrt/gi,'√');
 const t=s.match(/\d+\.?\d*|\.\d+|[xy]|[-+*\/^()=<>≤≥√]/g)||[];
 if(t.join('').length!==s.length)bad('使えない文字が入っています。数字、x、y、+ - × ÷ ( ) ^ √ = が使えます。');
 return t}
function parse(t){let i=0;const pk=()=>t[i],nx=()=>t[i++];
 function expr(){let r=term();while(pk()==='+'||pk()==='-'){const o=nx(),q=term();r=padd(r,o==='+'?q:pneg(q))}return r}
 function term(){let r=un();for(;;){const c=pk();
  if(c==='*'||c==='/'){nx();const q=un();if(c==='*')r=pmul(r,q);else{if(!isC(q)||isz(cv(q)))bad('わり算は「0以外の数でわる」形だけ対応しています。');r=pmul(r,cst(inv(cv(q))))}}
  else if(c&&/^[xy(√\d.]/.test(c))r=pmul(r,pw());else return r}}
 function un(){if(pk()==='-'){nx();return pneg(un())}if(pk()==='+'){nx();return un()}return pw()}
 function pw(){const b=atom();if(pk()!=='^')return b;nx();const e=un();if(!isC(e)||cv(e).d!==1||cv(e).n<0||cv(e).n>6)bad('累乗の指数は0〜6の整数だけ対応しています。');let r=cst(F(1));for(let k=0;k<cv(e).n;k++)r=pmul(r,b);return r}
 function atom(){const c=nx();if(c===undefined)bad('式が途中で終わっています。');
  if(/^[\d.]/.test(c)){const[a,b='']=c.split('.');return cst(F(+(a+b||0),Math.pow(10,b.length)))}
  if(c==='x')return{'1,0':F(1)};if(c==='y')return{'0,1':F(1)};
  if(c==='('){const r=expr();if(nx()!==')')bad('かっこが閉じていません。');return r}
  if(c==='√'){const a=atom();if(!isC(a))bad('√の中は数だけ対応しています。');const f=cv(a),n=isq(f.n),d=isq(f.d);if(n===null||d===null)bad('√の中が平方数でない場合は、この版では未対応です（例：√9、√(1/4)は対応）。');return cst(F(n,d))}
  bad('この式は読み取れませんでした。')}
 const r=expr();if(i<t.length)bad('式の読み取りが途中で止まりました。入力を見直してください。');return r}
const P=s=>parse(tok(s));
const show=p=>{const ks=Object.keys(p).sort((a,b)=>{const[x,y]=a.split(',').map(Number),[u,v]=b.split(',').map(Number);return(u+v)-(x+y)||u-x});if(!ks.length)return'0';let s='';
 ks.forEach((k,n)=>{const[i,j]=k.split(',').map(Number),c=p[k],m=(i?'x'+(i>1?'^'+i:''):'')+(j?'y'+(j>1?'^'+j:''):''),ng=c.n<0,a=ng?F(-c.n,c.d):c;
  const cs=(a.n===1&&a.d===1&&m)?'':(a.d===1?''+a.n:'('+a.n+'/'+a.d+')');s+=(ng?(n?' - ':'-'):(n?' + ':''))+cs+m});return s};
const ev=(p,x,y=F(0))=>{let r=F(0);for(const k in p){const[i,j]=k.split(',').map(Number);let t=p[k];for(let a=0;a<i;a++)t=mul(t,x);for(let a=0;a<j;a++)t=mul(t,y);r=add(r,t)}return r};
const X=f=>({'1,0':f});
function linear(L,R){const D=padd(L,pneg(R)),a=D['1,0']||F(0),b=cv(D),st=[];
 st.push('まずカッコをはずして、左右をスッキリ整理するよ！',show(L)+' = '+show(R));
 if(isz(a)){return isz(b)?{ans:'どんな x でも成り立ちます（解は無数）',steps:st}:{ans:'解はありません',steps:st}}
 st.push('x は左、ただの数は右にお引っ越し！（引っ越すと＋と－が逆になるよ）',show(X(a))+' = '+fs(neg(b)));
 const v=mul(neg(b),inv(a));
 if(!(a.n===1&&a.d===1))st.push('x を1個分にしたいから、左右を '+fs(a)+' でわるよ！','x = '+fs(neg(b))+' ÷ '+fs(a)+' = '+fs(v));
 st.push('検算：x = '+fs(v)+' を元の式に入れてためすよ。左 = '+fs(ev(L,v))+'、右 = '+fs(ev(R,v))+'。'+(ev(L,v).n*ev(R,v).d===ev(R,v).n*ev(L,v).d?'ぴったり同じだから正解！':''));
 return{ans:'x = '+fs(v)+(v.d>1?'（約 '+dec(v)+'）':''),steps:st}}
function quad(L,R){const D=padd(L,pneg(R)),a=D['2,0']||F(0),b=D['1,0']||F(0),c=cv(D),st=[];
 st.push('ぜんぶ左に集めて「x²の項＋xの項＋数＝0」の形にそろえるよ！',show(D)+' = 0');
 const d=sub(mul(b,b),mul(F(4),mul(a,c)));
 st.push('まず判別式 D = b² − 4ac を計算するよ（a='+fs(a)+'、b='+fs(b)+'、c='+fs(c)+'）。','D = '+fs(d));
 if(d.n<0)return{ans:'実数の解はありません',steps:st};
 const n=isq(d.n),m=isq(d.d),A=mul(F(2),a);
 if(n!==null&&m!==null){const s=F(n,m),r1=mul(add(neg(b),s),inv(A)),r2=mul(sub(neg(b),s),inv(A));
  const f=(q,r)=>{const p=r.n,w=(q>1?q:'')+'x';return p===0?w:'('+w+(p>0?'-'+p:'+'+(-p))+')'};
  const lead=F(a.n,a.d*r1.d*r2.d),ls=(lead.n===1&&lead.d===1)?'':lead.n===-1&&lead.d===1?'-':(lead.d===1?''+lead.n:'('+fs(lead)+')');
  st.push('解の公式 x = (−b ± √D) ÷ 2a に入れるよ。√D = '+fs(s)+'。','x = '+fs(r1)+'、x = '+fs(r2));
  const same=r1.n===r2.n&&r1.d===r2.d;
  st.push('因数分解の形でも書けるよ：',ls+f(r1.d,r1)+f(r2.d,r2)+' = 0');
  return{ans:same?'x = '+fs(r1)+'（重解）':'x = '+[r1,r2].sort((p,q)=>p.n*q.d-q.n*p.d).map(fs).join('、'),steps:st,roots:[r1,r2],lead:ls}}
 if(d.d===1&&a.d===1&&b.d===1){const[o,r2]=simpR(d.n);let g=gcd(gcd(Math.abs(b.n),o),Math.abs(2*a.n))||1,B=-b.n/g,O=o/g,A2=2*a.n/g;if(A2<0){A2=-A2;B=-B}const rt=(O===1?'':O)+'√'+r2,sd0=Math.sqrt(d.n),y1=(-b.n+sd0)/(2*a.n),y2=(-b.n-sd0)/(2*a.n);
  st.push('√D = √'+d.n+(o>1?' = '+o+'√'+r2:'')+'。解の公式にあてはめます。');
  const top=B===0?'±'+rt:B+' ± '+rt;return{ans:'x = '+(A2===1?top:'('+top+')/'+A2)+'（約 '+(+y1.toFixed(4))+'、'+(+y2.toFixed(4))+'）',steps:st}}
 const sd=Math.sqrt(d.n/d.d),x1=(-b.n/b.d+sd)/(2*a.n/a.d),x2=(-b.n/b.d-sd)/(2*a.n/a.d);
 st.push('√D がキレイな数にならないから、解の公式で近似値を出すよ。');
 return{ans:'x = '+(+x1.toFixed(4))+'、'+(+x2.toFixed(4))+'（約）',steps:st}}
function system(es){const q=es.map(e=>{const[l,r]=e.split('=');const D=padd(P(l),pneg(P(r)));for(const k in D)if(!['1,0','0,1','0,0'].includes(k))bad('連立方程式は x と y の一次式だけ対応しています。');return{a:D['1,0']||F(0),b:D['0,1']||F(0),c:neg(cv(D))}}),[e1,e2]=q,st=[];
 const E=e=>show({'1,0':e.a,'0,1':e.b})+' = '+fs(e.c);
 st.push('x と y が並ぶ「xの項＋yの項＝数」の形にそろえるよ！','① '+E(e1),'② '+E(e2));
 const Dt=sub(mul(e1.a,e2.b),mul(e2.a,e1.b));
 if(isz(Dt))return{ans:'ただ1組の解には決まりません（解なし、または無数）',steps:st};
 st.push('加減法でいくよ！① の両辺を '+fs(e2.b)+' 倍、② の両辺を '+fs(e1.b)+' 倍して y の数をそろえて、ひき算で y を消すよ！','('+fs(Dt)+')x = '+fs(sub(mul(e1.c,e2.b),mul(e2.c,e1.b))));
 const x=mul(sub(mul(e1.c,e2.b),mul(e2.c,e1.b)),inv(Dt));
 const y=!isz(e1.b)?mul(sub(e1.c,mul(e1.a,x)),inv(e1.b)):mul(sub(e2.c,mul(e2.a,x)),inv(e2.b));
 st.push('x = '+fs(x)+'。これを '+(!isz(e1.b)?'①':'②')+' に入れて y を求めます。','y = '+fs(y));
 const ok=e=>{const l=add(mul(e.a,x),mul(e.b,y));return l.n===e.c.n&&l.d===e.c.d};
 st.push('検算：① '+(ok(e1)?'成り立つ':'成り立たない')+'、② '+(ok(e2)?'成り立つ':'成り立たない')+'。');
 return{ans:'x = '+fs(x)+'、y = '+fs(y),steps:st}}
function ineq(s){const m=s.match(/≤|≥|<|>/),op=m[0],[l,r]=s.split(op),L=P(l),R=P(r),D=padd(L,pneg(R));
 for(const k in D)if(!['1,0','0,0'].includes(k))bad('不等式は x の一次式だけ対応しています。');
 const a=D['1,0']||F(0),b=cv(D),st=['x は左、数は右にお引っ越し！',show(X(a))+' '+op+' '+fs(neg(b))];
 if(isz(a)){const t=op==='<'?b.n<0:op==='>'?b.n>0:op==='≤'?b.n<=0:b.n>=0;return{ans:t?'すべての数':'解なし',steps:st}}
 const v=mul(neg(b),inv(a)),fl={'<':'>','>':'<','≤':'≥','≥':'≤'};let o=op;
 if(a.n<0){o=fl[op];st.push('負の数 '+fs(a)+' でわるから、不等号の向きが逆になるよ！（'+op+' → '+o+'）。')}
 else if(!(a.n===1&&a.d===1))st.push('正の数 '+fs(a)+' でわるから、不等号の向きはそのままでOK！');
 return{ans:'x '+o+' '+fs(v),steps:st}}
function factor(p){const a=p['2,0']||F(0),b=p['1,0']||F(0),c=cv(p);
 for(const k in p)if(!['2,0','1,0','0,0'].includes(k))bad('因数分解は、x の2次式だけ対応しています。');
 if(isz(a))bad('因数分解は、x² を含む式だけ対応しています。');
 const r=quad(p,{});if(!r.roots)return{ans:'この式は整数の範囲では因数分解できません',steps:['x²+bx+c の形で、かけて c、たして b になる2数を探しますが、見つかりません。']};
 return{ans:r.lead+(r.ans.includes('重解')?'':'')+r.steps[r.steps.length-1].replace(/ = 0$/,''),steps:['かけて '+fs(c)+'、たして '+fs(b)+' になる2つの数を探して分けるよ！'].concat(r.steps.slice(1))}}

const lcm=(a,b)=>a/gcd(a,b)*b;
function simpR(n){let o=1,r=n;for(let i=Math.floor(Math.sqrt(n));i>1;i--)if(n%(i*i)===0){o=i;r=n/(i*i);break}return[o,r]}
function fracSteps(t){const m=t.match(/^(\d+)\/(\d+)([+*-])(\d+)\/(\d+)$/);if(!m)return null;const[a,b,o,c,d]=[+m[1],+m[2],m[3],+m[4],+m[5]],st=[];
 if(o==='*'){st.push('分数のかけ算は、分子どうし・分母どうしをかけます。',a+'×'+c+' / '+b+'×'+d+' = '+a*c+'/'+b*d,'約分できるときは約分します。 → '+fs(F(a*c,b*d)));return st}
 const L=lcm(b,d),x=a*(L/b),y=c*(L/d),z=o==='+'?x+y:x-y;
 st.push('分母がちがうので通分します（'+b+' と '+d+' の最小公倍数は '+L+'）。',a+'/'+b+' = '+x+'/'+L+'、'+c+'/'+d+' = '+y+'/'+L,'分母がそろったので、分子どうしを計算します。',x+'/'+L+(o==='+'?' + ':' - ')+y+'/'+L+' = '+z+'/'+L,'約分できるときは約分します。 → '+fs(F(z,L)));return st}
function expSteps(t){let f=null,m;
 if(m=t.match(/^\(([^()]+)\)\^2$/))f=['('+m[1]+')','('+m[1]+')'];
 else if(m=t.match(/^(\([^()]+\))(\([^()]+\))$/))f=[m[1],m[2]];
 else if(m=t.match(/^(\d+)(\([^()]+\))$/))f=[m[1],m[2]];
 if(!f)return null;const A=P(f[0]),B=P(f[1]),T=p=>Object.keys(p).map(k=>({[k]:p[k]})),pc=[];
 for(const a of T(A))for(const b of T(B))pc.push('('+show(a)+') × ('+show(b)+') = '+show(pmul(a,b)));
 return['分配法則：前の式の各項を、後ろの式の各項にそれぞれかけます。'].concat(pc,['同じ文字・同じ次数の項（同類項）をまとめます。',show(P(t))])}
function radical(s){const t=s.replace(/\s+/g,'').normalize('NFKC').replace(/sqrt\(?(\d+)\)?/gi,'√$1').replace(/√\((\d+)\)/g,'√$1').replace(/−/g,'-');
 if(!/^[\d√+-]+$/.test(t)||!/√/.test(t))return null;const ts=t.match(/[+-]?[^+-]+/g);if(!ts||ts.join('')!==t)return null;const co={},st=[];
 for(const x of ts){let m=x.match(/^([+-]?)(\d*)√(\d+)$/),k=x.match(/^([+-]?)(\d+)$/);
  if(m){const sg=m[1]==='-'?-1:1;let c=m[2]===''?1:+m[2];const[o,r]=simpR(+m[3]);c*=o;
   if(o>1)st.push('√'+m[3]+' = √('+o*o+'×'+r+') = '+o+(r>1?'√'+r:'')+'（'+o*o+' は平方数なので、√の外に出せます）');
   const key=r===1?'1':''+r;co[key]=(co[key]||0)+sg*c}
  else if(k)co['1']=(co['1']||0)+(k[1]==='-'?-1:1)*+k[2];else return null}
 const ks=Object.keys(co).filter(z=>co[z]!==0).sort((a,b)=>b-a);let ans='',val=0;
 ks.forEach((z,n)=>{const v=co[z],a=Math.abs(v);val+=v*Math.sqrt(+z);const body=z==='1'?''+a:(a===1?'':a)+'√'+z;ans+=(v<0?(n?' - ':'-'):(n?' + ':''))+body});
 if(!ans)ans='0';st.push('√の中が同じ数の項は、文字式の同類項と同じようにまとめられます。','答え：'+ans);
 return{ans:ans+(/√/.test(ans)?'（約 '+(+val.toFixed(4))+'）':''),steps:st}}
function funcEval(parts){const ts=parts.map(z=>tok(z).join(''));const xi=ts.findIndex(z=>/^x=[^xy=]+$/.test(z));if(xi<0)return null;const o=ts[1-xi];
 if(!/y/.test(o)||(o.match(/=/g)||[]).length!==1)return null;const xv=cv(P(ts[xi].split('=')[1])),[l,r]=o.split('='),D=padd(P(l),pneg(P(r)));let c=F(0),b=F(0);
 for(const k in D){const[i,j]=k.split(',').map(Number);if(j>1)return null;let t=D[k];for(let q=0;q<i;q++)t=mul(t,xv);if(j===1)b=add(b,t);else c=add(c,t)}
 if(isz(b))return null;const y=mul(neg(c),inv(b));
 return{ans:'y = '+fs(y)+(y.d>1?'（約 '+dec(y)+'）':''),steps:['式に x = '+fs(xv)+' を入れます。(−)の数は かっこ をつけて入れるとまちがえにくくなります。',show({'0,0':c,'0,1':b})+' = 0','y について解きます。','y = '+fs(y)]}}
function geo(raw){const w=raw.normalize('NFKC'),n=(w.match(/\d+\.?\d*/g)||[]).map(Number),R=v=>Math.round(v*1e6)/1e6;
 if(/三角形.*面積/.test(w)&&n.length>=2)return{ans:R(n[0]*n[1]/2)+' cm²',steps:['三角形の面積 = 底辺 × 高さ ÷ 2','= '+n[0]+' × '+n[1]+' ÷ 2 = '+R(n[0]*n[1]/2)]};
 if(/長方形.*面積/.test(w)&&n.length>=2)return{ans:R(n[0]*n[1])+' cm²',steps:['長方形の面積 = たて × よこ','= '+n[0]+' × '+n[1]]};
 if(/円.*面積/.test(w)&&n.length>=1)return{ans:R(n[0]*n[0]*3.14)+' cm²',steps:['円の面積 = 半径 × 半径 × 3.14','= '+n[0]+' × '+n[0]+' × 3.14']};
 if(/円周/.test(w)&&n.length>=1)return{ans:R(2*n[0]*3.14)+' cm',steps:['円周 = 直径 × 3.14 = 半径 × 2 × 3.14','= '+n[0]+' × 2 × 3.14']};
 if(/斜辺|三平方/.test(w)&&n.length>=2){const s=n[0]*n[0]+n[1]*n[1];let a;if(Number.isInteger(s)){const q=isq(s);if(q!==null)a=''+q;else{const[o,r]=simpR(s);a=(o>1?o:'')+'√'+r+'（約 '+R(Math.sqrt(s))+'）'}}else a='約 '+R(Math.sqrt(s));
  return{ans:a,steps:['三平方の定理：斜辺² = 他の2辺²の和','斜辺² = '+n[0]+'² + '+n[1]+'² = '+R(s),'斜辺 = √'+R(s)]}}
 return null}
function solve(raw){try{
 const gg=/面積|円周|斜辺|三平方/.test(raw)&&!/[=＝]/.test(raw)?geo(raw):null;if(gg)return{ok:true,...gg};
 let s=String(raw).replace(/²/g,'^2').normalize('NFKC');const fac=/因数分解|factor/i.test(s);
 s=s.replace(/因数分解|展開|を解く|を解け|解け|解く|求めよ|しなさい|してください|して|の|を|せよ/g,'').replace(/[、,;；。:：\s]+$/,'');
 if(!s.trim())bad('式を入力してください。例：3x+5=20');
 const rd=radical(s);if(rd)return{ok:true,...rd};
 const parts=s.split(/[、,;；\n]|かつ/).filter(z=>z.trim());
 let r;
 if(parts.length>1){if(parts.length!==2||parts.some(z=>(z.match(/=/g)||[]).length!==1))bad('連立方程式は2つの式（=を含む）を「、」で区切って入力してください。例：x+y=10、x-y=2');r=funcEval(parts)||system(parts.map(z=>tok(z).join('')))}
 else{const t=tok(s).join('');
  if(/≤|≥|<|>/.test(t))r=ineq(t);
  else if(t.includes('=')){const e=t.split('=');if(e.length!==2)bad('等号（=）は1つだけにしてください。');const L=P(e[0]),R=P(e[1]),D=padd(L,pneg(R));
   if(Object.keys(D).some(k=>k.split(',')[1]!=='0'))bad('y を含む式は、2つの式を「、」で区切って連立方程式として入力してください。');
   const deg=Math.max(0,...Object.keys(D).map(k=>+k.split(',')[0]));
   if(deg>2)bad('3次以上の方程式は中学校の範囲外のため未対応です。');
   r=deg===2?quad(L,R):linear(L,R)}
  else{const p=P(t);
   if(fac)r=factor(p);
   else if(isC(p)){const v=cv(p);const fsx=fracSteps(t);const fm=t.match(/^(\d+)\/(\d+)([+-])(\d+)\/(\d+)$/),ex=[];if(fm){const A=+fm[2],Bb=+fm[5],l=A*Bb/gcd(A,Bb);ex.push('通分するよ！分母 '+A+' と '+Bb+' の最小公倍数は '+l+'。',fm[1]*l/A+'/'+l+' '+fm[3]+' '+fm[4]*l/Bb+'/'+l+' を計算して、'+(fm[3]==='+'?+fm[1]*l/A+ +fm[4]*l/Bb:fm[1]*l/A-fm[4]*l/Bb)+'/'+l+'（約分できるならして、答えは上のとおり）')}r={ans:fs(v)+(v.d>1?'（約 '+dec(v)+'）':''),steps:['計算の順番は ①カッコの中 → ②累乗・かけ算・わり算 → ③たし算・ひき算 だよ！','分数のたし算・ひき算は、先に分母をそろえる（通分）のがコツ。かけ算は分子どうし・分母どうしをかけるだけ！',s+' = '+fs(v)].concat(fsx?['分数の計算の手順：'].concat(fsx):[])}}
   else r={ans:show(p),steps:expSteps(t)||['分配法則で、カッコの中身を1個ずつかけてはずして、同じなかまの項をまとめるよ！','まとめたらこうなる：'+show(p)]}}}
 return{ok:true,...r}}catch(e){return{ok:false,err:e.message+'\n\n入力できる例：\n・12+8×3\n・1/2+1/3\n・3x+5=20\n・x^2-5x+6=0\n・x+y=10、x-y=2\n・(x+2)(x+3)\n・x^2+5x+6 の因数分解\n・2x-3>5'}}}
g.Solve=solve;if(typeof module!=='undefined')module.exports=solve;
})(typeof window!=='undefined'?window:globalThis);
