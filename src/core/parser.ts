export interface ParsedInsert {
    table: string;
    columns: string[];
    values: any[][];
}

export function parseSQL(sql: string): ParsedInsert[] {
    const insertStatements: ParsedInsert[] = [];

    // Regular expression to match INSERT statements
    const insertRegex = /INSERT\s+INTO\s+`?(\w+)`?\s*\(([^)]+)\)\s*VALUES\s*(\([^)]+\)(?:\s*,\s*\([^)]+\))*);?/gi;

    let match;
    while ((match = insertRegex.exec(sql)) !== null) {
        const table = match[1];
        const columns = match[2].split(',').map(col => col.trim().replace(/`/g, ''));

        // Extract all value groups
        const valuesPart = match[3];
        const valueRegex = /\(([^)]+)\)/g;
        const values: any[][] = [];

        let valueMatch;
        while ((valueMatch = valueRegex.exec(valuesPart)) !== null) {
            const valueRow = valueMatch[1].split(',').map(val => {
                val = val.trim();
                // Try to convert to appropriate types
                if (val === 'NULL') return null;
                if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
                if (!isNaN(Number(val))) return Number(val);
                return val;
            });
            values.push(valueRow);
        }

        insertStatements.push({ table, columns, values });
    }

    return insertStatements;
}