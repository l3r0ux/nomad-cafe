# Nomad Cafe
https://nomadcafe.herokuapp.com/

## About this project:
This is a fullstack web application that I made for a mobile coffee business using Node.js with express and MongoDB with mongoose on the backend. The owner can log into an admin panel, where they can add their menu, events where they are going to be, gallery images and their exact location for when they are at an event. 
I wrote everything from scratch with vanilla html, css and javascript on the front end. I followed the MVC architecture for the routes.
This web app was designed from a mobile first perspective and is fully responsive.
Please note, when changing the screen size on the fly, be sure to reload the page when breakpoints are reached so that the Javascript can be reloaded.

Cloudinary is used to store the images that the admin dynamically uploads for menu items, events etc.
I used mapbox for the map and the JavaScript Geolocation API to get the admins current coordinates, then add them to the database and render the map.

There is no page reloading when the admin adds a new menu item, event, location etc. This is all done using the Javascript Fetch API and DOM Manipulation.
Event listeners for deleting or updating the dynamically rendered items also needed to be delegated.
I also implemented an authentication system with express sessions and cookies for the admin to log in.
The admins' password are also hashed and salted for extra security.

Sending emails is done using the SendGrid API. Users can use the contact form to send an email to the business email address of the owner of the app.
I also implemented a subscription system, so that users who are subscribed get notified when a new event is added, edited or removed, with that specific events details.
There is also an unsubscribe function which deletes the specific user from the database.

There is also server side input validation and sanitization on all inputs using the Express-Validator package.
The validation errors are dynamically sent back to the front end asynchronously, and rendered at the appropriate input.
I also used Helmet.js for some added security. There is also extensive error handling with dynamically rendered error popups.

## Setting up the project on your local machine:
Since the app is deployed and only admin users can log in, you have to set the app up on your local machine in order to test the backend functionalities.
The following is a guide on how to get the app running on your local machine:

* Download the source code.
* Install node.js,  git and mongodb if you do not have it already and make sure mongo server is running.
* Open the project in your code editor of choice.
* Open a terminal on the top level of the project, and run "npm install" to install all the dependencies for the project.
* Make a ".env" file at the top most level of the project folder, type the following, and save: (enter your own api keys where you see "your key")

SECRET=jysalnie  
DBNAME=mongodb://localhost:27017/nomadCafe  
MAPBOXTOKEN="your key"  
SGMAIL="your key"  
CLOUDINARY_CLOUD_NAME="your cloudinary account Cloud name"  
CLOUDINARY_KEY="your cloudinary API key"  
CLOUDINARY_SECRET="your cloudinary secret"  
MONGOSTORESECRET=a-nee-a  


### To get the API keys and setup:
** Please note that at no point during account creation for these websites do you need to enter your banking credentials. All the API keys and email senders can be acquired without any payment. **
#### Mapbox:
Create a mapbox account or log in, and use the "Default public token" as the api key for the .env file.
#### SGMail(sendgrid):
Go to sendgrid.com and create an account or log in, then go to settings -> API keys -> Create API key. Use that API key in the .env file.
#### Cloudinary:
Create a cloudinary account or log in. On your dashboard, copy the cloud name, api key and api secret into the appropriate field in the .env file.

### Creating an admin profile locally:
Since the nature of the app is such that there will be only a couple of admin users, and normal users can't create their own profiles,
you have to create your own admin profile manually in order to log in and add menu items, events, location etc.  
You can achieve it like this:  
* Go to the controllers folder and open auth.js, comment in line 27-30.
* Run the server by typing "npm start" in your terminal and open the app in the browser on localhost:3000, or whichever port it is served on on your local machine.
* Scroll all the way down to the footer and click on "admin login". Enter the username and password of the account you would like to create, and click log in.  
This will now create the account in your local mongo database, with your password hashed and salted with the bcrypt package.
* Go back to your code editor and re-comment line 27-30 again, save, and restart the server.
* Go back to the website and refresh the page, you should be logged into the admin panel now.  
At first there won't be any menu items or anything on display since the database is empty, but now you can add, edit or remove menu items, events, gallery photos or the location.  
See the next section on how to set up the email system that you receive the emails.  

### Configuring SendGrid to allow for receiving emails to your own address:
You need to create your own verified sender on SendGrid.  
* Go to your SendGrid profile -> Settings -> Sender Authentication, and fill out the fields to create a new verified sender.
* Once the sender is verified, go to the nomadcafe files -> controllers -> subscriber.js, on line 25 replace the "from" field with the email address of the sender you just verified. On line 23 add the email address you want to recieve the emails sent by the sender.
Now you should be able to enter an email on the website, hit send, and you should recieve the email.   
For the unsubscribing to work correctly when app is running locally:  
* Go to the views folder -> unsubscribed.html -> line 58, 116 and 152 and change `https://nomadcafe.herokuapp.com/subscriber/delete/${subscriber.token}` to `http://localhost:3000/subscriber/delete/${subscriber.token}`.
* And in the views folder -> unsubscribed.html -> line 24 -> change `https://nomadcafe.herokuapp.com/` to `http://localhost:3000/` so that you go back to the locally served website instead of the deployed version.  
To test out the subscription system, enter your email address in the subscribe form on the website, then add, edit or delete an event.  
You should get the email with the corresponding event details you added. 
