const button = document.querySelector(".submit");
const input = document.querySelector(".input");

function displayNutrients(food, results) {
    results.innerHTML = "";
    console.log(food);
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
            arrFoods.push(this);
            idCounter++;
        }
    }
    return FoodCreator;
}

const myNewFood = createFood();

button.addEventListener("click", function () {
    const API_KEY = "nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8";
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
            const foodList = document.querySelector(".food-list");
            const results = document.querySelector(".results");
            foodList.innerHTML = "";
            foods.forEach((food) => {
                const listElement = document.createElement("li");
                listElement.className = "food-list-element";
                listElement.innerText = food;
                foodList.append(listElement);
            });

            foodList.addEventListener("click", function (foodFromList) {
                if (foodFromList.target.tagName == "LI") {
                    const food = new myNewFood(
                        foodsResponse[
                            foods.indexOf(foodFromList.target.innerText)
                        ]
                    );
                    food.add();
                    displayNutrients(food, results);
                }
            });
        });
});
