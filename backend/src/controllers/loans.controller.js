import { supabase } from '../lib/supabase.js';
import { z } from 'zod';

const LoanSchema = z.object({
  name: z.string().min(1),
  total_amount: z.number().positive(),
  remaining_amount: z.number().nonnegative(),
  currency: z.string().length(3).optional(),
  type: z.enum(['lent', 'borrowed']),
  due_date: z.string().or(z.date()).nullable().optional(),
  description: z.string().optional(),
});

export const getLoans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', req.user.id)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return res.json({ loans: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const body = LoanSchema.parse(req.body);
    const { data, error } = await supabase
      .from('loans')
      .insert({ ...body, user_id: req.user.id })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ loan: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const body = LoanSchema.partial().parse(req.body);
    
    const { data, error } = await supabase
      .from('loans')
      .update(body)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ loan: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    return res.json({ message: 'Loan deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
