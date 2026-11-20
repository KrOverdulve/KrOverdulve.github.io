const { useState, useEffect, useRef } = React;

/* ----------------------------- data ----------------------------- */

const SOCIALS = [
  { pf: "Google Scholar", hd: "", href: "https://scholar.google.com/citations?user=1RR0yC8AAAAJ" },
  { pf: "GitHub", hd: "@KrOverdulve", href: "https://github.com/KrOverdulve" },
  { pf: "X / Twitter", hd: "@KristofOverdulv", href: "https://x.com/KristofOverdulv" },
  { pf: "LinkedIn", hd: "kristof-overdulve", href: "https://www.linkedin.com/in/kristof-overdulve/" },
];

const EMAIL = "kristof.overdulve@uhasselt.be";

const INTERESTS = [
  "Computer Graphics", "Computer Vision", "Novel-View Synthesis",
  "Dynamic Scenes", "3D Reconstruction", "Immersive / XR",
];

// authors: array of {n, me?}
const PUBS = [
  {
    year: "2026",
    type: "Conference",
    title: "Practical High-Fidelity Novel-View Synthesis of Mounted Lepidoptera",
    authors: [{ n: "K. Overdulve", me: true }, { n: "L. Jorissen" }, { n: "N. Michiels" }],
    venue: "IEEE/CVF Winter Conference on Applications of Computer Vision (WACV 2027) · Accepted",
    image: "assets/lepidoptera-teaser.jpg",
    imageAlt: "Dorsal and ventral renders of five reconstructed butterfly specimens",
    links: [
      { label: "Project page", href: "https://kroverdulve.github.io/gsplat-lepidoptera/" },
      { label: "arXiv", href: "https://arxiv.org/abs/2606.31679" },
      { label: "Code", href: "https://github.com/KrOverdulve/gsplat-lepidoptera" },
    ],
  },
  {
    year: "2026",
    type: "Conference",
    title: "SSA-3DGS: Unsupervised Removal of Screen-Space Artifacts for 3D Gaussian Splatting",
    authors: [{ n: "K. Overdulve", me: true }, { n: "L. Jorissen" }, { n: "N. Michiels" }],
    venue: "IEEE/CVF Winter Conference on Applications of Computer Vision (WACV 2027) · Accepted",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2607.05598" },
    ],
  },
  {
    year: "2025",
    type: "Conference",
    title: "Leveraging Transfer Learning for Niche Sign System Recognition in VR Training with Limited Data",
    authors: [{ n: "Y. Mijnendonckx" }, { n: "K. Overdulve", me: true }, { n: "N. Michiels" }],
    venue: "International Conference on Extended Reality (XR Salento), 58–71",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-97763-3_5",
  },
  ,
  {
    year: "2024",
    type: "Tech report",
    title: "Large-area Tracking and Rendering for Extended Reality",
    authors: [{ n: "N. Michiels" }, { n: "L. Jorissen" }, { n: "F. Di Fiore" }, { n: "K. Overdulve", me: true }, { n: "J. Vanherck" }, { n: "et al." }],
    venue: "Digital Future Lab, UHasselt",
    link: "https://documentserver.uhasselt.be//handle/1942/44983",
  },
  {
    year: "2022",
    type: "Conference",
    title: "A Pilot Study for a 3D Scanning to VR Workflow for Building Spaces: Exploring Possibilities Through the Use of Different Scanning Hardware",
    authors: [{ n: "I. Garcia" }, { n: "M. Ozdemir" }, { n: "S. Van Aken" }, { n: "K. Overdulve", me: true }, { n: "J. Verlinden" }],
    venue: "Annual Conference of the European Association for Architectural Education (EAAE)",
    link: "https://link.springer.com/chapter/10.1007/978-3-031-40188-6_21",
  },
];

const PROJECTS = [
  {
    kicker: "Personal research focus",
    title: "Dynamic Novel-View Synthesis for Natural Scenes",
    desc: "Reconstructing and re-rendering moving natural scenes with complex motion.",
    date: "2023-...",
    tags: ["NVS", "Dynamic scenes", "Neural rendering"],
  },
  {
    kicker: "Funded project",
    title: "TETRA Parallax",
    desc: "Application-oriented research project supported by VLAIO to disseminate knowledge and expertise of Novel-View Synthesis for more cost-effective 3D content creation for Flemish companies and non profits.",
    date: "2025-2027",
    tags: ["NVS", "3DGS", "Digital Twins"],
  },
  {
    kicker: "Funded project",
    title: "Active Defects Detection In Line (Flanders Make - ADDIL)",
    desc: "Inline inspection of surface defects (and other small surface details) of (moving) parts in a production floor.",
    date: "2025-2027",
    tags: ["3D reconstruction", "Pose estimation"],
  },
  {
    kicker: "Funded project",
    title: "Mixed Augmented and Extended Reality Media Pipeline (MAX-R)",
    desc: "Comparing scanning hardware and pipelines to bring real architectural spaces into immersive VR with practical, repeatable workflows.",
    date: "2023-2025",
    tags: ["3D scanning", "Large-area XR tracking"],
    link: "https://www.upf.edu/web/max-r",
  },
];

/* ----------------------------- icons ----------------------------- */

const Arrow = () => (
  <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg>
);
const Mail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 7 9 6 9-6" /></svg>
);

