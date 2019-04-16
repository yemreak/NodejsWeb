// import { projectName } from "../config";

/*
 * Düzenleyici metodlar
 * @auther Yunus Emre
 */

/**
 * Http methodu kontrolünü sağlar
 * - *Not: Büyük-küçük harf duyarlı değildir*
 * @param {object} data Index.js"te tanımlanan veri objesidir
 * @param {string} httpMethod GET, set, Post ...
 * @return {boolean} Eğer eşit ise `true`
 */
export function checkDataMethod(data, httpMethod) {
  try {
    return data.method.toLowerCase() == httpMethod.toLowerCase();
  } catch (e) {
    return false;
  }
}

/**
 * Adres çubuğu yolu düzenleyici
 * @param {object} data Index.js"te tanımlanan veri objesidir
 * @return {string} Varsa adres çubuğundaki yolu yoksa `'index'` dizgisini döndürür
 */
export function dataTrimmedPathRegulator(data) {
  return data.trimmedPath == "" ? "index" : data.trimmedPath;
}

////////////////////////////////////////////////////////
// -------------- DÜZENLEYİCİ METODLAR -------------- //
////////////////////////////////////////////////////////

/**
 * Dizgiyi düzeltme
 * @param {string} str Dizgi
 * @param {boolean} force Dizgi olmaya zorlanmalı mı *(varsayılan false)*
 * @return {string | boolean} Dizgi düzgün ise kendisi, değilse false veya boş dizgi
 */
export function fixString(str, force = false) {
  return typeof str == "string" && str.trim().length > 0
    ? str.trim()
    : force
    ? ""
    : false;
}

/**
 * Durum kodu düzeltmesi
 * @param {number} statusCode Durum kodu (200, 404)
 * @return {number | boolean} Hata varsa false yoksa durum kodunu döndürür
 */
export function fixStatusCode(statusCode) {
  return typeof statusCode == 'number' ?
      statusCode :
      200;
}

/**
 * Uzantı türlerine göre, başlık tipleri
 */
export const contentTypes = {
  json: 'application/json',
  js: 'application/javascript',
  html: 'text/html',
  css: 'text/css',
  plain: 'text/plain',
  favicon: 'image/x-icon',
  png: 'image/png',
  jpg: 'image/jpg',
}

/**
 * İçerik tipi düzeltmesi
 * @param {string} contentType İçerik tipi (json, html, css..)
 * @return {string | boolean} Hata varsa false yoksa içerik tipini döndürür
 */
export function fixContentType(contentType) {
  return typeof contentType == 'string' ?
      contentType :
      'json';
}

/**
 * Yük (bilgayar verisi) düzeltme tipleri
 * - *Not: fixPayload içerisinde kullanılır*
 */
const payloadFixTypes = {
  json: fixPayloadForJSON,
  html: fixPayloadForHTML,
  default: fixPayloadForDefault
}

/**
 * Yükü düzeltme
 * @param {string} contentType İçerik tipi (json, html, css..) 
 * @param {object} payload Yük objesi
 * @return {string} Yük dizgisi
 */
export function fixPayload(contentType, payload) {
  // İçerik türüne göre yük (bilgisayar) verisi işleme
  return typeof payloadFixTypes[contentType] !== 'undefined' ?
      payloadFixTypes[contentType](payload) :
      payloadFixTypes['default'](payload);
}

/**
 * Yükü JSON için düzeltme
 * @param {object} payload Yük objesi
 * @return {string} JSON dizgisi
 */
export function fixPayloadForJSON(payload) {
  payload = typeof payload == 'object' ?
      payload : {};

  return JSON.stringify(payload);
}

/**
* Yükü HTML için düzeltme
* @param {string} payload Yük objesi
* @return {string} Yük dizgisi
*/
export function fixPayloadForHTML(payload) {
  return typeof payload == 'string' ?
      payload :
      '';
}

/**
* Yükü varsayılan olarak düzeltme
* @param {object} payload Yük objesi
* @return {string} Yük dizgisi
*/
export function fixPayloadForDefault(payload) {
  return typeof payload !== 'undefined' ?
      payload :
      '';
}