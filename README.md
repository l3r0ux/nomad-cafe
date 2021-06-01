# nomad-cafe

## About this project:
This is a fullstack web application that I made for a friend using Node.js with express and MongoDB with mongoose on the backend.
I wrote everything from scratch with vanilla html, css and javascript on the front end. I followed the MVC architecture for the routes.
This web app was designed from a mobile first perspective and is fully responsive.
Please note, when changing the screen size on the fly, be sure to reload the page when breakpoints are reached so that the Javascript can be reloaded.

Cloudinary is used to store the images that the admin dynamically uploads for menu items, events etc.
I used mapbox for the map and the JavaScript Geolocation API to get the admins current coordinates, then add them to the database and render the map.

There is no page reloading when the admin adds a new menu item, event, location etc. This is all done using the Javascript Fetch API and DOM Manipulation.
Event listeners for deleting or updating the dynamically rendered items also needed to be delegated.
I also implemented an authentication system with express sessions and cookies for the admin to log in.
The admins' password are also hashed and salted for extra security.

Sending emails is done using the SendGrid API.
I also implemented a subscription system, so that users get notified when a new event is added, edited or removed, with that specific events details.
There is also an unsubscribe function which deleted the specific user from the database.

There is also server side input validation and sanitization on all inputs using the Express-Validator package.
The validation errors are dynamically sent back to the front end asynchronously, and rendered at the appropriate input.
I also used Helmet.js for some added security. There is also extensive error handling with dynamically rendered error popups.

## Setting up the project on your local machine:
Since the app is deployed and only admin users can log in, you have to set the app up on your local machine in order to test the backend functionalities.
The following is a guide on how to get the app running on your local machine:

1. Download the source code.
2. Install node.js and mongodb if you do not have it already and make sure mongo server is running.
3. Open the project in your code editor of choice.
4. Run "npm install" to install all the dependencies for the project.
5. Make a ".env" file at the top most level of the project folder, type the following, and save: (enter your own api keys where you see "your key")

code(SECRET=jysalnie
DBNAME=mongodb://localhost:27017/nomadCafe
MAPBOXTOKEN="your key"
SGMAIL="your key"
CLOUDINARY_CLOUD_NAME="your cloudinary account Cloud name"
CLOUDINARY_KEY="your cloudinary API key"
CLOUDINARY_SECRET="your cloudinary secret"
MONGOSTORESECRET=a-nee-a)

To get the API keys and setup:
Mapbox:
Create a mapbox account or log in, and use the "Default public token" as the api key for the .env file.
SGMail(sendgrid):
Go to sendgrid.com and create an account or log in, then go to settings -> API keys -> Create API key. Use that API key in the .env file.
Cloudinary:
Create a cloudinary account or log in. On your dashboard, copy the cloud name, api key and api secret into the appropriate field in the .env file.

Creating an admin profile locally:
Since the nature of the app is such that there will be only a couple of admin users, and normal users can't create their own profiles,
you have to create your own admin profile manually in order to log in and add menu items, events, location etc.
You can achieve it like this:
Go to the controllers folder and open auth.js, comment in line 27-30.
Run the server by typing "npm start" in your terminal and open the app in the browser on localhost:3000, or whichever port it is served on on your local machine.
Scroll all the way down to the footer and click on "admin login". Enter the username and password of the account you would like to create, and click log in.
This will now create the account in your local mongo database, with your password hashed and salted with the bcrypt package.
Go back to your code editor and re-comment line 27-30 again, save, and restart the server.
Go back to the website and refresh the page, you should be logged into the admin panel now.

Configuring SendGrid to allow for receiving emails to your own address:
For sendgrid, you must create a verified single sender.
Go to your sendgrid account -> settings -> Sender Authentication, then click on verify a single sender.
Add the email address you want the emails to be sent from and fill out the rest of the fields.
Go to the nomadcafe files -> controllers -> subscriber.js, then change line 25 "from" field to the sender you just verified,
and on line 23 add the email address you want to recieve the email sent by the sender.
Also go to the event.js file in the same folder, and on line 55, 113 and 149, change the "from" email address to the single sender you verified.
Now you should be able to enter an email on the website, hit send, and you should recieve the email.
You can also subscribe with the subscribe form, then if the admin adds an event, the subscriber will recieve an email with the details of that event.
The subscriber can also unsbuscribe from the email service, which removes them from the database.
For this to work, you must go to the views folder -> unsubscribed.html -> line 58, 116 and 152 and change "https://nomadcafe.herokuapp.com/subscriber/delete/${subscriber.token}" to "http://localhost:3000/subscriber/delete/${subscriber.token}".
And in the views folder -> unsubscribed.html -> line 24 -> change "https://nomadcafe.herokuapp.com/" to "http://localhost:3000/" so that you go back to the locally served website instead of the deployed version.
