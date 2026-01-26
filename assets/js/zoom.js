(function () {
  // Create the lightbox elements
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.85)";
  overlay.style.display = "none";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;
  overlay.style.cursor = "zoom-in";
  document.body.appendChild(overlay);

  const img = document.createElement("img");
  img.style.maxWidth = "90vw";
  img.style.maxHeight = "90vh";
  img.style.transformOrigin = "center center";
  img.style.transition = "transform 0.1s ease-out";
  overlay.appendChild(img);

  // Close button
  const closeBtn = document.createElement("div");
  closeBtn.textContent = "✕";
  closeBtn.style.position = "fixed";
  closeBtn.style.top = "20px";
  closeBtn.style.right = "30px";
  closeBtn.style.fontSize = "40px";
  closeBtn.style.color = "white";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.userSelect = "none";
  closeBtn.style.zIndex = 10000;
  closeBtn.style.display = "none";
  document.body.appendChild(closeBtn);

  let scale = 1;
  let translate = { x: 0, y: 0 };
  let isPanning = false;
  let last = { x: 0, y: 0 };

  function applyTransform() {
    img.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
  }

  // Open lightbox
  document.querySelectorAll("img").forEach(thumbnail => {
    thumbnail.style.cursor = "zoom-in";
    thumbnail.addEventListener("click", () => {
      img.src = thumbnail.src;
      scale = 1;
      translate = { x: 0, y: 0 };
      applyTransform();
      overlay.style.display = "flex";
      closeBtn.style.display = "block";
    });
  });

  // Wheel zoom
  overlay.addEventListener("wheel", e => {
    e.preventDefault();
    const rect = img.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const imgX = (offsetX - translate.x) / scale;
    const imgY = (offsetY - translate.y) / scale;

    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    scale = Math.min(4, Math.max(1, scale * delta));

    translate.x = offsetX - imgX * scale;
    translate.y = offsetY - imgY * scale;

    applyTransform();
  });

  // Drag to pan
  img.addEventListener("mousedown", e => {
    if (scale === 1) return;
    isPanning = true;
    last.x = e.clientX;
    last.y = e.clientY;
    overlay.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", e => {
    if (!isPanning) return;
    translate.x += e.clientX - last.x;
    translate.y += e.clientY - last.y;
    last.x = e.clientX;
    last.y = e.clientY;
    applyTransform();
  });

  window.addEventListener("mouseup", () => {
    isPanning = false;
    overlay.style.cursor = scale > 1 ? "grab" : "zoom-in";
  });

  // Close actions
  function closeLightbox() {
    overlay.style.display = "none";
    closeBtn.style.display = "none";
  }

  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });
})();
