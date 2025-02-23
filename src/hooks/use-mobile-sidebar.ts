import { create } from "zustand";

interface MobileSidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useMobileSidebar = create<MobileSidebarStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export { useMobileSidebar };
