const lightningContainer = document.getElementById("rain");
lightningContainer.id = "lightning";

function createLightningBolt() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("lightning-bolt");

  const startX = Math.random() * window.innerWidth;
  const segments = 8 + Math.floor(Math.random() * 6);

  let pathData = `M ${startX} 0`;
  let currentX = startX;
  let currentY = 0;

  for (let i = 0; i < segments; i++) {
    currentY += (window.innerHeight / segments) + (Math.random() * 50 - 25);
    currentX += (Math.random() * 100 - 50);
    pathData += ` L ${currentX} ${currentY}`;
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("stroke", "#ffffff");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("fill", "none");
  path.setAttribute("filter", "url(#glow)");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", "glow");

  const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
  feGaussianBlur.setAttribute("stdDeviation", "3");
  feGaussianBlur.setAttribute("result", "coloredBlur");

  const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
  const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
  feMergeNode1.setAttribute("in", "coloredBlur");

  const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
  feMergeNode2.setAttribute("in", "SourceGraphic");

  feMerge.appendChild(feMergeNode1);
  feMerge.appendChild(feMergeNode2);

  filter.appendChild(feGaussianBlur);
  filter.appendChild(feMerge);
  defs.appendChild(filter);

  svg.appendChild(defs);
  svg.appendChild(path);

  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";

  return svg;
}

ScrollTrigger.create({
  trigger: ".intro",
  start: "top top",
  endTrigger: ".home",
  end: "top top",
  onUpdate: (self) => {
    if (Math.random() > 0.98 && self.progress < 0.95) {
      const bolt = createLightningBolt();
      lightningContainer.appendChild(bolt);

      document.body.style.backgroundColor = "#ffffff";

      gsap.to(bolt, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => bolt.remove()
      });

      gsap.to(document.body, {
        backgroundColor: "#000000",
        duration: 0.2
      });
    }
  }
});
