// Layout to put different templates in for the page not found error, login error and delete subscriber error
module.exports = ({ content }) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" href="https://res.cloudinary.com/djkyfcfl1/image/upload/v1616580427/NomadCafe/logo_ubgkoi.png">
            <link rel="stylesheet" href="/css/error.css">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap" rel="stylesheet">
            <title>Error</title>
        </head>
        
        <body>
            ${content}
        </body>
        
        </html>
    `;
}