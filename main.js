$(function (){

    var results = $('.results');
    
    function specificFoodInfo(ID) {
        $.ajax({
            type: 'GET',
            url: 'https://api.nal.usda.gov/fdc/v1/food/' + ID + '?nutrients=203&nutrients=204&nutrients=205&nutrients=208&nutrients=291&nutrients=269&api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8',
            success: function(data) {
                results.append('<h3 class="food-name">Food: ' + data.description + '</h3>');
                results.append('<table class="nutrients"></table>');
                var nutrients = $('.nutrients');
                nutrients.append('<tr class="nutrients-row"><th class="nutrients-header">' + 'Name' + '</th><th class="nutrients-header">' + 'Amount' + '</th><th class="nutrients-header">' + 'Unit' + '</th></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[0].nutrient.name + '</td><td class="nutrients-cell">' + data.foodNutrients[0].amount + '</td><td class="nutrients-cell unit">' + data.foodNutrients[0].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[1].nutrient.name + '</td><td class="nutrients-cell">' + data.foodNutrients[1].amount + '</td><td class="nutrients-cell unit">' + data.foodNutrients[1].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[2].nutrient.name + '</td><td class="nutrients-cell">' + data.foodNutrients[2].amount + '</td><td class="nutrients-cell unit">' + data.foodNutrients[2].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + 'Carbohydrates' + '</td><td class="nutrients-cell">' + data.foodNutrients[3].amount + '</td><td class="nutrients-cell unit">' + data.foodNutrients[3].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + 'Sugars' + '</td><td class="nutrients-cell">' + data.foodNutrients[5].amount + '</td><td class="nutrients-cell unit">' + data.foodNutrients[5].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[4].nutrient.name + '</td><td class="nutrients-cell">' + data.foodNutrients[4].amount + '</td><td class="nutrients-cell unit">' + data.foodNutrients[4].nutrient.unitName + '</td></tr>');
            }
        });
    }
    $(".submit").click(function() {
        if($(".input").val().length > 0) {
            var input = $(".input").val();
            if($(".food-title").length) {
                $(".food-title").remove();
                $(".nutrients").remove();
            }
        }
        $.ajax({                
            type: 'GET',
            input: {"data": input},
            url: 'https://api.nal.usda.gov/fdc/v1/foods/search?query=' + input + '&dataType=Survey%20%28FNDDS%29&pageSize=200&pageNumber=1&sortBy=dataType.keyword&api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8',
            success: function(data) {
                results.empty();
                results.append('<ul class="results-list"></ul>');
                var resultsList = $('.results-list');

                for(var counter = 0; counter < 10; counter++) {
                    resultsList.append('<li class="result" value="' + counter + '">' + data.foods[counter].description + '</li>');
                }

                $(".result").click(function() {
                    results.empty();
                    var temp = $(this).val();
                    specificFoodInfo(data.foods[temp].fdcId);
                });
            }
        });                
    });
});