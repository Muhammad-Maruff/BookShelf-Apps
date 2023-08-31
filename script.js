const inputBook = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("inputBook");
 
    submitForm.addEventListener("submit", function (event) {
        alert("Data Berhasil Disimpan!")
        event.preventDefault();
        addBook();
    });
    
    if(isStorageExist()){
        loadDataFromStorage();
    }
    
});

    
function addBook() {
    const inputJudul = document.getElementById("inputBookTitle").value;
    const inputPenulis = document.getElementById("inputBookAuthor").value;
    const inputTahun = document.getElementById("inputBookYear").value;
    const doneBook = document.getElementById("inputBookIsComplete").checked;

  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputJudul, inputPenulis, inputTahun, doneBook, false);
    inputBook.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 }

 function generateId() {
    return +new Date();
}

function makeBook(bookObject) {
 
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;
  
    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookObject.author;
    
    const textYear = document.createElement("p");
    textYear.innerText = bookObject.year
    
    const textContainer = document.createElement("div");
    textContainer.classList.add("action")
    textContainer.append(textTitle, textAuthor, textYear);
  
    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textTitle,textAuthor,textYear,textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);
    
    if(bookObject.isCompleted){
 
        const undoButton = document.createElement("button");
        undoButton.classList.add("green");
        undoButton.innerText = "Belum Selesai Dibaca";
        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);  
            
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.innerText = "Hapus Buku";
        trashButton.addEventListener("click", function () {
             alert("Data Berhasil Dihapus!")
            removeBookFromCompleted(bookObject.id);
        });
   
        container.append(undoButton, trashButton);
    } else {
   
        const checkButton = document.createElement("button");
        checkButton.classList.add("green");
        checkButton.innerText = "Selesai Dibaca"
        checkButton.addEventListener("click", function () {
            alert("Buku Telah Selesai Dibaca!")
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("red");
        trashButton.innerText = "Hapus Buku";
        trashButton.addEventListener("click", function () {
             alert("Data Berhasil Dihapus!")
            removeBookFromCompleted(bookObject.id);
        });
   
        container.append(checkButton, trashButton);
    }

    return container;
 }
 
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
     uncompletedBOOKList.innerHTML = "";

     const completedBOOKList = document.getElementById("completeBookshelfList");
      completedBOOKList.innerHTML = "";

    
   for(bookItem of inputBook){
     const bookElement = makeBook(bookItem);
     uncompletedBOOKList.append(bookElement);

     if(bookItem.isCompleted == false)
          uncompletedBOOKList.append(bookElement);

    else
    completedBOOKList.append(bookElement);
   }
 });

 function addBookToCompleted(bookId) {
 
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 }

 function findBook(bookId){
    for(bookItem of inputBook){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
  }


  function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    inputBook.splice(bookTarget, 1);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
   
   
  function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
   
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for(index in inputBook){
        if(inputBook[index].id === bookId){
            return index
        }
    }
    return -1
 }


 document.getElementById('searchSubmit').addEventListener("click", function (event){
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
        for (buku of bookList) {
      if (searchBook !== buku.innerText.toLowerCase()) {
        buku.parentElement.style.display = "none";
      } else {
        buku.parentElement.style.display = "block";
      }
    }
})

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(inputBook);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "BOOK_APPS";
 
 
function isStorageExist() /* boolean */ {
  if(typeof(Storage) === undefined){
      alert("Browser kamu tidak mendukung local storage");
      return false
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(book of data){
            inputBook.push(book);
        }
    }
   
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }