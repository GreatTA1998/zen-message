import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PERSON_AVATAR } from './contacts';

export function SearchView({ onClose, onSearch, onAdd }) {
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState([]);

  useEffect(() => {
    let alive = true;
    onSearch(query).then((next) => {
      if (alive) setPeople(next);
    });
    return () => {
      alive = false;
    };
  }, [onSearch, query]);

  return (
    <View style={styles.screen}>
      <View style={styles.bar}>
        <Pressable testID="search-back" accessibilityRole="button" accessibilityLabel="Back" onPress={onClose}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Add a person</Text>
      </View>
      <TextInput
        testID="person-search"
        value={query}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setQuery}
        placeholder="Username"
        placeholderTextColor="#8a8a8a"
        style={styles.input}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.results}>
        {people.map((person) => (
          <View key={person.id} testID={`person-${person.username}`} style={styles.row}>
            <Image source={PERSON_AVATAR} style={styles.avatar} />
            <Text style={styles.name}>{person.username}</Text>
            <Pressable
              testID={`add-${person.username}`}
              accessibilityRole="button"
              accessibilityLabel={`Add ${person.username}`}
              onPress={() => onAdd(person.username)}
              style={styles.add}
            >
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const ink = '#1c1c1c';
const paper = '#fff';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: paper,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: ink,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  back: {
    color: ink,
    fontSize: 16,
  },
  title: {
    color: ink,
    fontSize: 18,
  },
  input: {
    margin: 16,
    minHeight: 48,
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 17,
    color: ink,
  },
  results: {
    paddingHorizontal: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: ink,
  },
  name: {
    flex: 1,
    color: ink,
    fontSize: 17,
  },
  add: {
    borderWidth: 1,
    borderColor: ink,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addText: {
    color: ink,
    fontSize: 15,
  },
});
