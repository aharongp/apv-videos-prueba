import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, theme } from "../theme";
import { phraseAt, TimedScene } from "../timeline";
import { BrowserFrame, Cursor, SiteHeader, typed } from "../components/Browser";
import { Icon, IconName } from "../components/Icons";
import { Beat, SfxAt, Typing } from "../components/Shell";
import { IconBadge, Kinetic } from "../components/Ui";
import { clamp, ease, fadeUp, pop, popIn } from "../components/motion";
import { useT } from "../i18n";
import {
  AdvisorChat,
  BidModal,
  Calculator,
  DetailFocus,
  DetailModal,
  DetailTop,
  feeRows,
  FilterCard,
  HeroRegister,
  ListingRow,
  T,
  useListings,
  VerifyCode,
} from "../components/Site";

// Posición del navegador en pantalla (coordenadas absolutas del frame 1920x1080).
const BX = 600;
const BY = 96;
const BW = 1250;
const BH = 744;
const CY = BY + 58; // inicio del contenido bajo la barra del navegador

const steps = (t: T): { title: string; icon: IconName }[] => [
  { title: t("Crea tu cuenta gratis", "Create your free account"), icon: "user" },
  { title: t("Selecciona un vehículo", "Choose a vehicle"), icon: "car" },
  { title: t("Calcula tu presupuesto", "Calculate your budget"), icon: "calculator" },
  { title: t("Coloca tu puja máxima", "Place your max bid"), icon: "gavel" },
  { title: t("Confirma con un asesor", "Confirm with an advisor"), icon: "chat" },
];

const StepPanel: React.FC<{ n: number; items: string[]; itemTimes: number[]; extra?: React.ReactNode }> = ({ n, items, itemTimes, extra }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const STEPS = steps(t);
  const p = pop(frame, fps, 0);
  return (
    <div style={{ position: "absolute", left: 80, top: BY + 6, width: 470, fontFamily: theme.ui }}>
      <div style={{ ...fadeUp(p, 60), display: "flex", alignItems: "center", gap: 18 }}>
        <IconBadge name={STEPS[n - 1].icon} size={96} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color: theme.muted, letterSpacing: "0.11em" }}>{t("PASO ", "STEP ")}{n}{t(" DE 5", " OF 5")}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ width: 34, height: 6, borderRadius: 3, background: i < n ? theme.accent : theme.line }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...fadeUp(pop(frame, fps, 5), 40), fontWeight: 900, fontSize: 58, lineHeight: 1.04, letterSpacing: "-0.04em", color: theme.text, marginTop: 26 }}>
        {STEPS[n - 1].title}
      </div>
      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((it, i) => {
          const ip = pop(frame, fps, itemTimes[i] ?? 10 + i * 5);
          return (
            <div key={it} style={{ ...fadeUp(ip, 20), display: "flex", alignItems: "center", gap: 14, fontWeight: 700, fontSize: 27, color: theme.ink2 }}>
              <span style={{ width: 34, height: 34, borderRadius: 17, background: theme.successSoft, border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="check" size={20} color={theme.success} stroke={3} />
              </span>
              {it}
            </div>
          );
        })}
      </div>
      {extra}
    </div>
  );
};

const Illustrative: React.FC = () => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: BX, top: BY + BH + 12, fontFamily: theme.ui, fontSize: 17, fontWeight: 600, color: theme.muted }}>
      {t("Recreación de cars.apvmotorusa.com · vehículos y montos ilustrativos", "Recreation of cars.apvmotorusa.com · illustrative vehicles and amounts")}
    </div>
  );
};

const browserIn = (frame: number, start: number) => {
  const p = ease(frame, start, start + 18);
  return { opacity: p, transform: `translateY(${(1 - p) * 80}px) scale(${0.94 + 0.06 * p})` };
};

const Browser: React.FC<{ url: string; start?: number; caret?: boolean; children: React.ReactNode }> = ({ url, start = 0, caret, children }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: BX, top: BY, ...browserIn(frame, start) }}>
      <BrowserFrame url={url} showCaret={caret} width={BW} height={BH}>
        {children}
      </BrowserFrame>
    </div>
  );
};

const Callout: React.FC<{ at: number; icon: IconName; text: string; color?: string; x: number; y: number }> = ({ at, icon, text, color = theme.success, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        ...popIn(p),
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 24px",
        borderRadius: 20,
        background: color,
        boxShadow: `0 20px 50px ${color}55`,
        fontFamily: theme.ui,
        fontWeight: 800,
        fontSize: 26,
        color: "#fff",
        zIndex: 40,
      }}
    >
      <Icon name={icon} size={34} color="#fff" stroke={2.4} />
      {text}
    </div>
  );
};

