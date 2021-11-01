const button = document.querySelector('.submit');
let input = document.querySelector('.input');
const foodsInCalcUnchanged = [];
const foodsInCalcChanged = [];

function countNutrients() {
    const nutrientsSum = ["name", 0, 0, 0, 0, 0, 0, 0];
    for(let i = 0; i < foodsInCalcChanged.length; i++) {
        for(let j = 1; j < foodsInCalcChanged[i].length; j++) {
            nutrientsSum[j] = (foodsInCalcChanged[i][j] + nutrientsSum[j]);
        }
    }
    changeSum(nutrientsSum);
}

function changeSum(nutrientsSum) {
    let row = document.querySelectorAll(".calculator-table-row");
    row = row[row.length - 1];

    const headers = row.querySelectorAll(".calculator-table-header");
   
    for(let i = 1; i < headers.length; i++) {
        if(i == 1) {
            headers[i].innerText = nutrientsSum[i].toFixed(0);

        } else {
            headers[i].innerText = nutrientsSum[i].toFixed(2);
        }
    }
    
}

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

function deleteNutritionRow(rowId) {
    foodsInCalcUnchanged.splice(rowId, 1);
    foodsInCalcChanged.splice(rowId, 1);
    const tableBody = document.querySelector(".table-body");
    rows = tableBody.querySelectorAll("tr");
    howManyRows = rows[rows.length - 1].className.replace(/[^0-9]/g,'');
    rowToDelete = document.querySelector(`.table-row-${rowId}`);
    rowToDelete.remove();
    for(let i = rowId + 1; i <= howManyRows; i++) {
        const changingRow = tableBody.querySelector(`.table-row-${i}`);
        const tdWithDelete = changingRow.querySelector(".table-cell-8");
        const input = tdWithDelete.querySelector(`.input-${i}`);
        const deleteThisRow = tdWithDelete.querySelector(`.delete-${i}`);
        changingRow.className = `table-row-${i - 1}`;
        input.className = `input-${i - 1}`;
        deleteThisRow.className = `fas fa-times delete-${i - 1}`;
    }    
    countNutrients();
}

function changeNutritionAmounts(rowId, currentInput) {
    const currentRow = document.querySelector(`.table-row-${rowId}`);

    const currentUnchanged = foodsInCalcUnchanged[rowId];
    const currentChanged = foodsInCalcChanged[rowId];

    currentInput.addEventListener('keyup', function() {
        
        for(let i = 1; i < currentChanged.length; i++) {
            const currentCell = currentRow.querySelector(`.table-cell-${i}`);
            currentChanged[i] = (currentUnchanged[i] / 100) * currentInput.value;
            if(i == 1) {
                currentCell.innerText = currentChanged[i].toFixed(0);
            } else {
                currentCell.innerText = currentChanged[i].toFixed(2);
            }
        }
        countNutrients();
    });
}

function addToCalculator(foodToCalc) {
        
    foodsInCalcUnchanged.push(foodToCalc.slice());
    foodsInCalcChanged.push(foodToCalc.slice());

    const whereAmI = foodsInCalcUnchanged.length - 1;
    
    tableBody = document.querySelector(".table-body");
    tableRow = document.createElement("tr");
    tableRow.className = `table-row-${whereAmI}`;

    for(let i = 0; i < foodsInCalcChanged[whereAmI].length; i++) {
        const tableCell = document.createElement("td");
        tableCell.className = `table-cell-${i}`;
        tableCell.innerText = foodsInCalcUnchanged[whereAmI][i];
        tableRow.append(tableCell);
    }    
    
    const tableCell = document.createElement("td");
    const input = document.createElement("input");
    tableCell.className = "table-cell-8";
    input.type = "number";
    input.className = `input-${whereAmI}`;
    input.value = 100;
    const deleteRow = document.createElement("i");
    deleteRow.className = `fas fa-times delete-${whereAmI}`;
    deleteRow.style.marginLeft = "8px";
    tableCell.append(input);
    tableCell.append(deleteRow);
    tableRow.append(tableCell);

    tableBody.append(tableRow);

    deleteRow.addEventListener('click', function() {
        deleteNutritionRow(Number(this.className.replace(/[^0-9]/g,'')));
    });

    input.addEventListener('focus', function() {
        changeNutritionAmounts(Number(this.className.replace(/[^0-9]/g,'')), input);
    });

    countNutrients();
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
            Number(foodObject[0].energy), 
            Number(foodObject[1].protein), 
            Number(foodObject[2].fats), 
            Number(foodObject[3].carbohydrates),
            Number(foodObject[4].sugars),
            Number(foodObject[5].fiber),
            100
        ];
                
        addToCalculator(foodToCalc);
    });
}

function manageCalcPopUp() {
    const calculator = document.querySelector(".calculator");
    const calcOpen = document.querySelector(".calculator-open");
    const calcTableHeight = document.querySelector(".calculator-table").clientHeight;
    calculator.style.bottom = `-${calcTableHeight - 45}px`;
    calcOpen.addEventListener('click', function(){
        if(calcOpen.innerText == "Open calculator!") {
            calculator.style.bottom = "0";
            calcOpen.innerHTML = "Close calculator!<i class='fas fa-calculator'></i>";
        } else {
            calculator.style.bottom = `-${calcTableHeight - 45}px`;
            calcOpen.innerHTML = "Open calculator!<i class='fas fa-calculator'></i>";
        }
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
        
                        const foodsList = document.createElement("ol");
                        foodsList.className = "results-list";
                        foods.appendChild(foodsList);
        
                        for (let i = 0; i < processedResponse.foods.length; i++) {
                            const food = document.createElement("li");
                            food.innerText = processedResponse.foods[i].description;
                            food.className = "result";
                            food.tabIndex = 0;
                            food.value = i;
                            foodsList.appendChild(food);
                        }

                        foodsList.addEventListener('click', function(event) {
                            if (event.target.tagName == "LI") {
                                input.value = "";
                                foods.innerHTML = "";
                                const foodObject = [
                                    {"energy": processedResponse.foods[event.target.value].foodNutrients[3].value},
                                    {"protein": processedResponse.foods[event.target.value].foodNutrients[0].value.toFixed(2)},
                                    {"fats": processedResponse.foods[event.target.value].foodNutrients[1].value.toFixed(2)},
                                    {"carbohydrates": processedResponse.foods[event.target.value].foodNutrients[2].value.toFixed(2)},
                                    {"sugars": processedResponse.foods[event.target.value].foodNutrients[8].value.toFixed(2)},
                                    {"fiber": processedResponse.foods[event.target.value].foodNutrients[9].value.toFixed(2)},
                                    {"name": processedResponse.foods[event.target.value].description}
                                ];                                 
                                displayNutrients(foodObject);
                                const wasOpened = document.querySelector(".calculator").style.bottom;
                                if(wasOpened) {
                                    
                                } else {
                                    manageCalcPopUp();                                    
                                }
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