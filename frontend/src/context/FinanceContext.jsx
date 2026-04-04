// src/context/FinanceContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval, format, subMonths } from 'date-fns';
import { transactionsService } from '../services/transactions.service.js';
import { budgetsService }      from '../services/budgets.service.js';
import { categoriesService }   from '../services/categories.service.js';
import { subscriptionsService } from '../services/subscriptions.service.js';
import { schedulesService }     from '../services/schedules.service.js';
import { loansService }         from '../services/loans.service.js';
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
  const [subscriptions, setSubscriptions] = useState([]);
  const [schedules, setSchedules]       = useState([]);
  const [loans, setLoans]               = useState([]);
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
        const [txData, budgetData, catData, subData, scheduleData, loanData] = await Promise.all([
          transactionsService.getAll({ limit: 500 }),
          budgetsService.getAll(),
          categoriesService.getAll(),
          subscriptionsService.getAll(),
          schedulesService.getAll(),
          loansService.getAll(),
        ]);
        setTransactions(txData.transactions);
        setBudgets(budgetData);
        setCategories(catData);
        setSubscriptions(subData || []);
        setSchedules(scheduleData || []);
        setLoans(loanData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [user]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [txData, budgetData, catData, subData, scheduleData, loanData] = await Promise.all([
        transactionsService.getAll({ limit: 500 }),
        budgetsService.getAll(),
        categoriesService.getAll(),
        subscriptionsService.getAll(),
        schedulesService.getAll(),
        loansService.getAll(),
      ]);
      setTransactions(txData.transactions);
      setBudgets(budgetData);
      setCategories(catData);
      setSubscriptions(subData || []);
      setSchedules(scheduleData || []);
      setLoans(loanData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Transactions ───────────────────────────────────────────
  const addTransaction = useCallback(async (transaction) => {
    const created = await transactionsService.create({
      ...transaction,
      date: transaction.date || new Date().toISOString(),
    });
    setTransactions((prev) => [created, ...prev]);

    // Update budget spent is now handled by enrichedBudgets mapping over transactions
    return created;
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await transactionsService.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
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

  // ── Subscriptions ──────────────────────────────────────────
  const addSubscription = useCallback(async (sub) => {
    const created = await subscriptionsService.create(sub);
    setSubscriptions((prev) => [...prev, created]);
    return created;
  }, []);

  const updateSubscription = useCallback(async (id, updates) => {
    const updated = await subscriptionsService.update(id, updates);
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const deleteSubscription = useCallback(async (id) => {
    await subscriptionsService.delete(id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ── Schedules ──────────────────────────────────────────────
  const addSchedule = useCallback(async (schedule) => {
    const created = await schedulesService.create(schedule);
    setSchedules((prev) => [...prev, created]);
    return created;
  }, []);

  const updateSchedule = useCallback(async (id, updates) => {
    const updated = await schedulesService.update(id, updates);
    setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const deleteSchedule = useCallback(async (id) => {
    await schedulesService.delete(id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ── Loans ──────────────────────────────────────────────────
  const addLoan = useCallback(async (loan) => {
    const created = await loansService.create(loan);
    setLoans((prev) => [...prev, created]);
    return created;
  }, []);

  const updateLoan = useCallback(async (id, updates) => {
    const updated = await loansService.update(id, updates);
    setLoans((prev) => prev.map((l) => (l.id === id ? updated : l)));
    return updated;
  }, []);

  const deleteLoan = useCallback(async (id) => {
    await loansService.delete(id);
    setLoans((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ── Analytics helpers (Always calculate in USD/Base) ────────
  const getConvertedAmount = useCallback((amount, fromCurr) => {
    const c = fromCurr || 'USD';
    if (c === 'USD') return Number(amount);
    if (rates[c]) {
      // Convert from source currency to USD
      return Number(amount) / rates[c];
    }
    return Number(amount);
  }, [rates]);

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
        const amountInUSD = getConvertedAmount(t.amount, t.currency);
        totals[t.category] = (totals[t.category] || 0) + amountInUSD;
      });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, rates]);

  const getBalances = useCallback(() => {
    let account = 0;
    let cash = 0;

    transactions.forEach((t) => {
      const amt = getConvertedAmount(t.amount, t.currency);
      if (t.type === 'income') {
        if (t.destination === 'cash') cash += amt;
        else account += amt;
      } else if (t.type === 'expense') {
        if (t.source === 'cash') cash -= amt;
        else account -= amt;
      } else if (t.type === 'transfer') {
        if (t.source === 'account' && t.destination === 'cash') {
          account -= amt; cash += amt;
        } else if (t.source === 'cash' && t.destination === 'account') {
          cash -= amt; account += amt;
        }
      }
    });

    return { account, cash, total: account + cash };
  }, [transactions, getConvertedAmount]);

  // ── Enriched Budgets (Live calculate 'spent' from transactions) ──
  const enrichedBudgets = React.useMemo(() => {
    return budgets.map((b) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === b.category)
        .reduce((sum, t) => {
          const amountInUSD = getConvertedAmount(t.amount, t.currency);
          const amountInDisplayCurr = amountInUSD * (rates[currency.code] || 1);
          return sum + amountInDisplayCurr;
        }, 0);
      return { ...b, spent };
    });
  }, [budgets, transactions, rates, currency, getConvertedAmount]);

  // ── Display Transactions (Splits transfers into two visual rows) ──
  const displayTransactions = React.useMemo(() => {
    return transactions.flatMap((t) => {
      if (t.type === 'transfer') {
        const outLeg = {
          ...t,
          id: `${t.id}-out`,
          type: 'expense',
          description: `${t.description} (to ${t.destination})`,
          realId: t.id,
        };
        const inLeg = {
          ...t,
          id: `${t.id}-in`,
          type: 'income',
          description: `${t.description} (from ${t.source})`,
          realId: t.id,
        };
        return [outLeg, inLeg];
      }
      return [{ ...t, realId: t.id }];
    });
  }, [transactions]);

  const value = {
    transactions,
    displayTransactions,
    budgets: enrichedBudgets,
    subscriptions,
    schedules,
    loans,
    categories,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addLoan,
    updateLoan,
    deleteLoan,
    getMonthlyData,
    getSpendingByCategory,
    getBalances,
    getConvertedAmount,
    refreshData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
