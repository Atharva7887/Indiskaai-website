# IndiskaAI website

The IndiskaAI marketing site is built with Next.js, Tailwind CSS, and Sanity.

## Local development

```bash
npm install
npm run dev
```

Run the production checks with:

```bash
npm run typecheck
npm run build
```

## Environment

Copy the existing Sanity configuration into `.env.local` for local content access:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

The partnership form sends through [Resend](https://resend.com). Configure these server-only variables in your deployment environment before publishing the form:

```dotenv
RESEND_API_KEY=re_xxx
CONTACT_FROM_EMAIL=IndiskaAI <hello@your-verified-domain.com>
CONTACT_TO_EMAIL=partner@indiskaai.com
```

`CONTACT_FROM_EMAIL` must use a domain verified in Resend. If the variables are absent, the form clearly reports that delivery is unavailable and offers the direct email route; it never reports a false success.
