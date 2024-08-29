import { IBook, BookCategory, bookCategories} from './types/index';
import './styles/styles.css';

import  Collection  from "a-local-database";

const myCollection = new Collection();

if (!myCollection.get<IBook[]>('books')) { // Проверка наличия коллекции книг
  myCollection.set({books: []}); // Если коллекции нет, создаем ее и инициализируем пустым массивом
}
let books: IBook[] = myCollection.get('books') || [];

let currentEditBook: IBook | null = null; // Переменная для хранения редактируемой книги

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
      filterBooksByCategory(category);
      highlightSelectedCategory(category);
      searchInput.value = ''; // Очистить поле поиска
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

// Функция для удаления подсветки категории
function removeSelectedCategory() {
  const categoryItems = categoryList.querySelectorAll('li ');
  categoryItems.forEach((item) => {
    item.classList.remove('selected');
  });
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

myCollection.get<IBook[]>('books')?.forEach((book) => {
  const card = createBook(book);
  bookList.prepend(card);
});
changeTotal();

// Функция для создания новой книги
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
  const book = books.find((book) => book.id === bookId);
  if (book) {
    currentEditBook = book;
    titleInput.value = book.title;
    authorInput.value = book.author;
    categorySelect.value = book.category;

    saveButton.textContent = 'Сохранить изменения';
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

//Фильтрация книг по категориям
function filterBooksByCategory(selectedCategory: BookCategory) { 
  const bookBase = myCollection.get<IBook[]>("books");
  const filteredBooks = bookBase.filter(book => book.category === selectedCategory);
  renderBooks(filteredBooks);
}

// Функция для поиска книг
function searchBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const bookBase = myCollection.get<IBook[]>("books");
  const filteredBooks = bookBase.filter(book => 
    book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm)
  );
  renderBooks(filteredBooks);
}

// Функция для отображения списка книг
function renderBooks(booksToDisplay: IBook[]) {
  bookList.innerHTML = ''; // Очистить список книг перед отображением
  booksToDisplay.forEach(book => {
    const card = createBook(book);
    bookList.appendChild(card);

    removeSelectedCategory(); // Удалить подсветку категории при отображении всего списка
  });
}

createCategoryOptions(); // Создание опции категорий

// Обработчики событий
searchInput.addEventListener('click', () => { // Добавлен обработчик для отслеживания ввода
  if (searchInput.value === '') {
    const bookBase = myCollection.get<IBook[]>("books");
    renderBooks(bookBase); // Отображать весь список книг, если происходит поиск
  }
  removeSelectedCategory(); // Удаление подсветки категории при отображении всего списка
}); 

searchInput.addEventListener('input', searchBooks);

saveButton.addEventListener('click', (event) => { // Добавлен обработчик для кнопки сохранения
  event.preventDefault();
  // saveButton.textContent = 'Добавить книгу'; // Меняем текст кнопки

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

  // Если ошибок нет, продолжаем обработку формы
  if (currentEditBook) {
    currentEditBook.title = title;
    currentEditBook.author = author;
    currentEditBook.category = category;
    currentEditBook = null; // Сброс после редактирования
  } else {
    addBook(title, author, category);
  }

  // Очистка полей
  titleInput.value = '';
  authorInput.value = '';
  categorySelect.value = bookCategories[0]; // Сброс категории к первой

  // Обновление отображения списка книг
  const bookBase = myCollection.get<IBook[]>("books"); 
  renderBooks(bookBase);
});

// Первоначальное отображение всех книг
const bookBase = myCollection.get<IBook[]>("books"); //Исправить
renderBooks(bookBase);