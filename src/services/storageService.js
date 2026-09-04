import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_KEY = '@bookdex:books';

export const getAllBooks = async () => {
  try {
    const data = await AsyncStorage.getItem(BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return [];
  }
};

export const saveBook = async (book) => {
  try {
    const books = await getAllBooks();
    const newBook = {
      ...book,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    books.push(newBook);
    await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    return newBook;
  } catch (error) {
    console.error('Erro ao salvar livro:', error);
    return null;
  }
};

export const updateBook = async (updatedBook) => {
  try {
    const books = await getAllBooks();
    const index = books.findIndex(book => book.id === updatedBook.id);
    
    if (index !== -1) {
      books[index] = { ...updatedBook, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
      return books[index];
    }
    return null;
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return null;
  }
};

export const deleteBook = async (id) => {
  try {
    const books = await getAllBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(filteredBooks));
    return true;
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    return false;
  }
};

export const getBookById = async (id) => {
  try {
    const books = await getAllBooks();
    return books.find(book => book.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return null;
  }
};