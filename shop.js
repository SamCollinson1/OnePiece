document.addEventListener('DOMContentLoaded', function() {
    localStorage.setItem('pageRefreshed', 'false');
    // Retrieve duplicateValue from localStorage
    const duplicateValue = parseInt(localStorage.getItem('duplicateValue')) || 0;

    // Display duplicateValue on the screen
    const duplicateValueElement = document.getElementById('duplicateValue');
    if (duplicateValueElement) {
        duplicateValueElement.textContent = duplicateValue;
    }

    // Call functions to set dynamic prices
    setDynamicPrices();
});

function getScore() {
    return parseInt(localStorage.getItem('score')) || 0;
}

function saveScore(score) {
    localStorage.setItem('score', score);
}

function displayScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        const score = getScore();
        scoreElement.textContent = score;
    }
}

window.addEventListener('load', displayScore);

function updateScore(price) {
    let score = getScore();
    if (score >= price) {
        score -= price;
        document.getElementById("score").textContent = score;
        saveScore(score); // Save the updated score to Local Storage
        return true; // Allow navigation to the next page
    } else {
        alert("Not enough score!");
        return false; // Prevent navigation to the next page
    }
}

function handlePackClick(packId, price, url, currencyType) {
    if (currencyType === 'score') {
        if (updateScore(price)) {
            const urlWithPack = `${url}?packId=${packId}`;
            window.location.href = urlWithPack;
        }
    } else if (currencyType === 'duplicateValue') {
        if (updateDuplicateValue()) {
            const urlWithPack = `${url}?packId=${packId}`;
            window.location.href = urlWithPack;
        }
    }
}

function getDuplicatePrice() {
    let obtainedCards = JSON.parse(localStorage.getItem('obtainedCards')) || [];
    let totalCards = obtainedCards.length;

    // Calculate the percentage of cards collected
    let percentageCollected = (totalCards / 100) * 100; // assuming 100 is the total number of cards

    // Determine the price based on the percentage of cards collected
    if (percentageCollected <= 50) {
        return 50;
    } else if (percentageCollected <= 75) {
        return 150;
    } else{
        return 200;
    }
}

function updateDuplicateValue() {
    let duplicateValue = parseInt(localStorage.getItem('duplicateValue')) || 0;
    let duplicatePrice = getDuplicatePrice();

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
        duplicateValueElement.textContent = duplicateValue;
    }
}

function setDynamicPrices() {
    const strawhatDupPriceElement = document.getElementById('strawhatDupPrice');
    const emperorDupPriceElement = document.getElementById('emperorDupPrice');
    const warlordDupPriceElement = document.getElementById('warlordDupPrice');
    const admiralDupPriceElement = document.getElementById('admiralDupPrice');
    const duplicatePrice = getDuplicatePrice();

    if (strawhatDupPriceElement) {
        strawhatDupPriceElement.textContent = duplicatePrice;
    }
    if (emperorDupPriceElement) {
        emperorDupPriceElement.textContent = duplicatePrice;
    }
    if (warlordDupPriceElement) {
        warlordDupPriceElement.textContent = duplicatePrice;
    }
    if (admiralDupPriceElement) {
        admiralDupPriceElement.textContent = duplicatePrice;
    }
}
