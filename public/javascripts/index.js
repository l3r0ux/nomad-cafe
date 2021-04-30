// ---------- VARIABLES AND ELEMENTS ----------
const loadingIndicator = document.getElementById('loading-indicator__container');
// Navbar
const navbar = document.getElementById('navbar');
const navTags = document.querySelectorAll('#nav-items a');
const navDisplay = document.querySelector('#nav-items');
const hamburger = document.getElementById('hamburger');
const prevScreen = document.querySelectorAll('.prev-screen');
const nextScreen = document.querySelectorAll('.next-screen');
const footer = document.querySelector('#footer');
const closeFooter = document.querySelector('#close-footer');


// All pages
const pages = document.querySelectorAll('.page-helper');
const mapLocation = document.getElementById('location-page__map');

// Side scroll windows
const menuSideScrollWindow = document.querySelector('#menu-page .side-scroll-window');
const eventsSideScrollWindow = document.querySelector('#events-page .side-scroll-window');
const gallerySideScrollWindow = document.querySelector('#gallery-page .side-scroll-window');
const locationSideScrollWindow = document.querySelector('#location-page .side-scroll-window');
// Get this only for specified amount the menu window should scroll in desktop mode
// const menuScrollWindowItem = document.querySelector('#menu-page .side-scroll-window__item');
// Get this for the rest of the smaller windows side scrolling amount
const locationScrollWindowItem = document.querySelector('#location-page .side-scroll-window__item');

// Side scroll window navigation
const eventsScrollLeftAndRight = document.querySelector('#events-page .scroll-left-and-right');
const galleryScrollLeftAndRight = document.querySelector('#gallery-page .scroll-left-and-right');
const menuScrollRightArrow = document.getElementById('menu-right');
const menuScrollLeftArrow = document.getElementById('menu-left');
const eventsScrollRightArrow = document.getElementById('events-right');
const eventsScrollLeftArrow = document.getElementById('events-left');
const galleryScrollRightArrow = document.getElementById('gallery-right');
const galleryScrollLeftArrow = document.getElementById('gallery-left');

// Form toggle buttons
const formToggleButtons = document.querySelectorAll('.form-toggle__buttons');
const contact = document.querySelector('#contact-section');
const subscribe = document.querySelector('#email-section');

// Contact and subscribe Forms
const contactForm = document.getElementById('contact-form');
const subscribeForm = document.getElementById('subscribe-form-container');
const contactAndSubscribe = document.querySelectorAll('#contact-page form');

let welcomePagePos2;
let menuPagePos3;
let eventsPagePos4;
let galleryPagePos5;
let locationPagePos6;
let contactPagePos7;
let scrollAmount;
let prevScrollPos = window.pageYOffset;
let eventRects;
let galleryRects;
let locationRects;

// ---------- HELPER FUNCTIONS ----------
// Nav highlighting logic
const navHighlightLogic = () => {
    for (let i = 0; i < navTags.length; i++) {
        // For down scrolls - Adding highlight class if window scroll pos is between the respective zone
        if (window.scrollY >= window.innerHeight * i) {
            navTags[i].classList.add('nav-highlight');
            if (navTags[i - 1]) {
                navTags[i - 1].classList.remove('nav-highlight');
            }
        }
        // For up scrolls - only removing if also already contains highlight class
        else if ((window.scrollY < window.innerHeight * i) && navTags[i].classList.contains('nav-highlight')) {
            navTags[i].classList.remove('nav-highlight');
        }
    }
}

// Nav scrolling helper function
const scrollToPage = (pageNumber) => {
    window.scrollTo(0, window.innerHeight * pageNumber);
}

// slide in animation helper function
const slideInAnimationHelper = (sideScrollWindowRects, sideScrollWindow, sideScrollWindowScroll, margin, opacity) => {
    if ((sideScrollWindowRects.top - sideScrollWindow.offsetTop - sideScrollWindow.offsetHeight) <= 0) {
        sideScrollWindow.style.margin = margin;
        sideScrollWindow.style.opacity = opacity;
        if (sideScrollWindowScroll != null) {
            sideScrollWindowScroll.style.margin = margin;
            sideScrollWindowScroll.style.opacity = opacity;
        }
    }
}

