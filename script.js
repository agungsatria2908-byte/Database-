// POLIWANGI CYBER PORTAL 2026 â€” client-side demo
// Add only student records you are authorized to use.
const departments = [
  {
    name: "Bisnis dan Informatika",
    programs: [
      "Teknologi Rekayasa Perangkat Lunak",
      "Teknologi Rekayasa Komputer",
      "Bisnis Digital",
    ],
  },
  {
    name: "Teknik Sipil",
    programs: [
      "Teknik Sipil",
      "Teknologi Rekayasa Konstruksi Jalan dan Jembatan",
      "Teknologi Rekayasa Konstruksi Bangunan Gedung",
    ],
  },
  {
    name: "Teknik Mesin",
    programs: [
      "Teknologi Rekayasa Manufaktur",
      "Teknik Manufaktur Kapal",
      "Teknologi Rekayasa Otomotif",
    ],
  },
  {
    name: "Pariwisata",
    programs: [
      "Manajemen Bisnis Pariwisata",
      "Destinasi Pariwisata",
      "Pengelolaan Perhotelan",
    ],
  },
  {
    name: "Pertanian",
    programs: [
      "Agribisnis",
      "Teknologi Pengolahan Hasil Ternak",
      "Pengembangan Produk Agroindustri",
      "Teknologi Budi Daya Perikanan",
      "Teknologi Produksi Tanaman Pangan",
      "Teknologi Produksi Ternak",
    ],
  },
];
// Dataset demo kosong. Format data yang diizinkan:
// {nim:"...",name:"...",department:"...",program:"...",year:"2026"}
const students = [];
// Masukkan tanggal kalender hanya setelah diverifikasi dari dokumen resmi.
const academicEvents = [];

const $ = (id) => document.getElementById(id);
function log(message) {
  const box = $("activityLog");
  if (!box) return;
  const p = document.createElement("p");
  p.textContent = `[${new Date().toLocaleTimeString("id-ID")}] ${message}`;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}
function tick() {
  const now = new Date();
  $("clock").textContent = now.toLocaleTimeString("id-ID", { hour12: false });
  $("dateText").textContent = now
    .toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}
tick();
setInterval(tick, 1000);

// Matrix-like background animation
(function matrixEffect() {
  const canvas = $("matrix"),
    ctx = canvas.getContext("2d");
  let cols, drops;
  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    cols = Math.floor(canvas.width / 17);
    drops = Array(cols).fill(1);
  }
  resize();
  addEventListener("resize", resize);
  setInterval(() => {
    ctx.fillStyle = "rgba(5,11,8,.09)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4cff91";
    ctx.font = "13px monospace";
    drops.forEach((y, i) => {
      ctx.fillText(Math.random() > 0.5 ? "1" : "0", i * 17, y * 17);
      if (y * 17 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 75);
})();

// Navigation
function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.toggle("active", p.id === id));
  document
    .querySelectorAll(".nav")
    .forEach((b) => b.classList.toggle("active", b.dataset.page === id));
  document.body.classList.remove("sidebar-open");
  log("Opened module: " + id.toUpperCase());
}
document
  .querySelectorAll(".nav")
  .forEach((b) => b.addEventListener("click", () => showPage(b.dataset.page)));
document
  .querySelectorAll("[data-goto]")
  .forEach((b) => b.addEventListener("click", () => showPage(b.dataset.goto)));
$("menuToggle").addEventListener("click", () =>
  document.body.classList.toggle("sidebar-open")
);

// Campus directory
$("programCount").textContent = departments.reduce(
  (n, d) => n + d.programs.length,
  0
);
function renderDepartments(filter = "") {
  const root = $("departmentCards");
  root.innerHTML = "";
  departments.forEach((d) => {
    const programs = d.programs.filter((p) =>
      (d.name + " " + p).toLowerCase().includes(filter.toLowerCase())
    );
    if (!programs.length) return;
    const card = document.createElement("div");
    card.className = "dept";
    const h = document.createElement("h3");
    h.textContent = d.name;
    card.appendChild(h);
    const ul = document.createElement("ul");
    programs.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      ul.appendChild(li);
    });
    card.appendChild(ul);
    root.appendChild(card);
  });
}
renderDepartments();
$("programSearch").addEventListener("input", (e) =>
  renderDepartments(e.target.value)
);

