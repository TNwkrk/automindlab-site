const SUPABASE_URL = "https://efwmydmgeghvpjwuwqrr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ieuGWCcKFGR9rvXGu4kQ2g_jxULiX0k";

async function subscribe() {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

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

    alert("Thanks! You’re on the list.");
    emailInput.value = "";
  } catch (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
}