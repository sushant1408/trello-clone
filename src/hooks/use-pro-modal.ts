import { create } from "zustand";

interface ProModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProModal = create<ProModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export { useProModal };
