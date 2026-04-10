import { useState } from "react";

const ROLES = [
  { id: "brand", icon: "🏷️", label: "Marca / Empresa de producto" },
  { id: "retailer", icon: "🏪", label: "Retailer / Canal de distribución" },
  { id: "investor", icon: "💼", label: "Inversor / Fondo" },
  { id: "tech", icon: "⚙️", label: "Proveedor de tecnología o servicios" },
  { id: "operator", icon: "🏋️", label: "Operador de estudio / gym / wellness" },
  { id: "media", icon: "📢", label: "Media / Contenido / Comunidad" },
  { id: "consultant", icon: "🧠", label: "Consultor / Agencia" },
];

const GOALS = [
  { id: "clients", icon: "🤝", label: "Encontrar clientes o compradores" },
  { id: "investment", icon: "💰", label: "Encontrar inversión o financiamiento" },
  { id: "partners", icon: "🔗", label: "Encontrar partners estratégicos" },
  { id: "distribution", icon: "🌍", label: "Explorar distribución o expansión" },
  { id: "learn", icon: "💡", label: "Conectar con pares y aprender" },
  { id: "visibility", icon: "👁️", label: "Visibilidad en la industria" },
];

const SLOTS = ["Mar 18", "Mar 19", "Mar 20"];
const TIMES = ["8:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00"];

const STEP_COUNT = 6;

const Progress = ({ step }) => (
  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 }}>
    {Array.from({ length: STEP_COUNT }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 4,
          borderRadius: 99,
          flex: 1,
          maxWidth: 40,
          background: i < step ? "#A3E635" : "rgba(255,255,255,0.15)",
          transition: "background 0.4s ease",
        }}
      />
    ))}
  </div>
);

const Btn = ({ onClick, disabled, children, secondary }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "100%",
      padding: "16px",
      borderRadius: 16,
      border: "none",
      fontWeight: 700,
      fontSize: 16,
      cursor: disabled ? "not-allowed" : "pointer",
      background: secondary
        ? "rgba(255,255,255,0.08)"
        : disabled
        ? "rgba(163,230,53,0.3)"
        : "#A3E635",
      color: secondary ? "rgba(255,255,255,0.6)" : disabled ? "rgba(0,0,0,0.4)" : "#0a0a0a",
      transition: "all 0.2s",
    }}
  >
    {children}
  </button>
);

const Tag = ({ label, icon, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 16px",
      borderRadius: 14,
      border: selected ? "2px solid #A3E635" : "2px solid rgba(255,255,255,0.1)",
      background: selected ? "rgba(163,230,53,0.1)" : "rgba(255,255,255,0.04)",
      color: selected ? "#A3E635" : "rgba(255,255,255,0.75)",
      fontWeight: selected ? 600 : 400,
      fontSize: 14,
      cursor: "pointer",
      textAlign: "left",
      width: "100%",
      transition: "all 0.15s",
    }}
  >
    <span style={{ fontSize: 20 }}>{icon}</span>
    {label}
  </button>
);

// ─── STEPS ────────────────────────────────────────────────────────────────────