// ---------------------------------------------------------------- PASO 1 · Crea tu cuenta gratis
export const Step1: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const STEPS = steps(t);
  const b1 = phraseAt(scene, t("Paso 1", "Step 1"));
  const f = {
    name: phraseAt(scene, t("tu nombre", "your name")),
    email: phraseAt(scene, t("correo", "email")),
    phone: phraseAt(scene, t("WhatsApp", "WhatsApp")),
  };
  const pass = f.phone + 16;
  const codeAt = phraseAt(scene, t("Te llega un código", "You'll get a code"));
  const clickAt = codeAt - 4;
  const values = {
    name: typed("María González", frame, f.name, 40),
    email: typed(t("maria@correo.com", "maria@email.com"), frame, f.email, 40),
    phone: typed("832 555 0147", frame, f.phone, 40),
    password: "•".repeat(Math.min(10, Math.max(0, Math.floor((frame - pass) / 1.2)))),
  };
  const active = frame >= clickAt ? -1 : frame >= pass ? 3 : frame >= f.phone ? 2 : frame >= f.email ? 1 : frame >= f.name ? 0 : -1;
  const verify = ease(frame, clickAt + 4, clickAt + 16);
  const code = typed("482910", frame, clickAt + 16, 30);
  const done = frame >= clickAt + 16 + 14;

  return (
    <AbsoluteFill>
      <Beat from={0} to={b1 + 2}>
        <div style={{ position: "absolute", inset: 0, bottom: 190, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Kinetic text={t("Así se compra en *5* *pasos*", "How to buy in *5* *steps*")} size={112} delay={2} />
          <div style={{ display: "flex", gap: 34, marginTop: 64 }}>
            {STEPS.map((s, i) => {
              const p = pop(frame, fps, 12 + i * 5);
              return (
                <div key={s.title} style={{ ...popIn(p), width: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
                  <IconBadge name={s.icon} size={104} />
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      background: theme.accent,
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: theme.ui,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontFamily: theme.ui, fontWeight: 800, fontSize: 26, lineHeight: 1.15, color: theme.text }}>{s.title}</div>
                </div>
              );
            })}
          </div>
        </div>
        {STEPS.map((_, i) => (
          <SfxAt key={i} at={12 + i * 5} name="pop" volume={0.3} />
        ))}
      </Beat>

      <Beat from={b1}>
        <StepPanel n={1} items={[t("Nombre y correo", "Name and email"), t("Teléfono / WhatsApp", "Phone / WhatsApp"), t("Código de 6 dígitos", "6-digit code")]} itemTimes={[f.name - b1, f.phone - b1, codeAt - b1]} />
      </Beat>
      <Beat from={b1} fade={1}>
        <Browser url={brand.url} start={0}>
          <SiteHeader />
          <HeroRegister values={values} active={active} pressed={frame >= clickAt && frame < clickAt + 5} />
          <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.45 * verify})` }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: verify, transform: `translateY(${(1 - verify) * 60}px)` }}>
            <VerifyCode code={code} done={done} />
          </div>
        </Browser>
      </Beat>
      <Cursor
        points={[
          { f: b1 + 16, x: 1500, y: 900 },
          { f: f.name - 4, x: BX + 460, y: CY + 330 },
          { f: f.email - 4, x: BX + 790, y: CY + 330 },
          { f: f.phone - 4, x: BX + 480, y: CY + 410 },
          { f: pass - 2, x: BX + 790, y: CY + 410 },
          { f: clickAt - 6, x: BX + 625, y: CY + 480 },
          { f: clickAt, x: BX + 627, y: CY + 482, click: true },
          { f: clickAt + 30, x: BX + 900, y: CY + 640 },
        ]}
      />
      {[f.name, f.email, f.phone].map((t, i) => (
        <Typing key={i} at={t} frames={18} volume={0.18} />
      ))}
      <SfxAt at={clickAt} name="click" volume={0.5} />
      <Typing at={clickAt + 16} frames={12} volume={0.2} />
      <SfxAt at={clickAt + 30} name="ding" volume={0.35} />
      <Beat from={b1}>
        <Illustrative />
      </Beat>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- PASO 2 · Selecciona un vehículo
const ROWS_Y = 252; // inicio (contenido) de las filas del catálogo
export const Step2: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const listings = useListings();
  const tSearch = phraseAt(scene, t("busca tu vehículo", "search for your vehicle"));
  const tMake = phraseAt(scene, t("marca", "make"));
  const tModel = phraseAt(scene, t("modelo", "model"));
  const tYear = phraseAt(scene, t("año", "year"));
  const tGo = phraseAt(scene, t("lote o VIN", "lot, or VIN"));
  const tOpen = phraseAt(scene, t("Abre la ficha", "Open the listing"));
  const focusAt: [DetailFocus, number][] = [
    ["photos", phraseAt(scene, t("las fotos", "the photos"))],
    ["damage", phraseAt(scene, t("los daños", "the damage"))],
    ["odometer", phraseAt(scene, t("el odómetro", "the odometer"))],
    ["title", phraseAt(scene, t("el título", "the title"))],
  ];
  const focus = focusAt.reduce<DetailFocus>((acc, [k, t]) => (frame >= t ? k : acc), "none");
  const showResults = frame >= tGo + 6;
  const detail = ease(frame, tOpen + 2, tOpen + 14);
  const viewBtn = { x: BX + 30 + 1190 - 12 - 190 + 44, y: CY + ROWS_Y + 184 - 12 - 17 };

  return (
    <AbsoluteFill>
      <StepPanel n={2} items={[t("Marca, modelo o año", "Make, model or year"), t("Lote o VIN", "Lot or VIN"), t("Fotos y daños", "Photos and damage"), t("Odómetro y título", "Odometer and title")]} itemTimes={[tMake, tGo, focusAt[0][1], focusAt[2][1]]} />
      <Browser url={`${brand.url}/#catalogo`}>
        <SiteHeader loggedIn />
        <FilterCard
          search={typed("Toyota RAV4", frame, tSearch, 22)}
          searchActive={frame >= tSearch && frame < tMake}
          make={frame >= tMake + 4 ? "Toyota" : ""}
          model={frame >= tModel + 4 ? "RAV4" : ""}
          yearMin={frame >= tYear + 4 ? "2019" : ""}
          pressed={frame >= tGo && frame < tGo + 5}
        />
        <div style={{ position: "absolute", left: 30, right: 30, top: ROWS_Y, display: "flex", flexDirection: "column", gap: 12 }}>
          {listings.slice(0, 2).map((l, i) => {
            const p = pop(frame, fps, tGo + 6 + i * 4, 16);
            return (
              <div key={l.lot} style={{ opacity: showResults ? Math.min(1, p * 1.3) : 0, transform: `translateY(${showResults ? (1 - p) * 40 : 40}px)` }}>
                <ListingRow l={l} highlight={i === 0 && frame > tOpen - 16} pressView={i === 0 && frame >= tOpen - 2 && frame < tOpen + 4} />
              </div>
            );
          })}
        </div>
        {detail > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: detail, transform: `scale(${0.96 + 0.04 * detail})` }}>
            <DetailModal l={listings[0]}>
              <DetailTop l={listings[0]} focus={focus} />
              <div style={{ height: 16 }} />
              <Calculator bid={8500} bidText="" rowsVisible={0} total={0} showTotal={0} inputActive={false} />
            </DetailModal>
          </div>
        )}
      </Browser>
      <Cursor
        points={[
          { f: 4, x: 1500, y: 950 },
          { f: tSearch - 4, x: BX + 400, y: CY + 115 },
          { f: tMake - 4, x: BX + 150, y: CY + 186, click: true },
          { f: tModel - 2, x: BX + 350, y: CY + 186, click: true },
          { f: tYear - 2, x: BX + 750, y: CY + 186, click: true },
          { f: tGo - 4, x: BX + 1160, y: CY + 186 },
          { f: tGo, x: BX + 1162, y: CY + 188, click: true },
          { f: tOpen - 6, x: viewBtn.x, y: viewBtn.y },
          { f: tOpen, x: viewBtn.x + 2, y: viewBtn.y + 2, click: true },
          { f: tOpen + 40, x: BX + 1000, y: CY + 620 },
        ]}
      />
      <Typing at={tSearch} frames={14} volume={0.2} />
      {[tMake, tModel, tYear, tGo, tOpen].map((t, i) => (
        <SfxAt key={i} at={t} name="click" volume={0.45} />
      ))}
      <SfxAt at={tGo + 6} name="whoosh" volume={0.2} />
      {focusAt.map(([k, t]) => (
        <SfxAt key={k} at={t} name="pop" volume={0.3} />
      ))}
      <Illustrative />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- PASO 3 · Calcula tu presupuesto
