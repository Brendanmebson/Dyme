// src/controllers/budgets.controller.js
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const BudgetSchema = z.object({
  category:     z.string().min(1),
  limit_amount: z.number().positive('Limit must be positive'),
  period:       z.enum(['monthly', 'weekly', 'yearly']).default('monthly'),
});

// GET /api/budgets  — returns budgets with live spent amount
export const getBudgets = async (req, res) => {
  const { data, error } = await supabase
    .from('budgets_with_spent')  // view
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Shape to match frontend expectations
  const budgets = data.map((b) => ({
    id:       b.id,
    category: b.category,
    limit:    Number(b.limit_amount),
    spent:    Number(b.spent),
    period:   b.period,
    created_at: b.created_at,
  }));

  return res.json({ budgets });
};

// POST /api/budgets
export const createBudget = async (req, res) => {
  const body = BudgetSchema.parse(req.body);

  const { data, error } = await supabase
    .from('budgets')
    .insert({ ...body, user_id: req.user.id })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A budget for this category already exists' });
    }
    throw error;
  }

  return res.status(201).json({
    budget: {
      ...data,
      limit: Number(data.limit_amount),
      spent: 0,
    },
  });
};

// PATCH /api/budgets/:id
export const updateBudget = async (req, res) => {
  const body = BudgetSchema.partial().parse(req.body);

  const { data, error } = await supabase
    .from('budgets')
    .update(body)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error || !data) return res.status(404).json({ error: 'Budget not found' });

  return res.json({ budget: { ...data, limit: Number(data.limit_amount) } });
};

// DELETE /api/budgets/:id
export const deleteBudget = async (req, res) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) throw error;

  return res.status(204).send();
};
