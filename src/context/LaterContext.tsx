import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { LaterItem } from "../types/LaterItem";
import {
  deleteItem as deleteStoredItem,
  loadItems,
  saveItems,
} from "../services/storage";

interface LaterContextValue {
  items: LaterItem[];
  isLoading: boolean;
  addItem: (item: LaterItem) => Promise<void>;
  updateItem: (item: LaterItem) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
}

const LaterContext = createContext<LaterContextValue | undefined>(
  undefined
);

interface LaterProviderProps {
  children: ReactNode;
}

export function LaterProvider({ children }: LaterProviderProps) {
  const [items, setItems] = useState<LaterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeItems() {
      const storedItems = await loadItems();
      setItems(storedItems);
      setIsLoading(false);
    }

    initializeItems();
  }, []);

  async function addItem(item: LaterItem) {
    const updatedItems = [item, ...items];

    setItems(updatedItems);
    await saveItems(updatedItems);
  }

  async function updateItem(updatedItem: LaterItem) {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );

    setItems(updatedItems);
    await saveItems(updatedItems);
  }

  async function deleteItem(itemId: string) {
    const updatedItems = await deleteStoredItem(itemId);
    setItems(updatedItems);
  }

  return (
    <LaterContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </LaterContext.Provider>
  );
}

export function useLater() {
  const context = useContext(LaterContext);

  if (!context) {
    throw new Error("useLater must be used inside LaterProvider");
  }

  return context;
}