// arrow fade helper function
const arrowFadeHelper = (scrollWindow, leftArrow, rightArrow, item) => {
    if (scrollWindow.scrollLeft <= 0) {
        leftArrow.style.opacity = "0";
        leftArrow.style.cursor = "default";
    } else {
        leftArrow.style.opacity = "1";
        leftArrow.style.cursor = "pointer";
    }

    if ((scrollWindow.scrollWidth - item.scrollWidth - 5) <= scrollWindow.scrollLeft) {
        rightArrow.style.opacity = "0";
        rightArrow.style.cursor = "default";
    } else {
        rightArrow.style.opacity = "1";
        rightArrow.style.cursor = "pointer";
    }
}

// HTML generation for appending modal forms and feedback
// email-form__contact
// subscribe-form__contact
// style here is the optional parameter
// Possibly use for admin popups aswell?
const feedbackModal = (message, buttonMessage, style = "style=''") => {
    const appendLocation = document.querySelector('body');
    const container = document.createElement('div');
    container.className = 'popup-helper__container';
    container.innerHTML = `<div ${style} class='popup-helper__contents'><p>${message}</p><button>${buttonMessage}</button></div>`
    container.addEventListener('click', function closePopup(e) {
        if (e.target) {
            container.remove();
        }
        container.removeEventListener('click', closePopup);
    })
    appendLocation.append(container);
}

// Helper function to display validation errors
const validationFeedback = function (errors, submittedForm) {
    // Get each field based on its param field and tie the message to it
    // so that i am able to append msg to the inputs location
    // Get submitted forms id so can select correct set of inputs with same names
    submittedName = submittedForm.name;
    let inputs = [];
    errors.forEach(function(err, i) {
        let input = document.querySelector(`#${submittedName} [name='${errors[i].param}']`);
        inputs.push({ input: input, msg: `${errors[i].msg}` });
    })
    // append msg to input
    inputs.forEach((input) => {
        let appendLocation = input.input;
        let parent = appendLocation.parentElement;
        let container = document.createElement('div');
        container.classList.add('validation-feedback__faded');
        container.style.top = `${appendLocation.offsetTop + appendLocation.offsetHeight}px`;
        container.style.left = `${appendLocation.getBoundingClientRect().left + appendLocation.offsetWidth / 5.5}px`;
        container.innerHTML = input.msg;
        requestAnimationFrame(() => {
            container.style.top = `${appendLocation.offsetTop + appendLocation.offsetHeight}px`;
            // container.classList.remove('validation-feedback_faded')
            container.classList.add('validation-feedback');
        })

        setTimeout((() => {
            container.classList.remove('validation-feedback');
            container.classList.add('validation-feedback__faded');
        }), 3000)

        setTimeout(() => {
            container.remove()
        }, 4500)

        container.addEventListener('click', function (e) {
            this.classList.remove('validation-feedback');
            this.classList.add('validation-feedback__faded');
            setTimeout(() => {
                container.remove();
            }, 500)
        })

        parent.insertBefore(container, appendLocation.nextSibling);
    })
}

// ---------- PAGE INITIALIZATION ----------
navHighlightLogic();
// To get all data initially
getMenu();
getEvents();
getGallery();
getLocation();


