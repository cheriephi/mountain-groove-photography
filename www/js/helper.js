function log(message, data) {
    console.log(new Date().toString() + ":" + message);
    if (typeof data === "object") {
        console.dir(data);
        //console.log(JSON.stringify(data));
    }
}

function getAJAXSettings(url) {
    //Configure mocks
    var useMockData = false;
    var limitResultCount = true;

    //Main logic
    var settings = {
        data: {},
        dataType: 'json'
    }
    var myAPIKey = getAPIKey();

    if (useMockData) {
        //Use a local mock file rather than the live SmugMug API
        pattern = /SmugMug.*Node/ig;
        if (pattern.test(url)) {
            settings.url = 'data/mockSmugMugNodesSmall.json';
        }
        pattern = /SmugMug.*Album/ig;
        if (pattern.test(url)) {
            settings.url = "data/mockSmugMugAlbumImagesSmall.json";
        }
    } else {
        if (limitResultCount) {
            var pattern = /count%22%3A\d+%/g;
            var newUrl = url.replace(pattern, "count%22%3A" + 3 + "%");
            settings.url = newUrl;
        }

        settings.data.APIKey = myAPIKey;
    }

    if (settings.url === "undefined") {
        settings.url = url;
        settings.data.APIKey = myAPIKey;
    }

    log("getAJAXSettings", settings);
    return settings;
}

function getData(url, callback) {
    var settings = getAJAXSettings(url);

    return $.ajax(settings)
        .fail(function (jqXHR, textStatus, errorThrown) {
            var errorMessage = 'getData textStatus: ' + textStatus;
            errorMessage += '. jqXHR.status: ' + jqXHR.status;
            if (jqXHR.status === 404) {
                errorMessage += ". The requested page not found.";
            }
            log(errorMessage, jqXHR);
        })
        .always(function (data, textStatus, b) {
            //log("getData " + url, data);
            if (typeof callback === "function") {
                callback(data)
            } else {
                throw new Error('Error. Callback is not a function');
            }
        });
}