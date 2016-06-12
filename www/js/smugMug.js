var myAPIKey;

function getAlbums(start, count) {
    log("getAlbums(" + start + ", " + count + ") start");

    var x = getData("http://www.smugmug.com/api/v2/user/MountainGroovePhotography!albums?start=" + start + "&count=" + count);

    $.when(x).then(function (albumsData) {
        console.dir(albumsData);

        console.log("Total: " + albumsData.Response.Pages.Total);

        for (i = 0; i < albumsData.Response.Album.length; i++) {
            var album = albumsData.Response.Album[i];

            console.log("AlbumKey: " + album.AlbumKey);
            console.log("Description: " + album.Description);
            console.log("External: " + album.External);
            console.log("ImageCount: " + album.ImageCount);
            console.log("NodeID: " + album.NodeID);
            console.log("Title: " + album.Title);
            console.log("WebUri: " + album.WebUri);
        }

        log("getAlbums end");
    });
}

// Get recursive node (folder) structure from SmugMug
function getNodes() {
    //Pass in a configuration option to limit data returned and allow
    //us to recurse through several levels of folder structures in a single call 
    var filter = {
        filter: ["NodeID", "Name"],
        filteruri: ["ChildNodes"],
        expand: {
            "ChildNodes": {
                filter: ["NodeID", "Name"],
                filteruri: ["ChildNodes"],
                expand: {
                    "ChildNodes": {
                        filter: ["NodeID", "Name"],
                        filteruri: ["ChildNodes"],
                        expand: {
                            ChildNodes: {
                                filter: ["NodeID", "Name"],
                                filteruri: [],
                                "args": {
                                    "count": 100
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    var filterString = encodeURIComponent(JSON.stringify(filter));
    var url = "http://www.smugmug.com/api/v2/node/bWK57?_config=" + filterString;

    var x = getData(url);
    $.when(x).then(function (data) {
        //Once the data has returned, process it further
        parseJSON(data);
    });
};

function getAlbumImages(albumKey) {
    log("getAlbumImages(" + albumKey + ") start");
    var x = getData("http://www.smugmug.com/api/v2/album/" + albumKey + "!images");
    $.when(x).then(function (albumImageData) {

        for (i = 0; i < albumImageData.Response.AlbumImage.length; i++) {
            var albumImage = albumImageData.Response.AlbumImage[i];
            console.log("Caption: " + albumImage.Caption);
            console.log("Date: " + albumImage.Date);
            console.log("ImageKey: " + albumImage.ImageKey);
            console.log("ThumbnailUrl: " + albumImage.ThumbnailUrl);
            console.log("WebUri: " + albumImage.WebUri);
            if (i == 1) {
                break;
            }
        }

        log("getAlbumImages end");
    });
}

// Shape the data returned from SmugMug into an array of nodes
// which represent the folder structure
// Pass the newly shaped data to the presentation layer to refresh
// the user interface
function parseJSON(data) {
    var childNodes = getChildNodes(data.Expansions, data.Response.Node.NodeID);
    refreshList(childNodes);
};

// Recursively loop through the expansion nodes and build a node structure
function getChildNodes(expansions, nodeID) {
    var childNodes = [];
    for (var key in expansions) {

        if (key.includes(nodeID)) {
            for (var j = 0; j < expansions[key].Node.length; j++) {
                var childNode = {
                    NodeID: expansions[key].Node[j].NodeID,
                    Name: expansions[key].Node[j].Name
                };

                var nodes = getChildNodes(expansions, childNode.NodeID);
                if (nodes.length) {
                    childNode.Nodes = nodes;
                }

                childNodes.push(childNode);
            }

            return childNodes;
        }
    }
    return childNodes;
}

function refreshList(nodes) {
    var html = createList(nodes, "");
    refreshListFromHtml(html);
    //getHtml();
}

function refreshListFromHtml(html) {
    var stage = $("#folderList");
    stage.empty();
    stage.append(html);
    //apply styling now that we have added collapsible sets
    stage.html(html).trigger('create');
}

function createList(nodes, html) {
    var isRoot = (html === "");
    if (!isRoot) {
        html += '<ul data-role="listview">';
    }

    for (var i = 0; i < nodes.length; i++) {
        var innerHtml = '';
        if (nodes[i].Nodes) {
            var innerHtml = '<li data-role="collapsible">';
            innerHtml += '<h2 id="' + nodes[i].NodeID + '">' + nodes[i].Name + '</h2>';
            innerHtml = createList(nodes[i].Nodes, innerHtml);
            innerHtml += '</li>';
        } else {
            innerHtml = '<li id="' + nodes[i].NodeID + '">' + nodes[i].Name + '</li>';
        }

        html += innerHtml;
    }

    if (!isRoot) {
        html += '</ul>';
    }

    return html;
}