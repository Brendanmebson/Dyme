// src/controllers/transactions.controller.js
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const TransactionSchema = z.object({
  type:        z.enum(['income', 'expense']),
  amount:      z.number().positive('Amount must be positive'),
  category:    z.string().min(1),
  description: z.string().min(1),
  currency:    z.string().min(1).default('USD'),
  date:        z.string().datetime().optional(),
  notes:       z.string().optional(),
});

// Zod schema for query params
const GetTransactionsQuerySchema = z.object({
  page:     z.coerce.number().int().positive().default(1),
  limit:    z.coerce.number().int().min(1).max(1000).default(50),
  type:     z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).optional(),
  search:   z.string().max(100).optional(),
  from:     z.string().datetime().optional(),
  to:       z.string().datetime().optional(),
  sort:     z.enum(['date', 'amount', 'created_at']).default('date'),
  order:    z.enum(['asc', 'desc']).default('desc'),
});

// Sanitise search string to prevent PostgREST filter injection
const sanitiseSearch = (str) => str.replace(/[%,]/g, '');

// GET /api/transactions
export const getTransactions = async (req, res) => {
  const query = GetTransactionsQuerySchema.parse(req.query);
  const { page, limit, type, category, search, from, to, sort, order } = query;

  const offset = (page - 1) * limit;

  let q = supabase
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', req.user.id)
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1);

  if (type)     q = q.eq('type', type);
  if (category) q = q.eq('category', category);
  if (from)     q = q.gte('date', from);
  if (to)       q = q.lte('date', to);
  if (search) {
    const safe = sanitiseSearch(search);
    q = q.or(`description.ilike.%${safe}%,category.ilike.%${safe}%`);
  }

  const { data, error, count } = await q;
  if (error) throw error;

  return res.json({
    transactions: data,
    pagination: {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    },
  });
};

// GET /api/transactions/:id
export const getTransaction = async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Transaction not found' });

  return res.json({ transaction: data });
};

// POST /api/transactions
export const createTransaction = async (req, res) => {
  const body = TransactionSchema.parse(req.body);

  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...body, user_id: req.user.id })
    .select()
    .single();

  if (error) throw error;

  return res.status(201).json({ transaction: data });
};

// PATCH /api/transactions/:id
export const updateTransaction = async (req, res) => {
  const body = TransactionSchema.partial().parse(req.body);

  const { data, error } = await supabase
    .from('transactions')
    .update(body)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error || !data) return res.status(404).json({ error: 'Transaction not found' });

  return res.json({ transaction: data });
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) throw error;

  return res.status(204).send();
};

// GET /api/transactions/summary/monthly
export const getMonthlySummary = async (req, res) => {
  const { months = 6 } = req.query;
  const from = new Date();
  from.setMonth(from.getMonth() - parseInt(months) + 1);
  from.setDate(1);
  from.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('monthly_summary')
    .select('*')
    .eq('user_id', req.user.id)
    .gte('month', from.toISOString())
    .order('month', { ascending: true });

  if (error) throw error;

  return res.json({ summary: data });
};

// GET /api/transactions/summary/categories
export const getCategorySummary = async (req, res) => {
  const { from, to } = req.query;

  const start = from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const end   = to   || new Date().toISOString();

  const { data, error } = await supabase
    .from('transactions')
    .select('category, amount, type')
    .eq('user_id', req.user.id)
    .gte('date', start)
    .lte('date', end);

  if (error) throw error;

  const byCategory = {};
  data.forEach(({ category, amount, type }) => {
    if (!byCategory[category]) byCategory[category] = { category, income: 0, expense: 0, total: 0 };
    byCategory[category][type] += Number(amount);
    byCategory[category].total += type === 'income' ? Number(amount) : -Number(amount);
  });

  const result = Object.values(byCategory)
    .filter(c => c.expense > 0)
    .sort((a, b) => b.expense - a.expense);

  return res.json({ categories: result });
};

// GET /api/transactions/summary/balance
// Returns all-time and current-month net balance for the dashboard home screen
export const getBalance = async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', req.user.id);

  if (error) throw error;

  let totalIncome = 0;
  let totalExpense = 0;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let monthIncome = 0;
  let monthExpense = 0;

  data.forEach(({ amount, type, date }) => {
    const amt = Number(amount);
    if (type === 'income') {
      totalIncome += amt;
    } else {
      totalExpense += amt;
    }
  });

  // Current month — re-query with date filter for accuracy
  const { data: monthData, error: monthError } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', req.user.id)
    .gte('date', monthStart.toISOString());

  if (monthError) throw monthError;

  monthData.forEach(({ amount, type }) => {
    const amt = Number(amount);
    if (type === 'income') monthIncome += amt;
    else monthExpense += amt;
  });

  return res.json({
    balance: {
      all_time: {
        income:  totalIncome,
        expense: totalExpense,
        net:     totalIncome - totalExpense,
      },
      current_month: {
        income:  monthIncome,
        expense: monthExpense,
        net:     monthIncome - monthExpense,
      },
    },
  });
};
