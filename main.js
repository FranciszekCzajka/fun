const button = document.querySelector('.submit');
let input = document.querySelector('.input');

function displayNutrients(foodDescription, foodEnergy, foodProtein, foodFats, foodCarbohydrates, foodSugars, foodFiber) {

    const foods = document.querySelector(".results");

    const foodName = document.createElement("h3");
    foodName.className = "food-name";
    foodName.innerText = foodDescription;
    foods.appendChild(foodName);
    const nutrientsTable = document.createElement("table");
    nutrientsTable.className = "nutrients";
    foods.appendChild(nutrientsTable);

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

    for(let i = 0; i < 6; i++) {
        const tableRow = document.createElement("tr");
        tableRow.className = "nutrients-row";
        nutrientsTable.appendChild(tableRow);
        
        const tableNutrientsNames = ["Energy", "Protein", "Fats", "Carbohydrates", "Sugars", "Fiber"];
        const foodNutrients = [foodEnergy, foodProtein, foodFats, foodCarbohydrates, foodSugars, foodFiber];

        for(let j = 0; j < 3; j++) {
            const tableCell = document.createElement("td");

            if (j == 0) {
                tableCell.className = "nutrients-cell";
                tableCell.innerText = tableNutrientsNames[i];
            } else if (j == 1) {
                tableCell.className = "nutrients-cell nutrients-cell-amount";
                if (i != 0) {
                    tableCell.innerText = foodNutrients[i].toFixed(1);  
                } else {                    
                    tableCell.innerText = foodNutrients[i];  
                }
            } else {
                tableCell.className = "nutrients-cell nutrients-cell-unit";
                if (i == 0) {
                    tableCell.innerText = "kcal";
                } else {
                    tableCell.innerText = "g";
                }
            }            
            tableRow.appendChild(tableCell);
        }
    }    
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

            let i = 0;

            while(processedResponse.foods[i]) {
                const food = document.createElement("li");
                food.innerText = processedResponse.foods[i].description;
                food.className = "result animation-fade-in";
                food.tabIndex = i;
                foodsList.appendChild(food);
                i += 1;
            }

            i = 0;

            //Event Delegation

            foodsList.addEventListener('click', function(event) {                    
                input.value = "";
                foods.innerHTML = "";
                if (event.target.tagName == "LI") {
                    displayNutrients(
                        processedResponse.foods[event.target.tabIndex].description,
                        processedResponse.foods[event.target.tabIndex].foodNutrients[3].value,
                        processedResponse.foods[event.target.tabIndex].foodNutrients[0].value,
                        processedResponse.foods[event.target.tabIndex].foodNutrients[1].value,
                        processedResponse.foods[event.target.tabIndex].foodNutrients[2].value,
                        processedResponse.foods[event.target.tabIndex].foodNutrients[8].value,
                        processedResponse.foods[event.target.tabIndex].foodNutrients[9].value,
                    );
                }
            });            
        });
});


