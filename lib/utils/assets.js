import { join } from "path";
import { getNamespace } from "./common";

/**
 * Public dizininin yolunu tanımalama
 */
const _publicDir = join(__dirname, "/../../public/");

/**
 * Public dosyasındaki varlıkları alma
 * @param {stirng} assetPath İstenen varlığın yolu *err.jpg*
 * @param {function(boolean | string, string=):void} callback Geriçağırma
 * - *data: İstenilen varlık verisi yoksa `false`*
 */
export function getStaticAsset(assetPath, callback) {
  // Debug ismi
  const namespace = getNamespace(__filename, getStaticAsset.name);

  assetPath = fixString(assetPath);
  if (assetPath) {
    readFile(_publicDir + assetPath, (err, data) => {
      if (!err) {
        if (data) {
          debug(namespace, "succes", `'${assetPath}' varlığı başarıyla alındı`);
        } else {
          debug(namespace, "warn", `'${assetPath}' varlığının içi boş`);
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
 * Varlık isminin uzantısına göre içerik türüne karar verme
 * @param {string} assetName Varlık ismi
 * @return {string} Varlığın içerik türü
 */
export function figureContentType(assetName) {
  if (assetName.includes(".css")) {
    return "css";
  } else if (assetName.includes(".png")) {
    return "png";
  } else if (assetName.includes(".jpg")) {
    return "jpg";
  } else if (assetName.includes(".ico")) {
    return "favicon";
  } else if (assetName.includes(".js")) {
    return "js";
  }
  return "plain";
}
