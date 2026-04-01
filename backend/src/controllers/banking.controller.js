// src/controllers/banking.controller.js
import { supabase } from '../lib/supabase.js';
import { parseCSVStatement } from '../services/csvParser.service.js';

/**
 * MANUAL CSV UPLOAD (Universal Free Sync)
 * This is the primary way for individuals to sync their bank data for free.
 */
export const uploadCSVStatement = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    console.log(`Parsing CSV for user ${req.user.id}...`);
    const transactions = await parseCSVStatement(req.file.buffer.toString(), req.user.id);

    if (transactions.length > 0) {
      console.log(`Upserting ${transactions.length} transactions...`);
      const { error } = await supabase.from('transactions').upsert(transactions, {
        onConflict: 'external_id',
        ignoreDuplicates: true,
      });
      if (error) throw error;
    }

    // Update profile to show a bank is "connected" via CSV
    await supabase
      .from('profiles')
      .update({ 
        bank_connected: true, 
        bank_provider: 'manual_csv',
        bank_name: 'CSV Import'
      })
      .eq('id', req.user.id);

    return res.json({ 
      success: true, 
      count: transactions.length,
      message: `Successfully imported ${transactions.length} transactions.`
    });
  } catch (err) {
    console.error('CSV upload error:', err.message);
    return res.status(500).json({ error: err.message || 'Failed to parse or save CSV statement' });
  }
};

/**
 * Get bank connection status for current user
 */
export const getBankStatus = async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('bank_connected, bank_provider, bank_name')
      .eq('id', req.user.id)
      .single();

    return res.json({
      connected: profile?.bank_connected || false,
      provider: profile?.bank_provider || null,
      bank_name: profile?.bank_name || 'Manual',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get bank status' });
  }
};
