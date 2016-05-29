function log (message) {
    console.log(new Date().toString() + ":" + message);
}

var getData = function(dataUrl) {
    return $.ajax({
        data: {
            APIKey: myAPIKey,
            Accept: 'application/json',
        },
        dataType: 'json',
        url: dataUrl
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        log(textStatus + ': ' + errorThrown);
    })
    .always(function(a, textStatus, b) {
        console.dir(a);
        log("getData end");
    })
    ;
};