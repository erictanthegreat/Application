import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";
import { db, auth } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// Category emoji mapping
const categoryEmojis: Record<string, string> = {
  'Furniture': '🛋️',
  'Devices': '💻',
  'Appliances': '🧊',
  'Papers': '📄',
  'Perishables': '🍋',
  'Others': '📦',
};

export default function Home() {
  const [boxCount, setBoxCount] = useState(0);
  const [mostUsedCategory, setMostUsedCategory] = useState<string | null>(null);
  const [recentBoxes, setRecentBoxes] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userID = auth.currentUser?.uid;
        if (!userID) return;

        // Fetch all boxes for stats
        const allBoxesQuery = query(
          collection(db, "boxes"),
          where("userID", "==", userID)
        );
        const allBoxesSnapshot = await getDocs(allBoxesQuery);
        const allBoxes = allBoxesSnapshot.docs.map((doc) => doc.data());

        setBoxCount(allBoxes.length);

        if (allBoxes.length > 0) {
          const categoryCount: Record<string, number> = {};
          allBoxes.forEach((box: any) => {
            const cat = box.category || "Others";
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          });

          const mostUsed = Object.entries(categoryCount).reduce((a, b) =>
            a[1] > b[1] ? a : b
          )[0];
          setMostUsedCategory(mostUsed);
        } else {
          setMostUsedCategory(null);
        }
      } catch (error) {
        console.error("Error fetching box stats:", error);
      }
    };

    const fetchRecentBoxes = async () => {
      try {
        const userID = auth.currentUser?.uid;
        if (!userID) return;

        // Fetch only 5 most recent boxes
        const recentBoxesQuery = query(
          collection(db, "boxes"),
          where("userID", "==", userID),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentBoxesSnapshot = await getDocs(recentBoxesQuery);
        const boxes = recentBoxesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecentBoxes(boxes);
      } catch (error) {
        console.error("Error fetching recent boxes:", error);
      }
    };

    fetchStats();
    fetchRecentBoxes();
  }, []);

  // Helper to get emoji for a category
  const getCategoryEmoji = (category?: string) =>
    categoryEmojis[category ?? "Others"] || categoryEmojis["Others"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hi, John</Text>
          <Text style={styles.subtitle}>This is the home screen</Text>
        </View>
        <View style={styles.headerIcons}>
          <Feather name="search" size={30} color="black" style={styles.icon} />
          <Feather name="list" size={30} color="black" />
        </View>
      </View>

      {/* Stats Container */}
      <View style={styles.statsContainer}>
        <Text style={styles.labelText}>Your Total Boxes</Text>
        <Text style={styles.bigNumber}>{boxCount}</Text>

        <Text style={[styles.labelText, { marginTop: 20 }]}>Most Used Category</Text>
        <Text style={styles.categoryText}>
          {mostUsedCategory
            ? `${getCategoryEmoji(mostUsedCategory)} ${mostUsedCategory}`
            : "N/A"}
        </Text>
      </View>

      {/* Recent Boxes Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Recent Boxes:</Text>
      </View>

      {recentBoxes.length === 0 ? (
        <Text style={{ paddingHorizontal: 20, color: "#888" }}>
          No boxes added yet.
        </Text>
      ) : (
        recentBoxes.map((box, index) => {
          // Prefer lastModified, fallback to createdAt, else null
          const lastModifiedTimestamp = box.lastModified || box.createdAt || null;
          let lastModifiedStr = "Unknown";
          if (lastModifiedTimestamp && typeof lastModifiedTimestamp.toDate === "function") {
            lastModifiedStr = lastModifiedTimestamp
              .toDate()
              .toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
          }

          return (
            <View key={box.id || index} style={styles.boxRow}>
              <Text style={styles.boxEmoji}>
                {getCategoryEmoji(box.category)}
              </Text>
              <View>
                <Text style={styles.boxText}>{box.boxName || box.name || "Untitled Box"}</Text>
                <Text style={styles.boxDate}>Last modified: {lastModifiedStr}</Text>
              </View>
            </View>
          );
        })
      )}

      {/* StatusBar */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
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
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#595959",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  statsContainer: {
    borderWidth: 1,
    borderColor: "#D1D1D1",
    padding: 30,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
    marginTop: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  boxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
  },
  boxEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  boxDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
