import {
    TemplateBValidator,
    TemplateCValidator,
    TemplateDValidator,
    TemplateFengQiangValidator,
    TemplateBaoFaValidator,
    TemplateXinChunValidator,
    TemplateDragonGateValidator
} from './template-validator'
import { TemplateCrosses } from '../types'

const validatorProducer = (tmplType: string, moduleModels: TemplateCrosses | object) => {
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
        findValidatorByType (id: string) {
            return this[id]
        }
    }
    const Constuctor = map.findValidatorByType(tmplType)
    return new Constuctor(tmplType, moduleModels)
}

export {
    validatorProducer
}
