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
    } else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.xslx')) {
      // Handle Excel
      const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to array of arrays first to find the header row
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      // Heuristic: Find the header row (scan first 20 rows)
      const headerKeywords = ['date', 'description', 'amount', 'narrative', 'memo', 'transaction'];
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const row = rows[i];
        const rowString = row.join(' ').toLowerCase();
        const matches = headerKeywords.filter(k => rowString.includes(k)).length;
        if (matches >= 2) { // At least two keywords found
          headerRowIndex = i;
          break;
        }
      }

      // Convert to JSON using the found header row
      records = XLSX.utils.sheet_to_json(worksheet, { 
        range: headerRowIndex,
        defval: '' 
      });
    } else {
      throw new Error('Unsupported file format. Please use .csv, .xlsx, or .xls');
    }

    if (records.length === 0) return [];

    // Map common header variations
    const headerMaps = {
      date: ['date', 'transaction date', 'value date', 'booking date', 'pstng date', 'tran date', 'val date'],
      desc: ['description', 'memo', 'narrative', 'transaction details', 'remarks', 'payee', 'particulars'],
      amount: ['amount', 'transaction amount', 'value', 'withdrawal', 'deposit', 'credit', 'debit', 'balance'],
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
      
      // Heuristic 1: Explicit type column
      if (rawType.includes('credit') || rawType.includes('cr') || rawType.includes('in') || rawType.includes('deposit')) {
        type = 'income';
      } 
      // Heuristic 2: Positive value in an "Amount" column often means income if it's not a debit column
      else if (parseFloat(rawAmount.replace(/,/g, '')) > 0) {
        if (!amountKey?.toLowerCase().includes('debit') && !amountKey?.toLowerCase().includes('withdrawal')) {
           type = 'income';
        }
      }

      // Date normalization
      let dateValue = row[dateKey];
      let date = new Date().toISOString().split('T')[0];
      
      if (dateValue) {
        // If SheetJS parsed it as a Date object (cellDates: true)
        if (dateValue instanceof Date) {
          date = dateValue.toISOString().split('T')[0];
        } else {
          // Fallback parsing for strings
          const parsedDate = new Date(dateValue);
          if (!isNaN(parsedDate)) {
            date = parsedDate.toISOString().split('T')[0];
          }
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
    }).filter(tx => tx.amount > 0 && tx.description !== 'Imported Transaction');
  } catch (err) {
    console.error('Statement Parser Error:', err);
    throw new Error('Could not parse file. Ensure it has Date, Description, and Amount columns.');
  }
};
