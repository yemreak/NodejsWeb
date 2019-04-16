"use strict";

var _server = require("./lib/server");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Uygulama
 */
const app = {};

/**
 * Uygulamanın başlatma
 */
app.start = () => {
  (0, _server.startHttpServer)();
};

// Uygulamayı başlatma
app.start();
//# sourceMappingURL=index.js.map