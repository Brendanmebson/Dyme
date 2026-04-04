// src/controllers/notifications.controller.js
import { supabase } from '../lib/supabase.js';
import { differenceInDays, parseISO } from 'date-fns';

export const getNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('notifications')
      .update({ status })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    return res.json({ message: 'Notification deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/**
 * Sync notifications by checking upcoming events.
 * This is called by the frontend on dashboard load.
 */
export const syncNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch relevant data
    const [subs, schedules] = await Promise.all([
      supabase.from('subscriptions').select('*').eq('user_id', userId),
      supabase.from('schedules').select('*').eq('user_id', userId),
    ]);

    const notificationsToCreate = [];
    const now = new Date();

    // 2. Check Subscriptions (≤ 7 days)
    if (subs.data) {
      for (const sub of subs.data) {
        if (!sub.next_billing_date) continue;
        const daysLeft = differenceInDays(parseISO(sub.next_billing_date), now);
        
        if (daysLeft >= 0 && daysLeft <= 7) {
          notificationsToCreate.push({
            user_id: userId,
            type: 'subscription',
            title: `Renewal Soon: ${sub.name}`,
            message: `Your ${sub.name} subscription renews in ${daysLeft} days (${sub.next_billing_date}).`,
            data: { subscription_id: sub.id, days_left: daysLeft },
          });
        }
      }
    }

    // 3. Check Unstructured Income
    if (schedules.data) {
      for (const s of schedules.data) {
        if (s.frequency === 'unstructured') {
          const lastDate = s.last_received_date ? parseISO(s.last_received_date) : null;
          const daysSinceLast = lastDate ? differenceInDays(now, lastDate) : 999;

          if (daysSinceLast > 25) {
            notificationsToCreate.push({
              user_id: userId,
              type: 'income_prompt',
              title: `Payment Check-in: ${s.name}`,
              message: `Have you been paid for ${s.name} recently?`,
              data: { schedule_id: s.id, amount: s.amount, currency: s.currency },
            });
          }
        }
      }
    }

    // 4. Batch check for existing notifications to avoid duplicates
    // For this prototype, we'll check by title and user_id (simplistic)
    // In production, we'd use a more robust unique key (e.g. type + ref_id + date)
    
    const { data: existing } = await supabase
      .from('notifications')
      .select('title')
      .eq('user_id', userId)
      .eq('status', 'unread'); // Only avoid duplicating active/unread ones

    const existingTitles = new Set(existing?.map(n => n.title) || []);
    const newNotifications = notificationsToCreate.filter(n => !existingTitles.has(n.title));

    if (newNotifications.length > 0) {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(newNotifications);
      if (insertError) throw insertError;
    }

    return res.json({ synced: true, created: newNotifications.length });
  } catch (err) {
    console.error('Sync Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
