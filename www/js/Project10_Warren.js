var feeds = [];
window.onload = function () {
    refreshNodes();
    // At this point, the document has loaded but phonegap-1.0.0.js has not.
    // When PhoneGap is loaded and talking with the native device,
    // it will call the event `deviceready`.
    document.addEventListener("deviceready", onDeviceReady, false);
}

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
function onDeviceReady() {
    // Now safe to use the PhoneGap API
    // Access simple information accessible to PhoneGap to prove the system is working as expected
    var msg = "You are using a " + window.device.model + ".";
    document.getElementById('deviceReadyWelcome').innerHTML = msg;

    // Handle the iPhone 6 status bar positioning
    // See http://coenraets.org/blog/2013/09/phonegap-and-cordova-with-ios-7/
    if (parseFloat(window.device.version) === 7.0) {
        document.body.style.marginTop = "20px";
    }

}

function updateRootNodeList(nodes) {
    var rootNodeContentHtml = '';
    for (i = 0; i < nodes.length; i++) {
        rootNodeContentHtml += '<div data-role="collapsible"><h2>' + nodes[i].Name + '</h2>'
        rootNodeContentHtml += '<div data-role="collapsible-set">';

        for (j = 0; j < nodes[i].ChildNodes.length; j++) {
            rootNodeContentHtml += '<div data-role="collapsible"><h2>' + nodes[i].ChildNodes[j].Name + '</h2></div>';
        }

        rootNodeContentHtml += '</div>';
        rootNodeContentHtml += '</div>';
    }

    var rootNodeContent = $('#rootNodeList');
    rootNodeContent.empty();
    rootNodeContent.append(rootNodeContentHtml);
}

function getFeed(myID, galleryID) {
    var query = "select * from feed where url='https://mountaingroovephotography.smugmug.com/hack/feed.mg?Type=gallery&Data=" + galleryID + "&format=rss200'";

    /* Forming the URL to YQL: */
    var url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json&callback=?";
    var feedID = 0;
    feeds = [];

    $.getJSON(url, function (data) {

        var stage = $("#" + myID);
        stage.empty();

        $.each(data.query.results.item, function () {

            // Extract the interesting elements from the feed and put them into a new JSON entity

            var dateString;
            if (this.hasOwnProperty("DateTimeOriginal")) {
                dateString = ', "date": "' + this.DateTimeOriginal + '"';
            } else {
                dateString = '';
            }

            // the title array is formatted strangely in the json feed; use
            // the first item in the array to ensure it doesn't show up as an object
            // SmugMug seems to store the largest image in the collection last; so grab that URL
            var feedString = '{' + '"feedID": "' + feedID + '"' + ', "thumbnail": "' + this.thumbnail.url + '"' + ', "title": "' + this.title[0] + '"' + dateString + ', "category": "' + this.category[0] + '"' + ', "image": "' + this.group.content[this.group.content.length - 1].url + '"' + '}';


            //console.log(feedString);
            var feed = JSON.parse(feedString);

            feeds.push(feed);

            var listLink = '<li>' + '<a href="#detail" id="' + feeds[feedID].feedID + '" onclick="updateFeedDetail(this.id)">' + '<img src="' + feeds[feedID].thumbnail + '" alt="Image">' + feeds[feedID].title + '</a>' + '</li>';

            stage.append(listLink);
            feedID = feedID + 1;
        })

        $("#" + myID).listview("refresh");
    });

}

function updateFeedDetail(feedID) {
    var dateString;
    if (feeds[feedID].hasOwnProperty("date")) {
        var d = new Date(feeds[feedID].date);
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        dateString = '<p>Date:' + d.toLocaleDateString('en-US', options) + '</p>';
    } else {
        dateString = '';
    }

    var detailContentHtml = '<h2>' + feeds[feedID].title + '</h2>' + '<img src="' + feeds[feedID].image + '" alt="Photo">' + '<p>Category:' + feeds[feedID].category + '</p>' + dateString;

    var detailContent = $('#detailContent');
    detailContent.empty();
    detailContent.append(detailContentHtml);
}