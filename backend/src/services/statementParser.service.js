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
      const content = fileBuffer.toString();
      const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
      
      // Heuristic: Find first line that looks like a header (contains at least 2 keywords)
      const headerKeywords = ['date', 'description', 'amount', 'narrative', 'memo', 'transaction', 'debit', 'credit', 'balance', 'particulars'];
      let headerLineIndex = 0;
      for (let i = 0; i < Math.min(lines.length, 20); i++) {
        const line = lines[i].toLowerCase();
        const matches = headerKeywords.filter(k => line.includes(k)).length;
        if (matches >= 2) {
          headerLineIndex = i;
          break;
        }
      }

      // Re-join from the header line onwards
      const csvData = lines.slice(headerLineIndex).join('\n');

      records = parse(csvData, {
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
      const headerKeywords = ['date', 'description', 'amount', 'narrative', 'memo', 'transaction', 'debit', 'credit', 'balance', 'particulars'];
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
      desc: ['description', 'memo', 'narrative', 'transaction details', 'remarks', 'payee', 'particulars', 'reference', 'ref'],
      amount: ['amount', 'transaction amount', 'value', 'transaction value'],
      debit: ['withdrawal', 'debit', 'dr', 'paid out', 'expense'],
      credit: ['deposit', 'credit', 'cr', 'paid in', 'income'],
      balance: ['balance', 'balance after', 'closing balance'],
      type: ['type', 'transaction type', 'cr/dr', 'credit/debit', 'direction', 'chanel', 'channel'],
    };

    return records.map((row) => {
      const keys = Object.keys(row);
      const findKey = (searchTerms) => 
        keys.find(k => {
          const kl = k.toLowerCase().trim();
          return searchTerms.some(term => {
            const tl = term.toLowerCase();
            // Exact match or contains as a whole word
            if (tl.length <= 3) {
              return kl === tl || new RegExp(`\\b${tl}\\b`).test(kl);
            }
            return kl.includes(tl);
          });
        });

      const dateKey = findKey(headerMaps.date);
      const descKey = findKey(headerMaps.desc);
      const amountKey = findKey(headerMaps.amount);
      const debitKey = findKey(headerMaps.debit);
      const creditKey = findKey(headerMaps.credit);
      const balanceKey = findKey(headerMaps.balance);
      const typeKey = findKey(headerMaps.type);

      // Handle Amount logic
      let amount = 0;
      let type = 'expense';

      // 1. Try dedicated Debit/Credit columns
      const rawDebit = String(row[debitKey] || '').replace(/[^0-9.-]/g, '');
      const rawCredit = String(row[creditKey] || '').replace(/[^0-9.-]/g, '');
      const debitVal = Math.abs(parseFloat(rawDebit) || 0);
      const creditVal = Math.abs(parseFloat(rawCredit) || 0);

      if (debitVal > 0 && creditVal > 0) {
        // Unusual case where both have values, use the larger one or handle as needed
        // For now, if both exist, we'll favor the one that matches common patterns
        amount = debitVal + creditVal; // Maybe they split a transaction? Unlikely but safe.
      } else if (debitVal > 0) {
        amount = debitVal;
        type = 'expense';
      } else if (creditVal > 0) {
        amount = creditVal;
        type = 'income';
      } 
      // 2. Fallback to generic "Amount" column
      else if (amountKey) {
        let rawAmount = String(row[amountKey] || '0');
        amount = Math.abs(parseFloat(rawAmount.replace(/[^0-9.-]/g, '')) || 0);
        
        // Income vs Expense heuristics for generic amount
        const rawType = String(row[typeKey] || '').toLowerCase();
        
        if (rawType.includes('credit') || rawType.includes('cr') || rawType.includes('in') || rawType.includes('deposit')) {
          type = 'income';
        } else if (parseFloat(rawAmount.replace(/,/g, '')) > 0) {
           type = 'income';
        }
      }
      // 3. Last fallback: Balance change (rarely used but good to have)
      else if (balanceKey) {
        // We can't easily calculate amount from a single balance row without the previous one
        // so we'll just skip or default.
      }

      // Date normalization
      let dateValue = row[dateKey];
      let date = new Date().toISOString().split('T')[0];
      
      if (dateValue) {
        if (dateValue instanceof Date) {
          date = dateValue.toISOString().split('T')[0];
        } else {
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
