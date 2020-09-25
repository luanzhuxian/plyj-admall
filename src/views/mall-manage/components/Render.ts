import { CreateElement, RenderContext } from 'vue'

export default {
    functional: true,
    render: (h: CreateElement, ctx: RenderContext) => ctx.props.render(h, ctx.props)
}
