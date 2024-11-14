// register.js

document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("signUpButton");

    registerButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get values from the form inputs
        const name = document.querySelector(
            'input[placeholder="Full Name"]'
        ).value;
        const email = document.querySelector(
            'input[placeholder="Email"]'
        ).value;
        const password = document.querySelector(
            'input[placeholder="Password"]'
        ).value;

        // Prepare the request body
        const requestData = {
            name,
            email,
            password,
        };

        try {
            // Send a POST request to the registration endpoint
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("User registered:", data);
                
                window.location.href = "/login";
            } else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            alert("An error occurred during registration. Please try again.");
        }
    });
});
