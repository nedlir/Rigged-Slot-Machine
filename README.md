# Rigged Casino Machine

### Overview
A rigged casino machine implemented using the MERN stack.

### Technologies Used

I decided to go with the MERN stack (MongoDB, Express framework, React and NodeJS) stack since I recently started learning working with it as part of the [Fullstack Open](https://fullstackopen.com/en/about/) course offered by the University of Helsinki.

### Structure

I will be dividing the project into 2 main directories - client and server.

### Development Process

1. **COMMIT 86ab8b8**
   
Created a basic client and server that communicate with each other. For now all they pass is the number of credits the player has.

- For the server, I chose Express because it simplifies error handling and provides a better abstraction that enhances code readability.

- For the client, I chose axios librrary for communication for similar reasons of choosing Express. [This article](https://tkdodo.eu/blog/why-you-want-react-query) convinced me to use react-query to make the code even more abstract and to avoid using 'useEffect' hook in react which adds a lot of "sphagetti" to the code and makes it less readable.

2. **COMMIT 721730a**
   
  Finished making the basic functionality of the client. It can now roll the slots randomly (for now, it is still fair...), added buttons for starting the game, rolling, cash out and buying more credits. For now, some of the buttons do nothing beside printing to console, but will be communicating later with the backend. Applied minimalistic CSS to make it somewhat presentable. 

- I decided to use updater functions wherever a value that has state was modified. I find it more readable and easy to debug.

TODO in client: 
  - Adjust functions to work with server, move the generation of the results of fruits to server, add logging of cashouts and losts to server, etc.
  - Add rotation animations with delay.
  - Refactor code to smaller components and separate files.

3. **COMMIT 8ce9037**
   
Finished Server side logic and transfered the generation of the results there.

Since it wasn't specified in the task how to treat users I chose to keep track of users by their email that will be used as a unique key, for simplicity I did not use UUID as identifier and didn't apply any authentication methods.
The client can now, log in/register with their email (not checking for validity of the email string, so it can also be some reandom characters... will add react prototype later), then user can play the rigged slot machine. User can cash out, buy more credits once reached 0 and return to session with log in and maintain same number of credits.

The data is saved at server side as an array of objects containing email of the user and number of credits they have at the moment.

The problem with the current approach is that all of the data is stored in memory on the server in an array. If the server disconnects for some reason we will lose all our data... That's why the next step would be to move it all into a database. I'll probably stick with MongoDB since we have at the moment very simple data to store and don't need any relational database scheme.

Also, need to add animations to the client and apply small design finishes.

4. **COMMIT 14e0c7e**
Created a mongoDB server where all users are stored to, kept it simple for this task saving only the email and number of credits each user has (mongo by default also generated a UUID in the object).

Refactored the server code to smaller services - server, routes, controllers and db as suggested in [Node.js project architecture best practices](https://blog.logrocket.com/node-js-project-architecture-best-practices/).

Refactored the client to smaller components, used the extension for VSCode -  React Refactor to make it quicker.

The application is now basically fully functioning and working. Will add the rotation effect and tests.





