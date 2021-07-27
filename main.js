$(function (){

    const results = $('.results');

    function error(errorText) {
        const landing = $('.landing');
        landing.after('<div class="connection-error"></div>')
        const connectionError = $('.connection-error');
        connectionError.append('<div class="connection-modal"></div>');
        const connectionModal = $('.connection-modal');
        connectionModal.append('<div class="connection-header"></div>');
        connectionModal.append('<div class="connection-message"><h4>' + errorText + '</h4></div>');
        const connectionHeader = $('.connection-header');
        connectionHeader.append('<div class="connection-header-left">Error!</div><div class="connection-header-right"><div class="connection-x"><i class="fas fa-times"></i></div></div>');
        $('.connection-x').click(function() {
            connectionError.remove();
        });
    }
    
    function specificFoodInfo(ID) {
        results.empty();
        $.ajax({
            type: 'GET',
            url: 'https://api.nal.usda.gov/fdc/v1/food/' + ID + '?nutrients=203&nutrients=204&nutrients=205&nutrients=208&nutrients=291&nutrients=269&api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8',
            success: function(data) {
                results.append('<h3 class="food-name">Food: ' + data.description + '</h3>');
                results.append('<table class="nutrients"></table>');
                const nutrients = $('.nutrients');
                nutrients.append('<tr class="nutrients-row"><th class="nutrients-header">' + 'Name' + '</th><th class="nutrients-header">' + 'Amount (per 100g)' + '</th><th class="nutrients-header">' + 'Unit' + '</th></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[0].nutrient.name + '</td><td class="nutrients-cell nutrients-cell-amount">' + data.foodNutrients[0].amount + '</td><td class="nutrients-cell nutrients-cell-unit">' + data.foodNutrients[0].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[1].nutrient.name + '</td><td class="nutrients-cell nutrients-cell-amount">' + parseFloat(data.foodNutrients[1].amount).toFixed(2) + '</td><td class="nutrients-cell nutrients-cell-unit">' + data.foodNutrients[1].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[2].nutrient.name + '</td><td class="nutrients-cell nutrients-cell-amount">' + parseFloat(data.foodNutrients[2].amount).toFixed(2) + '</td><td class="nutrients-cell nutrients-cell-unit">' + data.foodNutrients[2].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + 'Carbohydrates' + '</td><td class="nutrients-cell nutrients-cell-amount">' + parseFloat(data.foodNutrients[3].amount).toFixed(2) + '</td><td class="nutrients-cell nutrients-cell-unit">' + data.foodNutrients[3].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + 'Sugars' + '</td><td class="nutrients-cell nutrients-cell-amount">' + parseFloat(data.foodNutrients[5].amount).toFixed(2) + '</td><td class="nutrients-cell nutrients-cell-unit">' + data.foodNutrients[5].nutrient.unitName + '</td></tr>');
                nutrients.append('<tr class="nutrients-row"><td class="nutrients-cell">' + data.foodNutrients[4].nutrient.name + '</td><td class="nutrients-cell nutrients-cell-amount">' + parseFloat(data.foodNutrients[4].amount).toFixed(2) + '</td><td class="nutrients-cell nutrients-cell-unit">' + data.foodNutrients[4].nutrient.unitName + '</td></tr>');
            }
        });
    }
    
    $(".submit").click(function() {
        if($(".input").val().length > 0) {
            let input = $(".input").val();
            if (!input.replace(/\s/g, '').length) {   
                let errorText = 'You only pressed spacebar!';
                error(errorText);
            }
            else {
                $.ajax({                
                    type: 'GET',
                    input: {"data": input},
                    url: 'https://api.nal.usda.gov/fdc/v1/foods/search?query=' + input + '&dataType=Survey%20%28FNDDS%29&pageSize=200&pageNumber=1&sortBy=dataType.keyword&api_key=nBKTTixEru2BA0nzf0DBnapEY5Tc6iERJ3lXpUU8',
                    success: function(data) {
                        results.empty();
                        results.append('<ul class="results-list"></ul>');
                        const resultsList = $('.results-list');
                        if(data.foods.length === 0) {
                            let errorText = 'Did not find any results!';
                            error(errorText);                            
                        }
                        for(let i = 0; i < 10; i++) {
                            resultsList.append('<li class="result" value="' + i + '">' + data.foods[i].description + '</li>');
                        }
        
                        $(".result").click(function() {
                            let particularFoodId = $(this).val();
                            specificFoodInfo(data.foods[particularFoodId].fdcId);
                        });
                    },
                    error: function() {
                        let errorText = 'Could not connect to the server!';
                        error(errorText);
                    }
                }); 
            }
        }
        else {
                let errorText = 'You did not write anything in searchbar!';
                error(errorText);
        }               
    });
});