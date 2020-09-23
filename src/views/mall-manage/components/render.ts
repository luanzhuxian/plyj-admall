import { Vue, Component } from 'vue-property-decorator'
import { CreateElement, RenderContext } from 'vue'

@Component
export default class Render extends Vue {
    functional = true
    render (h: CreateElement, ctx: RenderContext) {
        ctx.props.render(h, ctx.props)
    }
}
