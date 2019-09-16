Andrew Markoski

Glitch link: http://a3-amarkoski.glitch.me

## Note Keeper

This program uses Node.js to allow users to create an account and add, modify, and delete a note with a title and a body. I faced many challenges with this project, such as getting login authentication to work and working with lowdb. I used passport-local for authentication since it seemed to be more documented and straight forward than alternatives. I used lowdb since it is a small database that works well with Node.js without much setup. I used bootstrap as a CSS framework because it is very widely used and well documented. I made some slight modifications to the CSS such as making the results hidden initially and centering the content on the login page. 

I used 5 middleware packages for this program.
1. Body-parser: assists with accessing the body of JSON requests
2. Express-session: creates a session for cookies to record session ID
3. Passport: used for authentication of users
4. Serve-favicon: sets up favicon for web page
5. Cookie-parser: Can access and modify cookie information for the current session

NOTE: The buttons for loading data for a given user and showing the results of all users intentionally excludes passwords. User data can be found in db.json.

Instructions:

Dependencies:
npm install:
  - express
  - lowdb
  - express-session
  - serve-favicon
  - cookie-parser

Button descriptions:
- Save: saves note title and body into database for specific user
- Load: loads saved title and body from database for specific user into input fields
- Delete: deletes records of saved title and body from database for specific user
- All results: displays all notes for all users

## Technical Achievements
None

## Design/Evaluation Achievements
None
