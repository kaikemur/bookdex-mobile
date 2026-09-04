export const CATEGORIES = [
  { id: '1', name: 'Ficção', color: '#4A90E2' },
  { id: '2', name: 'Técnico', color: '#2ECC71' },
  { id: '3', name: 'Biografia', color: '#F39C12' },
  { id: '4', name: 'História', color: '#9B59B6' },
  { id: '5', name: 'Ciência', color: '#E74C3C' },
  { id: '6', name: 'Romance', color: '#1ABC9C' },
];

export const STATUS_OPTIONS = [
  { id: '1', label: 'Quero Ler', value: 'want_to_read', color: '#95A5A6' },
  { id: '2', label: 'Lendo', value: 'reading', color: '#3498DB' },
  { id: '3', label: 'Lido', value: 'read', color: '#27AE60' },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[0];
};

export const getStatusByValue = (value) => {
  return STATUS_OPTIONS.find(status => status.value === value) || STATUS_OPTIONS[0];
};

export const getCategoryStats = (books) => {
  const stats = {};
  CATEGORIES.forEach(cat => {
    stats[cat.name] = books.filter(book => book.category === cat.name).length;
  });
  return stats;
};