import { create } from "zustand";

interface CardModalStore {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onClose: () => set({ isOpen: false, id: undefined }),
  onOpen: (id) => set({ isOpen: true, id }),
}));

export { useCardModal };
