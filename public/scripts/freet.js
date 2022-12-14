/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFreets(fields) {
  fetch('/api/freets')
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  fetch(`/api/freets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFreet(fields) {
  fetch('/api/freets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function createTextFreet(fields){

  var reader = new FileReader();
  reader.readAsDataURL(fields.image);
  reader.onload = function () {  
    const fieldsFreet = new Object();
    fieldsFreet.content = fields.content;
    fieldsFreet.image = reader.result;
    fetch('/api/freets', {method: 'POST', body: JSON.stringify(fieldsFreet), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
  };
}

function createImageFreet(fields){
  var reader = new FileReader();
  reader.readAsDataURL(fields.image);
  reader.onload = function () {  
    const fieldsFreet = new Object();
    fieldsFreet.image = reader.result;
    fetch('/api/freets/imageFreet', {method: 'POST', body: JSON.stringify(fieldsFreet), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
  }
}

function deleteFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}