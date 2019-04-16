"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Ortam değişkenlerini oluşturma.
 * - *Örnek*: `set NODE_ENV=product node index.js` yazılırsa,
 *  5000 portundan çalışır.
 */
const environment = {};

/**
 * Varsayılan ortam değişkenleri
 */
environment.stagging = {
  httpPort: process.env.PORT || 3000,
  projectName: "yemreak.com",
  defaultTemplateExt: "html",
  templates: {
    header: "header.html",
    footer: "footer.html"
  },
  language: "tr",
  templateGlobals: {
    appName: "Yemreak",
    companyName: "Yemreak, Inc",
    releaseDate: "2019",
    baseUrl: `http://localhost:${process.env.PORT || 3000}/`
  }
};

environment.production = {
  httpPort: process.env.PORT || 5000,
  projectName: "yemreak.com",
  defaultTemplateExt: "html",
  templates: {
    header: "header.html",
    footer: "footer.html"
  },
  language: "tr",
  templateGlobals: {
    appName: "Yemreak",
    companyName: "Yemreak, Inc",
    releaseDate: "2019",
    baseUrl: "http://localhost:5000/"
  }
};

/**
 * Hangi ortamın, command-line argumanı olacağına karar veriyoruz.
 * - *Not*: `NODE_ENV` olan bir değişken ismidir, değiştirilemez! (Türkçeleştirilemez)
 */
const currentEnv = typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV.toLowerCase() : "";

/**
 * Şu anki ortamı kontrol ediyoruz, eğer yukarıdakilerden biri değilse
 * varsayılanı tanımlıyoruz.
 */
const envToExport = typeof environment[currentEnv] == "object" ? environment[currentEnv] : environment["stagging"];

// Değişkenlerin modül dışına aktarılması
const httpPort = envToExport.httpPort,
      projectName = envToExport.projectName,
      defaultTemplateExt = envToExport.defaultTemplateExt,
      templates = envToExport.templates,
      language = envToExport.language,
      templateGlobals = envToExport.templateGlobals;
exports.httpPort = httpPort;
exports.projectName = projectName;
exports.defaultTemplateExt = defaultTemplateExt;
exports.templates = templates;
exports.language = language;
exports.templateGlobals = templateGlobals;
//# sourceMappingURL=config.js.map