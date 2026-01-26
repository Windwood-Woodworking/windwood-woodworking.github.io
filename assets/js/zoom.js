/* Make images zoomable */
.zoomable {
  display: block;
  width: 100%;
  height: auto;
  transform-origin: center center;
  transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms;
  will-change: transform;
  cursor: zoom-in;
  touch-action: none; /* allow pointer events for pinch; adjust if you need native panning */
}

/* subtle hover preview */
.zoomable:hover {
  transform: scale(1.06);
  cursor: zoom-in;
}

/* when zoomed, change cursor and add subtle shadow */
.zoomable.zoomed {
  cursor: zoom-out;
  box-shadow: 0 12px 30px rgba(0,0,0,0.45);
}

/* prevent image selection while interacting */
.zoomable, .zoomable * {
  user-select: none;
  -webkit-user-drag: none;
}
