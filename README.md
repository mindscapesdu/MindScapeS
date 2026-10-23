# MindScapeS Frontier Talk Series 2026

An academic lecture and colloquium series examining foundational questions at the intersection of philosophy of mind, perception, language, cognitive science, and Indian epistemology.

- **Website:** Live on GitHub Pages / Department Hosting
- **Mailing List:** [MindScapeS Google Group](https://groups.google.com/g/mindscapesdu/)
- **Contact:** [mindscapesdu@gmail.com](mailto:mindscapesdu@gmail.com)

---

## Programme Overview (Autumn 2026)

All sessions are conducted virtually. Times are in Indian Standard Time (IST, UTC+5:30).

| Date | Speaker | Affiliation | Format |
| :--- | :--- | :--- | :--- |
| **Thu, Oct 30** &bull; 6:30 PM IST | **Prof. Melissa Kibbe** | Boston University | Talk &bull; Student Q&A &bull; Commentator: Prof. Sami Yousif &bull; Open Q&A |
| **Fri, Nov 6** &bull; 8:00 AM IST | **Prof. Susanna Schellenberg** | Rutgers University | Talk &bull; Student Q&A &bull; Commentator: Prof. Tarun &bull; Open Q&A |
| **Fri, Nov 13** &bull; 7:30 PM IST | **Prof. Edward Gibson** | MIT | Talk &bull; Student Q&A &bull; Commentator: Ms. Gowri &bull; Open Q&A |
| **Fri, Nov 20 & Sat, Nov 21** &bull; 8:00 AM IST | **Prof. Sandeep Prasada** | Hunter College, CUNY | Two-part colloquium &bull; Commentator: Prof. Melissa Kibbe &bull; Open Q&A |
| **Fri, Nov 27** &bull; 6:30 PM IST | **Prof. V. N. Jha** | Univ. of Pune / CVV | Talk &bull; Student Q&A &bull; Commentator: Yinzhu Yang &bull; Open Q&A |
| **Fri, Dec 4 & Sat, Dec 5** &bull; 8:00 AM IST | **Prof. Liz Spelke** | Harvard University | Two-day morning lecture series &bull; Commentators: Prof. Moira Dillon & Prof. Sandeep Prasada |
| **Fri, Dec 4** &bull; 6:30 PM IST | **Prof. Sami Yousif** | Univ. of Pennsylvania | Evening session &bull; Open Q&A |
| **Fri, Dec 11** &bull; 6:30 PM IST | **Prof. Moira Dillon** | New York University | Talk &bull; Student Q&A &bull; Open Q&A |

---

## Project Structure

```text
MindScapeS/
├── index.html            # Home page (Next Talk card, seminar format, upcoming talks)
├── schedule.html         # Full 2026 programme table with column colors & popup modals
├── speakers.html         # Speaker directory (3-column grid) & commentators list
├── register.html         # Registration info & editable submission form
├── archive.html          # Past talk summaries & video recordings
├── reading-list.html     # Suggested pre-circulated papers & citations
├── about.html            # Ethical aims & Student-First Q&A rationale
├── contact.html          # Inquiries & committee roster
│
├── style.css             # Vanilla CSS stylesheet (180 lines, fully responsive)
├── menu.js               # Mobile navigation, abstract modal & registration sync
├── server.py             # Optional local Python server with CSV & Google Forms sync
│
├── abstracts/            # Plain text (.txt) abstracts for each talk
│   ├── 2026-10-30-kibbe.txt
│   ├── 2026-11-06-schellenberg.txt
│   ├── 2026-11-13-gibson.txt
│   ├── 2026-11-20-prasada.txt
│   ├── 2026-11-27-jha.txt
│   ├── 2026-12-04-morning-spelke.txt
│   ├── 2026-12-04-evening-yousif.txt
│   ├── 2026-12-11-dillon.txt
│   └── template-abstract.txt
│
├── CSV/
│   └── registrations.csv # Local CSV registration records
│
└── images/               # Portraits, seminar photographs, and text-based favicon
```

---

## Deploying to GitHub Pages (Free)

1. Push this repository to GitHub (`main` branch).
2. Go to **Settings** &rarr; **Pages** in your GitHub repository.
3. Under **Branch**, select `main` and root folder `/`, then click **Save**.
4. Your website will be live in ~60 seconds at: `https://mindscapesdu.github.io/MindScapeS/`

---

## Administration

See `README.txt` for detailed, non-technical instructions on updating sessions, adding abstracts, changing images, and managing attendees.
