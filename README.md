# Student Nurse Placement Hours App (Demo)

This repository now contains a working front-end prototype you can open in a browser.

## What you can see

The demo includes the 3 roles you asked for:

1. **Student**
   - Add placement-hour logs.
   - Track progress against **288 required hours**.
   - See recorded, verified, and remaining hours.
2. **Placement assessor**
   - Search by matriculation number.
   - Approve or reject pending logs.
3. **College lecturer**
   - View all students with recorded/verified/remaining totals.

It also includes UI placeholders for **Google sign-in**, **Apple sign-in**, and a note about **Face ID/passkey compatibility** on supported devices.

## Run locally

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

## Files

- `index.html` — app layout and role-based sections.
- `styles.css` — visual styling.
- `app.js` — in-browser data model and app logic.

## Notes

- This is a front-end prototype (no real backend/auth yet).
- Data is in-memory and resets on refresh.
- Next step would be wiring this UI to a real API and OAuth providers.
