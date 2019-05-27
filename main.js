//Book Class: Represents a book
class Book{
	constructor(title, author, isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}
//UI Class: Handle UI Tasks
class UI {
	static displayBooks(){

		const books = Store.getBooks();

		books.forEach((book) => {
			UI.addBookToList(book);
		});
	}

	static addBookToList(book){
		const list = document.querySelector("#book-list");

		const row = document.createElement("tr");

		row.innerHTML = ` 
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;

		list.appendChild(row);
	}

	static clearText(){
		const title = document.querySelector("#title").value = "";
		const author = document.querySelector("#author").value = "";
		const isbn = document.querySelector("#isbn").value = "";
	}

	static removeBook(el){
		if(el.classList.contains('delete')){
			el.parentElement.parentElement.remove();
		}
	}

	static showMessage(message, className){
		const div = document.createElement("div");
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const form = document.querySelector("#book-form");
		const container = document.querySelector(".container");
		container.insertBefore(div, form);

		//Vanish 3 seconds
		setTimeout(() => {
			document.querySelector(".alert").remove()
		}, 3000);
	}
}

//Store Class: Handles Storage
class Store{
	static getBooks(){
		let books;
		if(localStorage.getItem("books") === null){
			books = [];
		}else{
			books = JSON.parse(localStorage.getItem('books'));

		}
		return books;
	}

	static addBook(book){
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn){
		const books = Store.getBooks();

		books.forEach((book, index) => {
		  if(book.isbn === isbn){
		  	books.splice(index, 1);
		  }
		});

		localStorage.setItem("books", JSON.stringify(books));
	}
}

//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);
//Event: Add a book
document.querySelector("#book-form").addEventListener('submit', (e)=>{
	e.preventDefault();
	const title = document.querySelector("#title").value;
	const author = document.querySelector("#author").value;
	const isbn = document.querySelector("#isbn").value;

	const book = new Book(title, author, isbn);
	
	//Validate
	if(title == "" || author == "" || isbn == ""){
		UI.showMessage("Field is not require", "danger");
	}else{
		//Add a book
		UI.addBookToList(book);

		//Add book to store
		Store.addBook(book);

		//Add success
		UI.showMessage("Add a book success", "success");

		//Clear text
		UI.clearText();
	}
});
//Event: Remove a book
document.querySelector("#book-list").addEventListener('click', (e) => {
	e.preventDefault();

	//Remove UI book
	UI.removeBook(e.target);

	//Remove book from store
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	//Alert message
	UI.showMessage("Remove a book message", "success");
});