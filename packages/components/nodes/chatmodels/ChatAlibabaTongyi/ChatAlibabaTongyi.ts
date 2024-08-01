import { BaseCache } from '@langchain/core/caches'
import { ChatAlibabaTongyi } from '@langchain/community/chat_models/alibaba_tongyi'
import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { MODEL_TYPE, getModels } from '../../../src/modelLoader'

class ChatAlibabaTongyi_ChatModels implements INode {
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
        this.label = 'ChatAlibabaTongyi'
        this.name = 'chatAlibabaTongyi'
        this.version = 1.0
        this.type = 'ChatAlibabaTongyi'
        this.icon = 'ChatAlibabaTongyi.svg'
        this.category = 'Chat Models'
        this.description = 'Wrapper around AlibabaTongyi Chat Endpoints'
        this.baseClasses = [this.type, ...getBaseClasses(ChatAlibabaTongyi)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['alibabaApiKey']
        }
        this.inputs = [
            {
                label: 'Cache',
                name: 'cache',
                type: 'BaseCache',
                optional: true
            },
            {
                label: 'Model Name',
                name: 'model',
                type: 'asyncOptions',
                loadMethod: 'listModels',
                default: 'qwen-turbo'
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
            return await getModels(MODEL_TYPE.CHAT, 'chatAlibabaTongyi')
        }
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const cache = nodeData.inputs?.cache as BaseCache
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const alibabaApiKey = getCredentialParam('alibabaApiKey', credentialData, nodeData)

        const obj: Partial<ChatAlibabaTongyi> = {
            streaming: true,
            alibabaApiKey,
            modelName,
            temperature: temperature ? parseFloat(temperature) : undefined
        }
        if (cache) obj.cache = cache

        const model = new ChatAlibabaTongyi(obj)
        return model
    }
}

module.exports = { nodeClass: ChatAlibabaTongyi_ChatModels }
