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
import { CarPhoto, useListings } from "../components/Site";
import { useT } from "../i18n";

const center: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  bottom: 190,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

// ---------------------------------------------------------------- ACOMPAÑAMIENTO + PLANES
export const Value: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const plansAt = phraseAt(scene, t("Empiezas gratis", "You start for free"));
  const stops: { at: number; icon: IconName; label: string }[] = [
    { at: phraseAt(scene, t("la puja", "the bid")), icon: "gavel", label: t("La puja", "The bid") },
    { at: phraseAt(scene, t("el pago", "the payment")), icon: "dollar", label: t("El pago", "Payment") },
    { at: phraseAt(scene, t("la documentación", "the paperwork")), icon: "doc", label: t("La documentación", "Paperwork") },
    { at: phraseAt(scene, t("el traslado", "the shipping")), icon: "truck", label: t("El traslado", "Shipping") },
  ];
  const xs = [330, 750, 1170, 1590];
  const ROAD_Y = 610;
  const carX = interpolate(frame, [0, ...stops.map((s) => s.at + 10), plansAt + 6], [60, ...xs.map((x) => x - 170), 1720], clamp);
  const plans = [
    {
      at: plansAt,
      eyebrow: t("EMPIEZA AQUÍ", "START HERE"),
      name: t("Gratis", "Free"),
      price: t("US$0", "$0"),
      sub: t("Explora y prepara tu compra.", "Explore and plan your purchase."),
      perks: [t("Inventario de vehículos", "Vehicle inventory"), t("Favoritos en tu cuenta", "Saved favorites in your account"), t("Atención personalizada", "Personalized support")],
      hl: false,
    },
    {
      at: phraseAt(scene, t("APV Plus", "APV Plus")),
      eyebrow: t("PARA TU PRÓXIMA COMPRA", "FOR YOUR NEXT PURCHASE"),
      name: "APV Plus",
      price: t("US$97/año", "$97/yr"),
      sub: t("Ahorro y orientación para tu compra.", "Savings and guidance for your purchase."),
      perks: [t("US$100 menos en tarifas de APV por vehículo", "$100 off APV fees per vehicle"), t("Reporte del historial elaborado por APV", "Vehicle history report by APV"), t("Asesoría de 20 min incluida", "20-min consultation included")],
      hl: true,
    },
    {
      at: phraseAt(scene, t("Premium", "Premium")),
      eyebrow: t("MÁS ACOMPAÑAMIENTO", "MORE SUPPORT"),
      name: "APV Premium",
      price: t("US$297/año", "$297/yr"),
      sub: t("Mayor descuento y una asesoría completa.", "Bigger discount and a full consultation."),
      perks: [t("Mayor descuento en tarifas APV", "Bigger discount on APV fees"), t("Reporte del historial elaborado por APV", "Vehicle history report by APV"), t("Asesoría completa incluida", "Full consultation included")],
      hl: false,
    },
  ];

  return (
    <AbsoluteFill>
      <Beat from={0} to={plansAt + 2}>
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Kicker color={theme.success}>{t("Te acompañamos", "We're with you")}</Kicker>
          <div style={{ height: 24 }} />
          <Kinetic text={t("Desde ahí, *no* *estás* *solo*", "From there, *you're* *not* *alone*")} size={92} highlight={theme.success} />
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: ROAD_Y + 60, height: 14, borderRadius: 7, background: theme.line }} />
        <div
          style={{
            position: "absolute",
            left: 120,
            top: ROAD_Y + 60,
            height: 14,
            borderRadius: 7,
            width: Math.max(0, Math.min(1680, carX + 200 - 120)),
            background: `linear-gradient(90deg, ${theme.success}00, ${theme.success})`,
          }}
        />
        {stops.map((s, i) => {
          const p = pop(frame, fps, s.at);
          const done = frame >= s.at;
          return (
            <div key={i} style={{ position: "absolute", left: xs[i] - 160, width: 320, top: ROAD_Y - 190, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ ...popIn(Math.max(0.35, p)), opacity: done ? 1 : 0.35 }}>
                <IconBadge name={s.icon} color={done ? theme.success : theme.muted} size={120} />
              </div>
              <div style={{ height: 150 }} />
              <div style={{ ...fadeUp(p, 20), fontFamily: theme.display, fontWeight: 800, fontSize: 34, letterSpacing: "-0.02em", color: theme.text, textAlign: "center" }}>{s.label}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: carX, top: ROAD_Y - 30 }}>
          <Car kind="suv" color={theme.accent} width={230} wheelSpin={frame * 12} />
        </div>
        {stops.map((s, i) => (
          <SfxAt key={i} at={s.at} name="pop" volume={0.4} />
        ))}
      </Beat>

      <Beat from={plansAt}>
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Kicker>{t("Membresías APV Motors", "APV Motors memberships")}</Kicker>
          <div style={{ height: 20 }} />
          <Kinetic text={t("Empieza *gratis*", "Start for *free*")} size={84} />
        </div>
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 34, alignItems: "flex-start" }}>
          {plans.map((pl) => {
            const p = pop(frame, fps, pl.at);
            return (
              <div key={pl.name} style={{ ...fadeUp(p, 60), opacity: Math.min(1, p * 1.4) }}>
                <Card glow={pl.hl ? theme.accent : undefined} style={{ width: 500, padding: "28px 30px", fontFamily: theme.ui, border: pl.hl ? `2px solid ${theme.accent}` : undefined }}>
                  <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.11em", color: pl.hl ? theme.accent : theme.muted }}>{pl.eyebrow}</div>
                  <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-0.04em", color: theme.text, marginTop: 6 }}>{pl.name}</div>
                  <div style={{ fontSize: 20, color: theme.slate, marginTop: 4 }}>{pl.sub}</div>
                  <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.04em", color: pl.hl ? theme.accent : theme.text, marginTop: 14 }}>{pl.price}</div>
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    {pl.perks.map((k) => (
                      <div key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 19, fontWeight: 600, color: theme.ink2 }}>
                        <Icon name="check" size={24} color={theme.success} stroke={3} />
                        {k}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
        {plans.map((pl) => (
          <SfxAt key={pl.name} at={pl.at - plansAt} name="pop" volume={0.4} />
        ))}
      </Beat>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CALIFICACIÓN
export const Qualify: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const t1 = phraseAt(scene, t("esto no es para todo el mundo", "this isn't for everyone"));
  const t2 = phraseAt(scene, t("Es para ti si", "It's for you if"));
  const yes = [
    { at: phraseAt(scene, t("tienes tu presupuesto listo", "you have your budget ready")), text: t("Tienes tu presupuesto listo", "Your budget is ready") },
    { at: phraseAt(scene, t("piensas comprar", "plan to buy")), text: t("Compras en los próximos 30–60 días", "You'll buy in the next 30–60 days") },
    { at: phraseAt(scene, t("quieres el precio justo", "want a fair price")), text: t("Quieres el precio justo con alguien de confianza", "You want a fair price with someone you trust") },
  ];
  const noAt = phraseAt(scene, t("Si solo estás curioseando", "If you're just browsing"));

  return (
    <AbsoluteFill>
      <Beat from={0} to={t2 + 2}>
        <div style={center}>
          <Kicker color={theme.accent2}>{t("Seamos honestos", "Let's be honest")}</Kicker>
          <div style={{ height: 40 }} />
          <Kinetic text={t("Esto *NO* es para todo el mundo", "This is *NOT* for everyone")} size={116} delay={t1} />
        </div>
      </Beat>
      <Beat from={t2}>
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Kinetic text={t("¿Es para *ti?*", "Is it for *you?*")} size={96} highlight={theme.accent2} />
        </div>
        <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
          <div style={fadeUp(pop(frame, fps, t2 + 4), 60)}>
            <Card glow={theme.success} style={{ width: 960, padding: "36px 44px" }}>
              <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 38, color: theme.success, marginBottom: 20, letterSpacing: 2 }}>{t("SÍ ES PARA TI SI…", "IT'S FOR YOU IF…")}</div>
              {yes.map((y, i) => {
                const p = pop(frame, fps, y.at);
                return (
                  <div key={i} style={{ ...fadeUp(p, 24), display: "flex", alignItems: "center", gap: 22, padding: "14px 0", fontFamily: theme.ui, fontWeight: 700, fontSize: 36, color: theme.text }}>
                    <span style={{ ...popIn(p), width: 58, height: 58, borderRadius: 29, background: theme.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="check" size={36} color="#FFFFFF" stroke={3.2} />
                    </span>
                    {y.text}
                  </div>
                );
              })}
            </Card>
          </div>
          <div style={fadeUp(pop(frame, fps, noAt - 6), 60)}>
            <Card glow={theme.accent} style={{ width: 600, padding: "36px 44px", opacity: frame >= noAt - 6 ? 1 : 0 }}>
              <div style={{ fontFamily: theme.display, fontWeight: 900, fontSize: 38, color: theme.accent, marginBottom: 20, letterSpacing: 2 }}>{t("NO ES PARA TI SI…", "NOT FOR YOU IF…")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "14px 0", fontFamily: theme.ui, fontWeight: 700, fontSize: 36, color: theme.text }}>
                <span style={{ ...popIn(pop(frame, fps, noAt)), width: 58, height: 58, borderRadius: 29, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="x" size={34} color="white" stroke={3.2} />
                </span>
                {t("Solo estás curioseando", "You're just browsing")}
              </div>
              <div style={{ fontFamily: theme.ui, fontSize: 26, color: theme.muted, marginTop: 10 }}>{t("Este no es el momento.", "Now isn't the time.")}</div>
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
  const t = useT();
  const t1 = phraseAt(scene, t("No necesitas experiencia", "You don't need any experience"));
  const t2 = phraseAt(scene, t("Para eso está tu asesor", "That's what your advisor is for"));
  return (
    <AbsoluteFill>
      <div style={center}>
        <div style={{ transform: `translateY(${interpolate(ease(frame, t1 - 4, t1 + 10), [0, 1], [0, -40])}px)` }}>
          <Kinetic text={t("¿Nunca has comprado en subasta?", "Never bought at an auction?")} size={92} />
        </div>
        <div style={{ height: 30 }} />
        <div style={{ opacity: frame >= t1 ? 1 : 0 }}>
          <Kinetic text={t("*No* *necesitas* *experiencia.*", "*No* *experience* *needed.*")} size={84} delay={t1} highlight={theme.accent2} />
        </div>
        <div style={{ ...popIn(pop(frame, fps, t2)), marginTop: 50, display: "flex", alignItems: "center", gap: 24, padding: "22px 40px", borderRadius: 999, background: `${theme.success}22`, border: `2px solid ${theme.success}` }}>
          <Icon name="headset" size={56} color={theme.success} />
          <span style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 48, color: theme.text }}>{t("Para eso está tu asesor", "That's what your advisor is for")}</span>
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
  const t = useT();
  const listings = useListings();
  const soldAt = phraseAt(scene, t("puede venderse mañana", "could be sold tomorrow"));
  const goAt = phraseAt(scene, t("Entra ahora", "Go to cars.apvmotorusa.com now"));
  const chips = [
    { at: goAt, label: t("Entra", "Visit"), icon: "globe" as IconName },
    { at: phraseAt(scene, t("crea tu cuenta gratis", "create your free account")), label: t("Crea tu cuenta gratis", "Create your free account"), icon: "user" as IconName },
    { at: phraseAt(scene, t("crea tu cuenta gratis", "create your free account")) + 20, label: t("Te atiende un asesor", "Meet your advisor"), icon: "headset" as IconName },
  ];
  const days = [t("LUN", "MON"), t("MAR", "TUE"), t("MIÉ", "WED"), t("JUE", "THU"), t("VIE", "FRI"), t("SÁB", "SAT"), t("DOM", "SUN")];
  const auctionDays = [0, 1, 2, 3, 4];
  const stamp = pop(frame, fps, soldAt + 12, 9);
  const pulse = (Math.sin(frame / 5) + 1) / 2;

  return (
    <AbsoluteFill>
      <Beat from={0} to={goAt + 2}>
        <div style={{ ...center, flexDirection: "row", gap: 80 }}>
          <div>
            <Kicker color={theme.accent2}>{t("No esperes demasiado", "Don't wait too long")}</Kicker>
            <div style={{ height: 30 }} />
            <Kinetic text={t("Las subastas se mueven *cada* *semana*", "Auctions move *every* *week*")} size={78} align="left" highlight={theme.accent2} style={{ width: 760 }} />
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
              <div style={{ filter: `grayscale(${stamp})` }}>
                <CarPhoto l={listings[0]} width={560} height={250} radius={0} />
              </div>
              <div style={{ padding: "18px 26px", fontFamily: theme.ui }}>
                <div style={{ fontWeight: 800, fontSize: 30, color: theme.text }}>{t("El carro que te gusta hoy…", "The car you like today…")}</div>
                <div style={{ fontSize: 24, color: theme.muted, marginTop: 6 }}>{t("…puede venderse mañana.", "…could be sold tomorrow.")}</div>
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
                background: "rgba(255,255,255,0.94)",
                transform: `rotate(-14deg) scale(${2.4 - 1.4 * stamp})`,
                opacity: stamp,
              }}
            >
              {t("VENDIDO", "SOLD")}
            </div>
          </div>
        </div>
        <SfxAt at={soldAt + 12} name="whoosh" volume={0.35} />
      </Beat>

      <Beat from={goAt}>
        <div style={center}>
          <Kinetic text={t("Entra *ahora*", "Visit *now*")} size={110} />
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
  const t = useT();
  const guideAt = phraseAt(scene, t("te guiará", "guide you"));
  const endAt = scene.voFrames + 6;
  const bubbles = [
    { at: 8, text: t("¡Hola! Soy tu asesor de APV Motors.", "Hi! I'm your APV Motors advisor.") },
    { at: phraseAt(scene, t("te atenderá", "will assist you")), text: t("Te atiendo personalmente.", "I'll assist you personally.") },
    { at: guideAt, text: t("Y te guío paso a paso en tu compra.", "And guide you step by step.") },
  ];
  const online = (Math.sin(frame / 6) + 1) / 2;

  return (
    <AbsoluteFill>
      <Beat from={0} to={endAt + 4}>
        <div style={{ ...center, flexDirection: "row", gap: 90 }}>
          <div style={{ width: 640 }}>
            <Kicker color={theme.success}>{t("Atención personalizada", "Personalized support")}</Kicker>
            <div style={{ height: 30 }} />
            <Kinetic text={t("Un *asesor* te atenderá y te *guiará* en tu compra", "An *advisor* will assist and *guide* you through your purchase")} size={78} align="left" highlight={theme.success} />
          </div>
          <div style={popIn(pop(frame, fps, 2))}>
            <Card glow={theme.success} style={{ width: 720, padding: 34 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 22, borderBottom: `1px solid ${theme.line}` }}>
                <div style={{ width: 86, height: 86, borderRadius: 43, background: `linear-gradient(135deg, ${theme.success}, #15803D)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="headset" size={50} color="white" />
                </div>
                <div style={{ fontFamily: theme.ui }}>
                  <div style={{ fontWeight: 800, fontSize: 32, color: theme.text }}>{t("Tu asesor APV", "Your APV advisor")}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, color: theme.success, marginTop: 4 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 6, background: theme.success, boxShadow: `0 0 ${6 + online * 10}px ${theme.success}` }} />{t(" En línea", " Online")}
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
  const t = useT();
  const pulse = (Math.sin(frame / 6) + 1) / 2;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={popIn(pop(frame, fps, start))}>
        <Logo height={200} />
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
        {t("Un asesor te atenderá y te guiará en tu compra", "An advisor will assist and guide you through your purchase")}
      </div>
      <div style={{ ...fadeUp(pop(frame, fps, start + 22), 30), marginTop: 22, display: "flex", alignItems: "center", gap: 14, fontFamily: theme.ui, fontSize: 30, color: theme.muted }}>
        <Icon name="pin" size={32} color={theme.muted} /> {brand.location}{t(" · Subastas de Copart en todo EE. UU.", " · Copart auctions across the U.S.")}
      </div>
      <div style={{ position: "absolute", bottom: 40, fontFamily: theme.ui, fontSize: 18, color: theme.muted, opacity: interpolate(frame, [start + 20, start + 40], [0, 0.8], clamp) }}>
        {t("Vehículos, precios e interfaz mostrados con fines ilustrativos.", "Vehicles, prices and interface shown for illustrative purposes.")}
      </div>
    </div>
  );
};
