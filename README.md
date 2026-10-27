# COS30045 – T04: D3 Bar Chart (T04-2 to T04-7)

Builds on the PowerWise website from T01 (Home, Televisions, About Us). Over exercises T04-2 to T04-7 the Home page is turned into a D3 bar chart of TV energy data, one step at a time. Each exercise has its own JavaScript file in `js/`, and earlier ones are commented out in `index.html` so only the current step runs.

Run it with VS Code **Live Server** (Go Live). `d3.csv()` cannot load the CSV when `index.html` is opened by double-clicking.

**Live demo:** _add the Vercel link for this repo here_

## Structure

```
index.html            – Home page: h1, div#content, svg (T04-2) and .responsive-svg-container (T04-3+)
televisions.html      – Televisions page (KNIME charts)
about.html            – About Us page
css/styles.css        – styling, colours taken from the power logo; .responsive-svg-container
js/script.js          – builds the shared nav menu and footer, highlights the current page, switches chart views
js/energy-d3.js       – T04-2: style h1, append paragraph, add SVG rects (now disabled)
js/t04-3-bars.js      – T04-3: responsive SVG with a test rect (now disabled)
js/t04-4-load.js      – T04-4: load the CSV, convert types, console checks
data/tvBrandCount.csv – number of TV models for the top 10 brands, exported from my KNIME workspace
images/PowerIcon.png
images/charts/        – KNIME charts answering the 7 TV questions
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

## T04-3: responsive SVG container

- `index.html` has a new `<div class="responsive-svg-container">` below the T04-2 elements. `t04-3-bars.js` replaces `energy-d3.js`, which is commented out.
- `css/styles.css` gives the container `width: 100%`, `max-width: 1200px` and `margin: 0 auto`, so it fills the page and stays centred.
- `t04-3-bars.js` appends an `<svg>` with `viewBox="0 0 1200 1600"` and a thin blue test `<rect>` (x=10, y=10, 414 × 16).

Things I noticed:

- The SVG has a `viewBox` but no fixed `width`/`height`. The drawing is always 1200 × 1600 units, and the browser scales those units to whatever width the container has. Resizing the window shrinks the canvas, but the bar stays about a third of the canvas width.
- The heading is no longer green, because the T04-2 script that styled it is switched off.
- The empty gap above the canvas is the old T04-2 `<svg width="300" height="150">`, which now has nothing drawn in it.

## T04-4: load data from CSV

### About the data

`data/tvBrandCount.csv` is **my own export from my KNIME workspace**, not the `tvBrandCount.csv` provided with the exercise. It comes from the same Energy Rating TV dataset used for my Televisions page (DCCEEW, data.gov.au, CC BY 3.0 AU, downloaded 6 Sept 2026), grouped by brand and counting models, keeping the top 10 brands:

| Column | Meaning | Type in the file |
|--------|---------|------------------|
| `Brand_Reg` | Registered brand name | text |
| `Count(Model_No)` | Number of TV models registered under that brand | number, but read as text by `d3.csv()` |

The top 10 brands range from 101 models (EKO) to 809 (KOGAN). SAMSUNG and SAMSUNG ELECTRONICS appear as separate rows because they are registered under different brand names in the dataset; I kept them as KNIME exported them.

### What the code does

- `d3.csv("data/tvBrandCount.csv", row => …)` loads the file. The path is relative to `index.html`.
- The row function renames the columns to `brand` and `count` and converts `count` to a number with `+`. My headers differ from the exercise's `brand`/`count`, so the code reads `d.Brand_Reg` and `d["Count(Model_No)"]`. Brackets are needed for the second one because of the `(` `)` in the name.
- `.then(data => …)` runs once the whole file has loaded. It logs the array, `rows: 10`, `max: 809`, `min: 101` and `extent: [101, 809]`, sorts the rows by count (largest first), and passes them to `createBarChart(data)`.
- `createBarChart()` is only a stub for now (it logs "createBarChart received 10 rows"); it draws the bars in T04-5.

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
|27/10/2026     | Claude Code | - T04-3: add the responsive container, CSS class and `t04-3-bars.js`; explain `viewBox` | - checked the canvas and blue bar scale when the window is resized |
|27/10/2026     | Claude Code | - T04-4: load my own KNIME CSV, match the code to my column names, add console checks | - checked the console shows 10 rows, max 809, min 101 and the stub message |

### Reflection

<!-- Write a short reflection: how helpful was the tool, what did it get wrong, what did you learn? -->
I am able to understand the codes that I pasted with the help of GenAI. I prompted it to summarised what have been done and why included that line of codes. The explanation help me in a way that I can learn while did it.
In short of what done on T04-2: the HTML provides the elements, the D3 library provides the tools, and JS file uses those tools on those elements, loaded in that order at the end of the page.