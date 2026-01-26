(function () {
  // Create overlay
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
  document.body.appendChild(overlay);

  // Create image element
  const img = document.createElement("img");
  img.style.maxWidth = "90vw";
  img.style.maxHeight = "90vh";
  img.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
  img.style.borderRadius = "4px";
  overlay.appendChild(img);

  // Create close button
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

  // Open lightbox on image click
  document.querySelectorAll("img").forEach(thumbnail => {
    thumbnail.style.cursor = "zoom-in";
    thumbnail.addEventListener("click", () => {
      img.src = thumbnail.src;
      overlay.style.display = "flex";
      closeBtn.style.display = "block";
    });
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

