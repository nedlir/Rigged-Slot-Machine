# Rigged Casino Machine

### Overview
A rigged casino machine implemented using the MERN stack.

### Technologies Used

I decided to go with the MERN stack (MongoDB, Express framework, React and NodeJS) stack since I recently started learning working with it as part of the [Fullstack Open](https://fullstackopen.com/en/about/) course offered by the University of Helsinki.

### Structure

I will be dividing the project into 2 main directories - client and server.

### Development Process

1. Created a basic client and server that communicate with each other. For now all they pass is the number of credits the player has.

*For the server, I chose Express because it simplifies error handling and provides a better abstraction that enhances code readability.

*For the client, I chose axios librrary for communication for similar reasons of choosing Express. [This article](https://tkdodo.eu/blog/why-you-want-react-query) convinced me to use react-query to make the code even more abstract and to avoid using 'useEffect' hook in react which adds a lot of "sphagetti" to the code and makes it less readable.

2. Finished making the basic functionality of the client. It can now roll the slots randomly (for now, it is still fair...), added buttons for starting the game, rolling, cash out and buying more credits. For now, some of the buttons do nothing beside printing to console, but will be communicating later with the backend. Applied minimalistic CSS to make it somewhat presentable. 
TODO in client: 
- Adjust functions to work with server, move the generation of the results of fruits to server, add logging of cashouts and losts to server, etc.
- Add rotation animations with delay.
- Refactor code to smaller components and separate files.