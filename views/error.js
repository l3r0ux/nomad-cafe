// Error template to generate error page for page not found and login errors.
// All other errors are handled with popup messages because of the async fetch requests
// Errors are sent the error back to the fetch response
// But only for page not found and login errors does it show error page

const layout = require('./layout');

// Use onclick on anchor tag here to take user back to previous url they were at
module.exports = function errorTemplate({ error }) {
    return layout({
        content: `
        <nav>
            <p>Nomad Cafe</p>
        </nav>
        <main>
            <section>
                <img src="/images/logo_ubgkoi.png"
                    alt="logo">
                <p>${error}</p>
                <a href="https://nomadcafe.herokuapp.com/admin">Back to main site</a>
            </section>
        </main>
    `});
}