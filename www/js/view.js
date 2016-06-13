function refreshList(nodes) {
    var html = createList(nodes, "");
    refreshListFromHtml(html);
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
            innerHtml = '<li data-role="collapsible">';
            innerHtml += '<h2 id="' + nodes[i].NodeID + '">' + nodes[i].Name + '</h2>';
            innerHtml = createList(nodes[i].Nodes, innerHtml);
            innerHtml += '</li>';
        } else {
            innerHtml = '<li data-role="collapsible">';
            innerHtml += '<h2 id="' + nodes[i].NodeID + '" onclick="getAlbumImages(this.id)">' + nodes[i].Name + '</h2>';
            innerHtml += '</li>';
        }

        html += innerHtml;
    }

    if (!isRoot) {
        html += '</ul>';
    }

    return html;
}

function refreshAlbumImageList(albumImages) {
    var html = '';
    for (var i = 0; i < albumImages.length; i++) {
        var listLink = '<li><img src="' + albumImages[i].ThumbnailUrl + '" alt="Image">' + albumImages[i].Caption + '</a></li>';
        html += listLink;
    }

    var stage = $("#vgsXkq"); // todo
    stage.empty();
    stage.append(html);
    //log(html);
}