const button = document.querySelector('.submit');
let input = document.querySelector('.input');

function displayNutrients(foodID) {
    const API_KEY = "nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8";
    const API_URL = "https://api.nal.usda.gov";
    const NUTRIENTS_URL = `${API_URL}/fdc/v1/food/${foodID}?nutrients=203&nutrients=204&nutrients=205&nutrients=208&nutrients=291&nutrients=269&api_key=${API_KEY}`;
    
    const promise = fetch(NUTRIENTS_URL);
    const foods = document.querySelector(".results");

    promise
        .then(function(response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function(processedResponse) {
            const foodName = document.createElement("h3");
            foodName.className = "food-name";
            foodName.innerText = processedResponse.description;
            foods.appendChild(foodName);
            const nutrientsTable = document.createElement("table");
            nutrientsTable.className = "nutrients";
            foods.appendChild(nutrientsTable);

            const arrHeaders = ["Name", "Amount per 100g", "Unit"];

            const tableHeadersRow = document.createElement("tr");
            tableHeadersRow.className = "nutrients-row";

            for(let i = 0; i < 3; i++) {
                const tableHeader = document.createElement("th");
                tableHeader.className = "nutrients-header";
                tableHeader.innerText = arrHeaders[i];
                tableHeadersRow.appendChild(tableHeader);
            }

            nutrientsTable.appendChild(tableHeadersRow);

            for(let i = 0; i < 6; i++) {
                const arrNutrients = [processedResponse.foodNutrients[i].nutrient.name, processedResponse.foodNutrients[i].amount, processedResponse.foodNutrients[i].nutrient.unitName]
                const tableRow = document.createElement("tr");
                tableRow.className = "nutrients-row";
                nutrientsTable.appendChild(tableRow);

                for(let j = 0; j < 3; j++) {
                    const tableCell = document.createElement("td");

                    if (arrNutrients[j] == "Sugars, total including NLEA") {
                        arrNutrients[j] = "Sugars";
                    } else if (arrNutrients[j] == "Carbohydrate, by difference") {
                        arrNutrients[j] = "Carbohydrates";
                    }
                    if (j == 1) {                        
                        tableCell.className = "nutrients-cell nutrients-cell-amount";
                        if (i > 0) {
                            arrNutrients[j] = arrNutrients[j].toFixed(2)
                            tableCell.innerText = arrNutrients[j];
                        }
                    } else if (j == 2) {
                        tableCell.className = "nutrients-cell nutrients-cell-unit";
                    } else {
                        tableCell.className = "nutrients-cell";
                    }

                    tableCell.innerText = arrNutrients[j];
                    tableRow.appendChild(tableCell)
                }
            }
        });
}

button.addEventListener('click', function() {
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
            foods.innerHTML = "";

            const foodsList = document.createElement("ul");
            foodsList.className = "results-list";
            foods.appendChild(foodsList);

            for(let i = 0; i < 10; i++) {
                const food = document.createElement("li");
                food.innerText = processedResponse.foods[i].description;
                food.className = "result animation-fade-in";
                food.value = i;
                food.tabIndex = i;
                foodsList.appendChild(food);
            }

            // Second method

            /*for(let particularFood of processedResponse.foods) { 
                console.log(particularFood);
                const food = document.createElement("li");
                food.innerText = particularFood.description;
                food.className = "result animation-fade-in";
                food.value = 1;
                food.tabIndex = 1;
                foodsList.appendChild(food);
            }*/

            //Event Delegation

            foodsList.addEventListener('click', function(event) {
                if (event.target.tagName == "LI") {
                    input.value = "";
                    foods.innerHTML = "";
                    displayNutrients(processedResponse.foods[event.target.value].fdcId);
                }
            });

            // Second method with forEach

            /*results = document.querySelectorAll(".result");

            results.forEach(function (particularFood) {
                particularFood.addEventListener('click', function () {
                    foods.innerHTML = "";
                    displayNutrients(processedResponse.foods[particularFood.value].fdcId);
                });
            });*/
            
        });
});


