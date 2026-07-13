// ------------------------------------------------------------------
// Auth
//
// The username/password are never stored as plaintext here — only
// their SHA-256 hashes are checked against. That keeps a casual
// "view source" from handing someone the password directly, but it
// is still client-side, so anyone who really wants in can eventually
// get past it. Treat this as a lightweight gate for a personal site,
// not real security for anything sensitive.
// ------------------------------------------------------------------
const USERNAME_HASH = "7a8d4dc09f7af44dee06a9c081a0b262d1f9efb74a332d4f872de73cfd50243f";
const PASSWORD_HASH = "ce87fe301076e77e1f88a8a0af38dc36728a6642a3d08210b3727097c6789a0a";

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

function isAuthed() {
  return sessionStorage.getItem("admin_authed") === "1";
}

function showDashboard() {
  loginScreen.style.display = "none";
  dashboard.style.display = "block";
  initDashboard();
}

if (isAuthed()) {
  showDashboard();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;
  const [uh, ph] = await Promise.all([sha256(u), sha256(p)]);

  if (uh === USERNAME_HASH && ph === PASSWORD_HASH) {
    sessionStorage.setItem("admin_authed", "1");
    loginError.textContent = "";
    showDashboard();
  } else {
    loginError.textContent = "Incorrect username or password.";
  }
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
  sessionStorage.removeItem("admin_authed");
  location.reload();
});

// ------------------------------------------------------------------
// Dashboard
// ------------------------------------------------------------------
let state = null;
let dashboardInitialized = false;

function initDashboard() {
  if (dashboardInitialized) return;
  dashboardInitialized = true;

  state = loadPortfolioData();

  bindSimpleFields();
  renderSkills();
  renderExperience();
  renderProjects();
  renderEducation();

  document.getElementById("add-skill-group").addEventListener("click", () => {
    state.skills.push({ group: "New group", items: [] });
    renderSkills();
    save();
  });
  document.getElementById("add-experience").addEventListener("click", () => {
    state.experience.unshift({ role: "New role", org: "Company", location: "Remote", period: "2026 — Present", points: [] });
    renderExperience();
    save();
  });
  document.getElementById("add-project").addEventListener("click", () => {
    state.projects.unshift({ name: "New project", stack: "", description: "", link: "#" });
    renderProjects();
    save();
  });
  document.getElementById("add-education").addEventListener("click", () => {
    state.education.push({ degree: "Degree", school: "School", period: "Year — Year" });
    renderEducation();
    save();
  });
  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Reset all content back to the built-in defaults? This can't be undone.")) {
      localStorage.removeItem("portfolio_data");
      state = loadPortfolioData();
      bindSimpleFields();
      renderSkills();
      renderExperience();
      renderProjects();
      renderEducation();
      flashSaved("Reset ✓");
    }
  });
}

function save() {
  localStorage.setItem("portfolio_data", JSON.stringify(state));
  flashSaved();
}

let flashTimer;
function flashSaved(text) {
  const el = document.getElementById("save-status");
  el.textContent = text || "Saved ✓";
  el.classList.add("show");
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => el.classList.remove("show"), 1400);
}

function bindSimpleFields() {
  const map = {
    "f-name": ["hero", "name"],
    "f-role": ["hero", "role"],
    "f-location": ["hero", "location"],
    "f-tagline": ["hero", "tagline"],
    "f-email": ["hero", "email"],
    "f-github": ["hero", "github"],
    "f-about": ["about", null],
  };
  Object.entries(map).forEach(([id, [key, sub]]) => {
    const el = document.getElementById(id);
    el.value = sub ? state[key][sub] : state[key];
    el.oninput = () => {
      if (sub) state[key][sub] = el.value;
      else state[key] = el.value;
      save();
    };
  });
}

// ---------- Skills ----------
function renderSkills() {
  const list = document.getElementById("skills-list");
  document.getElementById("skills-count").textContent = state.skills.length;
  list.innerHTML = "";
  state.skills.forEach((group, i) => {
    const div = document.createElement("div");
    div.className = "repeat-item";
    div.innerHTML = `
      <button class="btn btn-danger btn-small remove-btn" data-i="${i}">Remove</button>
      <div class="field"><label>Group name</label><input class="s-group" data-i="${i}" value="${attr(group.group)}" /></div>
      <div class="field"><label>Items (comma-separated)</label><textarea class="s-items" data-i="${i}" rows="2">${text(group.items.join(", "))}</textarea></div>
    `;
    list.appendChild(div);
  });
  list.querySelectorAll(".remove-btn").forEach(b => b.onclick = () => {
    state.skills.splice(+b.dataset.i, 1); renderSkills(); save();
  });
  list.querySelectorAll(".s-group").forEach(inp => inp.oninput = () => {
    state.skills[+inp.dataset.i].group = inp.value; save();
  });
  list.querySelectorAll(".s-items").forEach(ta => ta.oninput = () => {
    state.skills[+ta.dataset.i].items = ta.value.split(",").map(s => s.trim()).filter(Boolean); save();
  });
}

