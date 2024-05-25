let characters = {};
let score = 0;
let maxGuesses = 6;
let remainingGuesses = maxGuesses;

fetch('OP_names.txt')
    .then(response => response.text())
    .then(data => {
        const lines = data.split('\n');
        lines.forEach(line => {
            const parts = line.split('|');
            if (parts.length === 9) {
                const [name, gender, affiliation, devilFruit, age, bounty, height, arc, status] = parts;
                characters[name.trim()] = {
                    gender: gender.trim(),
                    affiliation: affiliation.trim(),
                    devilFruit: devilFruit.trim(),
                    age: parseInt(age.trim()),
                    bounty: bounty.trim(),
                    height: height.trim(),
                    arc: arc.trim(),
                    status: status.trim()
                };
            } else {
                console.warn('Line format incorrect:', line);
            }
        });
        initializePage();        
    })
    .catch(error => console.error('Error fetching the characters:', error));

function initializePage() {
    const optionsContainer = document.getElementById('options');
    chooseCharacter();
    for (const character in characters) {
        if (characters.hasOwnProperty(character)) {
            const option = document.createElement('div');
            option.className = 'option';
            const img = document.createElement('img');
            img.src = 'images/' + character.toLowerCase() + '.png';
            img.alt = character;
            option.appendChild(img);
            const text = document.createTextNode(' ' + character.charAt(0).toUpperCase() + character.slice(1));
            option.appendChild(text);
            optionsContainer.appendChild(option);
        }
    }
}

let chosenCharacter = null;
let chosenCharacterAge = null;
let chosenCharacterHeight = null;
let chosenCharacterBounty = null;

function chooseCharacter() {
    const characterNames = Object.keys(characters);
    const randomIndex = Math.floor(Math.random() * characterNames.length);
    const characterName = characterNames[randomIndex];
    const characterDetails = characters[characterName];
    chosenCharacter = {[characterName]: characterDetails};
    chosenCharacterAge = chosenCharacter[characterName].age;
    chosenCharacterHeight = chosenCharacter[characterName].height;
    chosenCharacterBounty = chosenCharacter[characterName].bounty;
    console.log('Chosen character:', characterName); // For debugging purposes
}

function input(event) {
    if (event.key === "Enter") {
        addDetails();
    }
}

function checkCharacter(inputValue) {
    return characters.hasOwnProperty(inputValue);
}

var addedCharacters = [];

