"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullTemplate = getFullTemplate;
exports.getMarkdownTemplate = getMarkdownTemplate;
exports.getNotFoundPage = getNotFoundPage;
exports.getTemplate = getTemplate;
exports.getPublicAsset = getPublicAsset;
exports.getTemplatePath = getTemplatePath;

var _path = require("path");

var _regulators = require("./regulators");

var _fs = require("fs");

var _common = require("./common");

var _config = require("../config");

var _marked = require("marked");

var _marked2 = _interopRequireDefault(_marked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Public dizininin yolunu tanımalama
 */
/*
 * Sayfa kalıbı metodları
 * @author Yunus Emre
 */

const _publicDir = (0, _path.join)(__dirname, "/../../public/");

/**
 * Sayfa kalıbının dizgisine anahtar verilerini ve header - footer verilerini iliştirir
 * @param {string} templateDir Kalıbın dizini (url deki localhost'suz yol)
 * @param {function(boolean | string)} callback İşlemler bittiği zaman geri çağırılan metot
 * - *arg0: Kalıb dizgisi yoksa `false`*
 */
function getFullTemplate(templateDir, callback) {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, getFullTemplate.name);

  templateDir = (0, _regulators.fixString)(templateDir);
  if (templateDir) {
    const templatePath = getTemplatePath(templateDir);

    getPublicAsset(templatePath, templateString => {
      if (templateString) {
        (0, _common.debug)(namespace, "verbose", `'${templateDir}' için içerik alındı`);
        _addUniversalTemplates(templateString, fullTemplateString => {
          if (fullTemplateString) {
            (0, _common.debug)(namespace, "verbose", `'${templateDir}' için tüm kalıp alındı`);

            _interpolateKeys(fullTemplateString, formattedString => {
              (0, _common.debug)(namespace, "verbose", `'${templateDir}' için anahtar kelimeler yerleştirildi`);

              callback(formattedString);
            });
          } else {
            (0, _common.debug)(namespace, "error", `Tüm sayfa kalıbı '${templatePath}' için oluşturulamadı ya da boş`);
            callback(false);
          }
        });
      } else {
        (0, _common.debug)(namespace, "error", `'${templatePath}' için tüm kalıp alınamadı`);
        callback(false);
      }
    });
  } else {
    (0, _common.debug)(namespace, "error", `'${templateDir}' olan tüm kalıp dizini geçersiz`);
    callback(false);
  }
}

/**
 * Sayfa kalıbını markdown üzerinden oluşturur ve anahtar verilerini ve header - footer verilerini iliştirir
 * @param {string} templateDir Kalıbın dizini (url deki localhost'suz yol)
 * @param {function(boolean | string)} callback İşlemler bittiği zaman geri çağırılan metot
 * - *arg0: Kalıb dizgisi yoksa `false`*
 */
function getMarkdownTemplate(templateDir, callback) {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, getMarkdownTemplate.name);

  templateDir = (0, _regulators.fixString)(templateDir);
  if (templateDir) {
    const templatePath = getTemplatePath(templateDir, "md");

    getPublicAsset(templatePath, templateString => {
      if (templateString) {
        (0, _marked2.default)(templateString, (err, parsedResult) => {
          (0, _common.debug)(namespace, "verbose", `'${templatePath}' için içerik alındı`);
          _addUniversalTemplates(parsedResult, fullTemplateString => {
            if (fullTemplateString) {
              (0, _common.debug)(namespace, "verbose", `'${templatePath}' için tüm kalıp alındı`);

              _interpolateKeys(fullTemplateString, formattedString => {
                (0, _common.debug)(namespace, "verbose", `'${templatePath}' için anahtar kelimeler yerleştirildi`);

                callback(formattedString);
              });
            } else {
              (0, _common.debug)(namespace, "error", `Tüm sayfa kalıbı '${templatePath}' için oluşturulamadı ya da boş`);
              callback(false);
            }
          });
        });
      } else {
        (0, _common.debug)(namespace, "error", `'${templatePath}' için tüm kalıp alınamadı`);
        callback(false);
      }
    });
  } else {
    (0, _common.debug)(namespace, "error", `'${templateDir}' olan tüm kalıp dizini geçersiz`);
    callback(false);
  }
}

/**
 * Sayfa bulunamadı ekranını açar
 */
function getNotFoundPage(callback) {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, getNotFoundPage.name);

  getTemplate("notFound", templateString => {
    if (templateString) {
      (0, _common.debug)(namespace, "succes", `'${templateDir}' için sayfa bulunamadı açıldı`);
      callback(200, templateString, "html");
    } else {
      (0, _common.debug)(namespace, "error", `'${templateDir}' için sayfa bulunamadı bulunamadı`);
      callback(500, `${__filename}.template hatası!`, "json");
    }
  });
}

