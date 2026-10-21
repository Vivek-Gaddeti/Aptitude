/* fx-header.js: the top bar (calm): soft day ↔ night switch when effects are on, and the 🔥 streak roll-up. */
(function () {
  const FX = window.FX;
  if (!FX) return;
  const { root, ls, motionOK, finePointer, typing, page, content, sparkle, toneOf, confetti, bigConfetti } = FX;
  const themeBtn = document.getElementById("themeBtn");
  /* The effects switch now lives in Settings (assets/common.js); the glide pill, peek cards, logo breathing, snow and header shrink were removed for the calm theme. */

  /* ------------------------------------------------------------------ soft day ↔ night switch
     The page softly fades into the other theme (the old look blurs a touch while the new one fades in on top).
     The cute part is on the button: going dark, the sun becomes a moon and little stars twinkle out;
     going light, the rays pop back one by one with a warm glow. Also applies to the T shortcut. */
  if (themeBtn && themeBtn.onclick) {
    const flip = themeBtn.onclick;
    themeBtn.onclick = (e) => {
      if (!motionOK()) return flip.call(themeBtn, e);
      const toDark = root.dataset.theme !== "dark";
      if (document.startViewTransition) {
        root.classList.add("d-soft");
        const vt = document.startViewTransition(() => flip.call(themeBtn, e));
        vt.ready.catch(() => {}); vt.updateCallbackDone.catch(() => {});
        vt.finished.catch(() => {}).then(() => root.classList.remove("d-soft"));
      } else {
        root.classList.add("d-theme-fade"); flip.call(themeBtn, e);
        setTimeout(() => root.classList.remove("d-theme-fade"), 700);
      }
      if (toDark) setTimeout(() => sparkle(themeBtn, ["#ffe08a", "#c7b4f5", "#ffffff"], 3), 250);
      else setTimeout(() => themeBtn.animate([{ boxShadow: "0 0 0 0 rgba(255,190,80,.55)" }, { boxShadow: "0 0 0 12px rgba(255,190,80,0)" }], { duration: 1000, easing: "ease-out" }), 300);
    };
  }

  const nav = document.querySelector(".topbar .nav");
  // solving something: the 🔥 number rolls up if the streak grew, and a tiny ✦ twinkles on Revision / My Progress
  document.addEventListener("item:status", (e) => {
    const { was, status } = e.detail;
    if (!status || was) return;
    const revLink = nav && [...nav.querySelectorAll("a")].find((a) => a.getAttribute("href") === "revision.html");
    if (revLink) setTimeout(() => sparkle(revLink, ["#f7a8c8", "#c7b4f5"], 2), 900);
    const n = Store.streak();
    let el = document.querySelector(".topbar .d-streak");
    if (!el && n > 0) {
      el = document.createElement("span"); el.className = "d-streak pop-in"; el.innerHTML = `<span class="f">${icon("flame")}</span><span class="sn">${n}</span>`;
      el.title = `${n}-day study streak`; (document.querySelector(".fx-slot") || themeBtn).before(el); return;
    }
    const sn = el && el.querySelector(".sn");
    if (!sn || +sn.textContent >= n) return;
    el.title = `${n}-day study streak`;
    if (!motionOK()) { sn.textContent = n; return; }
    sn.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(-70%)", opacity: 0 }], { duration: 260, easing: "ease-in" }).onfinish = () => {
      sn.textContent = n;
      sn.animate([{ transform: "translateY(70%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
    };
    el.classList.remove("flick"); void el.offsetWidth; el.classList.add("flick");
  });
})();
