import { Loading, Message } from 'admall-element'
import Quill from 'quill'
import { upload } from '../../ts/upload'
const BlockEmbed = Quill.import('blots/block/embed')
const options = {
    lock: true,
    text: '正在上传视频',
    spinner: 'el-icon-loading',
    background: 'transparent'
}
let loadingInstance = null

export class VideoBlot extends BlockEmbed {
    static create (value) {
        const node = super.create()
        node.setAttribute('src', value.url)
        node.setAttribute('controls', '')
        node.setAttribute('preload', '')
        node.setAttribute('width', value.width)
        node.setAttribute('height', value.height)
        node.setAttribute('webkit-playsinline', true)
        node.setAttribute('playsinline', true)
        node.setAttribute('x5-video-player-type', 'h5')
        node.setAttribute('loop', value.loop)
        node.setAttribute('autoplay', value.autoplay)
        return node
    }

    static value (node) {
        return {
            url: node.getAttribute('src'),
            width: node.getAttribute('width'),
            height: node.getAttribute('height')
        }
    }
}

export class VideoUp {
    constructor (quill, options) {
        this.quill = quill
        this.options = options
        this.container = quill.container.querySelector('.ql-editor')
        this.currentSelectionDom = null
        this.index = 0

        // 获取当前光标所在位置的元素
        quill.on('editor-change', (event, args) => {
            if (args && args.index) {
                this.index = args.index
                this.currentSelectionDom = quill.getLine(args.index)[0]
            }
            if (!this.currentSelectionDom) {
                this.currentSelectionDom = this.container
            }
        })

        this.input = document.createElement('input')
        this.input.accept = 'video/mp4'
        this.input.type = 'file'
        // 要想成功获取toolbar，模块必须添加到toolbar后面
        const toolbar = quill.getModule('toolbar')
        // 监听图片点击事件
        toolbar.addHandler('video', this.handleVideo.bind(this))
        this.input.addEventListener('change', this.change.bind(this))
    }

    handleVideo () {
        this.input.click()
    }

    async change (e) {
        const fileList = e.target.files
        for (const blob of fileList) {
            try {
                if (blob.size > 52428800) {
                    Message.error('视频大小不能超过50M')
                    return
                }
                loadingInstance = Loading.service(options)
                /* eslint-disable */
        const res = await this.uploadImage.call(this, blob)
        const videoSrc = this.options.response(res.url)
        this.quill.insertEmbed(this.index, 'simpleVideo', {
          url: videoSrc,
          controls: false,
          autoplay: true,
          width: '100%',
          height: '100%',
          loop: true
        })
        this.quill.setSelection(1 + this.index)
      } catch (e) {
        Message.error(e.message)
        throw e
      } finally {
        loadingInstance.close()
      }
    }
    this.input.type = 'text'
    this.input.type = 'file'
  }
  uploadImage (file) {
    return upload(file)
  }
}
