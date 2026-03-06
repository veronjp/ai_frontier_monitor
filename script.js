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

  const topThemesBox = document.getElementById("top-themes-box");
  const historyDepthBox = document.getElementById("history-depth-box");
  const latestNoteBox = document.getElementById("latest-note-box");

  const chartCanvas = document.getElementById("signal-trend-chart");

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

  function renderTrendChart(historyData) {
    if (!chartCanvas || !Array.isArray(historyData) || historyData.length === 0) return;
    if (typeof Chart === "undefined") {
      console.error("Chart.js failed to load.");
      return;
    }

    const labels = historyData.map(entry => entry.date);
    const inferenceCost = historyData.map(entry => entry.signals?.inference_cost ?? null);
    const frontierCapability = historyData.map(entry => entry.signals?.frontier_capability ?? null);
    const developerVelocity = historyData.map(entry => entry.signals?.developer_velocity ?? null);
    const enterpriseAdoption = historyData.map(entry => entry.signals?.enterprise_adoption ?? null);

    new Chart(chartCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Inference Cost",
            data: inferenceCost,
            borderColor: "#7cc4ff",
            backgroundColor: "transparent",
            tension: 0.3
          },
          {
            label: "Frontier Capability",
            data: frontierCapability,
            borderColor: "#35c759",
            backgroundColor: "transparent",
            tension: 0.3
          },
          {
            label: "Developer Velocity",
            data: developerVelocity,
            borderColor: "#ffb020",
            backgroundColor: "transparent",
            tension: 0.3
          },
          {
            label: "Enterprise Adoption",
            data: enterpriseAdoption,
            borderColor: "#ff6b6b",
            backgroundColor: "transparent",
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#edf2f7"
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#9fb0c7"
            },
            grid: {
              color: "#25324a"
            }
          },
          y: {
            min: -1,
            max: 1,
            ticks: {
              stepSize: 1,
              color: "#9fb0c7"
            },
            grid: {
              color: "#25324a"
            }
          }
        }
      }
    });
  }

function renderExecutiveAnalytics(historyData) {
  if (!Array.isArray(historyData) || historyData.length === 0) return;

  const topThemesBox = document.getElementById("top-themes-box");
  const historyDepthBox = document.getElementById("history-depth-box");
  const latestNoteBox = document.getElementById("latest-note-box");

  const latestEntry = historyData[historyData.length - 1];

  const themeCounts = {};
  historyData.forEach(entry => {
    (entry.themes || []).forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
  });

  const sortedThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topThemesBox) {
    topThemesBox.innerHTML = `
      <strong>Top Recurring Themes</strong><br /><br />
      ${sortedThemes.length > 0
        ? sortedThemes.map(([theme, count]) => `<div class="small">${theme} (${count})</div>`).join("")
        : `<div class="small">No theme data yet.</div>`}
    `;
  }

  if (historyDepthBox) {
    historyDepthBox.innerHTML = `
      <strong>History Depth</strong><br /><br />
      <div class="small">Entries logged: ${historyData.length}</div>
      <div class="small">First record: ${historyData[0].date}</div>
      <div class="small">Latest record: ${latestEntry.date}</div>
    `;
  }

  if (latestNoteBox) {
    latestNoteBox.innerHTML = `
      <strong>Latest Analytical Note</strong><br /><br />
      <div class="small">${latestEntry.notes || "No note available."}</div>
    `;
  }
}
