import maplibregl__default, { GeolocateControl as GeolocateControl$1, LngLat as LngLat$1, Marker as Marker$1 } from 'maplibre-gl';
export * from 'maplibre-gl';
import { Base64 } from 'js-base64';
import { v4 } from 'uuid';
import EventEmitter from 'events';
import { config as config$1, MapStyle, mapStylePresetList, expandMapStyle, MapStyleVariant, ReferenceMapStyle, geolocation } from '@maptiler/client';
export { LanguageGeocoding, MapStyle, MapStyleVariant, ReferenceMapStyle, ServiceError, coordinates, data, geocoding, geolocation, staticMaps } from '@maptiler/client';

const Language = {
  AUTO: "auto",
  LATIN: "latin",
  NON_LATIN: "nonlatin",
  LOCAL: "",
  ALBANIAN: "sq",
  AMHARIC: "am",
  ARABIC: "ar",
  ARMENIAN: "hy",
  AZERBAIJANI: "az",
  BASQUE: "eu",
  BELORUSSIAN: "be",
  BOSNIAN: "bs",
  BRETON: "br",
  BULGARIAN: "bg",
  CATALAN: "ca",
  CHINESE: "zh",
  CORSICAN: "co",
  CROATIAN: "hr",
  CZECH: "cs",
  DANISH: "da",
  DUTCH: "nl",
  ENGLISH: "en",
  ESPERANTO: "eo",
  ESTONIAN: "et",
  FINNISH: "fi",
  FRENCH: "fr",
  FRISIAN: "fy",
  GEORGIAN: "ka",
  GERMAN: "de",
  GREEK: "el",
  HEBREW: "he",
  HINDI: "hi",
  HUNGARIAN: "hu",
  ICELANDIC: "is",
  INDONESIAN: "id",
  IRISH: "ga",
  ITALIAN: "it",
  JAPANESE: "ja",
  JAPANESE_HIRAGANA: "ja-Hira",
  JAPANESE_KANA: "ja_kana",
  JAPANESE_LATIN: "ja_rm",
  JAPANESE_2018: "ja-Latn",
  KANNADA: "kn",
  KAZAKH: "kk",
  KOREAN: "ko",
  KOREAN_LATIN: "ko-Latn",
  KURDISH: "ku",
  ROMAN_LATIN: "la",
  LATVIAN: "lv",
  LITHUANIAN: "lt",
  LUXEMBOURGISH: "lb",
  MACEDONIAN: "mk",
  MALAYALAM: "ml",
  MALTESE: "mt",
  NORWEGIAN: "no",
  OCCITAN: "oc",
  POLISH: "pl",
  PORTUGUESE: "pt",
  ROMANIAN: "ro",
  ROMANSH: "rm",
  RUSSIAN: "ru",
  SCOTTISH_GAELIC: "gd",
  SERBIAN_CYRILLIC: "sr",
  SERBIAN_LATIN: "sr-Latn",
  SLOVAK: "sk",
  SLOVENE: "sl",
  SPANISH: "es",
  SWEDISH: "sv",
  TAMIL: "ta",
  TELUGU: "te",
  THAI: "th",
  TURKISH: "tr",
  UKRAINIAN: "uk",
  WELSH: "cy"
};
const languagesIsoSet = new Set(Object.values(Language));
function isLanguageSupported(lang) {
  return languagesIsoSet.has(lang);
}
const languageCodeSet = new Set(Object.values(Language));
function getBrowserLanguage() {
  if (typeof navigator === "undefined") {
    return Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];
  }
  const canditatelangs = Array.from(
    new Set(navigator.languages.map((l) => l.split("-")[0]))
  ).filter((l) => languageCodeSet.has(l));
  return canditatelangs.length ? canditatelangs[0] : Language.LATIN;
}

class SdkConfig extends EventEmitter {
  constructor() {
    super();
    this.primaryLanguage = Language.AUTO;
    this.secondaryLanguage = null;
    this.session = true;
    this._unit = "metric";
    this._apiKey = "";
  }
  set unit(u) {
    this._unit = u;
    this.emit("unit", u);
  }
  get unit() {
    return this._unit;
  }
  set apiKey(k) {
    this._apiKey = k;
    config$1.apiKey = k;
    this.emit("apiKey", k);
  }
  get apiKey() {
    return this._apiKey;
  }
  set fetch(f) {
    config$1.fetch = f;
  }
  get fetch() {
    return config$1.fetch;
  }
}
const config = new SdkConfig();

