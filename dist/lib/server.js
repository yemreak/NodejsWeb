"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startHttpServer = startHttpServer;

var _http = require("http");

var _config = require("./config");

var _url = require("url");

var _string_decoder = require("string_decoder");

var _common = require("./utils/common");

var _regulators = require("./utils/regulators");

var _template = require("./controllers/template");

var _asset = require("./controllers/asset");

/**
 * HTTP sunucusunu başlatır
 */
/*
 * Sunucu işlemleri
 * @author Yunus Emre
 */

function startHttpServer() {
  _httpServer.listen(_config.httpPort, () => {
    (0, _common.debug)((0, _common.getNamespace)(__filename, startHttpServer.name), "succes", `Sunucu ${_config.httpPort} portundan dinleniyor.`);
  });
}

/**
 * Http server sunucusu yapılandırması
 */
const _httpServer = (0, _http.createServer)((request, response) => {
  _unifiedServer(request, response);
});

/**
 * Ortak sunucu yapılandırması
 */
const _unifiedServer = (request, response) => {
  /**
   * Url ayrıştırma işlemi (obje olarak alıyoruz)
   * - *Örnek : `{... query: {}, pathname: "/ornek" ... }` şeklinde bir url classı*
   */
  const parsedUrl = (0, _url.parse)(request.url, true);
  (0, _common.debug)((0, _common.getNamespace)(__filename, _unifiedServer.name), "verbose", `Ayrıştırılmış url: '${JSON.stringify(parsedUrl)}'`);

  /**
   * Sorgu kelimesini (query string) obje olarak almak.
   * - *Örnek: `curl localhost:3000/foo?test=testtir` => `{ test : "testtir" }`*
   * - *Not : `?test=testtir` sorgu dizgisidir.*
   */
  const queryStringObject = parsedUrl.query;
  (0, _common.debug)((0, _common.getNamespace)(__filename, _unifiedServer.name), "verbose", `Sorgu dizgileri: '${JSON.stringify(queryStringObject)}'`);

  /**
   * Ayrıştırılan urldeki pathname değişkenindeki değeri yol'a alıyorz.
   * - *Örnek: `curl localhost:3000/ornek/test/` => yolu `/ornek/test/`*
   * - *Not: sorgu dizgileri ele alınmaz ( `curl localhost:3000/ornek?foo=bar` => yolu `/ornek` )*
   */
  const path = parsedUrl.pathname;
  (0, _common.debug)((0, _common.getNamespace)(__filename, _unifiedServer.name), "verbose", `Yol: '${path}'`);

  /**
   * Replace içinde verilen işaretler çıkartılarak alınan yol.
   * - *Örnek: `/ornek` -> `ornek` veya `/ornek/test/` -> `ornek/test/` olarak kırpılmakta.*
   * - *Not: Sadece **ilk karakter** kırpılıyor (?)*
   */
  const trimmedPath = path.replace(/^\/+|\+$/g, "");
  (0, _common.debug)((0, _common.getNamespace)(__filename, _unifiedServer.name), "verbose", `Kırpılmış Yol: '${trimmedPath}'`);

  /**
   * HTTP metodu alma
   * - *Örnek: `GET`, `POST`, `PUT`, `DELETE` ...*
   * - *Not: Küçük harfe çevirip alıyoruz.*
   */
  const method = request.method.toLowerCase();
  (0, _common.debug)((0, _common.getNamespace)(__filename, _unifiedServer.name), "verbose", `Method: '${method}'`);

  /**
   * İsteğin içindeki başlıkları (header keys) obje olarak almak.
   * - *Not: Postman ile headers sekmesinde gönderilen anahtarları (keys)*
   * *ve değerlerini (the value of them) içerir.*
   */
  const headers = request.headers;
  (0, _common.debug)((0, _common.getNamespace)(__filename, _unifiedServer.name), "verbose", `Başlıklar: '${headers}'`);

  /**
   * ASCI kodlarını çözümlemek için kod çözücü tanımlama
   * - *Not: `utf-8` çözümleme yöntemidir*
   */
  const decoder = new _string_decoder.StringDecoder("utf-8");
  let buffer = ""; // Yükleri kayıt edeceğimiz tamponu oluşturuyoruz.

  /**
   * İstekte veri geldiği anda yapılacak işlemler
   */
  request.on("data", data => {
    /**
     * ASCI kodlarını "utf-8" formatında çözümlüyoruz.
     * - *Ornek: 42 75 -> Bu [ 42 = B, 75 = u]*
     */
    buffer += decoder.write(data);
  });

  /**
   * İstek sonlandığı anda yapılacak işlemler
   */
  request.on("end", () => {
    // Kod çözümlemeyi kapatıyoruz.
    buffer += decoder.end();

    /**
     * İşleyiciye gönderilen veri objesi oluşturma
     * - *Not: Her dosyada kullanılan veri objesidir.*
     * - *Örnek:*
     ```javascript
     { 
        "trimmedPath" = "ornek" 
        "queryStringObject" = {}
        "method" = "post"
        "headers" = {"isim" : "Yunus Emre"}
        "payload": JSONtoObject(buffer)
     }
     ```
     */
    const requestData = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: (0, _common.JSONtoObject)(buffer)
    };
    (0, _common.debug)((0, _common.getNamespace)(__filename, _unifiedServer.name), "succes", `İstek verileri başarıyla oluşturuldu`);
    // Yanıt oluşturma
    _createResponse(requestData, response);
  });
};

