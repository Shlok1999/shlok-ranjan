(function () {
  const data = loadPortfolioData();

  // ---- Hero ----
  document.getElementById("hero-role").textContent = data.hero.role;
  document.getElementById("hero-name").innerHTML =
    data.hero.name.split(" ")[0] + "<br />" + data.hero.name.split(" ").slice(1).join(" ");
  document.getElementById("hero-tagline").textContent = data.hero.tagline;
  document.getElementById("hero-location").textContent = "📍 " + data.hero.location;
  const heroEmail = document.getElementById("hero-email");
  heroEmail.textContent = "✉ " + data.hero.email;
  heroEmail.href = "mailto:" + data.hero.email;
  document.title = data.hero.name + " — " + data.hero.role;

  // ---- About ----
  document.getElementById("about-text").textContent = data.about;

  // ---- Skills ----
  const skillsGrid = document.getElementById("skills-grid");
  skillsGrid.innerHTML = data.skills.map(group => `
    <div class="skill-card">
      <h3>${escapeHtml(group.group)}</h3>
      <div class="tag-row">
        ${group.items.map(i => `<span class="tag">${escapeHtml(i)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  // ---- Experience ----
  const timeline = document.getElementById("experience-timeline");
  timeline.innerHTML = data.experience.map(job => `
    <div class="timeline-item">
      <div class="timeline-head">
        <h3>${escapeHtml(job.role)} · <span class="org">${escapeHtml(job.org)}</span></h3>
        <span class="timeline-period">${escapeHtml(job.period)} · ${escapeHtml(job.location)}</span>
      </div>
      <ul>
        ${job.points.map(p => `<li>${escapeHtml(p)}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  // ---- Projects ----
  const projectsGrid = document.getElementById("projects-grid");
  projectsGrid.innerHTML = data.projects.map(p => `
    <a class="project-card" href="${escapeAttr(p.link || '#')}" target="${p.link && p.link !== '#' ? '_blank' : '_self'}" rel="noopener">
      <h3>${escapeHtml(p.name)} <span class="arrow">→</span></h3>
      <div class="project-stack">${escapeHtml(p.stack)}</div>
      <p>${escapeHtml(p.description)}</p>
    </a>
  `).join("");

  // ---- Education ----
  const eduList = document.getElementById("education-list");
  eduList.innerHTML = data.education.map(e => `
    <div class="edu-row">
      <span class="degree">${escapeHtml(e.degree)}</span>
      <span class="school">${escapeHtml(e.school)}</span>
      <span class="period">${escapeHtml(e.period)}</span>
    </div>
  `).join("");

  // ---- Contact ----
  document.getElementById("contact-email").href = "mailto:" + data.hero.email;
  document.getElementById("contact-github").href = data.hero.github;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }
})();
