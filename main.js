const button = document.querySelector(".submit");
const input = document.querySelector(".input");

function addRow(key, amount, unit) {
    const tableRowInfo = [key, amount, unit];
    const tableRow = document.createElement("tr");
    tableRow.className = "nutrients-row-information";

    for (i = 0; i < 3; i++) {
        const tableCellName = document.createElement("td");
        tableCellName.className = "nutrients-cell";
        tableCellName.innerText = tableRowInfo[i];
        tableRow.appendChild(tableCellName);
    }
    return tableRow;
}

function displayNutrients(food) {
    const results = document.querySelector(".results");

    const foodName = document.createElement("h3");
    foodName.className = "food-name";
    foodName.innerText = food.name;
    results.appendChild(foodName);

    const table = document.createElement("table");
    table.className = "nutrients-table";
    results.appendChild(table);

    const headers = ["Name", "Amount per 100g", "Unit"];

    const tableHeadersRow = document.createElement("tr");
    tableHeadersRow.className = "nutrients-row-headers";

    for (let i = 0; i < 3; i++) {
        const tableHeader = document.createElement("th");
        tableHeader.className = "nutrients-header";
        tableHeader.innerText = headers[i];
        tableHeadersRow.appendChild(tableHeader);
    }

    table.appendChild(tableHeadersRow);

    console.log(food);

    const nutrients = [
        { name: "Energy", amount: food.energy },
        { name: "Carbohydrates", amount: food.carbohydrates },
        { name: "Sugars", amount: food.sugars },
        { name: "Protein", amount: food.protein },
        { name: "Fats", amount: food.fats },
        { name: "Fiber", amount: food.fiber },
        {},
    ];

    for (let i = 0; i < 6; i++) {
        if (i === 0) {
            const tableRow = addRow(
                nutrients[i].name,
                nutrients[i].amount,
                "Kcal"
            );
            table.appendChild(tableRow);
        } else {
            const tableRow = addRow(
                nutrients[i].name,
                nutrients[i].amount,
                "g"
            );
            table.appendChild(tableRow);
        }
    }

    const tableRow = addRow("Carbohydrates", food.carbohydrates, "g");
}

function createFood() {
    const arrFoods = [];

    let idCounter = 0;

    class FoodCreator {
        constructor(foodObject) {
            this.id = idCounter;
            this.name = foodObject.description;
            this.energy = foodObject.foodNutrients[3].value;
            this.protein = foodObject.foodNutrients[0].value;
            this.fats = foodObject.foodNutrients[1].value;
            this.carbohydrates = foodObject.foodNutrients[2].value;
            this.sugars = foodObject.foodNutrients[8].value;
            this.fiber = foodObject.foodNutrients[9].value;
        }
        add() {
            arrFoods[idCounter] = this;
            idCounter++;
        }
    }
    return FoodCreator;
}

const myNewFood = createFood();

button.addEventListener("click", function () {
    const results = document.querySelector(".results");
    results.innerHTML = "";

    const API_KEY = process.env.API_KEY;
    const API_URL = "https://api.nal.usda.gov";
    const FOOD_URL = `${API_URL}/fdc/v1/foods/search?query=${input.value}&dataType=Survey%20%28FNDDS%29&pageSize=10&pageNumber=1&sortBy=dataType.keyword&api_key=${API_KEY}`;

    const promise = fetch(FOOD_URL);

    promise
        .then(function (response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function (processedResponse) {
            const foodsResponse = processedResponse.foods;
            const foods = processedResponse.foods.map(function (food) {
                return food.description;
            });
            const foodsList = document.createElement("ol");
            foodsList.className = "food-list";
            results.appendChild(foodsList);
            const foodList = document.querySelector(".food-list");
            foods.map((food) => {
                const listElement = document.createElement("li");
                listElement.className = "food-list-element";
                listElement.innerText = food;
                foodList.append(listElement);
            });

            foodList.addEventListener("click", function (foodFromList) {
                input.value = "";
                results.innerHTML = "";
                if (foodFromList.target.tagName == "LI") {
                    const food = new myNewFood(
                        foodsResponse[
                            foods.indexOf(foodFromList.target.innerText)
                        ]
                    );
                    food.add();
                    displayNutrients(food);
                }
            });
        });
});
