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
js/t04-4-load.js      – T04-4: load the CSV, convert types, console checks, then call createBarChart(data)
js/t04-5-bars.js      – T04-5/T04-6: createBarChart(data) binds each row to a <rect>; T04-6 adds x/y scales
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
- `createBarChart()` was only a stub in T04-4 (it logged "createBarChart received 10 rows"). In T04-5 the stub was removed and the real function now lives in `t04-5-bars.js`.

## T04-5: bind data and draw bars

`index.html` loads `t04-4-load.js` and then `t04-5-bars.js`. This order works even though the loader calls `createBarChart()`: `d3.csv()` takes a moment to fetch the file, and by the time `.then()` runs, `t04-5-bars.js` has already defined the function.

`createBarChart(data)` in `t04-5-bars.js`:

| Code | What it does |
|------|--------------|
| `d3.select(".responsive-svg-container").append("svg")` | Adds a new SVG canvas, `viewBox="0 0 1200 400"`, with a temporary black border. |
| `.selectAll("rect").data(data).join("rect")` | The data join. `selectAll` finds no `<rect>`s yet, `.data(data)` pairs the 10 rows with them, and `.join("rect")` creates one `<rect>` for each row. |
| `` .attr("class", d => `bar bar-${d.count}`) `` | Gives each bar a class from its own data, e.g. `bar bar-809`, which makes it easy to spot in DevTools. |
| `.attr("width", d => d.count)` | Bar length = number of models, so KOGAN's bar is 809 units wide. |
| `.attr("height", 16)` | Every bar is the same thickness. |

Result: 10 `<rect>`s in the DOM, but they are all drawn at x=0, y=0 on top of each other, so only the longest (KOGAN, 809) can be seen. This is the expected end point for T04-5.

Things I noticed:

- `d => …` is a function D3 calls once per bar, passing in that bar's row. That is how each `<rect>` gets a different width from the same line of code.
- Using `count` directly as the width only works because 809 happens to fit inside the 1200-wide viewBox. A brand with more than 1200 models would run off the edge. T04-6 fixes this with a scale.
- To space the bars out, each bar needs a `y` based on its position in the data (its index `i`), e.g. `y = i * (barHeight + gap)`. This is done in T04-6.

## T04-6: scaling charts

T04-6 edits `createBarChart` in `t04-5-bars.js` (no new file). Scales map **data values (domain)** to **positions on the canvas (range)**, so the bars always fit no matter how big the numbers are.

| Setting | Value | Meaning |
|---------|-------|---------|
| `viewBox` | `0 0 500 1600` | The drawing's own coordinate system: 500 units wide, 1600 tall |
| `width` / `height` | 640 × 420 | How big the SVG box is on the page |
| `xScale` | `scaleLinear`, domain `[0, 809]` → range `[0, 500]` | Turns a model count into a bar length. The biggest brand (KOGAN, 809) gets the full 500. |
| `yScale` | `scaleBand`, domain = the 10 brand names → range `[0, 1600]` | Splits the height into 10 equal slots, one per brand, and gives each bar its `y` |
| `paddingInner(0.2)` / `paddingOuter(0.1)` | | Gap between bars (20% of a slot) and a small gap above the first and below the last bar |
| `yScale.bandwidth()` | 128 | The bar thickness left after the padding |

Checked in DevTools: each slot is 1600 ÷ 10 = 160 units, the bars are 128 thick, and they start at y = 16, 176, 336 … (160 apart). LG's width is 723 ÷ 809 × 500 ≈ 446.8.

Things I noticed:

- `scaleLinear` is for numbers (a continuous range), while `scaleBand` is for categories (a fixed list of names, each getting its own band).
- `data.map(d => d.brand)` builds the list of brand names for the band scale. The bars stay in the sorted order from T04-4, largest first.
- The chart is drawn in the **middle of the box with empty space either side**. The viewBox is tall and narrow (500 × 1600, about 1 : 3.2) but the box is wide (640 × 420, about 1.5 : 1). The browser keeps the drawing's proportions, so it shrinks the whole drawing until the 1600 height fits into 420 and centres it. Making the two shapes match (e.g. a viewBox of `0 0 640 420`) would let the chart fill the box.

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
|27/10/2026     | Claude Code | - T04-5: remove the stub, add `t04-5-bars.js` to bind the data to `<rect>`s; explain the data join | - checked DevTools shows 10 `<rect>`s with classes like `bar bar-809` and the right widths |
|27/10/2026     | Claude Code | - T04-6: add the viewBox/display size and the x (linear) and y (band) scales; explain why the chart sits in the middle of the box | - checked the bar positions and widths in DevTools against the scale maths |

### Reflection

<!-- Write a short reflection: how helpful was the tool, what did it get wrong, what did you learn? -->
I am able to understand the codes that I pasted with the help of GenAI. I prompted it to summarised what have been done and why included that line of codes. The explanation help me in a way that I can learn while did it.
In short of what done on T04-2: the HTML provides the elements, the D3 library provides the tools, and JS file uses those tools on those elements, loaded in that order at the end of the page.