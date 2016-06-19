function getNodeImages(NodeID) {
    var filter = {
        filter: ["NodeID"],
        filteruri: ["Album"],
        expand: {
            "Album": {
                filter: [],
                filteruri: ["AlbumImages"],
                expand: {
                    "AlbumImages": {
                        filter: ["Caption", "Date", "ThumbnailUrl", "WebUri"],
                        filteruri: [],
                        "args": {
                            "count": 100
                        }
                    }
                }
            }
        }
    };

    var filterString = encodeURIComponent(JSON.stringify(filter));
    var url = "http://www.smugmug.com/api/v2/node/" + NodeID + "?_config=" + filterString;

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