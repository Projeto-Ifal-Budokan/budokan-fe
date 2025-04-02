# Budokan Frontend

A modern web application built with Next.js and TypeScript, featuring a beautiful UI with Tailwind CSS and shadcn/ui components.

## 🚀 Technologies

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui with class-variance-authority
- **Icons:** Lucide React
- **Development Tools:**
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript for type safety
  - Turbopack for faster development

## 📁 Project Structure

```
budokan-fe/
├── src/
│   ├── app/           # Next.js app directory (pages and layouts)
│   └── lib/           # Utility functions and shared code
├── public/            # Static assets
├── .next/            # Next.js build output
└── [Configuration Files]
    ├── package.json   # Project dependencies and scripts
    ├── tsconfig.json  # TypeScript configuration
    ├── next.config.ts # Next.js configuration
    ├── tailwind.config.js # Tailwind CSS configuration
    └── .prettierrc    # Prettier configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd budokan-fe
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code linting

## 🎨 UI Components

The project uses shadcn/ui, a collection of re-usable components built with:

- Radix UI primitives for accessibility
- Tailwind CSS for styling
- class-variance-authority for component variants
- Lucide React for icons

These components are highly customizable and follow best practices for accessibility and design.

## 🔧 Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write clean, maintainable code
- Follow the established project structure

## 📝 License

[Your License Here]

## 👥 Contributing

[Your Contributing Guidelines Here]