const defaults = {
  maptilerLogoURL: "https://api.maptiler.com/resources/logo.svg",
  maptilerURL: "https://www.maptiler.com/",
  maptilerApiHost: "api.maptiler.com",
  rtlPluginURL: "https://cdn.maptiler.com/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.min.js",
  primaryLanguage: Language.AUTO,
  secondaryLanguage: Language.LOCAL,
  terrainSourceURL: "https://api.maptiler.com/tiles/terrain-rgb/tiles.json",
  terrainSourceId: "maptiler-terrain"
};
Object.freeze(defaults);

class CustomLogoControl extends maplibregl__default.LogoControl {
  constructor(options = {}) {
    var _a, _b;
    super(options);
    this.logoURL = "";
    this.linkURL = "";
    this.logoURL = (_a = options.logoURL) != null ? _a : defaults.maptilerLogoURL;
    this.linkURL = (_b = options.linkURL) != null ? _b : defaults.maptilerURL;
  }
  onAdd(map) {
    this._map = map;
    this._compact = this.options && this.options.compact;
    this._container = window.document.createElement("div");
    this._container.className = "maplibregl-ctrl";
    const anchor = window.document.createElement("a");
    anchor.style.backgroundRepeat = "no-repeat";
    anchor.style.cursor = "pointer";
    anchor.style.display = "block";
    anchor.style.height = "23px";
    anchor.style.margin = "0 0 -4px -4px";
    anchor.style.overflow = "hidden";
    anchor.style.width = "88px";
    anchor.style.backgroundImage = `url(${this.logoURL})`;
    anchor.style.backgroundSize = "100px 30px";
    anchor.style.width = "100px";
    anchor.style.height = "30px";
    anchor.target = "_blank";
    anchor.rel = "noopener nofollow";
    anchor.href = this.linkURL;
    anchor.setAttribute(
      "aria-label",
      this._map._getUIString("LogoControl.Title")
    );
    anchor.setAttribute("rel", "noopener nofollow");
    this._container.appendChild(anchor);
    this._container.style.display = "block";
    this._map.on("resize", this._updateCompact);
    this._updateCompact();
    return this._container;
  }
}

