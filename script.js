function subscribe() {
  const email = document.getElementById("email").value;

  if (email === "") {
    alert("Please enter your email");
    return;
  }

  alert("Thanks! We'll notify you when Automind Lab launches.");
}