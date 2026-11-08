(() => { "use strict";
  document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const root = $('easing-lab'); if (!root) return;
  const ease = {
    linear:t=>t,
    smooth:t=>t*t*(3-2*t),
    'ease-in':t=>t*t*t,
    'ease-out':t=>1-(1-t)**3,
    smoother:t=>t*t*t*(t*(t*6-15)+10),
    back:t=>1+2.70158*(t-1)**3+1.70158*(t-1)**2
  };
  const el = id => $(id);
  const val = id => Number(el(id).value);
  const set = (id,s) => { el(id).textContent=s; };
  let playback = null, startTime = 0;
  const stop = () => { if (playback !== null) cancelAnimationFrame(playback); playback = null; set('ease-play','▶ Play preview'); };
  const state = () => {
    const start=Math.floor(val('ease-start')),end=Math.floor(val('ease-end'));
    const from=val('ease-from'),to=val('ease-to'),fps=val('ease-fps');
    if (![start,end,from,to,fps].every(Number.isFinite) || end<=start || end-start>10000 || fps<=0) return null;
    return {start,end,from,to,fps,fn:ease[el('ease-preset').value]};
  };
  const at = (s,frame) => { const t=Math.max(0,Math.min(1,(frame-s.start)/(s.end-s.start))); return {t,y:s.fn(t),value:s.from+(s.to-s.from)*s.fn(t)}; };
  function render(){
    const s=state(); if (!s){stop();set('ease-message','Enter a valid frame range (1–10,000 frames) and numeric values.');return;}
    set('ease-message','');
    const scrub=el('ease-scrub');scrub.min=s.start;scrub.max=s.end;
    let frame=Math.max(s.start,Math.min(s.end,Math.round(Number(scrub.value))));scrub.value=frame;
    const p=at(s,frame);
    set('ease-frame-label',frame);set('ease-value',p.value.toFixed(3));set('ease-meta',`Frame ${frame} · ${(p.t*100).toFixed(1)}% through the interval`);
    el('ease-progress').style.width=(Math.max(0,Math.min(1,p.y))*100)+'%';
    el('ease-object').style.left=(Math.max(0,Math.min(1,p.y))*100)+'%';
    const x=45+556*p.t, y=239-170*p.y;
    el('ease-marker').setAttribute('cx',x);el('ease-marker').setAttribute('cy',y);
    el('ease-marker-line').setAttribute('x1',x);el('ease-marker-line').setAttribute('x2',x);
    let d=''; for(let i=0;i<=180;i++){const t=i/180,z=s.fn(t);d+=(i?'L':'M')+(45+556*t).toFixed(2)+' '+(239-170*z).toFixed(2)+' ';}
    el('ease-path').setAttribute('d',d.trim());
  }
  function update() { stop(); const s=state(); if(s)el('ease-scrub').value=s.start; render(); }
  ['ease-preset','ease-start','ease-end','ease-from','ease-to','ease-fps'].forEach(id=>el(id).addEventListener('input',update));
  el('ease-scrub').addEventListener('input',()=>{stop();render();});
  el('ease-play').addEventListener('click',()=>{
    if(playback!==null){stop();return;}
    const s=state();if(!s)return;
    const duration=(s.end-s.start)/s.fps*1000;
    el('ease-scrub').value=s.start;set('ease-play','❚❚ Pause');
    startTime=performance.now();
    const tick=now=>{
      const t=Math.min(1,(now-startTime)/duration);
      el('ease-scrub').value=s.start+Math.round(t*(s.end-s.start));render();
      if(t<1)playback=requestAnimationFrame(tick);else stop();
    };
    playback=requestAnimationFrame(tick);
  });
  el('ease-reset').addEventListener('click',()=>{stop();const s=state();if(s)el('ease-scrub').value=s.start;render();});
  el('ease-export').addEventListener('click',()=>{
    const s=state();if(!s)return;
    const rows=['frame,progress,value'];for(let f=s.start;f<=s.end;f++){const p=at(s,f);rows.push([f,p.t.toFixed(6),p.value.toFixed(6)].join(','));}
    const url=URL.createObjectURL(new Blob([rows.join('\n')],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='framelab-curve.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  });
  render();
  });
})();