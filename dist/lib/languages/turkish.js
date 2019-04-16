"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.msg = msg;
/*
 * Dil değişkenleri
 */

const msgs = {
  succes: "başarıyla eklendi",
  error: "bulunamadı",
  warn: "bir sorun mevcut"
};

const terms = {
  header: "Üst bilgi",
  footer: "Alt Bilgi"
};

function msg(termKey, msgKey, vars) {
  return `${vars} için ${terms[termKey]} ${msgs[msgKey]}`;
}
//# sourceMappingURL=turkish.js.map