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
  img.style.objectFit = "contain";
  img.style.width = "auto";
  img.style.height = "auto";
  img.style.maxWidth = "95vw";
  img.style.maxHeight = "95vh";
  img.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
  img.style.borderRadius = "4px";
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

  // Left arrow
  const leftArrow = document.createElement("div");
  leftArrow.textContent = "❮";
  leftArrow.style.position = "fixed";
  leftArrow.style.left = "30px";
  leftArrow.style.top = "50%";
  leftArrow.style.transform = "translateY(-50%)";
  leftArrow.style.fontSize = "60px";
  leftArrow.style.color = "white";
  leftArrow.style.cursor = "pointer";
  leftArrow.style.userSelect = "none";
  leftArrow.style.zIndex = 10000;
  leftArrow.style.display = "none";
  document.body.appendChild(leftArrow);

  // Right arrow
  const rightArrow = document.createElement("div");
  rightArrow.textContent = "❯";
  rightArrow.style.position = "fixed";
  rightArrow.style.right = "30px";
  rightArrow.style.top = "50%";
  rightArrow.style.transform = "translateY(-50%)";
  rightArrow.style.fontSize = "60px";
  rightArrow.style.color = "white";
  rightArrow.style.cursor = "pointer";
  rightArrow.style.userSelect = "none";
  rightArrow.style.zIndex = 10000;
  rightArrow.style.display = "none";
  document.body.appendChild(rightArrow);

  // Collect all images
  const images = Array.from(document.querySelectorAll("img"));
  let index = 0;

  function showImage(i) {
    index = (i + images.length) % images.length;
    img.src = images[index].src;
  }

  // Open lightbox
  images.forEach((thumbnail, i) => {
    thumbnail.style.cursor = "zoom-in";
    thumbnail.addEventListener("click", () => {
      showImage(i);
      overlay.style.display = "flex";
      closeBtn.style.display = "block";
      leftArrow.style.display = "block";
      rightArrow.style.display = "block";
    });
  });

  // Navigation
  leftArrow.addEventListener("click", () => showImage(index - 1));
  rightArrow.addEventListener("click", () => showImage(index + 1));

  // Keyboard navigation
  window.addEventListener("keydown", e => {
    if (overlay.style.display === "none") return;
    if (e.key === "ArrowLeft") showImage(index - 1);
    if (e.key === "ArrowRight") showImage(index + 1);
    if (e.key === "Escape") closeLightbox();
  });

  // Close actions
  function closeLightbox() {
    overlay.style.display = "none";
    closeBtn.style.display = "none";
    leftArrow.style.display = "none";
    rightArrow.style.display = "none";
  }

  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);
})();
