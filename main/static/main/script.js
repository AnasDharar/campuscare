// CampusCare Landing Page JavaScript

// DOM Elements
const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const chatbotPopup = document.getElementById("chatbot-popup");
const contactForm = document.getElementById("contact-form");

// Carousel Variables
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
const totalSlides = slides.length;

// Mobile Navigation Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Animate hamburger menu
  const bars = navToggle.querySelectorAll(".bar");
  bars.forEach((bar, index) => {
    if (navMenu.classList.contains("active")) {
      if (index === 0)
        bar.style.transform = "rotate(45deg) translate(5px, 5px)";
      if (index === 1) bar.style.opacity = "0";
      if (index === 2)
        bar.style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      bar.style.transform = "none";
      bar.style.opacity = "1";
    }
  });
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const bars = navToggle.querySelectorAll(".bar");
    bars.forEach((bar) => {
      bar.style.transform = "none";
      bar.style.opacity = "1";
    });
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Chatbot functionality
function toggleChatbot() {
  chatbotPopup.classList.toggle("active");
}

// Close chatbot when clicking outside
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".chatbot-icon") &&
    !e.target.closest(".chatbot-popup")
  ) {
    chatbotPopup.classList.remove("active");
  }
});

// Book slot functionality - Removed as therapist section is now hidden until login

// Open chatbot function (for feature button)
function openChatbot() {
  chatbotPopup.classList.add("active");
}

// Contact form handling - Removed as form is no longer displayed

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .therapist-card, .test-card, .about-content, .contact-content"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Test button functionality
document.addEventListener("DOMContentLoaded", () => {
  const testButtons = document.querySelectorAll(".test-card .btn");

  testButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const testName = this.parentElement.querySelector("h3").textContent;
      alert(
        `${testName}\n\nThis would typically open the psychological assessment tool.`
      );
    });
  });
});

// Feature button functionality
document.addEventListener("DOMContentLoaded", () => {
  const featureButtons = document.querySelectorAll(".feature-btn");

  featureButtons.forEach((button) => {
    if (button.textContent === "Chat Now") {
      button.addEventListener("click", openChatbot);
    }
  });
});

// Add loading animation for page load
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Add scroll progress indicator
function createScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #4F46E5, #10B981);
        z-index: 1002;
        transition: width 0.1s ease;
    `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  });
}

// Initialize scroll progress bar
document.addEventListener("DOMContentLoaded", createScrollProgress);

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Escape key closes chatbot
  if (e.key === "Escape") {
    chatbotPopup.classList.remove("active");
  }

  // Enter key on chatbot icon opens it
  if (
    e.key === "Enter" &&
    document.activeElement === document.querySelector(".chatbot-icon")
  ) {
    toggleChatbot();
  }
});

// Add focus management for accessibility
document.addEventListener("DOMContentLoaded", () => {
  // Focus trap for chatbot popup
  const chatbotFocusableElements = chatbotPopup.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusableElement = chatbotFocusableElements[0];
  const lastFocusableElement =
    chatbotFocusableElements[chatbotFocusableElements.length - 1];

  if (chatbotPopup.classList.contains("active")) {
    firstFocusableElement.focus();
  }

  // Handle tab navigation in chatbot
  chatbotPopup.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
  });
});

// Add error handling for image loading
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("error", function () {
      // Replace broken images with a placeholder icon
      this.style.display = "none";
      const placeholder = document.createElement("div");
      placeholder.innerHTML =
        '<i class="fas fa-user" style="font-size: 4rem; color: #9CA3AF;"></i>';
      placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #F3F4F6;
                border-radius: 10px;
            `;
      this.parentNode.appendChild(placeholder);
    });
  });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
  // Header scroll effect
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  }
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Add service worker registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // This would register a service worker for offline functionality
    // navigator.serviceWorker.register('/sw.js');
  });
}

// Carousel Functions
function showSlide(index) {
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Show current slide
  if (slides[index]) {
    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }
}

function changeSlide(direction) {
  currentSlideIndex += direction;

  // Loop around
  if (currentSlideIndex >= totalSlides) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = totalSlides - 1;
  }

  showSlide(currentSlideIndex);
}

function currentSlide(index) {
  currentSlideIndex = index - 1;
  showSlide(currentSlideIndex);
}

// Auto-advance carousel
function autoAdvance() {
  changeSlide(1);
}

// Start auto-advance when page loads
let carouselInterval;
document.addEventListener("DOMContentLoaded", () => {
  // Initialize carousel
  showSlide(0);

  // Start auto-advance every 3 seconds for continuous feel
  carouselInterval = setInterval(autoAdvance, 3000);

  // Pause auto-advance on hover
  const carousel = document.querySelector(".hero-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      clearInterval(carouselInterval);
    });

    carousel.addEventListener("mouseleave", () => {
      carouselInterval = setInterval(autoAdvance, 3000);
    });
  }
});

console.log("CampusCare landing page loaded successfully! 🧠💙");
function sendMessage() {
    fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: "123",
            prompt: "Hello, I want to start chatting!"
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Chatbot says:", data.response);
        alert("Chatbot: " + data.response);  // temporary
    });
}

