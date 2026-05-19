const storageKeys = {
  subjects: "brightMindsSubjects",
  plan: "brightMindsPlan"
};

const readStoredSubjects = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.subjects) || "[]");
  } catch (error) {
    return [];
  }
};

const writeStoredSubjects = (subjects) => {
  localStorage.setItem(storageKeys.subjects, JSON.stringify(subjects));
};

const createChip = (text) => {
  const chip = document.createElement("span");
  chip.textContent = text;
  return chip;
};

const updateSubjectSummaries = () => {
  const subjects = readStoredSubjects();
  document.querySelectorAll("[data-subject-summary]").forEach((summary) => {
    summary.innerHTML = "";
    if (!subjects.length) {
      summary.appendChild(createChip("No subjects selected yet"));
      summary.firstElementChild.classList.add("empty-chip");
      return;
    }

    subjects.forEach((subject) => summary.appendChild(createChip(subject)));
  });
};

const syncSubjectInputs = () => {
  const subjects = new Set(readStoredSubjects());

  document.querySelectorAll("[data-subject-input]").forEach((input) => {
    input.checked = subjects.has(input.value);
    input.addEventListener("change", () => {
      const current = new Set(readStoredSubjects());
      if (input.checked) {
        current.add(input.value);
      } else {
        current.delete(input.value);
      }
      writeStoredSubjects([...current]);
      syncContactSubjects();
      updateSubjectSummaries();
    });
  });
};

const syncContactSubjects = () => {
  const subjects = new Set(readStoredSubjects());

  document.querySelectorAll("[data-contact-subject]").forEach((input) => {
    input.checked = subjects.has(input.value);
  });
};

const initMenu = () => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
};

const initSubjectFilters = () => {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-groups]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      cards.forEach((card) => {
        const groups = card.dataset.groups.split(" ");
        card.hidden = filter !== "all" && !groups.includes(filter);
      });
    });
  });
};

const initBillingToggle = () => {
  const buttons = document.querySelectorAll("[data-billing]");
  const prices = document.querySelectorAll("[data-price]");
  const periods = document.querySelectorAll("[data-period]");
  if (!buttons.length || !prices.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const billing = button.dataset.billing;
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      prices.forEach((price) => {
        price.textContent = price.dataset[billing];
      });

      periods.forEach((period) => {
        period.textContent = billing === "weekly" ? "/ week" : "/ month";
      });
    });
  });
};

const initPlanChoices = () => {
  const selectedPlan = localStorage.getItem(storageKeys.plan);
  const label = document.querySelector("[data-selected-plan-label]");
  const planField = document.querySelector("[data-plan-field]");

  if (label) {
    label.textContent = selectedPlan ? selectedPlan : "No plan selected yet.";
  }

  if (planField && selectedPlan) {
    planField.value = selectedPlan;
  }

  document.querySelectorAll("[data-plan-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem(storageKeys.plan, button.dataset.planChoice);
    });
  });
};

const initEstimator = () => {
  const lessonRange = document.querySelector("[data-lesson-range]");
  const subjectCount = document.querySelector("[data-subject-count]");
  const lessonOutput = document.querySelector("[data-lesson-output]");
  const estimateTotal = document.querySelector("[data-estimate-total]");
  if (!lessonRange || !subjectCount || !lessonOutput || !estimateTotal) return;

  const update = () => {
    const lessons = Number(lessonRange.value);
    const subjects = Number(subjectCount.value);
    const total = lessons * 120 + subjects * 75;
    lessonOutput.textContent = String(lessons);
    estimateTotal.textContent = `R${total}`;
  };

  lessonRange.addEventListener("input", update);
  subjectCount.addEventListener("change", update);
  update();
};

const initFaqs = () => {
  document.querySelectorAll("[data-faq-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
};

const initTestimonials = () => {
  const shell = document.querySelector("[data-testimonials]");
  if (!shell) return;

  const slides = [...shell.querySelectorAll(".quote-slide")];
  const next = shell.querySelector("[data-testimonial-next]");
  const previous = shell.querySelector("[data-testimonial-prev]");
  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;

  const show = (nextIndex) => {
    slides[index].classList.remove("is-active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add("is-active");
  };

  next?.addEventListener("click", () => show(index + 1));
  previous?.addEventListener("click", () => show(index - 1));
};

const initHeroBoard = () => {
  const board = document.querySelector("[data-hero-board]");
  if (!board || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  board.addEventListener("pointermove", (event) => {
    const rect = board.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    board.style.setProperty("--tilt-x", `${y * -5}deg`);
    board.style.setProperty("--tilt-y", `${x * 6}deg`);
  });

  board.addEventListener("pointerleave", () => {
    board.style.setProperty("--tilt-x", "0deg");
    board.style.setProperty("--tilt-y", "0deg");
  });
};

const initRevealAnimations = () => {
  const revealItems = document.querySelectorAll(
    ".section-head, .feature-card, .timeline-step, .preview-card, .faq-item, .subject-card, .price-card, .mode-grid article, .comparison-grid div, .estimator, .contact-info-panel, .booking-form"
  );

  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${(index % 6) * 55}ms`);
    observer.observe(item);
  });
};

const initContactForm = () => {
  const form = document.querySelector("[data-booking-form]");
  const status = document.querySelector("[data-form-status]");
  if (!form || !status) return;

  syncContactSubjects();

  document.querySelectorAll("[data-contact-subject]").forEach((input) => {
    input.addEventListener("change", () => {
      const selected = [...document.querySelectorAll("[data-contact-subject]:checked")].map((item) => item.value);
      writeStoredSubjects(selected);
      updateSubjectSummaries();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const subjects = [...document.querySelectorAll("[data-contact-subject]:checked")].map((item) => item.value);
    const lines = [
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      `Grade: ${formData.get("grade")}`,
      `Plan: ${formData.get("plan") || "Not sure yet"}`,
      `Subjects: ${subjects.join(", ") || "Not selected"}`,
      `Preferred time: ${formData.get("time")}`,
      "",
      formData.get("message") || "No extra message added."
    ];

    const mailto = `mailto:brightmindstutoring@gmail.com?subject=${encodeURIComponent("The Soda Method tutoring enquiry")}&body=${encodeURIComponent(lines.join("\n"))}`;
    status.textContent = "Your enquiry is ready. ";
    const link = document.createElement("a");
    link.href = mailto;
    link.textContent = "Open email draft";
    status.appendChild(link);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  syncSubjectInputs();
  syncContactSubjects();
  updateSubjectSummaries();
  initSubjectFilters();
  initBillingToggle();
  initPlanChoices();
  initEstimator();
  initFaqs();
  initTestimonials();
  initHeroBoard();
  initRevealAnimations();
  initContactForm();

  // Smooth scroll enhancement
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
