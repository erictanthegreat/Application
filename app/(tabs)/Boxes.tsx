import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';
import Feather from "react-native-vector-icons/Feather";

interface Box {
  id: string;
  category: string;
  boxName: string;
  imageUrl: string;
  checked?: boolean;
}

const CATEGORY_OPTIONS = [
  "All",
  "Furniture",
  "Devices",
  "Appliances",
  "Papers",
  "Perishables",
  "Others",
];

export default function ViewBoxes() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [anySelected, setAnySelected] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const userID = auth.currentUser?.uid;
        if (!userID) return;

        const q = query(collection(db, "boxes"), where("userID", "==", userID));
        const querySnapshot = await getDocs(q);

        const fetchedBoxes: Box[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedBoxes.push({
            id: doc.id,
            category: data.category,
            boxName: data.boxName,
            imageUrl: data.imageUrl,
            checked: false,
          });
        });

        setBoxes(fetchedBoxes);
        setFilteredBoxes(fetchedBoxes);
      } catch (error) {
        console.error("Error fetching boxes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  useEffect(() => {
    let filtered = boxes;

    if (categoryFilter !== "All") {
      filtered = filtered.filter(box => box.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        box =>
          box.boxName.toLowerCase().includes(lower) ||
          box.category.toLowerCase().includes(lower)
      );
    }

    setFilteredBoxes(filtered);
  }, [searchQuery, boxes, categoryFilter]);

  useEffect(() => {
    const any = filteredBoxes.some(box => box.checked);
    const all = filteredBoxes.length > 0 && filteredBoxes.every(box => box.checked);
    setAnySelected(any);
    setAllSelected(all);
  }, [filteredBoxes]);

  const toggleCheckbox = (id: string) => {
    setBoxes(prev =>
      prev.map(box =>
        box.id === id ? { ...box, checked: !box.checked } : box
      )
    );
  };

  const toggleSelectAll = () => {
    setBoxes(prev =>
      prev.map(box => {
        if (filteredBoxes.some(fb => fb.id === box.id)) {
          return { ...box, checked: !allSelected };
        }
        return box;
      })
    );
  };

  const handleDeleteSelected = async () => {
    const selectedBoxes = filteredBoxes.filter(box => box.checked);
    if (selectedBoxes.length === 0) return;

    Alert.alert(
      "Delete Boxes",
      `Are you sure you want to delete ${selectedBoxes.length} box(es)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              for (const box of selectedBoxes) {
                await deleteDoc(doc(db, "boxes", box.id));
              }
              setBoxes(prev => prev.filter(box => !selectedBoxes.some(sel => sel.id === box.id)));
            } catch (error) {
              Alert.alert("Error", "Failed to delete boxes.");
              console.error("Delete error:", error);
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  const categoryEmojis: Record<string, string> = {
    'Furniture': '🛋️',
    'Devices': '💻',
    'Appliances': '🧊',
    'Papers': '📄',
    'Perishables': '🍋',
    'Others': '📦',
  };

  const getEmojiForCategory = (category: string) => {
    return categoryEmojis[category] || '📦';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB002D" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Boxes</Text>
        </View>
        <View style={styles.headerIcons}>
          {anySelected ? (
            <>
              <TouchableOpacity onPress={toggleSelectAll} disabled={filteredBoxes.length === 0}>
                <MaterialIcons
                  name={allSelected ? "check-box" : "check-box-outline-blank"}
                  size={30}
                  color={filteredBoxes.length === 0 ? "#ccc" : "#BB002D"}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSelected} disabled={deleting}>
                <MaterialIcons
                  name="delete"
                  size={30}
                  color={deleting ? "#ccc" : "#BB002D"}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setSearchVisible(v => !v)}>
                <Feather name="search" size={30} color="black" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
                <Feather name="list" size={30} color="black" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or category..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      )}
      {/* Show current category filter */}
      <View style={styles.filterInfoContainer}>
        <Text style={styles.filterInfoText}>
          Category: <Text style={{ fontWeight: 'bold' }}>{categoryFilter}</Text>
        </Text>
        {categoryFilter !== "All" && (
          <TouchableOpacity onPress={() => setCategoryFilter("All")}>
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.grid}>
        {filteredBoxes.length === 0 ? (
          <View style={styles.noBoxesContainer}>
            <Text style={styles.noBoxesTitle}>No boxes found</Text>
            <Text style={styles.noBoxesText}>
              You haven't created any boxes yet. Tap the "+" button to add your first box!
            </Text>
          </View>
        ) : (
          filteredBoxes.map((box) => (
            <View key={box.id} style={styles.itemBox}>
            <TouchableOpacity
            onPress={() => router.push({ pathname: "/Boxes/BoxDetails", params: { boxId: box.id } })}
            disabled={anySelected}
            >
          <View style={styles.emojiContainer}>
          <Text style={styles.bigEmoji}>{getEmojiForCategory(box.category)}</Text>
          </View>
          </TouchableOpacity>
          <Pressable style={styles.checkbox} onPress={() => toggleCheckbox(box.id)}>
          <MaterialIcons
            name={box.checked ? "check-box" : "check-box-outline-blank"}
            size={22}
            color="#000"
          />
          </Pressable>
          <Text style={styles.itemText}>{box.boxName}</Text>
        </View>
          ))
        )}
      </View>
      {/* Category Filter Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <FlatList
              data={CATEGORY_OPTIONS}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    item === categoryFilter && styles.categoryOptionSelected
                  ]}
                  onPress={() => {
                    setCategoryFilter(item);
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={styles.categoryOptionText}>
                    {item !== "All" ? `${getEmojiForCategory(item)} ` : ""}{item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    minHeight: '100%',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
  },
  filterInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 20,
    gap: 10,
  },
  filterInfoText: {
    fontSize: 15,
    color: '#333',
  },
  clearFilterText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemBox: {
  width: '48%',
  borderRadius: 16,
  marginBottom: 16,
  backgroundColor: '#fff',
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#ccc',
  position: 'relative', 
  paddingBottom: 12, 
},
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    justifyContent: 'space-between',
    padding: 8,
  },
  image: {
    borderRadius: 12,
  },
  emojiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  emoji: {
    fontSize: 20,
  },
  checkbox: {
  position: 'absolute',
  bottom: 8,
  right: 8,
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 2,
  zIndex: 1,
},
  itemText: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#000',
  textAlign: 'center',
  marginTop: 8,
},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBoxesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    width: '100%',
  },
  noBoxesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#BB002D',
    marginBottom: 10,
    textAlign: 'center',
  },
  noBoxesText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 260,
    maxHeight: 350,
    alignItems: 'stretch',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryOption: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryOptionSelected: {
    backgroundColor: '#e6f0ff',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#222',
  },
 emojiContainer: {
  width: '100%',
  aspectRatio: 1.2,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: 12,
},
bigEmoji: {
  fontSize: 110, //nice
},
});
