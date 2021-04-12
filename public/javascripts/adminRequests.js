// ==== Menu Item Requests ====
// Posting menu items
// need submitted form to place validation feedback messages
const postMenuItem = async (formData, submittedForm) => {
    const res = await fetch('/admin/menu', {
        method: 'POST',
        body: formData
    })
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        return feedbackModal("Oops! <br> Something went wrong adding the item.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        return feedbackModal("Oops! <br> Something went wrong adding the item.", "GO BACK", "style='background-color: #912e29'")
    }
    // validation errors
    else if (data.errors) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        return validationFeedback(data.errors, submittedForm);
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        // append newly created item
        const appendLocation = document.querySelector('#menu-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        // putting id as hidden input aswell
        // access with document.getElementById('menuItemId').value
        sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="menuItemId" value="${data._id}"><div class='delete-item button-helper menu-delete'><img class="menu-delete" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618231557/NomadCafe/delete_joanpj.png"></div><div class='edit-item button-helper menu-update'><img class="menu-update" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618233798/NomadCafe/edit_m0wxkf.png"></div><img src=${data.menuImageUrl} class='menu-item__image'><div class='menu-item__description'><h2>${data.menuItemName}</h2><h3>${data.menuItemPrice}</h3><p>${data.menuItemDescription}</p></div>`;
        appendLocation.append(sideScrollWindowItemContainer);
        return feedbackModal("Menu item succesfully added.", "OK");
    }
}

// Update menu item
const updateMenuItem = async (formData, submittedForm) => {
    const res = await fetch('/admin/menu', {
        method: 'PATCH',
        body: formData
    })
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        return feedbackModal("Oops! <br> Something went wrong updating the item.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        return feedbackModal("Oops! <br> Something went wrong updating the item.", "GO BACK", "style='background-color: #912e29'")
    }
    // validation errors
    else if (data.errors) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        return validationFeedback(data.errors, submittedForm);
    }
    else {
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        // Deleting previous menu item with same id as updated one
        document.querySelector(`input[value="${data._id}"]`).parentNode.remove();
        // Appending new menu item with same id as before
        const appendLocation = document.querySelector('#menu-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="menuItemId" value="${data._id}"><div class='delete-item button-helper menu-delete'><img class="menu-delete" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618231557/NomadCafe/delete_joanpj.png"></div><div class='edit-item button-helper menu-update'><img class="menu-update" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618233798/NomadCafe/edit_m0wxkf.png"></div><img src=${data.menuImageUrl} class='menu-item__image'><div class='menu-item__description'><h2>${data.menuItemName}</h2><h3>${data.menuItemPrice}</h3><p>${data.menuItemDescription}</p></div>`;
        appendLocation.append(sideScrollWindowItemContainer);
        return feedbackModal("Menu item succesfully updated.", "OK");
    }
}

// Deleting menu items
const deleteMenuItem = async (itemId, submittedForm) => {
    const res = await fetch('/admin/menu', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemId)
    });
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong deleting the item.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong deleting the item.", "GO BACK", "style='background-color: #912e29'")
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.classList.add('hidden');
        document.querySelector(`input[value="${data._id}"]`).parentNode.remove();
        return feedbackModal("Menu item succesfully deleted", "OK")
    }
}


// ==== Event Requests ====
// Event post request
const postEvent = async (formData, submittedForm) => {
    const res = await fetch('/admin/events', {
        method: 'POST',
        body: formData
    })
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong adding the event.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong adding the event.", "GO BACK", "style='background-color: #912e29'")
    }
    // validation errors
    else if (data.errors) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        return validationFeedback(data.errors, submittedForm);
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        // append newly created item
        const appendLocation = document.querySelector('#events-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        // putting id as hidden input aswell
        // access with document.getElementById('eventId').value
        sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="eventId" value="${data._id}"><div class="delete-item button-helper event-delete"><img class="event-delete" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618231557/NomadCafe/delete_joanpj.png"></div><div class="edit-item button-helper event-update"><img class="event-update" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618233798/NomadCafe/edit_m0wxkf.png"></div><img src=${data.eventImageUrl} alt="coffee-landrover" class="events-image"><div class="event-container"><div class="logo"><img src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1616580427/NomadCafe/logo_ubgkoi.png" alt="logo"></div><p class="event-details">${data.eventName}</p><p class="event-details">${data.eventDate}</p><p class="event-details">${data.eventLocation}</p></div>`;
        appendLocation.append(sideScrollWindowItemContainer);
        return feedbackModal("Event succesfully added.", "OK")
    }
}