/**
 * Sunucu tarafından verilecek yanıtı oluşturma
 * @param {object} requestData İstek verileri
 * @param {string} response Yanıt dizgisi
 */
const _createResponse = (requestData, response) => {
  const namespace = (0, _common.getNamespace)(__filename, _createResponse.name);

  /**
   * Seçilmiş işleyiciyi ayarlama
   * - `asset` Statik veriler: resim vs.
   * - `api` Arka plan işlevleri
   * - `template` Sayfa kalıpları: html
   */
  const chosenHandler = requestData.trimmedPath.includes(".") ? _asset.asset // asset
  : requestData.trimmedPath.includes("api/") ? undefined // api
  : _template.template;

  (0, _common.debug)(namespace, "verbose", `Seçilen işleyici: '${chosenHandler.name}'`);
  chosenHandler(requestData, (statusCode, payload, contentType) => {
    console.log("aa");
    // Değişkenleri düzenleme
    statusCode = (0, _regulators.fixStatusCode)(statusCode);
    contentType = (0, _regulators.fixContentType)(contentType);
    (0, _common.debug)(namespace, "verbose", `Durum Kodu: ${statusCode} İçerik Tipi: '${contentType}'`);

    // Yanıt için başlıkları ayarlama
    response.setHeader("Content-Type", _regulators.contentTypes[contentType]);
    (0, _common.debug)(namespace, "verbose", `'${contentType}' için başlıklar oluşturuldu`);

    // Yük dizgisini ayarlama
    const payloadString = (0, _regulators.fixPayload)(contentType, payload);

    // Yanıt için durum kodunu ve geri dönüş yüklerini ayarlama
    response.writeHead(statusCode);
    response.end(payloadString);

    // Yanıt hakkında bilgi gösterme (debug)
    _showResponseInfos(statusCode, requestData);
  });
};

/**
 * Sunucu yanıtı hakkında bilgilendirme
 * @param {number} statusCode Sunucu durum kodu
 * @param {object} requestData Sunucuya gönderilen istek verisi
 */
const _showResponseInfos = (statusCode, requestData) => {
  // İşlem yanıtı olumlu ise yeşil, değilse kırmızı yazma
  (0, _common.debug)((0, _common.getNamespace)(__filename, _showResponseInfos.name), statusCode == 200 ? "succes" : "warn", `Method: '${requestData.method}' Path: '${requestData.trimmedPath}' Status: ${statusCode}`);
};
//# sourceMappingURL=server.js.map