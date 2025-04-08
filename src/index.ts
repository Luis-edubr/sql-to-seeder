import { parseSQL, ParsedInsert } from './core/parser';
import { generateLaravelSeeder } from './adapters/laravel';
// import { generateDjangoSeeder } from './adapters/django';
import { generatePrismaSeeder } from './adapters/prisma';
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
            if (options.outputPath && !options.outputPath.endsWith('.php')) {
                throw new Error('Output file must have a .php extension');
            }
            return generateLaravelSeeder(parsedInserts, options.className);
        case 'django':
            // return generateDjangoSeeder(parsedInserts, options.className);
        case 'prisma':
            if (options.outputPath && (!options.outputPath.endsWith('.js') || !options.outputPath.endsWith('.ts'))) {
                throw new Error('Output file must have a .js or .ts extension');
            }
            return generatePrismaSeeder(parsedInserts, options.className);

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