import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
/* Name the tail — the sovereigns that actually hold the world's defaulted debt (BoC–BoE, 2024).
   Answers the reader's most concrete question: which countries? Thirteen hold ~92% of it, and the
   roster is revealing — petrostate collapse (Venezuela), sanctioned/conflict states (Russia, Iraq,
   Ukraine), and the frontier (Sri Lanka, Zambia, Ghana) side by side. */
const ROOT = process.cwd(); const sha = (s:string)=>createHash('sha256').update(s).digest('hex');
const csv=(t:string)=>{const R:string[][]=[];let r:string[]=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}else if(c==='"')q=true;else if(c===',' ){r.push(f);f='';}else if(c==='\n'){r.push(f);R.push(r);r=[];f='';}else if(c==='\r'){}else f+=c;}if(f.length||r.length){r.push(f);R.push(r);}return R;};
const d=readdirSync(join(ROOT,'data/sources/boc-boe')).filter(x=>/\d{4}-/.test(x)).sort().pop()!;
const body=readFileSync(join(ROOT,'data/sources/boc-boe',d,'raw.csv'),'utf8'); const all=csv(body);
const oi=all.findIndex(r=>r[0]==='OBSERVATIONS'); const h=all[oi+1]; const cC=h.indexOf('DEBT_COUNTRY'),cY=h.indexOf('DEBT_YEAR'),cT=h.indexOf('DEBT_TOTAL_2025');
const NAME:Record<string,string>={'USSR/Russian Federation':'Russia','Venezuela':'Venezuela'};
const latest:[string,number][]=[];
for(const r of all.slice(oi+2)){if(+r[cY]===2024&&r[cC]!=='World'){const v=parseFloat(r[cT]);if(Number.isFinite(v)&&v>0)latest.push([NAME[r[cC]]??r[cC],v]);}}
latest.sort((a,b)=>b[1]-a[1]);
const top=latest.slice(0,13);
const col=(i:number)=>i<4?'despair':i<9?'ochre':'stone';
const bars=top.map(([c,v],i)=>({label:c,value:Math.round(v/100)/10,color:col(i)}));
const art={chartId:'defaults-by-country',kind:'bars',title:'Who actually holds the world’s defaulted debt',unit:'US$ billions in default, 2024',yearSpan:'2024',xmax:100,xTicks:[0,25,50,75,100],bars,
 provenance:{source:'boc-boe',sourceIndicator:'Sovereign debt in default by country, 2024',url:'https://www.bankofcanada.ca/2025/10/staff-analytical-note-2025-24/',license:'Bank of Canada — reuse with attribution',vintage:d,checksum:sha(body),definition:'Sovereign government debt in default, by country, 2024, US$ billions. The thirteen largest hold about 92% of the world total.',attribution:'Bank of Canada & Bank of England — Sovereign Default Database',primarySource:'BoC–BoE Sovereign Default Database 2025'},
 recipe:[{op:'cross_section_latest',detail:'top 13 sovereigns by US$ in default, 2024'}]};
mkdirSync(join(ROOT,'src/data/derived'),{recursive:true});
writeFileSync(join(ROOT,'src/data/derived/defaults-by-country.json'),JSON.stringify(art,null,2));
console.log('✓ defaults-by-country:',bars.map(b=>b.label+' $'+b.value+'bn').join(' · '));
