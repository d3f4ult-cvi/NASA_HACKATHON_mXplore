window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("hero-title");
  const text = document.getElementById("hero-text");
  const ctaBtn = document.getElementById("cta-btn");

  if (title) setTimeout(() => title.classList.add("show"), 500);
  if (text) setTimeout(() => text.classList.add("show"), 1200);
  if (ctaBtn) {
    setTimeout(() => ctaBtn.classList.add("show"), 2000);
    ctaBtn.addEventListener("click", () => {
      alert("Welcome to the Universe Exploration!");
    });
  }
});

const title = document.querySelector(".split-text");
const desc = document.querySelector(".about-desc");

if (title && desc) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        title.classList.add("animate");
        desc.classList.add("animate");
      }
    });
  }, { threshold: 0.5 });

  const aboutContainer = document.querySelector(".about-container");
  if (aboutContainer) observer.observe(aboutContainer);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

const teamSection = document.getElementById('team');
if (teamSection) {
  const titleElem = teamSection.querySelector('.team-title');
  const members = [...teamSection.querySelectorAll('.team-member')];

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      if (titleElem) {
        titleElem.style.animationDelay = '0.1s';
        titleElem.classList.add('show');
      }

      members.forEach((m, i) => {
        const delaySeconds = 0 + (i + 1) * 0.25;
        m.style.animationDelay = `${delaySeconds}s`;
        m.classList.add('show');
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  io.observe(teamSection);
}

document.querySelectorAll('.team-member').forEach(member => {
  const img = member.querySelector('img');
  if (!img) return;

  member.addEventListener('mouseenter', () => {
    img.style.transform = 'scale(1.07)';
  });

  member.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1)';
  });
});

const submitBtn = document.getElementById("submitBtn");
if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const densityKg = parseFloat(document.getElementById("densityInput").value);
    const resultDiv = document.getElementById("materialResult");
    if (!resultDiv) return;
    
    resultDiv.style.color = "#fff";

    if (isNaN(densityKg) || densityKg <= 0) {
      resultDiv.innerHTML = "⚠️ Please enter a valid density (kg/m³).";
      return;
    }

    const density = densityKg / 1000;
    resultDiv.innerHTML = "🛰️ Looking up material...";

    try {
      const resp = await fetch("https://periodic-table-api.herokuapp.com/");
      if (!resp.ok) {
        throw new Error(`API responded with status ${resp.status}`);
      }
      const elements = await resp.json();
      if (!Array.isArray(elements) || elements.length === 0) {
        throw new Error("API returned no elements or wrong format");
      }

      const valid = elements.filter(el => {
        return el.density !== undefined && el.density !== null && !isNaN(el.density);
      });

      if (valid.length === 0) {
        throw new Error("No elements with valid density in response");
      }

      let closest = valid[0];
      let minDiff = Math.abs(valid[0].density - density);

      for (let el of valid) {
        const diff = Math.abs(el.density - density);
        if (diff < minDiff) {
          minDiff = diff;
          closest = el;
        }
      }

      resultDiv.innerHTML = `
        <h2 style="color:#ff7200;">Closest Element: ${closest.name} (${closest.symbol})</h2>
        <p><strong>Atomic Number:</strong> ${closest.atomicNumber ?? closest.atomic_number}</p>
        <p><strong>Density:</strong> ${closest.density} g/cm³ (${(closest.density * 1000).toLocaleString()} kg/m³)</p>
        <p><strong>Phase:</strong> ${closest.phase ?? closest.state}</p>
        <p><strong>Boiling Point:</strong> ${closest.boil ?? closest.boiling_point} K</p>
        <p><strong>Melting Point:</strong> ${closest.melt ?? closest.melting_point} K</p>
        <p><strong>Discovered By:</strong> ${closest.discoveredBy ?? closest.discovered_by ?? "Unknown"}</p>
        <p style="color:#ccc; font-size:0.9rem;">${closest.summary ?? closest.description ?? ""}</p>
      `;
    } catch (error) {
      console.error("Material lookup failed:", error);
      resultDiv.innerHTML = `❌ Error: ${error.message}`;
    }
  });
}

document.querySelectorAll('.card').forEach(card => {
  const toggle = () => {
    const flipped = card.classList.toggle('flipped');
    card.setAttribute('aria-pressed', flipped);
  };

  card.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    toggle();
  });

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.card.flipped').forEach(c => {
      c.classList.remove('flipped');
      c.setAttribute('aria-pressed', false);
    });
  }
});

const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  const apiKey = "czUkFbEBJfm4j6EOLCs2yHkauXqKHwsr1kVo88X4";

  searchBtn.addEventListener("click", async () => {
    const minDia = parseFloat(document.getElementById("minDiameter").value) || 0;
    const maxDia = parseFloat(document.getElementById("maxDiameter").value) || Infinity;
    const hazardousOnly = document.getElementById("hazardous").checked;
    const searchText = document.getElementById("searchText").value.toLowerCase();

    const resultsContainer = document.getElementById("results");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `<p style="color:#fff;">Loading...</p>`;

    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`
      );
      const data = await response.json();

      let neos = [];
      if (data.near_earth_objects) {
        Object.values(data.near_earth_objects).forEach(day => {
          neos = neos.concat(day);
        });
      }

      let filtered = neos.filter(neo => {
        const estDia = neo.estimated_diameter.meters.estimated_diameter_max;
        const hazardous = neo.is_potentially_hazardous_asteroid;

        return (
          estDia >= minDia &&
          estDia <= maxDia &&
          (!hazardousOnly || hazardous) &&
          (searchText === "" || neo.name.toLowerCase().includes(searchText))
        );
      });

      resultsContainer.innerHTML = "";
      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<p style="color:#fff;">No results found.</p>`;
      } else {
        filtered.slice(0, 6).forEach((neo) => {
          const estDia = neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1);
          const hazardous = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
          const velocity = neo.close_approach_data[0]?.relative_velocity.kilometers_per_second;

          const card = document.createElement("div");
          card.className = "flip-card";
          card.tabIndex = 0;
          card.role = "button";
          card.setAttribute("aria-pressed", "false");
          card.innerHTML = `
            <div class="flip-card-inner">
              <div class="flip-face front">
                <div style="text-align:center;">
                  <div class="badge">Asteroid</div>
                  <div style="height:40px"></div>
                  <div class="title" style="font-size: 1.2rem;">${neo.name}</div>
                  <div class="meta" style="font-size: 1rem;">Diameter: ${estDia} m</div>
                </div>
              </div>
              <div class="flip-face back">
                <div>
                  <div style="font-weight:700; margin-bottom:6px">${neo.name}</div>
                  <div class="meta">Hazardous: ${hazardous}</div>
                  <div class="meta">Velocity: ${velocity ? parseFloat(velocity).toFixed(2) + " km/s" : "N/A"}</div>
                </div>
              </div>
            </div>
          `;
          resultsContainer.appendChild(card);
        });

        document.querySelectorAll('#results .flip-card').forEach(card => {
          const toggle = () => {
            const flipped = card.classList.toggle('flipped');
            card.setAttribute('aria-pressed', flipped);
          };
          card.addEventListener('click', toggle);
          card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          });
        });
      }
    } catch (error) {
      console.error("NASA API fetch failed:", error);
      resultsContainer.innerHTML = `<p style="color:#ff7200;">Failed to fetch NEO data. Try again later.</p>`;
    }
  });
}