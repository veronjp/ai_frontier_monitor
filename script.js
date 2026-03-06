document.addEventListener("DOMContentLoaded", () => {
  const lastUpdated = document.getElementById("last-updated");
  const todayDate = document.getElementById("today-date");

  const now = new Date();
  const formatted = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  if (lastUpdated) lastUpdated.textContent = formatted;
  if (todayDate) todayDate.textContent = formatted;
});
