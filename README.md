# Valid Names

A modern domain availability checking application built with Next.js 15, TypeScript, and Tailwind CSS. Check domain availability across multiple TLDs with batch processing, background jobs, and user authentication.

## Features

- **User Authentication**: JWT-based auth with httpOnly cookies
- **Domain Management**: Organize domains into applications and categories
- **Batch Checking**: Check multiple domains against multiple TLDs simultaneously
- **Background Processing**: Long-running domain checks with progress tracking
- **Upload Functionality**: Bulk import domains via JSON files
- **Real-time Results**: Get instant feedback on domain availability
- **Refresh Functionality**: Update checks at category or individual domain level
- **Modern UI**: Clean, responsive interface using custom primitives

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based session management
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Icons**: Heroicons
- **Deployment**: Vercel-ready

## Database Schema

- **User**: User accounts with authentication
- **Application**: Top-level container for organizing domains
- **Category**: Groups of domains within applications
- **Domain**: Individual domains to be checked
- **TLD**: Top-level domains for checking (.com, .org, etc.)
- **Check**: Domain availability check results with batch support
- **BackgroundJob**: Long-running job tracking
- **UserSettings**: User preferences and TLD selections

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd validnames
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your PostgreSQL DATABASE_URL
```

4. Initialize the database:

```bash
npx prisma migrate dev
```

5. Seed the database with TLDs and sample data:

```bash
npm run db:seed
```

6. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

### Authentication

- Test user: `test@example.com` / `password123`
- Register new accounts at `/register`
- Login at `/login`

### Domain Management

1. **Create Application**: Start by creating an application to organize your domains
2. **Add Categories**: Create categories within applications to group related domains
3. **Add Domains**: Add individual domains to categories or upload via JSON
4. **Select TLDs**: Choose which top-level domains to check against
5. **Batch Check**: Check multiple domains against multiple TLDs simultaneously
6. **Monitor Progress**: Track background job progress and results

### Upload Format

Upload JSON files with the following structure:

```json
{
  "categories": [
    {
      "name": "Category Name",
      "description": "Optional description",
      "domains": ["domain1", "domain2", "domain3"]
    }
  ]
}
```

## Development

### Database Management

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset

# Seed database
npm run db:seed
```

### Code Quality

- Maximum 150 lines per file
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint and Prettier for code formatting

### Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Architecture

### Authentication Flow

1. User registers/logs in via API routes
2. JWT token stored in httpOnly cookie
3. Middleware validates session on protected routes
4. API routes verify user authentication

### Domain Checking

1. User selects domains and TLDs
2. Background job processes requests asynchronously
3. Progress tracked via BackgroundJob model
4. Results stored in database with timestamps
5. UI displays availability status with color coding

### Data Flow

```
User → Application → Category → Domain → Check Results
```

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- HTTP-only cookies
- Input validation with Zod schemas
- User data isolation

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
