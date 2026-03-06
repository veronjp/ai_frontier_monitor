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

  const historyInferenceCost = document.getElementById("history-inference-cost");
  const historyFrontierCapability = document.getElementById("history-frontier-capability");
  const historyDeveloperVelocity = document.getElementById("history-developer-velocity");
  const historyEnterpriseAdoption = document.getElementById("history-enterprise-adoption");

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

  function formatSignalValue(value) {
    if (value === 1) return "Increasing ↗";
    if (value === 0) return "Stable →";
    if (value === -1) return "Declining ↘";
    return "No data";
  }

  function renderHistorySummary(latestEntry) {
    if (!latestEntry || !latestEntry.signals) return;

    if (historyInferenceCost) {
      historyInferenceCost.innerHTML = `
        <strong>Inference Cost</strong><br />
        ${formatSignalValue(latestEntry.signals.inference_cost)}<br /><br />
        <span class="small">Latest record: ${latestEntry.date}</span>
      `;
    }

    if (historyFrontierCapability) {
      historyFrontierCapability.innerHTML = `
        <strong>Frontier Capability</strong><br />
        ${formatSignalValue(latestEntry.signals.frontier_capability)}<br /><br />
        <span class="small">Latest record: ${latestEntry.date}</span>
      `;
    }

    if (historyDeveloperVelocity) {
      historyDeveloperVelocity.innerHTML = `
        <strong>Developer Velocity</strong><br />
        ${formatSignalValue(latestEntry.signals.developer_velocity)}<br /><br />
        <span class="small">Latest record: ${latestEntry.date}</span>
      `;
    }

    if (historyEnterpriseAdoption) {
      historyEnterpriseAdoption.innerHTML = `
        <strong>Enterprise Adoption</strong><br />
        ${formatSignalValue(latestEntry.signals.enterprise_adoption)}<br /><br />
        <span class="small">Latest record: ${latestEntry.date}</span>
      `;
    }
  }

  try {
    const dailyResponse = await fetch("./data/daily.json");
    const dailyData = await dailyResponse.json();

    if (lastUpdated && dailyData.date) lastUpdated.textContent = dailyData.date;
    if (version && dailyData.version) version.textContent = dailyData.version;

    renderKpis(dailyData.kpis || []);
    renderTalkingPoints(dailyData.talking_points || []);
    renderTags(dailyData.regime_tags || []);
    renderList(todayChangesContainer, dailyData.today_changes || []);
    renderList(watchlistContainer, dailyData.watchlist || []);
    renderLayers(dailyData.layers || []);
  } catch (error) {
    console.error("Failed to load daily dashboard data:", error);
  }

  try {
    const historyResponse = await fetch("./data/history.json");
    const historyData = await historyResponse.json();

    if (Array.isArray(historyData) && historyData.length > 0) {
      const latestEntry = historyData[historyData.length - 1];
      renderHistorySummary(latestEntry);
    }
  } catch (error) {
    console.error("Failed to load history data:", error);
  }
});
