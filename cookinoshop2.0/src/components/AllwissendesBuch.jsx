import { useEffect, useRef, useState } from "react";


const STARTFRAGEN = [
  "Wer gehört zur Cookie Crew?",
  "Welche Hoodies habt ihr?",
  "Erzähl mir etwas über Moniki Kicherkrähe.",
];


export default function AllwissendesBuch() {
  const [frage, setFrage] = useState("");
  const [sitzungsId, setSitzungsId] = useState(null);
  const [laedt, setLaedt] = useState(false);
  const [nachrichten, setNachrichten] = useState([
    {
      rolle: "buch",
      text: "Willkommen, Reisender. Welche Antwort darf ich zwischen meinen Seiten für dich suchen?",
    },
  ]);
  const dialogRef = useRef(null);
  const endeRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.scrollTo({ top: dialog.scrollHeight, behavior: "smooth" });
    } else {
      endeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [nachrichten, laedt]);

  async function fragen(event, vorgeschlageneFrage = null) {
    event?.preventDefault();
    const text = (vorgeschlageneFrage || frage).trim();
    if (text.length < 2 || laedt) return;

    setFrage("");
    setLaedt(true);
    setNachrichten((alt) => [...alt, { rolle: "gast", text }]);

    try {
      const response = await fetch("/api/buch/fragen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frage: text, sitzungs_id: sitzungsId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Das Buch schweigt gerade.");

      setSitzungsId(data.sitzungs_id);
      setNachrichten((alt) => [
        ...alt,
        { rolle: "buch", text: data.antwort },
      ]);
    } catch (error) {
      setNachrichten((alt) => [
        ...alt,
        { rolle: "fehler", text: error.message },
      ]);
    } finally {
      setLaedt(false);
    }
  }

  return (
    <section className="cookino-buch" aria-labelledby="cookino-buch-titel">
      <style>{`
        .cookino-buch { padding: 5rem 4vw; background: #171121; color: #402b32; }
        .cookino-buch-inner { position: relative; max-width: 1100px; min-height: 590px; margin: auto;
          display: grid; grid-template-columns: 1fr 1fr; border: 14px solid #50311f;
          border-radius: 24px; overflow: hidden; box-shadow: 0 35px 80px #07050a; }
        .cookino-seite { padding: clamp(1.5rem, 4vw, 3.5rem); background: #fff6dc;
          background-image: radial-gradient(#d9c79e .7px, transparent .7px); background-size: 7px 7px; }
        .cookino-seite + .cookino-seite { border-left: 3px solid #c8b587; display: flex; flex-direction: column; }
        .cookino-buch h2 { margin: .5rem 0 1rem; font: 700 clamp(2.2rem, 5vw, 4rem)/1 Georgia, serif; }
        .cookino-kapitel { color: #906638; letter-spacing: .15em; text-transform: uppercase; font-weight: 800; }
        .cookino-intro { font: 1.15rem/1.65 Georgia, serif; }
        .cookino-startfragen { display: grid; gap: .7rem; margin-top: 2rem; }
        .cookino-startfragen button { padding: .8rem; text-align: left; border: 1px solid #b99b68;
          border-radius: 10px; color: #4b3437; background: rgba(255,255,255,.4); cursor: pointer; }
        .cookino-dialog { flex: 1; max-height: 390px; overflow: auto; }
        .cookino-nachricht { margin: 0 0 .8rem; padding: .8rem 1rem; border-radius: 4px 14px 14px;
          background: rgba(108,72,123,.11); white-space: pre-wrap; line-height: 1.5; }
        .cookino-nachricht.gast { margin-left: 2rem; border-radius: 14px 4px 14px 14px; background: rgba(205,154,63,.18); }
        .cookino-nachricht.fehler { color: #8b2e25; background: #f5d5c9; }
        .cookino-nachricht strong { display: block; margin-bottom: .25rem; font-size: .72rem;
          color: #8d693f; text-transform: uppercase; letter-spacing: .08em; }
        .cookino-form { border-top: 1px solid #c7b58e; padding-top: 1rem; }
        .cookino-form div { display: flex; gap: .6rem; }
        .cookino-form input { flex: 1; min-width: 0; padding: .85rem; border: 1px solid #a98c67;
          border-radius: 10px; background: rgba(255,255,255,.55); }
        .cookino-form button { padding: .85rem 1.1rem; border: 0; border-radius: 10px;
          color: white; background: #654277; font-weight: 800; cursor: pointer; }
        .cookino-form button:disabled { opacity: .5; cursor: not-allowed; }
        .cookino-hinweis { margin-top: 1.5rem; font-size: .75rem; color: #74685e; }
        @media (max-width: 760px) {
          .cookino-buch-inner { grid-template-columns: 1fr; }
          .cookino-seite + .cookino-seite { border-left: 0; border-top: 3px solid #c8b587; min-height: 540px; }
        }
      `}</style>

      <div className="cookino-buch-inner">
        <div className="cookino-seite">
          <span className="cookino-kapitel">Kapitel I</span>
          <h2 id="cookino-buch-titel">Das Flüsternde Buch</h2>
          <p className="cookino-intro">
            In diesen Seiten lebt das Wissen der Cookino-Welt. Stelle eine Frage
            und lausche dem Rascheln des Papiers.
          </p>
          <div className="cookino-startfragen">
            {STARTFRAGEN.map((text) => (
              <button key={text} type="button" onClick={() => fragen(null, text)}>
                {text}
              </button>
            ))}
          </div>
          <p className="cookino-hinweis">
            KI-gestützte Antworten. Bitte keine persönlichen Daten eingeben.
          </p>
        </div>

        <div className="cookino-seite">
          <div className="cookino-dialog" aria-live="polite" ref={dialogRef}>
            {nachrichten.map((nachricht, index) => (
              <div className={`cookino-nachricht ${nachricht.rolle}`} key={`${index}-${nachricht.text}`}>
                <strong>{nachricht.rolle === "gast" ? "Du" : "Das Buch"}</strong>
                {nachricht.text}
              </div>
            ))}
            {laedt && <p><em>Die Seiten rascheln …</em></p>}
            <div ref={endeRef} />
          </div>

          <form className="cookino-form" onSubmit={fragen}>
            <div>
              <input
                value={frage}
                onChange={(event) => setFrage(event.target.value)}
                maxLength={500}
                placeholder="Was möchtest du wissen?"
                aria-label="Frage an das allwissende Buch"
                disabled={laedt}
              />
              <button disabled={laedt || frage.trim().length < 2}>Fragen</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

