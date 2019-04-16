/*
 * Sayfa kalıbı işleyicileri
 */

import { dataTrimmedPathRegulator, checkDataMethod } from "../utils/regulators";
import { getFullTemplate, getTemplate, getNotFoundPage, getMarkdownTemplate } from "../utils/templates";
import { debug, getNamespace } from "../utils/common";

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
export function template(data, callback) {
  // Debug metni
  const namespace = getNamespace(__filename, template.name);

  // Sadece get metoduyla çalışır
  if (checkDataMethod(data, "get")) {
    const templateDir = dataTrimmedPathRegulator(data);

    getMarkdownTemplate(templateDir, templateString => {
      if (templateString) {
        debug(namespace, "succes", `'${templateDir}' için sayfa alımı başarılı`);
        callback(200, templateString, "html");
      } else {
        getNotFoundPage();
      }
    });
  } else {
    debug(namespace, "error", `'${data}' isteği ile gelen metot 'get' değil`);
    callback(
      405,
      {
        Info: "İstekle gelen metot hatalıdır :(",
        Detail: `Metot: ${data.method} /${data.trimmedPath}`
      },
      "json"
    );
  }
}
