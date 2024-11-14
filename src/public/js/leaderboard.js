document.addEventListener("DOMContentLoaded", async () => {
    const leaderboardContainer = document.getElementById("leaderboard");

    try {
        // Fetch leaderboard data from the backend
        const response = await fetch("/get-leaderboard"); // Replace with actual API endpoint
        const leaderboardData = await response.json();

        // Sort leaderboard by score in descending order
        leaderboardData.sort((a, b) => b.score - a.score);

        // Generate leaderboard entries
        leaderboardData.forEach((entry, index) => {
            const entryDiv = document.createElement("div");
            entryDiv.className =
                "flex justify-between items-center p-4 bg-white rounded-lg shadow-md text-gray-800";
            entryDiv.innerHTML = `
                <span class="font-semibold">${index + 1}. ${entry.name}</span>
                <span class="font-bold">${entry.score}</span>
            `;
            leaderboardContainer.appendChild(entryDiv);
        });
    } catch (error) {
        console.error("Failed to load leaderboard data:", error);
        leaderboardContainer.innerHTML = `<p class="text-center text-red-600">Error loading leaderboard data</p>`;
    }
});
