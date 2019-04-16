"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONtoObject = JSONtoObject;
exports.debug = debug;
exports.getNamespace = getNamespace;

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _config = require("./../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renk teması
 */
const theme = {
  succes: "green",
  verbose: "grey",
  warn: "yellow",
  error: "red",
  default: "warn"
};

// Temayı ayarlama
/*
 * Sık kullanılan yardımcı metodlar
 * @auther Yunus Emre
 */

_colors2.default.setTheme(theme);

/**
 * Json'u objeye dönüştürme (parsing)
 * @param {string} str Dönüştürülecek json verisi
 * @return {JSON} JSON objesi veya boş obje
 */
function JSONtoObject(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    debug(getNamespace(__filename, JSONtoObject.name), "warn", `JSON: '${str}' objeye dönüştürülemedi`);
    return {};
  }
}

/**
 * Hata ayıklama modunda consola yazdırma
 * @param {string} namespace Hata ayıklayıcı adı `file:func`
 * @param {string} themeKey common.theme anahtarı
 * @param {string} msg Mesaj
 */
function debug(namespace, themeKey, msg) {
  themeKey = theme.hasOwnProperty(themeKey) ? themeKey : theme.default;
  (0, _debug2.default)(namespace)(_colors2.default[themeKey](`${msg}`));
}

/**
 * İsim alanını oluşturma
 * - *Not: Debug gibi fonksyionlarda kullanılılır.*
 * @param {string} filename `__filename`
 * @param {string} functionName Fonksiyon ismi
 * @return {string} İsim alanı `file:func`
 */
function getNamespace(filename, functionName) {
  const names = filename.split("\\");
  const key = parseInt(Object.keys(names).find(key => names[key] === "yemreak.com"));

  let namespace = "";
  for (let i = key + 1; i < names.length; i++) {
    namespace += names[i] + (i != names.length - 1 ? "\\" : ".");
  }
  namespace = namespace.replace(".js", "");

  return namespace + functionName;
}
//# sourceMappingURL=common.js.map