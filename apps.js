// The crawlable app cards and FAQ copy live in index.html. Read their core
// fields here so app.js can add layout and interaction without rebuilding them.
window.APPS = Array.from(document.querySelectorAll("[data-app-card]"))
  .map((slot) => {
    const bubble = slot.querySelector(".bubble");
    const name = slot.querySelector(".bubble__name");
    if (!bubble || !name) return null;
    return {
      slot,
      name: name.textContent.trim(),
      href: bubble.href,
    };
  })
  .filter(Boolean);
