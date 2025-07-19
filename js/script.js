// Welcoming Speech with Dynamic Name
document.addEventListener('DOMContentLoaded', () => {
    const name = prompt('Please enter your name:');
    if (name) {
        document.getElementById('welcome-text')?.textContent = `Hi ${name}, Welcome To Website`;
    } else {
        document.getElementById('welcome-text')?.textContent = 'Hi Guest, Welcome To Website';
    }
});

// Contact Form Validation and Submission
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    if (name === '') {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
    } else {
        document.getElementById('name-error').textContent = '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email';
        isValid = false;
    } else {
        document.getElementById('email-error').textContent = '';
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('phone-error').textContent = 'Please enter a valid phone number (e.g., +628123456789)';
        isValid = false;
    } else {
        document.getElementById('phone-error').textContent = '';
    }

    if (message === '') {
        document.getElementById('message-error').textContent = 'Message is required';
        isValid = false;
    } else {
        document.getElementById('message-error').textContent = '';
    }

    if (isValid) {
        const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
        const contact = { name, email, phone, message, submitted_at: currentTime };
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        document.getElementById('submission-result').innerHTML = `
            <h3>Submission Result</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Submitted at:</strong> ${currentTime}</p>
        `;
        document.getElementById('submission-result').style.display = 'block';
        this.reset();
    }
});

// Book Manager Functions
let books = JSON.parse(localStorage.getItem('books')) || [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    if (sectionId === 'read') readBooks();
}

function validateISBN(isbn, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (!/^\d{13}$/.test(isbn)) {
        errorElement.textContent = 'ISBN must be a 13-digit number.';
        return false;
    }
    errorElement.textContent = '';
    return true;
}

function validateYear(year, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (!/^\d{4}$/.test(year)) {
        errorElement.textContent = 'Year must be a 4-digit number.';
        return false;
    }
    errorElement.textContent = '';
    return true;
}

function addBook() {
    const isbn = document.getElementById('add-isbn').value;
    const title = document.getElementById('add-title').value.trim().replace(/\b\w/g, c => c.toUpperCase());
    const author = document.getElementById('add-author').value.trim().replace(/\b\w/g, c => c.toUpperCase());
    const publisher = document.getElementById('add-publisher').value.trim().replace(/\b\w/g, c => c.toUpperCase());
    const year = document.getElementById('add-year').value;

    if (!validateISBN(isbn, 'add-isbn-error') || !validateYear(year, 'add-year-error')) return;
    if (!title || !author || !publisher) {
        alert('Please fill in all fields.');
        return;
    }

    if (books.find(book => book.ISBN === isbn)) {
        alert('ISBN already exists!');
        return;
    }

    books.push({ ISBN: isbn, Judul: title, Pengarang: author, Penerbit: publisher, TahunTerbit: year });
    localStorage.setItem('books', JSON.stringify(books));
    alert('Book added successfully!');
    document.getElementById('add').querySelectorAll('input').forEach(input => input.value = '');
    readBooks();
}

function readBooks() {
    const tableBody = document.getElementById('book-table-body');
    tableBody.innerHTML = '';
    books.sort((a, b) => a.ISBN.localeCompare(b.ISBN)).forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.ISBN}</td>
            <td>${book.Judul}</td>
            <td>${book.Pengarang}</td>
            <td>${book.Penerbit}</td>
            <td>${book.TahunTerbit}</td>
        `;
        tableBody.appendChild(row);
    });
}

function searchForEdit() {
    const isbn = document.getElementById('edit-isbn-search').value;
    const book = books.find(b => b.ISBN === isbn);
    const editForm = document.getElementById('edit-form');
    if (book) {
        editForm.style.display = 'block';
        document.getElementById('edit-isbn').value = book.ISBN;
        document.getElementById('edit-title').value = book.Judul;
        document.getElementById('edit-author').value = book.Pengarang;
        document.getElementById('edit-publisher').value = book.Penerbit;
        document.getElementById('edit-year').value = book.TahunTerbit;
    } else {
        editForm.style.display = 'none';
        alert('Book not found.');
    }
}

function saveEdit() {
    const isbn = document.getElementById('edit-isbn').value;
    const title = document.getElementById('edit-title').value.trim().replace(/\b\w/g, c => c.toUpperCase());
    const author = document.getElementById('edit-author').value.trim().replace(/\b\w/g, c => c.toUpperCase());
    const publisher = document.getElementById('edit-publisher').value.trim().replace(/\b\w/g, c => c.toUpperCase());
    const year = document.getElementById('edit-year').value;

    if (!validateISBN(isbn, 'edit-isbn-error') || !validateYear(year, 'edit-year-error')) return;
    if (!title || !author || !publisher) {
        alert('Please fill in all fields.');
        return;
    }

    const index = books.findIndex(b => b.ISBN === isbn);
    if (index !== -1) {
        books[index] = { ISBN: isbn, Judul: title, Pengarang: author, Penerbit: publisher, TahunTerbit: year };
        localStorage.setItem('books', JSON.stringify(books));
        alert('Changes saved successfully!');
        document.getElementById('edit-form').style.display = 'none';
        readBooks();
    } else {
        alert('Book not found.');
    }
}

function deleteBook() {
    const isbn = document.getElementById('delete-isbn').value;
    const index = books.findIndex(b => b.ISBN === isbn);
    if (index !== -1) {
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        alert('Book deleted successfully.');
        document.getElementById('delete-isbn').value = '';
        readBooks();
    } else {
        alert('Book not found.');
    }
}

function searchBook() {
    const isbn = document.getElementById('search-isbn').value;
    const book = books.find(b => b.ISBN === isbn);
    const resultDiv = document.getElementById('search-result');
    if (book) {
        resultDiv.innerHTML = `
            <h3>Book Found:</h3>
            <p><strong>Title:</strong> ${book.Judul}</p>
            <p><strong>Author:</strong> ${book.Pengarang}</p>
            <p><strong>ISBN:</strong> ${book.ISBN}</p>
            <p><strong>Publisher:</strong> ${book.Penerbit}</p>
            <p><strong>Year:</strong> ${book.TahunTerbit}</p>
        `;
        resultDiv.style.display = 'block';
    } else {
        resultDiv.innerHTML = '<p>Book not found.</p>';
        resultDiv.style.display = 'block';
    }
}
