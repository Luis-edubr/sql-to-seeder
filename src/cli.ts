#!/usr/bin/env node
import { program } from 'commander';
import { convertSQLFileToSeeder } from './index';
import fs from 'fs';
import path from 'path';

program
    .name('sql-to-seeder')
    .description('Convert SQL files to framework seeders')
    .version('0.1.0');

program
    .argument('<sqlFile>', 'SQL file to convert')
    .option('-f, --framework <framework>', 'Target framework (laravel, django, prisma)', 'laravel')
    .option('-c, --class-name <className>', 'Seeder class name')
    .option('-o, --output <outputPath>', 'Output file path')
    .action((sqlFile, options) => {
        try {
            if (!fs.existsSync(sqlFile)) {
                console.error(`File not found: ${sqlFile}`);
                process.exit(1);
            }

            const className = options.className ||
                path.basename(sqlFile, path.extname(sqlFile))
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('') + 'Seeder';

            convertSQLFileToSeeder(sqlFile, {
                framework: options.framework,
                className,
                outputPath: options.output
            });

            console.log(`✅ SQL converted successfully${options.output ? ` to ${options.output}` : ''}`);
        } catch (error) {
            console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    });

program.parse();