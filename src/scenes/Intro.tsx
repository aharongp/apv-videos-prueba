import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, theme } from "../theme";
import { phraseAt, TimedScene } from "../timeline";
import { Car } from "../components/Car";
import { Icon } from "../components/Icons";
import { Beat, SfxAt, Typing } from "../components/Shell";
import { Card, IconBadge, Kicker, Kinetic } from "../components/Ui";
import { clamp, ease, pop, popIn } from "../components/motion";
import { Logo, typed } from "../components/Browser";
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

// ---------------------------------------------------------------- GANCHO
export const Hook: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const b1 = phraseAt(scene, t("muchos de los carros", "a lot of the cars"));
  const b2 = phraseAt(scene, t("Y el precio", "And the price"));
  const b3 = phraseAt(scene, t("Hoy vas a ver", "Today you'll see"));

  const cars: { kind: "sedan" | "suv" | "pickup"; color: string }[] = [
    { kind: "suv", color: "#334155" },
    { kind: "sedan", color: "#EF4444" },
    { kind: "pickup", color: "#60A5FA" },
  ];

  return (
    <AbsoluteFill>
      <Beat from={0} to={b1 + 4}>
        <div style={center}>
          <Kicker>{t("Lo que nadie te cuenta", "What nobody tells you")}</Kicker>
          <div style={{ height: 40 }} />
          <Kinetic text={t("Lo que el *DEALER* no te dice", "What the *DEALER* won't tell you")} size={118} stagger={4} />
          <div style={{ marginTop: 36, width: interpolate(frame, [10, 40], [0, 700], clamp), height: 8, borderRadius: 4, background: theme.accent }} />
        </div>
      </Beat>

      <Beat from={b1} to={b2 + 4}>
        <div style={{ ...center, justifyContent: "flex-start", paddingTop: 150 }}>
          <Kinetic text={t("Muchos de sus carros salieron de una *subasta*", "Many of their cars came from an *auction*")} size={78} stagger={2} />
          <div style={{ display: "flex", gap: 40, marginTop: 90 }}>
            {cars.map((c, i) => {
              const p = pop(frame, fps, b1 + 6 + i * 7);
              const stamp = pop(frame, fps, b1 + 34 + i * 8, 9);
              return (
                <div key={i} style={{ position: "relative", transform: `translateX(${(1 - p) * 600}px)`, opacity: Math.min(1, p * 1.5) }}>
                  <div
                    style={{
                      margin: "0 auto 14px",
                      width: 190,
                      textAlign: "center",
                      padding: "8px 0",
                      borderRadius: 10,
                      background: theme.panel2,
                      border: `1px solid ${theme.line}`,
                      fontFamily: theme.display,
                      fontWeight: 800,
                      fontSize: 24,
                      color: theme.muted,
                    }}
                  >
                    DEALER LOT
                  </div>
                  <Car kind={c.kind} color={c.color} width={470} />
                  <div
                    style={{
                      position: "absolute",
                      top: 40,
                      right: 10,
                      padding: "10px 20px",
                      border: `5px solid ${theme.accent2}`,
                      color: theme.accent2,
                      borderRadius: 12,
                      fontFamily: theme.display,
                      fontWeight: 900,
                      fontSize: 30,
                      transform: `rotate(-12deg) scale(${2.2 - 1.2 * stamp})`,
                      opacity: stamp,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "rgba(255,255,255,0.94)",
                    }}
                  >
                    <Icon name="gavel" size={32} color={theme.accent2} stroke={2.5} />{t(" DE SUBASTA", " FROM AUCTION")}
                  </div>
                </div>
              );
            })}
          </div>
          {cars.map((_, i) => (
            <SfxAt key={i} at={34 + i * 8} name="pop" volume={0.4} />
          ))}
        </div>
      </Beat>

      <Beat from={b2} to={b3 + 4}>
        <PriceStack />
      </Beat>

      <Beat from={b3}>
        <div style={center}>
          <div style={{ ...popIn(pop(frame, fps, b3)), marginBottom: 40 }}>
            <IconBadge name="gavel" color={theme.accent} size={140} />
          </div>
          <Kinetic text={t("¿Y si compras *donde* *compra* *el* *dealer?*", "What if you bought *where* *the* *dealer* *buys?*")} size={104} delay={6} highlight={theme.accent} />
          <div style={{ ...popIn(pop(frame, fps, phraseAt(scene, t("sin licencia", "no dealer license")))), marginTop: 40 }}>
            <Kicker color={theme.success}>{t("Sin licencia de dealer", "No dealer license needed")}</Kicker>
          </div>
        </div>
        <SfxAt at={0} name="whoosh" volume={0.3} />
      </Beat>
    </AbsoluteFill>
  );
};