export const Step3: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const listings = useListings();
  const tCalc = phraseAt(scene, t("calcula tu presupuesto", "calculate your budget"));
  const tType = phraseAt(scene, t("Escribe tu tope", "Enter your max bid"));
  const tRows = phraseAt(scene, t("y ve el total", "and see the estimated total"));
  const tBefore = phraseAt(scene, t("antes de ofertar", "before you bid"));
  const bid = 8500;
  const rows = feeRows(bid, t);
  const totalValue = rows.reduce((a, [, v]) => a + v, 0);
  const rowsVisible = Math.max(0, Math.min(rows.length, Math.floor((frame - tRows) / 4) + 1));
  const totalAt = tRows + rows.length * 4;
  const total = interpolate(frame, [totalAt, totalAt + 20], [0, totalValue], clamp);
  const scroll = ease(frame, tCalc - 6, tCalc + 16);
  const bidText = typed("8,500", frame, tType + 6, 14);

  return (
    <AbsoluteFill>
      <StepPanel
        n={3}
        items={[t("Escribe tu tope de puja", "Enter your max bid"), t("Tarifas Copart y APV", "Copart & APV fees"), t("Total estimado a pagar", "Estimated total to pay")]}
        itemTimes={[tType, tRows, totalAt]}
        extra={
          <div style={{ ...fadeUp(pop(frame, fps, totalAt + 10), 20), marginTop: 30, padding: "16px 20px", borderRadius: 18, background: "#fff", border: `1px solid ${theme.line}`, boxShadow: theme.shadow }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.1em", color: theme.muted }}>{t("SABES EL TOTAL ANTES DE PUJAR", "KNOW YOUR TOTAL BEFORE YOU BID")}</div>
            <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.04em", color: theme.text }}>
              {`$${Math.round(total).toLocaleString("en-US")}`}
              <span style={{ fontSize: 22, color: theme.muted, fontWeight: 700 }}> USD</span>
            </div>
          </div>
        }
      />
      <Browser url={`${brand.url}/#catalogo`}>
        <SiteHeader loggedIn />
        <DetailModal l={listings[0]}>
          <div style={{ transform: `translateY(${-scroll * 440}px)` }}>
            <DetailTop l={listings[0]} focus="none" />
            <div style={{ height: 16 }} />
            <Calculator
              bid={bid}
              bidText={bidText}
              rowsVisible={frame >= tRows ? rowsVisible : 0}
              total={total}
              showTotal={interpolate(frame, [totalAt, totalAt + 8], [0, 1], clamp)}
              inputActive={frame >= tType && frame < tRows}
            />
          </div>
        </DetailModal>
      </Browser>
      <Cursor
        points={[
          { f: 4, x: 1500, y: 950 },
          { f: tType - 2, x: BX + 260, y: CY + 330 },
          { f: tType + 4, x: BX + 262, y: CY + 332, click: true },
          { f: tBefore - 4, x: BX + 250, y: CY + 520 },
        ]}
      />
      <SfxAt at={tType + 4} name="click" volume={0.45} />
      <Typing at={tType + 6} frames={10} volume={0.22} />
      {rows.map((_, i) => (
        <SfxAt key={i} at={tRows + i * 4} name="pop" volume={0.22} />
      ))}
      <SfxAt at={totalAt + 20} name="ding" volume={0.35} />
      <Illustrative />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- PASO 4 · Coloca tu puja máxima
export const Step4: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const t = useT();
  const listings = useListings();
  const tTap = phraseAt(scene, t("toca «Quiero ofertar»", "tap “Place my bid”"));
  const clickAt = tTap + 16;
  const tSet = phraseAt(scene, t("establece tu tope", "set your max bid"));
  const tCalm = phraseAt(scene, t("Tranquilo", "Don't worry"));
  const submitAt = scene.voFrames + 4;
  const modal = ease(frame, clickAt + 2, clickAt + 14);
  const btn = { x: BX + 24 + 22 + 420 + 16 + 347 + 16 + 125, y: CY + 16 + 16 + 50 + 146 };

  return (
    <AbsoluteFill>
      <StepPanel n={4} items={[t("Toca «Quiero ofertar»", "Tap “Place my bid”"), t("Escribe tu tope de oferta", "Enter your max bid"), t("Sin cargos automáticos", "No automatic charges")]} itemTimes={[tTap, tSet, tCalm]} />
      <Browser url={`${brand.url}/#catalogo`}>
        <SiteHeader loggedIn />
        <DetailModal l={listings[0]}>
          <DetailTop l={listings[0]} focus="none" bidPulse={frame < clickAt ? (Math.sin(frame / 4) + 1) / 2 : 0} pressBid={frame >= clickAt && frame < clickAt + 5} />
        </DetailModal>
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.35 * modal})` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: modal, transform: `translateY(${(1 - modal) * 70}px)` }}>
          <BidModal l={listings[0]} value={typed("8,500", frame, tSet + 8, 14)} active={frame >= tSet && frame < submitAt} pressed={frame >= submitAt && frame < submitAt + 6} />
        </div>
      </Browser>
      <Callout at={tCalm} icon="shield" text={t("No se realiza ningún cargo automático", "There's no automatic charge")} x={1080} y={BY + 40} />
      <Cursor
        points={[
          { f: 4, x: 1500, y: 950 },
          { f: clickAt - 8, x: btn.x, y: btn.y },
          { f: clickAt, x: btn.x + 2, y: btn.y + 2, click: true },
          { f: tSet + 2, x: BX + 600, y: CY + 390 },
          { f: submitAt - 8, x: BX + 780, y: CY + 490 },
          { f: submitAt, x: BX + 782, y: CY + 492, click: true },
        ]}
      />
      <SfxAt at={clickAt} name="click" volume={0.5} />
      <Typing at={tSet + 8} frames={10} volume={0.22} />
      <SfxAt at={tCalm} name="pop" volume={0.4} />
      <SfxAt at={submitAt} name="click" volume={0.5} />
      <Illustrative />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- PASO 5 · Confirma con un asesor
export const Step5: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT();
  const listings = useListings();
  const tChat = phraseAt(scene, t("Continúas en el chat", "You'll continue in the APV chat"));
  const tReview = phraseAt(scene, t("revisamos contigo", "we review your request"));
  const tConfirm = phraseAt(scene, t("la confirmamos", "confirm it"));
  const panel = ease(frame, 0, 16);
  const s = (at: number) => pop(frame, fps, at, 14);
  const status =
    frame < tChat
      ? t("Tu solicitud está lista.", "Your request is ready.")
      : frame < tChat + 18
        ? t("Conectando con el chat de APV Motors…", "Connecting to the APV Motors chat…")
        : t("Conversación · Tope solicitado: $8,500", "Conversation · Requested max: $8,500");
  const confirm = pop(frame, fps, tConfirm + 6, 11);

  return (
    <AbsoluteFill>
      <StepPanel n={5} items={[t("Chat de APV Motors", "APV Motors chat"), t("Revisamos tu solicitud", "We review your request"), t("Confirmamos tu puja", "We confirm your bid")]} itemTimes={[tChat, tReview, tConfirm]} />
      <Browser url={`${brand.url}/#catalogo`}>
        <SiteHeader loggedIn />
        <DetailModal l={listings[0]}>
          <DetailTop l={listings[0]} focus="none" />
        </DetailModal>
        <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.4 * panel})` }} />
        <div style={{ position: "absolute", right: 40, top: 30, opacity: panel, transform: `translateX(${(1 - panel) * 120}px)` }}>
          <AdvisorChat
            status={status}
            typing={frame >= tChat + 26 && frame < tReview}
            msgs={[
              { from: "me", text: t("Hola, quiero ofertar por el 2021 TOYOTA RAV4 XLE.\nLote 47392215 · Tope solicitado: $8,500", "Hi, I'd like to bid on the 2021 TOYOTA RAV4 XLE.\nLot 47392215 · Requested max: $8,500"), show: s(tChat + 14) },
              ...(frame >= tReview
                ? [{ from: "advisor" as const, text: t("¡Hola María! Soy tu asesor de APV Motors. Revisamos contigo el vehículo y las tarifas, y confirmamos tu solicitud de puja.", "Hi María! I'm your APV Motors advisor. Let's go over the vehicle and the fees together, and confirm your bid request."), show: s(tReview) }]
                : []),
            ]}
          />
        </div>
      </Browser>
      <div
        style={{
          position: "absolute",
          left: BX + 90,
          top: BY + 470,
          ...popIn(confirm),
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 28px",
          borderRadius: 20,
          background: theme.success,
          boxShadow: `0 20px 50px ${theme.success}66`,
          fontFamily: theme.ui,
          fontWeight: 900,
          fontSize: 30,
          color: "#fff",
        }}
      >
        <Icon name="check" size={38} color="#fff" stroke={3} />{t(" Solicitud de puja confirmada", " Bid request confirmed")}
      </div>
      <SfxAt at={tChat + 14} name="pop" volume={0.35} />
      <SfxAt at={tReview} name="pop" volume={0.4} />
      <SfxAt at={tConfirm + 6} name="ding" volume={0.45} />
      <Illustrative />
    </AbsoluteFill>
  );
};
