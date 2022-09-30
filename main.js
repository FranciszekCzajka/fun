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

    const nutrients = [
        { name: "Energy", amount: food.energy.toFixed(0) },
        { name: "Carbohydrates", amount: food.carbohydrates.toFixed(2) },
        { name: "Sugars", amount: food.sugars.toFixed(2) },
        { name: "Protein", amount: food.protein.toFixed(2) },
        { name: "Fats", amount: food.fats.toFixed(2) },
        { name: "Fiber", amount: food.fiber.toFixed(2) },
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

    const button = document.createElement("button");
    button.innerText = "Add to calculator";
    button.className = "add-to-calculator";
    results.append(button);
}

function createFood() {
    let arrFoods = [];
    let idCounter = 0;

    function extractValues(foodObject, multiplier) {
        return (values = [
            foodObject.name,
            (foodObject.energy * multiplier).toFixed(0),
            (foodObject.carbohydrates * multiplier).toFixed(2),
            (foodObject.sugars * multiplier).toFixed(2),
            (foodObject.protein * multiplier).toFixed(2),
            (foodObject.fats * multiplier).toFixed(2),
            (foodObject.fiber * multiplier).toFixed(2),
            (foodObject.amount * multiplier).toFixed(2),
        ]);
    }

    function sumNutrients() {
        const sumOfNutrients = [];
        const sum = [];
        const valuesLines = document.querySelectorAll(".calculator-table-row");

        for (let i = 1; i < valuesLines.length; i++) {
            const tempValues = valuesLines[i].innerText.split("\n");
            const cells = valuesLines[i].querySelectorAll(".calculator-cell");
            const lastLine = cells[cells.length - 1];
            const input = lastLine.querySelector("input");
            for (let j = 1; j < tempValues.length; j++) {
                tempValues[j] = Number(tempValues[j]);
            }
            tempValues.push(Number(input.value));
            sum.push(tempValues);
        }

        if (sum.length) {
            for (let i = 0; i < sum.length; i++) {
                for (let j = 0; j < sum[i].length; j++) {
                    if (j === 0) {
                        sumOfNutrients[j] = "Sum";
                    } else if (j === 1) {
                        sumOfNutrients[j] =
                            (sumOfNutrients[j] || 0) + sum[i][j];
                    } else {
                        sumOfNutrients[j] = Number(sumOfNutrients[j]);
                        sumOfNutrients[j] =
                            (sumOfNutrients[j] || 0) + sum[i][j];
                        sumOfNutrients[j] = sumOfNutrients[j].toFixed(2);
                    }
                }
            }
        } else {
            for (i = 0; i < 8; i++) {
                if (i === 0) {
                    sumOfNutrients[i] = "Sum";
                } else {
                    sumOfNutrients[i] = 0;
                }
            }
        }

        function nextInLine() {
            let counter = 0;
            function onlyOne(valueOfIndex) {
                const varI = valueOfIndex[counter];
                counter++;
                if (counter === 9) {
                    counter = 0;
                }
                return varI;
            }

            return onlyOne;
        }

        const oneAtATime = nextInLine();

        const sumCulumn = document.querySelector(".calculator-table-row-sum");
        const sumColumnValues = sumCulumn.querySelectorAll(
            ".calculator-table-header"
        );
        sumColumnValues.forEach((element) => {
            element.innerText = oneAtATime(sumOfNutrients);
        });
    }

    function changeValues(foodObject, tableRow, tableCellInput) {
        const newValues = extractValues(foodObject, tableCellInput.value / 100);

        const createdCells = tableRow.querySelectorAll(".calculator-cell");

        for (let i = 1; i < createdCells.length - 1; i++) {
            createdCells[i].innerText = newValues[i];
        }

        sumNutrients();
    }

    function addToCalculator(foodObject) {
        const values = extractValues(foodObject, 1);

        const calculator = document.querySelector(".table-body");
        const tableRow = document.createElement("tr");
        tableRow.className = "calculator-table-row";
        for (let i = 0; i < values.length - 1; i++) {
            const tableCell = document.createElement("td");
            tableCell.className = "calculator-cell";
            tableCell.innerText = values[i];
            tableRow.append(tableCell);
        }
        const tableCell = document.createElement("td");
        const tableCellInput = document.createElement("input");
        tableCellInput.type = "number";
        tableCell.className = "calculator-cell";
        tableCellInput.value = values[7];
        tableCellInput.addEventListener("keyup", () => {
            changeValues(foodObject, tableRow, tableCellInput);
        });
        const tableCellX = document.createElement("i");
        tableCellX.className = "fa-solid fa-trash-can trash-can";
        tableCellX.addEventListener("click", function () {
            tableRow.remove();
            foodObject.delete();
            sumNutrients();
        });
        tableCell.append(tableCellInput);
        tableCell.append(tableCellX);
        tableRow.append(tableCell);
        calculator.appendChild(tableRow);
        sumNutrients();
    }

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
            this.amount = 100;
        }
        add() {
            arrFoods[idCounter] = this;
            idCounter++;
            addToCalculator(this);
        }
        delete() {
            arrFoods.splice(arrFoods.indexOf(this), 1);
        }
    }

    return FoodCreator;
}

const myNewFood = createFood();

button.addEventListener("click", function () {
    const results = document.querySelector(".results");
    results.innerHTML = "";

    const API_KEY = "Pv5tp3ouhHnI2AHNO7VLPUlDVRaGdAdQftXvxLAK";
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
            const foodsList = document.createElement("ul");
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
                    displayNutrients(food);
                    const buttonToAdd =
                        document.querySelector(".add-to-calculator");
                    buttonToAdd.addEventListener("click", () => food.add());
                }
            });
        });
});
