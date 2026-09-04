import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryBadge from './CategoryBadge';
import ProgressBar from './ProgressBar';

export default function BookCard({ book, onPress, onEdit, onDelete }) {
  const progress = book.currentPage && book.totalPages 
    ? (book.currentPage / book.totalPages) * 100 
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        {book.coverUrl ? (
          <Image source={{ uri: book.coverUrl }} style={styles.cover} />
        ) : (
          <View style={styles.cover}>
            <MaterialCommunityIcons name="book-open-variant" size={30} color="#FFFFFF" />
          </View>
        )}
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          
          <View style={styles.badges}>
            <CategoryBadge category={book.category} />
          </View>
          
          {book.status === 'reading' && progress > 0 && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} />
              <Text style={styles.progressText}>
                {Math.round(progress)}% ({book.currentPage}/{book.totalPages})
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <MaterialCommunityIcons name="pencil" size={20} color="#3498DB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <MaterialCommunityIcons name="delete-outline" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 54,
    height: 72,
    borderRadius: 5,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: '#0F172A',
    fontSize: 16,
    marginBottom: 3,
  },
  author: {
    fontSize: 14,
    color: '#472211',
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#18263a',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
  },
});