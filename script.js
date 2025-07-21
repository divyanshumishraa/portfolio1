// Particle background
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#00ffd5" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00ffd5",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      out_mode: "out"
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});

gsap.registerPlugin(ScrollTrigger);

// Animate hero content
gsap.from(".hero-content", {
  opacity: 0,
  y: -50,
  duration: 1,
  ease: "power2.out"
});

// Animate About section
gsap.from(".about", {
  scrollTrigger: {
    trigger: ".about",
    start: "top 80%",
  },
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out"
});

// Animate Projects section
gsap.from(".project-card", {
  scrollTrigger: {
    trigger: ".projects",
    start: "top 80%",
  },
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out"
});

// Animate Contact section
gsap.from(".contact", {
  scrollTrigger: {
    trigger: ".contact",
    start: "top 80%",
  },
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out"
});
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    message: this.message.value
  };

  fetch("http://localhost:8080/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(res => res.text())
    .then(msg => alert("✅ " + msg))
    .catch(err => alert("❌ Failed to send message"));
});

document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const status = document.getElementById("form-status");
  const data = new FormData(this);

  const response = await fetch(this.action, {
    method: this.method,
    body: data,
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    status.textContent = "✅ Message sent successfully!";
    this.reset();
  } else {
    status.textContent = "❌ Oops! Something went wrong.";
  }
});
const dots = document.querySelectorAll(".dot");
const sections = ["hero", "projects", "contact"];

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(id => {
    const section = document.getElementById(id);
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) current = id;
  });

  dots.forEach(dot => {
    dot.classList.remove("active");
    if (dot.dataset.section === current) {
      dot.classList.add("active");
    }
  });
});
const text = "Web Developer | Backend Explorer | UI Enthusiast";
let i = 0;
function type() {
  if (i < text.length) {
    document.getElementById("typed-text").textContent += text.charAt(i);
    i++;
    setTimeout(type, 50);
  }
}
window.addEventListener("load", type);

const modal = document.getElementById("project-modal");
const openBtns = document.querySelectorAll(".open-modal");
const closeBtn = document.querySelector(".close-modal");

openBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
document.querySelectorAll('.skill-category').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(600px) rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  });
});

