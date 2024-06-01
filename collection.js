document.addEventListener('DOMContentLoaded', function() {
    fetchCharacterData();
});

function fetchCharacterData() {
    fetch('OP_names.txt')
        .then(response => response.text())
        .then(data => {
            const affiliations = {};
            const obtainedCards = JSON.parse(localStorage.getItem('obtainedCards')) || [];
            
            // Parse the text data to extract affiliations for obtained cards
            const lines = data.split('\n');
            lines.forEach(line => {
                const parts = line.split('|');
                if (parts.length === 9) {
                    const [name, , affiliation] = parts;
                    if (obtainedCards.includes(name.trim())) {
                        affiliations[affiliation.trim()] = true;
                    }
                }
            });
            
            // Update the header with affiliations
            const headerAffiliation = document.getElementById('headerAffiliation');
            headerAffiliation.innerHTML = Object.keys(affiliations).join(' | ');
        })
        .catch(error => console.error('Error fetching the characters:', error))
        .finally(() => {
            displayCollection();
        });
}

function displayCollection() {
    const obtainedCards = JSON.parse(localStorage.getItem('obtainedCards')) || [];
    console.log(obtainedCards)
    const collectionContainer = document.getElementById('collectionContainer');
    collectionContainer.innerHTML = ''; // Clear previous content

    if (obtainedCards.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'You have not obtained any cards yet.';
        collectionContainer.appendChild(message);
    } else {
        obtainedCards.forEach(cardName => {
            // Create a poster div
            const posterDiv = document.createElement('div');
            posterDiv.className = 'poster';

            // Create an image element for the poster
            const posterImg = document.createElement('img');
            posterImg.src = `images/${cardName.toLowerCase().replace(/ /g, "_")}.png`;
            posterImg.alt = cardName;

            // Append the image to the poster div
            posterDiv.appendChild(posterImg);

            // Append the poster div to the collection container
            collectionContainer.appendChild(posterDiv);
        });
    }
}

function resetCollection() {
    localStorage.clear();
}
