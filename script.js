// Shared header/footer injection + interactions
(function () {
  const nav = (active) => `
    <div class="emergency">🚑 24/7 Emergency — Call <a href="tel:+911800123456">+91 1800-123-456</a></div>
    <div class="topbar"><div class="container">
      <span>📍 Ghazipur Tiraha, Mau (Uttar Pradesh) </span>
      <span>Mon–Sun • 24 Hours <span class="em">• Emergency Always Open</span></span>
    </div></div>
    <header class="nav"><div class="container nav-inner">
      <a href="index.html" class="brand">
        <span class="brand-mark">R</span>
        <span>Rahul Hospital<small>Care · Cure · Comfort</small></span>
      </a>
      <nav class="menu" id="menu">
        <a href="index.html" data-nav="home">Home</a>
        <a href="about.html" data-nav="about">About</a>
        <a href="services.html" data-nav="services">Services</a>
        <a href="doctors.html" data-nav="doctors">Doctors</a>
        <a href="appointment.html" data-nav="appointment">Appointment</a>
        <a href="contact.html" data-nav="contact">Contact</a>
        <a href="login.html" class="btn btn-ghost" style="padding:9px 28px" data-nav="login">Login</a>
      </nav>
      <button class="burger" id="burger" aria-label="Menu">☰</button>
    </div></header>`;

  const foot = `
    <footer><div class="container">
      <div class="foot-grid">
        <div>
          <div class="brand">
            <span class="brand-mark">R</span>
            <span>Rahul Hospital<small>Care · Cure · Comfort</small></span>
          </div>
          <p>A NABH-accredited multi-specialty hospital committed to advanced, compassionate healthcare for every patient we serve.</p>
        </div>
        <div class="foot">
          <h5>Explore</h5>
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="services.html">Services</a>
          <a href="doctors.html">Our Doctors</a>
        </div>
        <div class="foot">
          <h5>Patients</h5>
          <a href="appointment.html">Book Appointment</a>
          <a href="login.html">Patient Login</a>
          <a href="register.html">Register</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="foot">
          <h5>Reach Us</h5>
          <a href="tel:+911800123456">📞 +91 1800-123-456</a>
          <a href="mailto:care@rahulhospital.com">✉️ care@rahulhospital.com</a>
          <a>📍 Sector 21, New Delhi</a>
        </div>
      </div>
      <div class="copy">© ${new Date().getFullYear()} Rahul Hospital. All rights reserved. Built with care.</div>
    </div></footer>`;

  document.addEventListener("DOMContentLoaded", () => {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.innerHTML = nav();
    if (f) f.innerHTML = foot;

    // Active nav
    const page = document.body.dataset.page;
    if (page) {
      const link = document.querySelector(`[data-nav="${page}"]`);
      if (link && !link.classList.contains("btn")) link.classList.add("active");
    }

    // Burger
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");
    if (burger && menu) burger.addEventListener("click", () => menu.classList.toggle("open"));

    // Reveal on scroll
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Forms
    document.querySelectorAll("form[data-form]").forEach((form) => {
      const kind = form.dataset.form;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const ok = form.querySelector(".alert.ok");
        const err = form.querySelector(".alert.err");
        [ok, err].forEach(a => a && (a.style.display = "none"));

        const data = Object.fromEntries(new FormData(form).entries());

        if (kind === "register" && data.password !== data.confirm) {
          if (err) { err.textContent = "Passwords do not match."; err.style.display = "block"; }
          return;
        }
        if (kind === "login") {
          const users = JSON.parse(localStorage.getItem("rh_users") || "[]");
          const u = users.find(x => x.email === data.email && x.password === data.password);
          if (!u) { if (err) { err.textContent = "Invalid email or password."; err.style.display = "block"; } return; }
          localStorage.setItem("rh_current", JSON.stringify({ name: u.name, email: u.email }));
          if (ok) { ok.textContent = `Welcome back, ${u.name}! Redirecting…`; ok.style.display = "block"; }
          setTimeout(() => (location.href = "index.html"), 900);
          return;
        }
        if (kind === "register") {
          const users = JSON.parse(localStorage.getItem("rh_users") || "[]");
          if (users.some(x => x.email === data.email)) {
            if (err) { err.textContent = "An account with this email already exists."; err.style.display = "block"; }
            return;
          }
          users.push({ name: data.name, email: data.email, password: data.password });
          localStorage.setItem("rh_users", JSON.stringify(users));
          if (ok) { ok.textContent = "Account created! Redirecting to login…"; ok.style.display = "block"; }
          form.reset();
          setTimeout(() => (location.href = "login.html"), 1000);
          return;
        }
        if (kind === "appointment") {
          const apps = JSON.parse(localStorage.getItem("rh_appointments") || "[]");
          apps.push({ ...data, ts: Date.now() });
          localStorage.setItem("rh_appointments", JSON.stringify(apps));
          if (ok) { ok.textContent = `Thanks, ${data.name}! Your appointment for ${data.date} is booked. We'll confirm via ${data.email}.`; ok.style.display = "block"; }
          form.reset();
          return;
        }
        if (kind === "contact") {
          if (ok) { ok.textContent = "Message received. Our team will reach out within 24 hours."; ok.style.display = "block"; }
          form.reset();
          return;
        }
      });
    });
  });
})();