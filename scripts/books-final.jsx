/** @jsx React.DOM */

// A component representing a single book in the list of books
// By naming it `Book` we can now specify <Book /> as an element
// <Book /> takes one property: `book`
// The `book` property should be an object with properties id, title, author, and holder
var Book = React.createClass({
  // A component's `render` method should return an object
  // By using JSX, our object is defined with pseudo HTML
  render: function() {
    // The component's properties are the values of the attributes passed from the parent
    // So if a parent specifies <Book name="foo" /> then this.props.name === "foo"
    var book = this.props.book;
    return (
      <tr>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td>{book.holder}</td>
        <td>
          {/* 
            the `ref` property is special
            it allows us to quickly access that node later

            the `onClick` property is special
            it attaches a click handler that runs in the context of this component
           */}
          <a href="#" ref="checkout" onClick={this.checkoutBook}>Checkout book</a>
          <a href="#" ref="delete" onClick={this.deleteBook}>Delete book</a>
          <a href="#" ref="return" onClick={this.returnBook}>Return book</a>
        </td>
      </tr>
    );
  },
  // After the component is inserted into the DOM ("mounted"), componentDidMount is called
  // It receives one argument: the component's HTMLElement
  componentDidMount: function(tr) {
    // when we first render, we need to decide which action links to show
    this.showActions();
  },
  // It receives three arguments: the previous properties, the previous state, and the component's HTMLElement
  componentDidUpdate: function(prevProps, prevState, tr) {
    // when we update any values, we need to decide which action links to show
    this.showActions();
  },
  // This is our custom method for showing and hiding action links
  // based on who the holder is
  showActions: function() {
    // if the book is checked out, hide the checkout and delete actions
    if (this.props.book.holder) {
      this.refs.checkout.hide();
      this.refs.delete.hide();
    }
    else {
      this.refs.delete.show();
      this.refs.checkout.show();
    }
    // allow the user to return the book if they checked it out
    if (this.props.book.holder == username) {      
      this.refs.return.show();
    }
    else {
      this.refs.return.hide();
    }
  },
  // event triggered by clicking the checkout link
  // sends a `CheckoutBook` event to the server using socket.io
  checkoutBook: function(event) {
    event.preventDefault();
    socket.emit('CheckoutBook', this.props.book.id, username);
  },
  // event triggered by clicking the delete link
  // sends a `DeleteBook` event to the server using socket.io
  deleteBook: function(event) {
    event.preventDefault();
    socket.emit('DeleteBook', this.props.book.id);
  },
  // event triggered by clicking the return link
  // sends a `ReturnBook` event to the server using socket.io
  returnBook: function(event) {
    event.preventDefault();
    socket.emit('ReturnBook', this.props.book.id);
  }
});

// A component representing the form for adding a new book
// By naming it `BookForm` we can now specify <BookForm /> as an element
// <BookForm /> takes no properties
var BookForm = React.createClass({
  render: function() {
    return (
      <div>{/* we have to have this div here because JSX can have only one element */}
        <h2>Add Book</h2>
      {/* 
        `onSubmit` is special
        it binds this component's `handleSubmit` method to form submission
      */}
        <form onSubmit={this.handleSubmit}>
          <input ref="title" type="text" placeholder="Title" />
          <input ref="author" type="text" placeholder="Author" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  },
  // this is the handler specified in onSubmit above
  handleSubmit: function(event) {
    // don't actually submit the form
    event.preventDefault();
    // get references to the title field and author field
    var title = this.refs.title.getDOMNode();
    var author = this.refs.author.getDOMNode();
    // tell the server to add a new book
    socket.emit('AddBook', {
      title: title.value,
      author: author.value
    });
    // clear out our text inputs
    title.value = '';
    author.value = '';
    // focus to the first input
    title.focus();
  }
});

// A component representing a list of books
// By naming it `BookList` we can now specify <BookList /> as an element
// <BookList /> takes no properties, it is loaded via socket.io
var BookList = React.createClass({
  // this method is special because it returns the state
  // that should be used before any state is set
  getInitialState: function() {
    return {books: []};
  },
  // render the table and list of books
  render: function() {
    return (
      <div>
        <h1>Books</h1>
        <table>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Checked Out By</th>
              <th>Actions</th>
            </tr>
            {/*
              Now this is crazy:
              We can run `map` on our state
              And return JSX pseudo HTML from a callback!
            */}
            {this.state.books.map(function(book) {
              return <Book key={book.id} book={book} />
            })}     
        </table>
        <hr />
        {/* And here's the form to add a book */}
        <BookForm />     
      </div>
    );
  },
  // after rendering, listen for `SetBooks` signal from server
  componentDidMount: function() {
    // get a reference to this components for the callback below
    var component = this;
    // update state when books are updated
    socket.on('SetBooks', function(books) {
      component.setState({books:books});
    });
  }
});

// additional methods for ReactDOMComponents
var ReactDOMComponent = React.__internals.DOMComponent;

ReactDOMComponent.prototype.hide = function() {
  this.getDOMNode().style.display = 'none';
};
ReactDOMComponent.prototype.show = function() {
  this.getDOMNode().style.display = '';
};

var socket = io.connect('http://127.0.0.1:3000');

// When socket connects, render component
socket.on('Connected', function() {
  React.renderComponent(
    <BookList />,
    document.getElementById('booklist')
  );
});

// handle user's name
var username = localStorage.getItem('HolderName');
if (!username) {
  username = prompt("Enter your name in case you want to check out a book");
  if (!username) {
    username = 'Anonymous ' + Math.ceil(Math.random() * 100);
    alert("Ok then, we'll call you " + username);
  }
  localStorage.setItem('HolderName', username);
}
