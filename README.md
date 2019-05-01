# YNodejs <!-- omit in toc -->

Yemreak.com sitesi için çalışma. [Test linki](https://yemreak.herokuapp.com/)

## İçerik <!-- omit in toc -->

> `HOME` tuşu ile içerik kısmına gelebilrsin.

- [Scriptler](#scriptler)
  - [Örnek Sciprt Çalıştırma](#%C3%B6rnek-sciprt-%C3%A7al%C4%B1%C5%9Ft%C4%B1rma)
- [Ortam Değişkenleri](#ortam-de%C4%9Fi%C5%9Fkenleri)
  - [Ortam Değişkeni Tanımalama](#ortam-de%C4%9Fi%C5%9Fkeni-tan%C4%B1malama)
- [Çalışma Notları](#%C3%A7al%C4%B1%C5%9Fma-notlar%C4%B1)
  - [VsCode için Debug Ayarı](#vscode-i%C3%A7in-debug-ayar%C4%B1)
  - [Fonksiyonu Çağıran Dosya İsmini Bulma](#fonksiyonu-%C3%A7a%C4%9F%C4%B1ran-dosya-i%CC%87smini-bulma)
  - [Dosya İsmi ve Satırı Alma](#dosya-i%CC%87smi-ve-sat%C4%B1r%C4%B1-alma)
  - [Eski Debug Fonksiyonu](#eski-debug-fonksiyonu)
  - [Anahtar Kelimeler](#anahtar-kelimeler)
  - [Anahtar Kelime Kullanımı](#anahtar-kelime-kullan%C4%B1m%C4%B1)
- [Yapılacaklar](#yap%C4%B1lacaklar)
  - [Sorunlar](#sorunlar)
  - [İleride Yapılacaklar](#i%CC%87leride-yap%C4%B1lacaklar)
  - [Kodda Verimlilik](#kodda-verimlilik)
  - [Gelecekte Yapılacaklar](#gelecekte-yap%C4%B1lacaklar)
  - [Yorum Notları](#yorum-notlar%C4%B1)
  - [Eklenebilir Kod Yapıları](#eklenebilir-kod-yap%C4%B1lar%C4%B1)
    - [Anahtar Kelimeye Göre Debug](#anahtar-kelimeye-g%C3%B6re-debug)
  - [Hatalar](#hatalar)
  - [Hata Notları](#hata-notlar%C4%B1)

## Scriptler

NPM için özel olarak tanımlanan komutlardır.

| Script        | Açıklama                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `test`        | Tanımlanmamıştır                                                                                 |
| `start`       | Dist klasöründeki es5 formatındaki index.js'i çalıştırır. Build edilmeyi gerektirir              |
| `dev`         | Geliştirici modunda çalıştırır. Es6 tipineki kodlar babel aracılığı ile kullanılır               |
| `build`       | Dist klasörü içine es6 tipindeki kodların es5'i oluşturulur. Start scripti için gerekli işlemdir |
| `build:db`    | Veri tabanı'nı da dahil ederek build işlemini yapar                                              |
| `build:start` | Build işleminden sonra start işlemini başlatır                                                   |
| `clean`       | Veri tabanını depolayarak dist klasörünü temizler                                                |
| `clean:all`   | Veri tabanı dahil tüm dist dizinini temizler                                                     |
| `rebuild`     | Eski dist klasörünü kaldırır, yenisi oluşturur                                                   |
| `rebuild:db`  | Eski dist klasörünü veritabanını depolayarak kaldırır, yenisi oluşturur                          |

### Örnek Sciprt Çalıştırma

```node
npm run-script build:start
```

## Ortam Değişkenleri

Ortam ön ayarları scriptler çalıştırılmadan önce girilen komutlardır.

> [Heroku](https://www.heroku.com/nodejs) gibi sitelerde üretim modu ön eki uygulama çalıştırılmadan uygulanır.

| Ön Komut                  | Açıklama                                             |
| ------------------------- | ---------------------------------------------------- |
| `set DEBUG=<dosya ismi>`  | Debug modunu belli bir dosya için aktif hale getirir |
| `set NODE_ENV=production` | Üretim modunda projeyi çalıştırır                    |
| `set NODE_ENV=stagging`   | Normal modda projeyi çalıştırır                      |

- `<dosya ismi>` Dosya ismi değişkenidir
  - `index`, `server`, `babel` vs.
  - `*` olursa tüm dosyalarda hata ayıklama çalışır

### Ortam Değişkeni Tanımalama

```cmd
set NODE_ENV=production & set DEBUG=* & npm run-script dev
```

## Çalışma Notları

- HTML metotlarının hepsi küçük harf olarak işlenmelidir. ([detay](https://stackoverflow.com/questions/7790576/what-are-http-method-capitalization-best-practices))
- HTML form metotları "get" veya "post" olabilmekte. Diğer metotlar için ek input koymalıyız. ([detay](https://stackoverflow.com/questions/2314401/what-is-the-default-form-http-method))
- `Not`, `Örnek` gibi kısımlar **italik** yazılır
- `Filename` olarak yazılır, `file name` değil
- Dışa aktarılmayan değişkenlerin başında `_` ön eki olur
- `lib/**/*.js` lib içerisinde js ile biten tüm dosyaları temsil eder
  - `**` tüm dizinler ve dosyalar anlamındadır
  - `*` tüm dosyalar anlamındadır

### VsCode için Debug Ayarı

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}\\index.js",
      "outFiles": [ "${workspaceRoot}/dist/**/**/*.js" ]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Current File",
      "program": "${file}",
      "outFiles": [ "${workspaceRoot}/dist/**/**/*.js" ]
    }
  ]
}
```

### Fonksiyonu Çağıran Dosya İsmini Bulma

```js
function _getCallerFile() {
    var originalFunc = Error.prepareStackTrace;

    var callerfile;
    try {
        var err = new Error();
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc;

    return callerfile;
}
```

### Dosya İsmi ve Satırı Alma

```js
export function _getCallerInfo() {
  const err = new Error();
  let index = 3;
  let line = err.stack.split("\n")[index];
  let functionName = line.split(" at ")[1].split(" ")[0];

  while (functionName.includes(`C:/`)) {
    index++;
    line = err.stack.split("\n")[index];
    functionName = line.split(" at ")[1].split(" ")[0];
  }

  let callerInfo = line.split(`${projectName}/`);
  callerInfo = callerInfo[callerInfo.length - 1];

  const filename = callerInfo.split(".")[0];
  const lineInfos = callerInfo.replace(filename + ".js:", "").replace(")", "");
  return `${filename}:${functionName}:${lineInfos}`; // lib\server:func(12:21)
}
```

### Eski Debug Fonksiyonu

```js

/**
 * Hata ayıklama modunda consola yazdırma
 * @param {string} themeKey common.theme anahtarı
 * @param {string} msg Mesaj
 */
export function debugMsg(themeKey, msg) {
  const filename = _getCallerInfo();
  themeKey = theme.hasOwnProperty(themeKey) ? themeKey : theme.default;
  debugLog(filename)(colors[themeKey](msg));
}
```

### Anahtar Kelimeler

Html içerisinde kullanımı `{<anahtar>}` şeklindedir.

| Anahtar         | Açıklama                                          |
| --------------- | ------------------------------------------------- |
| `globals.<key>` | Yapılandırma dosyasından gelen anahtarkara erişim |
| `<key>`         | Sonradan oluşturulmuş anahtarlara erişim          |

- `<key>` Anahtar kelime ismi

### Anahtar Kelime Kullanımı

config.js

```js
templateGlobals: {
  appName: "Yemreak",
  companyName: "Yemreak, Inc",
  releaseDate: "2019",
  baseUrl: `http://localhost:${process.env.PORT || 3000}/`
}
```

.html

```js
Şirketimiz: {globals.companyName}
```

çıktı

```out
Şirketimiz: Yemreak Inc.
```

## Yapılacaklar

### Sorunlar

- [ ] Asset ile statik veriler alınmıyor
  - [ ] err.jpg
  - [ ] favicon.ico

### İleride Yapılacaklar

- [ ] Bloğun için markdown to html yapabilirsin
  - [ ] Style kısımlarını en tepeye koymalısın
  - [ ] id'lerdeki hataları vscode'da `replace` ile düzeltmelisin
  - [ ] `img` sorunlarına da ek çözüm bulmalısın
- [ ] Markdown sayfalarını sitende yayınla
  - [ ] Markdown çevirici olarak [puppeteer](https://github.com/GoogleChrome/puppeteer) kullanabilirsin
  - [ ] Html'i alıp kendi css'ine entegre edebilirsin
  - [ ] Markdown to HTML özelliği ekle
  - [ ] `.html` değil `.md` dosyasından almalı
  - [ ] Renklendirme ve güzelleştirme eklenmeli
  - [x] Çalışabilir olmalı
  - [ ] GetTemplatePath düzenlenecek
- [ ] Mardown to PDF eklendisi ile vscode üzerinden markdown'u html yap kullan
  - CSS'leri otamatik geliyor zaten
- [ ] Her yaptığın değişiklik sitede yenilikler adı altında gözükmeli
- [ ] EloBoostWebSite gibi site yapısı oluştur
- [ ] Ek bağlantıları alt domainlere böl
- [ ] Dizin ile url yapısı aynı olsun
- [ ] Languages klasörünü kaldır
- [ ] Heroku Yapılandırması
  - [x] Heroku remote ile herokuya push etme
  - [ ] Heroku'da build edip çalıştırma

### Kodda Verimlilik

- [ ] utils.assets:33 Düzenlenecek
- [ ] Controller'ları birleştir
- [x] Debug yapısı
  - [x] VsCode Debug
  - [ ] Anahtar kelimeye göre debug
  - [x] Statik mesaja göre debug
  - [x] Renkli
    - [ ] Renkler göze hoş olmalı
  - [ ] `lib\server:func` yapısı
    - [ ] Nereden çağırılırsa otomatik algılamayı araştır
    - [ ] lib/server yapısı mesajın başlangıcı fonksyion ismi ve yeri
    - [ ] Err gibi de olabilir
  - [ ] `\n` ile güzelleştirilmiş yapı
  - [ ] Uzun verileri ve metodları debuglama

### Gelecekte Yapılacaklar

- [ ] Js'i minify edip dist'e ekleyen yapı
- [ ] React-JS eklenecek
- [ ] Admin paneli
- [ ] Animasyonlar ve efektler
- [ ] Birden fazla dil desteği (?)
  - [ ] languages.js
  - [ ] common.debug

### Yorum Notları

```js
////////////////////////////////////////////////////////
// -------------- DÜZENLEYİCİ METODLAR -------------- //
////////////////////////////////////////////////////////
```

### Eklenebilir Kod Yapıları

#### Anahtar Kelimeye Göre Debug

```js
/**
 * Hata ayıklama modunda consola anahtar kelimeler ile yazdırma
 * @param {string} filename Dosya ismi
 * @param {object} object Mesaj ile alakalı obje
 * @param {string} termKey languages.terms değişkeni anahtarı
 * @param {string} msgKey languages.msg değişkeni anahtarı
 */
export function debug(filename, object, termKey, msgKey) {
  filename = getFileName();
  const colorKey = theme.hasOwnProperty(msgKey) ? msgKey : theme.default;
  debugLog(filename)(colors[colorKey](msg(object, termKey, msgKey)));
}
```

### Hatalar

![error](./err.jpg)

### Hata Notları

```sh
Error: EPERM: operation not permitted, open '...\.babel.json'
```

.babel.json dosyası **hidden files** olmamalı
