$("#open-button").click(function(){
    $.get("/open", function(data, status){
        return true;
    });
});