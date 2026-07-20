import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DynamicFilter, defaultFilters, type DashboardFilters } from "@/components/dashboard/DynamicFilter";
import {
  biomaDistribuicao,
  dashboardMetrics,
  desmatamentoAnual,
  queimadasMensais,
  rankingUFs,
} from "@/mock/chartData";
import { Activity, Database, Flame, MapPin, Trees } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard BI — EcoView" },
      {
        name: "description",
        content:
          "Business Intelligence geoespacial: cruze datasets ambientais, territoriais e socioeconômicos com filtros dinâmicos.",
      },
      { property: "og:title", content: "Dashboard BI — EcoView" },
    ],
  }),
  component: DashboardPage,
});

const PIE_COLORS = ["#006633", "#669933", "#CCCC33", "#a86b2a", "#0369a1", "#7c3aed"];
const METRIC_ICONS = [
  <Database key="d" className="h-4 w-4" strokeWidth={1.8} />,
  <MapPin key="m" className="h-4 w-4" strokeWidth={1.8} />,
  <Activity key="a" className="h-4 w-4" strokeWidth={1.8} />,
  <Flame key="f" className="h-4 w-4" strokeWidth={1.8} />,
];

function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 lg:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Business Intelligence
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Dashboard Nacional
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Cruze datasets, aplique operadores lógicos e visualize indicadores ambientais e territoriais.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
            <Trees className="h-3.5 w-3.5 text-primary" />
            <span>Mock — pronto para conectar a datasources reais</span>
          </div>
        </div>

        <DynamicFilter filters={filters} onChange={setFilters} onApply={() => {}} />

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dashboardMetrics.map((m, i) => (
            <MetricCard
              key={m.key}
              label={m.label}
              value={m.value}
              delta={m.delta}
              trend={m.trend}
              icon={METRIC_ICONS[i]}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard
            title="Desmatamento anual — Amazônia Legal"
            subtitle="Área (km²) por ciclo PRODES"
            className="lg:col-span-2"
          >
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={desmatamentoAnual} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="ano" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                    contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
                    formatter={(v: number) => [`${formatNumber(v)} km²`, "Área"]}
                  />
                  <Bar dataKey="area" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Distribuição por bioma" subtitle="Cobertura territorial (%)">
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={biomaDistribuicao}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={44}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {biomaDistribuicao.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, ""]}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard
            title="Focos de queimadas — sazonalidade"
            subtitle="Média mensal dos últimos 5 anos"
            className="lg:col-span-2"
          >
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={queimadasMensais} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
                    formatter={(v: number) => [formatNumber(v), "Focos"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="focos"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "var(--color-primary)" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Ranking UFs (Amazônia Legal)" subtitle="Desmatamento e focos">
            <div className="eco-scroll max-h-72 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 font-semibold">UF</th>
                    <th className="py-2 text-right font-semibold">Desmat. (km²)</th>
                    <th className="py-2 text-right font-semibold">Focos</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingUFs.map((r) => (
                    <tr key={r.uf} className="border-b border-border/50 last:border-b-0">
                      <td className="py-2 font-medium text-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          {r.uf}
                        </span>
                      </td>
                      <td className="py-2 text-right tabular-nums text-foreground">
                        {formatNumber(r.desmatamento)}
                      </td>
                      <td className="py-2 text-right tabular-nums text-muted-foreground">
                        {formatNumber(r.focos)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}
