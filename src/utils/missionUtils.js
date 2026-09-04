export const calculateReadingProgress = (currentPage, totalPages) => {
  if (!totalPages || totalPages === 0) return 0;
  return Math.min((currentPage / totalPages) * 100, 100);
};

export const getReadingStats = (books) => {
  const totalBooks = books.length;
  const readBooks = books.filter(book => book.status === 'read').length;
  const readingBooks = books.filter(book => book.status === 'reading').length;
  const wantToReadBooks = books.filter(book => book.status === 'want_to_read').length;
  
  return {
    total: totalBooks,
    read: readBooks,
    reading: readingBooks,
    wantToRead: wantToReadBooks,
    percentageRead: totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0,
  };
};

export const filterBooksByStatus = (books, status) => {
  return books.filter(book => book.status === status);
};

export const filterBooksByCategory = (books, category) => {
  return books.filter(book => book.category === category);
};

export const searchBooks = (books, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(term) ||
    book.author.toLowerCase().includes(term)
  );
};