function enableRTL() {
  if (maplibregl__default.getRTLTextPluginStatus() === "unavailable") {
    maplibregl__default.setRTLTextPlugin(
      defaults.rtlPluginURL,
      null,
      true
    );
  }
}
function bindAll(fns, context) {
  fns.forEach((fn) => {
    if (!context[fn]) {
      return;
    }
    context[fn] = context[fn].bind(context);
  });
}
function DOMcreate(tagName, className, container) {
  const el = window.document.createElement(tagName);
  if (className !== void 0)
    el.className = className;
  if (container)
    container.appendChild(el);
  return el;
}
function DOMremove(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

function styleToStyle(style) {
  if (!style) {
    return MapStyle[mapStylePresetList[0].referenceStyleID].getDefaultVariant().getExpandedStyleURL();
  }
  if (typeof style === "string" || style instanceof String) {
    return expandMapStyle(style);
  }
  if (style instanceof MapStyleVariant) {
    return style.getExpandedStyleURL();
  }
  if (style instanceof ReferenceMapStyle) {
    return style.getDefaultVariant().getExpandedStyleURL();
  }
  return style;
}

class TerrainControl$1 {
  constructor() {
    bindAll(["_toggleTerrain", "_updateTerrainIcon"], this);
  }
  onAdd(map) {
    this._map = map;
    this._container = DOMcreate("div", "maplibregl-ctrl maplibregl-ctrl-group");
    this._terrainButton = DOMcreate(
      "button",
      "maplibregl-ctrl-terrain",
      this._container
    );
    DOMcreate("span", "maplibregl-ctrl-icon", this._terrainButton).setAttribute(
      "aria-hidden",
      "true"
    );
    this._terrainButton.type = "button";
    this._terrainButton.addEventListener("click", this._toggleTerrain);
    this._updateTerrainIcon();
    this._map.on("terrain", this._updateTerrainIcon);
    return this._container;
  }
  onRemove() {
    DOMremove(this._container);
    this._map.off("terrain", this._updateTerrainIcon);
    this._map = void 0;
  }
  _toggleTerrain() {
    if (this._map.hasTerrain()) {
      this._map.disableTerrain();
    } else {
      this._map.enableTerrain();
    }
    this._updateTerrainIcon();
  }
  _updateTerrainIcon() {
    this._terrainButton.classList.remove("maplibregl-ctrl-terrain");
    this._terrainButton.classList.remove("maplibregl-ctrl-terrain-enabled");
    if (this._map.hasTerrain()) {
      this._terrainButton.classList.add("maplibregl-ctrl-terrain-enabled");
      this._terrainButton.title = this._map._getUIString(
        "TerrainControl.disableTerrain"
      );
    } else {
      this._terrainButton.classList.add("maplibregl-ctrl-terrain");
      this._terrainButton.title = this._map._getUIString(
        "TerrainControl.enableTerrain"
      );
    }
  }
}

class MaptilerNavigationControl extends maplibregl__default.NavigationControl {
  constructor() {
    super({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    });
    this._compass.removeEventListener(
      "click",
      this._compass.clickFunction
    );
    this._compass.addEventListener("click", (e) => {
      {
        const currentPitch = this._map.getPitch();
        if (currentPitch === 0) {
          this._map.easeTo({ pitch: Math.min(this._map.getMaxPitch(), 80) });
        } else {
          if (this.options.visualizePitch) {
            this._map.resetNorthPitch({}, { originalEvent: e });
          } else {
            this._map.resetNorth({}, { originalEvent: e });
          }
        }
      }
    });
  }
  _createButton(className, fn) {
    const button = super._createButton(className, fn);
    button.clickFunction = fn;
    return button;
  }
  _rotateCompassArrow() {
    const rotate = this.options.visualizePitch ? `scale(${Math.min(
      1.5,
      1 / Math.pow(Math.cos(this._map.transform.pitch * (Math.PI / 180)), 0.5)
    )}) rotateX(${Math.min(70, this._map.transform.pitch)}deg) rotateZ(${this._map.transform.angle * (180 / Math.PI)}deg)` : `rotate(${this._map.transform.angle * (180 / Math.PI)}deg)`;
    this._compassIcon.style.transform = rotate;
  }
}

var __defProp$1 = Object.defineProperty;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
class CustomGeolocateControl extends GeolocateControl$1 {
  _updateCamera(position) {
    const center = new LngLat$1(position.coords.longitude, position.coords.latitude);
    const radius = position.coords.accuracy;
    const bearing = this._map.getBearing();
    const options = __spreadValues$1({
      bearing
    }, this.options.fitBoundsOptions);
    console.log("moving camera");
    this._map.fitBounds(center.toBounds(radius), options, {
      geolocateSource: true
    });
    let hasFittingBeenDisrupted = false;
    const flagFittingDisruption = () => {
      console.log("DISRUPTED FITTING!");
      hasFittingBeenDisrupted = true;
    };
    this._map.once("click", flagFittingDisruption);
    this._map.once("dblclick", flagFittingDisruption);
    this._map.once("dragstart", flagFittingDisruption);
    this._map.once("mousedown", flagFittingDisruption);
    this._map.once("touchstart", flagFittingDisruption);
    this._map.once("wheel", flagFittingDisruption);
    this._map.once("moveend", () => {
      console.log("done moving, with disruption:", hasFittingBeenDisrupted);
      this._map.off("click", flagFittingDisruption);
      this._map.off("dblclick", flagFittingDisruption);
      this._map.off("dragstart", flagFittingDisruption);
      this._map.off("mousedown", flagFittingDisruption);
      this._map.off("touchstart", flagFittingDisruption);
      this._map.off("wheel", flagFittingDisruption);
      if (hasFittingBeenDisrupted) {
        return;
      }
      this.lastUpdatedCenter = this._map.getCenter();
      this.lastUpdatedZoom = this._map.getZoom();
    });
  }
  _setupUI(supported) {
    this.lastUpdatedCenter = this._map.getCenter();
    this.lastUpdatedZoom = this._map.getZoom();
    this._container.addEventListener(
      "contextmenu",
      (e) => e.preventDefault()
    );
    this._geolocateButton = DOMcreate(
      "button",
      "maplibregl-ctrl-geolocate",
      this._container
    );
    DOMcreate(
      "span",
      "maplibregl-ctrl-icon",
      this._geolocateButton
    ).setAttribute("aria-hidden", "true");
    this._geolocateButton.type = "button";
    if (supported === false) {
      const title = this._map._getUIString(
        "GeolocateControl.LocationNotAvailable"
      );
      this._geolocateButton.disabled = true;
      this._geolocateButton.title = title;
      this._geolocateButton.setAttribute("aria-label", title);
    } else {
      const title = this._map._getUIString("GeolocateControl.FindMyLocation");
      this._geolocateButton.title = title;
      this._geolocateButton.setAttribute("aria-label", title);
    }
    if (this.options.trackUserLocation) {
      this._geolocateButton.setAttribute("aria-pressed", "false");
      this._watchState = "OFF";
    }
    if (this.options.showUserLocation) {
      this._dotElement = DOMcreate("div", "maplibregl-user-location-dot");
      this._userLocationDotMarker = new Marker$1(this._dotElement);
      this._circleElement = DOMcreate(
        "div",
        "maplibregl-user-location-accuracy-circle"
      );
      this._accuracyCircleMarker = new Marker$1({
        element: this._circleElement,
        pitchAlignment: "map"
      });
      if (this.options.trackUserLocation)
        this._watchState = "OFF";
      this._map.on("zoom", this._onZoom);
    }
    this._geolocateButton.addEventListener("click", this.trigger.bind(this));
    this._setup = true;
    if (this.options.trackUserLocation) {
      this._map.on("movestart", (event) => {
        const fromResize = event.originalEvent && event.originalEvent.type === "resize";
        console.log(this._map.getZoom());
        if (!event.geolocateSource && this._watchState === "ACTIVE_LOCK" && !fromResize) {
          this._watchState = "BACKGROUND";
          this._geolocateButton.classList.add(
            "maplibregl-ctrl-geolocate-background"
          );
          this._geolocateButton.classList.remove(
            "maplibregl-ctrl-geolocate-active"
          );
          this.fire(new Event("trackuserlocationend"));
        }
      });
    }
  }
}

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const MAPTILER_SESSION_ID = v4();
const GeolocationType = {
  POINT: "POINT",
  COUNTRY: "COUNTRY"
};
class Map extends maplibregl__default.Map {
  constructor(options) {
    var _a;
    const style = styleToStyle(options.style);
    console.log(style);
    const hashPreConstructor = location.hash;
    if (!config.apiKey) {
      console.warn(
        "MapTiler Cloud API key is not set. Visit https://maptiler.com and try Cloud for free!"
      );
    }
    super(__spreadProps(__spreadValues({}, options), {
      style,
      maplibreLogo: false,
      transformRequest: (url) => {
        const reqUrl = new URL(url);
        if (reqUrl.host === defaults.maptilerApiHost) {
          if (!reqUrl.searchParams.has("key")) {
            reqUrl.searchParams.append("key", config.apiKey);
          }
          if (config.session) {
            reqUrl.searchParams.append("mtsid", MAPTILER_SESSION_ID);
          }
        }
        return {
          url: reqUrl.href,
          headers: {}
        };
      }
    }));
    this.languageShouldUpdate = false;
    this.isStyleInitialized = false;
    this.isTerrainEnabled = false;
    this.terrainExaggeration = 1;
    this.once("styledata", () => __async(this, null, function* () {
      if (options.geolocate === false) {
        return;
      }
      if (options.center) {
        return;
      }
      if (options.hash && !!hashPreConstructor) {
        return;
      }
      try {
        if (options.geolocate === GeolocationType.COUNTRY) {
          yield this.fitToIpBounds();
          return;
        }
      } catch (e) {
        console.warn(e.message);
      }
      let ipLocatedCameraHash = null;
      try {
        yield this.centerOnIpPoint(options.zoom);
        ipLocatedCameraHash = this.getCameraHash();
      } catch (e) {
        console.warn(e.message);
      }
      const locationResult = yield navigator.permissions.query({
        name: "geolocation"
      });
      if (locationResult.state === "granted") {
        navigator.geolocation.getCurrentPosition(
          (data) => {
            if (ipLocatedCameraHash !== this.getCameraHash()) {
              return;
            }
            this.easeTo({
              center: [data.coords.longitude, data.coords.latitude],
              zoom: options.zoom || 12,
              duration: 2e3
            });
          },
          null,
          {
            maximumAge: 24 * 3600 * 1e3,
            timeout: 5e3,
            enableHighAccuracy: false
          }
        );
      }
    }));
    this.on("styledataloading", () => {
      this.languageShouldUpdate = !!config.primaryLanguage || !!config.secondaryLanguage;
    });
    this.on("styledata", () => {
      if (config.primaryLanguage && (this.languageShouldUpdate || !this.isStyleInitialized)) {
        this.setPrimaryLanguage(config.primaryLanguage);
      }
      if (config.secondaryLanguage && (this.languageShouldUpdate || !this.isStyleInitialized)) {
        this.setSecondaryLanguage(config.secondaryLanguage);
      }
      this.languageShouldUpdate = false;
      this.isStyleInitialized = true;
    });
    this.on("styledata", () => {
      if (this.getTerrain() === null && this.isTerrainEnabled) {
        this.enableTerrain(this.terrainExaggeration);
      }
    });
    this.once("load", () => __async(this, null, function* () {
      enableRTL();
    }));
    this.once("load", () => __async(this, null, function* () {
      let tileJsonContent = { logo: null };
      try {
        const possibleSources = Object.keys(this.style.sourceCaches).map((sourceName) => this.getSource(sourceName)).filter(
          (s) => typeof s.url === "string" && s.url.includes("tiles.json")
        );
        const styleUrl = new URL(
          possibleSources[0].url
        );
        if (!styleUrl.searchParams.has("key")) {
          styleUrl.searchParams.append("key", config.apiKey);
        }
        const tileJsonRes = yield fetch(styleUrl.href);
        tileJsonContent = yield tileJsonRes.json();
      } catch (e) {
      }
      if ("logo" in tileJsonContent && tileJsonContent.logo) {
        const logoURL = tileJsonContent.logo;
        this.addControl(
          new CustomLogoControl({ logoURL }),
          options.logoPosition
        );
        if (options.attributionControl === false) {
          this.addControl(new maplibregl__default.AttributionControl(options));
        }
      } else if (options.maptilerLogo) {
        this.addControl(new CustomLogoControl(), options.logoPosition);
      }
      if (options.scaleControl) {
        const position = options.scaleControl === true || options.scaleControl === void 0 ? "bottom-right" : options.scaleControl;
        const scaleControl = new maplibregl__default.ScaleControl({ unit: config.unit });
        this.addControl(scaleControl, position);
        config.on("unit", (unit) => {
          scaleControl.setUnit(unit);
        });
      }
      if (options.navigationControl !== false) {
        const position = options.navigationControl === true || options.navigationControl === void 0 ? "top-right" : options.navigationControl;
        this.addControl(new MaptilerNavigationControl(), position);
      }
      if (options.geolocateControl !== false) {
        const position = options.geolocateControl === true || options.geolocateControl === void 0 ? "top-right" : options.geolocateControl;
        this.addControl(
          new CustomGeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
              maximumAge: 0,
              timeout: 6e3
            },
            fitBoundsOptions: {
              maxZoom: 15
            },
            trackUserLocation: true,
            showAccuracyCircle: true,
            showUserLocation: true
          }),
          position
        );
      }
      if (options.terrainControl) {
        const position = options.terrainControl === true || options.terrainControl === void 0 ? "top-right" : options.terrainControl;
        this.addControl(new TerrainControl$1(), position);
      }
      if (options.fullscreenControl) {
        const position = options.fullscreenControl === true || options.fullscreenControl === void 0 ? "top-right" : options.fullscreenControl;
        this.addControl(new maplibregl__default.FullscreenControl({}), position);
      }
    }));
    if (options.terrain) {
      this.enableTerrain(
        (_a = options.terrainExaggeration) != null ? _a : this.terrainExaggeration
      );
    }
  }
  setStyle(style, options) {
    return super.setStyle(styleToStyle(style), options);
  }
  setLanguage(language = defaults.primaryLanguage) {
    if (language === Language.AUTO) {
      return this.setLanguage(getBrowserLanguage());
    }
    this.setPrimaryLanguage(language);
  }
  setPrimaryLanguage(language = defaults.primaryLanguage) {
    if (!isLanguageSupported(language)) {
      return;
    }
    this.onStyleReady(() => {
      if (language === Language.AUTO) {
        return this.setPrimaryLanguage(getBrowserLanguage());
      }
      config.primaryLanguage = language;
      const layers = this.getStyle().layers;
      const strLanguageRegex = /^\s*{\s*name\s*(:\s*(\S*))?\s*}$/;
      const strLanguageInArrayRegex = /^\s*name\s*(:\s*(\S*))?\s*$/;
      const strBilingualRegex = /^\s*{\s*name\s*(:\s*(\S*))?\s*}(\s*){\s*name\s*(:\s*(\S*))?\s*}$/;
      const strMoreInfoRegex = /^(.*)({\s*name\s*(:\s*(\S*))?\s*})(.*)$/;
      const langStr = language ? `name:${language}` : "name";
      const replacer = [
        "case",
        ["has", langStr],
        ["get", langStr],
        ["get", "name:latin"]
      ];
      for (let i = 0; i < layers.length; i += 1) {
        const layer = layers[i];
        const layout = layer.layout;
        if (!layout) {
          continue;
        }
        if (!layout["text-field"]) {
          continue;
        }
        const textFieldLayoutProp = this.getLayoutProperty(
          layer.id,
          "text-field"
        );
        let regexMatch;
        if (Array.isArray(textFieldLayoutProp) && textFieldLayoutProp.length >= 2 && textFieldLayoutProp[0].trim().toLowerCase() === "concat") {
          const newProp = textFieldLayoutProp.slice();
          for (let j = 0; j < textFieldLayoutProp.length; j += 1) {
            const elem = textFieldLayoutProp[j];
            if ((typeof elem === "string" || elem instanceof String) && strLanguageRegex.exec(elem.toString())) {
              newProp[j] = replacer;
              break;
            } else if (Array.isArray(elem) && elem.length >= 2 && elem[0].trim().toLowerCase() === "get" && strLanguageInArrayRegex.exec(elem[1].toString())) {
              newProp[j] = replacer;
              break;
            } else if (Array.isArray(elem) && elem.length === 4 && elem[0].trim().toLowerCase() === "case") {
              newProp[j] = replacer;
              break;
            }
          }
          this.setLayoutProperty(layer.id, "text-field", newProp);
        } else if (Array.isArray(textFieldLayoutProp) && textFieldLayoutProp.length >= 2 && textFieldLayoutProp[0].trim().toLowerCase() === "get" && strLanguageInArrayRegex.exec(textFieldLayoutProp[1].toString())) {
          const newProp = replacer;
          this.setLayoutProperty(layer.id, "text-field", newProp);
        } else if ((typeof textFieldLayoutProp === "string" || textFieldLayoutProp instanceof String) && strLanguageRegex.exec(textFieldLayoutProp.toString())) {
          const newProp = replacer;
          this.setLayoutProperty(layer.id, "text-field", newProp);
        } else if (Array.isArray(textFieldLayoutProp) && textFieldLayoutProp.length === 4 && textFieldLayoutProp[0].trim().toLowerCase() === "case") {
          const newProp = replacer;
          this.setLayoutProperty(layer.id, "text-field", newProp);
        } else if ((typeof textFieldLayoutProp === "string" || textFieldLayoutProp instanceof String) && (regexMatch = strBilingualRegex.exec(
          textFieldLayoutProp.toString()
        )) !== null) {
          const newProp = `{${langStr}}${regexMatch[3]}{name${regexMatch[4] || ""}}`;
          this.setLayoutProperty(layer.id, "text-field", newProp);
        } else if ((typeof textFieldLayoutProp === "string" || textFieldLayoutProp instanceof String) && (regexMatch = strMoreInfoRegex.exec(
          textFieldLayoutProp.toString()
        )) !== null) {
          const newProp = `${regexMatch[1]}{${langStr}}${regexMatch[5]}`;
          this.setLayoutProperty(layer.id, "text-field", newProp);
        }
      }
    });
  }
  setSecondaryLanguage(language = defaults.secondaryLanguage) {
    if (!isLanguageSupported(language)) {
      return;
    }
    this.onStyleReady(() => {
      if (language === Language.AUTO) {
        return this.setSecondaryLanguage(getBrowserLanguage());
      }
      config.secondaryLanguage = language;
      const layers = this.getStyle().layers;
      const strLanguageRegex = /^\s*{\s*name\s*(:\s*(\S*))?\s*}$/;
      const strLanguageInArrayRegex = /^\s*name\s*(:\s*(\S*))?\s*$/;
      const strBilingualRegex = /^\s*{\s*name\s*(:\s*(\S*))?\s*}(\s*){\s*name\s*(:\s*(\S*))?\s*}$/;
      let regexMatch;
      for (let i = 0; i < layers.length; i += 1) {
        const layer = layers[i];
        const layout = layer.layout;
        if (!layout) {
          continue;
        }
        if (!layout["text-field"]) {
          continue;
        }
        const textFieldLayoutProp = this.getLayoutProperty(
          layer.id,
          "text-field"
        );
        let newProp;
        if (Array.isArray(textFieldLayoutProp) && textFieldLayoutProp.length >= 2 && textFieldLayoutProp[0].trim().toLowerCase() === "concat") {
          newProp = textFieldLayoutProp.slice();
          let languagesAlreadyFound = 0;
          for (let j = 0; j < textFieldLayoutProp.length; j += 1) {
            const elem = textFieldLayoutProp[j];
            if ((typeof elem === "string" || elem instanceof String) && strLanguageRegex.exec(elem.toString())) {
              if (languagesAlreadyFound === 1) {
                newProp[j] = `{name:${language}}`;
                break;
              }
              languagesAlreadyFound += 1;
            } else if (Array.isArray(elem) && elem.length >= 2 && elem[0].trim().toLowerCase() === "get" && strLanguageInArrayRegex.exec(elem[1].toString())) {
              if (languagesAlreadyFound === 1) {
                newProp[j][1] = `name:${language}`;
                break;
              }
              languagesAlreadyFound += 1;
            } else if (Array.isArray(elem) && elem.length === 4 && elem[0].trim().toLowerCase() === "case") {
              if (languagesAlreadyFound === 1) {
                newProp[j] = ["get", `name:${language}`];
                break;
              }
              languagesAlreadyFound += 1;
            }
          }
          this.setLayoutProperty(layer.id, "text-field", newProp);
        } else if ((typeof textFieldLayoutProp === "string" || textFieldLayoutProp instanceof String) && (regexMatch = strBilingualRegex.exec(
          textFieldLayoutProp.toString()
        )) !== null) {
          const langStr = language ? `name:${language}` : "name";
          newProp = `{name${regexMatch[1] || ""}}${regexMatch[3]}{${langStr}}`;
          this.setLayoutProperty(layer.id, "text-field", newProp);
        }
      }
    });
  }
  getTerrainExaggeration() {
    return this.terrainExaggeration;
  }
  hasTerrain() {
    return this.isTerrainEnabled;
  }
  enableTerrain(exaggeration = this.terrainExaggeration) {
    if (exaggeration < 0) {
      console.warn("Terrain exaggeration cannot be negative.");
      return;
    }
    const terrainInfo = this.getTerrain();
    const addTerrain = () => {
      this.isTerrainEnabled = true;
      this.terrainExaggeration = exaggeration;
      this.addSource(defaults.terrainSourceId, {
        type: "raster-dem",
        url: defaults.terrainSourceURL
      });
      this.setTerrain({
        source: defaults.terrainSourceId,
        exaggeration
      });
    };
    if (terrainInfo) {
      this.setTerrain(__spreadProps(__spreadValues({}, terrainInfo), { exaggeration }));
      return;
    }
    if (this.loaded() || this.isTerrainEnabled) {
      addTerrain();
    } else {
      this.once("load", () => {
        if (this.getTerrain() && this.getSource(defaults.terrainSourceId)) {
          return;
        }
        addTerrain();
      });
    }
  }
  disableTerrain() {
    this.isTerrainEnabled = false;
    this.setTerrain(null);
    if (this.getSource(defaults.terrainSourceId)) {
      this.removeSource(defaults.terrainSourceId);
    }
  }
  setTerrainExaggeration(exaggeration) {
    this.enableTerrain(exaggeration);
  }
  onStyleReady(cb) {
    if (this.isStyleLoaded()) {
      cb();
    } else {
      this.once("styledata", () => {
        cb();
      });
    }
  }
  fitToIpBounds() {
    return __async(this, null, function* () {
      const ipGeolocateResult = yield geolocation.info();
      this.fitBounds(
        ipGeolocateResult.country_bounds,
        {
          duration: 0,
          padding: 100
        }
      );
    });
  }
  centerOnIpPoint(zoom) {
    return __async(this, null, function* () {
      const ipGeolocateResult = yield geolocation.info();
      this.jumpTo({
        center: [ipGeolocateResult.longitude, ipGeolocateResult.latitude],
        zoom: zoom || 11
      });
    });
  }
  getCameraHash() {
    const hashBin = new Float32Array(5);
    const center = this.getCenter();
    hashBin[0] = center.lng;
    hashBin[1] = center.lat;
    hashBin[2] = this.getZoom();
    hashBin[3] = this.getPitch();
    hashBin[4] = this.getBearing();
    return Base64.fromUint8Array(new Uint8Array(hashBin.buffer));
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  _matMult(m) {
    const x = m[0] * this.x + m[1] * this.y;
    const y = m[2] * this.x + m[3] * this.y;
    this.x = x;
    this.y = y;
    return this;
  }
  _add(p) {
    this.x += p.x;
    this.y += p.y;
    return this;
  }
  _sub(p) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }
  _mult(k) {
    this.x *= k;
    this.y *= k;
    return this;
  }
  _div(k) {
    this.x /= k;
    this.y /= k;
    return this;
  }
  _multByPoint(p) {
    this.x *= p.x;
    this.y *= p.y;
    return this;
  }
  _divByPoint(p) {
    this.x /= p.x;
    this.y /= p.y;
    return this;
  }
  _unit() {
    this._div(this.mag());
    return this;
  }
  _perp() {
    const y = this.y;
    this.y = this.x;
    this.x = -y;
    return this;
  }
  _rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = cos * this.x - sin * this.y;
    const y = sin * this.x + cos * this.y;
    this.x = x;
    this.y = y;
    return this;
  }
  _rotateAround(angle, p) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y);
    const y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
    this.x = x;
    this.y = y;
    return this;
  }
  _round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  clone() {
    return new Point(this.x, this.y);
  }
  add(p) {
    return this.clone()._add(p);
  }
  sub(p) {
    return this.clone()._sub(p);
  }
  multByPoint(p) {
    return this.clone()._multByPoint(p);
  }
  divByPoint(p) {
    return this.clone()._divByPoint(p);
  }
  mult(k) {
    return this.clone()._mult(k);
  }
  div(k) {
    return this.clone()._div(k);
  }
  rotate(a) {
    return this.clone()._rotate(a);
  }
  rotateAround(a, p) {
    return this.clone()._rotateAround(a, p);
  }
  matMult(m) {
    return this.clone()._matMult(m);
  }
  unit() {
    return this.clone()._unit();
  }
  perp() {
    return this.clone()._perp();
  }
  round() {
    return this.clone()._round();
  }
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  dist(p) {
    return Math.sqrt(this.distSqr(p));
  }
  distSqr(p) {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    return dx * dx + dy * dy;
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  angleTo(b) {
    return Math.atan2(this.y - b.y, this.x - b.x);
  }
  angleWith(b) {
    return this.angleWithSep(b.x, b.y);
  }
  angleWithSep(x, y) {
    return Math.atan2(this.x * y - this.y * x, this.x * x + this.y * y);
  }
  static convert(a) {
    if (a instanceof Point) {
      return a;
    }
    if (Array.isArray(a)) {
      return new Point(a[0], a[1]);
    }
    return a;
  }
}

