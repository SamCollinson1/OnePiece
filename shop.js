document.addEventListener('DOMContentLoaded', function() {
    // Retrieve duplicateValue from localStorage
    const duplicateValue = parseInt(localStorage.getItem('duplicateValue')) || 0;
    
    // Display duplicateValue on the screen
    const duplicateValueElement = document.getElementById('duplicateValue');
    if (duplicateValueElement) {
        duplicateValueElement.textContent = `Duplicate Value: ${duplicateValue}`;
    }
    
    // Rest of your code...
});


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
function handlePackClick(packId, price, url, currencyType) {
    if (currencyType === 'score') {
        if (updateScore(price)) {
            const urlWithPack = `${url}?packId=${packId}`;
            window.location.href = urlWithPack;
        }
    } else if (currencyType === 'duplicateValue') {
        if (updateDuplicateValue(price)) {
            const urlWithPack = `${url}?packId=${packId}`;
            window.location.href = urlWithPack;
        }
    }
}

function updateDuplicateValue(price) {
    let duplicateValue = parseInt(localStorage.getItem('duplicateValue')) || 0;
    let obtainedCards = JSON.parse(localStorage.getItem('obtainedCards')) || [];
    let totalCards = obtainedCards.length;

    // Calculate the percentage of cards collected
    let percentageCollected = (totalCards / totalCards) * 100;

    // Calculate the price based on the percentage of cards collected
    let duplicatePrice = 0;
    if (percentageCollected <= 25) {
        duplicatePrice = 40;
    } else if (percentageCollected <= 50) {
        duplicatePrice = 100;
    } else {
        duplicatePrice = 200;
    }

    if (duplicateValue >= duplicatePrice) {
        duplicateValue -= duplicatePrice;
        localStorage.setItem('duplicateValue', duplicateValue);
        updateDuplicateValueDisplay(duplicateValue);
        return true;
    } else {
        alert("Not enough duplicate value!");
        return false;
    }
}



function updateDuplicateValueDisplay(duplicateValue) {
    const duplicateValueElement = document.getElementById('duplicateValue');
    if (duplicateValueElement) {
        duplicateValueElement.textContent = `Duplicate Value: ${duplicateValue}`;
    }
}



