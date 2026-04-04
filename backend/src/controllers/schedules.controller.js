import { supabase } from '../lib/supabase.js';
import { z } from 'zod';

const ScheduleSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).optional(),
  frequency: z.string(), // 'daily', 'weekly', 'bi-weekly', 'monthly', 'unstructured'
  next_expected_date: z.string().or(z.date()).nullable().optional(),
  last_received_date: z.string().or(z.date()).nullable().optional(),
  is_active: z.boolean().default(true),
});

export const getSchedules = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', req.user.id)
      .order('next_expected_date', { ascending: true });

    if (error) throw error;
    return res.json({ schedules: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const body = ScheduleSchema.parse(req.body);
    const { data, error } = await supabase
      .from('schedules')
      .insert({ ...body, user_id: req.user.id })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ schedule: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const body = ScheduleSchema.partial().parse(req.body);
    
    const { data, error } = await supabase
      .from('schedules')
      .update(body)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ schedule: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    return res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
