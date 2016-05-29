var myAPIKey;

jQuery(document).ready(function ($) {
   // getSmugMug();
});

function getSmugMug() {
    myAPIKey = getAPIKey();
    getUser();
    getAlbums(1, 3);
    getNode("tmjJd");
	getNode(rootNode);
    getAlbumImages("LDS2fC");
}

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

function getUser() {
    log("getUser start");
    var x = getData("http://www.smugmug.com/api/v2/user/MountainGroovePhotography");
    $.when(x).then(function (data) {
        console.dir(data);
        log("getUser end");
    });
}

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
            //"/api/v2/album/2Bg7hd!highlightimage"
        }
        
        log("getAlbums end");
    });
}

function refreshNodes() {
    log("refreshNodes start");

    myAPIKey = getAPIKey();
    var x = getData("http://www.smugmug.com/api/v2/node/bWK57!children?_expand=ChildNodes");
    
    $.when(x).then(function (data) {
        var childNodes = [];
        for (i = 0; i < data.Response.Node.length; i++) {
            var childNode = {
                Name: data.Response.Node[i].Name,
                NodeID: data.Response.Node[i].NodeID
            };

            var grandChildNodes = [];
            var grandChildExpansion = data.Expansions["/api/v2/node/" + childNode.NodeID + "!children"].Node;
            for (j = 0; j < grandChildExpansion.length; j++) {
                var grandChildNode = {
                    Name: grandChildExpansion[j].Name,
                    NodeID: grandChildExpansion[j].NodeID
                };
                grandChildNodes.push(grandChildNode);
            };
            
            childNode.ChildNodes = grandChildNodes;
            childNodes.push(childNode);
        }
     
        updateRootNodeList(childNodes);
        log("refreshNodes callback end");
    });
    
    log("refreshNodes end");
}

function getNode(nodeID) {
    log("getNode(" + nodeID + ") start");

    //HighlightImage Uri: "/api/v2/highlight/node/bWK57"
    var x = getData("http://www.smugmug.com/api/v2/node/" + nodeID);

    $.when(x).then(function (data) {
        console.dir(data);
        
        var node = data.Response.Node;
        var isRoot = node.IsRoot;
        
        console.log("Description: " + node.Description);
        console.log("HasChildren: " + node.HasChildren);
        console.log("IsRoot: " + node.IsRoot);
        console.log("WebUri: " + node.WebUri);

        log("getNode end");
    });
}

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
            ///api/v2/image/XdBS8Tr-0!largestimage
            if (i == 1) {break; }
        }
        

        log("getAlbumImages end");
    });
}
