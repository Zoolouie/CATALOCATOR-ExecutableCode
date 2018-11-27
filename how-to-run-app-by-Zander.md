# CATALOCATOR-ExecutableCode

Hey guys! 

To give it a shot on your own machines:

1) Make sure you are in the correct directory

2) Command : node app.js

2.1) If the command doesn't work, you might have to run "npm install express"

3) Head over to local host http://localhost:4000

Try creating a profile for yourself. After this is done you should be able to see your 
data populate inside of the "See whats in the database" tab.

Here's a short description of what the files do:

store.js:

The most important file out of all of them. It took me a little while to fully understand exactly what this does, but
basically it corresponds to the add.ejs and list.ejs files, takes in the information obtained by the forms from
the ejs files, and queries the database with them. It looks like a lot of code - but the majority is error testing
and reloading the previous information given in case of wrong inputs. 

app.js:

This file controlls all of the database connections. Most of it I can't explain - but we most likely wont edit much in this
aside from the very end when we make things like login cookies. (Probably need a TAs help on this part).

Otherwise, we can leave for now.

add.ejs:

A file to add a users registration info and correspond it to store.js. This is the file where we will need to modify the HTML
(or something that looks like HTML!) so that it looks more like what the front end developed.

footer.ejs and header.ejs:

What will be displayed on every page - this should also be modified with the code the front end has already created.

edit.ejs:

A file that has yet to be modified / renamed. This is likely where login code will go.

Helpful Tips:
For some reason postgresql has no support for the '?' formatting. If you want to concatonate, you have to manually enter a
string as I did above.
