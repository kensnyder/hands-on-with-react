// start express and socket io
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// serve static files
app.use(express.static(__dirname));

// route our index.html as default page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

Object.values = function(o) {
	var vals = [];
	for (var k in o) {
		if (o.hasOwnProperty(k)) {
			vals.push(o[k]);
		}
	}
	return vals;
};

// list of books in our library, indexed by id
var books = {
	1: {
		id: 1,
		title: "The Design of Everyday Things",
		author: "Don Norman",
		holder: null
	}
};
// assign ids to our books
var id = 1;

io.sockets.on('connection', function (socket) {

	socket.emit('Connected');

	socket.emit('SetBooks', Object.values(books));

	var broadcastUpdate = function() {
		io.sockets.emit('SetBooks', Object.values(books));
	};

	socket.on('AddBook', function(book) {
		console.log('\n---\nadded book ' + book.title + '\n---\n');
		// add the book to our list with a new id
		book.id = ++id;
		book.holder = null;
		books[id] = book;
		// send the new list of books to all clients	
		broadcastUpdate();
	});

	socket.on('CheckoutBook', function(bookId, holder) {
		books[bookId].holder = holder;
		// send the new list of books to all clients
		broadcastUpdate();
	});

	socket.on('ReturnBook', function(bookId) {
		books[bookId].holder = null;
		// send the new list of books to all clients
		broadcastUpdate();
	});

	socket.on('DeleteBook', function(bookId) {
		delete books[bookId];
		// send the new list of books to all clients
		broadcastUpdate();
	});

});

server.listen(3000);