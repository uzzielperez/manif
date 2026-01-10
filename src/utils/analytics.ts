declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: Array<Record<string, any>>;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;

  const { gtag, dataLayer } = window;

  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
    return;
  }

  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event: eventName, ...params });
  }
};

export default trackEvent;
