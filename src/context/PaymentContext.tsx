import React, { createContext, useContext, useState, useEffect } from 'react';

interface PaymentContextType {
  hasAccess: boolean;
  setHasAccess: (access: boolean) => void;
  checkPaymentStatus: (sessionId: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);

  // Check localStorage for previous payment on component mount
  useEffect(() => {
    const storedAccess = localStorage.getItem('manifestation_access');
    if (storedAccess === 'true') {
      setHasAccess(true);
    }
  }, []);

  const checkPaymentStatus = async (sessionId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/payment/checkout-status/${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setHasAccess(true);
        localStorage.setItem('manifestation_access', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  };

  const updateAccess = (access: boolean) => {
    setHasAccess(access);
    if (access) {
      localStorage.setItem('manifestation_access', 'true');
    } else {
      localStorage.removeItem('manifestation_access');
    }
  };

  return (
    <PaymentContext.Provider value={{ 
      hasAccess, 
      setHasAccess: updateAccess, 
      checkPaymentStatus 
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
