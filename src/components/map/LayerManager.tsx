import { GeometryIcon } from "@/components/catalog/GeometryIcon";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Layer, LayerGroup } from "@/types/layer";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart,
  Book,
  Building,
  ChevronDown,
  Cloud,
  Droplet,
  Flame,
  GripVertical,
  Hammer,
  Heart,
  Info,
  Layers,
  Leaf,
  Map as MapIcon,
  Mountain,
  Search,
  Shield,
  Trees,
  Truck,
  Users,
  Wheat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DynamicIcon } from "../common/DynamicIcon";

// Mapeamento completo de string → componente Lucide
const ICONS: Record<string, LucideIcon> = {
  map: MapIcon,
  trees: Trees,
  shield: Shield,
  flame: Flame,
  droplet: Droplet,
  users: Users,
  building: Building,
  "bar-chart": BarChart,
  "alert-triangle": AlertTriangle,
  cloud: Cloud,
  leaf: Leaf,
  heart: Heart,
  book: Book,
  truck: Truck,
  zap: Zap,
  wheat: Wheat,
  layers: Layers,
  hammer: Hammer,
  mountain: Mountain,
};

interface LayerManagerProps {
  groups: LayerGroup[];
  onChange: (groups: LayerGroup[]) => void;
  onGroupSelect?: (groupId: string) => void;
  // Quando o painel abre focado num grupo específico
  focusGroupId?: string | null;
  onFocusHandled?: () => void;
}

