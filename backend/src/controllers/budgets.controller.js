// src/controllers/budgets.controller.js
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const BudgetSchema = z.object({
  category:     z.string().min(1),
  limit_amount: z.number().positive('Limit must be positive'),
  period:       z.enum(['monthly', 'weekly', 'yearly']).default('monthly'),
  start_date:   z.string().datetime().optional(),
  end_date:     z.string().datetime().optional(),
  selected_transaction_ids: z.array(z.string().uuid()).optional(),
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
    start_date: b.start_date,
    end_date:   b.end_date,
    created_at: b.created_at,
  }));

  return res.json({ budgets });
};

// POST /api/budgets
export const createBudget = async (req, res) => {
  const body = BudgetSchema.parse(req.body);
  const { selected_transaction_ids, ...budgetData } = body;

  const { data, error } = await supabase
    .from('budgets')
    .insert({ ...budgetData, user_id: req.user.id })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A budget for this category already exists' });
    }
    throw error;
  }

  // Handle historical transaction selection
  if (selected_transaction_ids && selected_transaction_ids.length > 0) {
    const budgetTransactions = selected_transaction_ids.map(txId => ({
      budget_id: data.id,
      transaction_id: txId,
      user_id: req.user.id,
    }));

    const { error: btError } = await supabase
      .from('budget_transactions')
      .insert(budgetTransactions);

    if (btError) {
      console.error('Error inserting budget_transactions:', btError);
      // We don't throw here to avoid failing the whole budget creation
    }
  }

  // To return with correct 'spent' amount, we re-fetch via the view
  const { data: budgetWithSpent, error: viewError } = await supabase
    .from('budgets_with_spent')
    .select('*')
    .eq('id', data.id)
    .single();

  if (viewError) {
    return res.status(201).json({
      budget: {
        ...data,
        limit: Number(data.limit_amount),
        spent: 0,
      },
    });
  }

  return res.status(201).json({
    budget: {
      ...budgetWithSpent,
      limit: Number(budgetWithSpent.limit_amount),
      spent: Number(budgetWithSpent.spent),
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
