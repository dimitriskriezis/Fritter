function addFollowee(fields){
    fetch('/api/follow', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function viewFolloweesByUser(fields) {
    fetch(`/api/follow?user=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollowee(fields) {
    fetch(`/api/follow/${fields.followedUsername}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }

  