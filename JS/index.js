gsap.registerPlugin(ScrollTrigger, Draggable);


/* ----- STARS  ----- */
window.addEventListener("DOMContentLoaded", () => {
  const STAR_SETTINGS = {
    ".intro": 1000,
    ".memes-container": 200,
    ".scream-container": 200,
    ".motivator-container": 200,
    ".music-page":200,
    ".chat-container":200
  };

  Object.entries(STAR_SETTINGS).forEach(([selector, count]) => {
    const section = document.querySelector(selector);

    if (section) {
      for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = "star";

        const size = Math.random();
        star.classList.add(
          size < 0.5 ? "small" : 
          size < 0.85 ? "medium" : 
          "large"
        );

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;

        section.appendChild(star);
      }
    }
  });
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
  const cloudCount = 20; 
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
}else {

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

/* ----- MOOD SLIDER WITH EMOJI & ACTIVITY SUGGESTIONS ----- */
// GSAP Draggable Progress Bar
const flair = document.querySelector(".flair");
const bar = document.querySelector(".progress-bar");
const fill = document.querySelector(".progress-fill");
const flairLabel = flair ? flair.querySelector("label") : null;

// Emoji mapping based on percentage ranges
const emojiMap = {
  0: "😭",   // 0-10%
  10: "😢",  // 10-20%
  20: "😔",  // 20-30%
  30: "😕",  // 30-40%
  40: "😐",  // 40-50%
  50: "🙂",  // 50-60% (neutral/normal)
  60: "😊",  // 60-70%
  70: "😄",  // 70-80%
  80: "😁",  // 80-90%
  90: "🤩"   // 90-100%
};

// Activity suggestions based on mood
const activitySuggestions = {
  0: {
    title: "It's okay to not be okay 💙",
    activities: [
      "Talk to someone you trust",
      "Call a helpline (988)",
      "Practice deep breathing",
      "Write down your feelings"
    ]
  },
  10: {
    title: "Let's take it one step at a time 🫂",
    activities: [
      "Listen to calming music",
      "Take a warm shower",
      "Cuddle with a pet",
      "Watch something comforting"
    ]
  },
  20: {
    title: "Small things can help 🌱",
    activities: [
      "Go for a short walk",
      "Make your favorite tea",
      "Look at cute animal videos",
      "Do some gentle stretching"
    ]
  },
  30: {
    title: "You're doing better than you think 💭",
    activities: [
      "Journal your thoughts",
      "Listen to uplifting music",
      "Call a friend",
      "Try a simple creative activity"
    ]
  },
  40: {
    title: "Let's shift the energy a bit ✨",
    activities: [
      "Try a new hobby",
      "Cook something simple",
      "Organize a small space",
      "Watch a funny video"
    ]
  },
  50: {
    title: "Keep the balance going 🌟",
    activities: [
      "Read a book you enjoy",
      "Try a new recipe",
      "Go for a nature walk",
      "Connect with friends"
    ]
  },
  60: {
    title: "You're in a good place! 😊",
    activities: [
      "Start a new project",
      "Exercise or dance",
      "Learn something new",
      "Help someone else"
    ]
  },
  70: {
    title: "Keep this momentum! 🎉",
    activities: [
      "Try something adventurous",
      "Share your joy with others",
      "Create art or music",
      "Plan something fun"
    ]
  },
  80: {
    title: "You're glowing! ✨",
    activities: [
      "Celebrate your wins",
      "Inspire others",
      "Take on a challenge",
      "Document this feeling"
    ]
  },
  90: {
    title: "Absolutely incredible! 🌈",
    activities: [
      "Share your happiness",
      "Do something bold",
      "Start that dream project",
      "Spread positivity"
    ]
  }
};

function getEmojiForPercent(percent) {
  const range = Math.floor(percent / 10) * 10;
  return emojiMap[range] || "🙂";
}

function getSuggestionForPercent(percent) {
  const range = Math.floor(percent / 10) * 10;
  return activitySuggestions[range] || activitySuggestions[50];
}

function updateSuggestion(percent) {
  const suggestion = getSuggestionForPercent(percent);
  let suggestionBox = document.querySelector('.activity-suggestion');
  
  // Create suggestion box if it doesn't exist
  if (!suggestionBox) {
    suggestionBox = document.createElement('div');
    suggestionBox.className = 'activity-suggestion';
    document.querySelector('.mood-section').appendChild(suggestionBox);
  }
  
  // Update content with animation
  suggestionBox.style.opacity = '0';
  setTimeout(() => {
    suggestionBox.innerHTML = `
      <h3>${suggestion.title}</h3>
      <ul>
        ${suggestion.activities.map(activity => `<li>${activity}</li>`).join('')}
      </ul>
    `;
    suggestionBox.style.opacity = '1';
  }, 150);
}

if (flair && bar && fill) {
  // Remove any inline styles
  flair.style.left = '0';
  
  // Create draggable
  Draggable.create(flair, {
    type: "x",
    bounds: bar,
    onDrag: updateFill,
    onThrowUpdate: updateFill,
    cursor: "grab"
  });
  
  function updateFill() {
    const maxWidth = bar.clientWidth - flair.clientWidth;
    const percent = Math.max(0, Math.min(100, (this.x / maxWidth) * 100));
    
    // Update fill width
    fill.style.width = percent + "%";
    
    // Update emoji based on percentage
    if (flairLabel) {
      flairLabel.textContent = getEmojiForPercent(percent);
    }
    
    // Update activity suggestion
    updateSuggestion(percent);
  }
  
  // Click on progress bar to jump to position
  bar.addEventListener('click', (e) => {
    if (e.target !== flair && !flair.contains(e.target)) {
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const flairWidth = flair.offsetWidth;
      const barWidth = bar.offsetWidth;
      
      // Calculate new position
      const newX = clickX - (flairWidth / 2);
      const maxX = barWidth - flairWidth;
      const boundedX = Math.max(0, Math.min(maxX, newX));
      
      // Animate to new position
      gsap.to(flair, {
        x: boundedX,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: function() {
          const percent = Math.max(0, Math.min(100, (boundedX / maxX) * 100));
          fill.style.width = percent + "%";
          if (flairLabel) {
            flairLabel.textContent = getEmojiForPercent(percent);
          }
          updateSuggestion(percent);
        }
      });
    }
  });
  
  // Set initial position to 50% (neutral)
  window.addEventListener('load', () => {
    const initialPercent = 50;
    const maxWidth = bar.clientWidth - flair.clientWidth;
    const initialX = (maxWidth * initialPercent) / 100;
    
    gsap.set(flair, { x: initialX });
    fill.style.width = initialPercent + "%";
    if (flairLabel) {
      flairLabel.textContent = getEmojiForPercent(initialPercent);
    }
    updateSuggestion(initialPercent);
  });
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