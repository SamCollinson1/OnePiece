// Retrieve the score from local storage
function getScore() {
    return parseInt(localStorage.getItem('score')) || 0;
}

// Save the score to local storage
function saveScore(score) {
    localStorage.setItem('score', score);
}

// Display the score on the other page
function displayScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        const score = getScore();
        scoreElement.textContent = `Score: ${score}`;
    }
}

// Call the function to display the score when the other page loads
window.addEventListener('load', displayScore);

function updateScore(price) {
    let score = getScore();
    console.log(score);
    console.log(price);
    if (score >= price) {
        score -= price;
        document.getElementById("score").textContent = `Score: ${score}`;
        saveScore(score); // Save the updated score to Local Storage
        return true; // Allow navigation to the next page
    } else {
        alert("Not enough score!");
        return false; // Prevent navigation to the next page
    }
}

// Update the score and handle navigation to the next page
function handlePackClick(packId, price, url) {
    if (updateScore(price)) {
        // Construct the URL with the pack ID as a query parameter
        const urlWithPack = `${url}?packId=${packId}`;
        window.location.href = urlWithPack;
    }
}


