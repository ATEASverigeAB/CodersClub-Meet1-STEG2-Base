/* vote.js
Custom js to handle validation and submit of votes

 */

$(function () {
    $("#saveButton").on('click', function () {
        console.log(Number($('form').serializeArray()[0].value));
        if($('form').serializeArray()[0].value >0){
            $('form').submit();
            $('#errorMessage').text('');
        }
        else {
            $('#errorMessage').text("Ange betyg!");
        }
    });
});