# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/04867c77-28ed-4e77-aa37-94e24e04c6e1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/04867c77-28ed-4e77-aa37-94e24e04c6e1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend
- FastAPI (Python)
- Groq AI (for fact-checking and explanations)
- DuckDuckGo Search (for evidence gathering)
- NewsData API (for news scanning)

## How can I deploy this project?

### Quick Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard:
   - `GROQ_API_KEY` (Required)
   - `NEWSDATA_API_KEY` (Optional)
4. Redeploy: `vercel --prod`

For detailed deployment instructions, troubleshooting, and production setup, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Local Development

**Run frontend and backend together:**
```bash
npm install
npm run dev:all
```

**Or run separately:**
```bash
# Frontend
npm run dev

# Backend (in another terminal)
npm run backend
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
