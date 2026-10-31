import { useState, useEffect } from "react";
import { showToast } from "~/components/ui/ToastNotification";

export interface BagItem {
  productId: number;
  variantId?: number;
  name: string;
  slug: string;
  colorName: string;
  colorHex: string;
  blouseOption: "with" | "without";
  price: number;
  quantity?: number;
  imageUrl: string;
}

export interface StoredRequest {
  requestId: number;
  requestNumber: string;
  secretToken: string;
  itemsCount: number;
  totalAmount: number;
  summaryText: string;
  status: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  SAVED: "mm_saved_sarees_v1",
  BAG: "mm_bag_v1",
  REQUESTS: "mm_my_requests_v1",
  HINT: "mm_feed_hint_seen_v1",
};

export function useSavedSarees() {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SAVED);
        if (data) setSavedIds(JSON.parse(data));
        else setSavedIds([]);
      } catch {
        // ignore
      }
      setIsLoaded(true);
    };

    load();
    window.addEventListener("mm_saved_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("mm_saved_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const toggleSave = (id: number) => {
    setSavedIds((prev) => {
      const isCurrentlySaved = prev.includes(id);
      const next = isCurrentlySaved ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(next));
        window.dispatchEvent(new Event("mm_saved_updated"));
        if (isCurrentlySaved) {
          showToast("Removed from wishlist", "info");
        } else {
          showToast("Saved to your wishlist", "heart");
        }
      } catch {
        showToast("Unable to update wishlist. Storage might be full.", "info");
      }
      return next;
    });
  };

  const isSaved = (id: number) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved, isLoaded };
}

export function useBag() {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.BAG);
        if (data) setItems(JSON.parse(data));
        else setItems([]);
      } catch {
        // ignore
      }
      setIsLoaded(true);
    };

    load();
    window.addEventListener("mm_bag_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("mm_bag_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const addToBag = (item: BagItem) => {
    setItems((prev) => {
      const addQty = item.quantity && item.quantity > 0 ? item.quantity : 1;
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && i.colorName === item.colorName && i.blouseOption === item.blouseOption
      );

      let next: BagItem[];
      if (existingIdx >= 0) {
        next = [...prev];
        const currentQty = next[existingIdx].quantity || 1;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: currentQty + addQty,
        };
      } else {
        next = [...prev, { ...item, quantity: addQty }];
      }

      try {
        localStorage.setItem(STORAGE_KEYS.BAG, JSON.stringify(next));
        window.dispatchEvent(new Event("mm_bag_updated"));
        showToast("Added to shopping bag", "cart");
      } catch {
        showToast("Unable to update shopping bag", "info");
      }
      return next;
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = prev.filter((_, i) => i !== index);
        localStorage.setItem(STORAGE_KEYS.BAG, JSON.stringify(next));
        window.dispatchEvent(new Event("mm_bag_updated"));
        showToast("Item removed from bag", "info");
        return next;
      }
      const next = prev.map((item, i) => (i === index ? { ...item, quantity } : item));
      localStorage.setItem(STORAGE_KEYS.BAG, JSON.stringify(next));
      window.dispatchEvent(new Event("mm_bag_updated"));
      return next;
    });
  };

  const removeFromBag = (index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEYS.BAG, JSON.stringify(next));
      window.dispatchEvent(new Event("mm_bag_updated"));
      showToast("Item removed from bag", "info");
      return next;
    });
  };

  const clearBag = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEYS.BAG);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return { items, addToBag, updateQuantity, removeFromBag, clearBag, subtotal, totalItemsCount, isLoaded };
}

export function useMyRequests() {
  const [requestsList, setRequestsList] = useState<StoredRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (data) setRequestsList(JSON.parse(data));
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  const addRequest = (req: StoredRequest) => {
    setRequestsList((prev) => {
      const filtered = prev.filter((r) => r.requestNumber !== req.requestNumber);
      const next = [req, ...filtered];
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(next));
      return next;
    });
  };

  return { requestsList, addRequest, isLoaded };
}

export function useFeedHint() {
  const [hasSeenHint, setHasSeenHint] = useState(true); // default true to avoid flash

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEYS.HINT);
      setHasSeenHint(seen === "true");
    } catch {
      setHasSeenHint(true);
    }
  }, []);

  const dismissHint = () => {
    setHasSeenHint(true);
    localStorage.setItem(STORAGE_KEYS.HINT, "true");
  };

  return { hasSeenHint, dismissHint };
}

export function clearAllLocalData() {
  localStorage.removeItem(STORAGE_KEYS.SAVED);
  localStorage.removeItem(STORAGE_KEYS.BAG);
  localStorage.removeItem(STORAGE_KEYS.REQUESTS);
  localStorage.removeItem(STORAGE_KEYS.HINT);
}
