# COS30045 – T04-2: Manipulate and Add Elements with D3

Builds on the PowerWise website from T01 (Home, Televisions, About Us). In this exercise the Home page is reset to a simple `<h1>`, `<div>` and `<svg>`, and a separate JavaScript file uses D3 to style, add HTML and draw an SVG shape.

**Live demo:** _add the Vercel link for this repo here_

## Structure

```
index.html        – Home page: h1, div#content and svg for D3 to work with
televisions.html  – Televisions page (KNIME charts)
about.html        – About Us page
css/styles.css    – styling, colours taken from the power logo
js/script.js      – builds the shared nav menu and footer, highlights the current page, switches chart views
js/energy-d3.js   – D3 code for T04-2 (only D3 lives in this file)
images/PowerIcon.png
images/charts/    – KNIME charts answering the 7 TV questions
```

## T04-2: what the D3 code does

D3 v7 is loaded from `https://d3js.org/d3.v7.min.js`, then `js/energy-d3.js` runs. Both script tags sit just before `</body>`, so the elements already exist when D3 selects them.

| Code | Result on the page |
|------|--------------------|
| `d3.select("h1").style("color", "green")` | Selects the first `<h1>` and adds an inline style, so the heading turns green. |
| `d3.select("div").append("p").text("…")` | Selects the first `<div>` (`#content`), adds a new `<p>` inside it and sets its text. |
| `d3.select("svg").append("rect")` | Adds an empty `<rect>` to the SVG. It has no size or fill, so it is invisible but can be seen in DevTools. |
| `d3.select("svg").append("rect").attr(…).style("fill", "green")` | Adds a second `<rect>` at x=50, y=50, 100 wide and 30 high, filled green, so it shows up. |

Things I noticed:

- `d3.select()` only picks the first match. The old Home page cards used a `<div>`, so the page had to be reset to exactly one `<h1>`, one `<div>` and one `<svg>` for the paragraph to land in the right place. The nav built by `script.js` has no `<div>`, so `#content` is the first one.
- `.attr()` sets SVG attributes (`x`, `y`, `width`, `height`), while `.style()` sets CSS (`fill`, `color`).
- Each `.append()` adds a new element, so selecting the SVG twice and appending each time gives two `<rect>`s.

## Features (from T01)

- JavaScript navigation: `script.js` builds the menu from a list of pages, so every page shares the same menu and footer.
- Power logo in the top-left returns to the Home page.
- Hover feedback: tooltips on nav links, logo and chart tabs, plus colour change (orange background) and logo rotation.
- Current page: each page's `<body data-page="...">` tells the script which nav link gets the `active` class. The browser tab title also shows the page name.
- Colour palette matched to the logo: cream `#f9e5a7`, orange `#eca843`, brown `#7b6344`.
- Footer with year, author name and GenAI acknowledgement.
- Televisions page shows 7 KNIME charts. Q1 and Q7 have tabs to switch between two chart views (pie/bar and box plot/bar).

## Use of GenAI

<!-- Keep notes here as you work. Be specific: what you asked, what it produced, what you changed. -->

| Date          | Tool        | What I asked for                 | What I changed / checked       |
|---------------|-------------|----------------------------------|--------------------------------|
|27/10/2026     | Claude Code | - T04-2: reset the Home page body, link D3 and add `energy-d3.js` with the given code; explain each block | - checked the green heading, new paragraph and two `<rect>`s in the browser and DevTools |

### Reflection

<!-- Write a short reflection: how helpful was the tool, what did it get wrong, what did you learn? -->
I am able to understand the codes that I pasted with the help of GenAI. I prompted it to summarised what have been done and why included that line of codes. The explanation help me in a way that I can learn while did it.
In short of what done: the HTML provides the elements, the D3 library provides the tools, and JS file uses those tools on those elements, loaded in that order at the end of the page.