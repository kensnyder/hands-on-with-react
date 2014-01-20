/** @jsx React.DOM */






/* some base code below */

// additional methods for ReactDOMComponents
// var ReactDOMComponent = React.__internals.DOMComponent;

// ReactDOMComponent.prototype.hide = function() {
//   this.getDOMNode().style.display = 'none';
// };
// ReactDOMComponent.prototype.show = function() {
//   this.getDOMNode().style.display = '';
// };

var socket = io.connect('http://127.0.0.1:3000');

socket.on('Connected', function() {
  document.getElementsByTagName('body')[0].innerHTML += '<p>socket.io is working.</p>';
});

// When socket connects, render component
// socket.on('Connected', function() {
//   React.renderComponent(
//     <BookList />,
//     document.getElementById('booklist')
//   );
// });

// handle user's name
// var username = localStorage.getItem('HolderName');
// if (!username) {
//   username = prompt("Enter your name in case you want to check out a book");
//   if (!username) {
//     username = 'Anonymous ' + Math.ceil(Math.random() * 100);
//     alert("Ok then, we'll call you " + username);
//   }
//   localStorage.setItem('HolderName', username);
// }