export function LayerManager({
  groups,
  onChange,
  onGroupSelect,
  focusGroupId,
  onFocusHandled,
}: LayerManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.id, true])),
  );

  // Quando recebe um focusGroupId, garante que esse grupo está aberto
  useEffect(() => {
    if (focusGroupId) {
      setOpenGroups((s) => ({ ...s, [focusGroupId]: true }));
      onFocusHandled?.();
    }
  }, [focusGroupId, onFocusHandled]);

  const filtered = groups.map((g) => ({
    ...g,
    layers: g.layers.filter((l) =>
      query ? l.name.toLowerCase().includes(query.toLowerCase()) : true,
    ),
  }));

  const totalActive = groups.reduce((a, g) => a + g.layers.filter((l) => l.visible).length, 0);

  const updateLayer = (groupId: string, layerId: string, patch: Partial<Layer>) => {
    onChange(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, layers: g.layers.map((l) => (l.id === layerId ? { ...l, ...patch } : l)) }
          : g,
      ),
    );
  };

  const reorderGroup = (groupId: string, oldIndex: number, newIndex: number) => {
    onChange(
      groups.map((g) =>
        g.id === groupId ? { ...g, layers: arrayMove(g.layers, oldIndex, newIndex) } : g,
      ),
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Camadas
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {totalActive} ativa{totalActive === 1 ? "" : "s"} de{" "}
              {groups.reduce((a, g) => a + g.layers.length, 0)}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Layer Manager
          </span>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar camadas…"
            aria-label="Filtrar camadas"
            className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="eco-scroll flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            Nenhuma camada disponível.
          </p>
        )}
        {filtered.map((group) => {
          const Icon = ICONS[group.icon] ?? MapIcon;
          const iconColor = group.color ?? "var(--color-primary)";
          const open = openGroups[group.id];
          const originalGroup = groups.find((g) => g.id === group.id)!;
          const activeCount = originalGroup.layers.filter((l) => l.visible).length;

          return (
            <div key={group.id} className="border-b border-border/70 last:border-b-0">
              <button
                onClick={() => {
                  const isNowOpen = !open;
                  setOpenGroups((s) => ({ ...s, [group.id]: isNowOpen }));
                  // Se o painel estava fechado, notifica o pai para abrir
                  if (isNowOpen && onGroupSelect) {
                    onGroupSelect(group.id);
                  }
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
                aria-expanded={open}
                title={group.name}
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                  style={{
                    backgroundColor: `${iconColor}18`,
                    color: iconColor,
                  }}
                >
                  <DynamicIcon
                    name={group.icon}
                    fallback="map"
                    className="h-4 w-4"
                    strokeWidth={1.7}
                  />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {group.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {activeCount}/{originalGroup.layers.length} ativas
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>

              {open && group.layers.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e: DragEndEvent) => {
                    const { active, over } = e;
                    if (!over || active.id === over.id) return;
                    const oldIndex = originalGroup.layers.findIndex((l) => l.id === active.id);
                    const newIndex = originalGroup.layers.findIndex((l) => l.id === over.id);
                    if (oldIndex !== -1 && newIndex !== -1) {
                      reorderGroup(group.id, oldIndex, newIndex);
                    }
                  }}
                >
                  <SortableContext
                    items={group.layers.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="pb-2">
                      {group.layers.map((layer) => (
                        <SortableLayerItem
                          key={layer.id}
                          layer={layer}
                          onToggle={(visible) => updateLayer(group.id, layer.id, { visible })}
                          onOpacity={(opacity) => updateLayer(group.id, layer.id, { opacity })}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              )}

              {open && group.layers.length === 0 && (
                <p className="px-4 pb-3 text-xs text-muted-foreground">
                  Nenhuma camada encontrada.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Collapsed sidebar icons ───────────────────────────────────
// Renderizado pelo index.tsx quando leftOpen = false

interface CollapsedLayerIconsProps {
  groups: LayerGroup[];
  onGroupClick: (groupId: string) => void;
}

export function CollapsedLayerIcons({ groups, onGroupClick }: CollapsedLayerIconsProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      {groups.map((group) => {
        const Icon = ICONS[group.icon] ?? MapIcon;
        const iconColor = group.color ?? "var(--color-primary)";
        const activeCount = group.layers.filter((l) => l.visible).length;

        return (
          <button
            key={group.id}
            onClick={() => onGroupClick(group.id)}
            title={group.name}
            className="relative grid h-9 w-9 place-items-center rounded-lg transition-colors hover:bg-muted"
            style={{ color: iconColor }}
            aria-label={`Abrir grupo ${group.name}`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.7} />
            {activeCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold text-white"
                style={{ backgroundColor: iconColor }}
              >
                {activeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── SortableLayerItem ─────────────────────────────────────────

interface SortableLayerItemProps {
  layer: Layer;
  onToggle: (visible: boolean) => void;
  onOpacity: (opacity: number) => void;
}

function SortableLayerItem({ layer, onToggle, onOpacity }: SortableLayerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layer.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "mx-2 mb-1.5 rounded-lg border px-2.5 py-2 transition-colors",
        layer.visible ? "border-primary/40 bg-primary/5" : "border-transparent hover:bg-muted/50",
      )}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-0.5 text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Reordenar ${layer.name}`}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <span
          className="grid h-6 w-6 shrink-0 place-items-center rounded"
          style={{ backgroundColor: `${layer.color}22`, color: layer.color }}
        >
          <GeometryIcon type={layer.geometry} className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium text-foreground">{layer.name}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {layer.source}
          </div>
        </div>
        {layer.datasetSlug && (
          <Link
            to="/catalogo/$slug"
            params={{ slug: layer.datasetSlug }}
            className="grid h-6 w-6 place-items-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Informações sobre ${layer.name}`}
          >
            <Info className="h-3.5 w-3.5" />
          </Link>
        )}
        <Switch
          checked={layer.visible}
          onCheckedChange={onToggle}
          aria-label={`Alternar visibilidade de ${layer.name}`}
        />
      </div>
      {layer.visible && (
        <div className="mt-2.5 flex items-center gap-2 pl-8">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Opacidade
          </span>
          <Slider
            value={[Math.round(layer.opacity * 100)]}
            min={0}
            max={100}
            step={5}
            onValueChange={(v) => onOpacity((v[0] ?? 100) / 100)}
            aria-label={`Opacidade de ${layer.name}`}
            className="flex-1"
          />
          <span className="w-8 text-right text-[10px] font-medium text-foreground tabular-nums">
            {Math.round(layer.opacity * 100)}%
          </span>
        </div>
      )}
    </li>
  );
}
