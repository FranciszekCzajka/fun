$(function (){

    var list = $('.list');
    var results = $('.results-names');
    
    function specificFoodInfo(ID) {
        list.empty();
        $.ajax({
            type: 'GET',
            url: 'https://api.nal.usda.gov/fdc/v1/food/' + ID + '%20?api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8',
            success: function(data) {
                list.append('<h1>Food: ' + data.description + '</h1>');
                list.append('<ul class="nutrients"></ul>');
                var nutrients = $('.nutrients');
                nutrients.append('<li>' + data.foodNutrients[2].nutrient.name + " " + data.foodNutrients[2].amount + " " + data.foodNutrients[2].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[4].nutrient.name + " " + data.foodNutrients[4].amount + " " + data.foodNutrients[4].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[5].nutrient.name + " " + data.foodNutrients[5].amount + " " + data.foodNutrients[5].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[8].nutrient.name + " " + data.foodNutrients[8].amount + " " + data.foodNutrients[8].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[10].nutrient.name + " " + data.foodNutrients[10].amount + " " + data.foodNutrients[10].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[9].nutrient.name + " " + data.foodNutrients[9].amount + " " + data.foodNutrients[9].nutrient.unitName + '</li>');
            }
        });
    }
    $(".submit").click(function() {
        list.empty();
        var input = $(".input").val();
        $.ajax({                
            type: 'GET',
            input: {"data": input},
            url: 'https://api.nal.usda.gov/fdc/v1/foods/search?query=' + input + '&dataType=Survey%20%28FNDDS%29&pageSize=200&pageNumber=1&sortBy=dataType.keyword&api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8',
            success: function(data) {
                results.empty();

                for(var counter = 0; counter < 10; counter++) {
                    results.append('<li class="result" value="' + counter + '">' + data.foods[counter].description + '</li>');
                }

                $(".result").click(function() {
                    var temp = $(this).val();
                    results.empty();
                    specificFoodInfo(data.foods[temp].fdcId);
                });
            }
        });                
    });
});