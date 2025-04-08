import { ParsedInsert } from '../core/parser';

export function generatePrismaSeeder(
  parsedInserts: ParsedInsert[],
  className: string = 'seed'
): string {
  // Início do arquivo com imports e setup do PrismaClient
  let output = `import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {`;

  // Para cada tabela encontrada nos INSERTs
  for (const insert of parsedInserts) {
    // Converter o nome da tabela para o formato camelCase usado pelo Prisma
    // Ex: 'user_profiles' -> 'userProfile'
    const modelName = toPrismaModelName(insert.table);
    
    output += `\n  // Seed data for ${insert.table}\n`;
    
    // Se tivermos múltiplos registros, usamos createMany
    if (insert.values.length > 1) {
      output += `  await prisma.${modelName}.createMany({\n`;
      output += `    data: [\n`;
      
      // Processar cada linha de dados
      for (const row of insert.values) {
        output += `      {\n`;
        
        // Mapear colunas para valores
        for (let i = 0; i < insert.columns.length; i++) {
          const column = toCamelCase(insert.columns[i]);
          const value = formatPrismaValue(row[i]);
          output += `        ${column}: ${value},\n`;
        }
        
        output += `      },\n`;
      }
      
      output += `    ],\n`;
      output += `    skipDuplicates: true,\n`;
      output += `  });\n`;
    } 
    // Se tivermos apenas um registro, usamos create
    else if (insert.values.length === 1) {
      output += `  await prisma.${modelName}.create({\n`;
      output += `    data: {\n`;
      
      // Mapear colunas para valores do único registro
      for (let i = 0; i < insert.columns.length; i++) {
        const column = toCamelCase(insert.columns[i]);
        const value = formatPrismaValue(insert.values[0][i]);
        output += `      ${column}: ${value},\n`;
      }
      
      output += `    },\n`;
      output += `  });\n`;
    }
  }

  // Finalização do arquivo com o padrão de gerenciamento de erro do Prisma
  output += `}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
`;

  return output;
}

/**
 * Formata um valor para o formato esperado pelo Prisma
 */
function formatPrismaValue(value: any): string {
  if (value === null) {
    return 'null';
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  } else if (typeof value === 'string') {
    // Verificar se parece uma data ISO ou timestamp
    if (/^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}:\d{2}/.test(value)) {
      return `new Date("${value}")`;
    }
    // Escapar aspas dentro da string
    return `"${value.replace(/"/g, '\\"')}"`;
  } else {
    return `"${value}"`;
  }
}

/**
 * Converte snake_case para camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converte nome de tabela SQL para nome de modelo Prisma
 * Ex: 'user_profiles' -> 'userProfile'
 */
function toPrismaModelName(tableName: string): string {
  // Remove plural se for o caso
  let singular = tableName;
  if (tableName.endsWith('s') && !tableName.endsWith('ss')) {
    singular = tableName.slice(0, -1);
  }
  
  // Converte para camelCase
  return toCamelCase(singular);
}