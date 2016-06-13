function getAlbumImages(albumKey) {
    var filter = {
        filter: ["Caption", "Date", "ThumbnailUrl", "WebUri"],
        filteruri: []
    }

    var filterString = encodeURIComponent(JSON.stringify(filter));
    // TODO. Need to associate the album with the node
    //http://www.smugmug.com/api/v2/node/vgsXkq
    var url = "http://www.smugmug.com/api/v2/album/JpLx6F!images?_config=" + filterString;

    getData(url, processAlbumImages);
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
                                filteruri: [], //TODO: "Album"?
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

    getData(url, processNodes);
}