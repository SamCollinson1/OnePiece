let characters = {};
let score = 0;
let maxGuesses = 6;
let remainingGuesses = maxGuesses;
let totalPenalty = 0;
let correctCategories = [];
let wrongCategories = [];


orderArcs = {
    1: "Romance Dawn",
    2: "Orange Town",
    3: "Syrup Village",
    4: "Baratie",
    5: "Arlong Park",
    6: "Loguetown",
    7: "Reverse Mountain",
    8: "Whiskey Peak",
    9: "Little Garden",
    10: "Drum Island",
    11: "Alabasta",
    12: "Jaya",
    13: "Skypiea",
    14: "Long Ring Long Land",
    15: "Water 7",
    16: "Enies Lobby",
    17: "Post-Enies Lobby",
    18: "Thriller Bark",
    19: "Sabaody Archipelago",
    20: "Amazon Lily",
    21: "Impel Down",
    22: "Marineford",
    23: "Post-War",
    24: "Return to Sabaody",
    25: "Fish-Man Island",
    26: "Punk Hazard",
    27: "Dressrosa",
    28: "Zou",
    29: "WholeCake Island",
    30: "Reverie",
    31: "Wano"
}



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
    score = getScore();
    document.getElementById("score").textContent = score;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Clear existing options
    chooseCharacter();
    document.getElementById("score").textContent = score;
    for (const character in characters) {
        if (characters.hasOwnProperty(character)) {
            const option = document.createElement('div');
            option.className = 'option';
            
            // Create a div for the image
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-container';
            const img = document.createElement('img');
            img.src = 'images/' + character.toLowerCase() + '.png';
            img.alt = character;
            imageDiv.appendChild(img);
            
            // Create a div for the text
            const textDiv = document.createElement('div');
            textDiv.className = 'text-container';
            const text = document.createTextNode(' ' + character.charAt(0).toUpperCase() + character.slice(1));
            textDiv.appendChild(text);
            
            // Append image and text divs to the option container
            option.appendChild(imageDiv);
            option.appendChild(textDiv);
            
            optionsContainer.appendChild(option);
        }
    }
}
    
let chosenCharacter = null;
let characterDetails = null;
let chosenCharacterAge = null;
let chosenCharacterHeight = null;
let chosenCharacterBounty = null;
let chosenCharacterArc = null;

function chooseCharacter() {
    const characterNames = Object.keys(characters);
    const randomIndex = Math.floor(Math.random() * characterNames.length);
    const characterName = characterNames[randomIndex];
    characterDetails = characters[characterName];
    chosenCharacter = {[characterName]: characterDetails};
    chosenCharacterAge = chosenCharacter[characterName].age;
    chosenCharacterHeight = chosenCharacter[characterName].height;
    chosenCharacterBounty = chosenCharacter[characterName].bounty;
    chosenCharacterArc = chosenCharacter[characterName].arc;
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
            let correctCount = 0;
            
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
                        if(!correctCategories.includes(details[Object.keys(details)[index-1]])){
                            correctCategories.push(details[Object.keys(details)[index-1]]);
                        }
                        correctCount++;
                        addCell.classList.add("match");
                    } else {
                        addCell.classList.add("no-match");
                    }
                    // Add arrow classes only to age, bounty, and height cells
                    if (index === 4 || index === 5 || index === 6 || index === 7) {
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
                        if (index === 7) {
                            var chosenArcNum = 0;
                            var guessArcNum = 0;
                            for (var arcNumber in orderArcs) {
                                let num = 0;
                                if (chosenCharacterArc === orderArcs[arcNumber]) {
                                    chosenArcNum = parseInt(arcNumber); // Convert string to integer
                                }
                                console.log(arcNumber)
                                if (details.arc === orderArcs[arcNumber]) {
                                    guessArcNum = parseInt(arcNumber); // Convert string to integer
                                }
                                num++;
                                
                            }
                            console.log(chosenArcNum);
                            console.log(guessArcNum);
                            if (chosenArcNum < guessArcNum) {
                                addCell.classList.add("downarrow");
                            } else if (chosenArcNum > guessArcNum) {
                                addCell.classList.add("uparrow");
                            }
                        }
                        
                    }
                }

                addCell.textContent = data;
                checkCategories()
            });
            // Check if the guessed character is the chosen character
            if (chosenCharacter && selectedCharacter in chosenCharacter) {
                score += correctCount * 20;
                updateScore(score);
                document.getElementById('score').textContent = score;
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
            document.getElementById('guesstext').innerHTML = "Guesses Left: " + remainingGuesses;
            if (remainingGuesses === 0) {
                createPlayAgainButton();
                showLoseMessage(Object.keys(chosenCharacter)[0]);
                let penalty = calculatePenalty(details);
                score -= penalty;
                updateScore(score);
            }
        }
    }
}
function checkCategories() {
    const details = characterDetails;

    // Iterate over each category in the character details
    for (const [key, val] of Object.entries(details)) {
        // If the category is not found in correctCategories and not already in wrongCategories, add it to wrongCategories
        if (!correctCategories.includes(val)) {
            // Exclude 'status' category from being added to wrongCategories if it is correctly guessed
                if (!wrongCategories.includes(key)) {
                    wrongCategories.push(key);
                }
        } else {
            // If the category is found in correctCategories, remove it from wrongCategories if it exists
            wrongCategories = wrongCategories.filter(item => item !== key);
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
    document.body.insertBefore(playAgainButton, document.getElementById('table-container'));
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
let space = 10;
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
            detailDiv.style.left = `${space}vw`;
            if (correctCategories.includes(characterDetails[key])) {
                detailDiv.classList.add('correct');
            } else if (wrongCategories.includes(key)) {
                detailDiv.classList.add('wrong');
            }
            detailDiv.innerHTML = `<span class="detail-value">${characterDetails[key]}</span>`;
            detailsContainer.appendChild(detailDiv);
        }
    }

    document.body.appendChild(detailsContainer);
}

