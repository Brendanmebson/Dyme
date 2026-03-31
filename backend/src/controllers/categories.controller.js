// src/controllers/categories.controller.js
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';

const CategorySchema = z.object({
  name:  z.string().min(1),
  type:  z.enum(['expense', 'income', 'both']).default('expense'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').default('#98a2b3'),
  icon:  z.string().optional(),
});

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', type: 'expense', color: '#f59e0b', is_default: true },
  { name: 'Transportation', type: 'expense', color: '#3b82f6', is_default: true },
  { name: 'Shopping', type: 'expense', color: '#8b5cf6', is_default: true },
  { name: 'Entertainment', type: 'expense', color: '#ec4899', is_default: true },
  { name: 'Bills & Utilities', type: 'expense', color: '#ef4444', is_default: true },
  { name: 'Healthcare', type: 'expense', color: '#10b981', is_default: true },
  { name: 'Travel', type: 'expense', color: '#06b6d4', is_default: true },
  { name: 'Education', type: 'expense', color: '#6366f1', is_default: true },
  { name: 'Salary', type: 'income', color: '#10b981', is_default: true },
  { name: 'Freelance', type: 'income', color: '#3b82f6', is_default: true },
  { name: 'Investment', type: 'income', color: '#8b5cf6', is_default: true },
  { name: 'Other', type: 'both', color: '#98a2b3', is_default: true },
];

// GET /api/categories
export const getCategories = async (req, res) => {
  const { type } = req.query;

  let query = supabase
    .from('categories')
    .select('*')
    .eq('user_id', req.user.id)
    .order('is_default', { ascending: false })
    .order('name');

  if (type) query = query.in('type', [type, 'both']);

  let { data, error } = await query;
  if (error) throw error;

  if (data.length === 0) {
    // Check if user has ANY categories at all before seeding
    const { count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);
      
    if (count === 0) {
      const defaults = DEFAULT_CATEGORIES.map(c => ({ ...c, user_id: req.user.id }));
      await supabase.from('categories').insert(defaults);
      
      // Re-create the query to fetch the newly seeded items
      let q2 = supabase
        .from('categories')
        .select('*')
        .eq('user_id', req.user.id)
        .order('is_default', { ascending: false })
        .order('name');
        
      if (type) q2 = q2.in('type', [type, 'both']);

      const { data: newData, error: newError } = await q2;
      if (newError) throw newError;
      data = newData;
    }
  }

  return res.json({ categories: data });
};

// POST /api/categories
export const createCategory = async (req, res) => {
  const body = CategorySchema.parse(req.body);

  const { data, error } = await supabase
    .from('categories')
    .insert({ ...body, user_id: req.user.id })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Category with this name already exists' });
    }
    throw error;
  }

  return res.status(201).json({ category: data });
};

// PATCH /api/categories/:id
export const updateCategory = async (req, res) => {
  const body = CategorySchema.partial().parse(req.body);

  // Check exists and belongs to user
  const { data: existing } = await supabase
    .from('categories')
    .select('is_default')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Category not found' });

  const { data, error } = await supabase
    .from('categories')
    .update(body)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Category with this name already exists' });
    }
    throw error;
  }

  return res.json({ category: data });
};

// DELETE /api/categories/:id  (only non-default)
export const deleteCategory = async (req, res) => {
  const { data: cat } = await supabase
    .from('categories')
    .select('is_default')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!cat) return res.status(404).json({ error: 'Category not found' });
  if (cat.is_default) return res.status(400).json({ error: 'Cannot delete a default category' });

  await supabase.from('categories').delete().eq('id', req.params.id);

  return res.status(204).send();
};
