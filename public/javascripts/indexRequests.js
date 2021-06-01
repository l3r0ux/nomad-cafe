// Get Menu items on page load
const getMenu = async () => {
    const res = await fetch('/menu');
    if (!(res.ok)) {
        const appendLocation = document.querySelector('#menu-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 25%; text-align: center; color: white">Error ${res.status}: ${res.statusText}</h3>`;
        appendLocation.append(sideScrollWindowItemContainer);
    }
    const data = await res.json();
    if (data.error) {
        const appendLocation = document.querySelector('#menu-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 25%; text-align: center; color: white">${data.error}</h3>`;
        appendLocation.append(sideScrollWindowItemContainer);
    } else {
        data.forEach((item) => {
            const appendLocation = document.querySelector('#menu-page .side-scroll-window');
            const sideScrollWindowItemContainer = document.createElement('div');
            sideScrollWindowItemContainer.className = 'side-scroll-window__item';
            sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="menuItemId" value="${item._id}"><div class='delete-item button-helper menu-delete'><img class="menu-delete" src="/images/delete_joanpj.png"></div><div class='edit-item button-helper menu-update'><img class="menu-update" src="/images/NomadCafe/edit_m0wxkf.png"></div><img src=${item.menuImageUrl} class='menu-item__image'><div class='menu-item__description'><h2>${item.menuItemName}</h2><h3>${item.menuItemPrice}</h3><p>${item.menuItemDescription}</p></div>`;
            appendLocation.append(sideScrollWindowItemContainer);
        });
    }

}

// Get Events on page load
const getEvents = async () => {
    const res = await fetch('/events');
    if (!(res.ok)) {
        const appendLocation = document.querySelector('#events-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 45%; text-align: center; color: white">Error ${res.status}: ${res.statusText}</h3>`;
        return appendLocation.append(sideScrollWindowItemContainer);
    }
    const data = await res.json();
    if (data.error) {
        const appendLocation = document.querySelector('#events-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 45%; text-align: center; color: white">${data.error}</h3>`;
        appendLocation.append(sideScrollWindowItemContainer);
    } else {
        data.forEach((item) => {
            const appendLocation = document.querySelector('#events-page .side-scroll-window');
            const sideScrollWindowItemContainer = document.createElement('div');
            sideScrollWindowItemContainer.className = 'side-scroll-window__item';
            sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="eventId" value="${item._id}"><div class="delete-item button-helper event-delete"><img class="event-delete" src="/images/delete_joanpj.png"></div><div class="edit-item button-helper event-update"><img class="event-update" src="/images/edit_m0wxkf.png"></div><img src=${item.eventImageUrl} class="events-image"><div class="event-container"><div class="logo"><img src="/images/logo_ubgkoi.png" alt="logo"></div><p class="event-details">${item.eventName}</p><p class="event-details">${item.eventDate}</p><p class="event-details">${item.eventLocation}</p></div>`;
            appendLocation.append(sideScrollWindowItemContainer);
        });
    }

}

// Get Gallery Images on page load
const getGallery = async () => {
    const res = await fetch('/gallery');
    if (!(res.ok)) {
        const appendLocation = document.querySelector('#gallery-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 45%; text-align: center; color: white">Error ${res.status}: ${res.statusText}</h3>`;
        return appendLocation.append(sideScrollWindowItemContainer);
    }
    const data = await res.json();
    if (data.error) {
        const appendLocation = document.querySelector('#gallery-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 45%; text-align: center; color: white">${data.error}</h3>`;
        appendLocation.append(sideScrollWindowItemContainer);
    } else {
        data.forEach((item) => {
            // Appending new menu item with same id as before
            const appendLocation = document.querySelector('#gallery-page .side-scroll-window');
            const sideScrollWindowItemContainer = document.createElement('div');
            sideScrollWindowItemContainer.className = 'side-scroll-window__item';
            sideScrollWindowItemContainer.innerHTML = `<input type="hidden" id="galleryId" value="${item._id}"></input><div class="delete-item button-helper gallery-delete"><img class="gallery-delete" src="/images/delete_joanpj.png"></div><img src="${item.galleryImageUrl}" class="gallery-image">`;
            appendLocation.append(sideScrollWindowItemContainer);
        });
    }

}

// Get Location on page load
const getLocation = async () => {
    const res = await fetch('/location');
    if (!(res.ok)) {
        const appendLocation = document.querySelector('#location-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 45%; text-align: center; color: white">Error ${res.status}: ${res.statusText}</h3>`;
        return appendLocation.append(sideScrollWindowItemContainer);
    }
    const data = await res.json();
    if (data.error) {
        const appendLocation = document.querySelector('#location-page .side-scroll-window');
        const sideScrollWindowItemContainer = document.createElement('div');
        sideScrollWindowItemContainer.className = 'side-scroll-window__item';
        sideScrollWindowItemContainer.innerHTML = `<h3 style="padding-top: 45%; text-align: center; color: white">${data.error}</h3>`;
        appendLocation.append(sideScrollWindowItemContainer);
    } else if (data.html) {
        let html = document.createElement('h2');
        let img = document.createElement('img');
        img.src = '/images/menu_page_background_xqsyd9.jpg';
        img.id = 'no-location-background';
        html.append(data.html);
        mapLocation.append(html);
        mapLocation.append(img);
    } else {
        let long = data.longitude;
        let lat = data.latitude;
        mapboxgl.accessToken = data.mapboxToken;
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [long, lat], // starting position [lng, lat]
            zoom: 10 // starting zoom
        });
        var marker = new mapboxgl.Marker()
            .setLngLat([long, lat])
            .addTo(map)
    }
}

// Customer Inquiry email sending
const sendCustomerInquiry = async (formData, submittedForm) => {
    const res = await fetch('/contact-us', {
        method: 'POST',
        body: formData
    });
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // Display error popup
        submittedForm.reset();
        // helper function in index.js to output modal popup to make code dry
        return feedbackModal("Oops! <br> Something went wrong sending the email. Try again later", "GO BACK", "style='background-color: #912e29'");
    }
    const data = await res.json();
    // validation errors
    if (data.errors) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // will display validation errors
        return validationFeedback(data.errors, submittedForm);
    }
    // other async errors
    if (data.error) {
        // display error popup
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        submittedForm.reset();
        return feedbackModal("Oops! <br> Something went wrong sending the email. Try again later", "GO BACK", "style='background-color: #912e29'");
    } else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        submittedForm.reset();
        return feedbackModal("Your email has been sent. We will get back to you as soon as possible.", "OK");
    }
}

// Customer subscribing with error handling
const subscribeCustomer = async (formData, submittedForm) => {
    const res = await fetch('/subscribe', {
        method: 'POST',
        body: formData
    })
    if (!(res.ok)) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // error popup modal
        return feedbackModal("Oops! <br> Something went wrong subscribing. Try again later", "GO BACK", "style='background-color: #912e29'");
    }
    const data = await res.json();
    if (data.errors) {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        return validationFeedback(data.errors, submittedForm);
    }
    if (data.error) {
        // display error modal
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        submittedForm.reset();
        return feedbackModal("Oops! <br> Something went wrong subscribing. Try again later", "GO BACK", "style='background-color: #912e29'");
    } else if (data.alreadySub) {
        // modal for already subbed
        loadingIndicator.classList.remove('is-loading');
        submittedForm.reset();
        return feedbackModal(`${data.alreadySub}`, "OK");
    } else {
        // remove loading spinner
        loadingIndicator.classList.remove('is-loading');
        // display successfully subbed
        submittedForm.reset();
        return feedbackModal("Thank you for subscribing! You will now receive updates on upcoming events.", "OK");
    }
}
