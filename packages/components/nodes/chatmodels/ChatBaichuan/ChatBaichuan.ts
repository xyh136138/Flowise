import { BaseCache } from '@langchain/core/caches'
import { ChatBaichuanzhinengBaichuan } from '@langchain/community/chat_models/baichuanzhineng_baichuan'
import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { MODEL_TYPE, getModels } from '../../../src/modelLoader'

class ChatBaichuanzhinengBaichuan_ChatModels implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatBaichuanzhinengBaichuan'
        this.name = 'chatBaichuanzhinengBaichuan'
        this.version = 1.0
        this.type = 'ChatBaichuanzhinengBaichuan'
        this.icon = 'ChatBaichuanzhinengBaichuan.svg'
        this.category = 'Chat Models'
        this.description = 'Wrapper around BaichuanzhinengBaichuan Chat Endpoints'
        this.baseClasses = [this.type, ...getBaseClasses(ChatBaichuanzhinengBaichuan)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['chatBaichuanzhinengBaichuan']
        }
        this.inputs = [
            {
                label: 'Cache',
                name: 'cache',
                type: 'BaseCache',
                optional: true
            },
            // {
            //     label: 'Model Name',
            //     name: 'model',
            //     type: 'asyncOptions',
            //     loadMethod: 'listModels',
            //     default: 'Baichuan4'
            // },
            {
                label: 'Model Name',
                name: 'model',
                type: 'string',
                placeholder: 'Baichuan4'
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                step: 0.1,
                default: 0.7,
                optional: true
            }
        ]
    }

    //@ts-ignore
    loadMethods = {
        async listModels(): Promise<INodeOptionsValue[]> {
            return await getModels(MODEL_TYPE.CHAT, 'chatBaichuanzhinengBaichuan')
        }
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const cache = nodeData.inputs?.cache as BaseCache
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const apiKey = getCredentialParam('apiKey', credentialData, nodeData)

        const obj: Partial<ChatBaichuanzhinengBaichuan> = {
            stream: true,
            apiKey,
            model: modelName,
            temperature: temperature ? parseFloat(temperature) : undefined
        }
        if (cache) obj.cache = cache

        const model = new ChatBaichuanzhinengBaichuan(obj)
        return model
    }
}

module.exports = { nodeClass: ChatBaichuanzhinengBaichuan_ChatModels }
