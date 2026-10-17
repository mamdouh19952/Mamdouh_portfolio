document.addEventListener("DOMContentLoaded", () => {
  const navBar = document.getElementById("main-nav");
  const navCollapse = document.getElementById("navbarSupportedContent");
  const upHome = document.getElementById("upHome");
  const navLinks = document.querySelectorAll("#main-nav .nav-link");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // navbar background + back-to-top button on scroll
  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    navBar.classList.toggle("scrolled", scrolled);
    upHome.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // mobile menu: solid background while open, close after choosing a link
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
  navCollapse.addEventListener("show.bs.collapse", () => navBar.classList.add("menu-open"));
  navCollapse.addEventListener("hidden.bs.collapse", () => navBar.classList.remove("menu-open"));
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navCollapse.classList.contains("show")) bsCollapse.hide();
    });
  });

  // highlight the nav link of the section in view
  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(section => sectionObserver.observe(section));

  // skill bars
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".skill").forEach(skill => {
    const bar = skill.querySelector(".progress-bar");
    const label = skill.querySelector(".skill-value");
    const target = Number(bar.dataset.target) || 0;
    const countObj = { value: 0 };

    const tl = gsap.timeline({
      scrollTrigger: { trigger: skill, start: "top 90%", once: true }
    });

    tl.to(bar, { width: target + "%", duration: 1.2, ease: "power2.out" }, 0);
    tl.to(countObj, {
      value: target,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => { label.textContent = Math.round(countObj.value) + "%"; }
    }, 0);
  });

  // stats counters
  const counters = document.querySelectorAll(".count");
  const animateCounter = counter => {
    const target = Number(counter.dataset.target);
    const countObj = { value: 0 };
    gsap.to(countObj, {
      value: target,
      duration: 2,
      ease: "power1.out",
      onUpdate: () => { counter.textContent = Math.round(countObj.value); }
    });
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      counters.forEach(animateCounter);
      observer.disconnect();
    }
  }, { threshold: 0.4 });
  statsObserver.observe(document.getElementById("Clients"));

  // reveal on scroll
  if (!prefersReducedMotion) {
    gsap.utils.toArray(".reveal").forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out"
      });
    });
  }

  // project filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.toggle("active", b === btn));

      projects.forEach(project => {
        const match = filter === "all" || project.dataset.category.split(" ").includes(filter);
        project.classList.toggle("hide", !match);
        project.classList.remove("fade-in");
        if (match) {
          void project.offsetWidth; // restart the animation
          project.classList.add("fade-in");
        }
      });
      ScrollTrigger.refresh();
    });
  });

  // contact form -> opens the visitor's mail app with the message filled in
  const form = document.getElementById("contactForm");
  const message = document.getElementById("cMessage");
  const charCount = document.getElementById("charCount");
  const formMsg = document.getElementById("formMsg");
  const maxChars = Number(message.getAttribute("maxlength"));

  message.addEventListener("input", () => {
    const remaining = maxChars - message.value.length;
    charCount.textContent = `${remaining} characters remaining`;
    charCount.classList.toggle("limit", remaining <= 0);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const fields = [...form.querySelectorAll(".form-control")];
    let valid = true;

    fields.forEach(field => {
      const ok = field.checkValidity() && field.value.trim() !== "";
      field.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      formMsg.className = "form-msg error";
      formMsg.textContent = "Please fill in all fields with a valid email.";
      return;
    }

    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message.value.trim()}\n\n${name}\n${email}`);

    window.location.href = `mailto:mamdouh87741@gmail.com?subject=${subject}&body=${body}`;
    formMsg.className = "form-msg success";
    formMsg.textContent = "Opening your email app…";
  });

  form.querySelectorAll(".form-control").forEach(field => {
    field.addEventListener("input", () => field.classList.remove("is-invalid"));
  });
});
