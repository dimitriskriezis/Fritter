function addTag(fields){
    fetch('/api/tag', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function removeTag(fields) {
    fetch(`/api/tag/${fields.tagId}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function searchTag(fields){
    fetch(`/api/tag?tagname=${fields.tagname}`)
    .then(showResponse)
    .catch(showResponse);
}

function leaveSearch(fields){
    fetch(`/api/tag/search`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}