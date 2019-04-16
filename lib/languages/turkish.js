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

export function msg(termKey, msgKey, vars) {
  return `${vars} için ${terms[termKey]} ${msgs[msgKey]}`;
}