/**
 * Sayfa kalıbının digisine anahtar verilerini verilerini iliştirir
 * @param {string} templateDir Kalıbın dizini
 * @param {function(boolean | string)} callback İşlemler bittiği zaman geri çağırılan metot
 * - *arg1: Kalıb dizgisi yoksa `false`*
 */
function getTemplate(templateDir, callback) {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, getTemplate.name);

  templateDir = (0, _regulators.fixString)(templateDir);
  if (templateDir) {
    const templatePath = getTemplatePath(templateDir);
    getPublicAsset(templatePath, templateString => {
      if (templateString) {
        _interpolateKeys(templateString, formattedString => {
          (0, _common.debug)(namespace, "verbose", `'${templateDir}' için anahtar kelimeler yerleştirildi`);
          callback(formattedString);
        });
      } else {
        (0, _common.debug)(namespace, "error", `'${templateDir}' için kalıp alınamadı`);
        callback(false);
      }
    });
  } else {
    (0, _common.debug)(namespace, "error", `'${templateDir}' için dizin geçerli değil`);
    callback(false);
  }
}

/**
 * Public dosyasındaki varlıkları alma
 * @param {stirng} assetPath İstenen varlığın yolu
 * @param {function(boolean | string):void} callback Geriçağırma
 * - *data: İstenilen varlık verisi yoksa `false`*
 */
function getPublicAsset(assetPath, callback) {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, getPublicAsset.name);

  assetPath = (0, _regulators.fixString)(assetPath);
  if (assetPath) {
    (0, _fs.readFile)(_publicDir + assetPath, "utf8", (err, data) => {
      if (!err) {
        if (data) {
          (0, _common.debug)(namespace, "succes", `'${assetPath}' başarıyla okundu`);
        } else {
          (0, _common.debug)(namespace, "warn", `'${assetPath}' içinde veri bulunmamakta`);
        }
        callback(data);
      } else {
        (0, _common.debug)(namespace, "error", `'${assetPath}' okunurken hata oluştu:\n${err}`);
        callback(false);
      }
    });
  } else {
    (0, _common.debug)(namespace, "error", `'${assetPath}' geçerli bir yol değil.`);
    callback(false);
  }
}

/**
 * GUI için gereken kalıp kalıbına alt ve üst bilgi kalıbını ekler
 * @param {string} templateString Evrensel kalıpların ekleneceği kalıp dizgisi
 * @param {function (string | boolean): void} callback İşlemler bittiği zaman verilen yanıt
 * - *arg0: Evrensel kalıpların eklendiği kalıp dizgisi*
 */
const _addUniversalTemplates = (templateString, callback) => {
  // Debug metni
  const namespace = (0, _common.getNamespace)(__filename, _addUniversalTemplates.name);

  templateString = (0, _regulators.fixString)(templateString, true);

  getPublicAsset(_config.templates["header"], headerString => {
    if (headerString) {
      (0, _common.debug)(namespace, "verbose", `Üst bilgi kalıbı bulundu`);
      getPublicAsset(_config.templates["footer"], footerString => {
        if (footerString) {
          (0, _common.debug)(namespace, "verbose", `Alt bilgi kalıbı bulundu`);
          callback(headerString + templateString + footerString);
        } else {
          (0, _common.debug)(namespace, "error", `Alt bilgi kalıbı bulunamadı`);
          callback(false);
        }
      });
    } else {
      (0, _common.debug)(namespace, "error", `Üst bilgi kalıbı bulunamadı`);
      callback(false);
    }
  });
};

/**
 * Verilen metni anahtar verilerine göre yeniden düzenler
 * @param {string} string Formatlanacak dizgi
 * @param {function(string)} callback İşlemler bittiğinde çalışan fonksiyon
 * - *args0: İşlenmiş string*
 */
const _interpolateKeys = (string, callback) => {
  // Anahtar verileri değişkeni
  const keysData = {};

  // Anahtar verilerini oluşturma
  for (let key in _config.templateGlobals) {
    if (_config.templateGlobals.hasOwnProperty(key)) {
      keysData[`globals.${key}`] = _config.templateGlobals[key];
    }
  }

  // Her bir anahtar verisini, aldığımız kalıp dizgisinde uygun yerlere koyuyoruz
  for (let key in keysData) {
    if (keysData.hasOwnProperty(key) && keysData[key] == "string") {
      string = string.replace(`{${key}}`, keysData[key]);
    }
  }

  callback(string);
};

/**
 * Kalıp dizininden kalıp yolunu uzantısız alır
 * - *Örn: 'index\index.html' veya 'index\index'*
 * @param {string} templateDir Kalıp dizini
 * @param {?string} ext Uzantısı (yoksa `null`)
 * @return {string} Kalıp yolu
 */
function getTemplatePath(templateDir, ext = _config.defaultTemplateExt) {
  ext = ext ? `.${ext}` : "";
  const split = templateDir.split("/");
  return templateDir + "/" + split[split.length - 1] + ext;
}
//# sourceMappingURL=templates.js.map