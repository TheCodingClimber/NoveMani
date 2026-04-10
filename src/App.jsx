import { useEffect, useRef, useState } from "react";
import "./App.css";

const stats = [
  { value: "04", label: "Active ventures" },
  { value: "100%", label: "Operator owned" },
  { value: "24/7", label: "Infrastructure coverage" },
  { value: "Zero", label: "Outside pressure" },
];

const ventures = [
  {
    tag: "TECH",
    name: "M20R1",
    summary: "AI systems, model hosting, and production-grade compute designed for operators who need proof, not theater.",
  },
  {
    tag: "INFRA",
    name: "CA1RN",
    summary: "Physical infrastructure, network resilience, and facility hardening executed by people who know the rack from the breaker.",
  },
  {
    tag: "CODE",
    name: "Sovereign Nexus",
    summary: "Software delivery for high-accountability environments where audit trails, access control, and durability matter.",
  },
  {
    tag: "OPS",
    name: "Aletheos",
    summary: "A command surface for governed operations, live state review, and disciplined execution across moving pieces.",
  },
];

const operatingModel = [
  {
    title: "Decision rights stay close to execution",
    text: "Leadership is embedded in the work. The people approving risk also understand the systems carrying it.",
  },
  {
    title: "Infrastructure is treated like leverage",
    text: "We build around durable capability: compute, facilities, tooling, and process that compound instead of decaying into chaos.",
  },
  {
    title: "Governance is operational, not ceremonial",
    text: "Controls, records, and accountability are built into the rhythm of delivery so they survive growth and stress.",
  },
];

const fieldNotes = [
  "Leadership forged on job sites, in server rooms, and during late-night releases.",
  "Capital allocation managed with operator discipline instead of investor theater.",
  "Systems designed to be inspected, audited, and trusted under pressure.",
];

