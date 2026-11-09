// Always scroll to top on refresh / reload
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};



document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("hero-title");
  const text = document.getElementById("hero-text");
  const ctaBtn = document.getElementById("cta-btn");

  // Smooth intro animation for text elements
  setTimeout(() => title.classList.add("show"), 500);
  setTimeout(() => text.classList.add("show"), 1200);
  setTimeout(() => ctaBtn.classList.add("show"), 2000);

  // Button click event
  ctaBtn.addEventListener("click", () => {
    alert("Welcome to the Universe Exploration!");
  });
});





const title = document.querySelector(".split-text");
const desc = document.querySelector(".about-desc");

// Intersection Observer to trigger animation when section is visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      title.classList.add("animate");
      desc.classList.add("animate");
    }
  });
}, { threshold: 0.5 });

// Observe the About section
observer.observe(document.querySelector(".about-container"));




//for smooth transition

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});





const teamSection = document.getElementById('team');
if (teamSection) {
  const title = teamSection.querySelector('.team-title');
  const members = [...teamSection.querySelectorAll('.team-member')];

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // 1) Show title after 3s
      // set animationDelay via JS so it's reliable across browsers
      if (title) {
        title.style.animationDelay = '0.1s';   // <-- exactly 3 seconds
        title.classList.add('show');
      }

      // 2) Stagger team members AFTER the title (so they start after 3s).
      // We'll assign each a delay: 3s + (index+1)*0.25s
      members.forEach((m, i) => {
        const delaySeconds = 0 + (i + 1) * 0.25; // 3.25s, 3.5s, 3.75s...
        m.style.animationDelay = `${delaySeconds}s`;
        m.classList.add('show');
      });

      // Unobserve so animation runs only once
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  io.observe(teamSection);
}


document.querySelectorAll('.team-member').forEach(member => {
  const img = member.querySelector('img');

  member.addEventListener('mouseenter', () => {
    img.style.transform = 'scale(1.07)';
  });

  member.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1)';
  });
});







document.getElementById("submitBtn").addEventListener("click", async () => {
  const densityKg = parseFloat(document.getElementById("densityInput").value);
  const resultDiv = document.getElementById("materialResult");
  resultDiv.style.color = "#fff";

  if (isNaN(densityKg) || densityKg <= 0) {
    resultDiv.innerHTML = "⚠️ Please enter a valid density (kg/m³).";
    return;
  }

  // Convert to g/cm³
  const density = densityKg / 1000;

  resultDiv.innerHTML = "🛰️ Looking up material...";

  try {
    const resp = await fetch("https://periodic-table-api.herokuapp.com/"); // or your API URL
    if (!resp.ok) {
      throw new Error(`API responded with status ${resp.status}`);
    }
    const elements = await resp.json();
    if (!Array.isArray(elements) || elements.length === 0) {
      throw new Error("API returned no elements or wrong format");
    }

    // Filter valid densities
    const valid = elements.filter(el => {
      return el.density !== undefined && el.density !== null && !isNaN(el.density);
    });

    if (valid.length === 0) {
      throw new Error("No elements with valid density in response");
    }

    // Find closest
    let closest = valid[0];
    let minDiff = Math.abs(valid[0].density - density);

    for (let el of valid) {
      const diff = Math.abs(el.density - density);
      if (diff < minDiff) {
        minDiff = diff;
        closest = el;
      }
    }

    // Show result
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








const diameterInput = document.querySelector('input[type="number"]'); 
const velocityInput = document.getElementById('velocity');
const densityInput = document.querySelectorAll('input[type="number"]')[1]; 

const box1 = document.getElementById('box1');
const box2 = document.getElementById('box2');
const box3 = document.getElementById('box3');


function updateBoxes() {
  let diameter = parseFloat(diameterInput.value) || 0;
  let density = parseFloat(densityInput.value) || 0;
  let velocity = parseFloat(velocityInput.value) || 0;

  if (box1) box1.style.width = (50 + diameter) + "px";  
  if (box2) box2.style.width = (50 + density / 10) + "px";  
  if (box3) box3.style.width = (50 + velocity) + "px";  
}


if (diameterInput) diameterInput.addEventListener('input', updateBoxes);
if (densityInput) densityInput.addEventListener('input', updateBoxes);
if (velocityInput) velocityInput.addEventListener('input', updateBoxes);





// Flip card logic
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

// Close all on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.card.flipped').forEach(c => {
      c.classList.remove('flipped');
      c.setAttribute('aria-pressed', false);
    });
  }
});






const apiKey = "czUkFbEBJfm4j6EOLCs2yHkauXqKHwsr1kVo88X4"; // Replace with your NASA API key if you have one

document.getElementById("searchBtn").addEventListener("click", async () => {
  const minDia = parseFloat(document.getElementById("minDiameter").value) || 0;
  const maxDia = parseFloat(document.getElementById("maxDiameter").value) || Infinity;
  const hazardousOnly = document.getElementById("hazardous").checked;
  const searchText = document.getElementById("searchText").value.toLowerCase();

  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = `<p style="color:#fff;">Loading...</p>`;

  try {
    // NASA NEO feed (today’s range)
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`
    );
    const data = await response.json();

    let neos = [];
    Object.values(data.near_earth_objects).forEach(day => {
      neos = neos.concat(day);
    });

    // Filter
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

    // Render
    resultsContainer.innerHTML = "";
    if (filtered.length === 0) {
      resultsContainer.innerHTML = `<p style="color:#fff;">No results found.</p>`;
    } else {
      filtered.slice(0, 6).forEach((neo, i) => {
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

      // Re-enable flip behavior on dynamically generated cards
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