function addDetails() {
    var input = document.getElementById("textAnswer");
    const inputValue = input.value.charAt(0).toUpperCase() + input.value.slice(1);
    if (!addedCharacters.includes(inputValue) && checkCharacter(inputValue)) {
        var selectedCharacter = inputValue;
        if (selectedCharacter) {
            addedCharacters.push(selectedCharacter);
            var imgSrc = "images/" + selectedCharacter.toLowerCase() + ".png";
            var table = document.getElementById("table");
            var addRow = table.insertRow();
            var details = characters[selectedCharacter];

            // Initialize matchFound to false
            var matchFound = false;

            var cellData = [
                `<img src="${imgSrc}" alt="${selectedCharacter}" style="width:100%;">`,
                details.gender, details.affiliation, details.devilFruit, details.age,
                details.bounty, details.height, details.arc, details.status
            ];
            
            cellData.forEach((data, index) => {
                var addCell = addRow.insertCell();
                addCell.style.textAlign = "center";
                addCell.classList.add('cell-text');

                // Skip the image cell
                if (index === 0) {
                    addCell.innerHTML = data;
                    return;
                }
                // Check if the detail matches with the chosenCharacter
                if (chosenCharacter) {
                    if (details[Object.keys(details)[index-1]] === chosenCharacter[Object.keys(chosenCharacter)[0]][Object.keys(details)[index-1]]) {
                        // Set matchFound to true if a match is found
                        matchFound = true;
                        // Add class to the specific cell to turn it green
                        addCell.classList.add("match");
                    } else {
                        addCell.classList.add("no-match");
                    }
                    // Add arrow classes only to age, bounty, and height cells
                    if (index === 4 || index === 5 || index === 6) {
                        // Age
                        if (index === 4) {
                            if (chosenCharacterAge < details.age) {
                                addCell.classList.add("downarrow");
                            } else if (chosenCharacterAge > details.age) {
                                addCell.classList.add("uparrow");
                            }
                        }
                        // Bounty
                        if (index === 5) {
                            if (compareBounties(chosenCharacterBounty, details.bounty) === "selected") {
                                addCell.classList.add('downarrow');
                            } else if (compareBounties(chosenCharacterBounty, details.bounty) === "chosen") {
                                addCell.classList.add('uparrow');
                            }
                        }
                        // Height
                        if (index === 6) {
                            if (chosenCharacterHeight < details.height) {
                                addCell.classList.add("downarrow");
                            } else if (chosenCharacterHeight > details.height) {
                                addCell.classList.add("uparrow");
                            }
                        }
                    }
                }

                addCell.textContent = data;
            });

            // Check if the guessed character is the chosen character
            if (chosenCharacter && selectedCharacter in chosenCharacter) {
                score += 250;
                document.getElementById('score').textContent = `Score: ${score}`;
                showWinMessage(selectedCharacter);
                createPlayAgainButton();
                disableInput();
            }

            input.value = "";
            document.getElementById('options').style.display = 'none';

            removeCharacterFromDropdown(selectedCharacter, inputValue);

            // If matchFound is still false after iterating over all details, add a class to the first cell to turn it red
            if (!matchFound) {
                addRow.cells[1].classList.add("no-match");
            }
            
            remainingGuesses--;
            if (remainingGuesses === 0) {
                createPlayAgainButton();
                showLoseMessage(Object.keys(chosenCharacter)[0]);
            }
        }
    }
}

function showWinMessage(character) {
    var winMessage = document.createElement('div');
    winMessage.textContent = `Congratulations! You guessed ${character}!`;
    winMessage.className = 'win-message';
    document.body.appendChild(winMessage);
}


function createPlayAgainButton() {
    var playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.className = 'playAgainButton';
    playAgainButton.id = 'playAgainButton';
    playAgainButton.addEventListener('click', resetGame);
    document.body.insertBefore(playAgainButton, document.getElementById('table'));
}

function disableInput() {
    document.getElementById('textAnswer').disabled = true;
}

function showLoseMessage(character) {
    var loseMessage = document.createElement('div');
    loseMessage.textContent = `Out of guesses. The character was ${character}.`;
    loseMessage.className = 'lose-message';
    document.body.appendChild(loseMessage);
    createNewDivForCharacter(character);
}

function createNewDivForCharacter(character) {
    var characterDetails = characters[character];
    var detailsContainer = document.createElement('div');
    detailsContainer.id = 'loseDetails';
    detailsContainer.className = 'lose-details';

    var img = document.createElement('img');
    img.src = 'images/' + character.toLowerCase() + '.png';
    img.alt = character;
    img.className = 'character-image';
    detailsContainer.appendChild(img);
    
    for (const key in characterDetails) {
        if (characterDetails.hasOwnProperty(key)) {
            var detailDiv = document.createElement('div');
            detailDiv.className = 'detail';
            detailDiv.innerHTML = `<span class="detail-value">${characterDetails[key]}</span>`;
            detailsContainer.appendChild(detailDiv);
        }
    }

    document.body.appendChild(detailsContainer);
}

function resetGame() {
    // Change the chosen character
    chooseCharacter();

    // Clear dynamically added rows from the table
    var table = document.getElementById('table');
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }


    // Clear guessed characters from the addedCharacters array
    addedCharacters = [];
    // Reset the input field
    document.getElementById('textAnswer').value = '';
    // Enable the input field
    document.getElementById('textAnswer').disabled = false;
    // Remove the win message if present
    var winMessage = document.querySelector('.win-message');
    if (winMessage) {
        winMessage.remove();
    }
    // Remove the lose message if present
    var loseMessage = document.querySelector('.lose-message');
    if (loseMessage) {
        loseMessage.remove();
    }
    var loseDetails = document.getElementById('loseDetails');
    if (loseDetails) {
        loseDetails.remove();
    }
    // Reinitialize the dropdown options
    initializeDropdown();

    // Hide and disable the play again button
    var playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.remove();
    playAgainButton.disabled = true;

    // Reset remaining guesses
    remainingGuesses = maxGuesses;
}


