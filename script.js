document.addEventListener("DOMContentLoaded", async () => {
  const todayDate = document.getElementById("today-date");
  const lastUpdated = document.getElementById("last-updated");
  const version = document.getElementById("version");

  const kpiContainer = document.getElementById("kpi-container");
  const talkingPointsContainer = document.getElementById("talking-points-container");
  const regimeTagsContainer = document.getElementById("regime-tags-container");
  const todayChangesContainer = document.getElementById("today-changes-container");
  const watchlistContainer = document.getElementById("watchlist-container");
  const layersContainer = document.getElementById("layers-container");

  const now = new Date();
  const formattedToday = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  if (todayDate) todayDate.textContent = formattedToday;
  if (lastUpdated) lastUpdated.textContent = formattedToday;

  function renderKpis(items) {
    if (!kpiContainer) return;
    kpiContainer.innerHTML = items.map(item => `
      <div class="kpi">
        <div class="kpi-label">${item.label}</div>
        <div class="kpi-value">${item.value}</div>
        <div class="kpi-note">${item.note}</div>
      </div>
    `).join("");
  }

  function renderTalkingPoints(items) {
    if (!talkingPointsContainer) return;
    talkingPointsContainer.innerHTML = items.map(item => `
      <div class="item">
        <div class="item-title">${item.title}</div>
        <div class="item-summary">${item.summary}</div>
      </div>
    `).join("");
  }

  function renderTags(items) {
    if (!regimeTagsContainer) return;
    regimeTagsContainer.innerHTML = items.map(item => `
      <span class="tag ${item.level || ""}">${item.text}</span>
    `).join("");
  }

  function renderList(container, items) {
    if (!container) return;
    container.innerHTML = items.map(item => `
      <div class="item">
        <div class="item-title">${item.title}</div>
        <div class="item-summary">${item.summary}</div>
      </div>
    `).join("");
  }

  function renderLayers(items) {
    if (!layersContainer) return;
    layersContainer.innerHTML = items.map(item => `
      <div class="item">
        <div class="item-title">${item.title}</div>
        <div class="item-summary">${item.summary}</div>
      </div>
    `).join("");
  }

  try {
    const response = await fetch("./data/daily.json");
    const data = await response.json();

    if (lastUpdated && data.date) lastUpdated.textContent = data.date;
    if (version && data.version) version.textContent = data.version;

    renderKpis(data.kpis || []);
    renderTalkingPoints(data.talking_points || []);
    renderTags(data.regime_tags || []);
    renderList(todayChangesContainer, data.today_changes || []);
    renderList(watchlistContainer, data.watchlist || []);
    renderLayers(data.layers || []);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
});
