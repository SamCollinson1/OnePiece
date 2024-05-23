// const characters = {
//     'Ace': ["Male", "Whitebeard Pirates", "Logia", 20, "550M", "1m85", "Alabasta", "Deceased"],
//     'Akainu': ["Male", "Marines", "Logia", 55, 0, "3m06", "Enies Lobby", "Alive"],
//     'Aokiji': ["Male", "Marines", "Logia", 49, 0, "2m98", "Long Ring Long Land", "Alive"],
//     'Blackbeard': ["Male", "Blackbeard Pirates", "Logia", 40, "2.2B", "3m44", "Jaya", "Alive"],
//     'Boa': ["Female", "Kuja", "Paramecia", 31, "80M", "1m91", "Amazon Lily", "Alive"],
//     'Brook': ["Male", "Strawhats Pirates", "Paramecia", 90, "83M", "2m77", "Thriller Bark", "Alive"],
//     'Buggy': ["Male", "Cross Guild", "Paramecia", 39, "3.2B", "1m92", "Orange Town", "Alive"],
//     'Chopper': ["Male", "Strawhats Pirates", "Zoan", 17, "100", "0.9m", "Drum Island", "Alive"],
//     'Crocodile': ["Male", "Cross Guild", "Logia", 46, "81M", "2m53", "Whiskey Peak", "Alive"],
//     'Dragon': ["Male", "Revolutionary", "None", 55, 0, "2m56", "Loguetown", "Alive"],
//     'Franky': ["Male", "Strawhats Pirates", "None", 36, "394M", "2m40", "Water 7", "Alive"],
//     'Garp': ["Male", "Marines", "None", 78, "3B", "2m87", "Water 7", "Alive"],
//     'Jinbe': ["Male", "Strawhats Pirates", "None", 46, "1.1B", "3m01", "Impel Down", "Alive"],
//     'Kid': ["Male", "Kid Pirates", "Paramecia", 23, "3B", "2m05", "Sabaody Archipelago", "Alive"],
//     'Kizaru': ["Male", "Marines", "Logia", 58, "3B", "3m02", "Sabaody Archipelago", "Alive"],
//     'Kuma': ["Male", "Revolutionary", "Paramecia", 47, "296M", "6m89", "Thriller Bark", "Alive"],
//     'Law': ["Male", "Heart Pirates", "Paramecia", 26, "3B", "1m91", "Sabaody Archipelago", "Alive"],
//     'Luffy': ["Male", "Strawhats Pirates", "Zoan", 19, "3B", "1m74", "Romance Dawn", "Alive"],
//     'Mihawk': ["Male", "Cross Guild", "None", 43, "3.6B", "1m98", "Baratie", "Alive"],
//     'Moria': ["Male", "Thriller Bark Pirates", "Paramecia", 50, "320M", "6m92", "Thriller Bark", "Alive"],
//     'Nami': ["Female", "Strawhats Pirates", "None", 20, "366M", "1m70", "Romance Dawn", "Alive"],
//     'Robin': ["Female", "Strawhats Pirates", "Paramecia", 30, "930M", "1m88", "Whiskey Peak", "Alive"],
//     'Roger': ["Male", "Roger Pirates", "None", 53, "5.57B", "2m74", "Romance Dawn", "Deceased"],
//     'Sabo': ["Male", "Revolutionary", "Logia", 22, "602M", "1m87", "Post-War Arc", "Alive"],
//     'Sanji': ["Male", "Strawhats Pirates", "None", 21, "1.03B", "1m80", "Baratie", "Alive"],
//     'Sengoku': ["Male", "Marines", "Zoan", 79, 0, "2m78", "Marineford", "Alive"],
//     'Shanks': ["Male", "Red Hair Pirates", "None", 39, "4.05B", "1m99", "Romance Dawn", "Alive"],
//     'Usopp': ["Male", "Strawhats Pirates", "None", 19, "500M", "1m76", "Syrup Village", "Alive"],
//     'Whitebeard': ["Male", "Whitebeard Pirates", "Paramecia", 72, "5.05B", "6m66", "Marineford", "Deceased"],
//     'Zoro': ["Male", "Strawhats Pirates", "None", 21, "1.11B", "1m81", "Romance Dawn", "Alive"],
//     'Bigmom': ["Female", "Big Mom Pirates", "Paramecia", 68, "4.388B", "8m80", "Whole Cake Island", "Alive"],
//     'Kaido': ["Male", "Beast Pirates", "Zoan", 59, "4.611B", "7m10", "Wano", "Deceased"],
//     'Fujitora': ["Male", "Marines", "Paramecia", 54, 0, "2m70", "Dressrosa", "Alive"],
//     'Katakuri': ["Male", "Big Mom Pirates", "Paramecia", 48, "1.057B", "5m09", "Whole Cake Island", "Alive"],
//     'Rayleigh': ["Male", "Roger Pirates", "None", 78, 0, "1m88", "Sabaody Archipelago", "Alive"],
//     'Yamato': ["Female", "Beast Pirates", "Zoan", 28, 0, "2m63", "Wano", "Alive"],
//     'Koby': ["Male", "Marines", "None", 18, 0, "1m67", "Romance Dawn", "Alive"],
//     'Killer': ["Male", "Kid Pirates", "None", 27, "200M", "1m95", "Sabaody Archipelago", "Alive"],
//     'Doflamingo': ["Male", "Donquixote Pirates", "Paramecia", 41, "340M", "3m05", "Jaya", "Alive"]
// };

let characters = {};

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

            input.value = "";
            document.getElementById("inputImage").style.display = "none";
            document.getElementById('options').style.display = 'none';

            removeCharacterFromDropdown(selectedCharacter, inputValue);

            // If matchFound is still false after iterating over all details, add a class to the first cell to turn it red
            if (!matchFound) {
                addRow.cells[1].classList.add("no-match");
            }
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
// Compare bounties taking into account the letter (M or B)
function compareBounties(chosenBounty, detailsBounty) {
    const chosen = extractBountyDetails(chosenBounty);
    const details = extractBountyDetails(detailsBounty);
    if (details.letter === "B" && chosen.letter === "M") {
        return "selected";
        
    }else if (details.letter === "M" && chosen.letter === "B") {
        return "chosen";
        
    }else if (chosen.letter === details.letter) {
        if(chosen.numericValue < details.numericValue){
            return "selected";
        }else if(chosen.numericValue > details.numericValue){
            return "chosen";
        }
    }else if(details.letter == null && chosen.letter){
        return "chosen";
    }else if(chosen.letter == null && details.letter){
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
    var toUppercase = selectedOption[0].toUpperCase() + selectedOption.slice(1);
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
