window.addEventListener('beforeunload', function() {
    localStorage.setItem('pageRefreshed', 'true');
});

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('pageRefreshed') === 'true') {
        localStorage.removeItem('pageRefreshed');
        window.location.href = 'shop.html';
    } else {
        fetchCharacterData();
    }
});

function fetchCharacterData() {
    const urlParams = new URLSearchParams(window.location.search);
    const packId = urlParams.get('packId');
    console.log(packId);

    // Retrieve obtainedCards and duplicateValue from localStorage
    let obtainedCards = JSON.parse(localStorage.getItem('obtainedCards')) || [];
    let duplicateValue = parseInt(localStorage.getItem('duplicateValue')) || 0;
    console.log(obtainedCards)
    console.log(duplicateValue)

    fetch('chances.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.defaultChances) {
                throw new Error('Invalid character data format');
            }
            const packCharacters = getPackById(data, packId);
            const defaultCharacters = data.defaultChances;
            if (!packCharacters) {
                console.warn('No characters found for pack:', packId);
                createPosters([], defaultCharacters); // Pass an empty array for pack characters
            } else {
                createPosters(packCharacters, defaultCharacters);
            }
        })
        .catch(error => console.error('Error fetching character data:', error));

    function getPackById(data, packId) {
        switch (packId) {
            case 'strawhatPack':
                return data.strawhatPack;
            case 'emperorsPack':
                return data.emperorsPack;
            case 'admiralPack':
                return data.admiralPack;
            case 'warlordPack':
                return data.warlordPack;
            default:
                return null;
        }
    }

    function createPosters(packCharacters, defaultCharacters) {
        console.log('Pack characters:', packCharacters);
        console.log('Default characters:', defaultCharacters);

        const packContainer = document.getElementById('packContainer');
        const mergedCharacters = packCharacters.concat(defaultCharacters);

        // Create two rows
        for (let row = 0; row < 2; row++) {
            for (let i = 0; i < 5; i++) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'poster-container';

                const imgback = document.createElement('img');
                imgback.className = 'poster';
                imgback.src = 'images/poster.png';

                const img = document.createElement('img');
                img.className = 'photo';

                // Randomly select a character from the merged characters list
                const selectedCharacter = selectCharacter(mergedCharacters);
                console.log('Selected character:', selectedCharacter); // Debugging statement
                img.src = `images/${selectedCharacter.toLowerCase().replace(/ /g, "_")}.png`;

                // Check if the selected character is from the pack characters
                const isPackCharacter = packCharacters.some(character => character.name === selectedCharacter);
                const posterImage = isPackCharacter ? 'images/goldPoster.png' : 'images/poster.png';

                imgback.src = posterImage;

                const textDiv = document.createElement('div');
                textDiv.className = 'poster-text';
                textDiv.textContent = selectedCharacter;

                imgContainer.appendChild(imgback);
                imgContainer.appendChild(img);
                imgContainer.appendChild(textDiv); // Append text div to poster container
                packContainer.appendChild(imgContainer);

                // Add the obtained character to the list
                if (!hasObtainedCard(selectedCharacter)) {
                    addObtainedCard(selectedCharacter);
                } else {
                    // Handle duplicate card
                    handleDuplicateCard(selectedCharacter, packCharacters);
                }
            }
        }

        // Save obtainedCards and duplicateValue to localStorage
        saveToLocalStorage('obtainedCards', obtainedCards);
        saveToLocalStorage('duplicateValue', duplicateValue);
    }

    function addObtainedCard(cardName) {
        obtainedCards.push(cardName);
    }

    function handleDuplicateCard(cardName, packCharacters) {
        // Check if the duplicate card is from pack characters
        const isPackCharacter = packCharacters.some(character => character.name === cardName);
        
        // Increase duplicate value
        duplicateValue += isPackCharacter ? 15 : 2;
    }
    
    function hasObtainedCard(cardName) {
        return obtainedCards.includes(cardName);
    }

    function selectCharacter(characters) {
        const totalChance = characters.reduce((acc, character) => acc + character.chance, 0);
        const randomNum = Math.random() * totalChance;
        let cumulativeChance = 0;

        for (const character of characters) {
            cumulativeChance += character.chance;
            if (randomNum < cumulativeChance) {
                return character.name;
            }
        }
    }

    // Function to save data to localStorage
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Function to reset obtainedCards and duplicateValue in localStorage
    function resetLocalStorage() {
        localStorage.removeItem('obtainedCards');
        localStorage.removeItem('duplicateValue');
    }
};

