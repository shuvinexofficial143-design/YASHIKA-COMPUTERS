# Yashika AI — Groq + Supabase Setup

V7 keeps the Groq API key on the server inside a Supabase Edge Function.

## 1. Prerequisites

V6 Supabase setup should already be connected:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `supabase/schema.sql` already executed

## 2. Login and link Supabase CLI

From the project folder:

```powershell
npx.cmd supabase login
npx.cmd supabase link --project-ref YOUR_PROJECT_REF
```

## 3. Save Groq API key as a Supabase secret

```powershell
npx.cmd supabase secrets set GROQ_API_KEY="gsk_YOUR_REAL_KEY"
npx.cmd supabase secrets set GROQ_MODEL="openai/gpt-oss-20b"
```

Never put the Groq key in `VITE_*` variables or React source files.

## 4. Deploy the public shopping-assistant Edge Function

```powershell
npx.cmd supabase functions deploy yashika-ai --no-verify-jwt
```

The function is intentionally callable by storefront visitors. The Groq key remains server-side.

## 5. Start the website

```powershell
npm.cmd run build
npm.cmd run dev
```

## 6. Test

Open the website and click **Ask Yashika AI**.

Try:

- `₹30,000 में coding laptop बताओ`
- `Gaming के लिए कौन सा product बेहतर है?`
- Open any product → **Ask Yashika AI about this product**

## Security notes

- Never expose `GROQ_API_KEY` in browser code.
- Never expose the Supabase service-role key in browser code.
- The Edge Function reads the product catalog server-side.
- V7 includes a lightweight per-instance request limiter. Before high-traffic production launch, add a durable rate limiter / bot protection and spending limits.
