// Recreación de la interfaz de cars.apvmotorusa.com (textos y estilos tomados del sitio real).
// Los vehículos, lotes y montos son ilustrativos.
import React from "react";
import { theme } from "../theme";
import { Car, CarKind } from "./Car";
import { Icon } from "./Icons";
import { Btn } from "./Ui";
import { useT } from "../i18n";

export type T = ReturnType<typeof useT>;

export type Listing = {
  year: number;
  make: string;
  model: string;
  lot: string;
  kind: CarKind;
  color: string;
  odometer: string;
  location: string;
  damage: string;
  damage2: string;
  condition: string;
  doc: string;
  currentBid: string;
  buyNow: string;
  date: string;
  cyl: string;
  drive: string;
};

const listingsData = (t: T): Listing[] => [
  {
    year: 2021, make: "TOYOTA", model: "RAV4 XLE", lot: "47392215", kind: "suv", color: "#1E40AF",
    odometer: "42,180 mi", location: "HOUSTON, TX", damage: "FRONT END", damage2: "MINOR DENT/SCRATCHES",
    condition: "Run & Drive", doc: "TX · CT", currentBid: "$6,800", buyNow: "$9,900",
    date: t("2 oct 2026 · CDT", "Oct 2, 2026 · CDT"), cyl: "4 cyl", drive: "ALL WHEEL DRIVE",
  },
  {
    year: 2020, make: "TOYOTA", model: "RAV4 LE", lot: "46810573", kind: "suv", color: "#9CA3AF",
    odometer: "58,940 mi", location: "SAN ANTONIO, TX", damage: "REAR END", damage2: t("N/D", "N/A"),
    condition: "Run & Drive", doc: "TX · CT", currentBid: "$5,450", buyNow: "N/A",
    date: t("3 oct 2026 · CDT", "Oct 3, 2026 · CDT"), cyl: "4 cyl", drive: "FRONT WHEEL DRIVE",
  },
  {
    year: 2019, make: "TOYOTA", model: "RAV4 ADVENTURE", lot: "45977302", kind: "suv", color: "#F3F4F6",
    odometer: "71,305 mi", location: "DALLAS, TX", damage: "SIDE", damage2: "MINOR DENT/SCRATCHES",
    condition: "Enhanced Vehicles", doc: "TX · CT", currentBid: "$4,900", buyNow: "$7,250",
    date: t("6 oct 2026 · CDT", "Oct 6, 2026 · CDT"), cyl: "4 cyl", drive: "ALL WHEEL DRIVE",
  },
];

/** Vehículos ilustrativos con los textos en el idioma activo. */
export const useListings = () => listingsData(useT());

/** "Foto" ilustrativa del vehículo: patio de subasta estilizado + silueta. */
export const CarPhoto: React.FC<{ l: Listing; width: number; height: number; radius?: number; badge?: string }> = ({ l, width, height, radius = 14, badge }) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      overflow: "hidden",
      position: "relative",
      background: "linear-gradient(180deg, #BFDBFE 0%, #E0ECFA 50%, #A3AAB5 50%, #6B7280 100%)",
      flexShrink: 0,
    }}
  >
    <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: "12%", background: "linear-gradient(180deg, #CBD5E1, #94A3B8)", opacity: 0.55 }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: height * 0.06 }}>
      <Car kind={l.kind} color={l.color} width={width * 0.82} />
    </div>
    {badge && (
      <div style={{ position: "absolute", left: 10, bottom: 10, padding: "3px 10px", borderRadius: 999, background: "rgba(15,23,42,.8)", color: "#fff", fontFamily: theme.ui, fontWeight: 800, fontSize: 12 }}>{badge}</div>
    )}
  </div>
);

