function modeToggleAll(fields){ 
    sendFields = new Object();
    sendFields.mode = "0";
    fetch('/api/feed', {method: 'POST', body: JSON.stringify(sendFields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function modeToggleText(fields){
    sendFields = new Object();
    sendFields.mode = 1;
    fetch('/api/feed', {method: 'POST', body: JSON.stringify(sendFields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function modeToggleImage(fields){
    sendFields = new Object();
    sendFields.mode = 2;
    fetch('/api/feed', {method: 'POST', body: JSON.stringify(sendFields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}