import AsyncStorage from "@react-native-async-storage/async-storage";
import { LaterItem } from "../types/LaterItem";

const ITEMS_STORAGE_KEY = "@later_items";

export async function loadItems(): Promise<LaterItem[]> {
  try {
    const storedItems = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);

    if (!storedItems) {
      return [];
    }

    return JSON.parse(storedItems) as LaterItem[];
  } catch (error) {
    console.error("Failed to load Later items:", error);
    return [];
  }
}

export async function saveItems(items: LaterItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save Later items:", error);
    throw error;
  }
}

export async function addItem(item: LaterItem): Promise<LaterItem[]> {
  const currentItems = await loadItems();
  const updatedItems = [item, ...currentItems];

  await saveItems(updatedItems);

  return updatedItems;
}

export async function updateItem(
  updatedItem: LaterItem
): Promise<LaterItem[]> {
  const currentItems = await loadItems();

  const updatedItems = currentItems.map((item) =>
    item.id === updatedItem.id ? updatedItem : item
  );

  await saveItems(updatedItems);

  return updatedItems;
}

export async function deleteItem(itemId: string): Promise<LaterItem[]> {
  const currentItems = await loadItems();

  const updatedItems = currentItems.filter(
    (item) => item.id !== itemId
  );

  await saveItems(updatedItems);

  return updatedItems;
}