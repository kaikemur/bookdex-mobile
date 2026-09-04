import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { updateBook, getBookById } from '../services/storageService';
import { CATEGORIES, STATUS_OPTIONS } from '../services/categoryService';

export default function EditBookScreen({ route, navigation }) {
  const { book } = route.params;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [selectedCategory, setSelectedCategory] = useState(book?.category || CATEGORIES[0].name);
  const [selectedStatus, setSelectedStatus] = useState(book?.status || STATUS_OPTIONS[0].value);
  const [totalPages, setTotalPages] = useState(book?.totalPages?.toString() || '');
  const [currentPage, setCurrentPage] = useState(book?.currentPage?.toString() || '0');
  const [description, setDescription] = useState(book?.description || '');
  const [rating, setRating] = useState(book?.rating || 0);

  useEffect(() => {
    loadBook();
  }, []);

  const loadBook = async () => {
    if (book?.id) {
      const freshBook = await getBookById(book.id);
      if (freshBook) {
        setTitle(freshBook.title);
        setAuthor(freshBook.author);
        setSelectedCategory(freshBook.category);
        setSelectedStatus(freshBook.status);
        setTotalPages(freshBook.totalPages?.toString() || '');
        setCurrentPage(freshBook.currentPage?.toString() || '0');
        setDescription(freshBook.description || '');
        setRating(freshBook.rating || 0);
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Erro', 'Título e autor são obrigatórios!');
      return;
    }

    const updatedBook = {
      ...book,
      title: title.trim(),
      author: author.trim(),
      category: selectedCategory,
      status: selectedStatus,
      totalPages: parseInt(totalPages) || 0,
      currentPage: parseInt(currentPage) || 0,
      description: description.trim(),
      rating,
    };

    const savedBook = await updateBook(updatedBook);
    
    if (savedBook) {
      Alert.alert('Sucesso', 'Livro atualizado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o livro.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#eff6ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Editar Livro" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="book" size={20} color="#666666" />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título do livro"
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Autor *</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={20} color="#666666" />
              <TextInput
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
                placeholder="Digite o nome do autor"
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.optionsContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.optionButton,
                    selectedCategory === category.name && styles.optionButtonSelected,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedCategory === category.name && styles.optionTextSelected
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status de Leitura</Text>
            <View style={styles.optionsContainer}>
              {STATUS_OPTIONS.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.optionButton,
                    selectedStatus === status.value && styles.optionButtonSelected,
                    { borderColor: status.color }
                  ]}
                  onPress={() => setSelectedStatus(status.value)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      selectedStatus === status.value && styles.optionTextSelected
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total de Páginas</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="pages" size={20} color="#666666" />
              <TextInput
                style={styles.input}
                value={totalPages}
                onChangeText={setTotalPages}
                placeholder="Quantas páginas tem o livro?"
                placeholderTextColor="#999999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Página Atual</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="page-next" size={20} color="#666666" />
              <TextInput
                style={styles.input}
                value={currentPage}
                onChangeText={setCurrentPage}
                placeholder="Em qual página você está?"
                placeholderTextColor="#999999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Avaliação</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <MaterialCommunityIcons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={star <= rating ? '#F39C12' : '#DDDDDD'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Adicione uma descrição (opcional)"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Atualizar Livro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#264734',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#c0b4b4',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#2155b6',
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#424efa4f',
    borderColor: '#eff6ff',
  },
  optionText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#160b77',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  saveButton: {
    backgroundColor: '#5b9ef5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#06076e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});