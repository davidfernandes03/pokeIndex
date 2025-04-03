// Password and Confirm Password
document.getElementById("sign-in-form").addEventListener("submit", function (event) {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        event.preventDefault();
        alert("Passwords do not match! Please check.");
    }
});

// Get Timestamp
document.getElementById("timestamp").value = new Date().toISOString();