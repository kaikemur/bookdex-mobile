import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import CategoryBadge from '../components/CategoryBadge';
import ProgressBar from '../components/ProgressBar';
import { getStatusByValue } from '../services/categoryService';
import { formatDate, formatPercentage } from '../utils/formatters';
import { calculateReadingProgress } from '../utils/missionUtils';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const statusData = getStatusByValue(book.status);
  const progress = calculateReadingProgress(book.currentPage, book.totalPages);

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={24}
            color={star <= rating ? '#F39C12' : '#DDDDDD'}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Detalhes do Livro" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
          ) : (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="book-open-page-variant" size={64} color="#eff6ff" />
            </View>
          )}

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>

          <View style={styles.badgesContainer}>
            <CategoryBadge category={book.category} size="large" />
            {statusData && (
              <View style={[styles.badge, { backgroundColor: statusData.color }]}>
                <Text style={styles.badgeText}>{statusData.label}</Text>
              </View>
            )}
          </View>

          {book.totalPages > 0 && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progresso de Leitura</Text>
                <Text style={styles.progressValue}>{formatPercentage(book.currentPage, book.totalPages)}%</Text>
              </View>
              <ProgressBar progress={progress} />
              <Text style={styles.pagesText}>
                Página {book.currentPage} de {book.totalPages}
              </Text>
            </View>
          )}

          {book.rating > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Avaliação</Text>
              {renderStars(book.rating)}
            </View>
          )}

          {book.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#666666" />
              <Text style={styles.infoText}>Adicionado em: {formatDate(book.createdAt)}</Text>
            </View>
            {book.updatedAt && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="pencil" size={20} color="#666666" />
                <Text style={styles.infoText}>Atualizado em: {formatDate(book.updatedAt)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditBook', { book })}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              navigation.goBack();
              // A exclusão será tratada na tela anterior
            }}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Excluir</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  coverImage: {
    alignSelf: 'center',
    width: 150,
    height: 210,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#eff6ff',
  },
  pagesText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#5b9ef5',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});