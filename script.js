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
  const automatedSignalFeed = document.getElementById("automated-signal-feed");

  const topNarrativesBox = document.getElementById("top-narratives-box");
  const narrativeSourceBox = document.getElementById("narrative-source-box");
  const narrativeSummaryBox = document.getElementById("narrative-summary-box");

  const historyInferenceCost = document.getElementById("history-inference-cost");
  const historyFrontierCapability = document.getElementById("history-frontier-capability");
  const historyDeveloperVelocity = document.getElementById("history-developer-velocity");
  const historyEnterpriseAdoption = document.getElementById("history-enterprise-adoption");

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

  function renderAutomatedSignals(items) {
  if (!automatedSignalFeed) return;

  if (!Array.isArray(items) || items.length === 0) {
    automatedSignalFeed.innerHTML = `
      <div class="item">
        <div class="item-title">No automated signals yet</div>
        <div class="item-summary">Run the workflow or wait for the next scheduled update.</div>
      </div>
    `;
    return;
  }

  automatedSignalFeed.innerHTML = items.map(item => `
    <div class="item">
      <div class="item-title">${item.source}: ${item.title}</div>
      <div class="item-summary">
        ${item.summary}<br /><br />
        <span class="small">Category: ${item.category} | Signal: ${item.signal_type} | Score: ${item.importance_score}</span>
      </div>
    </div>
  `).join("");
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

  function renderNarrativeMonitor(items) {
  if (!Array.isArray(items)) return;

  const narrativeCounts = {};
  const sourceCounts = {};

  items.forEach(item => {
    const source = item.source || "Unknown";
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;

    (item.narratives || []).forEach(narrative => {
      narrativeCounts[narrative] = (narrativeCounts[narrative] || 0) + 1;
    });
  });

  const sortedNarratives = Object.entries(narrativeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1]);

  if (topNarrativesBox) {
    if (sortedNarratives.length === 0) {
      topNarrativesBox.innerHTML = `
        <strong>Top Narratives</strong><br /><br />
        <div class="small">No narratives detected in current signal set.</div>
    `;
  } else {
    topNarrativesBox.innerHTML = `
      <strong>Top Narratives</strong><br /><br />
      ${sortedNarratives.map(([name, count]) => `<div class="small">${name} (${count})</div>`).join("")}
    `;
  }
}

  if (narrativeSourceBox) {
    narrativeSourceBox.innerHTML = `
      <strong>Source Mix</strong><br /><br />
      ${sortedSources.map(([name, count]) => `<div class="small">${name}: ${count}</div>`).join("")}
    `;
  }

  if (narrativeSummaryBox) {
    const strongest = sortedNarratives.length > 0 ? sortedNarratives[0][0] : "none";
    narrativeSummaryBox.innerHTML = `
      <strong>Strongest Current Narrative</strong><br /><br />
      <div class="small">
        ${strongest === "none"
          ? "No clear narrative detected yet."
          : `The strongest current narrative is <strong>${strongest}</strong>, based on the latest automated signal set.`}
      </div>
    `;
  }
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
      renderTrendChart(historyData);
      renderExecutiveAnalytics(historyData);
    }
  } catch (error) {
    console.error("Failed to load history data:", error);
  }

 try {
  const eventsResponse = await fetch("./data/events.json");
  const eventsData = await eventsResponse.json();
  renderAutomatedSignals(eventsData);
  renderNarrativeMonitor(eventsData);
} catch (error) {
  console.error("Failed to load automated signal feed:", error);
}
});