function Step1({ data, setData, onNext }) {
  const ok = data.name.trim() && data.company.trim();
  return (
    <div>
      <p style={styles.eyebrow}>Paso 1 de 6</p>
      <h2 style={styles.heading}>Hola, ¿cómo te llamás?</h2>
      <p style={styles.sub}>Empecemos por lo básico.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        <input
          style={styles.input}
          placeholder="Tu nombre"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Tu empresa"
          value={data.company}
          onChange={(e) => setData({ ...data, company: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Tu cargo"
          value={data.role}
          onChange={(e) => setData({ ...data, role: e.target.value })}
        />
      </div>
      <Btn onClick={onNext} disabled={!ok}>Continuar →</Btn>
    </div>
  );
}

function Step2({ data, setData, onNext, onBack }) {
  return (
    <div>
      <p style={styles.eyebrow}>Paso 2 de 6</p>
      <h2 style={styles.heading}>¿Cómo te describís en la industria?</h2>
      <p style={styles.sub}>Esto nos ayuda a conectarte con las personas correctas.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {ROLES.map((r) => (
          <Tag
            key={r.id}
            icon={r.icon}
            label={r.label}
            selected={data.ecosystemRole === r.id}
            onClick={() => setData({ ...data, ecosystemRole: r.id })}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={onNext} disabled={!data.ecosystemRole}>Continuar →</Btn>
        <Btn secondary onClick={onBack}>← Volver</Btn>
      </div>
    </div>
  );
}

function Step3({ data, setData, onNext, onBack }) {
  const examples = [
    "Distribuimos marcas de wellness en 500 puntos en LATAM",
    "Invertimos en marcas de fitness con ticket de $500K–$2M",
    "Desarrollamos apps mobile para marcas de salud",
  ];
  return (
    <div>
      <p style={styles.eyebrow}>Paso 3 de 6</p>
      <h2 style={styles.heading}>¿Qué valor traés a la mesa?</h2>
      <p style={styles.sub}>
        En una frase: ¿qué le ofrecés a alguien que te conozca en este evento?
      </p>
      <textarea
        style={{ ...styles.input, minHeight: 100, resize: "none", lineHeight: 1.6 }}
        placeholder="Ej: Somos una marca de suplementos con distribución en 12 países..."
        value={data.valueOffer}
        onChange={(e) => setData({ ...data, valueOffer: e.target.value })}
      />
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8, marginBottom: 4 }}>
        Ejemplos:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setData({ ...data, valueOffer: ex })}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "rgba(255,255,255,0.45)",
              fontSize: 13,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {ex}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={onNext} disabled={!data.valueOffer.trim()}>Continuar →</Btn>
        <Btn secondary onClick={onBack}>← Volver</Btn>
      </div>
    </div>
  );
}

function Step4({ data, setData, onNext, onBack }) {
  const toggle = (id) => {
    const curr = data.goals;
    const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
    setData({ ...data, goals: next });
  };
  return (
    <div>
      <p style={styles.eyebrow}>Paso 4 de 6</p>
      <h2 style={styles.heading}>¿Qué querés conseguir en este evento?</h2>
      <p style={styles.sub}>Podés elegir más de uno. Esto define tu matching.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {GOALS.map((g) => (
          <Tag
            key={g.id}
            icon={g.icon}
            label={g.label}
            selected={data.goals.includes(g.id)}
            onClick={() => toggle(g.id)}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={onNext} disabled={data.goals.length === 0}>Continuar →</Btn>
        <Btn secondary onClick={onBack}>← Volver</Btn>
      </div>
    </div>
  );
}

function Step5({ data, setData, onNext, onBack }) {
  const toggle = (day, time) => {
    const key = `${day}|${time}`;
    const curr = data.availability;
    const next = curr.includes(key) ? curr.filter((x) => x !== key) : [...curr, key];
    setData({ ...data, availability: next });
  };
  return (
    <div>
      <p style={styles.eyebrow}>Paso 5 de 6</p>
      <h2 style={styles.heading}>¿Cuándo estás disponible?</h2>
      <p style={styles.sub}>
        Seleccioná los slots donde podés tener reuniones. Conectaremos con personas que coincidan.
      </p>
      <div style={{ overflowX: "auto", marginBottom: 28 }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px 4px" }}>
          <thead>
            <tr>
              <td style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", paddingBottom: 4 }} />
              {SLOTS.map((d) => (
                <td
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    paddingBottom: 4,
                  }}
                >
                  {d}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((t) => (
              <tr key={t}>
                <td style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", paddingRight: 6, whiteSpace: "nowrap" }}>
                  {t}
                </td>
                {SLOTS.map((d) => {
                  const key = `${d}|${t}`;
                  const sel = data.availability.includes(key);
                  return (
                    <td key={d}>
                      <button
                        onClick={() => toggle(d, t)}
                        style={{
                          width: "100%",
                          height: 36,
                          borderRadius: 8,
                          border: sel ? "2px solid #A3E635" : "2px solid rgba(255,255,255,0.08)",
                          background: sel ? "rgba(163,230,53,0.15)" : "rgba(255,255,255,0.04)",
                          cursor: "pointer",
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Btn onClick={onNext}>
          {data.availability.length > 0
            ? `Continuar con ${data.availability.length} slot${data.availability.length > 1 ? "s" : ""} →`
            : "Prefiero decidir después →"}
        </Btn>
        <Btn secondary onClick={onBack}>← Volver</Btn>
      </div>
    </div>
  );
}

function Step6({ data }) {
  const roleLabel = ROLES.find((r) => r.id === data.ecosystemRole)?.label || "";
  const goalLabels = GOALS.filter((g) => data.goals.includes(g.id)).map((g) => g.label);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ ...styles.heading, textAlign: "center" }}>
        ¡Listo, {data.name.split(" ")[0]}!
      </h2>
      <p style={{ ...styles.sub, textAlign: "center", marginBottom: 32 }}>
        Ya estamos buscando las conexiones más relevantes para vos.
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 16,
          padding: "20px",
          textAlign: "left",
          marginBottom: 24,
        }}
      >
        <p style={styles.cardLabel}>Tu perfil</p>
        <p style={styles.cardValue}>{data.name} · {data.company}</p>
        {roleLabel && <p style={{ ...styles.cardValue, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{roleLabel}</p>}

        {data.valueOffer && (
          <>
            <div style={styles.divider} />
            <p style={styles.cardLabel}>Tu propuesta de valor</p>
            <p style={styles.cardValue}>{data.valueOffer}</p>
          </>
        )}

        {goalLabels.length > 0 && (
          <>
            <div style={styles.divider} />
            <p style={styles.cardLabel}>Buscás</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {goalLabels.map((g) => (
                <p key={g} style={{ ...styles.cardValue, fontSize: 13 }}>· {g}</p>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          background: "rgba(163,230,53,0.08)",
          border: "1px solid rgba(163,230,53,0.2)",
          borderRadius: 14,
          padding: "16px",
          marginBottom: 28,
        }}
      >
        <p style={{ color: "#A3E635", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
          🤖 La IA ya está trabajando
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>
          Vamos a sugerirte las conexiones más relevantes según tus objetivos de negocio, antes y durante el evento.
        </p>
      </div>

      <Btn onClick={() => {}}>Ver mis sugerencias →</Btn>
    </div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────

const initialData = {
  name: "",
  company: "",
  role: "",
  ecosystemRole: null,
  valueOffer: "",
  goals: [],
  availability: [],
};

export default function OnboardingPrototype() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [animating, setAnimating] = useState(false);

  const go = (n) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(n);
      setAnimating(false);
    }, 180);
  };

  const stepProps = {
    data,
    setData,
    onNext: () => go(step + 1),
    onBack: () => go(step - 1),
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060606",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          minHeight: 700,
          background: "#111111",
          borderRadius: 40,
          boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            padding: "14px 24px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>●●●</span>
          </div>
        </div>

        {/* Event badge */}
        <div style={{ padding: "12px 24px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(163,230,53,0.1)",
              border: "1px solid rgba(163,230,53,0.25)",
              borderRadius: 99,
              padding: "5px 12px",
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: "#A3E635", letterSpacing: 1 }}>
              CONNECTED HEALTH & FITNESS SUMMIT
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "24px 24px 32px",
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.18s ease, transform 0.18s ease",
            overflowY: "auto",
          }}
        >
          <Progress step={step} />
          {step === 1 && <Step1 {...stepProps} />}
          {step === 2 && <Step2 {...stepProps} />}
          {step === 3 && <Step3 {...stepProps} />}
          {step === 4 && <Step4 {...stepProps} />}
          {step === 5 && <Step5 {...stepProps} />}
          {step === 6 && <Step6 data={data} />}
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────────

const styles = {
  eyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: 800,
    color: "#FFFFFF",
    lineHeight: 1.2,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.6,
    marginBottom: 28,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "2px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#FFFFFF",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.5,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.07)",
    margin: "14px 0",
  },
};
