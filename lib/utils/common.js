/*
 * Sık kullanılan yardımcı metodlar
 * @auther Yunus Emre
 */

import colors from "colors";
import debugLog from "debug";
import { projectName } from "./../config";

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
colors.setTheme(theme);

/**
 * Json'u objeye dönüştürme (parsing)
 * @param {string} str Dönüştürülecek json verisi
 * @return {JSON} JSON objesi veya boş obje
 */
export function JSONtoObject(str) {
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
export function debug(namespace, themeKey, msg) {
  themeKey = theme.hasOwnProperty(themeKey) ? themeKey : theme.default;
  debugLog(namespace)(colors[themeKey](`${msg}`));
}

/**
 * İsim alanını oluşturma
 * - *Not: Debug gibi fonksyionlarda kullanılılır.*
 * @param {string} filename `__filename`
 * @param {string} functionName Fonksiyon ismi
 * @return {string} İsim alanı `file:func`
 */
export function getNamespace(filename, functionName) {
  const names = filename.split("\\");
  const key = parseInt(Object.keys(names).find(key => names[key] === "yemreak.com"));
  
  let namespace = "";
  for (let i = key + 1; i < names.length; i++) {
    namespace += names[i] + (i != (names.length - 1) ? "\\" : ".");
  }
  namespace = namespace.replace(".js", "");

  return namespace + functionName;
}