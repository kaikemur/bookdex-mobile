import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, RefreshControl, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { getAllBooks, deleteBook } from '../services/storageService';
import { getReadingStats } from '../utils/missionUtils';
import { STATUS_OPTIONS } from '../services/categoryService';

const famousBooks = [
  { id: 'famous-1', title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Ficção', status: 'read', totalPages: 1178, currentPage: 1178, rating: 5, description: 'Uma épica aventura na Terra Média.', coverUrl: 'https://upload.wikimedia.org/wikipedia/pt/3/38/Lord_of_the_Rings_Fellowship_of_the_Ring.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original', createdAt: '1954-07-29T00:00:00.000Z' },
  { id: 'famous-2', title: '1984', author: 'George Orwell', category: 'Ficção', status: 'read', totalPages: 328, currentPage: 328, rating: 5, description: 'Um clássico distópico sobre liberdade e vigilância.', coverUrl: 'https://m.media-amazon.com/images/I/61t0bwt1s3L.jpg', createdAt: '1949-06-08T00:00:00.000Z' },
  { id: 'famous-3', title: 'Dom Casmurro', author: 'Machado de Assis', category: 'Romance', status: 'read', totalPages: 256, currentPage: 256, rating: 5, description: 'Um dos maiores romances da literatura brasileira.', coverUrl: 'https://cdl-static.s3-sa-east-1.amazonaws.com/covers/gg/9788582850350/dom-casmurro-estabelecimento-de-texto-de-manoel-m-santiago-almeida-e-introducao-de-luis-augusto-fischer.jpg', createdAt: '1899-01-01T00:00:00.000Z' },
  { id: 'famous-4', title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', category: 'Ficção', status: 'read', totalPages: 96, currentPage: 96, rating: 5, description: 'Uma história delicada sobre amizade e humanidade.', coverUrl: 'https://seliganaleitura.com.br/wp-content/uploads/2016/04/o-pequeno-principe-1.jpeg', createdAt: '1943-04-06T00:00:00.000Z' },
];

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Carrega a lista de livros
  const loadBooks = async () => {
    try {
      const data = await getAllBooks();
      setBooks(data || []);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a tela sempre que ela entra em foco
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    await loadBooks();
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
    const matchesFilter = activeFilter === 'all' || book.status === activeFilter;
    const matchesSearch = !normalizedSearch ||
      book.title.toLowerCase().includes(normalizedSearch) ||
      book.author.toLowerCase().includes(normalizedSearch);
    return matchesFilter && matchesSearch;
  });

  const stats = getReadingStats(books);

  return (
    <View style={styles.container}>
      <Header title="bookDex" subtitle={`${stats.total} livros na sua biblioteca`} />

      <View style={styles.toolbar}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={22} color="#64748B" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por título ou autor"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filter, activeFilter === 'all' && styles.filterActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>Todos</Text>
          </TouchableOpacity>
          {STATUS_OPTIONS.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={[styles.filter, activeFilter === status.value && styles.filterActive]}
              onPress={() => setActiveFilter(status.value)}
            >
              <Text style={[styles.filterText, activeFilter === status.value && styles.filterTextActive]}>
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <FlatList
          data={filteredBooks}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={
            <View>
              <View style={styles.featuredHeader}>
                <View>
                  <Text style={styles.featuredTitle}>Livros famosos</Text>
                  <Text style={styles.featuredSubtitle}>Histórias que todo mundo conhece</Text>
                </View>
                <MaterialCommunityIcons name="trophy-outline" size={24} color="#F59E0B" />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredList}>
                {famousBooks.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    style={styles.featuredCard}
                    onPress={() => navigation.navigate('BookDetail', { book })}
                  >
                    {book.coverUrl ? (
                      <Image source={{ uri: book.coverUrl }} style={styles.featuredCover} />
                    ) : (
                      <View style={styles.featuredCoverFallback}>
                        <MaterialCommunityIcons name="book-open-page-variant" size={27} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.featuredBookTitle} numberOfLines={2}>{book.title}</Text>
                    <Text style={styles.featuredAuthor} numberOfLines={1}>{book.author}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.sectionTitle}>{activeFilter === 'all' ? 'Minha biblioteca' : 'Resultados'}</Text>
                  <Text style={styles.sectionSubtitle}>{filteredBooks.length} {filteredBooks.length === 1 ? 'livro' : 'livros'}</Text>
                </View>
                <MaterialCommunityIcons name="sort-variant" size={22} color="#64748B" />
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.noResults}>
              <MaterialCommunityIcons name={books.length === 0 ? 'bookshelf' : 'book-search-outline'} size={42} color="#CBD5E1" />
              <Text style={styles.noResultsTitle}>{books.length === 0 ? 'Sua biblioteca está vazia' : 'Nenhum livro encontrado'}</Text>
              <Text style={styles.noResultsText}>{books.length === 0 ? 'Adicione seu primeiro livro usando o botão abaixo.' : 'Tente outro termo ou filtro.'}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => navigation.navigate('BookDetail', { book: item })}
              onEdit={() => navigation.navigate('EditBook', { book: item })}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#eff6ff"]}
            />
          }
        />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddBook')}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  toolbar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#0F172A',
    fontSize: 15,
  },
  filters: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
  },
  filter: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterActive: {
    backgroundColor: '#0F766E',
  },
  filterText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 100,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  featuredSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 3,
  },
  featuredList: {
    paddingBottom: 22,
    gap: 10,
  },
  featuredCard: {
    width: 142,
    minHeight: 188,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featuredCover: {
    height: 104,
    borderRadius: 7,
    backgroundColor: '#0F766E',
    resizeMode: 'cover',
    marginBottom: 10,
  },
  featuredCoverFallback: {
    height: 104,
    borderRadius: 7,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featuredBookTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  featuredAuthor: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsTitle: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  noResultsText: {
    color: '#64748B',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});