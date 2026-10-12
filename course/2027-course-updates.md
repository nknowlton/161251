# 2027 course update: Stream materials and teaching schedule

**Status:** proposed for the 2027 offering; planning note only, not implemented in the 2026 Stream course.
**Owner:** course teaching team. **Recorded:** 12 October 2026.

## Decision and examples

Create a prominent **Course materials and schedule** page in Stream with a single, dated, link-rich table. This should be the main route to each week's learning activities, rather than requiring students to search through separate lecture, recording and lab folders.

Reference sites:
- [Wild Caught Data: full dated materials table](https://wcd.numbat.space/) (preferred model)
- [Introduction to Machine Learning: simpler weekly materials table](https://emitanaka.org/iml/materials.html)
- [Emi Tanaka's teaching pages](https://emitanaka.org/teaching/)

Borrow the **information architecture**, not another university's teaching content or timetable. Keep the design relatively restrained, readable on mobile, and consistent with the course site.

## Intended Stream layout for 161.251

Place this navigation page near the top of Stream, after the essential course information. Students should be able to see *when*, *what*, and *which link* in one view.

| Week / date | Lecture or topic | Lecture materials | Recording | Computer lab / workshop | Assessment / important dates |
| --- | --- | --- | --- | --- | --- |
| Week 9 (date TBC) | L25: The General Linear Model | Slides · Notes | Recording | Lab (where scheduled) | Relevant task / due date if applicable |
| Week 9 (date TBC) | L26: Comparison of General Linear Models | Slides · Notes | Recording |  |  |
| Week 9 (date TBC) | L27: Variable Selection | Slides · Notes | Recording |  |  |
| Week 11 (date TBC) | L31: Splines and LOESS | Slides · Notes | Recording | Lab (where scheduled) |  |
| Week 12 (date TBC) | L34–35: Autocorrelation / Autoregressive Errors | Slides · Notes | Recording | Lab (where scheduled) |  |

**The rows above illustrate the layout, not a complete or confirmed 2027 timetable.** Populate the final page with all teaching weeks, lecture numbers, actual 2027 dates, the current lab schedule, relevant assessments and links. Include a mid-semester break row where appropriate. Use the final 2027 course timetable and assessment release dates, not copied dates from reference sites.

Suggested final columns: **Week / date | Lecture / topic | Slides / notes | Recording | Lab / workshop | Assessment / deadline**. If the table is too wide on mobile, put date/week and topic first and consolidate resource links within one "Materials" cell. A descriptive link (for example, "L31 slides") is better than an unlabelled icon or "click here".

The repository already has authoritative lecture titles, numbering, week and presenter in `course/lectures.csv`. Preserve that source of truth. It also has lecture content, browser slides for Nick's lectures, a Bookdown site and `labs/`; use the **published HTML destinations** rather than source `.Rmd` files. Respect the co-taught structure: Jonathan Godfrey's Weeks 1–8 and Nick Knowlton's Weeks 9–12; the index must cover the whole course rather than only Nick's portion.

Lecture 32/33 currently shares material, so link to the actual delivered item instead of inventing a separate resource. Show lab solutions only when intended for students, after their release.

## Implementation for 2027

1. Obtain confirmed 2027 teaching dates, weekly lab mappings, assessment deadlines and the final lecture sequence.
2. Create one accessible, mobile-readable **Stream Page** containing the schedule; put it at the top of the course navigation and link to it from the Stream home page.
3. Include direct links to published lecture HTML/slides/notes, the correct Stream recordings, labs and submission/quiz activities. Keep authenticated content and permissions inside Stream. **Do not publish student-specific or restricted recording/assessment URLs in this public GitHub repository.**
4. Prefer one schedule data source (for instance a small internal CSV/YAML table keyed by lecture number / week, augmented with dates and resource links) over repeated manual lists. It can supply a generated public materials index, but Stream-only links and release rules should remain in Stream. Avoid redesigning the existing Bookdown or lecture render pipeline just to build the index.
5. For unreleased or unavailable material, display a clear label (e.g. "Available after the lecture") or hide the link until release. Do not leave dead links or empty download buttons.
6. Before 2027 launch, check all rows and links, mobile/keyboard usability, recording access, workshop solution visibility, and assessment due dates with a student-view account.

## Acceptance criteria

A student should be able to open Stream, find a dated row for the current week, and reach its **lecture, recording, lab and assessment** (if relevant) directly. No need to hunt through separate folders. One underlying lecture/resource should have one maintained destination.

**Scope boundary:** This note requests a navigation/course-delivery improvement for 2027. Do not change the 2026 lecture materials, publishing workflow, grade structure or active Stream site as part of this note.
