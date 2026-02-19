# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Supabase Configuration

### Generate TypeScript Types

To generate the `app/types/supabase.ts` file with your database types, you need to have the Supabase CLI installed:

```bash
# Install Supabase CLI
npm install -g supabase

# Generate types from your Supabase project
supabase gen types typescript --project-id YOUR_PROJECT_ID > app/types/supabase.ts
```

Alternatively, you can use the Supabase CLI with your project URL:

```bash
supabase gen types typescript --db-url YOUR_DATABASE_URL > app/types/supabase.ts
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
