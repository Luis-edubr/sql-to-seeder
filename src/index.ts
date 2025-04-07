import { parseSQL, ParsedInsert } from './core/parser';
import { generateLaravelSeeder } from './adapters/laravel';
import fs from 'fs';

export interface ConvertOptions {
    framework: 'laravel' | 'django' | 'prisma';
    className?: string;
    outputPath?: string;
}

/**
 * Convert SQL file to seeder
 */
export function convertSQLToSeeder(sqlContent: string, options: ConvertOptions): string {
    const parsedInserts = parseSQL(sqlContent);

    switch (options.framework) {
        case 'laravel':
            return generateLaravelSeeder(parsedInserts, options.className);
        // Future implementations
        case 'django':
        case 'prisma':
        default:
            throw new Error(`Framework ${options.framework} not yet supported`);
    }
}

/**
 * Convert SQL file to seeder and save to file
 */
export function convertSQLFileToSeeder(
    sqlFilePath: string,
    options: ConvertOptions
): void {
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    const seederContent = convertSQLToSeeder(sqlContent, options);

    if (options.outputPath) {
        fs.writeFileSync(options.outputPath, seederContent);
    } else {
        const defaultOutputPath = `${sqlFilePath.replace('.sql', '')}_seeder.php`;
        fs.writeFileSync(defaultOutputPath, seederContent);
    }
}

export { parseSQL, ParsedInsert };