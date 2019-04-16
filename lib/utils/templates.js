/*
 * Sayfa kalıbı metodları
 * @author Yunus Emre
 */

import { join } from "path";
import { fixString } from "./regulators";
import { readFile } from "fs";
import { debug, getNamespace } from "./common";
import { defaultTemplateExt, templates, templateGlobals } from "../config";
import marked from "marked";

/**
 * Public dizininin yolunu tanımalama
 */
const _publicDir = join(__dirname, "/../../public/");

/**
 * Sayfa kalıbının dizgisine anahtar verilerini ve header - footer verilerini iliştirir
 * @param {string} templateDir Kalıbın dizini (url deki localhost'suz yol)
 * @param {function(boolean | string)} callback İşlemler bittiği zaman geri çağırılan metot
 * - *arg0: Kalıb dizgisi yoksa `false`*
 */
export function getFullTemplate(templateDir, callback) {
  // Debug metni
  const namespace = getNamespace(__filename, getFullTemplate.name);

  templateDir = fixString(templateDir);
  if (templateDir) {
    const templatePath = getTemplatePath(templateDir);

    getPublicAsset(templatePath, templateString => {
      if (templateString) {
        debug(namespace, "verbose", `'${templateDir}' için içerik alındı`);
        _addUniversalTemplates(templateString, fullTemplateString => {
          if (fullTemplateString) {
            debug(namespace, "verbose", `'${templateDir}' için tüm kalıp alındı`);

            _interpolateKeys(fullTemplateString, formattedString => {
              debug(namespace, "verbose", `'${templateDir}' için anahtar kelimeler yerleştirildi`);

              callback(formattedString);
            });
          } else {
            debug(namespace, "error", `Tüm sayfa kalıbı '${templatePath}' için oluşturulamadı ya da boş`);
            callback(false);
          }
        });
      } else {
        debug(namespace, "error", `'${templatePath}' için tüm kalıp alınamadı`);
        callback(false);
      }
    });
  } else {
    debug(namespace, "error", `'${templateDir}' olan tüm kalıp dizini geçersiz`);
    callback(false);
  }
}

/**
 * Sayfa kalıbını markdown üzerinden oluşturur ve anahtar verilerini ve header - footer verilerini iliştirir
 * @param {string} templateDir Kalıbın dizini (url deki localhost'suz yol)
 * @param {function(boolean | string)} callback İşlemler bittiği zaman geri çağırılan metot
 * - *arg0: Kalıb dizgisi yoksa `false`*
 */
export function getMarkdownTemplate(templateDir, callback) {
  // Debug metni
  const namespace = getNamespace(__filename, getMarkdownTemplate.name);

  templateDir = fixString(templateDir);
  if (templateDir) {
    const templatePath = getTemplatePath(templateDir, "md");

    getPublicAsset(templatePath, templateString => {
      if (templateString) {
        marked(templateString, (err, parsedResult) => {
          debug(namespace, "verbose", `'${templatePath}' için içerik alındı`);
          _addUniversalTemplates(parsedResult, fullTemplateString => {
            if (fullTemplateString) {
              debug(namespace, "verbose", `'${templatePath}' için tüm kalıp alındı`);

              _interpolateKeys(fullTemplateString, formattedString => {
                debug(namespace, "verbose", `'${templatePath}' için anahtar kelimeler yerleştirildi`);

                callback(formattedString);
              });
            } else {
              debug(namespace, "error", `Tüm sayfa kalıbı '${templatePath}' için oluşturulamadı ya da boş`);
              callback(false);
            }
          });
        });
      } else {
        debug(namespace, "error", `'${templatePath}' için tüm kalıp alınamadı`);
        callback(false);
      }
    });
  } else {
    debug(namespace, "error", `'${templateDir}' olan tüm kalıp dizini geçersiz`);
    callback(false);
  }
}

/**
 * Sayfa bulunamadı ekranını açar
 */
export function getNotFoundPage(callback) {
  // Debug metni
  const namespace = getNamespace(__filename, getNotFoundPage.name);

  getTemplate("notFound", templateString => {
    if (templateString) {
      debug(namespace, "succes", `'${templateDir}' için sayfa bulunamadı açıldı`);
      callback(200, templateString, "html");
    } else {
      debug(namespace, "error", `'${templateDir}' için sayfa bulunamadı bulunamadı`);
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
export function getTemplate(templateDir, callback) {
  // Debug metni
  const namespace = getNamespace(__filename, getTemplate.name);

  templateDir = fixString(templateDir);
  if (templateDir) {
    const templatePath = getTemplatePath(templateDir);
    getPublicAsset(templatePath, templateString => {
      if (templateString) {
        _interpolateKeys(templateString, formattedString => {
          debug(namespace, "verbose", `'${templateDir}' için anahtar kelimeler yerleştirildi`);
          callback(formattedString);
        });
      } else {
        debug(namespace, "error", `'${templateDir}' için kalıp alınamadı`);
        callback(false);
      }
    });
  } else {
    debug(namespace, "error", `'${templateDir}' için dizin geçerli değil`);
    callback(false);
  }
}

/**
 * Public dosyasındaki varlıkları alma
 * @param {stirng} assetPath İstenen varlığın yolu
 * @param {function(boolean | string):void} callback Geriçağırma
 * - *data: İstenilen varlık verisi yoksa `false`*
 */
export function getPublicAsset(assetPath, callback) {
  // Debug metni
  const namespace = getNamespace(__filename, getPublicAsset.name);

  assetPath = fixString(assetPath);
  if (assetPath) {
    readFile(_publicDir + assetPath, "utf8", (err, data) => {
      if (!err) {
        if (data) {
          debug(namespace, "succes", `'${assetPath}' başarıyla okundu`);
        } else {
          debug(namespace, "warn", `'${assetPath}' içinde veri bulunmamakta`);
        }
        callback(data);
      } else {
        debug(namespace, "error", `'${assetPath}' okunurken hata oluştu:\n${err}`);
        callback(false);
      }
    });
  } else {
    debug(namespace, "error", `'${assetPath}' geçerli bir yol değil.`);
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
  const namespace = getNamespace(__filename, _addUniversalTemplates.name);

  templateString = fixString(templateString, true);

  getPublicAsset(templates["header"], headerString => {
    if (headerString) {
      debug(namespace, "verbose", `Üst bilgi kalıbı bulundu`);
      getPublicAsset(templates["footer"], footerString => {
        if (footerString) {
          debug(namespace, "verbose", `Alt bilgi kalıbı bulundu`);
          callback(headerString + templateString + footerString);
        } else {
          debug(namespace, "error", `Alt bilgi kalıbı bulunamadı`);
          callback(false);
        }
      });
    } else {
      debug(namespace, "error", `Üst bilgi kalıbı bulunamadı`);
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
  for (let key in templateGlobals) {
    if (templateGlobals.hasOwnProperty(key)) {
      keysData[`globals.${key}`] = templateGlobals[key];
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
export function getTemplatePath(templateDir, ext = defaultTemplateExt) {
  ext = ext ? `.${ext}` : "";
  const split = templateDir.split("/");
  return templateDir + "/" + split[split.length - 1] + ext;
}
