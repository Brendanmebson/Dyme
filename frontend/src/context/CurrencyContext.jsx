// src/context/CurrencyContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro', locale: 'de-DE' },
  NGN: { code: 'NGN', symbol: '₦', flag: '🇳🇬', name: 'Nigerian Naira', locale: 'en-NG' },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound', locale: 'en-GB' },
};

const CurrencyContext = createContext();

const BASE_CURRENCY = 'USD'; // App data is assumed to be in USD

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('dyme_currency');
    return CURRENCIES[saved] || CURRENCIES.USD;
  });

  const [rates, setRates] = useState({ USD: 1, NGN: 1500, EUR: 0.92, GBP: 0.79 });
  const [ready, setReady] = useState(false);

  // Fetch live rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates) {
          setRates(data.rates);
          console.log('✅ Live rates updated:', data.rates);
        }
      } catch (err) {
        console.error('❌ Failed to fetch exchange rates:', err);
      } finally {
        setReady(true);
      }
    };

    fetchRates();
    // Refresh every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const setCurrency = useCallback((code) => {
    const next = CURRENCIES[code];
    if (!next) return;
    setCurrencyState(next);
    localStorage.setItem('dyme_currency', code);
  }, []);

  /**
   * Format and optionally convert an amount.
   * @param {number} amount - The amount in its original currency
   * @param {string} fromCurrency - The currency of the input amount
   */
  const format = useCallback((amount, fromCurrency = currency.code) => {
    if (amount === null || amount === undefined || isNaN(amount)) return `${currency.symbol}0.00`;

    let value = Number(amount);

    // Convert ONLY if input currency differs from current display currency
    if (fromCurrency !== currency.code && rates[fromCurrency] && rates[currency.code]) {
      const fromRate = rates[fromCurrency];
      const toRate = rates[currency.code];
      value = (value / fromRate) * toRate;
    }

    // Optional: round to 2 decimals to avoid floating point issues
    value = Math.round(value * 100) / 100;

    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, [currency, rates]);

  // Format an amount in a specific currency WITHOUT converting it
  const formatAmount = useCallback((amount, currencyCode = 'USD') => {
    if (amount === null || amount === undefined || isNaN(amount)) return `${CURRENCIES[currencyCode]?.symbol || '$'}0.00`;
    
    let value = Number(amount);
    value = Math.round(value * 100) / 100;
    
    const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;

    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      format,
      formatAmount,
      currencies: CURRENCIES,
      rates,
      ready
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};