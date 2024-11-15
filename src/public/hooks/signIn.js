document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginform");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get values from the form inputs
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Prepare the request body
        const requestData = {
            email,
            password,
        };

        try {
            // Send a POST request to the login endpoint
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("User logged in:", data);
                alert(`Selamat datang ${data.user.name}`)

                window.location.href = "/virtual-lab";
            } else {
                const errorData = await response.json();
                alert(`Login failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
});
