// Template to render for admin login if there are any username of password validation errors

// helper function to get error messages out
// ".mapped()" gives an array back as an object with they keys as the field names of errors
// and the values are the entire validation error objects for the corresponding name
// it comes from express-validator
// so we go through that entire object, and check the corresponding property's message field
const getError = (errors, property) => {
    try {
        return `<p id="validation-error">${errors.mapped()[property].msg}</p>`
    } catch (e) {
        return '';
    }
}

module.exports = ({ validationErrors }) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" href="/images/logo_ubgkoi.png">
            <link rel="stylesheet" href="/css/admin-login.css">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap" rel="stylesheet">
            <title>Admin Login</title>
        </head>
        
        <body>
            <main>
                <section>
                    <form action="/admin/login" method="POST" id="login-form">
                        <img src="/images/logo_ubgkoi.png" alt="logo">
                        ${getError(validationErrors, 'password')}
                        <label for="username">Username:</label>
                        
                        <input type="text" id="username" name="username">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password">
                        <button type="submit">Log In</button>
                        <a href="/">Back</a>
                    </form>
                </section>
            </main>
        </body>
        
        </html>
    `;
}