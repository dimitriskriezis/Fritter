function modeToggleAll(fields){    
    fetch(`/api/feed?mode=0`)
        .then(showResponse)
        .catch(showResponse);
}

function modeToggleText(fields){
    fetch(`/api/feed?mode=1`)
        .then(showResponse)
        .catch(showResponse);
}

function modeToggleImage(fields){
    fetch(`/api/feed?mode=2`)
        .then(showResponse)
        .catch(showResponse);
}