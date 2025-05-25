import { create } from 'zustand';

export interface PaywallContext {
  meditationId?: string;
  meditationPrompt?: string; // For filename generation if needed
  meditationDuration?: number; // For displaying price indication
  downloadType: 'text' | 'audio'; // What is being requested
  audioUrl?: string; // Needed if downloadType is audio
  onUnlockSuccess: () => void; // Callback when item is successfully unlocked
}

interface UIState {
  isPaywallModalOpen: boolean;
  paywallContext: PaywallContext | null;
  couponCodeInModal: string;
  couponErrorInModal: string;
  isProcessingPaymentInModal: boolean;
  openPaywallModal: (context: PaywallContext) => void;
  closePaywallModal: () => void;
  setCouponCodeInModal: (code: string) => void;
  setCouponErrorInModal: (error: string) => void;
  setIsProcessingPaymentInModal: (isLoading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPaywallModalOpen: false,
  paywallContext: null,
  couponCodeInModal: '',
  couponErrorInModal: '',
  isProcessingPaymentInModal: false,
  openPaywallModal: (context) => set({ isPaywallModalOpen: true, paywallContext: context, couponCodeInModal: '', couponErrorInModal: '' }),
  closePaywallModal: () => set({ isPaywallModalOpen: false, paywallContext: null }),
  setCouponCodeInModal: (code) => set({ couponCodeInModal: code }),
  setCouponErrorInModal: (error) => set({ couponErrorInModal: error }),
  setIsProcessingPaymentInModal: (isLoading) => set({ isProcessingPaymentInModal: isLoading }),
})); 