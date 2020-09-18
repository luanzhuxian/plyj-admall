import {
    TemplateBValidator,
    TemplateCValidator,
    TemplateDValidator,
    TemplateFengQiangValidator,
    TemplateBaoFaValidator,
    TemplateXinChunValidator,
    TemplateDragonGateValidator
} from './template-validator'
import { Template } from '../types'

const validatorProducer = (tmplId: string, moduleModels: Template | object) => {
    const map: DynamicObject = {
        '-1': TemplateCValidator,
        3: TemplateBValidator,
        4: TemplateBValidator,
        5: TemplateFengQiangValidator,
        6: TemplateBaoFaValidator,
        7: TemplateFengQiangValidator,
        8: TemplateXinChunValidator,
        9: TemplateDValidator,
        10: TemplateDragonGateValidator,
        findValidatorById (id: string) {
            return this[id]
        }
    }
    const Constuctor = map.findValidatorById(tmplId)
    return new Constuctor(tmplId, moduleModels)
}

export {
    validatorProducer
}
