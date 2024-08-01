import { INodeParams, INodeCredential } from '../src/Interface'

class BaichuanzhinengApi implements INodeCredential {
    label: string
    name: string
    version: number
    inputs: INodeParams[]

    constructor() {
        this.label = 'Baichuanzhineng API'
        this.name = 'chatBaichuanzhinengBaichuan'
        this.version = 1.0
        this.inputs = [
            {
                label: 'Baichuanzhineng Api Key',
                name: 'apiKey',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: BaichuanzhinengApi }
