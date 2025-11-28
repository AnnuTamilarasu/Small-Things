gsap.registerPlugin(ScrollTrigger, Draggable);

/* ----- STARS ----- */
const STAR_COUNT = 150;
const sections = [".intro", ".home"];
sections.forEach(sel => {
  const section = document.querySelector(sel);
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random();
    star.classList.add(size<0.5?"small":size<0.85?"medium":"large");
    star.style.left = `${Math.random()*100}%`;
    star.style.top = `${Math.random()*100}%`;
    star.style.animationDelay = `${Math.random()*3}s`;
    star.style.animationDuration = `${2+Math.random()*3}s`;
    section.appendChild(star);
  }
});

/* ----- RAIN ----- */
const rainContainer = document.getElementById("rain");
const DROP_COUNT = 80;
for(let i=0;i<DROP_COUNT;i++){
  const drop = document.createElement("div");
  drop.className="rain-drop";
  drop.style.left = `${Math.random()*100}vw`;
  drop.style.top = `${-50-Math.random()*500}px`;
  drop.style.height = `${20+Math.random()*60}px`;
  drop.style.opacity = `${0.25+Math.random()*0.75}`;
  rainContainer.appendChild(drop);
}
const drops = gsap.utils.toArray(".rain-drop");
gsap.to(drops, {
  y: () => window.innerHeight + 800 + Math.random()*600,
  ease: "none",
  stagger: { each:0.01, from:"random" },
  scrollTrigger: { trigger:".intro", start:"top top", endTrigger:".home", end:"top top", scrub:true }
});

/* ----- CLOUDS ----- */
window.onload = () => {
  const intro = document.querySelector(".intro");
  const cloudCount = 8;

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");

    const width = Math.random() * 200 + 150; // bigger clouds
    cloud.style.width = width + "px";
    cloud.style.height = (width / 3) + "px";
    cloud.style.top = `${Math.random() * 80}%`;

    const duration = 60 + Math.random() * 40; // random speed
    const delay = Math.random() * 20;

    if (Math.random() > 0.5) {
      cloud.style.left = "-300px"; // start offscreen left
      cloud.style.animation = `drift-left-to-right ${duration}s linear ${delay}s infinite`;
    } else {
      cloud.style.left = "calc(100vw + 300px)"; // start offscreen right
      cloud.style.animation = `drift-right-to-left ${duration}s linear ${delay}s infinite`;
    }

    intro.appendChild(cloud);
  }
};



/* ----- LIGHTNING ----- */
const lightningContainer = document.getElementById("lightning");
function createLightningBolt(){
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.classList.add("lightning-bolt");
  const startX = Math.random()*window.innerWidth;
  const segments = 8 + Math.floor(Math.random()*6);
  let pathData = `M ${startX} 0`; let x=startX, y=0;
  for(let i=0;i<segments;i++){
    y+=window.innerHeight/segments+(Math.random()*50-25);
    x+=Math.random()*100-50;
    pathData+=` L ${x} ${y}`;
  }
  const path = document.createElementNS("http://www.w3.org/2000/svg","path");
  path.setAttribute("d",pathData);
  path.setAttribute("stroke","#ffffff");
  path.setAttribute("stroke-width","2");
  path.setAttribute("fill","none");
  svg.appendChild(path);
  svg.style.position="absolute"; svg.style.top=0; svg.style.left=0; svg.style.width="100%"; svg.style.height="100%";
  return svg;
}
ScrollTrigger.create({
  trigger:".intro",
  start:"top top",
  endTrigger:".home",
  end:"top top",
  onUpdate:(self)=>{
    if(Math.random()>0.98 && self.progress<0.95){
      const bolt = createLightningBolt();
      lightningContainer.appendChild(bolt);
      document.body.style.backgroundColor="#ffffff";
      gsap.to(bolt,{opacity:0,duration:0.3,onComplete:()=>bolt.remove()});
      gsap.to(document.body,{backgroundColor:"#001a3d",duration:0.2});
    }
  }
});

/* ----- HOME FADE-IN ----- */
gsap.from(".home",{opacity:0,y:150,scrollTrigger:{trigger:".home",start:"top 90%",end:"top 40%",scrub:true}});

/* ----- MOOD SLIDER ----- */
const flair = document.querySelector(".flair--1");
const bar = document.querySelector(".progress-bar");
const fill = document.querySelector(".progress-fill");
Draggable.create(flair,{type:"x",bounds:bar,onDrag:updateFill,onThrowUpdate:updateFill});
function updateFill(){
  const maxWidth = bar.clientWidth - flair.clientWidth;
  const percent = Math.max(0,Math.min(100,(this.x/maxWidth)*100));
  fill.style.width = percent+"%";
}