export const Input: React.FC<{
  label?: string;
  value: string;
  placeholder?: string;
  active?: boolean;
  select?: boolean;
  prefix?: React.ReactNode;
  height?: number;
  fontSize?: number;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}> = ({ label, value, placeholder, active, select, prefix, height = 46, fontSize = 17, style, labelStyle }) => (
  <div style={{ fontFamily: theme.ui, minWidth: 0, ...style }}>
    {label && <div style={{ fontSize: 13, fontWeight: 800, color: theme.slate, marginBottom: 6, whiteSpace: "nowrap", ...labelStyle }}>{label}</div>}
    <div
      style={{
        height,
        borderRadius: 12,
        background: "#FFFFFF",
        border: `1.5px solid ${active ? theme.accent : theme.field}`,
        boxShadow: active ? "0 0 0 4px rgba(220,38,38,.12)" : undefined,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 14px",
        fontSize,
        fontWeight: 600,
        color: value ? theme.text : "#94A3B8",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {prefix}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{value || placeholder}</span>
      {select && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.slate} strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------- Hero + registro
export const HeroRegister: React.FC<{
  values: { name: string; email: string; phone: string; password: string };
  active: number;
  pressed?: boolean;
}> = ({ values, active, pressed }) => {
  const t = useT();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        top: 68,
        background: "radial-gradient(circle at 50% 10%, rgba(37,99,235,.08), transparent 50%), linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%)",
        fontFamily: theme.ui,
      }}
    >
      <div style={{ textAlign: "center", padding: "26px 120px 0" }}>
        <div style={{ fontWeight: 900, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.04em", color: theme.text }}>{t("Compra tu vehículo en subastas de EE. UU. sin complicarte.", "Buy your vehicle at U.S. auctions, hassle-free.")}</div>
        <div style={{ fontSize: 17, lineHeight: 1.5, color: theme.slate, marginTop: 10, padding: "0 60px" }}>
          {t(
            "Encuentra vehículos de Copart, define cuánto quieres ofertar y APV Motors te acompaña desde la puja hasta la documentación y el traslado.",
            "Find Copart vehicles, decide how much you want to bid, and APV Motors supports you from the bid all the way to paperwork and shipping.",
          )}
        </div>
      </div>
      <div style={{ margin: "20px auto 0", width: 720, padding: "22px 26px", borderRadius: 20, background: "#fff", border: `1px solid ${theme.line}`, boxShadow: theme.shadow }}>
        <div style={{ fontWeight: 800, fontSize: 24, color: theme.text, marginBottom: 14 }}>{t("Crea tu cuenta gratis", "Create your free account")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Input label={t("Nombre completo", "Full name")} value={values.name} active={active === 0} />
          <Input label={t("Correo electrónico", "Email address")} value={values.email} active={active === 1} />
          <Input
            label={t("Teléfono / WhatsApp", "Phone / WhatsApp")}
            value={values.phone}
            placeholder="414 123 4567"
            active={active === 2}
            prefix={<span style={{ fontWeight: 800, color: theme.text, paddingRight: 10, borderRight: `1px solid ${theme.line}` }}>🇺🇸 +1</span>}
          />
          <Input label={t("Contraseña", "Password")} value={values.password} active={active === 3} />
        </div>
        <Btn kind="primary" style={{ width: "100%", marginTop: 16, fontSize: 18, transform: pressed ? "scale(0.98)" : undefined }}>
          {t("Crea tu cuenta gratis", "Create your free account")}
        </Btn>
        <div style={{ textAlign: "center", fontSize: 13, color: theme.muted, marginTop: 10 }}>
          {t("Enviaremos un código de 6 dígitos a tu correo para activar tu cuenta de forma segura.", "We'll send a 6-digit code to your email to securely activate your account.")}
        </div>
      </div>
    </div>
  );
};

export const VerifyCode: React.FC<{ code: string; done: boolean }> = ({ code, done }) => {
  const t = useT();
  return (
    <div style={{ width: 560, padding: "30px 34px", borderRadius: 24, background: "#fff", border: `1px solid ${theme.line}`, boxShadow: "0 30px 80px rgba(15,23,42,.2)", fontFamily: theme.ui, textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.11em", color: theme.muted }}>{t("CUENTA APV MOTORS", "APV MOTORS ACCOUNT")}</div>
      <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: "-0.03em", color: theme.text, marginTop: 8 }}>{t("Confirma tu correo electrónico", "Confirm your email address")}</div>
      <div style={{ fontSize: 16, color: theme.slate, marginTop: 8 }}>{t("Ingresa el código de 6 dígitos que enviamos a maria@correo.com", "Enter the 6-digit code we sent to maria@email.com")}</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22 }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 58,
              height: 68,
              borderRadius: 12,
              border: `1.5px solid ${code.length === i && !done ? theme.accent : theme.field}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 32,
              color: theme.text,
            }}
          >
            {code[i] ?? ""}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          height: 50,
          borderRadius: 13,
          background: done ? theme.success : theme.text,
          color: "#fff",
          fontWeight: 800,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {done ? (
          <>
            <Icon name="check" size={22} color="#fff" stroke={3} />{t(" Bienvenido, María", " Welcome, María")}
          </>
        ) : (
          t("Verificar", "Verify")
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Búsqueda
export const FilterCard: React.FC<{ search: string; searchActive: boolean; make: string; model: string; yearMin: string; pressed?: boolean }> = ({
  search,
  searchActive,
  make,
  model,
  yearMin,
  pressed,
}) => {
  const t = useT();
  return (
    <div
      style={{
        margin: "16px 30px 0",
        padding: "14px 20px",
        borderRadius: 20,
        background: "rgba(226,232,240,.65)",
        border: "1px solid rgba(203,213,225,.8)",
        boxShadow: "0 20px 40px rgba(15,23,42,.08)",
        fontFamily: theme.ui,
      }}
    >
      <Input
        label={t("BUSCAR POR VIN, LOTE, MARCA O MODELO", "SEARCH BY VIN, LOT, MAKE OR MODEL")}
        labelStyle={{ fontSize: 11, letterSpacing: ".04em" }}
        value={search}
        placeholder={t("Ej. Silverado 2023, número de lote o VIN", "E.g. Silverado 2023, lot number or VIN")}
        active={searchActive}
        prefix={<span style={{ color: theme.muted, fontSize: 18 }}>⌕</span>}
        height={44}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr) auto", gap: 10, marginTop: 10, alignItems: "end" }}>
        {[
          [t("MARCA", "MAKE"), make || t("Todas las marcas", "All makes")],
          [t("MODELO", "MODEL"), model || t("Todos los modelos", "All models")],
          [t("UBICACIÓN / ESTADO", "LOCATION / STATE"), t("Todos", "All")],
          [t("AÑO DESDE", "YEAR FROM"), yearMin || "1998"],
          [t("AÑO HASTA", "YEAR TO"), "2027"],
        ].map(([l, v]) => (
          <Input key={l} label={l} value={v} select height={40} fontSize={15} labelStyle={{ fontSize: 11, letterSpacing: ".04em" }} />
        ))}
        <Btn kind="primary" style={{ height: 40, minHeight: 40, fontSize: 15, letterSpacing: ".04em", transform: pressed ? "scale(0.95)" : undefined }}>
          {t("BUSCAR", "SEARCH")}
        </Btn>
      </div>
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ padding: "3px 9px", borderRadius: 999, border: `1px solid ${theme.line}`, background: "#fff", fontSize: 11, fontWeight: 800, color: theme.slate, whiteSpace: "nowrap" }}>{children}</span>
);

/** Fila del catálogo tal como se ve en el sitio. */
export const ListingRow: React.FC<{ l: Listing; highlight?: boolean; pressView?: boolean; style?: React.CSSProperties }> = ({ l, highlight, pressView, style }) => {
  const t = useT();
  const spec = (k: string, v: string) => (
    <div style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: `1px solid ${theme.soft}`, fontSize: 12 }}>
      <span style={{ width: 84, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontWeight: 800, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
    </div>
  );
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 12,
        borderRadius: 20,
        background: "#fff",
        border: `1.5px solid ${highlight ? "#93C5FD" : theme.line}`,
        boxShadow: highlight ? "0 0 0 4px rgba(147,197,253,.35), 0 18px 40px rgba(15,23,42,.08)" : "0 10px 30px rgba(15,23,42,.05)",
        fontFamily: theme.ui,
        ...style,
      }}
    >
      <CarPhoto l={l} width={220} height={160} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
            {l.year} {l.make} {l.model}
          </span>
          <span style={{ padding: "2px 8px", borderRadius: 8, background: "#EFF6FF", color: theme.accent2, fontSize: 11, fontWeight: 900 }}>COPART</span>
          <span style={{ width: 28, height: 28, borderRadius: 14, border: `1px solid ${theme.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent, fontSize: 14 }}>♡</span>
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700, marginTop: 4 }}>{t("⌗ VIN protegido · inicia sesión para verlo • Lote ", "⌗ VIN protected · log in to view • Lot ")}{l.lot}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, overflow: "hidden" }}>
          <Chip>{t("🔑 Llave disponible", "🔑 Keys available")}</Chip>
          <Chip>⚙ AUTOMATIC</Chip>
          <Chip>◉ {l.drive}</Chip>
          <Chip>⬡ {l.cyl}</Chip>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 18, marginTop: 4 }}>
          {spec(t("Odómetro", "Odometer"), l.odometer)}
          {spec(t("Ubicación", "Location"), l.location)}
          {spec(t("Daño", "Damage"), l.damage)}
          {spec(t("Documento", "Title"), l.doc)}
        </div>
      </div>
      <div style={{ width: 190, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ padding: "7px 10px", borderRadius: 12, border: `1px solid ${theme.line}`, fontSize: 12, fontWeight: 800, color: theme.text, lineHeight: 1.7 }}>
          <div>▣ {l.date}</div>
          <div>
            <span style={{ color: theme.success }}>◉</span> On Minimum Bid
          </div>
        </div>
        <div style={{ display: "flex", borderRadius: 12, border: "1px solid #BBF7D0", background: theme.successSoft, overflow: "hidden", textAlign: "center" }}>
          {[
            ["CURRENTBID", l.currentBid],
            ["BUYNOW", l.buyNow],
          ].map(([k, v], i) => (
            <div key={k} style={{ flex: 1, padding: "5px 0", borderLeft: i ? "1px solid #BBF7D0" : undefined }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: theme.success, letterSpacing: ".06em" }}>{k}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: theme.success }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
          <Btn
            kind="ghost"
            style={{ flex: 1, minHeight: 34, fontSize: 12, padding: "0 6px", transform: pressView ? "scale(0.93)" : undefined, boxShadow: pressView ? "0 0 0 3px rgba(220,38,38,.3)" : undefined }}
          >
            {t("Ver ficha", "Details")}
          </Btn>
          <Btn kind="primary" style={{ flex: 1.3, minHeight: 34, fontSize: 12, padding: "0 6px" }}>
            {t("Quiero ofertar", "Place my bid")}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Ficha del vehículo
const Row: React.FC<{ k: string; v: string; on?: boolean }> = ({ k, v, on }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      padding: "8px 12px",
      borderRadius: 9,
      background: on ? "#FEF3C7" : theme.panel2,
      border: `1.5px solid ${on ? "#F59E0B" : theme.soft}`,
      boxShadow: on ? "0 0 0 4px rgba(245,158,11,.18)" : undefined,
      fontSize: 14,
    }}
  >
    <span style={{ color: theme.muted, fontWeight: 700 }}>{k}</span>
    <span style={{ color: theme.text, fontWeight: 800 }}>{v}</span>
  </div>
);