function removeCharacterFromTable(character) {
    const table = document.getElementById('table');
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].textContent.trim() === character) {
            table.deleteRow(i);
            break; // Exit loop after removing the row
        }
    }
}




function extractBountyDetails(bountyString) {
    const numericValue = parseFloat(bountyString);
    const lastChar = bountyString[bountyString.length - 1];
    
    if (lastChar === 'M' || lastChar === 'B') {
        const letter = lastChar.toUpperCase();
        return { numericValue, letter };
    } else {
        return { numericValue };
    }
}

// Compare bounties taking into account the presence of a symbol (M or B)
function compareBounties(chosenBounty, detailsBounty) {
    const chosen = extractBountyDetails(chosenBounty);
    const details = extractBountyDetails(detailsBounty);
    if (details.letter === "B" && chosen.letter === "M") {
        return "selected";
    } else if (details.letter === "M" && chosen.letter === "B") {
        return "chosen";
    } else if (chosen.letter === details.letter) {
        if (chosen.numericValue < details.numericValue) {
            return "selected";
        } else if (chosen.numericValue > details.numericValue) {
            return "chosen";
        }
    } else if (details.letter == null && chosen.letter) {
        return "chosen";
    } else if (chosen.letter == null && details.letter) {
        return "selected";
    }
}

function removeCharacterFromDropdown(character) {
    const optionsContainer = document.getElementById('options');
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach(option => {
        if (option.textContent.trim().toLowerCase() === character.toLowerCase()) {
            option.remove();
        }
    });
}

function initializeDropdown() {
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Clear existing options

    for (const character in characters) {
        if (characters.hasOwnProperty(character) && !addedCharacters.includes(character)) {
            const option = document.createElement('div');
            option.className = 'option';
            const img = document.createElement('img');
            img.src = 'images/' + character.toLowerCase() + '.png';
            img.alt = character;
            option.appendChild(img);
            const text = document.createTextNode(' ' + character.charAt(0).toUpperCase() + character.slice(1));
            option.appendChild(text);
            optionsContainer.appendChild(option);
        }
    }
}


function dropDown(event) {
    var input = document.getElementById('textAnswer');
    var selectedOption = event.target.textContent.trim();

    var toUppercase = selectedOption[0].toUpperCase() + selectedOption.slice(1);
    console.log(toUppercase)
    input.value = toUppercase;
    addDetails();
    document.getElementById('options').style.display = 'none';
}

function showDropdown() {
    var input = document.getElementById('textAnswer');
    var dataList = document.getElementById('options');
    var options = dataList.querySelectorAll('.option');
    var filterValue = input.value.toLowerCase();

    options.forEach(option => {
        var optionText = option.textContent.trim().toLowerCase();
        if (optionText.startsWith(filterValue)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });

    if (filterValue.trim() === '') {
        dataList.style.display = 'none';
    } else {
        dataList.style.display = 'block';
        dataList.style.position = 'absolute';
        dataList.style.top = input.offsetTop + input.offsetHeight + 'px';
        dataList.style.left = input.offsetLeft + 'px';
        dataList.style.width = input.offsetWidth + 'px';
    }
}

document.addEventListener('click', function(event) {
    var input = document.getElementById('textAnswer');
    var dataList = document.getElementById('options');
    if (!input.contains(event.target) && !event.target.closest('.option')) {
        dataList.style.display = 'none';
    } else if (event.target.className === 'option' || event.target.tagName === "IMG") {
        dropDown(event);
    }
});

function updateScore(){
    score = document.getElementById("score");
}