import { ParsedInsert } from '../core/parser';

export function generateLaravelSeeder(
    parsedInserts: ParsedInsert[],
    className: string = 'DatabaseSeeder'
): string {
    let output = `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\DB;

class ${className} extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {`;

    for (const insert of parsedInserts) {
        output += `
        // Seed ${insert.table} table
        $data = [\n`;

        // For each row of values
        for (const row of insert.values) {
            output += `            [\n`;

            // Map columns to values
            for (let i = 0; i < insert.columns.length; i++) {
                const column = insert.columns[i];
                const value = row[i];

                if (value === null) {
                    output += `                '${column}' => null,\n`;
                } else if (typeof value === 'number') {
                    output += `                '${column}' => ${value},\n`;
                } else {
                    // Escape single quotes for string values
                    const escapedValue = String(value).replace(/'/g, "\\'");
                    output += `                '${column}' => '${escapedValue}',\n`;
                }
            }

            output += `            ],\n`;
        }

        output += `        ];
        
        DB::table('${insert.table}')->insert($data);\n`;
    }

    output += `    }
}
`;

    return output;
}