$(function (){

    var list = $('.list');
    var results = $('.results-names');
    
    function specificFoodInfo(ID) {
        list.empty();
        $.ajax({
            type: 'GET',
            url: 'https://api.nal.usda.gov/fdc/v1/food/' + ID + '?nutrients=https://api.nal.usda.gov/fdc/v1/food/1102644?nutrients=208&nutrients=203&nutrients=204&nutrients=205&nutrients=291&nutrients=269&api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8&nutrients=201&nutrients=202&nutrients=203&nutrients=204&nutrients=205&nutrients=206&nutrients=207&nutrients=208&nutrients=209&nutrients=210&api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8',
            success: function(data) {
                console.log(data);
                list.append('<h1>Food: ' + data.description + '</h1>');
                list.append('<ul class="nutrients"></ul>');
                var nutrients = $('.nutrients');
                nutrients.append('<li>' + data.foodNutrients[0].nutrient.name + " " + data.foodNutrients[0].amount + " " + data.foodNutrients[0].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[1].nutrient.name + " " + data.foodNutrients[1].amount + " " + data.foodNutrients[1].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[2].nutrient.name + " " + data.foodNutrients[2].amount + " " + data.foodNutrients[2].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[3].nutrient.name + " " + data.foodNutrients[3].amount + " " + data.foodNutrients[3].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[4].nutrient.name + " " + data.foodNutrients[4].amount + " " + data.foodNutrients[4].nutrient.unitName + '</li>');
                nutrients.append('<li>' + data.foodNutrients[5].nutrient.name + " " + data.foodNutrients[5].amount + " " + data.foodNutrients[5].nutrient.unitName + '</li>');
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