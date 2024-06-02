document.addEventListener('DOMContentLoaded', function() {
    fetchCharacterData();
});

function fetchCharacterData() {
    fetch('OP_names.txt')
        .then(response => response.text())
        .then(data => {
            const allCharacters = [];
            const affiliations = {};
            const obtainedCards = JSON.parse(localStorage.getItem('obtainedCards')) || [];

            // Parse the text data to extract all characters and their affiliations
            const lines = data.split('\n');
            lines.forEach(line => {
                const parts = line.split('|');
                if (parts.length === 9) {
                    const [name, , affiliation] = parts;
                    const trimmedName = name.trim();
                    const trimmedAffiliation = affiliation.trim();
                    allCharacters.push({ name: trimmedName, affiliation: trimmedAffiliation });
                    if (!affiliations[trimmedAffiliation]) {
                        affiliations[trimmedAffiliation] = [];
                    }
                    affiliations[trimmedAffiliation].push(trimmedName);
                }
            });

            fetch('chances.json')
                .then(response => response.json())
                .then(chances => {
                    // Display the collection grouped by affiliation
                    displayCollection(allCharacters, obtainedCards, affiliations, chances);
                })
                .catch(error => console.error('Error fetching chances:', error));
        })
        .catch(error => console.error('Error fetching the characters:', error));
}

function getPackCharacters(affiliation, affiliations, chances) {
    const packNames = Object.keys(chances).filter(pack => pack.endsWith("Pack"));
    const pack = packNames.find(pack => chances[pack].some(card => affiliations[affiliation].includes(card.name)));
    return pack ? chances[pack].map(card => card.name) : null;
}


function displayCollection(allCharacters, obtainedCards, affiliations, chances) {
    const collectionContainer = document.getElementById('collectionContainer');
    collectionContainer.innerHTML = ''; // Clear previous content

    if (allCharacters.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No characters found.';
        collectionContainer.appendChild(message);
    } else {
        Object.keys(affiliations).forEach(affiliation => {
            // Create a section for each affiliation
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'affiliation-section';

            // Create a title for the section
            const sectionTitle = document.createElement('h2');
            sectionTitle.className = "aTitle"
            sectionTitle.textContent = affiliation;
            sectionDiv.appendChild(sectionTitle);

            // Create a container for the posters
            const posterContainer = document.createElement('div');
            posterContainer.className = 'poster-container';

            // Get pack characters for this affiliation
            const packCharacters = getPackCharacters(affiliation, affiliations, chances);
            const goldPosters = [];
            const normalPosters = [];
            affiliations[affiliation].forEach(cardName => {
                // Check if the selected character is from the pack characters
                const isPackCharacter = packCharacters && packCharacters.includes(cardName);

                // Set the poster image accordingly
                const posterImage = isPackCharacter ? 'images/goldPoster.png' : 'images/poster.png';

                const imgContainer = document.createElement('div');
                imgContainer.className = 'poster-container';

                const imgback = document.createElement('img');
                imgback.className = 'poster';
                imgback.src = posterImage;

                const img = document.createElement('img');
                img.className = 'photo';
                img.src = `images/${cardName.toLowerCase().replace(/ /g, "_")}.png`;
                img.alt = cardName;

                 // Check if the character has been obtained
                 const isObtained = obtainedCards.includes(cardName);

                 // Set the image to grayscale if the character has not been obtained
                 if (!isObtained) {
                     img.classList.add('not-obtained');
                     imgback.classList.add('not-obtainedPoster')

                 }

                const textDiv = document.createElement('div');
                textDiv.className = 'poster-text';
                textDiv.textContent = cardName;

                imgContainer.appendChild(imgback);
                imgContainer.appendChild(img);
                imgContainer.appendChild(textDiv); // Append text div to poster container

                if (isPackCharacter) {
                    goldPosters.push(imgContainer);
                } else {
                    normalPosters.push(imgContainer);
                }
            });

            // Append gold posters first, then normal posters
            goldPosters.forEach(poster => {
                posterContainer.appendChild(poster);
            });
            normalPosters.forEach(poster => {
                posterContainer.appendChild(poster);
            });

            // Append the poster container to the section div
            sectionDiv.appendChild(posterContainer);

            // Append the section to the collection container
            collectionContainer.appendChild(sectionDiv);
        });
    }
}

function resetCollection() {
    localStorage.clear();
}