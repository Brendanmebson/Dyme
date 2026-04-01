// src/services/csvParser.service.js
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

/**
 * Universal CSV Parser for Bank Statements.
 * Automatically detects headers for Date, Description, and Amount.
 */
export const parseCSVStatement = async (csvContent, userId) => {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });

    if (records.length === 0) return [];

    // Map common header variations to our internal fields
    const headerMaps = {
      date: ['date', 'transaction date', 'value date', 'booking date', 'pstng date'],
      desc: ['description', 'memo', 'narrative', 'transaction details', 'remarks', 'payee'],
      amount: ['amount', 'transaction amount', 'value', 'withdrawal', 'deposit', 'credit', 'debit'],
      type: ['type', 'transaction type', 'cr/dr', 'credit/debit', 'direction'],
    };

    return records.map((row) => {
      const keys = Object.keys(row);

      // Find the best matching key for each field
      const findKey = (searchTerms) => 
        keys.find(k => searchTerms.some(term => k.toLowerCase().includes(term)));

      const dateKey = findKey(headerMaps.date);
      const descKey = findKey(headerMaps.desc);
      const amountKey = findKey(headerMaps.amount);
      const typeKey = findKey(headerMaps.type);

      // Handle Amount (remove commas, handle negative signs)
      let rawAmount = row[amountKey] || '0';
      let amount = Math.abs(parseFloat(rawAmount.replace(/[^0-9.-]/g, '')) || 0);

      // Handle Type (Income vs Expense)
      let type = 'expense';
      const rawType = (row[typeKey] || '').toLowerCase();
      const rawDescResource = (row[descKey] || '').toLowerCase();
      
      // Heuristic 1: If explicit 'credit' or 'inflow' in type column
      if (rawType.includes('credit') || rawType.includes('cr') || rawType.includes('in') || rawType.includes('deposit')) {
        type = 'income';
      } 
      // Heuristic 2: If the amount is positive and there is a separate debit column (rare in single-column CSVs)
      else if (parseFloat(rawAmount.replace(/,/g, '')) > 0 && !rawType.includes('debit')) {
        // If it's a single "Value" column, positive is usually income
        if (amountKey.toLowerCase() === 'value' || amountKey.toLowerCase() === 'amount') {
           type = parseFloat(rawAmount.replace(/,/g, '')) > 0 ? 'income' : 'expense';
        }
      }

      // Handle Date formats (attempt to standardize to YYYY-MM-DD)
      let dateValue = row[dateKey];
      let date = new Date().toISOString().split('T')[0];
      if (dateValue) {
        const parsedDate = new Date(dateValue);
        if (!isNaN(parsedDate)) {
          date = parsedDate.toISOString().split('T')[0];
        }
      }

      return {
        user_id: userId,
        description: row[descKey] || 'Bank Transaction',
        amount,
        type,
        category: 'Other',
        date,
        source: 'manual_csv',
        external_id: `csv_${userId}_${uuidv4()}`,
      };
    }).filter(tx => tx.amount > 0); // Filter out zero-amount rows
  } catch (err) {
    console.error('CSV Parsing Error:', err);
    throw new Error('Could not parse CSV file. Ensure it has Date, Description, and Amount columns.');
  }
};
