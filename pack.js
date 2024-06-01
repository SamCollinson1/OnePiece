document.addEventListener('DOMContentLoaded', function() {
    fetch('chances.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched character data:', data);
            if (!data || !data.strawhatPack) {
                throw new Error('Invalid character data format');
            }
            createPosters(data.strawhatPack);
        })
        .catch(error => console.error('Error fetching character data:', error));
});

function createPosters(strawhatPack) {
    console.log('Character chances:', strawhatPack);
    const packContainer = document.getElementById('packContainer');

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
            const selectedCharacter = selectCharacter(strawhatPack).name;
            img.src = `images/${selectedCharacter.toLowerCase().replace(/ /g, "_")}.png`;

            const textDiv = document.createElement('div');
            textDiv.className = 'poster-text';
            textDiv.textContent = selectedCharacter;

            imgContainer.appendChild(imgback);
            imgContainer.appendChild(img);
            imgContainer.appendChild(textDiv); // Append text div to poster container
            packContainer.appendChild(imgContainer);
        }
    }
}

// Function to select a character based on probabilities
function selectCharacter(strawhatPack) {
    const characters = strawhatPack.map(c => c);
    const probabilities = strawhatPack.map(c => c.chance);
    const totalChance = probabilities.reduce((acc, chance) => acc + chance, 0);

    const randomNum = Math.random() * totalChance;
    let cumulativeChance = 0;

    for (let i = 0; i < characters.length; i++) {
        cumulativeChance += probabilities[i];
        if (randomNum < cumulativeChance) {
            return characters[i];
        }
    }
}
