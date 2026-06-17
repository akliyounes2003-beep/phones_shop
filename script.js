// =========================================================
//  InfinityPhone — script.js
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     1. HEADER — shrinks on scroll
  ------------------------------------------------------- */
  const header = document.getElementById("main-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------
     2. NAV — highlight current page link
  ------------------------------------------------------- */
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#main-nav a").forEach(link => {
    const href = link.getAttribute("href").split("?")[0];
    if (href === currentPage) link.classList.add("active");
  });

  /* -------------------------------------------------------
     3. PRE-FILL modèle from URL param (reservation.html)
  ------------------------------------------------------- */
  const urlParams = new URLSearchParams(window.location.search);
  const modeleParam = urlParams.get("modele");
  const modeleInput = document.getElementById("modele");
  if (modeleParam && modeleInput) {
    modeleInput.value = decodeURIComponent(modeleParam);
  }

  /* -------------------------------------------------------
     4. CONNEXION — login form
  ------------------------------------------------------- */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email    = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (email === "younesakli@gmail.com" && password === "1234") {
        localStorage.setItem("utilisateurConnecte", email);
        showToast("✅ Connexion réussie ! Redirection…", "success");
        setTimeout(() => { window.location.href = "index.html"; }, 1500);
      } else {
        showToast("❌ Identifiants incorrects. Réessayez.", "error");
        loginForm.querySelector("input[type='password']").value = "";
      }
    });
  }

  /* -------------------------------------------------------
     5. UTILISATEUR CONNECTÉ — greeting + logout
  ------------------------------------------------------- */
  const utilisateur = localStorage.getItem("utilisateurConnecte");
  if (utilisateur) {
    // Greeting in header
    const nav = document.getElementById("main-nav");
    if (nav) {
      // Remove existing login link (replace with greeting)
      const loginLink = nav.querySelector('a[href="login.html"]');
      if (loginLink) loginLink.remove();

      // Greeting span
      const greeting = document.createElement("span");
      greeting.className = "user-greeting";
      greeting.textContent = `👤 ${utilisateur.split("@")[0]}`;
      nav.appendChild(greeting);

      // Logout button
      const logout = document.createElement("a");
      logout.href = "#";
      logout.textContent = "Déconnexion";
      logout.style.cssText = "color:rgba(255,200,160,0.9)!important; border-left:1px solid rgba(255,255,255,0.2); padding-left:0.75em; margin-left:0.25em;";
      logout.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("utilisateurConnecte");
        showToast("Déconnecté. À bientôt !", "success");
        setTimeout(() => window.location.reload(), 1000);
      });
      nav.appendChild(logout);
    }
  }

  /* -------------------------------------------------------
     6. RÉSERVATION FORM — submit handler
  ------------------------------------------------------- */
  const reservationForm = document.getElementById("reservation-form");
  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const modele = document.getElementById("modele")?.value;
      const nom    = document.getElementById("nom")?.value;
      showToast(`✅ Réservation confirmée pour ${nom} — ${modele} !`, "success");
      setTimeout(() => {
        reservationForm.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2500);
    });
  }

  /* -------------------------------------------------------
     7. CONTACT FORM — submit handler
  ------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("✅ Message envoyé ! Nous vous répondrons bientôt.", "success");
      setTimeout(() => contactForm.reset(), 1800);
    });
  }

  /* -------------------------------------------------------
     8. FILTER TABS — telephones.html
  ------------------------------------------------------- */
  const filterBar = document.getElementById("filter-bar");
  if (filterBar) {
    const tabs     = filterBar.querySelectorAll(".filter-tab");
    const sections = document.querySelectorAll("section[data-category]");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        // Toggle active state
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const filter = tab.dataset.filter;

        sections.forEach(section => {
          const show = filter === "all" || section.dataset.category === filter;
          section.style.display = show ? "block" : "none";

          // Re-trigger entrance animation on visible cards
          if (show) {
            section.querySelectorAll(".phone-item").forEach((card, i) => {
              card.style.animation = "none";
              card.style.opacity   = "0";
              // Force reflow
              void card.offsetWidth;
              card.style.animation = "";
              card.style.animationDelay = `${i * 0.05}s`;
            });
          }
        });
      });
    });
  }

  /* -------------------------------------------------------
     9. PHONE CARDS — staggered entrance animation
  ------------------------------------------------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = "1";
        entry.target.style.animation  = "fadeInUp 0.45s cubic-bezier(0.4,0,0.2,1) forwards";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".phone-item").forEach((card, i) => {
    card.style.opacity        = "0";
    card.style.animationDelay = card.style.animationDelay || `${i * 0.04}s`;
    observer.observe(card);
  });

  /* -------------------------------------------------------
     10. TOAST NOTIFICATION
  ------------------------------------------------------- */
  function showToast(message, type = "success") {
    // Remove existing toast
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("show"));
    });

    // Auto-remove
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

});