// Student filters and search
departments.forEach((d) => {
  const o = document.createElement("option");
  o.value = d.name;
  o.textContent = d.name;
  $("studentDept").appendChild(o);
});
function fillStudentPrograms() {
  const dep = $("studentDept").value,
    sel = $("studentProgram");
  sel.innerHTML = '<option value="">Semua prodi</option>';
  departments
    .filter((d) => !dep || d.name === dep)
    .forEach((d) =>
      d.programs.forEach((p) => {
        const o = document.createElement("option");
        o.value = p;
        o.textContent = p;
        sel.appendChild(o);
      })
    );
}
$("studentDept").addEventListener("change", fillStudentPrograms);
fillStudentPrograms();
let history = [];
function searchStudents() {
  const q = $("studentSearch").value.trim().toLowerCase(),
    dep = $("studentDept").value,
    prog = $("studentProgram").value,
    year = $("studentYear").value;
  const results = students.filter(
    (s) =>
      (!q ||
        s.nim.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)) &&
      (!dep || s.department === dep) &&
      (!prog || s.program === prog) &&
      (!year || String(s.year) === year)
  );
  const root = $("studentResults");
  root.innerHTML = "";
  $("studentMeta").textContent = results.length + " RECORDS FOUND";
  if (!q && !dep && !prog && !year) {
    root.innerHTML =
      '<div class="empty">Masukkan kata pencarian atau pilih filter.</div>';
    return;
  }
  if (!results.length) {
    root.innerHTML =
      '<div class="empty">TIDAK ADA HASIL. Dataset lokal mungkin kosong; portal tidak terhubung ke database akademik Poliwangi.</div>';
  }
  results.forEach((s) => {
    const card = document.createElement("div");
    card.className = "studentcard";
    const strong = document.createElement("strong");
    strong.textContent = s.name;
    card.appendChild(strong);
    [
      `NIM: ${s.nim}`,
      `Jurusan: ${s.department}`,
      `Program studi: ${s.program}`,
      `Angkatan: ${s.year}`,
    ].forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      card.appendChild(span);
    });
    root.appendChild(card);
  });
  if (q) {
    history.unshift(q);
    history = history.slice(0, 8);
    $("searchHistory").innerHTML = "";
    history.forEach((v) => {
      const row = document.createElement("div");
      row.innerHTML = "<span>â†³</span>";
      row.appendChild(document.createTextNode(v));
      $("searchHistory").appendChild(row);
    });
  }
  log(`Student search completed: ${results.length} result(s)`);
}
$("searchStudent").addEventListener("click", searchStudents);
$("studentSearch").addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchStudents();
});
$("resetStudent").addEventListener("click", () => {
  $("studentSearch").value = "";
  $("studentDept").value = "";
  fillStudentPrograms();
  $("studentProgram").value = "";
  $("studentYear").value = "";
  $("studentMeta").textContent = "0 RECORDS FOUND";
  $("studentResults").innerHTML =
    '<div class="empty">Masukkan kata pencarian atau pilih filter.</div>';
});

// Weather via Open-Meteo forecast API
const places = {
  Banyuwangi: { lat: -8.2192, lon: 114.3691 },
  Denpasar: { lat: -8.65, lon: 115.2167 },
  Jakarta: { lat: -6.2088, lon: 106.8456 },
  Surabaya: { lat: -7.2575, lon: 112.7521 },
};
const weatherCodes = {
  0: "Cerah",
  1: "Cerah berawan",
  2: "Berawan sebagian",
  3: "Berawan",
  45: "Kabut",
  48: "Kabut tebal",
  51: "Gerimis ringan",
  53: "Gerimis",
  55: "Gerimis lebat",
  61: "Hujan ringan",
  63: "Hujan sedang",
  65: "Hujan lebat",
  71: "Salju ringan",
  80: "Hujan lokal",
  81: "Hujan lokal sedang",
  82: "Hujan lokal lebat",
  95: "Badai petir",
  96: "Badai petir + hujan es",
  99: "Badai petir kuat",
};
const weatherEmoji = (code) =>
  code === 0
    ? "â˜€"
    : code <= 3
    ? "â˜"
    : code <= 48
    ? "ðŸŒ«"
    : code <= 67 || code >= 80
    ? "ðŸŒ§"
    : "ðŸŒ¦";
