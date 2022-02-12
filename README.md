# cryptomarkets

![GitHub top language](https://img.shields.io/github/languages/top/cristiancmd/crypto-markets-backend)
![GitHub language count](https://img.shields.io/github/languages/count/cristiancmd/crypto-markets-backend)

# proyecto para IAW

![GitHub top language](https://img.shields.io/github/languages/top/cristiancmd/cryptomarkets)
![GitHub language count](https://img.shields.io/github/languages/count/cristiancmd/cryptomarkets)

## App deployada (podria tardar hasta 30 segundos en ingresar la primera vez dadas las limitaciones del servidor gratuito) :

## [Frontend](https://crypto-markets-iaw.netlify.app/)


## [Backend](https://crypto-markets-api.herokuapp.com/)

## Script de ejemplo para ingresar moneda SOLANA en exchange Binance:
```js
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; function getCoin(callback) { var xhr = new XMLHttpRequest(); xhr.onreadystatechange = (e) => { if (xhr.readyState !== 4) { return; }; if (xhr.status === 200) { callback(JSON.parse(xhr.responseText).price); } else { console.warn('request_error'); }; }; xhr.open('GET', 'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'); xhr.send(); }; getCoin(returnCallback);
```
Simbolo: SOL

## Test de integracion con MercadoPago:

Se debe realizar el upgrade en el Perfil, relizando el checkout con una cuenta de MercadoPago fake:

"nickname": TESTLFZLYYEX

"password": qatest9458

Se debe ingresar una tarjeta de testing provista por MercadoPago luego de loguearse:

(Mastercard)

Número: 5031 7557 3453 0604

Código de seguridad: 123

Fecha de vencimiento: 11/25

Titular: APRO




# cryptomarkets

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
