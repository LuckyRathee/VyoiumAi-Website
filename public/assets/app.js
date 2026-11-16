if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){const updates=new EventSource('/__reload');updates.onmessage=()=>location.reload();}
const dialog=document.querySelector('#enquiry-dialog');
let opener;
if(dialog?.showModal){document.querySelectorAll('[data-enquiry]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();opener=link;dialog.querySelector('[name=source]').value=location.pathname;dialog.showModal();dialog.querySelector('[name=name]').focus();}));dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});}
document.querySelectorAll('form').forEach(form=>{form.querySelector('[name=source]').value=location.pathname;form.addEventListener('submit',async event=>{event.preventDefault();if(form.dataset.pending)return;form.dataset.pending='true';const button=form.querySelector('button[type=submit]');const status=form.querySelector('.form-status');button.disabled=true;status.textContent='Sending your enquiry…';try{const response=await fetch(form.action,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form))});const result=await response.json();status.textContent=result.message||'Unable to send. Your details have been kept. Please try again.';if(response.ok&&result.ok){form.reset();form.querySelector('[name=source]').value=location.pathname;}}catch{status.textContent='Unable to connect. Your details have been kept. Please try again.';}finally{delete form.dataset.pending;button.disabled=false;}});});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const steps=[...document.querySelectorAll('.process li')];
if(steps.length){const update=()=>{steps.forEach(el=>el.classList.toggle('active',reduced.matches||el.getBoundingClientRect().top<innerHeight*.78));};addEventListener('scroll',update,{passive:true});addEventListener('resize',update);reduced.addEventListener('change',update);update();}
const canvas=document.querySelector('#particle-head');
if(canvas){const context=canvas.getContext('2d');const art=canvas.parentElement;const toggle=document.querySelector('.motion-toggle');let visible=true,paused=false,frame=0,last=0,width=0,height=0,aura=null,yaw=-.12;
// Points are flattened into typed arrays once and grouped into brightness buckets, so a frame allocates nothing.
const all=createBustPoints(innerWidth<700);const source=all.filter(p=>!p.burst),burst=all.filter(p=>p.burst);const n=source.length,B=6,m=burst.length;
const QX=new Float32Array(m),QY=new Float32Array(m),QZ=new Float32Array(m),QD=new Float32Array(m),QDX=new Float32Array(m),QDY=new Float32Array(m),QS=new Float32Array(m),QP=new Float32Array(m),QV=new Float32Array(m),QB=new Float32Array(m);
burst.forEach((p,k)=>{QX[k]=p.x;QY[k]=p.y;QZ[k]=p.z;QD[k]=p.burst;QDX[k]=p.dx;QDY[k]=p.dy;QS[k]=p.size;QP[k]=p.phase;QV[k]=p.speed;QB[k]=p.bright;});
const order=source.map((p,i)=>i).sort((a,b)=>source[a].bright-source[b].bright);
const PX=new Float32Array(n),PY=new Float32Array(n),PZ=new Float32Array(n),PS=new Float32Array(n),PB=new Float32Array(n),SX=new Float32Array(n),SY=new Float32Array(n),bucketEnd=new Int32Array(B);
order.forEach((j,k)=>{const p=source[j];PX[k]=p.x;PY[k]=p.y;PZ[k]=p.z;PS[k]=p.size;PB[k]=p.bright;bucketEnd[Math.min(B-1,Math.floor(p.bright*B))]=k+1;});
for(let b=1;b<B;b++)bucketEnd[b]=Math.max(bucketEnd[b],bucketEnd[b-1]);
const colors=['rgba(72,96,134,.5)','rgba(104,132,172,.62)','rgba(142,168,204,.76)','rgba(178,200,230,.88)','rgba(208,224,244,.96)','rgba(236,244,255,1)'];
let seed=7;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const sparkles=Array.from({length:innerWidth<700?40:90},()=>{let k;do{k=Math.floor(rnd()*n);}while(PB[k]<.7);return {k,phase:rnd()*6.28,speed:.6+rnd()*1.4};});
const digits=Array.from({length:innerWidth<700?30:64},()=>({x:rnd(),y:rnd(),d:.25+rnd()*.75,v:rnd()<.5?'0':'1',speed:.00002+rnd()*.00005,phase:rnd()*6.28}));
const glow=document.createElement('canvas');glow.width=glow.height=32;{const g=glow.getContext('2d');const grad=g.createRadialGradient(16,16,0,16,16,16);grad.addColorStop(0,'rgba(245,250,255,1)');grad.addColorStop(.25,'rgba(190,212,245,.5)');grad.addColorStop(1,'rgba(120,150,210,0)');g.fillStyle=grad;g.fillRect(0,0,32,32);}
let s=1,cx=0,top=0;
const resize=()=>{const r=art.getBoundingClientRect();width=r.width;height=r.height;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=width*ratio;canvas.height=height*ratio;context.setTransform(ratio,0,0,ratio,0,0);s=Math.min(height*.95/2.6,width*.9/2.12);cx=width*.54;top=height*.05;aura=context.createRadialGradient(cx,top+s*.55,0,cx,top+s*.9,s*1.25);aura.addColorStop(0,'rgba(120,155,220,.16)');aura.addColorStop(1,'rgba(120,155,220,0)');};
const project=()=>{const c=Math.cos(yaw),sn=Math.sin(yaw);for(let k=0;k<n;k++){const x=PX[k]*c+PZ[k]*sn,z=PZ[k]*c-PX[k]*sn,p=1/(1-z*.22);SX[k]=cx+x*s*p;SY[k]=top+(1.2+(PY[k]-1.2)*p)*s;}};
const draw=time=>{const t=time/1000;yaw=-.12+.07*Math.sin(t*.22);project();
 context.clearRect(0,0,width,height);context.globalCompositeOperation='lighter';context.fillStyle=aura;context.fillRect(0,0,width,height);
 context.textAlign='center';context.shadowColor='rgba(170,195,235,.9)';for(const d of digits){const y=((d.y+t*d.speed*60)%1.1)-.05;context.globalAlpha=(.1+.42*d.d)*(.55+.45*Math.sin(t*.8+d.phase));context.shadowBlur=d.d>.82?8:0;context.font=`${Math.round(8+d.d*14)}px ui-monospace,Consolas,monospace`;context.fillStyle='#a9bfe0';context.fillText(d.v,d.x*width,y*height);}
 context.shadowBlur=0;context.globalAlpha=1;
 let start=0;for(let b=0;b<B;b++){context.fillStyle=colors[b];for(let k=start;k<bucketEnd[b];k++){const z=PS[k];context.fillRect(SX[k]-z*.5,SY[k]-z*.5,z,z);}start=bucketEnd[b];}
 // Burst: particles break away, drift outward and fade, then re-form on the body.
 {const c=Math.cos(yaw),sn=Math.sin(yaw);context.fillStyle='rgba(214,228,248,1)';for(let k=0;k<m;k++){const pr=(t*QV[k]+QP[k])%1,e=pr*pr*(3-2*pr),x0=QX[k]+QDX[k]*QD[k]*e,y0=QY[k]+QDY[k]*QD[k]*e,x=x0*c+QZ[k]*sn,z=QZ[k]*c-x0*sn,p=1/(1-z*.22),px=cx+x*s*p,py=top+(1.2+(y0-1.2)*p)*s;context.globalAlpha=QB[k]*(pr<.06?pr/.06:1)*Math.pow(1-pr,.6);const sz=QS[k]*(1-pr*.4);context.fillRect(px-sz*.5,py-sz*.5,sz,sz);}context.globalAlpha=1;}
 // A slow scan line sweeping down the figure.
 const scan=((t*.12)%1.4)*2.6-.3;context.fillStyle='rgba(245,250,255,.9)';for(let k=0;k<n;k++){const d=Math.abs(PY[k]-scan);if(d<.05){context.globalAlpha=(1-d/.05)*.65;const z=PS[k]*1.2;context.fillRect(SX[k]-z*.5,SY[k]-z*.5,z,z);}}
 for(const sp of sparkles){const a=Math.max(0,Math.sin(t*sp.speed+sp.phase));if(a<.35)continue;const z=PS[sp.k]*7*a;context.globalAlpha=a*.8;context.drawImage(glow,SX[sp.k]-z/2,SY[sp.k]-z/2,z,z);}
 context.globalAlpha=1;context.globalCompositeOperation='source-over';};
const tick=time=>{frame=0;if(paused||!visible||document.hidden||reduced.matches)return;if(time-last>32){draw(time);last=time;}frame=requestAnimationFrame(tick);};
const sync=()=>{cancelAnimationFrame(frame);frame=0;toggle.hidden=reduced.matches;art.classList.toggle('rendered',!reduced.matches);if(!reduced.matches){draw(performance.now());frame=requestAnimationFrame(tick);}};
if(context){resize();canvas.dataset.particleCount=String(n);toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Resume animation':'Pause animation';toggle.setAttribute('aria-pressed',String(paused));sync();});new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(art);addEventListener('resize',()=>{resize();sync();});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);sync();}}

// Motion system: scroll progress, header state and scroll reveals. Nothing follows the cursor.
{const root=document.documentElement,header=document.querySelector('.site-header');
const bar=document.createElement('div');bar.className='scroll-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
let ticking=false;const onScroll=()=>{ticking=false;const max=root.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;header?.classList.toggle('scrolled',scrollY>24);};
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});onScroll();
if(!reduced.matches&&'IntersectionObserver' in window){
 const targets=[...document.querySelectorAll('.section-heading>*,.service-card,.split>*,.faq details,.final-cta>*,.footer-top>*,.contact-panel,.founder>*,.workflow>*,.marquee,.process-section .section-heading~*')];
 root.classList.add('motion');
 const io=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target);}},{rootMargin:'0px 0px -20px 0px',threshold:.05});
 for(const el of targets){const index=[...el.parentElement.children].indexOf(el);el.classList.add('reveal');el.style.setProperty('--d',`${Math.min(index,6)*80}ms`);io.observe(el);}
}
}