function resetGame() {
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
    initializePage();

    // Hide and disable the play again button
    var playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.remove();
    playAgainButton.disabled = true;

    // Reset remaining guesses
    remainingGuesses = maxGuesses;
    totalPenalty = 0; // Reset the total penalty
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

function dropDown(event) {
    var input = document.getElementById('textAnswer');
    var selectedOption = event.target.textContent.trim();
    if (event.target.tagName === 'IMG') {
        selectedOption = event.target.alt.trim(); // Get alt attribute of the clicked image
        
    }
    if (selectedOption) {
        var toUppercase = selectedOption[0].toUpperCase() + selectedOption.slice(1);
        input.value = toUppercase;
        addDetails();
        document.getElementById('options').style.display = 'none';
    }
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
    }
}

let revealedClues = [];
let spacing = 12;

function revealClue() {
    const clueButton = document.getElementById("clueButton");
    const clueList = document.getElementById("cluesList");
    const score = getScore(); // Get the current score

    if (score < 50) {
        alert("Not enough score to reveal a clue!"); // Alert the user
        return; // Exit the function if score is less than 50
    }

    if (chosenCharacter) {
        const randomCategory = getRandomCategory();
        if (randomCategory) {
            const category = randomCategory;
            const clue = characterDetails[category]; // Assuming characterDetails contains all details for all categories
            if (!revealedClues.includes(category)) {
                const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
                const clueItem = document.createElement('li');
                clueItem.className = "clueList";
                clueItem.style.top = `${spacing}vw`; 
                clueItem.textContent = `${capitalizedCategory}: ${clue}`;
                clueList.appendChild(clueItem);
                revealedClues.push(category);
                score -= 50;
                updateScore(score);
                spacing += 4;
            } else {
                revealClue(); // Try to reveal another clue if this one is already revealed
            }            
        }
    }
}


function getRandomCategory() {
    const randomIndex = Math.floor(Math.random() * wrongCategories.length);
    return wrongCategories[randomIndex];
}

document.addEventListener('click', function(event) {
    var input = document.getElementById('textAnswer');
    var dataList = document.getElementById('options');
    if (!input.contains(event.target) && !dataList.contains(event.target)) {
        dataList.style.display = 'none';
    } else if (dataList.contains(event.target) || dataList === event.target) { // Update condition to handle click on dataList itself
        dropDown(event); // Pass the event object to dropDown function
    }
});

function calculatePenalty(details) {
    let incorrectCategories = 8 - correctCategories.length; // There are 8 categories in total
    let penalty = incorrectCategories * 15; // Deduct 5 points for each incorrect category
    totalPenalty += penalty; // Update the total penalty
    return totalPenalty; // Return the penalty for this guess
}


function updateScore(newScore) {
    score = newScore;
    console.log(score);
    document.getElementById("score").textContent = score;
    saveScore(score); // Save the updated score to Local Storage
}


// Function to save the score to Local Storage
function saveScore(score) {
    localStorage.setItem('score', score.toString());
}


// Function to retrieve the score from Local Storage
function getScore() {
    return parseInt(localStorage.getItem('score')) || 0; // Parse the score as an integer
}

function resetScore() {
    // Clear the stored score in Local Storage
    localStorage.removeItem('score');
    // Update the displayed score to zero
    updateScore(0);
}