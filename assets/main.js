(function(){'use strict';
 const qs=(s,root=document)=>root.querySelector(s);
 const qsa=(s,root=document)=>[...root.querySelectorAll(s)];
 const fmt=(n,d=2)=>Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 const number=(id,defaultVal=0)=>{let x=parseFloat(qs('#'+id)?.value);return Number.isFinite(x)?x:defaultVal};
 const saveFile=(name,body,type='text/csv')=>{const b=new Blob([body],{type:type+';charset=utf-8'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const csv=(rows)=>rows.map(r=>r.map(c=>'"'+String(c??'').replaceAll('"','""')+'"').join(',')).join('\n');
 const setText=(id,s)=>{const el=qs('#'+id);if(el)el.textContent=s};
 function initNav(){const btn=qs('#menu-toggle'),nav=qs('#nav-links');if(btn&&nav){const close=()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')};btn.addEventListener('click',()=>{let open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open))});nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!btn.contains(e.target))close()})}}
 function initContact(){const config=window.FRAMELAB_CONFIG||{};qsa('[data-contact]').forEach(el=>{if(config.contactEmail){el.textContent=config.contactEmail;el.href='mailto:'+config.contactEmail}else{el.textContent='Contact details to be added before launch';el.removeAttribute('href')}})}
 function initAds(){const c=window.FRAMELAB_CONFIG||{};if(!c.adsEnabled||!/^ca-pub-\d+$/.test(c.adsenseClientId||''))return;const slots=qsa('[data-ad-slot]').filter(el=>/^\d+$/.test((c.adSlots||{})[el.dataset.adSlot]||''));if(!slots.length)return;const script=document.createElement('script');script.async=true;script.crossOrigin='anonymous';script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(c.adsenseClientId);script.onload=()=>{slots.forEach(el=>{el.hidden=false;el.className='ad-area-active';el.innerHTML='';let ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';ins.dataset.adClient=c.adsenseClientId;ins.dataset.adSlot=c.adSlots[el.dataset.adSlot];ins.dataset.adFormat='auto';ins.dataset.fullWidthResponsive='true';el.appendChild(ins);try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){console.warn('Ad slot unavailable',e)}})};document.head.appendChild(script)}
 function initFrame(){if(!qs('#frame-fps'))return;const fps=()=>parseFloat(qs('#frame-fps').value),nominal=()=>Math.round(fps());const toTime=(frame,rate)=>{let msTotal=Math.round(frame/rate*1000),h=Math.floor(msTotal/3600000);msTotal%=3600000;let m=Math.floor(msTotal/60000);msTotal%=60000;let sec=Math.floor(msTotal/1000),ms=msTotal%1000;return `${h}h ${m}m ${sec}.${String(ms).padStart(3,'0')}s`};const calculate=()=>{let rate=fps(),nom=nominal(),frames=Math.max(0,Math.floor(number('frame-count')));let h=Math.floor(frames/(nom*3600)),m=Math.floor(frames%(nom*3600)/(nom*60)),s=Math.floor(frames%(nom*60)/nom),f=frames%nom;setText('frame-tc',[h,m,s,f].map(v=>String(v).padStart(2,'0')).join(':'));setText('frame-elapsed',toTime(frames,rate));let hh=clamp(Math.floor(number('tc-h')),0,999),mm=clamp(Math.floor(number('tc-m')),0,59),ss=clamp(Math.floor(number('tc-s')),0,59),ff=clamp(Math.floor(number('tc-f')),0,nom-1);let total=(((hh*60+mm)*60+ss)*nom+ff);setText('tc-frames',total.toLocaleString());setText('tc-elapsed',toTime(total,rate));setText('fps-description',Number.isInteger(rate)?`Standard ${rate} fps`:`${rate} actual fps; ${nom} nominal timecode labels (non-drop frame)`)};qsa('#frame-tool input,#frame-tool select').forEach(el=>el.addEventListener('input',calculate));calculate()}
 function initWalk(){if(!qs('#walk-cycle'))return;const poses=['Contact A','Down A','Passing A','Up A','Contact B','Down B','Passing B','Up B','Contact A (next cycle)'];let data=[];const calc=()=>{let start=Math.max(0,Math.floor(number('walk-start',178))),duration=clamp(Math.floor(number('walk-duration',24)),8,240),fps=parseFloat(qs('#walk-fps').value),tbody=qs('#walk-output');data=poses.map((label,i)=>({label,frame:start+Math.round(duration*i/8),offset:Math.round(duration*i/8),time:duration*i/8/fps}));tbody.innerHTML=data.map((x,i)=>`<tr><td><span class="tag">${i+1}</span></td><td>${x.label}</td><td>${x.frame}</td><td>+${x.offset}</td></tr>`).join('');setText('walk-total',`${duration} frames · ${fmt(duration/fps)} seconds`);setText('walk-half',`${Math.round(duration/2)}-frame half-cycle`);setText('walk-note','Use as timing guide only. Pose placement should follow your character and reference footage.')};qsa('#walk-cycle input,#walk-cycle select').forEach(el=>el.addEventListener('input',calc));qs('#walk-export').addEventListener('click',()=>saveFile('framelab-walk-cycle.csv',csv([['Pose','Blender frame','Offset'],...data.map(p=>[p.label,p.frame,p.offset])])));calc()}
 function initRender(){if(!qs('#render-estimator'))return;const calc=()=>{let f=Math.max(0,number('render-frames')),sec=Math.max(0,number('render-seconds')),workers=clamp(Math.floor(number('render-workers',1)),1,1000),overhead=clamp(number('render-overhead',0),0,1000);let total=f*(sec+overhead)/workers;let human=total<60?`${fmt(total,1)} seconds`:total<3600?`${fmt(total/60,1)} minutes`:`${fmt(total/3600,2)} hours`;setText('render-result',human);setText('render-detail',`${fmt(f*sec/3600,2)} total render-hours before parallelism or overhead. An estimate, not a benchmark.`)};qsa('#render-estimator input').forEach(el=>el.addEventListener('input',calc));calc()}
 function initAspect(){if(!qs('#aspect-tool'))return;const calculate=()=>{let w=clamp(Math.floor(number('aspect-w',1920)),1,16000),h=clamp(Math.floor(number('aspect-h',1080)),1,16000),ratio=Number(qs('#aspect-target').value),src=w/h,cw,ch; if(src>ratio){ch=h;cw=Math.round(h*ratio)}else{cw=w;ch=Math.round(w/ratio)}let removed=(1-cw*ch/(w*h))*100;setText('aspect-result',`${cw} × ${ch}`);setText('aspect-percent',`${fmt(removed,1)}% of source pixels excluded by centred crop`);setText('aspect-src',`${w} × ${h} source`);setText('aspect-ratio-txt',`${fmt(ratio,3)}:1 target`);const preview=qs('#aspect-source'),box=qs('#aspect-crop');const maxW=420,maxH=255,scale=Math.min(maxW/w,maxH/h);preview.style.width=Math.round(w*scale)+'px';preview.style.height=Math.round(h*scale)+'px';const lw=cw/w*100,lh=ch/h*100;box.style.width=lw+'%';box.style.height=lh+'%';box.style.left=(100-lw)/2+'%';box.style.top=(100-lh)/2+'%';box.style.inset='auto';};qsa('#aspect-tool input,#aspect-tool select').forEach(el=>el.addEventListener('input',calculate));calculate()}
 function initShots(){
  if(!qs('#shot-planner'))return;
  const storageKey='framelab_shots_v1';let shots=[],editing=-1;
  const fps=()=>parseFloat(qs('#shots-fps').value);
  const persist=()=>{try{localStorage.setItem(storageKey,JSON.stringify(shots))}catch{setText('shots-message','Browser storage is unavailable. Export a backup instead.')}};
  const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validShot=x=>x&&typeof x.name==='string'&&x.name.trim().length>0&&x.name.length<=90&&Number.isSafeInteger(x.start)&&Number.isSafeInteger(x.end)&&x.start>=0&&x.end>=x.start&&x.end<=9999999;
  try{const parsed=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(parsed))shots=parsed.filter(validShot).slice(0,200)}catch{}
  const form=qs('#shots-form');const submit=form.querySelector('button[type=submit]');
  const endEdit=()=>{editing=-1;submit.textContent='+ Add shot';qs('#shots-cancel').hidden=true;qs('#shot-name').value='';};
  const render=()=>{
   qs('#shots-output').innerHTML=shots.length?shots.map((s,i)=>{let d=s.end-s.start+1;return `<tr><td>${escapeHTML(s.name)}</td><td>${s.start}</td><td>${s.end}</td><td>${d}</td><td>${fmt(d/fps())}s</td><td><div class="table-actions"><button class="tiny-button" data-edit-shot="${i}" aria-label="Edit ${escapeHTML(s.name)}">Edit</button><button class="tiny-button" data-delete-shot="${i}" aria-label="Remove ${escapeHTML(s.name)}">Remove</button></div></td></tr>`}).join(''):'<tr><td colspan="6" class="empty-state">No shots yet. Add your first shot above.</td></tr>';
   let total=shots.reduce((sum,s)=>sum+s.end-s.start+1,0);
   setText('shots-total',`${shots.length} shots · ${total} frames · ${fmt(total/fps())}s`);
  };
  form.addEventListener('submit',e=>{
   e.preventDefault();const name=qs('#shot-name').value.trim().slice(0,90),start=Number(qs('#shot-start').value),end=Number(qs('#shot-end').value);
   const shot={name,start,end};
   if(!validShot(shot)){setText('shots-message','Use a valid name and whole-number frame range (0–9,999,999).');return;}
   if(editing<0 && shots.length>=200){setText('shots-message','Limit of 200 shots reached. Export your current list first.');return;}
   if(editing>=0){shots[editing]=shot;setText('shots-message','Shot updated.');}
   else{shots.push(shot);setText('shots-message','Shot added. Saved in this browser.');}
   endEdit();persist();render();qs('#shot-name').focus();
  });
  qs('#shots-output').addEventListener('click',e=>{
   const edit=e.target.closest('[data-edit-shot]'),del=e.target.closest('[data-delete-shot]');
   if(edit){editing=Number(edit.dataset.editShot);const s=shots[editing];qs('#shot-name').value=s.name;qs('#shot-start').value=s.start;qs('#shot-end').value=s.end;submit.textContent='Save changes';qs('#shots-cancel').hidden=false;qs('#shot-name').focus();setText('shots-message',`Editing shot ${editing+1}.`)}
   if(del){const i=Number(del.dataset.deleteShot);shots.splice(i,1);if(editing===i)endEdit();else if(editing>i)editing--;persist();render();setText('shots-message','Shot removed.');}
  });
  qs('#shots-cancel').addEventListener('click',()=>{endEdit();setText('shots-message','Edit cancelled.');});
  qs('#shots-export').addEventListener('click',()=>saveFile('framelab-shot-list.csv',csv([['Shot','Start frame','End frame','Frame count','Duration seconds'],...shots.map(s=>[s.name,s.start,s.end,s.end-s.start+1,fmt((s.end-s.start+1)/fps(),3)])])));
  qs('#shots-export-json').addEventListener('click',()=>saveFile('framelab-shots.json',JSON.stringify({format:'FrameLab Shot List',version:1,fps:fps(),shots},null,2),'application/json'));
  qs('#shots-import-json').addEventListener('click',()=>qs('#shots-file').click());
  qs('#shots-file').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{
      if(file.size>1024*1024)throw new Error('Backup is too large (maximum 1 MB).');
      const obj=JSON.parse(await file.text()),list=Array.isArray(obj)?obj:obj.shots;
      if(!Array.isArray(list)||list.length>200||!list.every(validShot))throw new Error('Invalid backup: expected 0–200 valid shots.');
      if(!confirm(`Replace the ${shots.length} shots in this browser with ${list.length} imported shots?`))return;
      shots=list.map(s=>({name:s.name.trim(),start:s.start,end:s.end}));
      if(Number.isFinite(obj.fps)&&[23.976,24,25,30,60].includes(obj.fps))qs('#shots-fps').value=String(obj.fps);
      endEdit();persist();render();setText('shots-message',`Imported ${shots.length} shots successfully.`);
    }catch(err){setText('shots-message',err.message||'Unable to import backup.');}
    finally{e.target.value='';}
  });
  qs('#shots-fps').addEventListener('change',render);
  qs('#shots-clear').addEventListener('click',()=>{if(!shots.length)return;if(confirm('Remove all shots saved in this browser?')){shots=[];endEdit();persist();render();setText('shots-message','All shots cleared.')}});
  render();
 }

 function initSync(){
  if(!qs('#sync-tool'))return;
  const rate=(id)=>parseFloat(qs('#'+id).value);
  const val=(id)=>parseFloat(qs('#'+id).value);
  const stamp=(secs)=>{let ms=Math.max(0,Math.round(secs*1000));let h=Math.floor(ms/3600000);ms%=3600000;let m=Math.floor(ms/60000);ms%=60000;let s=Math.floor(ms/1000);ms%=1000;return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':')+'.'+String(ms).padStart(3,'0')};
  let last='';
  const calc=()=>{
   const sf=rate('sync-scene-fps'),vf=rate('sync-video-fps'),at=val('sync-anchor-frame'),as=val('sync-anchor-source'),query=val('sync-query'),offset=val('sync-offset');
   if(![sf,vf,at,as,query,offset].every(Number.isFinite)||sf<=0||vf<=0){setText('sync-message','Please enter valid values.');return}
   const map=(b)=>as+(b-at)*(vf/sf)+offset*vf;
   const mapped=map(query),rounded=Math.round(mapped);
   setText('sync-frame-result',mapped<0?'Before video start':String(Math.max(0,rounded)));
   setText('sync-time-result',mapped<0?'The calculated source moment is before the video begins.':`Source time: ${stamp(mapped/vf)} · exact frame index ${fmt(mapped,3)}`);
   const nearest=[-2,-1,0,1,2].map(d=>{let b=query+d,t=map(b);return '<tr><td>'+b+'</td><td>'+(t<0?'Before start':Math.round(t))+'</td><td>'+(t<0?'—':stamp(t/vf))+'</td></tr>'}).join('');
   qs('#sync-nearby').innerHTML=nearest;
   last=`Blender frame ${query} → source frame ${rounded} (${mapped.toFixed(3)} exact); video time ${mapped<0?'before start':stamp(mapped/vf)}. Anchor ${at}→${as}, Blender ${sf} fps, source ${vf} fps, offset ${offset}s.`;
   setText('sync-message','');
  };
  qsa('#sync-tool input,#sync-tool select').forEach(x=>x.addEventListener('input',calc));
  qs('#sync-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(last);setText('sync-message','Copied to clipboard.')}catch{setText('sync-message','Copy not available in this browser.')}});
  calc();
 }

 function initToolSearch(){const input=qs('#tool-search');if(!input)return;const cards=qsa('#tool-directory .tool-card');const update=()=>{const q=input.value.trim().toLowerCase();let visible=0;for(const card of cards){const ok=(card.dataset.toolSearch||card.textContent).toLowerCase().includes(q);card.hidden=!ok;if(ok)visible++}setText('tool-search-status',`${visible} tool${visible===1?'':'s'} found`);qs('#tools-empty').hidden=visible!==0;};input.addEventListener('input',update);update()}
 document.addEventListener('DOMContentLoaded',()=>{initNav();initContact();initAds();initFrame();initWalk();initRender();initAspect();initShots();initSync();initToolSearch()});
})();
