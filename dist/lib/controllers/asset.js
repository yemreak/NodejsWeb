"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asset = asset;

var _regulators = require("../utils/regulators");

var _assets = require("../utils/assets");

var _templates = require("../utils/templates");

var _common = require("../utils/common");

/**
 * Örnek: localhost:3000/indeks yazıldığında bu fonksiyon çalışır.
 *
 * Not: ornek, yönlendirici 'nin bir objesidir.
 *
 * @param {object} data Index.js'te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, string, string):void} callback İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg0: HTTP yanıtı veya tanımsızlık
 ** arg1: İçerik tipi (Content-type) [http, json vs.]
 */
/*
 * Statik veri işleyicileri
 */

function asset(data, callback) {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, asset.name);

  // Sadece get metodu ile çalışır
  if ((0, _regulators.checkDataMethod)(data, "get")) {
    // İstenilen dosya ismini kırpılmış yoldan alma
    const assetName = data.trimmedPath.trim();
    if (assetName.lenght > 0) {
      (0, _assets.getStaticAsset)(assetName, asset => {
        if (asset) {
          debug(namespace, "succes", `'${assetName}' için sayfa alımı başarılı`);
          callback(200, asset, (0, _assets.figureContentType)(assetName));
        } else {
          debug(namespace, "warn", `'${assetName}' için kaynak bulunamadı`);
          (0, _templates.getNotFoundPage)(callback);
        }
      });
    }
  } else {
    debug(namespace, "error", `'${data}' isteği ile gelen metot 'get' değil`);
    callback(405, {
      Info: "İstekle gelen metot hatalıdır :(",
      Detail: `Metot: ${data.method} /${data.trimmedPath}`
    }, "json");
  }
}
//# sourceMappingURL=asset.js.map