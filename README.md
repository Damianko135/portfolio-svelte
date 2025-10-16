# Portfolio Website

A modern, performant portfolio website built with SvelteKit 5, TypeScript, and Tailwind CSS v4. Deployed on Cloudflare Pages with integrated R2 storage for automated project screenshots.

## ✨ Features

- 🎨 **Modern UI** - Built with SvelteKit 5 and Tailwind CSS v4
- 🌓 **Dark Mode** - Theme switching with persistent preferences
- 📸 **Auto Screenshots** - Automated project screenshots using Cloudflare Browser Rendering API
- ⚡ **Edge Deployment** - Deployed on Cloudflare Pages for global performance
- 🔒 **UUID-based Security** - Secure project identification preventing enumeration
- 📱 **Responsive Design** - Mobile-first design with smooth animations
- 🎭 **Iconify Integration** - Access to 200,000+ icons via `@iconify/svelte`
- 🧪 **E2E Testing** - Playwright tests for quality assurance

## 🛠️ Tech Stack

- **Framework**: [SvelteKit 5](https://kit.svelte.dev/) with TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Skeleton UI](https://skeleton.dev/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/)
- **Browser Automation**: [Cloudflare Browser Rendering](https://developers.cloudflare.com/browser-rendering/)
- **Testing**: [Playwright](https://playwright.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Cloudflare account (for deployment)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Damianko135/portfolio-svelte.git
   cd portfolio-svelte
   ```

1. Install dependencies:

   ```bash
   pnpm install
   ```

1. Start the development server:

   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173`

## 📋 Managing Projects

### Adding a New Project

To add a new project to your portfolio, edit `src/lib/data/projects.json` and add a new entry:

```json
{
  "id": 4,
  "uuid": "d4e5f6a7-b8c9-0123-def4-567890123456",
  "name": "Your Project Name",
  "url": "https://your-project-url.com",
  "description": "A brief description of your project",
  "technologies": [
    { "name": "Technology Name", "icon": "simple-icons:iconname" }
  ]
}
```

### Generating UUIDs

Each project requires a unique UUID for screenshot identification. Here are several ways to generate one:

#### Option 1: Using Node.js (Recommended)

   ```bash
   node -e "console.log(require('crypto').randomUUID())"
   ```

#### Option 2: Using PowerShell (Windows)

   ```powershell
   [guid]::NewGuid().ToString()
   ```

#### Option 3: Using Online Tools

Visit [uuidgenerator.net](https://www.uuidgenerator.net/) or [uuid.rocks](https://uuid.rocks/)

#### Option 4: Using VS Code Extension

Install the "UUID Generator" extension and use `Ctrl+Shift+P` → "Insert UUID"

### Finding Icon Names

Icons are powered by [Iconify](https://icon-sets.iconify.design/). To find an icon:

1. Visit [Iconify Icon Sets](https://icon-sets.iconify.design/)
2. Search for your desired icon
3. Copy the icon name (e.g., `simple-icons:svelte`, `mdi:github`)
4. Use it in the `technologies` array

### Why UUIDs?

UUIDs are used instead of sequential IDs to:

- Ensure globally unique identifiers
- Prevent enumeration attacks on the screenshot API
- Allow flexible project management without ID conflicts
- Follow industry best practices for resource identification

## 🧰 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build locally with Wrangler
pnpm check        # Run TypeScript and Svelte checks
pnpm check:watch  # Run checks in watch mode
pnpm format       # Format code with Prettier
pnpm lint         # Lint code with Prettier
pnpm test         # Run Playwright E2E tests
pnpm test:e2e     # Run Playwright E2E tests
pnpm playwright   # Install Playwright browsers
```

### Project Structure

```text
portfolio-svelte/
├── src/
│   ├── lib/
│   │   ├── data/
│   │   │   └── projects.json      # Project data
│   │   ├── server/
│   │   │   └── screenshot.ts      # Screenshot generation logic
│   │   ├── Footer.svelte
│   │   ├── Header.svelte
│   │   ├── Icon.svelte
│   │   ├── ThemeToggle.svelte
│   │   └── types.ts               # TypeScript types
│   ├── routes/
│   │   ├── about/                 # About page
│   │   ├── contact/               # Contact page
│   │   ├── projects/              # Projects page
│   │   ├── api/screenshot/[slug]/ # Screenshot API endpoint
│   │   ├── +layout.svelte         # Root layout
│   │   └── +page.svelte           # Home page
│   ├── app.css                    # Global styles
│   └── app.html                   # HTML template
├── static/                        # Static assets
├── tests/                         # E2E tests
├── wrangler.jsonc                 # Cloudflare configuration
└── package.json
```

## 🌐 Deployment

### Cloudflare Pages Setup

1. **Install Wrangler CLI** (if not already installed):

   ```bash
   npm install -g wrangler
   ```

1. **Login to Cloudflare**:

   ```bash
   wrangler login
   ```

1. **Configure R2 Bucket** (for screenshots):

   - Create an R2 bucket named `screenshots` in your Cloudflare dashboard
   - Update `wrangler.jsonc` with your bucket name if different

1. **Configure Browser Rendering**:

   - Enable Browser Rendering in your Cloudflare account
   - Update the browser binding in `wrangler.jsonc` if needed

1. **Deploy**:

   ```bash
   pnpm deploy
   ```

This will:

- Run type checking
- Build the production bundle
- Deploy to Cloudflare Pages

### Environment Variables

The application uses Cloudflare bindings configured in `wrangler.jsonc`:

- `SCREENSHOTS` - R2 bucket for storing project screenshots
- `MYBROWSER` - Browser Rendering API binding

## 🎨 Customization

### Theme Colors

Edit the Tailwind configuration in your CSS or Tailwind config to customize the color scheme.

### Content

- **About Page**: Edit `src/routes/about/+page.svelte`
- **Contact Page**: Edit `src/routes/contact/+page.svelte`
- **Home Page**: Edit `src/routes/+page.svelte`
- **Projects**: Edit `src/lib/data/projects.json`

## 🧪 Testing

Run E2E tests with Playwright:

```bash
# Install browsers (first time only)
pnpm playwright

# Run tests
pnpm test
```

## 📝 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork it for your own use!

## 📧 Contact

For any inquiries, please visit the contact page on the live website.

---

Built with ❤️ using SvelteKit and Cloudflare
