import { IBook, BookCategory, bookCategories} from './types/index';
import './styles/styles.css';
import './styles/adapt.css';
import  Collection  from "a-local-database";

const myCollection = new Collection();

if (!myCollection.get<IBook[]>('books')) { // Проверка наличия коллекции книг
  myCollection.set({books: []}); // Если коллекции нет, создаем ее и инициализируем пустым массивом
}

let currentEditBook: IBook | null = null; // Переменная для хранения редактируемой книги
let selectedCategory: BookCategory | null = null; // Переменная для хранения выбранной категории
let searchQuery: string = ''; // Переменная для хранения поискового запроса

// Получение элементов DOM
const titleInput = document.querySelector<HTMLInputElement>('.create-title')!;
const authorInput = document.querySelector<HTMLInputElement>('.create-author')!;
const categorySelect = document.querySelector<HTMLSelectElement>('.create-category')!;
const saveButton = document.querySelector<HTMLButtonElement>('.saveButton')!;

const searchInput = document.querySelector<HTMLInputElement>('.search-input')!;
const categoryList = document.querySelector<HTMLUListElement>('.categoryList')!;
const bookList = document.querySelector<HTMLUListElement>('.bookList')!;

const bookItemTemplate = document.getElementById('book-item-template')! as HTMLTemplateElement;

const total = document.querySelector<HTMLParagraphElement>('.header_statistics__text_total')!;

// Функция для обновления общего количества книг
function changeTotal() {
  total.textContent = `Всего книг: ${myCollection.get<IBook[]>('books')?.length || 0}`;
}

// Функция для создания категорий
function createCategoryOptions() { //элементы опций категорий
  bookCategories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  bookCategories.forEach(category => { //элементы списка категорий
    const li = document.createElement('li');
    li.textContent = category;
    li.addEventListener('click', () => {
      selectedCategory = category; // Сохраняем выбранную категорию
      filterBooksByCategory(category);
      highlightSelectedCategory(category);
      searchInput.value = ''; // Очистить поле поиска
      searchQuery = ''; // Сбрасываем поисковый запрос
  });
  categoryList.appendChild(li);
});
}

// Функция для подсветки выбранной категории
function highlightSelectedCategory(selectedCategory: BookCategory) {
  const categoryItems = categoryList.querySelectorAll('li');
  categoryItems.forEach(item => {
    item.classList.toggle('selected', item.textContent === selectedCategory);
  });
}

// Функция для обновления списка книг
function renderBooks(booksToDisplay: IBook[]) {
  bookList.innerHTML = ''; // Очистить список книг перед отображением
  booksToDisplay.forEach(book => {
    const card = createBook(book);
    bookList.appendChild(card);
  });
}

// Функция для обновления отображения списка книг
function updateBookList() {
  const bookBase = myCollection.get<IBook[]>("books");
  renderBooks(bookBase);
}

//Функция для фильтрации книг по категориям
function filterBooksByCategory(selectedCategory: BookCategory) { 
  const bookBase = myCollection.get<IBook[]>("books");
  const filteredBooks = bookBase.filter(book => book.category === selectedCategory);
  renderBooks(filteredBooks);
}

// Функция для поиска книг
function searchBooks() {
  const searchQuery = searchInput.value.toLowerCase();
  const bookBase = myCollection.get<IBook[]>("books");
  const filteredBooks = bookBase.filter(book => 
    book.title.toLowerCase().includes(searchQuery) || book.author.toLowerCase().includes(searchQuery)
  );
  
  if (selectedCategory) { // Фильтруем по выбранной категории
    const categoryFilteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
    renderBooks(categoryFilteredBooks);
  }
}

// Функция для создания карточки книги
function createBook(book: IBook) {
  const card = bookItemTemplate.content.firstChild.cloneNode(true) as HTMLLIElement;
  const title = card.querySelector<HTMLParagraphElement>('.book-title-item__text')!;
  title.textContent = book.title;
  const author = card.querySelector<HTMLParagraphElement>('.book-author-item__text')!;
  author.textContent = book.author;
  const categoryText = card.querySelector<HTMLParagraphElement>('.book-category-item__text')!;
  categoryText.textContent = book.category;
  const delBtn = card.querySelector<HTMLButtonElement>('.book-item__delete')!;
  const editBtn = card.querySelector<HTMLButtonElement>('.book-item__edit')!;

  delBtn.addEventListener('click', () => {
    deleteBook(card, book.id);
  });
  editBtn.addEventListener('click', () => {
    editBook(card, book.id);
  });
  return card;
}

