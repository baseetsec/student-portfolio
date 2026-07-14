# Saheed Baseet Boluwatife - Personal Portfolio

**Live site:** https://baseetsec.vercel.app/
**Course:** COS 106 - Introduction to Web Technologies, MIVA Open University
**Author:** Saheed Baseet Boluwatife ([@baseetsec](https://github.com/baseetsec))

A multi-page personal academic portfolio and student management platform, built with
plain HTML, CSS, and JavaScript. No frameworks, no build tools.

## Pages

| Page | Description |
|---|---|
| `index.html` | Homepage: hero intro, current focus areas, services, featured projects |
| `about.html` | Educational background, career goals, technical skills, hobbies |
| `projects.html` | Filterable gallery of 3 simulated security projects |
| `planner.html` | Interactive academic task planner (add / complete / delete tasks) |
| `contact.html` | Contact form with live JavaScript validation |
| `entropy-analyzer.html` | Live working demo: password entropy and breach-pattern analyzer |
| `owasp-scanner.html` | Live working demo: simulated OWASP Top 10 scanner dashboard |
| `404.html` | Custom not-found page |

## Features

- Fully responsive layout (Flexbox + CSS Grid)
- Dark, SOC-dashboard-inspired design system with a single cyan accent color
- Typing-effect hero tagline, scroll-triggered section reveals (Intersection Observer)
- Fully working task planner with add/complete/delete, progress bar, and `localStorage` persistence
- Contact form validation: required fields, email format check, digits-only phone check
- Two real, working interactive tools, not mockups:
  - **Password Entropy Analyzer**: calculates real entropy and flags weak patterns live as you type
  - **OWASP Scanner Dashboard**: simulated vulnerability scan mapped to real OWASP Top 10 categories
- Background ambient audio with a mute/unmute toggle (never autoplays)
- Custom favicon and Open Graph tags for link previews

## Technologies used

- HTML5 (semantic elements, forms, tables, `<audio>`)
- CSS3 (custom properties, Grid, Flexbox, animations/transitions)
- Vanilla JavaScript (DOM manipulation, event handling, `localStorage`, Intersection Observer)
- Deployed on [Vercel](https://vercel.com), version-controlled with Git/GitHub

## Running locally

```bash
git clone https://github.com/baseetsec/student-portfolio.git
cd student-portfolio
```

Then open `index.html` directly in a browser, or serve it with VS Code's Live Server
extension for the best experience (auto-reload on save).

## Notes

- The OWASP Scanner and Password Entropy tools are honest simulations. No real
  network requests are made to any URL entered. This is disclosed directly on each
  tool's page.
- No certifications are listed, as none have been completed yet.