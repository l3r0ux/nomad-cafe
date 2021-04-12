// Add buttons event listeners
const addItemButtons = document.querySelectorAll('.add-item');
const sideScrollWindows = document.querySelectorAll('.side-scroll-window');
const menuAddFormModal = document.getElementById('menu-add-form__wrapper');
const menuUpdateFormModal = document.getElementById('menu-update-form__wrapper');
const eventAddFormModal = document.getElementById('event-add-form__wrapper');
const eventUpdateFormModal = document.getElementById('event-update-form__wrapper');
const galleryFormModal = document.getElementById('gallery-form__wrapper');
const locationFormModal = document.getElementById('location-form__wrapper');
const deleteForm = document.getElementById('delete-form__wrapper');
const deleteConfirmButton = document.querySelector('#confirm');
const allModals = document.querySelectorAll("[id*='__wrapper']");
const map = document.getElementById('location-page__map');


// Listeners for UPDATE and DELETE buttons for specific items
// FOR EDIT AND DELETE BUTTONS, EVENTS MUST BE DELEGATED SINCE WE CAN'T ADD LISTENERS TO SOMETHING THAT ISN'T THERE YET
sideScrollWindows.forEach((window) => {
    window.addEventListener('click', (e) => {
        let clicked = e.target;

        // Checks for Menu page buttons
        if (clicked.classList.contains('menu-delete')) {
            // Get Id of clicked item
            const clickedId = clicked.closest('.side-scroll-window__item').children[0].value;
            // Show delete form
            deleteForm.classList.remove('hidden');
            // Stop execution of this funciton if click away from deleteform or click no
            // to not stack event listeners so that it deletes all items delete button that was clicked, but admin clicked away, not confirming
            deleteForm.addEventListener('click', function stopExecution(e) {
                if (!(e.target.id.includes(("confirm")))) {
                    deleteForm.classList.add('hidden');
                    return deleteForm.removeEventListener('click', stopExecution);
                } else {
                    loadingIndicator.classList.add('is-loading');
                    // Confirm deletion and send request
                    // object to send back as json to backend
                    const itemId = {
                        id: clickedId
                    };
                    // Delete fetch request in adminRequests.js
                    deleteMenuItem(itemId, deleteForm);
                }
                deleteForm.removeEventListener('click', stopExecution);
            });


        } else if (clicked.classList.contains('menu-update')) {
            // only reason to bring up update form here, is to get specific item that was clicked on to prepopulate the fields

            // Saving values to prefill
            let prefillValueName = clicked.closest('.side-scroll-window__item').children[4].children[0].innerText;
            let prefillValuePrice = clicked.closest('.side-scroll-window__item').children[4].children[1].innerText;
            let prefillValueDescription = clicked.closest('.side-scroll-window__item').children[4].children[2].innerText;
            let prefillValueId = clicked.closest('.side-scroll-window__item').children[0].value

            // prefilling values
            menuUpdateFormModal.classList.remove('hidden');
            menuUpdateFormModal.children[0].menuItemName.value = `${prefillValueName}`;
            menuUpdateFormModal.children[0].menuItemPrice.value = `${prefillValuePrice}`;
            menuUpdateFormModal.children[0].menuItemDescription.value = `${prefillValueDescription}`;
            menuUpdateFormModal.children[0].id.value = `${prefillValueId}`;

        }

        // Checks for Events page buttons
        if (clicked.classList.contains('event-delete')) {
            // Get id in hidden input of clicked item
            const clickedId = clicked.closest('.side-scroll-window__item').children[0].value;
            // Show delete form
            deleteForm.classList.remove('hidden');

            // Check if clicked away, then stop execution of function to not add event listener to deleteConfirmButton
            // Stop execution of this funciton if click away from deleteform or click no
            deleteForm.addEventListener('click', function stopExecution(e) {
                if (!(e.target.id.includes(("confirm")))) {
                    deleteForm.classList.add('hidden');
                    return deleteForm.removeEventListener('click', stopExecution);
                } else {
                    loadingIndicator.classList.add('is-loading');
                    const itemId = {
                        id: clickedId
                    };
                    deleteEvent(itemId, deleteForm);
                }
                deleteForm.removeEventListener('click', stopExecution);
            });

            // Event updating
        } else if (clicked.classList.contains('event-update')) {
            // Saving values to prefill
            let prefillValueName = clicked.closest('.side-scroll-window__item').children[4].children[1].innerText;
            let prefillValueDate = clicked.closest('.side-scroll-window__item').children[4].children[2].innerText;
            let prefillValueLocation = clicked.closest('.side-scroll-window__item').children[4].children[3].innerText;
            let prefillValueId = clicked.closest('.side-scroll-window__item').children[0].value

            // prefilling values
            eventUpdateFormModal.classList.remove('hidden');
            eventUpdateFormModal.children[0].eventName.value = `${prefillValueName}`;
            eventUpdateFormModal.children[0].eventDate.value = `${prefillValueDate}`;
            eventUpdateFormModal.children[0].eventLocation.value = `${prefillValueLocation}`;
            eventUpdateFormModal.children[0].id.value = `${prefillValueId}`;
        }

        // Checks for Gallery page button
        else if (clicked.classList.contains('gallery-delete')) {
            // Get id in hidden input of clicked item
            const clickedId = clicked.closest('.side-scroll-window__item').children[0].value;
            // Show delete form
            deleteForm.classList.remove('hidden');
            // Check if clicked away, then stop execution of function to not add event listener to deleteConfirmButton
            // Stop execution of this funciton if click away from deleteform or click no
            deleteForm.addEventListener('click', function stopExecution(e) {
                if (!(e.target.id.includes(("confirm")))) {
                    deleteForm.classList.add('hidden');
                    return deleteForm.removeEventListener('click', stopExecution);
                } else {
                    loadingIndicator.classList.add('is-loading');
                    const itemId = {
                        id: clickedId
                    };
                    deleteGalleryImage(itemId, deleteForm);
                }
                deleteForm.removeEventListener('click', stopExecution);
            });
        }

        // Checks for location page button
        else if (clicked.classList.contains('location-delete')) {
            // Check if there are already no coordinates
            if (document.querySelector('#location-page__map h2') && document.querySelector('#no-location-background')) {
                return;
            } else {
                deleteForm.classList.remove('hidden');
                deleteForm.addEventListener('click', function stopExecution(e) {
                    if (!(e.target.id.includes(("confirm")))) {
                        deleteForm.classList.add('hidden');
                        return deleteForm.removeEventListener('click', stopExecution);
                    } else {
                        deleteLocation(deleteForm);
                    }
                    deleteForm.removeEventListener('click', stopExecution);
                });
            }
        }
    });
});

