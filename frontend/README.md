# Frontend (Recipes Grid)

This is a small Vite + React (TypeScript) frontend that displays recipes in a responsive MUI grid using React Query and axios.

Install dependencies:

```bash
cd frontend
npm install
```

Run dev server:

```bash
npm run dev
```

By default the API base URL is `http://localhost:8000/api`. To change, set `VITE_API_BASE_URL` in an `.env` file (e.g. `.env.local`) like:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

The recipes grid expects an endpoint that returns an array of recipes at `GET /recipes` (e.g. `http://localhost:8000/api/recipes`). Each recipe should have `id`, `title` / `name`, `description`, and optionally `image` or `image_url`.

Because this project uses TypeScript the `devDependencies` include `typescript` and type definitions for React. If you need a JavaScript version instead, tell me and I can convert it back.
