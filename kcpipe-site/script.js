/* ===== KC Pipe — interactions ===== */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.classList.toggle("open");
    });
    nav.querySelectorAll(".nav__link, .nav__cta").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }

  // Header shadow + back-to-top on scroll
  var header = document.getElementById("header");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(
    ".about__grid, .services .section__head, .card, .why__item, .why__members, .contact__info, .contact__form, .stat"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (entry.target.classList.contains("card") || entry.target.classList.contains("stat")) ? (i % 3) * 80 + "ms" : "0ms";
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Animated stat counters
  var counters = document.querySelectorAll(".stat__num[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var start = 0, dur = 1200, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = Math.floor(p * (target - start) + start);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // Footer year
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // Quote form (front-end demo handler)
  window.handleSubmit = function (e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector("button[type=submit]");
    var original = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;
    // No backend yet — simulate, then guide to phone/email.
    setTimeout(function () {
      btn.textContent = "✓ Request Received";
      form.reset();
      setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 2500);
    }, 800);
    return false;
  };
})();
