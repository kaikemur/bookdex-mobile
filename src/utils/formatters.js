export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatPercentage = (current, total) => {
  if (!total || total === 0) return 0;
  return Math.round((current / total) * 100);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatRating = (rating) => {
  if (!rating) return 'Não avaliado';
  return `${rating}/5 estrelas`;
};