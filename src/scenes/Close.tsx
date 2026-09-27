import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, theme } from "../theme";
import { phraseAt, TimedScene } from "../timeline";
import { Car } from "../components/Car";
import { Icon, IconName } from "../components/Icons";
import { Cursor, Logo } from "../components/Browser";
import { Beat, SfxAt } from "../components/Shell";
import { Card, IconBadge, Kicker, Kinetic } from "../components/Ui";
import { clamp, ease, fadeUp, pop, popIn } from "../components/motion";
import { filtered } from "../components/Site";

const center: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  bottom: 190,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

// ---------------------------------------------------------------- ACOMPAÑAMIENTO
export const Value: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stops: { at: number; icon: IconName; label: string }[] = [
    { at: phraseAt(scene, "revisamos el historial"), icon: "history", label: "Historial del vehículo" },
    { at: phraseAt(scene, "calculamos el costo total"), icon: "calculator", label: "Costo total antes de pujar" },
    { at: phraseAt(scene, "manejamos pago"), icon: "doc", label: "Pago y documentos" },
    { at: phraseAt(scene, "coordinamos la entrega"), icon: "truck", label: "Entrega coordinada" },
  ];
  const xs = [330, 750, 1170, 1590];
  const ROAD_Y = 610;
  const carX = interpolate(
    frame,
    [0, ...stops.map((s) => s.at + 10), scene.duration],
    [60, ...xs.map((x) => x - 170), 1720],
    { ...clamp },
  );

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Kicker color={theme.success}>Acompañamiento total</Kicker>
        <div style={{ height: 24 }} />
        <Kinetic text="Desde ahí, *no* *estás* *solo*" size={92} highlight={theme.success} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: ROAD_Y + 60, height: 14, borderRadius: 7, background: "#1E293B" }} />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: ROAD_Y + 60,
          height: 14,
          borderRadius: 7,
          width: Math.max(0, carX + 200 - 120),
          background: `linear-gradient(90deg, ${theme.success}00, ${theme.success})`,
        }}
      />
      {stops.map((s, i) => {
        const p = pop(frame, fps, s.at);
        const done = frame >= s.at;
        return (
          <div key={i} style={{ position: "absolute", left: xs[i] - 160, width: 320, top: ROAD_Y - 190, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ ...popIn(Math.max(0.35, p)), filter: done ? undefined : "grayscale(1)", opacity: done ? 1 : 0.35 }}>
              <IconBadge name={s.icon} color={done ? theme.success : theme.muted} size={120} />
            </div>
            <div style={{ height: 150 }} />
            <div style={{ ...fadeUp(p, 20), fontFamily: theme.display, fontWeight: 800, fontSize: 32, color: theme.text, textAlign: "center", lineHeight: 1.15 }}>{s.label}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: carX, top: ROAD_Y - 30 }}>
        <Car kind="suv" color={theme.accent} width={230} wheelSpin={frame * 12} />
      </div>
      {stops.map((s, i) => (
        <SfxAt key={i} at={s.at} name="pop" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CALIFICACIÓN
export const Qualify: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = phraseAt(scene, "esto no es para todo el mundo");
  const t2 = phraseAt(scene, "Es para ti si");
  const yes = [
    { at: phraseAt(scene, "tienes tu presupuesto listo"), text: "Tienes tu presupuesto listo" },
    { at: phraseAt(scene, "piensas comprar"), text: "Compras en los próximos 30–60 días" },
    { at: phraseAt(scene, "quieres el precio justo"), text: "Quieres el precio justo con alguien de confianza" },
  ];
  const noAt = phraseAt(scene, "Si solo estás curioseando");

  return (
    <AbsoluteFill>
      <Beat from={0} to={t2 + 2}>
        <div style={center}>
          <Kicker color={theme.accent2}>Seamos honestos</Kicker>
          <div style={{ height: 40 }} />
          <Kinetic text="Esto *NO* es para todo el mundo" size={116} delay={t1} />
        </div>
      </Beat>
      <Beat from={t2}>
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Kinetic text="¿Es para *ti?*" size={96} highlight={theme.accent2} />
        </div>
        <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
          <div style={fadeUp(pop(frame, fps, t2 + 4), 60)}>
            <Card glow={theme.success} style={{ width: 960, padding: "36px 44px" }}>
              <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 38, color: theme.success, marginBottom: 20, letterSpacing: 2 }}>SÍ ES PARA TI SI…</div>
              {yes.map((y, i) => {
                const p = pop(frame, fps, y.at);
                return (
                  <div key={i} style={{ ...fadeUp(p, 24), display: "flex", alignItems: "center", gap: 22, padding: "14px 0", fontFamily: theme.ui, fontWeight: 700, fontSize: 36, color: theme.text }}>
                    <span style={{ ...popIn(p), width: 58, height: 58, borderRadius: 29, background: theme.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="check" size={36} color="#04130A" stroke={3.2} />
                    </span>
                    {y.text}
                  </div>
                );
              })}
            </Card>
          </div>
          <div style={fadeUp(pop(frame, fps, noAt - 6), 60)}>
            <Card glow={theme.accent} style={{ width: 600, padding: "36px 44px", opacity: frame >= noAt - 6 ? 1 : 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 38, color: theme.accent, marginBottom: 20, letterSpacing: 2 }}>NO ES PARA TI SI…</div>
              <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "14px 0", fontFamily: theme.ui, fontWeight: 700, fontSize: 36, color: theme.text }}>
                <span style={{ ...popIn(pop(frame, fps, noAt)), width: 58, height: 58, borderRadius: 29, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="x" size={34} color="white" stroke={3.2} />
                </span>
                Solo estás curioseando
              </div>
              <div style={{ fontFamily: theme.ui, fontSize: 26, color: theme.muted, marginTop: 10 }}>Este no es el momento.</div>
            </Card>
          </div>
        </div>
        {yes.map((y, i) => (
          <SfxAt key={i} at={y.at - t2} name="pop" volume={0.45} />
        ))}
        <SfxAt at={noAt - t2} name="pop" volume={0.35} />
      </Beat>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- OBJECIÓN
export const Objection: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = phraseAt(scene, "No necesitas experiencia");
  const t2 = phraseAt(scene, "Para eso está tu asesor");
  return (
    <AbsoluteFill>
      <div style={center}>
        <div style={{ transform: `translateY(${interpolate(ease(frame, t1 - 4, t1 + 10), [0, 1], [0, -40])}px)` }}>
          <Kinetic text="¿Nunca has comprado en subasta?" size={92} />
        </div>
        <div style={{ height: 30 }} />
        <div style={{ opacity: frame >= t1 ? 1 : 0 }}>
          <Kinetic text="*No* *necesitas* *experiencia.*" size={84} delay={t1} highlight={theme.accent2} />
        </div>
        <div style={{ ...popIn(pop(frame, fps, t2)), marginTop: 50, display: "flex", alignItems: "center", gap: 24, padding: "22px 40px", borderRadius: 999, background: `${theme.success}22`, border: `2px solid ${theme.success}` }}>
          <Icon name="headset" size={56} color={theme.success} />
          <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 48, color: theme.text }}>Para eso está tu asesor</span>
        </div>
      </div>
      <SfxAt at={t2} name="pop" volume={0.45} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CTA
export const Cta: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const soldAt = phraseAt(scene, "puede venderse mañana");
  const goAt = phraseAt(scene, "Entra ahora");
  const chips = [
    { at: goAt, label: "Entra", icon: "globe" as IconName },
    { at: phraseAt(scene, "elige tu vehículo"), label: "Elige tu vehículo", icon: "car" as IconName },
    { at: phraseAt(scene, "deja tus datos"), label: "Deja tus datos", icon: "chat" as IconName },
  ];
  const days = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const auctionDays = [0, 1, 2, 3, 4];
  const stamp = pop(frame, fps, soldAt + 12, 9);
  const pulse = (Math.sin(frame / 5) + 1) / 2;

  return (
    <AbsoluteFill>
      <Beat from={0} to={goAt + 2}>
        <div style={{ ...center, flexDirection: "row", gap: 80 }}>
          <div>
            <Kicker color={theme.accent2}>No esperes demasiado</Kicker>
            <div style={{ height: 30 }} />
            <Kinetic text="Las subastas se mueven *cada* *semana*" size={78} align="left" highlight={theme.accent2} style={{ width: 760 }} />
            <div style={{ display: "flex", gap: 12, marginTop: 44 }}>
              {days.map((d, i) => {
                const p = pop(frame, fps, 14 + i * 3);
                const has = auctionDays.includes(i);
                return (
                  <div
                    key={d}
                    style={{
                      ...popIn(p),
                      width: 96,
                      height: 110,
                      borderRadius: 16,
                      background: has ? `${theme.accent2}1f` : theme.panel,
                      border: `1.5px solid ${has ? theme.accent2 + "88" : theme.line}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      fontFamily: theme.display,
                      fontWeight: 800,
                      fontSize: 22,
                      color: has ? theme.text : theme.muted,
                    }}
                  >
                    {d}
                    {has && <Icon name="gavel" size={34} color={theme.accent2} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ position: "relative", ...popIn(pop(frame, fps, soldAt - 16)) }}>
            <Card style={{ width: 560, overflow: "hidden" }}>
              <div style={{ height: 250, background: `radial-gradient(circle at 50% 70%, ${filtered[0].color}33, #0B1324 70%)`, display: "flex", alignItems: "center", justifyContent: "center", filter: `grayscale(${stamp})` }}>
                <Car kind="suv" color={filtered[0].color} width={430} />
              </div>
              <div style={{ padding: "18px 26px", fontFamily: theme.ui }}>
                <div style={{ fontWeight: 800, fontSize: 30, color: theme.text }}>El carro que te gusta hoy…</div>
                <div style={{ fontSize: 24, color: theme.muted, marginTop: 6 }}>…puede venderse mañana.</div>
              </div>
            </Card>
            <div
              style={{
                position: "absolute",
                top: 80,
                left: 90,
                padding: "12px 34px",
                border: `7px solid ${theme.accent}`,
                borderRadius: 16,
                color: theme.accent,
                fontFamily: theme.display,
                fontWeight: 900,
                fontSize: 68,
                letterSpacing: 4,
                background: "rgba(6,10,19,0.75)",
                transform: `rotate(-14deg) scale(${2.4 - 1.4 * stamp})`,
                opacity: stamp,
              }}
            >
              VENDIDO
            </div>
          </div>
        </div>
        <SfxAt at={soldAt + 12} name="whoosh" volume={0.35} />
      </Beat>

      <Beat from={goAt}>
        <div style={center}>
          <Kinetic text="Entra *ahora*" size={110} />
          <div
            style={{
              ...popIn(pop(frame, fps, goAt + 6)),
              marginTop: 40,
              padding: "30px 64px",
              borderRadius: 999,
              background: `linear-gradient(135deg, ${theme.accent}, #C8141F)`,
              boxShadow: `0 0 ${50 + pulse * 50}px ${theme.accent}99`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontFamily: theme.display,
              fontWeight: 900,
              fontSize: 68,
              color: "white",
            }}
          >
            {brand.url}
            <Icon name="arrow" size={64} color="white" stroke={3} />
          </div>
          <div style={{ display: "flex", gap: 22, marginTop: 50, alignItems: "center" }}>
            {chips.map((c, i) => {
              const p = pop(frame, fps, c.at);
              return (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 22 }}>
                  <div
                    style={{
                      ...popIn(p),
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 28px",
                      borderRadius: 18,
                      background: theme.panel2,
                      border: `1.5px solid ${theme.success}77`,
                      fontFamily: theme.ui,
                      fontWeight: 700,
                      fontSize: 32,
                      color: theme.text,
                    }}
                  >
                    <span style={{ color: theme.success, fontFamily: theme.display, fontWeight: 900 }}>{i + 1}</span>
                    <Icon name={c.icon} size={34} color={theme.success} />
                    {c.label}
                  </div>
                  {i < chips.length - 1 && <div style={{ opacity: p }}><Icon name="arrow" size={36} color={theme.muted} /></div>}
                </div>
              );
            })}
          </div>
        </div>
        {chips.map((c) => (
          <SfxAt key={c.label} at={c.at - goAt} name="pop" volume={0.4} />
        ))}
        <Cursor
          points={[
            { f: 10, x: 1500, y: 900 },
            { f: 40, x: 1250, y: 470 },
            { f: 46, x: 1252, y: 472, click: true },
          ]}
        />
        <SfxAt at={46} name="click" volume={0.5} />
      </Beat>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ASESOR + CIERRE
export const Advisor: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const guideAt = phraseAt(scene, "te guiará");
  const endAt = scene.voFrames + 6;
  const bubbles = [
    { at: 8, text: "¡Hola! Soy tu asesor de APV Motors." },
    { at: phraseAt(scene, "te atenderá") , text: "Te atiendo personalmente." },
    { at: guideAt, text: "Y te guío paso a paso en tu compra." },
  ];
  const online = (Math.sin(frame / 6) + 1) / 2;

  return (
    <AbsoluteFill>
      <Beat from={0} to={endAt + 4}>
        <div style={{ ...center, flexDirection: "row", gap: 90 }}>
          <div style={{ width: 640 }}>
            <Kicker color={theme.success}>Atención personalizada</Kicker>
            <div style={{ height: 30 }} />
            <Kinetic text="Un *asesor* te atenderá y te *guiará* en tu compra" size={78} align="left" highlight={theme.success} />
          </div>
          <div style={popIn(pop(frame, fps, 2))}>
            <Card glow={theme.success} style={{ width: 720, padding: 34 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 22, borderBottom: `1px solid ${theme.line}` }}>
                <div style={{ width: 86, height: 86, borderRadius: 43, background: `linear-gradient(135deg, ${theme.success}, #15803D)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="headset" size={50} color="white" />
                </div>
                <div style={{ fontFamily: theme.ui }}>
                  <div style={{ fontWeight: 800, fontSize: 32, color: theme.text }}>Tu asesor APV</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, color: theme.success, marginTop: 4 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 6, background: theme.success, boxShadow: `0 0 ${6 + online * 10}px ${theme.success}` }} /> En línea
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
                {bubbles.map((b, i) => {
                  const p = pop(frame, fps, b.at, 13);
                  return (
                    <div
                      key={i}
                      style={{
                        ...fadeUp(p, 30),
                        alignSelf: "flex-start",
                        padding: "18px 26px",
                        borderRadius: "8px 26px 26px 26px",
                        background: theme.panel,
                        border: `1px solid ${theme.line}`,
                        fontFamily: theme.ui,
                        fontWeight: 600,
                        fontSize: 30,
                        color: theme.text,
                      }}
                    >
                      {b.text}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
        {bubbles.map((b, i) => (
          <SfxAt key={i} at={b.at} name="pop" volume={0.4} />
        ))}
      </Beat>

      <Beat from={endAt}>
        <EndCard start={0} />
        <SfxAt at={0} name="ding" volume={0.4} />
      </Beat>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = (Math.sin(frame / 6) + 1) / 2;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={popIn(pop(frame, fps, start))}>
        <Logo size={100} />
      </div>
      <div
        style={{
          ...popIn(pop(frame, fps, start + 8)),
          marginTop: 50,
          padding: "26px 60px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${theme.accent}, #C8141F)`,
          boxShadow: `0 0 ${40 + pulse * 50}px ${theme.accent}99`,
          fontFamily: theme.display,
          fontWeight: 900,
          fontSize: 64,
          color: "white",
        }}
      >
        {brand.url}
      </div>
      <div style={{ ...fadeUp(pop(frame, fps, start + 16), 30), marginTop: 44, fontFamily: theme.display, fontWeight: 800, fontSize: 44, color: theme.text, textAlign: "center" }}>
        Un asesor te atenderá y te guiará en tu compra
      </div>
      <div style={{ ...fadeUp(pop(frame, fps, start + 22), 30), marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontFamily: theme.ui, fontSize: 30, color: theme.muted }}>
        <Icon name="pin" size={32} color={theme.muted} /> {brand.location} · Compras en subastas de todo EE.UU.
      </div>
      <div style={{ position: "absolute", bottom: 40, fontFamily: theme.ui, fontSize: 18, color: theme.muted, opacity: interpolate(frame, [start + 20, start + 40], [0, 0.8], clamp) }}>
        Vehículos, precios e interfaz mostrados con fines ilustrativos.
      </div>
    </div>
  );
};
