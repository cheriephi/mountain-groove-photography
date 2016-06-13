// Shape the data returned from SmugMug into an array of nodes
// which represent the folder structure
// Pass the newly shaped data to the presentation layer to refresh
// the user interface
function processNodes(data) {
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
                }

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

function processAlbumImages(data) {
    var albumImages = [];
    for (var i = 0; i < data.Response.AlbumImage.length; i++) {
        var albumImage = {
            Caption: data.Response.AlbumImage[i].Caption,
            Date: data.Response.AlbumImage[i].Date,
            ThumbnailUrl: data.Response.AlbumImage[i].ThumbnailUrl,
            WebUri: data.Response.AlbumImage[i].WebUri
        }
        albumImages.push(albumImage);
    }

    refreshAlbumImageList(albumImages);
}