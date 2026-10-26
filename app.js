
const API = "https://api.jolpi.ca/ergast/f1";

const teams = [
  "McLaren", "Ferrari", "Red Bull Racing", "Mercedes",
  "Aston Martin", "Alpine", "Haas", "Racing Bulls",
  "Williams", "Sauber", "Cadillac"
];

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ошибка API");
    return await response.json();
  } catch (error) {
    console.error("Не удалось загрузить данные:", error);
    return null;
  }
}

async function loadDrivers() {
  const container = document.querySelector("#drivers-list");
  if (!container) return;

  container.innerHTML = "<p>Загрузка пилотов...</p>";

  const data = await getData(`${API}/2026/drivers/`);
  const drivers = data?.MRData?.DriverTable?.Drivers || [];

  if (!drivers.length) {
    container.innerHTML = "<p>Не удалось загрузить пилотов. Попробуй обновить страницу.</p>";
    return;
  }

  container.innerHTML = drivers.map(driver => `
    <article class="driver-card">
      <h3>${driver.givenName} ${driver.familyName}</h3>
      <p>Номер: ${driver.permanentNumber || "—"}</p>
      <p>Национальность: ${driver.nationality || "—"}</p>
      <p>Код: ${driver.code || "—"}</p>
    </article>
  `).join("");
}

async function loadTeams() {
  const container = document.querySelector("#teams-list");
  if (!container) return;

  container.innerHTML = "<p>Загрузка команд...</p>";

  const data = await getData(`${API}/2026/constructors/`);
  const constructors = data?.MRData?.ConstructorTable?.Constructors || [];

  if (!constructors.length) {
    container.innerHTML = teams.map(team => `
      <article class="team-card"><h3>${team}</h3></article>
    `).join("");
    return;
  }

  container.innerHTML = constructors.map(team => `
    <article class="team-card">
      <h3>${team.name}</h3>
      <p>${team.nationality || ""}</p>
    </article>
  `).join("");
}

async function loadDriverStandings() {
  const container = document.querySelector("#driver-standings");
  if (!container) return;

  const data = await getData(`${API}/2026/driverStandings/`);
  const standings = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];

  if (!standings.length) {
    container.innerHTML = "<p>Таблица очков пока недоступна.</p>";
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr><th>Место</th><th>Пилот</th><th>Команда</th><th>Очки</th></tr></thead>
      <tbody>
        ${standings.map(item => `
          <tr>
            <td>${item.position}</td>
            <td>${item.Driver.givenName} ${item.Driver.familyName}</td>
            <td>${item.Constructors?.[0]?.name || "—"}</td>
            <td>${item.points}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function loadConstructorStandings() {
  const container = document.querySelector("#constructor-standings");
  if (!container) return;

  const data = await getData(`${API}/2026/constructorStandings/`);
  const standings = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

  if (!standings.length) {
    container.innerHTML = "<p>Таблица команд пока недоступна.</p>";
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr><th>Место</th><th>Команда</th><th>Очки</th></tr></thead>
      <tbody>
        ${standings.map(item => `
          <tr>
            <td>${item.position}</td>
            <td>${item.Constructor.name}</td>
            <td>${item.points}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  loadDrivers();
  loadTeams();
  loadDriverStandings();
  loadConstructorStandings();
});
