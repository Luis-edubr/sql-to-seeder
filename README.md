# SQL to Seeder Converter

A command-line utility to convert SQL files (containing INSERT statements) into seeders for different frameworks. Currently supports:

- Laravel (PHP)
- Prisma (TypeScript/JavaScript)
- Django (Python) - *in development*

## Installation

### Global Installation

```bash
# Install globally via npm
npm install -g sql-to-seeder

# Verify installation
sql-to-seeder --version
```

**INSTALATION VIA NPM NOT AVAILABLE YET**

### Local Project Installation

```bash
# Install as a development dependency
npm install --save-dev sql-to-seeder
```

### Development Setup

To contribute or modify the project:

```bash
# Clone the repository
git clone https://github.com/yourusername/sql-to-seeder.git
cd sql-to-seeder

# Install dependencies
npm install

# Compile the project
npm run build

# Execute in development mode
npm run dev -- example.sql
```

## Usage

### CLI

```bash
# Basic syntax
sql-to-seeder <sql-file> [options]

# Options
# -f, --framework   Target framework (laravel, prisma, django)
# -c, --class-name  Define the seeder class name
# -o, --output      Define the output file path
```

### Examples

```bash
# Convert to Laravel (default)
sql-to-seeder data.sql

# Convert to Prisma
sql-to-seeder data.sql -f prisma -o seed.ts

# Specify custom class name
sql-to-seeder users.sql -c UsersSeeder -o database/seeders/UsersSeeder.php
```

## Input and Output

### SQL Input File (example)

```sql
INSERT INTO users (id, name, email, created_at) VALUES 
(1, 'John Doe', 'john@example.com', '2023-01-01 10:00:00'),
(2, 'Jane Smith', 'jane@example.com', '2023-01-02 11:30:00');

INSERT INTO posts (id, user_id, title, content) VALUES 
(1, 1, 'First Post', 'This is content'),
(2, 2, 'Hello World', 'Hello from Jane');
```

### Laravel Output

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed users table
        $data = [
            [
                'id' => 1,
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'created_at' => '2023-01-01 10:00:00',
            ],
            // ... other records
        ];
        
        DB::table('users')->insert($data);

        // ... other tables
    }
}
```

### Prisma Output

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed data for users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date("2023-01-01 10:00:00"),
      },
      // ... other records
    ],
    skipDuplicates: true,
  });

  // ... other tables
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

## Supported Frameworks

| Framework | Status | File Extension | Command |
|-----------|--------|----------------|---------|
| Laravel   | ✅ Complete | .php | `-f laravel` |
| Prisma    | ✅ Complete | .ts or .js | `-f prisma` |
| Django    | 🚧 In Development | .py | `-f django` |

## Features

- Support for multiple INSERT statements
- Automatic data type detection (numbers, strings, NULL)
- Framework-specific formatting
- Automatic file naming based on input file
- snake_case to camelCase conversion when necessary (Prisma)

## Development

```bash
# Run in development mode
npm run dev -- file.sql

# Build
npm run build

# Run tests
npm test
```

## License

ISC

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request
