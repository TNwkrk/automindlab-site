const SUPABASE_URL = "https://efwmydmgeghvpjwuwqrr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ieuGWCcKFGR9rvXGu4kQ2g_jxULiX0k";

function getStatusElement() {
  let statusEl = document.getElementById("form-status");

  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.id = "form-status";
    statusEl.style.marginTop = "14px";
    statusEl.style.fontSize = "14px";
    statusEl.style.minHeight = "20px";
    statusEl.style.opacity = "0.9";

    const signup = document.querySelector(".signup");
    signup.insertAdjacentElement("afterend", statusEl);
  }

  return statusEl;
}

function setStatus(message, type = "default") {
  const statusEl = getStatusElement();
  statusEl.textContent = message;

  if (type === "success") {
    statusEl.style.color = "#7ee081";
  } else if (type === "error") {
    statusEl.style.color = "#ff8a8a";
  } else {
    statusEl.style.color = "#F5F7FA";
  }
}

async function loadWaitlistCount() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/waitlist?select=id`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    const data = await response.json();
    const count = data.length;

    const counter = document.getElementById("waitlist-count");

    if (count === 0) {
      counter.textContent = "Be the first to join the waitlist.";
    } else if (count === 1) {
      counter.textContent = "Join 1 person waiting for launch.";
    } else {
      counter.textContent = `Join ${count} people waiting for launch.`;
    }
  } catch (err) {
    console.error(err);
  }
}

async function subscribe() {
  const emailInput = document.getElementById("email");
  const button = document.querySelector(".signup button");
  const email = emailInput.value.trim();

  setStatus("");

  if (!email) {
    setStatus("Please enter your email.", "error");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setStatus("Please enter a valid email address.", "error");
    return;
  }

  const originalButtonText = button.textContent;
  button.disabled = true;
  button.textContent = "Submitting...";
  emailInput.disabled = true;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify([{ email }])
    });

    if (!response.ok) {
      throw new Error("Signup failed.");
    }

    setStatus("Thanks. You’re on the list.", "success");
    emailInput.value = "";
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong. Please try again.", "error");
  } finally {
    button.disabled = false;
    button.textContent = originalButtonText;
    emailInput.disabled = false;
  }
}

function initBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  const particles = [];
  const particleCount = 55;
  const maxDistance = 120;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      p1.x += p1.vx;
      p1.y += p1.vy;

      if (p1.x < 0 || p1.x > width) p1.vx *= -1;
      if (p1.y < 0 || p1.y > height) p1.vy *= -1;

      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(47, 107, 255, 0.7)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(47, 107, 255, ${opacity * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

initBackground();
loadWaitlistCount();