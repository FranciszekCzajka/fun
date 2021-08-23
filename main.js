const button = document.querySelector('.submit');
let input = document.querySelector('.input');

function showError(message) {

    const errorModal = document.querySelector(".connection-error-overlay");
    errorModal.style.display = "flex";
    
    const errorMessage = document.querySelector(".connection-message");
    errorMessage.innerText = message;
    
    const errorClose = document.querySelector(".connection-x");

    errorClose.addEventListener('click', function() {
        errorModal.style.display = "none";
    });
}

function addToCalculator(foodTocalc) {

    const calcTable = document.querySelector(".calculator-table");
    const listElement = document.createElement("tr");
    listElement.className = "calculator-table-row";

    for (let i = 0; i < foodTocalc.length; i++) {
        const tableCell = document.createElement("td");
        tableCell.className = "calculator-table-cell";
        tableCell.innerText = foodTocalc[i];    
        listElement.append(tableCell);
    }

    const tableCell = document.createElement("td");
    tableCell.className = "calculator-table-cell";
    const input = document.createElement("input");
    input.type = "number";
    input.value = 100;
    tableCell.append(input);
    listElement.append(tableCell);
    calcTable.append(listElement);
}

function displayNutrients(foodObject) {

    const results = document.querySelector(".results");

    const foodName = document.createElement("h3");
    foodName.className = "food-name";
    foodName.innerText = foodObject[6].name;
    results.appendChild(foodName);
    const nutrientsTable = document.createElement("table");
    nutrientsTable.className = "nutrients";
    results.appendChild(nutrientsTable);

    const tableHeaders = ["Name", "Amount per 100g", "Unit"];

    const tableHeadersRow = document.createElement("tr");
    tableHeadersRow.className = "nutrients-row";

    for(let i = 0; i < 3; i++) {
        const tableHeader = document.createElement("th");
        tableHeader.className = "nutrients-header";
        tableHeader.innerText = tableHeaders[i];
        tableHeadersRow.appendChild(tableHeader);
    }

    nutrientsTable.appendChild(tableHeadersRow);
    
    for(let i = 0; i < foodObject.length - 1; i++){
        const tableRow = document.createElement("tr");
        tableRow.className = "nutrients-row";
        nutrientsTable.appendChild(tableRow);

        for(let j = 0; j < 3; j++){

            for(const [key, value] of Object.entries(foodObject[i])) {
                const tableCell = document.createElement("td");

                if (j == 0) {
                    tableCell.className = "nutrients-cell";
                    tableCell.innerText = key.charAt(0).toUpperCase() + key.slice(1);
                } else if (j == 1) {
                    tableCell.className = "nutrients-cell nutrients-cell-amount";
                    tableCell.innerText = value;
                } else {
                    if (i == 0) {
                        tableCell.className = "nutrients-cell nutrients-cell-unit";
                        tableCell.innerText = "kcal";
                    } else {
                        tableCell.className = "nutrients-cell nutrients-cell-unit";
                        tableCell.innerText = "g";
                    }
                }
                tableRow.append(tableCell);
            }
        }
    }

    const addToCalc = document.createElement("div");
    addToCalc.className = "add-to-calculator";
    addToCalc.innerText = "Add to calculator!";
    results.appendChild(addToCalc);

    addToCalc.addEventListener('click', function() {
        const foodToCalc =[
            foodObject[6].name, 
            foodObject[0].energy, 
            foodObject[1].protein, 
            foodObject[2].fats, 
            foodObject[3].carbohydrates,
            foodObject[4].sugars,
            foodObject[5].fiber
        ];
        addToCalculator(foodToCalc);
    });
}

button.addEventListener('click', function() {

    if (window.navigator.onLine) {

        if(input.value) {
    
            const API_KEY = "nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8";
            const API_URL = "https://api.nal.usda.gov";
            const FOOD_URL = `${API_URL}/fdc/v1/foods/search?query=${input.value}&dataType=Survey%20%28FNDDS%29&pageSize=10&pageNumber=1&sortBy=dataType.keyword&api_key=${API_KEY}`;
    
            const promise = fetch(FOOD_URL);
            const foods = document.querySelector(".results");
            
            promise
                .then(function(response) {
                    const processingPromise = response.json();
                    return processingPromise;
                })
                .then(function(processedResponse) {
                    if (processedResponse.foods.length) {
                        foods.innerHTML = "";
        
                        const foodsList = document.createElement("ul");
                        foodsList.className = "results-list";
                        foods.appendChild(foodsList);
        
                        for (let i = 0; i < processedResponse.foods.length; i++) {
                            const food = document.createElement("li");
                            food.innerText = processedResponse.foods[i].description;
                            food.className = "result animation-fade-in";
                            food.tabIndex = i;
                            foodsList.appendChild(food);
                        }
                                
                        foodsList.addEventListener('click', function(event) {
                            if (event.target.tagName == "LI") {
                                input.value = "";
                                foods.innerHTML = "";
                                const foodObject = [
                                    {"energy": processedResponse.foods[event.target.tabIndex].foodNutrients[3].value},
                                    {"protein": processedResponse.foods[event.target.tabIndex].foodNutrients[0].value.toFixed(2)},
                                    {"fats": processedResponse.foods[event.target.tabIndex].foodNutrients[1].value.toFixed(2)},
                                    {"carbohydrates": processedResponse.foods[event.target.tabIndex].foodNutrients[2].value.toFixed(2)},
                                    {"sugars": processedResponse.foods[event.target.tabIndex].foodNutrients[8].value.toFixed(2)},
                                    {"fiber": processedResponse.foods[event.target.tabIndex].foodNutrients[9].value.toFixed(2)},
                                    {"name": processedResponse.foods[event.target.tabIndex].description}
                                ];
                                displayNutrients(foodObject);
                            }
                        });     
                    } else {
                        showError("Did not find anything!");
                        input.value = "";
                        foods.innerHTML = "";
                    }           
                });
        } else {
            showError("You did not write anything!");
        }    
    } else {
        showError("Please make sure you are connected to Internet!");
    }
});