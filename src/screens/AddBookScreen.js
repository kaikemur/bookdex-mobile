import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import { saveBook } from '../services/storageService';
import { CATEGORIES, STATUS_OPTIONS } from '../services/categoryService';

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0].value);
  const [totalPages, setTotalPages] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState(null);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso às fotos para adicionar uma capa.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setCoverUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Erro', 'Título e autor são obrigatórios!');
      return;
    }

    const book = {
      title: title.trim(),
      author: author.trim(),
      category: selectedCategory,
      status: selectedStatus,
      totalPages: parseInt(totalPages) || 0,
      currentPage: selectedStatus === 'read' ? parseInt(totalPages) || 0 : 0,
      description: description.trim(),
      rating: 0,
      coverUrl,
    };

    const savedBook = await saveBook(book);
    
    if (savedBook) {
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');
      navigation.goBack();
    } else {
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Novo Livro" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Capa do livro</Text>
            <TouchableOpacity style={styles.coverPicker} onPress={handlePickImage}>
              {coverUrl ? (
                <Image source={{ uri: coverUrl }} style={styles.coverPreview} />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <MaterialCommunityIcons name="camera-plus-outline" size={30} color="#666666" />
                  <Text style={styles.coverPlaceholderText}>Adicionar foto da capa</Text>
                </View>
              )}
            </TouchableOpacity>
            {coverUrl ? <Text style={styles.changeCoverText}>Toque na imagem para trocar</Text> : null}
          </View>

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
            <Text style={styles.saveButtonText}>Salvar Livro</Text>
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
  coverPicker: {
    height: 190,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  coverPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  coverPlaceholderText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  changeCoverText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
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