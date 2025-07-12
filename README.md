# whisprmail

A modern anonymous messaging platform built with Next.js 15, React 19, and Tailwind CSS.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Simple authentication system
- 📱 Mobile-first design
- ⚡ Fast performance with Next.js 15
- 🎯 Type-safe development
- 🔒 Secure anonymous messaging

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/whisprmail.git
cd whisprmail
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utility functions
│   ├── actions.js         # Server actions
│   ├── auth-context.js    # Authentication context
│   └── utils.js           # Utility functions
└── middleware.js          # Next.js middleware
```

## Authentication

The app uses a simple authentication system with the following features:

- User registration and login
- Session management with localStorage
- Protected routes with middleware
- Automatic redirects based on auth state

## Key Files

- `src/lib/auth-context.js` - Authentication context and state management
- `src/middleware.js` - Route protection and redirects
- `src/app/dashboard/page.js` - Main dashboard page
- `src/components/ProfileDropdown.js` - User profile dropdown

## Deployment

The app can be deployed to Vercel, Netlify, or any other Next.js-compatible hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