// Listeners for form submittions
// Will get any submitted forms input values
// MAKE A FORMDATA OBJECT AND SET ITS CONTENT AS THE VALUES, SO THAT THE EXPRESS BACKEND PARSES IT CORRECTLY
allModals.forEach((modal) => {
    modal.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get submitted form
        let submitted = e.target;
        let form = document.getElementById(submitted.name);

        // On Menu Add form submit
        if (submitted.name === 'menu-add-form') {
            let formData = new FormData(form);
            // add loading spinner non hidden class
            loadingIndicator.classList.add('is-loading');
            postMenuItem(formData, form);
        }
        // On Menu Update form submit
        // USE PATCH REQUESTS FOR UPDATES, AS THEY DON'T OVERWRITE ALL DATA
        if (submitted.name === 'menu-update-form') {
            let formData = new FormData(form);
            loadingIndicator.classList.add('is-loading');
            updateMenuItem(formData, form);
        }

        // On Event Add Form Submit
        else if (submitted.name === 'event-add-form') {
            let formData = new FormData(form);
            loadingIndicator.classList.add('is-loading');
            postEvent(formData, form);
        }

        // On Event Update Form Submit
        else if (submitted.name === 'event-update-form') {
            let formData = new FormData(form);
            loadingIndicator.classList.add('is-loading');
            updateEvent(formData, form);
        }

        // On Gallery Form Submit
        else if (submitted.name === 'gallery-form') {
            let formData = new FormData(form);
            loadingIndicator.classList.add('is-loading');
            postGalleryImage(formData, form);
        }

        // On location add form submit
        else if (submitted.name === 'location-form') {
            loadingIndicator.classList.add('is-loading');
            // object just to capture the found coordinates to send through
            let coordinates = {
                long: null,
                lat: null
            }

            // route to post coordinates 
            const showPosition = (position) => {
                coordinates.long = position.coords.longitude;
                coordinates.lat = position.coords.latitude;
                // fetch request to post coordinates to the database
                postLocation(coordinates, form);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert('Geolocation is not supported by this browser');
            }
        }
    });
});

// to make form visible on mobile keypad
window.addEventListener('resize', () => {
    if (window.innerHeight <= 360 && window.innerWidth <= 360) {
        for (let modal of allModals) {
            modal.children[0].classList.add('mobile-keyboard-active');
        }
        navbar.classList.add('hide-navbar');
    } else {
        for (let modal of allModals) {
            modal.children[0].classList.remove('mobile-keyboard-active');
        }
    }
})

// Listeners for add buttons to show appropriate form
// not delegated like the edit and delete buttons, becuase they are always there
addItemButtons.forEach((addButton) => {
    addButton.addEventListener('click', (e) => {
        let clicked = e.target;

        if (clicked.closest('section').id === 'menu-page') {
            menuAddFormModal.classList.remove('hidden');
        }
        else if (clicked.closest('section').id === 'events-page') {
            eventAddFormModal.classList.remove('hidden');
        }
        else if (clicked.closest('section').id === 'gallery-page') {
            galleryFormModal.classList.remove('hidden');
        }
        else if (clicked.closest('section').id === 'location-page') {
            locationFormModal.classList.remove('hidden');
        }
    });
});

// Listeners to close forms when click off form
allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
        let clicked = e.target.id;

        if (clicked.includes('__wrapper')) {
            modal.classList.add('hidden');
        }
    });
});