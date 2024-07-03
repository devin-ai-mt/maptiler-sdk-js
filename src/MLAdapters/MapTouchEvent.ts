/**
 * This is an extension of MapLibre BoxZoomHandler to make it fully type compatible with the SDK
 */

import maplibregl from "maplibre-gl";
import type { Map as MapMLGL } from "maplibre-gl";
import type { Map as SDKMap } from "../Map";

export class MapTouchEvent extends maplibregl.MapTouchEvent {
  constructor(type: string, map: SDKMap | MapMLGL, originalEvent: TouchEvent) {
    super(type, map as MapMLGL, originalEvent);
  }
}
