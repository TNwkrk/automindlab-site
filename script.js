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