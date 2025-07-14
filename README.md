# Valid Names

A modern domain availability checking application built with Next.js 15, TypeScript, and Tailwind CSS. Check domain availability across multiple TLDs with batch processing, background jobs, and comprehensive user authentication.

## 🚀 Features

### Core Functionality

- **Domain Availability Checking**: Check domain availability across hundreds of TLDs
- **Batch Processing**: Check multiple domains against multiple TLDs simultaneously
- **Background Jobs**: Long-running domain checks with real-time progress tracking
- **Smart Organization**: Organize domains into applications and categories
- **Bulk Upload**: Import domains via JSON files with AI-powered suggestions

### Authentication & Security

- **JWT-based Authentication**: Secure session management with httpOnly cookies
- **Email Verification**: Complete email verification flow with professional templates
- **Password Reset**: Secure password reset functionality via email
- **Rate Limiting**: Protection against abuse with email and API rate limiting
- **Bot Protection**: Cloudflare Turnstile integration for login and registration

### User Experience

- **Modern UI**: Clean, responsive interface using custom primitives
- **Real-time Results**: Get instant feedback on domain availability
- **Progress Tracking**: Monitor background job progress and results
- **Refresh Functionality**: Update checks at category or individual domain level
- **AI Integration**: Generate intelligent prompts for domain research

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based session management
- **Email Service**: Resend with React Email templates
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Icons**: Heroicons
- **Deployment**: Vercel-ready
- **Domain Checking**: WHOIS integration via whoiser
- **Security**: Cloudflare Turnstile, bcrypt password hashing

## 📊 Database Schema

### Core Models

- **User**: User accounts with authentication and email verification
- **Application**: Top-level container for organizing domains
- **Category**: Groups of domains within applications
- **Domain**: Individual domains to be checked
- **TLD**: Top-level domains for checking (.com, .org, etc.)
- **Check**: Domain availability check results with batch support

### Authentication Models

- **EmailVerificationToken**: Tokens for email verification
- **PasswordResetToken**: Tokens for password reset
- **EmailRateLimit**: Rate limiting for email operations
- **UserSettings**: User preferences and TLD selections

### Job Management

- **BackgroundJob**: Long-running job tracking with progress monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Resend account and API key
- Cloudflare Turnstile account and keys
- npm or yarn

### Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd validnames
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

```bash
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL (PostgreSQL connection string)
# - RESEND_API_KEY (from Resend dashboard)
# - RESEND_FROM_EMAIL (verified domain email)
# - NEXT_PUBLIC_APP_URL (your app URL)
# - TURNSTILE_SECRET_KEY (from Cloudflare)
# - NEXT_PUBLIC_TURNSTILE_SITE_KEY (from Cloudflare)
# - JWT_SECRET (random string for JWT signing)
```

4. **Initialize the database**:

```bash
npx prisma migrate dev
```

5. **Seed the database with TLDs and sample data**:

```bash
npm run db:seed
```

6. **Start the development server**:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📖 Usage

### Authentication

- **Test User**: `test@example.com` / `password123`
- **Registration**: `/register` - Email verification required
- **Login**: `/login` - JWT-based authentication
- **Password Reset**: `/forgot-password` - Email-based reset flow
- **Email Verification**: `/verify-email` - Verify email address

### Domain Management Workflow

1. **Create Application**: Start by creating an application to organize your domains
2. **Add Categories**: Create categories within applications to group related domains
3. **Add Domains**: Add individual domains to categories or upload via JSON
4. **Select TLDs**: Choose which top-level domains to check against
5. **Batch Check**: Check multiple domains against multiple TLDs simultaneously
6. **Monitor Progress**: Track background job progress and results
7. **Review Results**: View availability status with color-coded indicators

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

### Email Flows

1. **Registration**: User registers → verification email sent → user clicks link → account activated
2. **Password Reset**: User requests reset → reset email sent → user clicks link → new password set
3. **Email Verification**: Unverified users can request new verification emails

## 🔧 Development

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

### Code Quality Standards

- **File Size Limit**: Maximum 150 lines per file
- **TypeScript**: Strict type safety throughout
- **Styling**: Tailwind CSS with consistent design system
- **Code Organization**: Purpose-specific directories (operations/, formatters/, validators/, generators/, parsers/)
- **Naming Convention**: Descriptive names only - NO generic terms like "utils", "helpers", "services"

### Building for Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🏗 Architecture

### Authentication Flow

1. User registers/logs in via API routes
2. Email verification sent for new registrations
3. JWT token stored in httpOnly cookie after verification
4. Middleware validates session on protected routes
5. API routes verify user authentication

### Email Flow

1. User action triggers email (registration, password reset)
2. Token generated and stored in database
3. Email sent via Resend with React Email template
4. User clicks link in email
5. Token validated and action completed
6. Token deleted from database

### Domain Checking Process

1. User selects domains and TLDs
2. Background job processes requests asynchronously
3. Progress tracked via BackgroundJob model
4. Results stored in database with timestamps
5. UI displays availability status with color coding

### Data Flow

```
User → Application → Category → Domain → Check Results
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt
- **Session Management**: JWT-based with httpOnly cookies
- **Input Validation**: Comprehensive Zod schemas for all inputs
- **User Data Isolation**: All data scoped to authenticated users
- **Rate Limiting**: Email and API rate limiting to prevent abuse
- **Token Security**: Cryptographically secure tokens with expiration
- **CSRF Protection**: Built-in protection for sensitive operations
- **Bot Protection**: Cloudflare Turnstile integration
- **Email Security**: Rate limiting and validation for email operations

## 📧 Email Integration

### Prerequisites

- Resend account with API key
- Verified domain in Resend
- Next.js 15+ application

### Environment Variables

```env
# Required for email functionality
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Email Templates

- **Verification**: Sent when user registers
- **Password Reset**: Sent when user requests password reset
- **Welcome**: Sent after email verification

### Rate Limiting

- Email verification: 5 attempts per hour
- Password reset: 3 attempts per hour
- Automatic cleanup of expired tokens

## 🚀 Deployment

### Vercel Deployment

The application is configured for Vercel deployment with:

- Automatic Prisma client generation
- Database migrations on build
- Environment variable configuration
- Optimized build process

### Environment Setup

Ensure all required environment variables are configured in your deployment platform:

- `DATABASE_URL`: PostgreSQL connection string
- `RESEND_API_KEY`: Resend email service API key
- `RESEND_FROM_EMAIL`: Verified sender email address
- `NEXT_PUBLIC_APP_URL`: Your application URL
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key
- `JWT_SECRET`: Random string for JWT signing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the code quality standards (150 lines max per file, descriptive naming)
4. Test your changes thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:

- Check the documentation above
- Review the codebase structure
- Ensure all environment variables are properly configured
- Verify database migrations are up to date
