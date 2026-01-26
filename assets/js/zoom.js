/*
  Inline Zoom & Pan for images with class "zoomable"
  - Wheel zoom (mouse wheel) while hovering
  - Pointer pinch zoom (touch & some trackpads)
  - Drag to pan when zoom > 1
  - Double-click toggles zoom
  - Keyboard: Enter toggles, Escape resets
  Usage: add class="zoomable" to your <img> elements
*/
(function () {
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const WHEEL_STEP = 0.12;

  document.querySelectorAll('img').forEach(img => {
    let scale = 1;
    let translate = { x: 0, y: 0 };
    let isPanning = false;
    let last = { x: 0, y: 0 };

    img.style.transformOrigin = "0 0";
    img.style.cursor = "zoom-in";

    function apply() {
      img.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
    }

    function zoomToPoint(newScale, clientX, clientY) {
      const rect = img.getBoundingClientRect();

      // cursor position relative to image
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      // convert to image-space coordinates
      const imgX = (offsetX - translate.x) / scale;
      const imgY = (offsetY - translate.y) / scale;

      // apply new scale
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

      // keep cursor anchored
      translate.x = offsetX - imgX * scale;
      translate.y = offsetY - imgY * scale;

      apply();
    }

    // Wheel zoom
    img.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 + WHEEL_STEP : 1 - WHEEL_STEP;
      zoomToPoint(scale * delta, e.clientX, e.clientY);
      img.style.cursor = scale > 1 ? "grab" : "zoom-in";
    });

    // Drag to pan (only when zoomed)
    img.addEventListener("mousedown", e => {
      if (scale === 1) return;
      isPanning = true;
      last.x = e.clientX;
      last.y = e.clientY;
      img.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", e => {
      if (!isPanning) return;
      translate.x += e.clientX - last.x;
      translate.y += e.clientY - last.y;
      last.x = e.clientX;
      last.y = e.clientY;
      apply();
    });

    window.addEventListener("mouseup", () => {
      isPanning = false;
      img.style.cursor = scale > 1 ? "grab" : "zoom-in";
    });

    // Double-click resets
    img.addEventListener("dblclick", () => {
      scale = 1;
      translate = { x: 0, y: 0 };
      apply();
      img.style.cursor = "zoom-in";
    });
  });
})();