async function loadWeather() {
  const loc = $("weatherLocation").value,
    place = places[loc],
    btn = $("loadWeather");
  btn.disabled = true;
  btn.textContent = "LOADING...";
  $("weatherCurrent").innerHTML =
    '<div class="empty">Mengambil prakiraan cuaca...</div>';
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&forecast_days=1&timezone=Asia%2FJakarta`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API response " + res.status);
    const data = await res.json(),
      c = data.current,
      code = c.weather_code,
      desc = weatherCodes[code] || "Kondisi berubah";
    $(
      "weatherCurrent"
    ).innerHTML = `<div class="weatherhero"><div><p class="eyebrow">${loc.toUpperCase()} Â· CURRENT CONDITIONS</p><div class="temp">${Math.round( c.temperature_2m )}Â°C</div><div class="condition">${weatherEmoji( code )} ${desc}</div><p class="muted">Terasa seperti ${Math.round( c.apparent_temperature )}Â°C Â· Diperbarui ${c.time.replace( "T", " " )}</p></div><div class="emoji">${weatherEmoji( code )}</div></div><div class="weatherdetails"><div>HUMIDITY<b>${ c.relative_humidity_2m }%</b></div><div>WIND SPEED<b>${ c.wind_speed_10m } km/j</b></div><div>PRECIPITATION<b>${c.precipitation} mm</b></div></div>`;
    const hourly = $("hourlyForecast");
    hourly.innerHTML = "";
    const currentHour = Number(c.time.slice(11, 13));
    data.hourly.time.forEach((t, i) => {
      const hour = Number(t.slice(11, 13));
      if (hour < currentHour || hour > currentHour + 8) return;
      const el = document.createElement("div");
      el.className = "hour";
      el.innerHTML = `${t.slice(11, 16)}<b>${Math.round( data.hourly.temperature_2m[i] )}Â°</b>${weatherEmoji(data.hourly.weather_code[i])}<br>${ data.hourly.precipitation_probability[i] }% hujan`;
      hourly.appendChild(el);
    });
    $("weatherStatus").textContent = "CONNECTED";
    $("weatherStatus").className = "green";
    $("weatherNote").textContent =
      "Sumber: Open-Meteo Forecast API. Ini prakiraan otomatis, bukan peringatan resmi BMKG.";
    log("Weather forecast updated for " + loc);
  } catch (err) {
    $("weatherCurrent").innerHTML =
      '<div class="empty">Gagal mengambil cuaca. Periksa koneksi internet lalu coba lagi.</div>';
    log("Weather API unavailable");
  } finally {
    btn.disabled = false;
    btn.textContent = "UPDATE FORECAST â†»";
  }
}
$("loadWeather").addEventListener("click", loadWeather);
$("weatherLocation").addEventListener("change", loadWeather);

// Cyber terminal
function runTerminal() {
  const input = $("terminalInput"),
    cmd = input.value.trim().toLowerCase();
  input.value = "";
  if (!cmd) return;
  const commands = {
    help: "Available: help, about, whoami, date, scan-demo, tools, clear",
    about:
      "POLIWANGI CYBER PORTAL 2026 â€” browser-based information and learning demo.",
    whoami: "visitor / public information mode",
    date: new Date().toString(),
    tools:
      "Password generator | SHA-256 | Base64 | URL inspector | Text analyzer | QR generator",
    "scan-demo":
      "[SIMULATION ONLY]\\n[OK] Demo web service\\n[OK] Demo database module\\n[INFO] No real host or network was scanned.",
  };
  if (cmd === "clear") {
    $("terminalOutput").textContent = "Terminal cleared.";
    return;
  }
  $("terminalOutput").textContent +=
    "\\nvisitor@portal:~$ " +
    cmd +
    "\\n" +
    (commands[cmd] || "Unknown command. Type help.");
  $("terminalOutput").scrollTop = $("terminalOutput").scrollHeight;
  log("Terminal command: " + cmd);
}
$("runTerminal").addEventListener("click", runTerminal);
$("terminalInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") runTerminal();
});

// Secure random password generator
$("generatePassword").addEventListener("click", () => {
  const len = Math.max(8, Math.min(64, Number($("passLength").value) || 18));
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  if ($("passSymbols").checked) chars += "!@#$%^&*()-_=+[]{}?";
  const random = new Uint32Array(len);
  crypto.getRandomValues(random);
  $("passwordOutput").textContent = Array.from(
    random,
    (n) => chars[n % chars.length]
  ).join("");
  log("Generated local password");
});
$("copyPassword").addEventListener("click", () =>
  copyText($("passwordOutput").textContent)
);

// Password strength
$("strengthInput").addEventListener("input", () => {
  const p = $("strengthInput").value;
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const labels = ["Sangat lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"];
  $("strengthMeter").style.width = score * 20 + "%";
  $("strengthMeter").style.background =
    score < 2 ? "#ff7777" : score < 4 ? "#ffc66d" : "#4cff91";
  $("strengthText").textContent = p
    ? labels[Math.max(0, score - 1)] + " Â· " + score + "/5"
    : "Belum diperiksa.";
});

// SHA-256
async function sha256(text) {
  const bytes = new TextEncoder().encode(text),
    hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
$("makeHash").addEventListener("click", async () => {
  try {
    $("hashOutput").textContent = await sha256($("hashInput").value);
    log("SHA-256 hash generated");
  } catch (e) {
    $("hashOutput").textContent =
      "Web Crypto tidak tersedia. Jalankan melalui localhost atau HTTPS.";
  }
});
$("copyHash").addEventListener("click", () =>
  copyText($("hashOutput").textContent)
);

// Base64 UTF-8
$("baseEncode").addEventListener("click", () => {
  try {
    $("baseOutput").textContent = btoa(
      Array.from(new TextEncoder().encode($("baseInput").value), (b) =>
        String.fromCharCode(b)
      ).join("")
    );
  } catch (e) {
    $("baseOutput").textContent = "Gagal encode teks.";
  }
});
$("baseDecode").addEventListener("click", () => {
  try {
    const raw = atob($("baseInput").value.trim());
    const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    $("baseOutput").textContent = new TextDecoder().decode(bytes);
  } catch (e) {
    $("baseOutput").textContent = "Input Base64 tidak valid.";
  }
});

// URL inspector â€” heuristic only, not a malware scanner
$("inspectUrl").addEventListener("click", () => {
  const raw = $("urlInput").value.trim();
  let result;
  try {
    const u = new URL(raw);
    const flags = [];
    if (u.protocol !== "https:") flags.push("Tidak menggunakan HTTPS");
    if (u.username || u.password) flags.push("URL mengandung user-info");
    if (u.hostname.startsWith("xn--") || u.hostname.includes(".xn--"))
      flags.push("Domain memakai punycode");
    if (u.hostname.split(".").length > 4) flags.push("Subdomain cukup panjang");
    if (/@|%40/.test(raw)) flags.push("Ada karakter @ pada URL");
    result = `HOST: ${u.hostname}\\nPROTOCOL: ${u.protocol}\\nPORT: ${ u.port || "default" }\\nPATH: ${u.pathname}\\n${ flags.length ? "POTENTIAL FLAGS:\\n- " + flags.join("\\n- ") : "Tidak ditemukan pola sederhana yang ditandai." }\\n\\nIni pemeriksaan heuristik, bukan jaminan situs aman.`;
  } catch (e) {
    result = "Format URL tidak valid. Sertakan https:// atau http://";
  }
  $("urlOutput").textContent = result;
  log("URL inspected");
});

// Text analyzer
$("analyzeText").addEventListener("click", () => {
  const t = $("textInput").value,
    words = t.trim() ? t.trim().split(/\s+/).length : 0;
  $("textOutput").textContent = `Characters: ${ t.length }\\nWords: ${words}\\nLines: ${ t ? t.split(/\\r?\\n/).length : 0 }\\nLetters: ${(t.match(/\p{L}/gu) || []).length}\\nDigits: ${ (t.match(/[0-9]/g) || []).length }\\nSpaces: ${(t.match(/\\s/g) || []).length}`;
});

// QR via external QR server; content is sent to that provider
$("makeQr").addEventListener("click", () => {
  const value = $("qrInput").value.trim(),
    root = $("qrOutput");
  root.innerHTML = "";
  if (!value) {
    root.textContent = "Masukkan teks atau URL terlebih dahulu.";
    return;
  }
  const img = document.createElement("img");
  img.alt = "Generated QR code";
  img.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" +
    encodeURIComponent(value);
  root.appendChild(img);
  log("QR generated via external service");
});

// Network utilities
$("getIp").addEventListener("click", async () => {
  $("ipOutput").textContent = "Requesting...";
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    if (!r.ok) throw Error();
    const d = await r.json();
    $("ipOutput").textContent = "Public IP: " + d.ip + "\\nProvider: ipify.org";
    log("Public IP lookup completed");
  } catch (e) {
    $("ipOutput").textContent =
      "Tidak dapat mengambil IP. Periksa koneksi atau pemblokiran jaringan.";
  }
});
$("dnsLookup").addEventListener("click", async () => {
  const domain = $("dnsDomain")
    .value.trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0];
  if (!domain) {
    $("dnsOutput").textContent = "Masukkan domain terlebih dahulu.";
    return;
  }
  $("dnsOutput").textContent = "Looking up DNS...";
  try {
    const r = await fetch(
      "https://dns.google/resolve?name=" +
        encodeURIComponent(domain) +
        "&type=A"
    );
    const d = await r.json();
    const answers = d.Answer || [];
    $("dnsOutput").textContent = answers.length
      ? answers.map((a) => `${a.name} TYPE ${a.type} ${a.data}`).join("\\n")
      : `No A record returned. Status: ${d.Status}`;
    log("DNS lookup: " + domain);
  } catch (e) {
    $("dnsOutput").textContent = "DNS lookup gagal. Coba lagi.";
  }
});
$("siteCheck").addEventListener("click", async () => {
  let url = $("siteUrl").value.trim();
  if (!url) {
    $("siteOutput").textContent = "Masukkan URL.";
    return;
  }
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  $("siteOutput").textContent = "Mencoba request HEAD...";
  try {
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 7000);
    await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
    });
    clearTimeout(timer);
    $("siteOutput").textContent =
      "Request dikirim. Browser tidak dapat membaca status HTTP pada mode no-cors; ini bukan konfirmasi website aktif.";
  } catch (e) {
    $("siteOutput").textContent =
      "Request gagal atau diblokir CORS/jaringan. Tidak dapat memastikan status website.";
  }
});
$("portDemo").addEventListener("click", () => {
  const target = $("scanTarget").value.trim() || "localhost";
  $(
    "portOutput"
  ).textContent = `SIMULATED TARGET: ${target}\\n[DEMO] Port 80 : illustrative HTTP service\\n[DEMO] Port 443 : illustrative HTTPS service\\n[DEMO] Port 22 : illustrative SSH service\\n[INFO] All results are fictional. No network packets sent.`;
  log("Demo port scan simulated");
});

// Academic calendar: intentionally empty until official source data is supplied
if (!academicEvents.length) {
  $("calendarList").innerHTML =
    '<div class="empty">Belum ada tanggal kalender akademik yang diverifikasi untuk dimasukkan. Buka tautan resmi Poliwangi untuk dokumen terbaru.</div>';
} else {
  academicEvents.forEach((ev) => {
    const row = document.createElement("div");
    row.className = "timelineitem";
    const time = document.createEle
