import {startHttpServer, myFunc} from "./lib/server";
import debug from 'debug';

/**
 * Uygulama
 */
const app = {};

/**
 * Uygulamanın başlatma
 */
app.start = () => {
    startHttpServer();
}

// Uygulamayı başlatma
app.start();

