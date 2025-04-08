import { ParsedInsert } from './parser';

export interface ConversionOptions {
  dateFormat?: string;
  timestampFormat?: string;
  includeNullValues?: boolean;
}

export interface NormalizedData {
  table: string;
  records: Record<string, any>[];
}

export function convertToNormalizedData(
  parsedInserts: ParsedInsert[],
  options: ConversionOptions = {}
): NormalizedData[] {
  return parsedInserts.map(insert => {
    const records = insert.values.map(valueRow => {
      const record: Record<string, any> = {};
      
      // Map each column to its value
      insert.columns.forEach((column, index) => {
        const value = valueRow[index];
        
        // Skip null values if specified in options
        if (value === null && options.includeNullValues === false) {
          return;
        }
        
        record[column] = value;
      });
      
      return record;
    });
    
    return {
      table: insert.table,
      records
    };
  });
}