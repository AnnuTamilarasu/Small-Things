gsap.registerPlugin(ScrollTrigger, Draggable);

/* ----- STARS ----- */
const STAR_COUNT = 1000;
const sections = [".intro", ".home"];
sections.forEach(sel => {
  const section = document.querySelector(sel);
  if (section) {
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
  }
});

/* ----- RAIN ----- */
const rainContainer = document.getElementById("rain");
if (rainContainer) {
  const DROP_COUNT = 1500;
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
    y: () => window.innerHeight * 12,
    ease: "none",
    stagger: { each:0.01, from:"random" },
    scrollTrigger: { 
      trigger:".intro", 
      start:"top top", 
      end:"bottom top",
      scrub:true 
    }
  });
}

/* ----- CLOUDS ----- */
const intro = document.querySelector(".intro");
if (intro) {
  const cloudCount = 12; // Increased from 8
  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");

    const width = Math.random() * 200 + 150;
    cloud.style.width = width + "px";
    cloud.style.height = (width / 3) + "px";
    cloud.style.top = `${Math.random() * 80}%`;

    const duration = 60 + Math.random() * 40;
    const delay = Math.random() * -30;

    if (Math.random() > 0.5) {
      cloud.style.left = `${Math.random() * 120 - 10}%`;
      cloud.style.animation = `drift-left-to-right ${duration}s linear ${delay}s infinite`;
    } else {
      cloud.style.left = `${Math.random() * 120 - 10}%`;
      cloud.style.animation = `drift-right-to-left ${duration}s linear ${delay}s infinite`;
    }

    intro.appendChild(cloud);
  }
}

/* ----- LIGHTNING ----- */
const lightningContainer = document.getElementById("lightning");
if (lightningContainer) {
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
    end:"bottom top",
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
}

const homeSection = document.querySelector(".home");
if (homeSection) {
  gsap.from(".home",{opacity:0,y:150,scrollTrigger:{trigger:".home",start:"top 90%",end:"top 40%",scrub:true}});
}

/* ----- MOOD SLIDER ----- */
const flair = document.querySelector(".flair--1");
const bar = document.querySelector(".progress-bar");
const fill = document.querySelector(".progress-fill");
if (flair && bar && fill) {
  Draggable.create(flair,{type:"x",bounds:bar,onDrag:updateFill,onThrowUpdate:updateFill});
  function updateFill(){
    const maxWidth = bar.clientWidth - flair.clientWidth;
    const percent = Math.max(0,Math.min(100,(this.x/maxWidth)*100));
    fill.style.width = percent+"%";
  }
}

/* ----- SIDEBAR TOGGLE ----- */
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

if (sidebar && toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    document.body.classList.toggle("nav-collapsed");
  });
}

/* ----- ACCOUNT DROPDOWN TOGGLE ----- */
const accountBtn = document.getElementById("accountBtn");
const accountDropdown = document.getElementById("accountDropdown");

if (accountBtn && accountDropdown) {
  accountBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    accountDropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!accountBtn.contains(e.target) && !accountDropdown.contains(e.target)) {
      accountDropdown.classList.remove("active");
    }
  });
}