const {
  supported,
  setRTLTextPlugin,
  getRTLTextPluginStatus,
  NavigationControl,
  GeolocateControl,
  AttributionControl,
  LogoControl,
  ScaleControl,
  FullscreenControl,
  TerrainControl,
  Popup,
  Marker,
  Style,
  LngLat,
  LngLatBounds,
  MercatorCoordinate,
  Evented,
  AJAXError,
  CanvasSource,
  GeoJSONSource,
  ImageSource,
  RasterDEMTileSource,
  RasterTileSource,
  VectorTileSource,
  VideoSource,
  prewarm,
  clearPrewarmedResources,
  version,
  workerCount,
  maxParallelImageRequests,
  clearStorage,
  workerUrl,
  addProtocol,
  removeProtocol
} = maplibregl__default;

export { AJAXError, AttributionControl, CanvasSource, Evented, FullscreenControl, GeoJSONSource, GeolocateControl, GeolocationType, ImageSource, Language, LngLat, LngLatBounds, LogoControl, Map, Marker, MercatorCoordinate, NavigationControl, Point, Popup, RasterDEMTileSource, RasterTileSource, ScaleControl, SdkConfig, Style, TerrainControl, VectorTileSource, VideoSource, addProtocol, clearPrewarmedResources, clearStorage, config, getRTLTextPluginStatus, maxParallelImageRequests, prewarm, removeProtocol, setRTLTextPlugin, supported, version, workerCount, workerUrl };
//# sourceMappingURL=maptiler-sdk.mjs.map