function SignalField() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    let cleanup = () => {};
    let cancelled = false;

    if (!mountNode) {
      return undefined;
    }

    const loadScene = async () => {
      const THREE = await import("three");

      if (cancelled) {
        return;
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.6, 11);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      mountNode.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const knotGeometry = new THREE.TorusKnotGeometry(2.8, 0.68, 220, 32);
      const knotMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6a00,
        wireframe: true,
        transparent: true,
        opacity: 0.34,
      });
      const knot = new THREE.Mesh(knotGeometry, knotMaterial);
      group.add(knot);

      const haloGeometry = new THREE.RingGeometry(3.6, 3.9, 128);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xffc592,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.rotation.x = Math.PI / 2.4;
      halo.rotation.y = 0.25;
      group.add(halo);

      const pointCount = 1100;
      const positions = new Float32Array(pointCount * 3);

      for (let index = 0; index < pointCount; index += 1) {
        const stride = index * 3;
        const radius = 4.6 + Math.random() * 2.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[stride] = radius * Math.sin(phi) * Math.cos(theta);
        positions[stride + 1] = radius * Math.cos(phi) * 0.55;
        positions[stride + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd4b5,
        size: 0.045,
        transparent: true,
        opacity: 0.72,
        sizeAttenuation: true,
      });
      const particles = new THREE.Points(particleGeometry, particlesMaterial);
      scene.add(particles);

      let pointerX = 0;
      let pointerY = 0;
      let animationFrameId = 0;

      const resize = () => {
        const width = mountNode.clientWidth || 1;
        const height = mountNode.clientHeight || 1;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const handlePointerMove = (event) => {
        const bounds = mountNode.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.35;
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 1.1;
      };

      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", handlePointerMove);

      const clock = new THREE.Clock();

      const renderFrame = () => {
        const elapsed = clock.getElapsedTime();

        group.rotation.y = elapsed * 0.22;
        group.rotation.x = 0.15 + Math.sin(elapsed * 0.5) * 0.1 + pointerY * 0.12;
        group.rotation.z = Math.cos(elapsed * 0.35) * 0.08;
        group.position.x += (pointerX - group.position.x) * 0.035;
        group.position.y += (-pointerY * 0.45 - group.position.y) * 0.035;

        halo.rotation.z = elapsed * 0.24;
        particles.rotation.y = elapsed * 0.035;
        particles.rotation.x = Math.sin(elapsed * 0.2) * 0.08;

        renderer.render(scene, camera);

        if (!reducedMotion) {
          animationFrameId = window.requestAnimationFrame(renderFrame);
        }
      };

      renderFrame();

      cleanup = () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", handlePointerMove);
        window.cancelAnimationFrame(animationFrameId);

        if (mountNode.contains(renderer.domElement)) {
          mountNode.removeChild(renderer.domElement);
        }

        knotGeometry.dispose();
        knotMaterial.dispose();
        haloGeometry.dispose();
        haloMaterial.dispose();
        particleGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();
      };
    };

    loadScene();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <div className="signal-field" ref={mountRef} aria-hidden="true" />;
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    focus: "",
    message: "",
  });
  const [status, setStatus] = useState("Submit a brief and we will stage it into a clean handoff block.");
  const [preview, setPreview] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const brief = [
      "NOVE MANI // INBOUND BRIEF",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Focus: ${form.focus}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    setPreview(brief);

    try {
      await navigator.clipboard.writeText(brief);
      setStatus("Brief staged. The formatted handoff has been copied to your clipboard.");
    } catch {
      setStatus("Brief staged. Clipboard access was blocked, so the formatted handoff is shown below.");
    }
  };

  return (
    <section className="section section--contact" id="contact">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h2>Bring a real problem, build, or infrastructure plan.</h2>
        <p className="section-copy">
          No funnel language. No ornamental outreach. Share the situation, the scope, and the constraints, and we can move from there.
        </p>
      </div>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Operator name"
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@company.com"
              required
            />
          </label>

          <label className="field">
            <span>Focus</span>
            <input
              name="focus"
              value={form.focus}
              onChange={updateField}
              placeholder="Infrastructure, product, compliance, capital, or build support"
              required
            />
          </label>

          <label className="field">
            <span>Brief</span>
            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              placeholder="What needs to get built, fixed, hardened, or governed?"
              rows="6"
              required
            />
          </label>

          <div className="contact-actions">
            <button className="button" type="submit">
              Stage Brief
            </button>
            <p className="status" aria-live="polite">
              {status}
            </p>
          </div>
        </form>

        <aside className="brief-panel">
          <p className="eyebrow">Handoff block</p>
          <h3>What this intake does right now</h3>
          <ul className="brief-list">
            <li>Formats the submission into a concise operator brief.</li>
            <li>Copies that brief to the clipboard when the browser allows it.</li>
            <li>Leaves the output visible here so nothing gets lost.</li>
          </ul>
          <pre className="brief-preview">{preview || "No brief staged yet."}</pre>
        </aside>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand__mark">[NM]</span>
          <span className="brand__name">Nove Mani</span>
        </a>

        <nav className="topbar__nav" aria-label="Primary">
          <a href="#platform">Platform</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact" className="button button--small">
            Start a brief
          </a>
        </nav>
      </header>

      <main>
        <section className="section hero" id="top">
          <div className="hero__copy section-reveal">
            <p className="eyebrow">Governed ventures for serious operators</p>
            <h1>Hard systems. Clear authority. Built to hold under pressure.</h1>
            <p className="hero__lede">
              Nove Mani builds companies, infrastructure, and software with operator discipline at the center. Governance is not the talking point. It is the frame the work lives inside.
            </p>

            <div className="hero__actions">
              <a className="button" href="#contact">
                Start a brief
              </a>
              <a className="button button--ghost" href="#portfolio">
                See the portfolio
              </a>
            </div>

            <dl className="metric-grid" aria-label="Company metrics">
              {stats.map((item) => (
                <div className="metric-card" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hero__visual section-reveal">
            <SignalField />
          </div>
        </section>

        <section className="section section--panel" id="platform">
          <div className="section-heading">
            <p className="eyebrow">Platform</p>
            <h2>We operate like builders who expect the system to be audited later.</h2>
            <p className="section-copy">
              That means records, controls, capital discipline, and technical execution all speak the same language instead of getting handed off between disconnected teams.
            </p>
          </div>

          <div className="panel-grid">
            {operatingModel.map((item, index) => (
              <article className="panel-card section-reveal" key={item.title}>
                <p className="panel-card__index">0{index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="portfolio">
          <div className="section-heading">
            <p className="eyebrow">Portfolio</p>
            <h2>Different vehicles, one operating standard.</h2>
          </div>

          <div className="portfolio-list">
            {ventures.map((venture) => (
              <article className="portfolio-item section-reveal" key={venture.name}>
                <div className="portfolio-item__tag">{venture.tag}</div>
                <div className="portfolio-item__body">
                  <h3>{venture.name}</h3>
                  <p>{venture.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--notes">
          <div className="section-heading">
            <p className="eyebrow">Field notes</p>
            <h2>The company voice should sound like the floor, not the pitch deck.</h2>
          </div>

          <div className="notes-list">
            {fieldNotes.map((note, index) => (
              <div className="note-row section-reveal" key={note}>
                <span className="note-row__index">{String(index + 1).padStart(2, "0")}</span>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ContactForm />

      <footer className="footer">
        <span>{new Date().getFullYear()} Nove Mani LLC</span>
        <span>Built. Owned. Governed.</span>
      </footer>
    </div>
  );
}
