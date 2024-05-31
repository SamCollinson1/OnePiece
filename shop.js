// Retrieve the score from local storage
function getScore() {
    return parseInt(localStorage.getItem('score')) || 0;
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