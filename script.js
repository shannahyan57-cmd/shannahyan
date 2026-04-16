const body = document.body;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-btn");
const navLinks = document.querySelectorAll(".nav-links a, .brand");
const revealItems = document.querySelectorAll(".reveal");
const galleryButtons = document.querySelectorAll("[data-lightbox]");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const popup = document.querySelector("[data-popup]");
const popupClose = popup.querySelector(".popup-close");
const popupPackageLink = popup.querySelector('a[href="#packages"]');
const contactForm = document.querySelector(".contact-form");
const heroParallax = document.querySelector("[data-parallax]");
const videoFrame = document.querySelector(".video-frame");
const video = document.getElementById("highlightVideo");
const playButton = document.querySelector(".play-button");
const whatsappNumber = "916238011974";

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 16);
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  updateHeader();

  if (heroParallax) {
    const offset = Math.min(window.scrollY * 0.18, 90);
    heroParallax.style.setProperty("--hero-offset", `${offset}px`);
  }
});

updateHeader();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxImage.alt = "";
}

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    openLightbox(button.dataset.lightbox, image.alt);
  });
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxClose.addEventListener("click", closeLightbox);

function openPopup() {
  if (sessionStorage.getItem("spotFilmsPopupClosed") === "true") {
    return;
  }

  popup.classList.add("active");
  popup.setAttribute("aria-hidden", "false");
  body.classList.add("popup-open");
}

function closePopup() {
  popup.classList.remove("active");
  popup.setAttribute("aria-hidden", "true");
  body.classList.remove("popup-open");
  sessionStorage.setItem("spotFilmsPopupClosed", "true");
}

window.setTimeout(openPopup, 3000);
popupClose.addEventListener("click", closePopup);
popupPackageLink.addEventListener("click", closePopup);
popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    closePopup();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (lightbox.classList.contains("active")) {
    closeLightbox();
  }

  if (popup.classList.contains("active")) {
    closePopup();
  }

  closeMenu();
});

playButton.addEventListener("click", async () => {
  try {
    await video.play();
    videoFrame.classList.add("has-played");
    videoFrame.classList.add("playing");
  } catch (error) {
    video.controls = true;
    playButton.style.display = "none";
  }
});

video.addEventListener("click", () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});

video.addEventListener("play", () => {
  videoFrame.classList.add("has-played");
  videoFrame.classList.add("playing");
});
video.addEventListener("pause", () => videoFrame.classList.remove("playing"));
video.addEventListener("ended", () => videoFrame.classList.remove("playing"));
video.addEventListener("error", () => {
  video.controls = true;
  playButton.style.display = "none";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const message = formData.get("message").trim();
  const text = encodeURIComponent(
    `Spot Films enquiry\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`
  );

  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
  contactForm.reset();
});
