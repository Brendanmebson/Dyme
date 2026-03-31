// src/context/FinanceContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval, format, subMonths } from 'date-fns';
import { transactionsService } from '../services/transactions.service.js';
import { budgetsService }      from '../services/budgets.service.js';
import { categoriesService }   from '../services/categories.service.js';
import { useAuth }             from './AuthContext.jsx';
import { useCurrency }         from './CurrencyContext.jsx';

const FinanceContext = createContext(null);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  const { currency, rates } = useCurrency();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets]           = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // ── Bootstrap all data when user logs in ───────────────────
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    const bootstrap = async () => {
      setLoading(true);
      try {
        const [txData, budgetData, catData] = await Promise.all([
          transactionsService.getAll({ limit: 500 }),
          budgetsService.getAll(),
          categoriesService.getAll(),
        ]);
        setTransactions(txData.transactions);
        setBudgets(budgetData);
        setCategories(catData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [user]);

  // ── Transactions ───────────────────────────────────────────
  const addTransaction = useCallback(async (transaction) => {
    const created = await transactionsService.create({
      ...transaction,
      date: transaction.date || new Date().toISOString(),
    });
    setTransactions((prev) => [created, ...prev]);

    // Update budget spent optimistically
    if (created.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === created.category
            ? { ...b, spent: b.spent + Number(created.amount) }
            : b
        )
      );
    }

    return created;
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    const tx = transactions.find((t) => t.id === id);
    await transactionsService.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (tx?.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === tx.category
            ? { ...b, spent: Math.max(0, b.spent - Number(tx.amount)) }
            : b
        )
      );
    }
  }, [transactions]);

  // ── Budgets ───────────────────────────────────────────────
  const addBudget = useCallback(async (budget) => {
    const created = await budgetsService.create(budget);
    setBudgets((prev) => [...prev, created]);
    return created;
  }, []);

  const updateBudget = useCallback(async (id, updates) => {
    const updated = await budgetsService.update(id, updates);
    setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const deleteBudget = useCallback(async (id) => {
    await budgetsService.delete(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // ── Analytics helpers ──────────────────────────────────────
  const getConvertedAmount = useCallback((amount, fromCurr) => {
    const c = fromCurr || 'USD';
    if (c === currency.code) return Number(amount);
    if (rates[c] && rates[currency.code]) {
      return (Number(amount) / rates[c]) * rates[currency.code];
    }
    return Number(amount);
  }, [currency.code, rates]);

  const getMonthlyData = useCallback((month = new Date()) => {
    const start = startOfMonth(month);
    const end   = endOfMonth(month);

    const monthlyTx = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start, end })
    );
    const income   = monthlyTx.filter((t) => t.type === 'income').reduce((s, t) => s + getConvertedAmount(t.amount, t.currency), 0);
    const expenses = monthlyTx.filter((t) => t.type === 'expense').reduce((s, t) => s + getConvertedAmount(t.amount, t.currency), 0);

    return { income, expenses, transactions: monthlyTx };
  }, [transactions, getConvertedAmount]);

  const getSpendingByCategory = useCallback(() => {
    const totals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + getConvertedAmount(t.amount, t.currency);
      });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, getConvertedAmount]);

  const value = {
    transactions,
    budgets,
    categories,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    getMonthlyData,
    getSpendingByCategory,
    getConvertedAmount,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
