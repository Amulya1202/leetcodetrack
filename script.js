document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{0,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const data = await response.json();
            displayUserData(data);
        } catch (error) {
            alert("Failed to fetch user details. Please check the username.");
            console.error(error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function getProgressStyle(solved, total, color) {
        const percentage = total === 0 ? 0 : (solved / total) * 100;
        return `conic-gradient(${color} ${percentage}%, #e0e0e0 ${percentage}%)`;
    }

    function displayUserData(data) {
        const {
            totalSolved,
            easySolved, totalEasy,
            mediumSolved, totalMedium,
            hardSolved, totalHard,
            ranking, contributionPoints
        } = data;

        easyLabel.textContent = `${easySolved} / ${totalEasy}`;
        mediumLabel.textContent = `${mediumSolved} / ${totalMedium}`;
        hardLabel.textContent = `${hardSolved} / ${totalHard}`;

        easyProgressCircle.style.background = getProgressStyle(easySolved, totalEasy, '#4caf50');
        mediumProgressCircle.style.background = getProgressStyle(mediumSolved, totalMedium, '#ffc107');
        hardProgressCircle.style.background = getProgressStyle(hardSolved, totalHard, '#f44336');

        cardStatsContainer.innerHTML = `
            <div class="card">🎯 <strong>Total Solved:</strong> ${totalSolved}</div>
            <div class="card">🏆 <strong>Ranking:</strong> ${ranking}</div>
            <div class="card">⭐ <strong>Contribution Points:</strong> ${contributionPoints}</div>
        `;
    }

    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
