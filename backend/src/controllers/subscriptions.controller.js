import { supabase } from '../lib/supabase.js';
import { z } from 'zod';

const SubscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).optional(),
  frequency: z.string(),
  is_recurring: z.boolean().default(true),
  next_billing_date: z.string().or(z.date()),
  logo_url: z.string().optional(),
});

export const getSubscriptions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('next_billing_date', { ascending: true });

    if (error) throw error;
    return res.json({ subscriptions: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const body = SubscriptionSchema.parse(req.body);
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({ ...body, user_id: req.user.id })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ subscription: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const body = SubscriptionSchema.partial().parse(req.body);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .update(body)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ subscription: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    return res.json({ message: 'Subscription deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
