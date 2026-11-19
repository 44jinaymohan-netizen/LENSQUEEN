document.documentElement.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const opening=document.querySelector('.opening'),image=document.querySelector('.hero-image'),headline=document.querySelector('h1'),after=document.querySelector('.hero-after'),bottom=document.querySelector('.hero-bottom'),feeling=document.querySelector('.feeling');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
let ticking=false;
function render(){const h=innerHeight,y=scrollY;document.querySelector('.progress').style.width=(y/(document.documentElement.scrollHeight-h)*100)+'%';if(!reduced){const p=clamp(y/(opening.offsetHeight-h));image.style.transform=`scale(${1+p*.15})`;image.style.clipPath=`inset(${p*9}% ${p*13}% round ${p*120}px)`;headline.style.transform=`translateY(${-p*140}px)`;headline.style.opacity=1-clamp(p*2.3);bottom.style.opacity=1-clamp(p*3);after.style.opacity=clamp((p-.4)*2);after.style.transform=`translateY(${(1-p)*60}px)`;}
const q=reduced?1:clamp((-feeling.getBoundingClientRect().top/(feeling.offsetHeight-h)-.08)/.84);
const stage=document.querySelector('.fan-stage'),card=document.querySelector('.fan-center');
const step=Math.max(0,(stage.clientWidth-card.offsetWidth-24)/8);
const eased=q*q*(3-2*q);
document.querySelectorAll('.fan-side').forEach(el=>{
 const offset=Number(el.dataset.side)*Number(el.dataset.rank)*step*eased;
 el.style.transform=`translateX(${offset}px)`;
});
document.querySelector('.fan-hint').style.opacity=1-clamp(q*4);
updateShutter();ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(render);ticking=true}},{passive:true});addEventListener('resize',render);render();
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.onclick=()=>{const on=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(on));menu.textContent=on?'Close −':'Menu +'};nav.querySelectorAll('a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu +'});

function updateShutter(){
 const section=document.querySelector('.services'),stage=document.querySelector('.services-stage');
 const range=Math.max(1,section.offsetHeight-stage.offsetHeight);
 const progress=reduced?1:clamp(-section.getBoundingClientRect().top/range);
 const zoom=clamp((progress-.04)/.43),z=zoom*zoom*(3-2*zoom);
 const camera=document.querySelector('.camera-scene'),body=document.querySelector('.camera-object');
 const target=Math.hypot(stage.clientWidth,stage.clientHeight)/(body.clientWidth*190/1400)*.57;
 camera.style.transform=`scale(${1+(target-1)*z})`;
 camera.style.visibility=zoom>=1?'hidden':'visible';
 document.querySelector('.camera-intro').style.opacity=1-clamp(zoom*5);
 document.querySelector('.camera-scroll').style.opacity=1-clamp(zoom*5);
 const t=clamp((progress-.49)/.34),ease=t*t*(3-2*t);
 const travel=Math.hypot(stage.clientWidth,stage.clientHeight)*.83*ease;
 document.querySelectorAll('.shutter-blade').forEach(el=>{
  const a=Number(el.dataset.angle)*Math.PI/180;
  el.style.transform=`translate3d(${Math.cos(a)*travel}px,${Math.sin(a)*travel}px,${ease*160}px) rotate3d(${Math.sin(a)},${-Math.cos(a)},0,${ease*28}deg) rotateZ(${ease*12}deg)`;
 });
 const content=document.querySelector('.services-content');
 content.style.transform=`translateZ(${-90*(1-ease)}px) scale(${.95+.05*ease})`;
 const veil=document.querySelector('.shutter');veil.style.visibility=t===1?'hidden':'visible';
 // Covered service links must not receive focus until the shutter reveals them.
 content.inert=!reduced&&t<.65;
}
