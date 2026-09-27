import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, theme } from "../theme";
import { phraseAt, TimedScene } from "../timeline";
import { BrowserFrame, Cursor, Logo, SiteHeader, typed } from "../components/Browser";
import { Icon } from "../components/Icons";
import { Beat, SfxAt, Typing } from "../components/Shell";
import { IconBadge, Kinetic } from "../components/Ui";
import { clamp, ease, fadeUp, pop, popIn } from "../components/motion";
import { DetailPage, Field, filtered, inventory, ListingCard, SiteHome, CarThumb } from "../components/Site";

// Posición del navegador en pantalla (coordenadas absolutas del frame 1920x1080).
const BX = 600;
const BY = 110;
const BW = 1250;
const BH = 730;
const CY = BY + 64; // inicio del contenido bajo la barra del navegador

const StepPanel: React.FC<{ n: number; title: string; items: string[]; itemTimes: number[] }> = ({ n, title, items, itemTimes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 0);
  return (
    <div style={{ position: "absolute", left: 80, top: BY + 10, width: 470 }}>
      <div style={{ ...fadeUp(p, 60), display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 150, lineHeight: 1, color: theme.accent, letterSpacing: -6 }}>
          {String(n).padStart(2, "0")}
        </span>
        <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 28, color: theme.muted, letterSpacing: 4 }}>PASO</span>
      </div>
      <div style={{ ...fadeUp(pop(frame, fps, 5), 40), fontFamily: theme.display, fontWeight: 900, fontSize: 56, lineHeight: 1.05, color: theme.text, marginTop: 16 }}>
        {title}
      </div>
      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((it, i) => {
          const ip = pop(frame, fps, itemTimes[i] ?? 10 + i * 5);
          return (
            <div key={it} style={{ ...fadeUp(ip, 20), display: "flex", alignItems: "center", gap: 14, fontFamily: theme.ui, fontWeight: 600, fontSize: 28, color: theme.text }}>
              <span style={{ width: 34, height: 34, borderRadius: 17, background: `${theme.success}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={22} color={theme.success} stroke={3} />
              </span>
              {it}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Illustrative: React.FC = () => (
  <div style={{ position: "absolute", left: BX, top: BY + BH + 14, fontFamily: theme.ui, fontSize: 18, color: theme.muted, opacity: 0.8 }}>
    Interfaz y vehículos ilustrativos
  </div>
);

const browserIn = (frame: number, start: number) => {
  const p = ease(frame, start, start + 18);
  return { opacity: p, transform: `translateY(${(1 - p) * 80}px) scale(${0.94 + 0.06 * p})` };
};

// ---------------------------------------------------------------- PASO 1
export const Step1: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b1 = phraseAt(scene, "Paso 1");
  const typeStart = phraseAt(scene, "entra a") + 4;
  const typeFrames = Math.ceil((brand.url.length / 20) * 30);
  const loaded = typeStart + typeFrames + 6;
  const phoneAt = phraseAt(scene, "desde tu celular");
  const labels = ["Entra", "Filtra", "Revisa", brand.ctaButton];

  return (
    <AbsoluteFill>
      <Beat from={0} to={b1 + 2}>
        <div style={{ position: "absolute", inset: 0, bottom: 190, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Kinetic text="Así se usa en *4* *pasos*" size={120} delay={2} />
          <div style={{ display: "flex", gap: 40, marginTop: 70 }}>
            {labels.map((l, i) => {
              const p = pop(frame, fps, 14 + i * 6);
              return (
                <div key={l} style={{ ...popIn(p), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 65,
                      border: `4px solid ${theme.accent}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.display,
                      fontWeight: 900,
                      fontSize: 60,
                      color: theme.text,
                      background: `${theme.accent}18`,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 30, color: theme.muted }}>{l}</div>
                </div>
              );
            })}
          </div>
        </div>
        {labels.map((_, i) => (
          <SfxAt key={i} at={14 + i * 6} name="pop" volume={0.35} />
        ))}
      </Beat>

      <Beat from={b1}>
        <StepPanel n={1} title="Entra al sitio" items={["Desde tu celular", "O tu computadora"]} itemTimes={[phoneAt - b1, phoneAt - b1 + 12]} />
        <div style={{ position: "absolute", left: BX, top: BY, ...browserIn(frame, b1) }}>
          <BrowserFrame url={typed(brand.url, frame, typeStart, 20)} showCaret={frame < loaded} width={BW} height={BH}>
            {frame >= loaded ? (
              <SiteHome reveal={interpolate(frame, [loaded, loaded + 10], [0, 1], clamp)} />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: theme.muted, fontFamily: theme.ui, fontSize: 26 }}>
                Escribe la dirección…
              </div>
            )}
            {frame >= loaded && frame < loaded + 10 && (
              <div style={{ position: "absolute", left: 0, top: 0, height: 4, width: `${((frame - loaded) / 10) * 100}%`, background: theme.accent }} />
            )}
          </BrowserFrame>
        </div>
        <Phone at={phoneAt - b1} />
        <Illustrative />
        <Typing at={typeStart - b1} frames={typeFrames} />
        <SfxAt at={loaded - b1} name="click" volume={0.5} />
      </Beat>
    </AbsoluteFill>
  );
};

