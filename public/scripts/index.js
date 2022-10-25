// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-text-freet': createTextFreet,
  'create-image-freet': createImageFreet,
  'delete-freet': deleteFreet,
  'search-user' : searchUser,
  'create-group': createGroup,
  'add-user-to-group': addUserToGroup,
  'remove-user-from-group': removeUserFromGroup,
  'delete-group': deleteGroup,
  'enter-group': enterGroup,
  'leave-group': leaveGroup,
  'mode-toggle-all': modeToggleAll, 
  'mode-toggle-image': modeToggleImage, 
  'mode-toggle-text': modeToggleText, 
  'add-tag': addTag,
  'remove-tag': removeTag,
  'search-tag': searchTag,
  'leave-search': leaveSearch,
  'add-X': addX
  };

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
