// Check if user data already exists
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("taskflow-user"));
  if (user) {
    window.location.href = "app.html";
  }
};

document.getElementById("registrationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const errorMsg = document.getElementById("errorMsg");

  // Validation
  if (!name || !dob) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  const age = calculateAge(new Date(dob));
  if (age <= 10) {
    errorMsg.textContent = "You must be over 10 years old to use TaskFlow.";
    return;
  }

  // Save to localStorage
  const user = {
    name,
    dob,
    age
  };
  localStorage.setItem("taskflow-user", JSON.stringify(user));

  // Redirect
  window.location.href = "app.html";
});

function calculateAge(dob) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