const PriceStack: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const start = 0;
  const base = ease(frame, start + 6, start + 26);
  const margin = ease(frame, start + 26, start + 50);
  const H = 520;
  return (
    <div style={{ ...center, flexDirection: "row", gap: 110 }}>
      <div style={{ width: 640 }}>
        <Kinetic text={t("Y el precio que *tú* *pagas* incluye su ganancia", "And the price *you* *pay* includes their profit")} size={76} align="left" delay={start} stagger={2} />
      </div>
      <div style={{ position: "relative", height: H, width: 560, display: "flex", alignItems: "flex-end", gap: 30 }}>
        <div style={{ width: 240, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: H }}>
          <div
            style={{
              height: H * 0.34 * margin,
              background: `repeating-linear-gradient(45deg, ${theme.accent}, ${theme.accent} 14px, #D12A20 14px, #D12A20 28px)`,
              borderRadius: "16px 16px 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              fontFamily: theme.display,
              fontWeight: 800,
              fontSize: 24,
              color: "white",
              textAlign: "center",
            }}
          >
            {t("Ganancia + costos del dealer", "Dealer profit + costs")}
          </div>
          <div
            style={{
              height: H * 0.6 * base,
              background: `linear-gradient(180deg, #94A3B8, #64748B)`,
              color: "#FFFFFF",
              borderRadius: margin > 0.02 ? 0 : "16px 16px 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.display,
              fontWeight: 800,
              fontSize: 26,
              overflow: "hidden",
            }}
          >
            {t("Precio de subasta", "Auction price")}
          </div>
        </div>
        <div style={{ opacity: margin, fontFamily: theme.display, fontWeight: 800, fontSize: 34, color: theme.accent2, display: "flex", alignItems: "center", gap: 18, height: H * 0.94, borderLeft: `4px solid ${theme.accent2}`, paddingLeft: 22 }}>
          {t("Lo que", "What")}
          <br />
          {t("tú pagas", "you pay")}
        </div>
      </div>
      <SfxAt at={start + 26} name="pop" volume={0.35} />
    </div>
  );
};