// MUTATION OBSERVER FOR SIDE SCROLL WINDOWS FOR ARROW FADING AND DISPLAYING CORRECT CONTENT
const config = { childList: true };
// Callback functions to execute when mutations are observed in each respective side scroll window
const menuCallback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const menuScrollWindowItem = document.querySelector('#menu-page .side-scroll-window__item');

            // Menu side scolling
            menuScrollRightArrow.addEventListener('click', (_) => {
                scrollAmount = menuScrollWindowItem.scrollWidth;
                menuSideScrollWindow.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth',
                })
            });
            menuScrollLeftArrow.addEventListener('click', (_) => {
                scrollAmount = menuScrollWindowItem.scrollWidth;
                menuSideScrollWindow.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth',
                });
            });


            // Menu Arrow fading on load and scroll
            arrowFadeHelper(menuSideScrollWindow, menuScrollLeftArrow, menuScrollRightArrow, menuScrollWindowItem);
            menuSideScrollWindow.addEventListener('scroll', (_) => {
                arrowFadeHelper(menuSideScrollWindow, menuScrollLeftArrow, menuScrollRightArrow, menuScrollWindowItem);
            });
        }
    }
};
const eventCallback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const eventScrollWindowItem = document.querySelector('#events-page .side-scroll-window__item');

            // Events side scrolling
            eventsScrollRightArrow.addEventListener('click', (_) => {
                scrollAmount = eventScrollWindowItem.scrollWidth;
                eventsSideScrollWindow.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth',
                });
            });
            eventsScrollLeftArrow.addEventListener('click', (_) => {
                scrollAmount = eventScrollWindowItem.scrollWidth;
                eventsSideScrollWindow.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth',
                });
            });

            // Event Arrow fading on load and scroll
            arrowFadeHelper(eventsSideScrollWindow, eventsScrollLeftArrow, eventsScrollRightArrow, eventScrollWindowItem);
            eventsSideScrollWindow.addEventListener('scroll', (_) => {
                arrowFadeHelper(eventsSideScrollWindow, eventsScrollLeftArrow, eventsScrollRightArrow, eventScrollWindowItem);
            });
        }
    }
};
const galleryCallback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const galleryScrollWindowItem = document.querySelector('#gallery-page .side-scroll-window__item');

            // Gallery side scrolling
            galleryScrollRightArrow.addEventListener('click', (_) => {
                scrollAmount = galleryScrollWindowItem.scrollWidth;
                gallerySideScrollWindow.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth',
                });
            });
            galleryScrollLeftArrow.addEventListener('click', (_) => {
                scrollAmount = galleryScrollWindowItem.scrollWidth;
                gallerySideScrollWindow.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth',
                });
            });

            // Gallery Arrow fading on load and scroll
            arrowFadeHelper(gallerySideScrollWindow, galleryScrollLeftArrow, galleryScrollRightArrow, galleryScrollWindowItem);
            gallerySideScrollWindow.addEventListener('scroll', (_) => {
                arrowFadeHelper(gallerySideScrollWindow, galleryScrollLeftArrow, galleryScrollRightArrow, galleryScrollWindowItem);
            });
        }
    }
};
// Create a observer instances linked to the callback functions
const menuObserver = new MutationObserver(menuCallback);
const eventObserver = new MutationObserver(eventCallback);
const galleryObserver = new MutationObserver(galleryCallback);
// Start observing the target nodes for configured mutations
menuObserver.observe(menuSideScrollWindow, config);
eventObserver.observe(eventsSideScrollWindow, config);
galleryObserver.observe(gallerySideScrollWindow, config);


// ---------- EVENT LISTENERS ----------
// Toggle active form button class
// // Toggle hiding forms
formToggleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        formToggleButtons.forEach(button => {
            button.classList.remove('form-button__toggled');
        });
        button.classList.add('form-button__toggled');
        if (e.target.id === 'email-section') {
            contactForm.classList.add('hide-form');
            subscribeForm.classList.remove('hide-form');
        } else {
            subscribeForm.classList.add('hide-form');
            contactForm.classList.remove('hide-form');
        }
    });
});

// to show and hide nav
hamburger.addEventListener('click', () => {
    navDisplay.classList.toggle('mobile-nav__visible');
    hamburger.classList.toggle('hamburger-rotate');
});

// to scroll to previous page
prevScreen.forEach((prev, i) => {
    prev.addEventListener('click', () => {
        scrollToPage(i);
    });
});
nextScreen.forEach((next, i) => {
    next.addEventListener('click', () => {
        scrollToPage(i + 1);
    });
});

// to scroll to each page respective by clicking on the links in the navbar
navTags.forEach((tag, i) => {
    tag.addEventListener('click', () => {
        scrollToPage(i)
    });
});

closeFooter.addEventListener('click', () => {
    window.scrollBy(0, -footer.scrollHeight)
})

// for switching between tablet portrait and landscape, that slide in animations don't break
window.addEventListener('resize', () => {
    // if switch from portrait to landscape, have side scroll windows in final position
    if (window.innerWidth >= 1024 && window.innerWidth < 1360) {
        eventsSideScrollWindow.style.margin = '0 7% 0 auto';
        eventsSideScrollWindow.style.opacity = '1';
        eventsScrollLeftAndRight.style.margin = '0 7% 0 auto';
        gallerySideScrollWindow.style.margin = '0 auto 0 7%';
        gallerySideScrollWindow.style.opacity = '1';
        galleryScrollLeftAndRight.style.margin = '0 auto 0 7%';
        locationSideScrollWindow.style.margin = '0 7% 0 auto';
        locationSideScrollWindow.style.opacity = '1';
        // if switch back to portrait, set styles correctly again that might have been left from not scrolling yet if enter site in landscape mode
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        eventsSideScrollWindow.style.margin = '0';
        eventsScrollLeftAndRight.style.margin = '0';
        gallerySideScrollWindow.style.margin = '0';
        galleryScrollLeftAndRight.style.margin = '0';
        locationSideScrollWindow.style.margin = '0';
    }

    // Hide navbar when device flips, primarily for navbar to not be in way for admin
    if (window.innerHeight < 420) {
        navbar.classList.add('hide-navbar');
    }

    // Dynamically set the pages' true height based on window height
    // Mobile browser top bar alters the size of the window page
    if (!(window.innerHeight <= 360 && window.innerWidth <= 360)) {
        let r = document.querySelector(':root');
        r.style.setProperty('--window-height', window.innerHeight + "px");
    }
});

