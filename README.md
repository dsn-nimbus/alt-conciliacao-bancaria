# alt-conciliacao-bancaria

[![Build Status](https://travis-ci.org/dsn-nimbus/alt-conciliacao-bancaria.svg?branch=master)](https://travis-ci.org/dsn-nimbus/alt-conciliacao-bancaria)

### Install

```shell
$ npm i --save alt-conciliacao-bancaria
```

### Métodos 

#### parseOfx

```ts
import {parseOfx} from 'alt-conciliacao-bancaria'

// parseOfx(arquivo:File, reader:OfxFileReader, opcoes?:OfxOpcoesParse):Promise<Ofx>
parseOfx(arquivo, new FileReader())
    .then((ofx:Ofx) => {

    })

const opcoesParse = {
    conta: new Conta(), // Será adicionada no lançamento base e nos filhos também
    encode: 'windows-1252', // Default é UTF-8
}

parseOfx(arquivo, new FileReader(), opcoesParse)
    .then((ofx:Ofx) => {

    })
```

#### ofxToJSON

```ts
import {ofxToJSON} from 'alt-conciliacao-bancaria'

// ofxToJSON(arquivo:File, reader:OfxFileReader, opcoes?:OfxOpcoesToJSON):Promise<any>
ofxToJSON(arquivo, new FileReader())
    .then((ofxJson:any) => {

    })

const opcoes = {
    encode: 'windows-1252', // Default é UTF-8
}

ofxToJSON(arquivo, new FileReader(), opcoes)
    .then((ofxJson:any) => {

    })
```

### License

MIT