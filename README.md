# Hands On with React

These files are used for the "Hands On with React" presentation for UtahJS on January 21, 2014.

## Preparation

1. Install NodeJS and npm at [http://nodejs.org/download/](http://nodejs.org/download/)
2. Git checkout this repository. (git checkout https://github.com/kensnyder/hands-on-with-react.git)
3. Change to the new directory and run the following from the command line

```
npm install
npm install -g nodemon
nodemon server.js
// or just `node server`
```

Then visit [http://localhost:3000/](http://localhost:3000/). It should say that ExpressJS and socket.io are working.

## The presentation

During the presentation, we will modify /scripts/books-dev.jsx.

Before we get to the add books form, you can add books from the web console:

```javascript
socket.emit('AddBook', {
  title: 'Book Title',
  author: 'Great Author'
});
```

The final working example can be seen at [http://127.0.0.1:3000/final.html](http://127.0.0.1:3000/final.html). Open multiple tabs for the full effect.

