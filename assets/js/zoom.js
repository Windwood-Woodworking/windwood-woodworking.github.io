<script>
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
  const WHEEL_STEP = 0.12;         // wheel sensitivity
  const PINCH_SENSITIVITY = 0.005; // pinch sensitivity multiplier

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Helper to get element offset relative to page
  function getRect(el) {
    return el.getBoundingClientRect();
  }

  // Initialize each zoomable image
  document.querySelectorAll('img').forEach(img => {
    // state
    let scale = 1;
    let translate = { x: 0, y: 0 };
    let isPanning = false;
    let lastPan = { x: 0, y: 0 };
    let pointers = new Map(); // pointerId -> {x,y}
    let initialPinchDistance = null;
    let initialScale = 1;

    // ensure transform origin and smoothness
    img.style.transformOrigin = 'center center';
    img.style.transition = 'transform 160ms cubic-bezier(.2,.8,.2,1)';
    img.style.willChange = 'transform';
    img.style.touchAction = 'none'; // allow pointer events for pinch/pan

    // make focusable for keyboard
    if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0');

    // apply transform
    function applyTransform() {
      img.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
      img.classList.toggle('zoomed', scale > 1.01);
      img.style.cursor = scale > 1.01 ? 'grab' : 'zoom-in';
    }

    // reset zoom and pan
    function reset() {
      scale = 1;
      translate = { x: 0, y: 0 };
      applyTransform();
    }

    // toggle zoom (double-click behavior)
    function toggleZoom(centerX, centerY) {
      if (scale <= 1.01) {
        // zoom in to 2x centered at pointer if provided
        const target = 2;
        if (typeof centerX === 'number') {
          zoomToPoint(target, centerX, centerY);
        } else {
          scale = target;
        }
      } else {
        reset();
      }
      applyTransform();
    }

    // Zoom while keeping the point under the cursor stable
    function zoomToPoint(newScale, clientX, clientY) {
      const rect = getRect(img);
      // coordinates of pointer relative to image top-left
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      // current image size
      const curW = rect.width * scale;
      const curH = rect.height * scale;

      // compute image-space coordinates of the pointer
      const imgSpaceX = (offsetX - translate.x) / scale;
      const imgSpaceY = (offsetY - translate.y) / scale;

      // new translate so that imgSpaceX/Y remain under the pointer
      const newTranslateX = offsetX - imgSpaceX * newScale;
      const newTranslateY = offsetY - imgSpaceY * newScale;

      scale = clamp(newScale, MIN_SCALE, MAX_SCALE);
      translate.x = newTranslateX;
      translate.y = newTranslateY;
      constrainTranslate();
      applyTransform();
    }

    // Constrain translate so image doesn't drift too far (soft constraint)
    function constrainTranslate() {
      const rect = getRect(img);
      const w = rect.width * scale;
      const h = rect.height * scale;
      const vw = rect.width;
      const vh = rect.height;

      // If image is smaller than container, center it
      if (w <= vw) {
        translate.x = (vw - w) / 2;
      } else {
        // limit panning so edges don't go too far beyond viewport
        const maxX = (w - vw) / 2 + 100; // allow small overscroll
        translate.x = clamp(translate.x, -maxX, maxX);
      }

      if (h <= vh) {
        translate.y = (vh - h) / 2;
      } else {
        const maxY = (h - vh) / 2 + 100;
        translate.y = clamp(translate.y, -maxY, maxY);
      }
    }

    // Wheel zoom handler
    img.addEventListener('wheel', (e) => {
      // only when hovering the image
      e.preventDefault();
      const delta = e.deltaY > 0 ? -WHEEL_STEP : WHEEL_STEP;
      const newScale = clamp(scale + delta, MIN_SCALE, MAX_SCALE);
      zoomToPoint(newScale, e.clientX, e.clientY);
    }, { passive: false });

    // Double-click toggles zoom
    img.addEventListener('dblclick', (e) => {
      toggleZoom(e.clientX, e.clientY);
    });

    // Pointer events for pinch and pan
    img.addEventListener('pointerdown', (e) => {
      img.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // start panning if single pointer and zoomed
      if (pointers.size === 1 && scale > 1.01) {
        isPanning = true;
        lastPan = { x: e.clientX, y: e.clientY };
        img.style.transition = 'none';
        img.style.cursor = 'grabbing';
      }

      // start pinch if two pointers
      if (pointers.size === 2) {
        const pts = Array.from(pointers.values());
        initialPinchDistance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        initialScale = scale;
      }
    });

    img.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // pinch handling
      if (pointers.size === 2 && initialPinchDistance) {
        const pts = Array.from(pointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const delta = (dist - initialPinchDistance) * PINCH_SENSITIVITY;
        const newScale = clamp(initialScale + delta, MIN_SCALE, MAX_SCALE);
        // center zoom at midpoint of two pointers
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        zoomToPoint(newScale, midX, midY);
        return;
      }

      // panning
      if (isPanning && pointers.size === 1) {
        const dx = e.clientX - lastPan.x;
        const dy = e.clientY - lastPan.y;
        lastPan = { x: e.clientX, y: e.clientY };
        translate.x += dx;
        translate.y += dy;
        applyTransform();
      }
    });

    img.addEventListener('pointerup', (e) => {
      pointers.delete(e.pointerId);
      img.releasePointerCapture?.(e.pointerId);

      // end panning
      if (isPanning && pointers.size === 0) {
        isPanning = false;
        img.style.transition = 'transform 160ms cubic-bezier(.2,.8,.2,1)';
        img.style.cursor = scale > 1.01 ? 'grab' : 'zoom-in';
        constrainTranslate();
        applyTransform();
      }

      // reset pinch state if less than 2 pointers
      if (pointers.size < 2) {
        initialPinchDistance = null;
        initialScale = scale;
      }
    });

    img.addEventListener('pointercancel', (e) => {
      pointers.delete(e.pointerId);
      initialPinchDistance = null;
      isPanning = false;
      img.releasePointerCapture?.(e.pointerId);
      img.style.transition = 'transform 160ms cubic-bezier(.2,.8,.2,1)';
      constrainTranslate();
      applyTransform();
    });

    // Prevent native drag
    img.addEventListener('dragstart', (e) => e.preventDefault());

    // Keyboard support
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        toggleZoom();
      } else if (e.key === 'Escape') {
        reset();
      } else if (e.key === '+' || (e.key === '=' && e.ctrlKey)) {
        // zoom in
        const newScale = clamp(scale + 0.2, MIN_SCALE, MAX_SCALE);
        scale = newScale;
        applyTransform();
      } else if (e.key === '-' || (e.key === '_' && e.ctrlKey)) {
        // zoom out
        const newScale = clamp(scale - 0.2, MIN_SCALE, MAX_SCALE);
        scale = newScale;
        if (scale <= 1.01) reset();
        applyTransform();
      }
    });

    // When the image or page is hidden, reset transition and state
    window.addEventListener('pagehide', () => {
      img.style.transform = '';
      img.style.transition = '';
    });

    // initial apply
    applyTransform();
  });
})();
</script>
