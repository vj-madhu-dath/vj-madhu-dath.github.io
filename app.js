(() => {
  "use strict";

  const field = document.querySelector(".field");
  if (!field) return;

  const apps = Array.isArray(window.APPS)
    ? window.APPS.filter((app) => app && app.slot && app.name && app.href)
    : [];

  const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

  const seed = Math.floor(Math.random() * 0xffffffff);
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const touchMode = window.matchMedia("(hover: none)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stacked = window.matchMedia("(max-width: 860px)");

  let slots = [];
  let hoveredSlot = null;
  let focusedSlot = null;
  let stickySlot = null;
  let layoutFrame = 0;

  function mulberry32(start) {
    let state = start >>> 0;
    return () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function render() {
    slots = apps.map((app) => app.slot);

    slots.forEach((slot, index) => {
      const bubble = slot.querySelector(".bubble");
      const driftRng = mulberry32(seed + index * 9973);
      slot.dataset.drift = driftRng() > 0.5 ? "b" : "a";
      slot.style.animationDuration = `${(13 + driftRng() * 5).toFixed(1)}s`;
      slot.style.animationDelay = `-${(driftRng() * 12).toFixed(1)}s`;
      bubble.style.animationDelay = `${(0.18 + index * 0.09).toFixed(2)}s`;
    });

    field.classList.add("is-enhanced");
    attach(slots);
  }

  function attach(list) {
    list.forEach((slot) => {
      const bubble = slot.querySelector(".bubble");
      const faqOrbit = slot.querySelector(".faq-orbit");
      const enterSlot = () => {
        if (!finePointer.matches) return;
        hoveredSlot = slot;
        refreshKing();
      };
      const leaveSlot = (event) => {
        if (event.relatedTarget instanceof Node && slot.contains(event.relatedTarget)) return;
        if (hoveredSlot === slot) hoveredSlot = null;
        resetGlint(bubble);
        refreshKing();
      };

      slot.addEventListener("pointerenter", enterSlot);
      slot.addEventListener("pointerleave", leaveSlot);
      faqOrbit.addEventListener("pointerenter", enterSlot);
      faqOrbit.addEventListener("pointerleave", leaveSlot);

      slot.addEventListener("focusin", () => {
        focusedSlot = slot;
        refreshKing();
      });

      slot.addEventListener("focusout", (event) => {
        if (event.relatedTarget instanceof Node && slot.contains(event.relatedTarget)) return;
        if (focusedSlot === slot) focusedSlot = null;
        refreshKing();
      });

      bubble.addEventListener("click", (event) => {
        if (!touchMode.matches || event.detail === 0) return;
        if (stickySlot === slot) return;
        event.preventDefault();
        stickySlot = slot;
        hoveredSlot = null;
        refreshKing();
      });

      attachGlint(bubble);
    });
  }

  function refreshKing() {
    const king = stickySlot || hoveredSlot || focusedSlot;
    slots.forEach((slot) => {
      const isKing = slot === king;
      if (!isKing) {
        slot.querySelectorAll(".faq-bubble[open]").forEach((faq) => {
          faq.open = false;
        });
      }
      slot.classList.toggle("is-king", isKing);
    });
  }

  function attachGlint(bubble) {
    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const paint = () => {
      frame = 0;
      bubble.style.setProperty("--glint-x", `${nextX.toFixed(1)}px`);
      bubble.style.setProperty("--glint-y", `${nextY.toFixed(1)}px`);
    };

    bubble.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || reduceMotion.matches) return;

      const rect = bubble.getBoundingClientRect();
      nextX = ((event.clientX - rect.left) / rect.width - 0.5) * 42;
      nextY = ((event.clientY - rect.top) / rect.height - 0.5) * 34;

      if (!frame) frame = requestAnimationFrame(paint);
    });

    bubble.addEventListener("pointerleave", () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      resetGlint(bubble);
    });
  }

  function resetGlint(bubble) {
    bubble.style.setProperty("--glint-x", "0px");
    bubble.style.setProperty("--glint-y", "0px");
  }

  function clearKing() {
    stickySlot = null;
    hoveredSlot = null;
    focusedSlot = null;
    if (document.activeElement instanceof HTMLElement && document.activeElement.closest(".bubble-slot")) {
      document.activeElement.blur();
    }
    refreshKing();
  }

  document.addEventListener("click", (event) => {
    if (!touchMode.matches) return;
    if (event.target.closest(".bubble-slot")) return;
    clearKing();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    stickySlot = null;
    focusedSlot = null;
    if (document.activeElement instanceof HTMLElement && document.activeElement.closest(".bubble-slot")) {
      document.activeElement.blur();
    }
    refreshKing();
  });

  function updateCount() {
    const note = document.querySelector("[data-app-count]");
    if (!note) return;
    const count = apps.length;
    const label = count < COUNT_WORDS.length ? COUNT_WORDS[count] : String(count);
    note.textContent = `${label} small app${count === 1 ? "" : "s"}. More on the way.`;
  }

  function scheduleLayout() {
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      layout();
    });
  }

  function layout() {
    if (!slots.length) return;
    const width = field.clientWidth;
    const height = field.clientHeight;
    if (!width || !height) return;

    if (stacked.matches) layoutStacked(width);
    else layoutScattered(width, height);
  }

  function layoutStacked(width) {
    const count = slots.length;
    const gap = 34;
    const viewportHeight = document.documentElement.clientHeight;
    const usableHeight = Math.max(320, viewportHeight - 280);
    let diameter = Math.min(width * 0.7, (usableHeight - gap * (count - 1)) / count, 330);
    diameter = Math.max(138, diameter);

    const rng = mulberry32(seed);
    const shiftMax = Math.max(0, Math.min(26, (width - diameter * 1.37) / 2 - 4));

    slots.forEach((slot) => {
      const shift = (rng() - 0.5) * 2 * shiftMax;
      slot.style.setProperty("--size", `${diameter.toFixed(1)}px`);
      slot.style.setProperty("--shift", `${shift.toFixed(1)}px`);
      slot.style.left = "";
      slot.style.top = "";
    });
  }

  function layoutScattered(width, height) {
    const count = slots.length;
    const rng = mulberry32(seed);
    let diameter = Math.min(430, width * 0.32, height * 0.54);
    let points = null;

    while (diameter >= 132) {
      const kingPad = diameter * 0.7 + 16;
      const x0 = Math.max(width * 0.015, kingPad);
      const y0 = Math.max(height * 0.02, kingPad);
      const x1 = width - x0;
      const y1 = height - y0;

      if (x1 - x0 > 0 && y1 - y0 > 0) {
        points = findSpreadPoints(x0, y0, x1, y1, count, diameter * 1.14 + 30, rng);
        if (points) break;
      }

      diameter *= 0.94;
    }

    if (!points) {
      const fallback = fallbackGrid(width, height, count);
      diameter = fallback.diameter;
      points = fallback.points;
    }

    slots.forEach((slot, index) => {
      const point = points[index];
      slot.style.setProperty("--size", `${diameter.toFixed(1)}px`);
      slot.style.left = `${point.x.toFixed(1)}px`;
      slot.style.top = `${point.y.toFixed(1)}px`;
      slot.style.removeProperty("--shift");
    });
  }

  function findSpreadPoints(x0, y0, x1, y1, count, minDistance, rng) {
    for (let attempt = 0; attempt < 48; attempt += 1) {
      const points = [];
      let failed = false;

      for (let index = 0; index < count; index += 1) {
        let best = null;
        let bestScore = -1;
        const samples = index === 0 ? 1 : 44;

        for (let sample = 0; sample < samples; sample += 1) {
          const candidate = {
            x: x0 + rng() * (x1 - x0),
            y: y0 + rng() * (y1 - y0),
          };
          let score = Infinity;

          for (const point of points) {
            score = Math.min(score, Math.hypot(candidate.x - point.x, candidate.y - point.y));
          }

          if (score > bestScore) {
            bestScore = score;
            best = candidate;
          }
        }

        if (points.length && bestScore < minDistance) {
          failed = true;
          break;
        }

        points.push(best);
      }

      if (!failed) return points;
    }

    return null;
  }

  function fallbackGrid(width, height, count) {
    const columns = Math.max(1, Math.ceil(Math.sqrt((count * width) / Math.max(height, 1))));
    const rows = Math.ceil(count / columns);
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    const diameter = Math.max(96, Math.min(cellWidth, cellHeight) * 0.62);
    const points = slots.map((_, index) => ({
      x: ((index % columns) + 0.5) * cellWidth,
      y: (Math.floor(index / columns) + 0.5) * cellHeight,
    }));

    return { diameter, points };
  }

  render();
  updateCount();
  requestAnimationFrame(layout);
  window.addEventListener("resize", scheduleLayout);
  window.addEventListener("load", scheduleLayout, { once: true });
})();