const Phone: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 13);
  return (
    <div
      style={{
        position: "absolute",
        left: 1560,
        top: 300,
        width: 290,
        height: 580,
        borderRadius: 44,
        background: "#05080F",
        border: "8px solid #1E293B",
        boxShadow: "0 40px 90px rgba(0,0,0,0.7)",
        overflow: "hidden",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 300}px) rotate(${(1 - p) * 10 + 4}deg)`,
      }}
    >
      <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${theme.line}` }}>
        <Logo size={18} />
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 21, color: theme.text, lineHeight: 1.1 }}>{brand.heroTitle}</div>
        <div style={{ marginTop: 12, height: 38, borderRadius: 10, background: "#0E1729", border: `1px solid ${theme.line}`, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", color: theme.muted, fontFamily: theme.ui, fontSize: 13 }}>
          <Icon name="search" size={16} color={theme.muted} /> Marca, modelo o año…
        </div>
        {inventory.slice(1, 3).map((l, i) => (
          <div key={i} style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", border: `1px solid ${theme.line}` }}>
            <CarThumb l={l} height={100} carWidth={190} />
            <div style={{ padding: "6px 10px", fontFamily: theme.ui, fontSize: 13, fontWeight: 700, color: theme.text, background: theme.panel }}>
              {l.year} {l.make} {l.model}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- PASO 2
const FIELD_W = 235;
const fieldX = (i: number) => BX + 30 + i * (FIELD_W + 16) + FIELD_W / 2;
const FIELD_Y = CY + 150;

export const Step2: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMake = phraseAt(scene, "marca");
  const tModel = phraseAt(scene, "modelo");
  const tYear = phraseAt(scene, "año");
  const tBudget = phraseAt(scene, "tu presupuesto");
  const tSearch = phraseAt(scene, "En segundos") - 4;
  const fields: { label: string; value: string; at: number }[] = [
    { label: "Marca", value: "Toyota", at: tMake },
    { label: "Modelo", value: "RAV4", at: tModel },
    { label: "Año", value: "2019 – 2023", at: tYear },
    { label: "Presupuesto", value: "Hasta $18,000", at: tBudget },
  ];
  const searched = frame >= tSearch + 4;
  const list = searched ? filtered : inventory;
  const listStart = searched ? tSearch + 6 : 0;
  const active = fields.findIndex((f, i) => frame >= f.at && frame < (fields[i + 1]?.at ?? tSearch));

  const count = searched ? Math.round(interpolate(frame, [tSearch + 4, tSearch + 20], [2431, 48], clamp)) : 2431;

  return (
    <AbsoluteFill>
      <StepPanel n={2} title="Filtra tu búsqueda" items={["Marca y modelo", "Año", "Tu presupuesto"]} itemTimes={[tMake, tYear, tBudget]} />
      <div style={{ position: "absolute", left: BX, top: BY, ...browserIn(frame, 0) }}>
        <BrowserFrame url={`${brand.url}/inventario`} width={BW} height={BH}>
          <SiteHeader />
          <div style={{ display: "flex", gap: 16, padding: "22px 30px", alignItems: "flex-end", borderBottom: `1px solid ${theme.line}` }}>
            {fields.map((f, i) => (
              <Field key={f.label} label={f.label} value={frame >= f.at + 6 ? f.value : ""} active={i === active} width={FIELD_W} />
            ))}
            <div
              style={{
                width: 170,
                height: 52,
                borderRadius: 12,
                background: theme.accent,
                color: "white",
                fontFamily: theme.ui,
                fontWeight: 800,
                fontSize: 21,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon name="search" size={22} color="white" stroke={3} /> Buscar
            </div>
          </div>
          <div style={{ padding: "16px 30px 0", fontFamily: theme.ui, fontSize: 20, color: theme.muted }}>
            <span style={{ color: theme.text, fontWeight: 800 }}>{count.toLocaleString("en-US")}</span> vehículos encontrados
            {searched && <span style={{ marginLeft: 16, color: theme.accent2, fontWeight: 700 }}>· Toyota RAV4 · 2019–2023 · ≤ $18,000</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: "16px 30px" }}>
            {list.map((l, i) => (
              <ListingCard key={`${searched}-${i}`} l={l} appear={pop(frame, fps, listStart + i * 3, 16)} />
            ))}
          </div>
        </BrowserFrame>
      </div>
      <Cursor
        points={[
          { f: 6, x: 1200, y: 700 },
          ...fields.flatMap((f, i) => [
            { f: f.at - 8, x: fieldX(i), y: FIELD_Y },
            { f: f.at, x: fieldX(i) + 2, y: FIELD_Y + 2, click: true },
          ]),
          { f: tSearch - 8, x: BX + 30 + 4 * (FIELD_W + 16) + 85, y: FIELD_Y },
          { f: tSearch, x: BX + 30 + 4 * (FIELD_W + 16) + 87, y: FIELD_Y + 2, click: true },
          { f: tSearch + 40, x: BX + 640, y: CY + 480 },
        ]}
      />
      {fields.map((f) => (
        <SfxAt key={f.label} at={f.at} name="click" volume={0.5} />
      ))}
      <SfxAt at={tSearch} name="click" volume={0.5} />
      <SfxAt at={tSearch + 6} name="whoosh" volume={0.2} />
      <Illustrative />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- PASO 3
export const Step3: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = phraseAt(scene, "abre la ficha");
  const rowsAt = [
    phraseAt(scene, "millaje"),
    phraseAt(scene, "tipo de título"),
    phraseAt(scene, "daños reportados"),
    phraseAt(scene, "fecha de subasta"),
  ];
  const photosAt = phraseAt(scene, "fotos");
  const helpAt = phraseAt(scene, "¿Algo no está claro?");
  const row = rowsAt.reduce((acc, t, i) => (frame >= t ? i : acc), -1);
  const l = filtered[0];
  const bubble = pop(frame, fps, helpAt, 13);
  const photoFocus = frame >= photosAt && frame < rowsAt[0];

  return (
    <AbsoluteFill>
      <StepPanel n={3} title="Revisa la ficha" items={["Fotos", "Millaje y título", "Daños reportados", "Fecha de subasta"]} itemTimes={[photosAt, rowsAt[0], rowsAt[2], rowsAt[3]]} />
      <div style={{ position: "absolute", left: BX, top: BY, ...browserIn(frame, 0) }}>
        <BrowserFrame url={`${brand.url}/vehiculo/48213`} width={BW} height={BH}>
          {frame < open + 6 ? (
            <>
              <SiteHeader />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: "30px" }}>
                {filtered.map((x, i) => (
                  <ListingCard key={i} l={x} appear={1} highlight={i === 0 && frame > open - 10} />
                ))}
              </div>
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0 }}>
              <DetailPage l={l} rowHighlight={row} photoFocus={photoFocus} />
            </div>
          )}
        </BrowserFrame>
      </div>
      <Cursor
        points={[
          { f: 0, x: 1400, y: 760 },
          { f: open - 6, x: BX + 200, y: CY + 200 },
          { f: open, x: BX + 202, y: CY + 202, click: true },
          { f: open + 30, x: BX + 1150, y: CY + 600 },
        ]}
      />
      <SfxAt at={open} name="click" volume={0.5} />
      {rowsAt.map((t, i) => (
        <SfxAt key={i} at={t} name="pop" volume={0.3} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 640,
          opacity: Math.min(1, bubble * 1.4),
          transform: `translateY(${(1 - bubble) * 60}px) scale(${0.8 + 0.2 * bubble})`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "20px 28px",
          borderRadius: "28px 28px 8px 28px",
          background: theme.success,
          boxShadow: `0 20px 60px ${theme.success}55`,
          fontFamily: theme.display,
          fontWeight: 800,
          fontSize: 32,
          color: "#04130A",
        }}
      >
        <Icon name="headset" size={46} color="#04130A" stroke={2.4} />
        ¿Dudas? Lo analizamos contigo
      </div>
      <SfxAt at={helpAt} name="ding" volume={0.35} />
      <Illustrative />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- PASO 4
const BTN = { x: BX + 820, y: CY + 490 };

export const Step4: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clickAt = phraseAt(scene, "haz clic") + 14;
  const formAt = clickAt + 6;
  const tName = phraseAt(scene, "nombre");
  const tWa = phraseAt(scene, "WhatsApp");
  const tBudget = phraseAt(scene, "presupuesto y");
  const tWhen = phraseAt(scene, "cuándo quieres");
  const submitAt = tWhen + 26;
  const form = ease(frame, formAt, formAt + 14);
  const success = pop(frame, fps, submitAt + 6, 12);
  const l = filtered[0];

  const values = [
    { label: "Nombre", value: "María González", at: tName },
    { label: "WhatsApp", value: "+1 (832) 555-0147", at: tWa },
    { label: "Presupuesto", value: "$18,000", at: tBudget },
    { label: "¿Cuándo quieres comprar?", value: "En los próximos 30 días", at: tWhen },
  ];

  return (
    <AbsoluteFill>
      <StepPanel n={4} title={`Toca «${brand.ctaButton}»`} items={["Nombre", "WhatsApp", "Presupuesto", "¿Cuándo compras?"]} itemTimes={values.map((v) => v.at)} />
      <div style={{ position: "absolute", left: BX, top: BY, ...browserIn(frame, 0) }}>
        <BrowserFrame url={`${brand.url}/vehiculo/48213`} width={BW} height={BH}>
          <DetailPage l={l} rowHighlight={-1} buttonPulse={frame < clickAt ? (Math.sin(frame / 4) + 1) / 2 : 0} />
          <div style={{ position: "absolute", inset: 0, background: `rgba(3,6,12,${0.7 * form})` }} />
          <div
            style={{
              position: "absolute",
              left: 330,
              top: 34,
              width: 590,
              padding: "28px 34px",
              borderRadius: 22,
              background: theme.panel2,
              border: `1px solid rgba(255,255,255,0.15)`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              opacity: form,
              transform: `translateY(${(1 - form) * 80}px)`,
            }}
          >
            <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 30, color: theme.text }}>Solicita asesoría</div>
            <div style={{ fontFamily: theme.ui, fontSize: 18, color: theme.muted, marginTop: 4, marginBottom: 14 }}>
              {l.year} {l.make} {l.model} · Lote #48213
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {values.map((v, i) => (
                <Field
                  key={v.label}
                  label={v.label}
                  value={i === 3 ? (frame >= v.at + 6 ? v.value : "") : typed(v.value, frame, v.at, 34)}
                  active={frame >= v.at && frame < (values[i + 1]?.at ?? submitAt)}
                  placeholder="Selecciona…"
                />
              ))}
            </div>
            <div
              style={{
                marginTop: 18,
                height: 58,
                borderRadius: 14,
                background: frame >= submitAt ? theme.success : theme.accent,
                color: "white",
                fontFamily: theme.ui,
                fontWeight: 800,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {frame >= submitAt ? (
                <>
                  <Icon name="check" size={26} color="white" stroke={3} /> Enviado
                </>
              ) : (
                "Enviar"
              )}
            </div>
          </div>
        </BrowserFrame>
      </div>
      <Cursor
        points={[
          { f: 0, x: 1300, y: 900 },
          { f: clickAt - 8, x: BTN.x, y: BTN.y },
          { f: clickAt, x: BTN.x + 2, y: BTN.y + 2, click: true },
          { f: submitAt - 10, x: BX + 625, y: CY + 610 },
          { f: submitAt, x: BX + 627, y: CY + 612, click: true },
        ]}
      />
      <SfxAt at={clickAt} name="click" volume={0.5} />
      {values.slice(0, 3).map((v) => (
        <Typing key={v.label} at={v.at} frames={Math.ceil((v.value.length / 34) * 30)} volume={0.2} />
      ))}
      <SfxAt at={tWhen + 6} name="click" volume={0.4} />
      <SfxAt at={submitAt} name="click" volume={0.5} />
      <SfxAt at={submitAt + 6} name="ding" volume={0.45} />
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 40,
          ...popIn(success),
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "22px 30px",
          borderRadius: 22,
          background: theme.success,
          boxShadow: `0 20px 60px ${theme.success}66`,
          fontFamily: theme.display,
          fontWeight: 800,
          fontSize: 30,
          color: "#04130A",
        }}
      >
        <IconBadge name="check" color="#04130A" size={60} />
        ¡Listo! Un asesor te contactará
      </div>
      <Illustrative />
    </AbsoluteFill>
  );
};
