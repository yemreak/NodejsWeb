/*
 * Statik veri işleyicileri
 */

import { checkDataMethod } from "../utils/regulators";
import { getStaticAsset, figureContentType } from "../utils/assets";
import { getNotFoundPage } from "../utils/templates";
import { getNamespace } from "../utils/common";

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
export function asset(data, callback) {
  // Debug metni
  const namespace = getNamespace(__filename, asset.name);

  // Sadece get metodu ile çalışır
  if (checkDataMethod(data, "get")) {
    // İstenilen dosya ismini kırpılmış yoldan alma
    const assetName = data.trimmedPath.trim();
    if (assetName.lenght > 0) { 
      getStaticAsset(assetName, asset => {
        if (asset) {
          debug(namespace, "succes", `'${assetName}' için sayfa alımı başarılı`);
          callback(200, asset, figureContentType(assetName));
        } else {
          debug(namespace, "warn", `'${assetName}' için kaynak bulunamadı`);
          getNotFoundPage(callback);
        }
      })
    }
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