// Just reload all styles to solve bug where images would not load to fill up entire side scroll window container
// window.addEventListener('orientationchange', () => {
//     window.location.reload();
// });

// For all scroll events
window.addEventListener('scroll', () => {
    // navbar hiding logic, only for mobile devices
    if (window.innerWidth < 1024) {
        let currentScrollPos = window.pageYOffset;
        if (currentScrollPos > prevScrollPos) {
            // navbar.classList.add('hide-navbar');
            navDisplay.classList.remove('mobile-nav__visible');
            hamburger.classList.remove('hamburger-rotate');
        } else {
            // navbar.classList.remove('hide-navbar');
            navDisplay.classList.remove('mobile-nav__visible');
            hamburger.classList.remove('hamburger-rotate');
        }
        prevScrollPos = currentScrollPos;
    }

    // side scroll window slide and fade in logic for landscape mode tablet and desktop devices
    eventRects = eventsSideScrollWindow.getBoundingClientRect();
    galleryRects = gallerySideScrollWindow.getBoundingClientRect();
    locationRects = locationSideScrollWindow.getBoundingClientRect();

    if (window.innerWidth >= 1024 && window.innerWidth < 1360) {
        slideInAnimationHelper(eventRects, eventsSideScrollWindow, eventsScrollLeftAndRight, '0 7% 0 auto', '1');
        slideInAnimationHelper(galleryRects, gallerySideScrollWindow, galleryScrollLeftAndRight, '0 auto 0 7%', '1');
        slideInAnimationHelper(locationRects, locationSideScrollWindow, null, '0 7% 0 auto', '1');
    }

    if (window.innerWidth >= 1360 && window.innerWidth < 3440) {
        slideInAnimationHelper(eventRects, eventsSideScrollWindow, eventsScrollLeftAndRight, '0 15% 0 auto', '1');
        slideInAnimationHelper(galleryRects, gallerySideScrollWindow, galleryScrollLeftAndRight, '0 auto 0 15%', '1');
        slideInAnimationHelper(locationRects, locationSideScrollWindow, null, '0 15% 0 auto', '1');
    }

    if (window.innerWidth >= 3440) {
        slideInAnimationHelper(eventRects, eventsSideScrollWindow, eventsScrollLeftAndRight, '0 25% 0 auto', '1');
        slideInAnimationHelper(galleryRects, gallerySideScrollWindow, galleryScrollLeftAndRight, '0 auto 0 25%', '1');
        slideInAnimationHelper(locationRects, locationSideScrollWindow, null, '0 25% 0 auto', '1');
    }

    navHighlightLogic();
});

// FOR FIX OF PHONE CHANGING DEVICE HEIGHT
let r = document.querySelector(':root');
r.style.setProperty('--window-height', window.innerHeight + "px");
var rs = getComputedStyle(r);

// Email sending and subscribing logic
for (let form of contactAndSubscribe) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let submittedForm = e.target;
        // Contact Form
        if (submittedForm.id === 'contact-form') {
            // Make formdata object with form fields
            let formData = new FormData(submittedForm);
            // remove loading spinner
            loadingIndicator.classList.add('is-loading');
            // send email. This function handles errors aswell
            // Uses "feedbackModal()" function with correct args to render correct popup
            sendCustomerInquiry(formData, submittedForm);
        }
        // Subscribe Form
        else if (submittedForm.id === 'subscribe-form') {
            let formData = new FormData(submittedForm);
            // remove loading spinner
            loadingIndicator.classList.add('is-loading');
            subscribeCustomer(formData, submittedForm);
        }
    });
}