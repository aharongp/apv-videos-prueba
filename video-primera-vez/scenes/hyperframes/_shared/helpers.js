/* Utilidades compartidas por las 11 escenas (se copian a cada proyecto con scripts/sync-scenes.mjs).
 * Todo es determinista: sin relojes, sin azar, sin red. */
(function () {
  const APV = window.APV;

  /** Datos de una escena: textos de copy.json, duración y tiempos de palabras de timing.json. */
  APV.scene = function (id) {
    const copy = APV.copy.scenes.find((s) => s.id === id);
    const t = APV.timing.scenes.find((s) => s.id === id);
    const words = t.words || [];
    return {
      copy,
      pantalla: copy.pantalla,
      dur: t.durationFrames / APV.fps, // duración de la escena (sin colchón)
      voStart: t.voStartFrames / APV.fps,
      words,
      /** Segundo (relativo a la escena) en que la locución dice `word` (n-ésima aparición). Sin timing, usa `fallback`. */
      at(word, fallback = 0, nth = 0) {
        const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9$]/g, "");
        const hits = words.filter((w) => norm(w.w) === norm(word));
        return hits[nth] ? hits[nth].t : fallback;
      },
    };
  };

  /** Envuelve cada palabra de `el` en <span class="w"><span class="wi">…</span></span> para entradas por palabra. */
  APV.splitWords = function (el) {
    const text = el.textContent.trim();
    el.textContent = "";
    text.split(/\s+/).forEach((word, i, all) => {
      const outer = document.createElement("span");
      outer.className = "w";
      const inner = document.createElement("span");
      inner.className = "wi";
      inner.textContent = word;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < all.length - 1) el.appendChild(document.createTextNode(" "));
    });
    return el.querySelectorAll(".wi");
  };

  /** Prepara trazos SVG para dibujarse (stroke-dasharray = longitud). Devuelve los nodos. */
  APV.prepStroke = function (selector, root = document) {
    const nodes = Array.from(root.querySelectorAll(selector));
    nodes.forEach((p) => {
      const len = Math.ceil(p.getTotalLength ? p.getTotalLength() : 1000) + 2;
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      p.dataset.len = String(len);
    });
    return nodes;
  };

  /** Tween que dibuja trazos preparados con prepStroke. */
  APV.draw = function (tl, nodes, at, duration = 0.8, stagger = 0.06) {
    tl.to(nodes, { strokeDashoffset: 0, duration, ease: "power2.inOut", stagger }, at);
  };

  /** Contador determinista: escribe el valor entero en `el` mientras avanza. */
  APV.counter = function (tl, el, from, to, at, duration, format = (v) => String(v)) {
    const state = { v: from };
    el.textContent = format(from);
    tl.to(state, { v: to, duration, ease: "power1.out", onUpdate: () => (el.textContent = format(Math.round(state.v))) }, at);
  };

  /** Silueta lineal de auto (vista lateral), SVG de trazo. kind: sedan | suv | pickup. */
  APV.carSVG = function ({ kind = "sedan", width = 520, stroke = APV.brand.colors.ink, accent = APV.brand.colors.accent, cls = "" } = {}) {
    const bodies = {
      sedan: "M20 118 L20 96 Q20 84 34 82 L92 76 L140 44 Q150 38 164 38 L286 38 Q302 38 314 48 L352 78 L400 84 Q420 88 422 104 L422 118",
      suv: "M20 118 L20 80 Q20 70 32 68 L70 64 L104 30 Q110 24 122 24 L316 24 Q330 24 338 34 L372 68 L404 72 Q420 76 422 92 L422 118",
      pickup: "M20 118 L20 88 Q20 78 32 76 L118 72 L146 38 Q152 32 164 32 L240 32 Q252 32 256 42 L262 72 L408 72 Q422 72 422 86 L422 118",
    };
    const windows = {
      sedan: "M150 50 L286 50 Q298 50 306 58 L330 78 L118 78 Z",
      suv: "M118 36 L316 36 Q326 36 332 44 L356 68 L92 68 Z",
      pickup: "M160 44 L238 44 Q246 44 248 52 L250 72 L136 72 Z",
    };
    const h = (width * 150) / 440;
    return `<svg class="car ${cls}" width="${width}" height="${h}" viewBox="0 0 440 150" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path class="stroke car-body" d="${bodies[kind]}" stroke="${stroke}" stroke-width="6"/>
      <path class="stroke car-base" d="M20 118 L70 118 M150 118 L292 118 M372 118 L422 118" stroke="${stroke}" stroke-width="6"/>
      <path class="stroke car-window" d="${windows[kind]}" stroke="${stroke}" stroke-width="4"/>
      <circle class="stroke car-wheel" cx="110" cy="118" r="30" stroke="${stroke}" stroke-width="6"/>
      <circle class="stroke car-wheel" cx="332" cy="118" r="30" stroke="${stroke}" stroke-width="6"/>
      <circle class="car-hub" cx="110" cy="118" r="8" fill="${accent}"/>
      <circle class="car-hub" cx="332" cy="118" r="8" fill="${accent}"/>
    </svg>`;
  };

  /** Iconos de trazo (24×24). */
  APV.icon = function (name, { size = 96, stroke = APV.brand.colors.ink, width = 1.8, cls = "" } = {}) {
    const paths = {
      lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
      unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
      shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
      check: '<path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
      gavel: '<path d="M14.5 3.5l6 6M12 6l6 6M13.2 4.8l-5 5 6 6 5-5M9.5 11.5L3 18l3 3 6.5-6.5M4 21h9"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
      phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10 18.5h4"/>',
      doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
      building: '<path d="M4 21V8l8-5 8 5v13M9 21v-6h6v6M3 21h18"/>',
      bank: '<path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 21h18"/>',
      truck: '<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
      tap: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/>',
    };
    return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
  };
})();