// ---------------------------------------------------------------- PROBLEMA
export const Problem: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const b1 = phraseAt(scene, t("Daños ocultos", "Hidden damage"));
  const b2 = phraseAt(scene, t("Un error", "One mistake"));
  const items = [
    { at: b1, icon: "alert" as const, title: t("Daños ocultos", "Hidden damage"), sub: t("Lo que las fotos no muestran", "What the photos don't show") },
    { at: phraseAt(scene, t("títulos complicados", "complicated titles")), icon: "doc" as const, title: t("Títulos complicados", "Complicated titles"), sub: "Clean · Salvage · Rebuilt" },
    { at: phraseAt(scene, t("tarifas que no entiendes", "fees you don't understand")), icon: "dollar" as const, title: t("Tarifas que no entiendes", "Fees you don't understand"), sub: t("Buyer fee · Gate fee · ¿?", "Buyer fee · Gate fee · ???") },
    { at: phraseAt(scene, t("reglas que cambian", "rules that change")), icon: "shuffle" as const, title: t("Reglas que cambian", "Rules that change"), sub: t("Cada subasta es distinta", "Every auction is different") },
  ];
  const flip = pop(frame, fps, b2 + 22, 10);

  return (
    <AbsoluteFill>
      <Beat from={0} to={b1 + 2}>
        <div style={center}>
          <Kicker>{t("El problema", "The problem")}</Kicker>
          <div style={{ height: 36 }} />
          <Kinetic text={t("Comprar en subasta *por* *tu* *cuenta* da miedo", "Buying at auction *on* *your* *own* is scary")} size={112} delay={6} />
        </div>
      </Beat>

      <Beat from={b1} to={b2 + 2}>
        <div style={{ ...center, paddingTop: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
            {items.map((it, i) => {
              const p = pop(frame, fps, it.at);
              return (
                <div key={i} style={popIn(p)}>
                  <Card glow={theme.accent} style={{ width: 720, padding: "34px 38px", display: "flex", gap: 30, alignItems: "center" }}>
                    <IconBadge name={it.icon} color={theme.accent} size={110} />
                    <div>
                      <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 44, color: theme.text }}>{it.title}</div>
                      <div style={{ fontFamily: theme.ui, fontWeight: 500, fontSize: 28, color: theme.muted, marginTop: 8 }}>{it.sub}</div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
        {items.map((it, i) => (
          <SfxAt key={i} at={it.at - b1} name="pop" volume={0.45} />
        ))}
      </Beat>

      <Beat from={b2}>
        <div style={{ ...center, flexDirection: "row", gap: 90 }}>
          <Kinetic text={t("Un error y el buen negocio te sale *caro*", "One mistake and a great deal gets *expensive*")} size={96} align="left" style={{ width: 760 }} />
          <div style={{ perspective: 1200 }}>
            <div
              style={{
                width: 520,
                height: 300,
                position: "relative",
                transformStyle: "preserve-3d",
                transform: `rotateY(${flip * 180}deg)`,
              }}
            >
              <PriceTag color={theme.success} label={t("BUEN NEGOCIO", "GREAT DEAL")} icon="tag" />
              <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                <PriceTag color={theme.accent} label={t("TE SALE CARO", "COSTS YOU MORE")} icon="alert" />
              </div>
            </div>
          </div>
        </div>
        <SfxAt at={22} name="whoosh" volume={0.35} />
      </Beat>
    </AbsoluteFill>
  );
};

const PriceTag: React.FC<{ color: string; label: string; icon: "tag" | "alert" }> = ({ color, label, icon }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backfaceVisibility: "hidden",
      borderRadius: 30,
      background: `linear-gradient(135deg, ${color}, ${color}bb)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      boxShadow: `0 30px 80px ${color}55`,
      color: "white",
      fontFamily: theme.display,
      fontWeight: 900,
      fontSize: 50,
    }}
  >
    <Icon name={icon} size={90} color="white" stroke={2.2} />
    {label}
  </div>
);

// ---------------------------------------------------------------- SOLUCIÓN
export const Solution: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const b1 = phraseAt(scene, t("vehículos de subastas", "vehicles from Copart auctions"));
  const b2 = phraseAt(scene, t("y un equipo", "and a team"));
  const logoP = pop(frame, fps, 4);
  const urlStart = 18;
  const moveUp = ease(frame, b1 - 6, b1 + 12);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: interpolate(moveUp, [0, 1], [300, 110]),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${interpolate(moveUp, [0, 1], [1, 0.72])})`,
        }}
      >
        <div style={popIn(logoP)}>
          <Logo height={190} />
        </div>
        <div
          style={{
            marginTop: 40,
            padding: "22px 44px",
            borderRadius: 999,
            background: "#FFFFFF",
            border: `2px solid ${theme.accent}`,
            boxShadow: `0 0 50px ${theme.accent}44`,
            fontFamily: theme.ui,
            fontWeight: 700,
            fontSize: 58,
            color: theme.text,
            opacity: interpolate(frame, [urlStart - 6, urlStart], [0, 1], clamp),
            minWidth: 700,
            textAlign: "center",
          }}
        >
          {typed(brand.url, frame, urlStart, 26)}
          <span style={{ opacity: Math.floor(frame / 10) % 2 ? 0 : 1, color: theme.accent }}>|</span>
        </div>
      </div>
      <Typing at={urlStart} frames={Math.ceil((brand.url.length / 26) * 30)} />

      <Beat from={b1}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
          <div style={popIn(pop(frame, fps, b1 + 4))}>
            <Card style={{ width: 620, padding: 36, display: "flex", gap: 28, alignItems: "center" }}>
              <IconBadge name="globe" color={theme.link} size={110} />
              <div>
                <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 40, color: theme.text }}>{t("Subastas de Copart", "Copart auctions")}</div>
                <div style={{ fontFamily: theme.ui, fontSize: 26, color: theme.muted, marginTop: 8 }}>{t("En todo EE. UU. · 100% online", "All across the U.S. · 100% online")}</div>
              </div>
            </Card>
          </div>
          <div style={{ ...popIn(pop(frame, fps, b2)), fontFamily: theme.display, fontWeight: 900, fontSize: 90, color: theme.accent2 }}>+</div>
          <div style={popIn(pop(frame, fps, b2 + 6))}>
            <Card glow={theme.success} style={{ width: 620, padding: 36, display: "flex", gap: 28, alignItems: "center" }}>
              <IconBadge name="shield" color={theme.success} size={110} />
              <div>
                <div style={{ fontFamily: theme.display, fontWeight: 800, fontSize: 40, color: theme.text }}>{t("Te acompañamos", "We're with you")}</div>
                <div style={{ fontFamily: theme.ui, fontSize: 26, color: theme.muted, marginTop: 8 }}>{t("De la puja a la documentación y el traslado", "From the bid to paperwork and shipping")}</div>
              </div>
            </Card>
          </div>
        </div>
        <SfxAt at={4} name="pop" volume={0.4} />
        <SfxAt at={b2 - b1 + 6} name="pop" volume={0.4} />
      </Beat>
    </AbsoluteFill>
  );
};
