"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = template;

var _regulators = require("../utils/regulators");

var _templates = require("../utils/templates");

var _common = require("../utils/common");

const marked = require("marked");

/**
 * Site kalıplarının işleyicisi
 * - *Örnek: `localhost:3000/<templateName>` yazıldığında bu fonksiyon çalışır.*
 * - *Not: `templateName`, adres çubuğuna yazılan kalıp ismidir. (index, account/create)*
 * @param {object} data Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, string, string):void} callback İşlemler bittiği zaman verilen yanıt
 * - *arg0: HTTP varsayılan durum kodları*
 * - *arg0: HTTP yanıtı veya ilgili ek açıklamalar {Info, Detail?}*
 * - *arg1: İçerik tipi (Content-type) [http, json vs.]*
 */
/*
 * Sayfa kalıbı işleyicileri
 */

function template(data, callback) {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, template.name);

  // Sadece get metoduyla çalışır
  if ((0, _regulators.checkDataMethod)(data, "get")) {
    const templateDir = (0, _regulators.dataTrimmedPathRegulator)(data);

    (0, _templates.getMarkdownTemplate)(templateDir, templateString => {
      if (templateString) {
        (0, _common.debug)(namespace, "succes", `'${templateDir}' için sayfa alımı başarılı`);
        callback(200, templateString, "html");
      } else {
        (0, _templates.getNotFoundPage)();
      }
    });
  } else {
    (0, _common.debug)(namespace, "error", `'${data}' isteği ile gelen metot 'get' değil`);
    callback(405, {
      Info: "İstekle gelen metot hatalıdır :(",
      Detail: `Metot: ${data.method} /${data.trimmedPath}`
    }, "json");
  }
}
//# sourceMappingURL=template.js.map