// ---------- Experience ----------
function renderExperience() {
  const list = document.getElementById("experience-list");
  document.getElementById("experience-count").textContent = state.experience.length;
  list.innerHTML = "";
  state.experience.forEach((job, i) => {
    const div = document.createElement("div");
    div.className = "repeat-item";
    div.innerHTML = `
      <button class="btn btn-danger btn-small remove-btn" data-i="${i}">Remove</button>
      <div class="row2">
        <div class="field"><label>Role</label><input class="e-role" data-i="${i}" value="${attr(job.role)}" /></div>
        <div class="field"><label>Company</label><input class="e-org" data-i="${i}" value="${attr(job.org)}" /></div>
      </div>
      <div class="row2">
        <div class="field"><label>Location</label><input class="e-location" data-i="${i}" value="${attr(job.location)}" /></div>
        <div class="field"><label>Period</label><input class="e-period" data-i="${i}" value="${attr(job.period)}" /></div>
      </div>
      <div class="field"><label>Bullet points (one per line)</label><textarea class="e-points" data-i="${i}" rows="3">${text(job.points.join("\n"))}</textarea></div>
    `;
    list.appendChild(div);
  });
  list.querySelectorAll(".remove-btn").forEach(b => b.onclick = () => {
    state.experience.splice(+b.dataset.i, 1); renderExperience(); save();
  });
  const bindField = (cls, key) => list.querySelectorAll(cls).forEach(inp => inp.oninput = () => {
    state.experience[+inp.dataset.i][key] = inp.value; save();
  });
  bindField(".e-role", "role");
  bindField(".e-org", "org");
  bindField(".e-location", "location");
  bindField(".e-period", "period");
  list.querySelectorAll(".e-points").forEach(ta => ta.oninput = () => {
    state.experience[+ta.dataset.i].points = ta.value.split("\n").map(s => s.trim()).filter(Boolean); save();
  });
}

// ---------- Projects ----------
function renderProjects() {
  const list = document.getElementById("projects-list");
  document.getElementById("projects-count").textContent = state.projects.length;
  list.innerHTML = "";
  state.projects.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "repeat-item";
    div.innerHTML = `
      <button class="btn btn-danger btn-small remove-btn" data-i="${i}">Remove</button>
      <div class="row2">
        <div class="field"><label>Name</label><input class="p-name" data-i="${i}" value="${attr(p.name)}" /></div>
        <div class="field"><label>Link URL</label><input class="p-link" data-i="${i}" value="${attr(p.link)}" /></div>
      </div>
      <div class="field"><label>Stack (short label)</label><input class="p-stack" data-i="${i}" value="${attr(p.stack)}" /></div>
      <div class="field"><label>Description</label><textarea class="p-desc" data-i="${i}" rows="2">${text(p.description)}</textarea></div>
    `;
    list.appendChild(div);
  });
  list.querySelectorAll(".remove-btn").forEach(b => b.onclick = () => {
    state.projects.splice(+b.dataset.i, 1); renderProjects(); save();
  });
  const bindField = (cls, key) => list.querySelectorAll(cls).forEach(inp => inp.oninput = () => {
    state.projects[+inp.dataset.i][key] = inp.value; save();
  });
  bindField(".p-name", "name");
  bindField(".p-link", "link");
  bindField(".p-stack", "stack");
  bindField(".p-desc", "description");
}

// ---------- Education ----------
function renderEducation() {
  const list = document.getElementById("education-list");
  document.getElementById("education-count").textContent = state.education.length;
  list.innerHTML = "";
  state.education.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "repeat-item";
    div.innerHTML = `
      <button class="btn btn-danger btn-small remove-btn" data-i="${i}">Remove</button>
      <div class="row2">
        <div class="field"><label>Degree</label><input class="ed-degree" data-i="${i}" value="${attr(e.degree)}" /></div>
        <div class="field"><label>School</label><input class="ed-school" data-i="${i}" value="${attr(e.school)}" /></div>
      </div>
      <div class="field"><label>Period</label><input class="ed-period" data-i="${i}" value="${attr(e.period)}" /></div>
    `;
    list.appendChild(div);
  });
  list.querySelectorAll(".remove-btn").forEach(b => b.onclick = () => {
    state.education.splice(+b.dataset.i, 1); renderEducation(); save();
  });
  const bindField = (cls, key) => list.querySelectorAll(cls).forEach(inp => inp.oninput = () => {
    state.education[+inp.dataset.i][key] = inp.value; save();
  });
  bindField(".ed-degree", "degree");
  bindField(".ed-school", "school");
  bindField(".ed-period", "period");
}

function text(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function attr(str) {
  return text(str).replace(/"/g, "&quot;");
}
