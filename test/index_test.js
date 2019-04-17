const expect = require('expect')
const fs = require('fs')
const {parseOfx, ofxToJSON} = require('../src/index')

const PATH_OFX_UTF8_NORMAL = __dirname + '/__arquivos_ofx__/utf8-normal.ofx'
const PATH_OFX_UTF8_PEQUENO = __dirname + '/__arquivos_ofx__/utf8-pequeno.ofx'
const PATH_OFX_WINDOWS1252_NORMAL = __dirname + '/__arquivos_ofx__/windows1252-normal.ofx'

describe('alt-conciliacao-bancaria', () => {
    describe('parseOfx', () => {
        describe('utf-8 normal', () => {
            it('deve resolver o conteúdo do arquivo retornando uma instância de Ofx - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_NORMAL)

                try {
                    const ofx = await parseOfx(arquivo, fileReader)
                    expect(ofx).toBeDefined()
                } catch (e) {
                    throw e
                }
            })
        })        

        describe('utf-8 pequeno', () => {
            it('deve resolver o conteúdo do arquivo retornando uma instância de Ofx - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_PEQUENO)

                try {
                    const ofx = await parseOfx(arquivo, fileReader)
                    expect(ofx).toBeDefined()
                } catch (e) {
                    throw e
                }
            })
        })        

        describe('windows-1252 normal', () => {
            it('deve resolver o conteúdo do arquivo retornando uma instância de Ofx - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_WINDOWS1252_NORMAL)

                try {
                    const ofx = await parseOfx(arquivo, fileReader)
                    expect(ofx).toBeDefined()
                } catch (e) {
                    throw e
                }
            })
        })        
    })

    describe('ofxToJSON', () => {
        describe('utf-8 normal', () => {
            it('deve resolver o conteúdo do arquivo retornando um OfxJSON - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_NORMAL)

                try {
                    const ofxJSON = await ofxToJSON(arquivo, fileReader)
                    expect(ofxJSON).toBeDefined()
                    expect(typeof ofxJSON).toBe('object')
                    expect(ofxJSON.signonmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.signonmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.bankmsgsrsv1).toBe('object')
                } catch (e) {
                    throw e
                }
            })
        })

        describe('utf-8 pequeno', () => {
            it('deve resolver o conteúdo do arquivo retornando um OfxJSON - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_PEQUENO)

                try {
                    const ofxJSON = await ofxToJSON(arquivo, fileReader)
                    expect(ofxJSON).toBeDefined()
                    expect(typeof ofxJSON).toBe('object')
                    expect(ofxJSON.signonmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.signonmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.bankmsgsrsv1).toBe('object')
                } catch (e) {
                    throw e
                }
            })
        })

        describe('windows-1252 normal', () => {
            it('deve resolver o conteúdo do arquivo retornando um OfxJSON - sem opções', async () => {
                const arquivo = {}
                const fileReader = criaOfxFileReader(PATH_OFX_UTF8_NORMAL)

                try {
                    const ofxJSON = await ofxToJSON(arquivo, fileReader)
                    expect(ofxJSON).toBeDefined()
                    expect(typeof ofxJSON).toBe('object')
                    expect(ofxJSON.signonmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.signonmsgsrsv1).toBe('object')
                    expect(ofxJSON.bankmsgsrsv1).toBeDefined()
                    expect(typeof ofxJSON.bankmsgsrsv1).toBe('object')
                } catch (e) {
                    throw e
                }
            })
        })
    })
})

function criaOfxFileReader(caminho) {
    return {
        readAsText(arquivo, encode) {
            this.onload({
                target: {
                    result: fs.readFileSync(caminho).toString(),
                },
            })
        },
        onload(evento) {
            return Promise.resolve(evento.target.result)
        }
    }
}
