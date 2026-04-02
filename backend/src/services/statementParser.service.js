// src/services/statementParser.service.js
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

/**
 * Universal Statement Parser (CSV, XLSX, XLS).
 * Automatically detects headers for Date, Description, and Amount.
 */
export const parseStatement = async (fileBuffer, fileName, userId, currency = 'USD') => {
  try {
    let records = [];
    const lowerName = fileName.toLowerCase();

    if (lowerName.endsWith('.csv')) {
      // Handle CSV
      records = parse(fileBuffer.toString(), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
    } else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
      // Handle Excel
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      records = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    } else {
      throw new Error('Unsupported file format. Please use .csv, .xlsx, or .xls');
    }

    if (records.length === 0) return [];

    // Map common header variations
    const headerMaps = {
      date: ['date', 'transaction date', 'value date', 'booking date', 'pstng date'],
      desc: ['description', 'memo', 'narrative', 'transaction details', 'remarks', 'payee'],
      amount: ['amount', 'transaction amount', 'value', 'withdrawal', 'deposit', 'credit', 'debit'],
      type: ['type', 'transaction type', 'cr/dr', 'credit/debit', 'direction'],
    };

    return records.map((row) => {
      const keys = Object.keys(row);
      const findKey = (searchTerms) => 
        keys.find(k => searchTerms.some(term => k.toLowerCase().includes(term)));

      const dateKey = findKey(headerMaps.date);
      const descKey = findKey(headerMaps.desc);
      const amountKey = findKey(headerMaps.amount);
      const typeKey = findKey(headerMaps.type);

      // Handle Amount
      let rawAmount = String(row[amountKey] || '0');
      let amount = Math.abs(parseFloat(rawAmount.replace(/[^0-9.-]/g, '')) || 0);

      // Income vs Expense heuristics
      let type = 'expense';
      const rawType = String(row[typeKey] || '').toLowerCase();
      const rawDesc = String(row[descKey] || '').toLowerCase();
      
      if (rawType.includes('credit') || rawType.includes('cr') || rawType.includes('in') || rawType.includes('deposit')) {
        type = 'income';
      } else if (parseFloat(rawAmount.replace(/,/g, '')) > 0) {
        if (amountKey?.toLowerCase().includes('value') || amountKey?.toLowerCase().includes('amount')) {
           type = parseFloat(rawAmount.replace(/,/g, '')) > 0 ? 'income' : 'expense';
        }
      }

      // Date normalization
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
        description: row[descKey] || 'Imported Transaction',
        amount,
        type,
        currency,
        category: 'Other',
        date,
        source: 'statement_import',
        external_id: `stmt_${userId}_${uuidv4()}`,
      };
    }).filter(tx => tx.amount > 0);
  } catch (err) {
    console.error('Statement Parser Error:', err);
    throw new Error('Could not parse file. Ensure it has Date, Description, and Amount columns.');
  }
};
