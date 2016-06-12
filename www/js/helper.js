function log(message) {
    console.log(new Date().toString() + ":" + message);
}

//Replace the input url with a mock one
function mockUrl(url) {
    var newUrl = url;

    if (true) {
        var pattern = /count%22%3A\d+%/g;
        newUrl = url.replace(pattern, "count%22%3A" + 4 + "%");
        log("mockUrl: " + newUrl);
    }

    if (false) {
        //Repoint SmugMug
        pattern = /SmugMug/ig;
        if (pattern.test(url)) {
            newUrl = 'data/mockSmugMugNodesSmall.json';
        }
        log("mockUrl: " + newUrl);
    }

    return newUrl;
}

function getData(url) {
    log("getData: " + url);

    var myAPIKey = getAPIKey();
    var dataUrl = mockUrl(url);

    return $.ajax({
            data: {
                APIKey: myAPIKey,
                Accept: 'application/json',
            },
            dataType: 'json',
            url: dataUrl
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            var errorMessage = 'getData textStatus: ' + textStatus;
            errorMessage += '. jqXHR.status: ' + jqXHR.status;
            if (jqXHR.status === 404) {
                errorMessage += ". The requested page not found.";
            }
            log(errorMessage);

        })
        .always(function (data, textStatus, b) {
            //console.dir(data);
            //console.log(JSON.stringify(data));
            //log("getData end");
        });
}