function log(message, data) {
    console.log(new Date().toString() + ":" + message);
    if (typeof data === "object") {
        console.dir(data);
        //JSON.stringify(data);
    }
}

function getAJAXSettings(url) {
    //Configure mocks
    var useMockData = true;
    var limitResultCount = true;

    //Main logic
    var settings = {
        data: {
            Accept: 'application/json'
        },
        dataType: 'json'
    }

    if (useMockData) {
        //Use a local mock file rather than the live SmugMug API
        pattern = /SmugMug/ig;
        if (pattern.test(url)) {
            settings.url = 'data/mockSmugMugNodesSmall.json';
        }
    } else {
        if (limitResultCount) {
            var pattern = /count%22%3A\d+%/g;
            var newUrl = url.replace(pattern, "count%22%3A" + 4 + "%");
            settings.url = newUrl;
        }

        var myAPIKey = getAPIKey();
        settings.data.APIKey = myAPIKey;
    }

    log("getAJAXSettings: " + url, settings);
    return settings;
}

function getData(url) {
    var settings = getAJAXSettings(url);

    return $.ajax(settings)
        .fail(function (jqXHR, textStatus, errorThrown) {
            var errorMessage = 'getData textStatus: ' + textStatus;
            errorMessage += '. jqXHR.status: ' + jqXHR.status;
            if (jqXHR.status === 404) {
                errorMessage += ". The requested page not found.";
            }
            log(errorMessage);
        })
        .always(function (data, textStatus, b) {
            //log("getData" + url, data);
        });
}