// Функция для добавления новой книги
function addBook(title: string, author: string, category: BookCategory) {
  const bookBase = myCollection.get<IBook[]>("books");
  const newId = Math.max(0, ...bookBase.map((book) => book.id)) + 1;
  const card = createBook({id: newId, title, author, category});
  bookBase.push({id: newId, title, author, category});
  myCollection.set({ books: bookBase });
  bookList.prepend(card);
  changeTotal(); // Обновление общего количества книг
}

// Функция для редактирования книги
function editBook(card: HTMLLIElement, bookId: number) {
  const bookBase = myCollection.get<IBook[]>('books');
  const book = bookBase?.findIndex(b => b.id === bookId); // находим редактируемую книгу
  
  if (book !== undefined) {
    currentEditBook = bookBase[book]; // сохраняем редактируемую книгу
    titleInput.value = currentEditBook.title; // заполняем поля ввода
    authorInput.value = currentEditBook.author;
    categorySelect.value = currentEditBook.category;
    saveButton.textContent = 'Сохранить изменения'; // меняем текст кнопки на "Сохранить изменения"
  }
}

// Функция для удаления книги
function deleteBook(card: HTMLLIElement, id: number) {
  let bookBase = myCollection.get<IBook[]>('books')
  bookBase = bookBase.filter((book) => book.id !== id);
  myCollection.set({books: bookBase})
  card.remove(); 
  changeTotal(); // Обновление общего количества книг
}


// Обработчики событий
searchInput.addEventListener('input', searchBooks);



saveButton.addEventListener('click', (event) => { // Добавлен обработчик для кнопки сохранения
  event.preventDefault();

  const title = titleInput.value;
  const author = authorInput.value;
  const category = categorySelect.value as BookCategory;

  // Переменная для отслеживания ошибок
  let hasError = false;

  // Проверка на пустые поля и добавление классов ошибок
  if (title === "") { 
    titleInput.classList.add("titleError");
    hasError = true; // Устанавливаем флаг ошибки
  } else {
    titleInput.classList.remove("titleError");
  }

  if (author === "") { 
    authorInput.classList.add("authorError");
    hasError = true; // Устанавливаем флаг ошибки
  } else {
    authorInput.classList.remove("authorError");
  }

  // Если есть ошибки, не продолжаем дальнейшие действия
  if (hasError) {
    setTimeout(() => {
      titleInput.classList.remove("titleError");
      authorInput.classList.remove("authorError");
    }, 1000); // Удаляем классы через 1 секунду
    return; // Выход из функции
  }

// Если редактируем книгу
  if (currentEditBook) {
    const bookBase = myCollection.get<IBook[]>('books');
    const index = bookBase?.findIndex(b => b.id === currentEditBook.id); // находим индекс редактируемой книги

    // Обновляем данные книги
    if (index !== -1) {
      bookBase[index] = { ...bookBase[index], title, author, category }; // обновляем книгу
    } 
    myCollection.set({ books: bookBase }); // сохраняем изменения
    currentEditBook = null; // сбрасываем редактируемую книгу
    saveButton.textContent = 'Добавить книгу'; // восстанавливаем текст кнопки
    updateBookList(); 
    categorySelect.value = selectedCategory; // Восстановить выбранную категорию
    filterBooksByCategory(selectedCategory); // Фильтруем список книг по этой категории
    searchInput.value = searchQuery; // Восстановить поисковый запрос
    
  } else {
    // Обновляем, если добавляем новую книгу
    addBook(title, author, category);
    categorySelect.value = selectedCategory; // Восстановить выбранную категорию
    filterBooksByCategory(selectedCategory); // Фильтруем список книг по этой категории
    searchInput.value = searchQuery; // Восстановить поисковый запрос
    
  }

  // Очистка полей
  titleInput.value = '';
  authorInput.value = '';
});

// Инициализация приложения
(() => {
  createCategoryOptions();
  changeTotal();
  renderBooks(myCollection.get<IBook[]>('books') || []);
  // Выбрать первую категорию по умолчанию
  if (bookCategories.length > 0) {
    selectedCategory = bookCategories[0];
    filterBooksByCategory(bookCategories[0]);
    highlightSelectedCategory(bookCategories[0]);
  }
})();