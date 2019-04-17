# alt-conciliacao-bancaria

### Install

```shell
$ npm i --save alt-conciliacao-bancaria
```

### parseOfx(arquivo:File, reader:OfxFileReader, opcoes?:OfxOpcoesParse):Promise<Ofx>

#### Uso simples

```ts
import {parseOfx} from 'alt-conciliacao-bancaria'

parseOfx(this.files[0], new FileReader())
    .then((ofx:Ofx) => {

    })
    .catch(() => {

    })
    .finally(() => {

    })
```

#### Uso com opções

```ts
import {parseOfx} from 'alt-conciliacao-bancaria'

const opcoesParse = {
    conta: new Conta(), // Será adicionada no lançamento base e nos filhos também
    encode: 'windows-1252', // Default é UTF-8
}

parseOfx(this.files[0], new FileReader(), opcoesParse)
    .then((ofx:Ofx) => {

    })
    .catch((erro) => {

    })
    .finally(() => {

    })
```

### ofxToJSON(arquivo:File, reader:OfxFileReader, opcoes?:OfxOpcoesToJSON):Promise<any>

#### Uso simples

```ts
import {ofxToJSON} from 'alt-conciliacao-bancaria'

ofxToJSON(this.files[0], new FileReader())
    .then((ofxJson:any) => {

    })
    .catch((erro) => {

    })
    .finally(() => {

    })
```

#### Uso com opções

```ts
import {ofxToJSON} from 'alt-conciliacao-bancaria'

const opcoes = {
    encode: 'windows-1252', // Default é UTF-8
}

ofxToJSON(this.files[0], new FileReader(), opcoes)
    .then((ofxJson:any) => {

    })
    .catch(() => {

    })
    .finally(() => {

    })
```

### License

MIT