// Event update
const updateEvent = async (formData, submittedForm) => {
    const res = await fetch('/admin/events', {
        method: 'PATCH',
        body: formData
    })
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong updating the event.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong updating the event.", "GO BACK", "style='background-color: #912e29'")
    }
    // validation errors
    else if (data.errors) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        return validationFeedback(data.errors, submittedForm);
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        // Replacing where old event was with new one
        let oldEvent = document.querySelector(`input[value="${data._id}"]`).parentNode;
        // Appending new menu item with same id as before
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="eventId" value="${data._id}"><div class="delete-item button-helper event-delete"><img class="event-delete" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618231557/NomadCafe/delete_joanpj.png"></div><div class="edit-item button-helper event-update"><img class="event-update" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618233798/NomadCafe/edit_m0wxkf.png"></div><img src=${data.eventImageUrl} alt="coffee-landrover" class="events-image"><div class="event-container"><div class="logo"><img src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1616580427/NomadCafe/logo_ubgkoi.png" alt="logo"></div><p class="event-details">${data.eventName}</p><p class="event-details">${data.eventDate}</p><p class="event-details">${data.eventLocation}</p></div>`;
        oldEvent.parentNode.replaceChild(sideScrollWindowItemContainer, oldEvent);
        return feedbackModal("Event succesfully updated", "OK")
    }
}

// Event delete
const deleteEvent = async (itemId, submittedForm) => {
    const res = await fetch('/admin/event', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemId)
    });
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong deleting the event.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong deleting the event.", "GO BACK", "style='background-color: #912e29'")
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.classList.add('hidden');
        document.querySelector(`input[value="${data._id}"]`).parentNode.remove();
        return feedbackModal("Event succesfully deleted", "OK")
    }
}


// ==== Gallery Requests  ====
// Gallery add
const postGalleryImage = async (formData, submittedForm) => {
    const res = await fetch('/admin/gallery', {
        method: 'POST',
        body: formData
    })
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong adding the photo.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong adding the photo.", "GO BACK", "style='background-color: #912e29'")
    }
    // validation errors
    else if (data.errors) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        return validationFeedback(data.errors, submittedForm);
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        submittedForm.reset();
        // Appending new menu item with same id as before
        const appendLocation = document.querySelector('#gallery-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="galleryId" value="${data._id}"></input><div class="delete-item button-helper gallery-delete"><img class="gallery-delete" src="https://res.cloudinary.com/djkyfcfl1/image/upload/v1618231557/NomadCafe/delete_joanpj.png"></div><img src="${data.galleryImageUrl}" class="gallery-image">`;
        appendLocation.append(sideScrollWindowItemContainer);
        return feedbackModal("Photo succesfully added", "OK")
    }
}

// Gallery delete
const deleteGalleryImage = async (itemId, submittedForm) => {
    const res = await fetch('/admin/gallery', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemId)
    });
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong deleting the photo.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        return feedbackModal("Oops! <br> Something went wrong deleting the photo.", "GO BACK", "style='background-color: #912e29'")
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        submittedForm.classList.add('hidden');
        document.querySelector(`input[value="${data._id}"]`).parentNode.remove();
        return feedbackModal("Photo succesfully deleted", "OK")
    }
}


// ==== Location Requests ====
// Location post
const postLocation = async (coordinates, submittedForm) => {
    const res = await fetch('/admin/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(coordinates)
    })
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong adding the location.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        return feedbackModal("Oops! <br> Something went wrong adding the location.", "GO BACK", "style='background-color: #912e29'")
    }
    else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Closing modal popup on submit
        submittedForm.parentElement.classList.add('hidden');
        let longitude = parseFloat(coordinates.long);
        let latitude = parseFloat(coordinates.lat);
        // Check if no location background exists
        // Case where admin adds location, but there is already a location
        if (document.querySelector('#location-page__map h2') && document.querySelector('#no-location-background')) {
            document.querySelector('#location-page__map h2').remove();
            document.querySelector('#no-location-background').remove();
        }
        mapboxgl.accessToken = data.mapboxToken;
        var map = new mapboxgl.Map({
            container: 'mapbox', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [longitude, latitude], // starting position [lng, lat]
            zoom: 9 // starting zoom
        });
        var marker = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map)

        return feedbackModal("Location succesfully added.", "OP");
    }
}

// Location delete
const deleteLocation = async (submittedForm) => {
    const res = await fetch('/admin/location', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
    });
    if (!(res.ok)) {
        return feedbackModal("Oops! <br> Something went wrong deleting the location.", "GO BACK", "style='background-color: #912e29'")
    }
    const data = await res.json();
    if (data.error) {
        return feedbackModal("Oops! <br> Something went wrong deleting the location.", "GO BACK", "style='background-color: #912e29'")
    }
    else {
        submittedForm.classList.add('hidden');
        document.getElementById('mapbox').innerHTML = '';
        const h2 = document.createElement('h2');
        h2.append('Not Currently at an Event');
        let img = document.createElement('img');
        img.src = 'https://res.cloudinary.com/djkyfcfl1/image/upload/v1616580428/NomadCafe/menu_page_background_xqsyd9.jpg';
        img.id = 'no-location-background'
        mapLocation.append(img);
        map.append(img);
        map.append(h2);
        return feedbackModal("Location succesfully deleted", "OK")
    }
}