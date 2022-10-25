function createGroup(fields) {
    fetch('/api/groups/create', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function addUserToGroup(fields) {
    fetch('/api/groups/add', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function removeUserFromGroup(fields) {
fetch(`/api/groups/remove/?groupId=${fields.groupId}&userId=${fields.userId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function deleteGroup(fields) {
  console.log(fields);
    fetch(`/api/groups/delete/${fields.groupId}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}

function getGroups(fields) {
  fetch('/api/groups')
    .then(showResponse)
    .catch(showResponse);
}

function getMembersOfGroups(fields){
  fetch('/api/groups/members')
  .then(showResponse)
  .catch(showResponse);
}

function enterGroup(fields){
  fetch('/api/groups/session', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function leaveGroup(fields){
  fetch('/api/groups/session', {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
