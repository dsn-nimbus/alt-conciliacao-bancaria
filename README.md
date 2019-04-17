# alt-conciliacao-bancaria

### Install

```shell
$ npm i --save alt-conciliacao-bancaria
```

### Métodos 

#### parseOfx

```ts
import {parseOfx} from 'alt-conciliacao-bancaria'

// parseOfx(arquivo:File, reader:OfxFileReader, opcoes?:OfxOpcoesParse):Promise<Ofx>
parseOfx(this.files[0], new FileReader())
    .then((ofx:Ofx) => {

    })

const opcoesParse = {
    conta: new Conta(), // Será adicionada no lançamento base e nos filhos também
    encode: 'windows-1252', // Default é UTF-8
}

parseOfx(this.files[0], new FileReader(), opcoesParse)
    .then((ofx:Ofx) => {

    })
```

#### ofxToJSON

```ts
import {ofxToJSON} from 'alt-conciliacao-bancaria'

// ofxToJSON(arquivo:File, reader:OfxFileReader, opcoes?:OfxOpcoesToJSON):Promise<any>
ofxToJSON(this.files[0], new FileReader())
    .then((ofxJson:any) => {

    })

const opcoes = {
    encode: 'windows-1252', // Default é UTF-8
}

ofxToJSON(this.files[0], new FileReader(), opcoes)
    .then((ofxJson:any) => {

    })
```

### License

MIT