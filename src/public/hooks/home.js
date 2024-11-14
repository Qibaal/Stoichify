document.addEventListener("DOMContentLoaded", async () => {
    const buttonContainer = document.querySelector(".flex-1.flex.justify-end");
    const signInButton = buttonContainer.querySelector("button");

    try {
        // Check if the user is logged in by calling a backend endpoint
        const response = await fetch("/check-session", {
            method: "GET",
            credentials: "include" // Include cookies if the session is stored in a cookie
        });

        if (response.ok) {
            const data = await response.json();

            if (data.isLoggedIn) {
                // If the user is logged in, change the button to "Logout"
                signInButton.textContent = "Logout";

                // Set the Logout behavior
                signInButton.addEventListener("click", async (event) => {
                    event.preventDefault();

                    // Call the logout endpoint
                    const logoutResponse = await fetch("/logout", {
                        method: "POST",
                        credentials: "include"
                    });

                    if (logoutResponse.ok) {
                        window.location.reload(); // Refresh the page to update the UI
                    } else {
                        console.error("Failed to log out. Please try again.");
                    }
                });
            } else {
                // If the user is not logged in, keep the button as "Sign-In"
                signInButton.textContent = "Sign-In";
                signInButton.addEventListener("click", () => {
                    window.location.href = "/login";
                });
            }
        } else {
            console.error("Failed to check login status.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});