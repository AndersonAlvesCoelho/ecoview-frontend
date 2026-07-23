import { GeometryType } from "@/types/dataset";

export const GEOMETRY_MAP: Record<string, GeometryType> = {
  POINT: "point",
  MULTIPOINT: "point",
  LINESTRING: "line",
  MULTILINESTRING: "line",
  POLYGON: "polygon",
  MULTIPOLYGON: "polygon",
  RASTER: "raster",
};
