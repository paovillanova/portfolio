

/* CANVAS 2 */

function initFooterWaveEffect() {

  const wrapper = document.querySelector(".footer_hover-effect");
  if (!wrapper) return;

  // Crear canvas aislado
  const footerCanvas = document.createElement("canvas");
  footerCanvas.id = "line-effect";
  wrapper.appendChild(footerCanvas);

  const footerContext = footerCanvas.getContext("2d");

  const footerMouse = { x: -9999, y: -9999 };
  const footerLines = [];

  let horizontalPadding = 0;
  let verticalPadding = 0;

  /* -------------------- DRAW WAVE -------------------- */

  const drawWaveEffect = (width, height) => {

    horizontalPadding = window.innerWidth < 768 ? 0 : width * 0.197;
    verticalPadding = height * 0.197;

    const linesCount = 60;
    const lineHeight = (height - verticalPadding * 2) / linesCount;
    const cellWidth = 5;
    const cols = Math.floor((width - horizontalPadding * 2) / cellWidth);

    const typeCanvasWidth = 120;
    const typeCanvasHeight = 50;
    const typeCanvas = document.createElement("canvas");
    const typeContext = typeCanvas.getContext("2d");

    typeCanvas.width = typeCanvasWidth;
    typeCanvas.height = typeCanvasHeight;

    const fontSize = typeCanvasWidth * 0.22;

    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, typeCanvasWidth, typeCanvasHeight);

    typeContext.fillStyle = "white";
    typeContext.font = `${fontSize}px Anton`;
    typeContext.textBaseline = "middle";
    typeContext.textAlign = "center";
    typeContext.fillText("STXNERS", typeCanvasWidth / 2, typeCanvasHeight / 2);

    const typeData = typeContext.getImageData(
      0,
      0,
      typeCanvasWidth,
      typeCanvasHeight
    ).data;

    footerLines.length = 0;

    for (let i = 0; i < linesCount; i++) {

      const y = verticalPadding + i * lineHeight;
      const line = [];

      for (let j = 0; j < cols; j++) {

        const x = horizontalPadding + j * cellWidth;

        const typeX = Math.floor((j / cols) * typeCanvasWidth);
        const typeY = Math.floor((i / linesCount) * typeCanvasHeight);
        const index = (typeY * typeCanvasWidth + typeX) * 4;
        const brightness = typeData[index] || 0;

        const heightOffset = (brightness / 255) * 20;
        const finalY = y - heightOffset;

        line.push({
          x,
          y: finalY,
          baseX: x,
          baseY: finalY,
        });
      }

      footerLines.push(line);
    }
  };

  /* -------------------- UPDATE -------------------- */

  const updateLines = (mouseX, mouseY, radius = 100, maxSpeed = 10) => {

    footerLines.forEach((line) => {

      line.forEach((point) => {

        const dx = point.x - mouseX;
        const dy = point.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {

          const angle = Math.atan2(dy, dx);
          const force = (radius - distance) / radius;

          point.x += Math.cos(angle) * force * maxSpeed;
          point.y += Math.sin(angle) * force * maxSpeed;
        }

        const springX = (point.baseX - point.x) * 0.1;
        const springY = (point.baseY - point.y) * 0.1;

        point.x += springX;
        point.y += springY;
      });
    });
  };

  /* -------------------- DRAW -------------------- */

  const drawLines = (width, height) => {

    footerContext.clearRect(0, 0, width, height);

    footerLines.forEach((line) => {

      footerContext.beginPath();
      footerContext.moveTo(line[0].x, line[0].y);

      for (let i = 1; i < line.length; i++) {

        const prev = line[i - 1];
        const current = line[i];

        const midX = (prev.x + current.x) / 2;
        const midY = (prev.y + current.y) / 2;

        footerContext.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }

      footerContext.strokeStyle = "#ffdfc4";
      footerContext.lineWidth = 0.5;
      footerContext.stroke();
    });
  };

  /* -------------------- RESIZE -------------------- */

  const resizeCanvas = () => {

    const scaleFactor = window.devicePixelRatio || 1;

    const width = wrapper.offsetWidth;
    const height = wrapper.offsetHeight;

    footerCanvas.width = width * scaleFactor;
    footerCanvas.height = height * scaleFactor;

    footerContext.setTransform(1, 0, 0, 1, 0, 0);
    footerContext.scale(scaleFactor, scaleFactor);

    drawWaveEffect(width, height);
  };

  /* -------------------- ANIMATE -------------------- */

  const animate = () => {

    const width = footerCanvas.width / (window.devicePixelRatio || 1);
    const height = footerCanvas.height / (window.devicePixelRatio || 1);

    updateLines(footerMouse.x, footerMouse.y);
    drawLines(width, height);

    requestAnimationFrame(animate);
  };

  /* -------------------- FONT LOAD -------------------- */

  const waitForFonts = async () => {

    if (document.fonts) {
      try {
        await document.fonts.load(`1em Anton`);
      } catch (e) {
        console.warn("Font load error:", e);
      }
    }

    resizeCanvas();
    animate();
  };

  /* -------------------- EVENTS -------------------- */

  wrapper.addEventListener("mousemove", (e) => {
    const rect = footerCanvas.getBoundingClientRect();
    footerMouse.x = e.clientX - rect.left;
    footerMouse.y = e.clientY - rect.top;
  });

  wrapper.addEventListener("touchmove", (e) => {
    const rect = footerCanvas.getBoundingClientRect();
    footerMouse.x = e.touches[0].clientX - rect.left;
    footerMouse.y = e.touches[0].clientY - rect.top;
  });

  window.addEventListener("resize", resizeCanvas);

  waitForFonts();
}

/* INIT aislado */
initFooterWaveEffect();