export const Section: React.FC<{ icon: string; title: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ icon, title, children, style }) => (
  <div style={{ padding: "12px 16px", borderRadius: 18, border: `1px solid ${theme.line}`, background: "#fff", fontFamily: theme.ui, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${theme.soft}`, fontWeight: 800, fontSize: 16, color: theme.text }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${theme.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{icon}</span>
      {title}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
  </div>
);

export type DetailFocus = "none" | "photos" | "damage" | "odometer" | "title";

export const DetailTop: React.FC<{ l: Listing; focus: DetailFocus; bidPulse?: number; pressBid?: boolean }> = ({ l, focus, bidPulse = 0, pressBid }) => {
  const t = useT();
  return (
    <div style={{ display: "flex", gap: 16, fontFamily: theme.ui }}>
      <div
        style={{
          width: 420,
          padding: 12,
          borderRadius: 16,
          background: "#0F172A",
          boxShadow: focus === "photos" ? "0 0 0 5px rgba(245,158,11,.6)" : undefined,
          flexShrink: 0,
          alignSelf: "flex-start",
        }}
      >
        <CarPhoto l={l} width={396} height={250} radius={10} badge={t("13 fotos", "13 photos")} />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, borderRadius: 8, overflow: "hidden", border: `2px solid ${i === 0 ? "#fff" : "transparent"}`, opacity: i === 0 ? 1 : 0.75 }}>
              <CarPhoto l={l} width={92} height={54} radius={6} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <Section icon="🛠️" title={t("Damage / Daños y Condición", "Damage & Condition")}>
          <Row k={t("Daño principal", "Primary damage")} v={l.damage} on={focus === "damage"} />
          <Row k={t("Daño secundario", "Secondary damage")} v={l.damage2} on={focus === "damage"} />
          <Row k={t("Condición", "Condition")} v={l.condition} />
          <Row k={t("Título / Doc", "Title / Doc")} v={l.doc} on={focus === "title"} />
        </Section>
        <Section icon="⚙️" title={t("Vehicle Info / Información del Vehículo", "Vehicle Info")}>
          <Row k={t("Odómetro", "Odometer")} v={l.odometer} on={focus === "odometer"} />
          <Row k={t("Tiene Llave", "Has Keys")} v={t("Sí", "Yes")} />
        </Section>
      </div>
      <div style={{ width: 250, padding: 14, borderRadius: 18, border: `1px solid ${theme.line}`, display: "flex", flexDirection: "column", gap: 10, alignSelf: "flex-start" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: theme.slate, textAlign: "center" }}>{t("⏱ Tiempo para puja preliminar", "⏱ Time left to pre-bid")}</div>
        <div style={{ padding: "12px 8px", borderRadius: 14, border: `1px solid ${theme.line}`, background: theme.panel2, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: theme.muted }}>{t("PUJA ACTUAL SUBASTA", "CURRENT AUCTION BID")}</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: theme.accent2 }}>{l.currentBid} USD</div>
        </div>
        <Btn
          kind="blue"
          style={{
            fontSize: 15,
            minHeight: 56,
            whiteSpace: "normal",
            textAlign: "center",
            transform: `scale(${pressBid ? 0.95 : 1 + bidPulse * 0.04})`,
            boxShadow: `0 10px ${24 + bidPulse * 30}px rgba(29,78,216,${0.3 + bidPulse * 0.3})`,
          }}
        >
          {t("🔨 QUIERO OFERTAR / OFERTAR", "🔨 PLACE MY BID")}
        </Btn>
        <div style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", lineHeight: 1.4 }}>
          {t('Vehículos vendidos en su estado actual "as is - where is", todas las ventas son finales.', 'Vehicles sold in their current condition "as is - where is"; all sales are final.')}
        </div>
      </div>
    </div>
  );
};

export const DetailModal: React.FC<{ children: React.ReactNode; l: Listing }> = ({ children, l }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.45)" }}>
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: 16,
          bottom: 16,
          borderRadius: 26,
          background: "#fff",
          padding: "16px 22px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(15,23,42,.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontFamily: theme.ui }}>
          <span style={{ fontWeight: 900, fontSize: 24, letterSpacing: "-0.03em", color: theme.text }}>
            {l.year} {l.make} {l.model}
          </span>
          <span style={{ fontSize: 14, color: theme.muted, fontWeight: 700 }}>
            {t("Lote ", "Lot ")}{l.lot} · {l.location} · {l.date}
          </span>
          <span style={{ marginLeft: "auto", width: 36, height: 36, borderRadius: 18, border: `1px solid ${theme.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: theme.text }}>×</span>
        </div>
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Calculadora
export const feeRows = (bid: number, t: T) => {
  // Mismas tablas de tarifas que usa el sitio (puja en vivo, vehículo estándar).
  const copart = bid < 10000 ? 700 : bid < 15000 ? 775 : Math.round(bid * 0.055);
  const virtual = bid < 8000 ? 109 : bid < 10000 ? 119 : 129;
  const apv = bid <= 5999 ? 350 : bid <= 9999 ? 450 : bid <= 14999 ? 650 : 700;
  return [
    [t("Tope de puja (Oferta)", "Max bid (Offer)"), bid],
    [t("Tarifa comprador Copart", "Copart buyer fee"), copart],
    [t("Tarifa puja en vivo / Internet", "Live / internet bid fee"), virtual],
    [t("Honorarios APV Motors", "APV Motors fees"), apv],
    [t("Gastos de portón (Gate fee)", "Gate fee"), 79],
    [t("Comisión bancaria (Bank fee)", "Bank fee"), 30],
    [t("Retiro de título (Title pickup)", "Title pickup"), 20],
  ] as [string, number][];
};

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export const Calculator: React.FC<{ bid: number; bidText: string; rowsVisible: number; total: number; showTotal: number; inputActive: boolean; pressBid?: boolean }> = ({
  bid,
  bidText,
  rowsVisible,
  total,
  showTotal,
  inputActive,
  pressBid,
}) => {
  const t = useT();
  const rows = feeRows(bid, t);
  return (
    <div style={{ padding: "16px 22px", borderRadius: 20, border: `1px solid ${theme.line}`, background: "#fff", fontFamily: theme.ui }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".08em", color: theme.accent }}>{t("🧮 HERRAMIENTA DE CÁLCULO DE FEES", "🧮 FEE CALCULATION TOOL")}</div>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em", color: theme.text, marginTop: 2 }}>{t("Calculadora de Costos y Total a Pagar", "Cost & Total Calculator")}</div>
        </div>
        <span style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 999, background: theme.successSoft, color: theme.success, fontWeight: 800, fontSize: 13 }}>{t("● Sesión activa", "● Active session")}</span>
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
        <div style={{ width: 380 }}>
          <div style={{ fontSize: 14, color: theme.slate, lineHeight: 1.45, marginBottom: 12 }}>
            {t("Ingresa tu tope de puja para calcular el desglose exacto de tarifas de subasta y honorarios.", "Enter your max bid to see the exact breakdown of auction fees and service fees.")}
          </div>
          <Input label={t("Ingresa tu tope de puja ($ USD)", "Enter your max bid ($ USD)")} value={bidText} active={inputActive} height={58} fontSize={28} prefix={<span style={{ fontWeight: 900, color: theme.muted, fontSize: 24 }}>$</span>} />
          <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 16, background: theme.text, color: "#fff", opacity: showTotal, transform: `scale(${0.9 + 0.1 * showTotal})` }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".1em", color: "#94A3B8" }}>{t("TOTAL ESTIMADO A PAGAR", "ESTIMATED TOTAL TO PAY")}</div>
            <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-0.03em" }}>{usd(total)} USD</div>
          </div>
          <Btn kind="primary" style={{ width: "100%", marginTop: 12, fontSize: 16, opacity: showTotal, transform: pressBid ? "scale(0.96)" : undefined }}>
            {t("Ofertar con este tope", "Bid with this max")}
          </Btn>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 14px",
                borderRadius: 10,
                background: i === 0 ? "#EFF6FF" : theme.panel2,
                border: `1px solid ${i === 0 ? "#BFDBFE" : theme.soft}`,
                fontSize: 16,
                opacity: i < rowsVisible ? 1 : 0,
                transform: `translateX(${i < rowsVisible ? 0 : 30}px)`,
              }}
            >
              <span style={{ color: theme.slate, fontWeight: 700 }}>{k}</span>
              <span style={{ color: theme.text, fontWeight: 900 }}>{usd(v)}</span>
            </div>
          ))}
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>{t("* No incluye costo de flete/transporte ni impuestos locales.", "* Does not include freight/shipping or local taxes.")}</div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Tope de oferta
export const BidModal: React.FC<{ l: Listing; value: string; active: boolean; pressed: boolean }> = ({ l, value, active, pressed }) => {
  const t = useT();
  return (
    <div style={{ width: 620, padding: "26px 30px", borderRadius: 26, background: "#fff", boxShadow: "0 30px 80px rgba(15,23,42,.3)", fontFamily: theme.ui }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".11em", color: theme.accent }}>{t("PASO 2 DE TU COMPRA", "STEP 2 OF YOUR PURCHASE")}</span>
        <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: theme.muted }}>
          {l.year} {l.make} {l.model}{t(" · Lote ", " · Lot ")}{l.lot}
        </span>
      </div>
      <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: "-0.03em", color: theme.text, marginTop: 8 }}>{t("Establece tu tope de oferta", "Set your max bid")}</div>
      <div style={{ fontSize: 16, color: theme.slate, marginTop: 8, lineHeight: 1.45 }}>
        {t(
          "Indica el máximo que deseas ofertar por este vehículo. Esto no realiza ningún cargo automático.",
          "Enter the most you're willing to bid on this vehicle. This does not make any automatic charge.",
        )}
      </div>
      <Input
        label={t("Mi tope de oferta", "My max bid")}
        value={value}
        placeholder={t("Escribe tu tope", "Enter your max")}
        active={active}
        height={60}
        fontSize={30}
        style={{ marginTop: 18 }}
        prefix={<span style={{ fontWeight: 900, color: theme.muted, fontSize: 26 }}>$</span>}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <Btn kind="ghost" style={{ flex: 1, fontSize: 17 }}>
          {t("Cancelar", "Cancel")}
        </Btn>
        <Btn kind="primary" style={{ flex: 2, fontSize: 17, transform: pressed ? "scale(0.96)" : undefined }}>
          {t("🔨 Quiero ofertar", "🔨 Place my bid")}
        </Btn>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Chat con asesor
