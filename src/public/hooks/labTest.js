document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch the current user data from the /get-user endpoint
        const response = await fetch("/get-user", {
            method: "GET",
            credentials: "include" // Include cookies for session-based authentication
        });

        if (response.ok) {
            const userData = await response.json();

            // Update the HTML content with the user's name and score
            document.querySelector(".user-name").textContent = userData.name;
            document.querySelector(".user-score").textContent = `Highest Score: ${userData.score}`;
        } else {
            console.error("Failed to fetch user data:", response.statusText);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});