const expect = require('expect')
const fs = require('fs')
const {parseOfx, ofxToJSON} = require('../src/index')

const PATH_OFX_UTF8_NORMAL = __dirname + '/__arquivos_ofx__/BB 102013_empresa 360 - utf8-normal.ofx'
const PATH_OFX_UTF8_PEQUENO = __dirname + '/__arquivos_ofx__/BB 102013_empresa 360 - utf8-pequeno.ofx'
const PATH_OFX_WINDOWS1252_NORMAL = __dirname + '/__arquivos_ofx__/BB 102013_empresa 360 - windows1252-normal.ofx'

describe('alt-conciliacao-bancaria', () => {
    describe('parseOfx', () => {
        it('deve1', () => {
            return parseOfx(fs.readFileSync(PATH_OFX_UTF8_NORMAL), {}, undefined)
        })
    })

    describe('ofxToJSON', () => {
        it('deve2', () => {
            return ofxToJSON(fs.readFileSync(PATH_OFX_UTF8_NORMAL), undefined)
        })
    })
})