/* ----------------------------- reveal hook ----------------------------- */

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));

    const showIfNear = () => {
      const vh = window.innerHeight || 800;
      els.forEach((e) => {
        if (e.classList.contains("in")) return;
        const r = e.getBoundingClientRect();
        if (r.top < vh * 0.94) e.classList.add("in");
      });
    };

    // initial pass for whatever is in view
    requestAnimationFrame(showIfNear);

    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1 });
      els.forEach((e) => io.observe(e));
    }

    window.addEventListener("scroll", showIfNear, { passive: true });
    // safety net: never leave content hidden
    const fallback = setTimeout(() => els.forEach((e) => e.classList.add("in")), 1200);

    return () => {
      if (io) io.disconnect();
      window.removeEventListener("scroll", showIfNear);
      clearTimeout(fallback);
    };
  }, []);
}

/* ----------------------------- sections ----------------------------- */

function Sidebar() {
  return (
    <aside className="side">
      <div className="side-inner">
        <div className="portrait-wrap reveal">
          <img className="portrait" src={(window.__resources && window.__resources.portrait) || "assets/kristof.jpeg"} alt="Kristof Overdulve" />
        </div>
        <h1 className="name reveal">Kristof Overdulve</h1>
        <div className="role reveal">Academic Researcher</div>
        <div className="affil reveal">
          Digital Future Lab · <a href="https://www.uhasselt.be/" target="_blank" rel="noopener">UHasselt</a>
        </div>
        <a className="cta reveal" href={"mailto:" + EMAIL}><Mail /> Get in touch</a>

        <div className="sublabel reveal">Elsewhere</div>
        <div className="socials reveal">
          {SOCIALS.map((s, i) => (
            <a className="social" key={s.pf} href={s.href} target="_blank" rel="noopener">
              <span className="ix">{String(i + 1).padStart(2, "0")}</span>
              <span className="pf">{s.pf}</span>
              <span className="hd">{s.hd}</span>
              <Arrow />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="sec-head reveal">
        <span className="sec-num">01</span>
        <h2 className="sec-title">About</h2>
      </div>
      <p className="lead reveal">
        I create <span className="hl">immersive experiences</span> at the intersection of
        computer graphics and computer vision.
      </p>
      <div className="about-body reveal">
        <p>
          My research currently focuses on dynamic — mostly natural — scenes, and on broadening
          the scope of applications for novel-view synthesis: capturing the real world and
          re-rendering it from viewpoints a camera never saw.
        </p>
        <p>
          I work at the Digital Future Lab (UHasselt), where my projects span novel-view synthesis, 3D reconstruction,
          pose estimation, and some side projects.
        </p>
      </div>
      <div className="tags reveal">
        {INTERESTS.map((t) => <span className="tag" key={t}>{t}</span>)}
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section className="section" id="publications">
      <div className="sec-head reveal">
        <span className="sec-num">02</span>
        <h2 className="sec-title">Selected Publications</h2>
        <span className="sec-aside">
          <a href="https://scholar.google.com/citations?user=1RR0yC8AAAAJ" target="_blank" rel="noopener">All on Scholar ↗</a>
        </span>
      </div>
      <div className="pubs">
        {PUBS.map((p, i) => (
          <article className="pub reveal" key={i}>
            <div className="pub-year">
              {p.year}
              {p.badge ? <span className="badge">{p.badge}</span> : null}
            </div>
            <div>
              <div className="pub-title">{p.title}</div>
              <div className="pub-authors">
                {p.authors.map((a, j) => (
                  <React.Fragment key={j}>
                    <span className={a.me ? "me" : ""}>{a.n}</span>{j < p.authors.length - 1 ? ", " : ""}
                  </React.Fragment>
                ))}
              </div>
              <div className="pub-venue"><span className="type">{p.type}</span>{p.venue}</div>
              {p.image && (
                <a className="pub-thumb" href={p.links ? p.links[0].href : p.link} target="_blank" rel="noopener">
                  <img src={p.image} alt={p.imageAlt || ""} loading="lazy" />
                </a>
              )}
              <div className="pub-viewmore">
                {p.links
                  ? p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>
                    ))
                  : p.link && (
                      <a href={p.link} target="_blank">View publication ↗</a>
                    )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section" id="projects">
      <div className="sec-head reveal">
        <span className="sec-num">03</span>
        <h2 className="sec-title">Projects</h2>
      </div>
      <div className="projects">
        {PROJECTS.map((p) => (
          <article className="project reveal" key={p.title}>
            <img src={p.image} shape="rect"></img>
            <div className="project-body">
              <div className="project-kicker">{p.kicker}</div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-date">{p.date}</p>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
              <p className="project-link">
                {p.link && (
                  <a href={p.link} target="_blank">Go to website ↗</a>
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- theme ----------------------------- */

const THEME = { direction: "modern", accent: "#475569" };

/* ----------------------------- app ----------------------------- */

function App() {
  useReveal();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", THEME.direction);
    document.documentElement.style.setProperty("--accent", THEME.accent);
  }, []);

  return (
    <React.Fragment>
      <div className="topglow"></div>
      <div className="wrap">
        <header className="topbar">
          <div className="brand"><span className="dot"></span>KRISTOF OVERDULVE</div>
          <nav className="topnav">
            <a href="#about">About</a>
            <a href="#publications">Publications</a>
            <a href="#projects">Projects</a>
            <a href={"mailto:" + EMAIL}>Contact</a>
          </nav>
        </header>

        <div className="grid">
          <Sidebar />
          <main>
            <About />
            <Publications />
            <Projects />
          </main>
        </div>
      </div>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-in">
            <span>© {new Date().getFullYear()} Kristof Overdulve · Digital Future Lab, UHasselt</span>
            <a href={"mailto:" + EMAIL}>{EMAIL}</a>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
