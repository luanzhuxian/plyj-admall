import { Loading, Message } from 'admall-element'
import { compress, upload } from '../../ts/upload'
const options = {
    lock: true,
    text: '正在上传图片',
    spinner: 'el-icon-loading',
    background: 'transparent'
}
let loadingInstance = null

class ImageUp {
    constructor (quill, options) {
        this.quill = quill
        this.options = options
        this.index = 0
        this.container = quill.container.querySelector('.ql-editor')
        this.currentSelectionDom = null

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
        this.input.accept = 'image/*'
        this.input.type = 'file'
        this.input.multiple = 'multiple'
        // 要想成功获取toolbar，模块必须添加到toolbar后面
        const toolbar = quill.getModule('toolbar')
        // 监听图片点击事件
        toolbar.addHandler('image', this.handleImage.bind(this))
        this.input.addEventListener('change', this.change.bind(this))
    }

    handleImage () {
        this.input.click()
    }

    async change (e) {
        const fileList = e.target.files
        for (let blob of fileList) {
            try {
                loadingInstance = Loading.service(options)
                if (blob.size > this.options.size && !~blob.type.indexOf('gif')) {
                    // 压缩图片
                    blob = await compress(blob, this.options.size)
                }
                this.quill.setSelection(1 + this.index)
                /* eslint-disable */
        const res = await this.uploadImage.call(this, blob)
        const imgSrc = this.options.response(res.url)
        const img = await this.createImage.call(this, imgSrc)
        img.width = 690
        // if (img.width > 690) {
        //   img.width = 690
        // }
        if (this.currentSelectionDom.domNode) {
          this.currentSelectionDom.domNode.appendChild(img)
        } else {
          this.currentSelectionDom.appendChild(img)
        }
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

  createImage (scr) {
    const img = document.createElement('img')
    img.src = scr
    return new Promise(resolve => {
      img.onload = () => {
        resolve(img)
      }
    })
  }
}

export default ImageUp
