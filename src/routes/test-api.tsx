import { useDataset, useDatasets } from "@/hooks/use-datasets";
import { useThemes } from "@/hooks/use-themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test-api")({
  component: TestApiPage,
});

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: ok ? "#006633" : "#cc0000",
        color: "#fff",
      }}
    >
      {ok ? "OK" : "ERRO"}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{ marginBottom: 32, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}
    >
      <div style={{ background: "#006633", color: "#fff", padding: "10px 16px", fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ padding: 16, background: "#fff" }}>{children}</div>
    </div>
  );
}

function JsonBlock({ data }: { data: unknown }) {
  return (
    <pre
      style={{
        background: "#f4f6f9",
        border: "1px solid #e0e0e0",
        borderRadius: 6,
        padding: 12,
        fontSize: 12,
        overflow: "auto",
        maxHeight: 300,
        margin: 0,
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// ── Testa GET /datasets ──────────────────────────────────────
function TestDatasets() {
  const { data, isLoading, isError, error } = useDatasets({ limit: 5 });

  return (
    <Section title="GET /api/datasets">
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <StatusBadge ok={!isError && !isLoading} />
        {isLoading && <span style={{ color: "#666" }}>Carregando...</span>}
        {isError && <span style={{ color: "#cc0000" }}>{String(error)}</span>}
        {data && <span style={{ color: "#006633" }}>{data.meta.total} datasets encontrados</span>}
      </div>
      {data && (
        <>
          <div style={{ marginBottom: 8, fontSize: 13, color: "#555" }}>
            Meta: total={data.meta.total} | limit={data.meta.limit} | hasMore=
            {String(data.meta.hasMore)}
          </div>
          <JsonBlock
            data={data.data.map((d) => ({
              slug: d.slug,
              title: d.title,
              theme: d.theme,
              version: d.version,
              features: d.features,
            }))}
          />
        </>
      )}
    </Section>
  );
}

// ── Testa GET /datasets/:slug ────────────────────────────────
function TestDatasetDetail() {
  const slug = "biomas-sistema-costeiro-marinho-ibge-2025";
  const { data, isLoading, isError, error } = useDataset(slug);

  return (
    <Section title={`GET /api/datasets/${slug}`}>
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <StatusBadge ok={!isError && !isLoading} />
        {isLoading && <span style={{ color: "#666" }}>Carregando...</span>}
        {isError && <span style={{ color: "#cc0000" }}>{String(error)}</span>}
        {data && <span style={{ color: "#006633" }}>{data.title}</span>}
      </div>
      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 4 }}>
              Dataset adaptado
            </div>
            <JsonBlock
              data={{
                slug: data.slug,
                source: data.source,
                theme: data.theme,
                themeLabel: data.themeLabel,
                geometry: data.geometry,
                version: data.version,
                features: data.features,
                license: data.license,
                indeCompliant: data.indeCompliant,
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 4 }}>
              URLs WMS/WFS geradas
            </div>
            <JsonBlock data={{ wms: data.wms, wfs: data.wfs }} />
          </div>
        </div>
      )}
    </Section>
  );
}

// ── Testa GET /themes ────────────────────────────────────────
function TestThemes() {
  const { data, isLoading, isError, error } = useThemes();

  return (
    <Section title="GET /api/themes">
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <StatusBadge ok={!isError && !isLoading} />
        {isLoading && <span style={{ color: "#666" }}>Carregando...</span>}
        {isError && <span style={{ color: "#cc0000" }}>{String(error)}</span>}
        {data && <span style={{ color: "#006633" }}>{data.length} temas encontrados</span>}
      </div>
      {data && (
        <JsonBlock
          data={data.map((t) => ({ code: t.code, name: t.name, datasetCount: t.datasetCount }))}
        />
      )}
    </Section>
  );
}

// ── Testa WMS do GeoServer diretamente ──────────────────────
function TestGeoServer() {
  const geoserverUrl = import.meta.env.VITE_GEOSERVER_URL ?? "http://localhost:8080/geoserver";
  const wmsUrl = `${geoserverUrl}/ecoview/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=ecoview:biomas&BBOX=-73.98,-33.75,-28.84,5.27&WIDTH=400&HEIGHT=300&SRS=EPSG:4674&FORMAT=image/png`;

  return (
    <Section title="GeoServer WMS — pnig:biomas">
      <div style={{ marginBottom: 12, fontSize: 13, color: "#555", wordBreak: "break-all" }}>
        <strong>URL:</strong> {wmsUrl}
      </div>
      <img
        src={wmsUrl}
        alt="WMS Biomas"
        style={{ border: "1px solid #ddd", borderRadius: 4, maxWidth: "100%" }}
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.outline = "2px solid #006633";
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.outline = "2px solid #cc0000";
          (e.target as HTMLImageElement).alt = "Erro ao carregar WMS";
        }}
      />
    </Section>
  );
}

// ── Página principal ─────────────────────────────────────────
function TestApiPage() {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
  const geoserverUrl = import.meta.env.VITE_GEOSERVER_URL ?? "http://localhost:8080/geoserver";

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: "#006633", margin: "0 0 4px" }}>EcoView — Teste de Integração</h1>
        <p style={{ color: "#666", margin: 0, fontSize: 14 }}>
          Página temporária para validar a integração com o backend.
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 13 }}>
          <div>
            <strong>API:</strong>{" "}
            <a
              href={`${apiUrl}/datasets`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#006633" }}
            >
              {apiUrl}
            </a>
          </div>
          <div>
            <strong>GeoServer:</strong>{" "}
            <a
              href={`${geoserverUrl}/web`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#006633" }}
            >
              {geoserverUrl}
            </a>
          </div>
        </div>
      </div>

      <TestDatasets />
      <TestDatasetDetail />
      <TestThemes />
      <TestGeoServer />

      <div style={{ textAlign: "center", color: "#aaa", fontSize: 12, marginTop: 24 }}>
        Remover esta página após validação — <code>src/routes/test-api.tsx</code>
      </div>
    </div>
  );
}
