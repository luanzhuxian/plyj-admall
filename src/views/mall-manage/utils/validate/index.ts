import {
    TemplateBValidator,
    TemplateCValidator,
    TemplateDValidator,
    TemplateFengqiangValidator,
    TemplateBaofaValidator,
    TemplateSpringValidator,
    TemplateDragonGateValidator,
    TemplateDouble122020Validator
} from './template-validator'
import { TemplateCrosses } from '../types'

const validatorProducer = (tmplType: number, moduleModels: TemplateCrosses | object) => {
    const map: DynamicObject = {
        '-1': TemplateCValidator,
        3: TemplateBValidator,
        4: TemplateBValidator,
        5: TemplateFengqiangValidator,
        6: TemplateBaofaValidator,
        7: TemplateFengqiangValidator,
        8: TemplateSpringValidator,
        9: TemplateDValidator,
        10: TemplateDragonGateValidator,
        11: TemplateDouble122020Validator,
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