export type ChatMsg = { from: "me" | "advisor"; text: string; show: number };

export const AdvisorChat: React.FC<{ status: string; msgs: ChatMsg[]; typing: boolean }> = ({ status, msgs, typing }) => {
  const t = useT();
  return (
    <div style={{ width: 580, borderRadius: 26, background: "#fff", boxShadow: "0 30px 80px rgba(15,23,42,.3)", overflow: "hidden", fontFamily: theme.ui }}>
      <div style={{ padding: "18px 22px", background: theme.text, color: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".11em", color: "#FCA5A5" }}>{t("ASISTENCIA DE PUJA", "BID ASSISTANCE")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="headset" size={26} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22 }}>{t("Continúa con un asesor", "Continue with an advisor")}</div>
            <div style={{ fontSize: 14, color: "#86EFAC", fontWeight: 700 }}>{t("● Sesión protegida", "● Secure session")}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "11px 18px", background: theme.panel2, borderBottom: `1px solid ${theme.line}`, fontSize: 14, color: theme.slate, fontWeight: 700 }}>{status}</div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12, minHeight: 250 }}>
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.from === "me" ? "flex-end" : "flex-start",
              maxWidth: "86%",
              padding: "12px 16px",
              borderRadius: m.from === "me" ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
              background: m.from === "me" ? "#EFF6FF" : theme.soft,
              border: `1px solid ${m.from === "me" ? "#BFDBFE" : theme.line}`,
              fontSize: 17,
              lineHeight: 1.4,
              color: theme.text,
              fontWeight: 600,
              opacity: m.show,
              transform: `translateY(${(1 - m.show) * 16}px)`,
              whiteSpace: "pre-line",
            }}
          >
            {m.text}
          </div>
        ))}
        {typing && <div style={{ alignSelf: "flex-start", padding: "10px 18px", borderRadius: 18, background: theme.soft, fontSize: 22, letterSpacing: 4, color: theme.muted }}>•••</div>}
      </div>
    </div>
  );
};
