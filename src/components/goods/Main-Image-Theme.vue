<template>
  <div :class="$style.mainImageTheme" v-show="firstImage">
    <div :class="$style.head">
      {{ headTitle }}：<i :class="$style.status">{{ confirmTheme.url ? '使用中' : '未使用' }}</i> <span class="fz-12 gray-3">（使用后，上传的商品banner图首图为添加主题后的图片）</span>
    </div>
    <div :class="$style.imgs">
      <div
        v-for="(img, i) of this.theme"
        :class="{
          [$style.imgWrap]: true,
          [$style.used]: img.id === confirmTheme.id,
        }"
        :key="i"
      >
        <img
          :src="img.url"
          alt=""
        >
        <div>
          <el-button type="text" @click="useHandler(img)">
            使用
          </el-button>
          <el-button type="text" @click="cancelUse(img)" v-if="img.id === confirmTheme.id">
            取消
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="编辑主题"
      width="800px"
    >
      <div :class="$style.editBox">
        <!-- 原图（编辑预览） -->
        <div
          :class="$style.originalImage"
          :style="{ backgroundImage: `url(${firstImage})` }"
        >
          <div :class="$style.themeImage" :style="{ backgroundImage: `url(${currentTheme.url})` }">
            <div
              :class="{
                [$style.titleWrap]: true,
                [$style.fixedPrice]: currentTheme.isPrice && currentTheme.priceShow === 1,
                [$style.noPrice]: !currentTheme.isPrice,
                [$style.minPrice]: currentTheme.isPrice && currentTheme.priceShow === 2,
              }"
            >
              <!-- 左挂件（龙门节） -->
              <img
                v-if="this.currentTheme.url && this.currentTheme.url.indexOf('theme4') > -1"
                width="40"
                :class="$style.pendant"
                :src="this.leftFish"
              >
              <!-- 标题 -->
              <div
                :class="$style.text"
                v-text="title"
              />
              <!-- 右挂件（龙门节） -->
              <img v-if="this.currentTheme.url && this.currentTheme.url.indexOf('theme4') > -1" width="40" :class="$style.pendant" :src="this.rightFish">
            </div>

            <!-- 价格预览 -->
            <template v-if="currentTheme.isPrice">
              <!-- 价格在右边（固定价） -->
              <div
                :class="{
                  [$style.price]: true,
                  [$style.priceType1]: true,
                }"
                v-if="currentTheme.priceShow === 1"
              >
                <div :class="$style.priceType">
                  到手价
                </div>
                <div v-text="fixedPrice" :class="{ [$style.fixedPrice]: true, [$style.small]: String(fixedPrice).length > 7 }" />
              </div>
              <!-- 价格在右边（最低价） -->
              <div
                :class="{
                  [$style.price]: true,
                  [$style.priceType2]: true,
                }"
                v-if="currentTheme.priceShow === 2"
              >
                <div :class="$style.priceType">
                  现在仅需
                </div>
                <div v-text="minPrice" :class="{ [$style.fixedPrice]: true, [$style.small]: String(minPrice).length > 8 }" />
              </div>
              <!-- 价格在左下角（固定价） -->
              <div
                :class="{
                  [$style.price]: true,
                  [$style.priceType3]: true,
                }"
                v-if="currentTheme.priceShow === 3"
              >
                <div :class="$style.priceType">
                  到手价
                </div>
                <div v-text="fixedPrice" :class="{ [$style.fixedPrice]: true }" />
              </div>
            </template>
          </div>
        </div>
        <div>
          <el-form-item
            v-if="currentTheme.priceShow !== 3"
            :error="titleError"
            style="display: inline-block"
            class="mr-10"
          >
            <el-input
              v-if="currentTheme.isTitle"
              v-model.trim="title"
              style="width: 300px;"
              placeholder="请输入内容"
              @blur="checkTitle"
            />
          </el-form-item>
          <template v-if="currentTheme.isPrice === 1">
            <span v-if="currentTheme.priceShow === 2">仅需 {{ minPrice }} 元</span>
            <el-form-item
              v-if="currentTheme.priceShow === 1 || currentTheme.priceShow === 3"
              style="display: inline-block"
            >
              到手价
              <el-input-number :value="fixedPrice" @change="fixedPriceChange" :precision="2" :min="0" :max="9999999.99" />
              元
            </el-form-item>
          </template>
        </div>
        <div :class="$style.tips">
          <pre v-text="currentTheme.instructions" />
        </div>
      </div>
      <div style="text-align: center;" class="mt-20">
        <el-button @click="showDialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="save">
          保存并使用
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getMainImageTheme
  // updateLabel,
  // deleteLabel
} from '../../apis/goods'
import { loadImage } from '../../assets/ts/utils'
import { upload, deleteImage } from '../../assets/ts/upload'
export default {
  name: 'MainImageTheme',
  data () {
    return {
      showDialog: false,
      // 主题数据列表
      theme: [],
      // 正在预览的主题
      currentTheme: {},
      // 确认使用的主题
      confirmTheme: {},
      // 主题文本内容
      title: '',
      // 主题使用的固定价格
      fixedPrice: 0,
      titleError: '',
      canvas: document.createElement('canvas'),
      // 龙门节特有图标
      leftFish: 'https://mallcdn.youpenglai.com/static/admall/2.9.0/fish-right.png',
      rightFish: 'https://mallcdn.youpenglai.com/static/admall/2.9.0/fish-left.png'
    }
  },
  props: {
    // 真删或者假删
    deleteTruth: {
      type: Boolean,
      default: true
    },
    defaultTheme: {
      type: Object,
      default () {
        return null
      }
    },
    productImage: {
      type: Array,
      default () {
        return []
      }
    },
    // 现有的主图（可能带有主题）
    productMainImage: {
      type: String,
      default: '',
      required: true
    },
    headTitle: {
      type: String,
      default: '首图主题'
    },
    // 来源 1 商品 2 云课堂
    source: {
      type: Number,
      default: 1
    },
    defaultMinPrice: {
      type: [Number, String],
      default: -1
    },
    sku: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    minPrice () {
      if (this.sku.length) {
        return Math.min(...this.sku.map(item => item.price))
      }
      if (Number(this.defaultMinPrice) >= 0) {
        return this.defaultMinPrice
      }
      return '?'
    },
    firstImage () {
      return this.productImage[0] || ''
    }
  },
  watch: {
    firstImage (val) {
      this.themeChanged = true
    }
  },
  async activated () {
    try {
      await this.init()
    } catch (e) {
      throw e
    }
  },
  async created () {
    try {
      await this.init()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async init () {
      this.themeChanged = true
      this.titleError = ''
      this.title = ''
      this.fixedPrice = 0
      try {
        await this.getMainImageTheme()
      } catch (e) {
        throw e
      }
    },
    async getMainImageTheme () {
      try {
        const {result  } = await getMainImageTheme()
        this.theme = result
        if (this.defaultTheme) {
          this.currentTheme = this.theme.find(item => item.id === this.defaultTheme.themeId)
          this.confirmTheme = this.currentTheme
          this.title = this.defaultTheme.title
          this.fixedPrice = this.defaultTheme.price || 0
        }
      } catch (e) {
        throw e
      }
    },
    // 修改到手价
    fixedPriceChange (val) {
      this.fixedPrice = val || 0
    },
    // 点击使用只替按钮
    useHandler (item) {
      if (this.defaultTheme && item.id === this.defaultTheme.themeId) {
        this.title = this.defaultTheme.title
        this.fixedPrice = this.defaultTheme.price || 0
      } else {
        this.titleError = ''
        this.title = ''
        this.fixedPrice = 0
      }
      this.showDialog = true
      this.currentTheme = item
    },
    // 取消使用主题
    cancelUse () {
      this.confirmTheme = {}
      this.currentTheme = {}
      this.themeChanged = true
      this.$emit('cancel', null)
    },
    // 暂时保存已选主题的信息，等待正式生成主题图的时候，才去触发confirm事件
    save () {
      if (!this.checkTitle()) {
        return
      }
      this.confirmTheme = this.currentTheme
      this.showDialog = false
      this.themeChanged = true
    },
    // 正式确认主题
    confirm () {
      if (!this.firstImage) {
        this.$emit('confirm', null)
        return
      }
      if (!this.confirmTheme.id) {
        this.$emit('confirm', null)
        return
      }
      const data = JSON.parse(JSON.stringify(this.confirmTheme))
      data.title = this.title
      data.price = this.fixedPrice
      const { id, isTitle, isPrice, priceShow, instructions } = data
      // 没有最小价格，因为最小价格来自规格，所以说明没有规格，不生成主题
      if (isPrice && priceShow === 2 && this.minPrice === '?') {
        this.$emit('confirm', null)
        return
      }
      this.$emit('confirm', {
        themeId: id,
        type: this.source, // 1 商品 2 云课堂
        isTitle,
        title: this.title,
        isPrice,
        priceShow,
        price: priceShow !== 2 ? this.fixedPrice : this.minPrice,
        instructions
      })
    },
    checkTitle () {
      if (this.currentTheme.isTitle && !this.title) {
        this.titleError = '请输入内容'
        return false
      }
      this.titleError = ''
      if (this.currentTheme.isPrice) {
        if (this.title.length > 8 && this.currentTheme.priceShow === 2) {
          this.titleError = '输入内容不得超过8个字符'
          return false
        }
        this.titleError = ''
        if (this.title.length > 12 && this.currentTheme.priceShow === 1) {
          this.titleError = '输入内容不得超过12个字符'
          return false
        }
        this.titleError = ''
      } else {
        if (this.title.length > 14) {
          this.titleError = '输入内容不得超过14个字符'
          return false
        }
      }
      this.titleError = ''
      return true
    },
    /**
     * 根据设置的信息生成主题
     * @returns Promise<String>
     */
    async generateImage () {
      try {
        // 主图没有改变
        console.log(this.themeChanged)
        if (!this.themeChanged) {
          return this.productMainImage || this.firstImage
        }
        // 确认生成主题
        this.confirm()
        await this.$nextTick()
        // 主题被取消，或者没有主题
        if (!this.defaultTheme) {
          return this.firstImage
        }
        const { price, title, priceShow, isPrice } = this.defaultTheme
        const { url } = this.confirmTheme
        const CVS = document.createElement('canvas')
        CVS.width = 750
        CVS.height = 500
        const CTX = CVS.getContext('2d')
        const image = await loadImage(this.firstImage)
        CTX.drawImage(image, 0, 0, 750, 500)
        const themeImage = await loadImage(url)
        CTX.drawImage(themeImage, 0, 0)
        CTX.fillStyle = '#fff'
        CTX.textBaseline = 'hanging'
        if (isPrice) {
          let priceWidth = 0
          // 右下角固定价格
          if (priceShow === 1) {
            // 钱数是否过大
            const isSoBig = String(price).length > 7
            const temPrice = price || '0'
            CTX.font = 'bold 24px Microsoft YaHei'
            CTX.fillText('到手价', 580, 334)
            CTX.font = 'bold 32px Microsoft YaHei'
            CTX.textAlign = 'center'
            CTX.fillText(title, 750 / 2, 443)
            CTX.font = isSoBig ? 'bold 40px Microsoft YaHei' : 'bold 56px Microsoft YaHei'
            priceWidth = CTX.measureText(temPrice).width
            CTX.fillText(temPrice, 750 - 125, isSoBig ? 370 : 360)
            CTX.font = isSoBig ? 'bold 22pX Microsoft YaHei' : 'bold 28pX Microsoft YaHei'
            CTX.textAlign = 'start'
            CTX.fillText('￥', 750 - 125 - priceWidth / 2 - (isSoBig ? 22 : 28), isSoBig ? 382 : 376)
          }
          // 最小价
          if (priceShow === 2) {
            // 钱数是否过大
            const isSoBig = String(price).length > 8
            CTX.font = 'bold 40px Microsoft YaHei'
            CTX.fillText(title, 24, 440)
            CTX.font = 'bold 36px Microsoft YaHei'
            CTX.fillText('现在仅需', 542, 358)
            CTX.font = isSoBig ? 'bold 42px Microsoft YaHei' : 'bold 56px Microsoft YaHei'
            CTX.textAlign = 'center'
            let temPrice = price || '0'
            priceWidth = CTX.measureText(temPrice).width
            CTX.fillText(temPrice, 750 - 135, isSoBig ? 426 : 412)
            CTX.font = isSoBig ? 'bold 22pX Microsoft YaHei' : 'bold 28pX Microsoft YaHei'
            CTX.textAlign = 'start'
            CTX.fillText('￥', 624 - priceWidth / 2 - (isSoBig ? 28 : 36), isSoBig ? 438 : 424)
          }
          /* 左下角固定价格 */
          if (priceShow === 3) {
            const temPrice = price || '0'
            CTX.font = '24px Microsoft YaHei'
            CTX.fillText('到手价 ￥', 22, 460)
            CTX.font = '56px Microsoft YaHei'
            CTX.textAlign = 'left'
            CTX.fillText(temPrice, 124, 436)
          }
        } else {
          // 无价格
          CTX.font = 'bold 40px Microsoft YaHei'
          CTX.textAlign = 'center'
          CTX.fillText(title, 750 / 2, 440)
          if (url === 'https://mallcdn.youpenglai.com/static/admall/2.9.0/theme4.png') {
            // 龙门节无价格主题
            const titleWidth = CTX.measureText(title).width
            // // 在左边的鱼
            const leftFish = await loadImage(this.leftFish)
            // // 在右边的鱼
            const rightFish = await loadImage(this.rightFish)
            CTX.drawImage(leftFish, 750 / 2 - titleWidth / 2 - 62, 440, 52, 46)
            CTX.drawImage(rightFish, 750 / 2 + titleWidth / 2 + 10, 440, 52, 46)
          }
        }
        return new Promise((resolve, reject) => {
          CVS.toBlob(async blob => {
            try {
              const res = await upload(blob)
              resolve(res.url)
            } catch (e) {
              reject(e)
            }
          }, 'image/jpeg', 0.9)
        })
      } catch (e) {
        this.$warning('主题修改失败')
        return this.productImage[0]
      }
    }
  }
}
</script>

<style module lang="scss">
  .mainImageTheme {
    width: max-content;
    max-width: 90%;
    margin-top: 14px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .1);
  }
  .head {
    padding: 0 16px;
    border-bottom: 1px solid #e7e7e7;
    line-height: 48px;
    background-color: #F8F8F8;
    > .status {
      font-weight: bold;
      color: $--color-primary-orange;
    }
  }
  .imgs {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
  }
  .imgWrap {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-right: 14px;
    border-radius: 4px;
    overflow: hidden;
    > img {
      width: 100px;
      height: 67px;
      border-radius: 4px;
    }
    > button {
      margin-top: 8px;
      padding: 0;
    }
    &.used {
      &:before {
        position: absolute;
        content: '使用中';
        left: 0;
        top: 0;
        padding: 2px 5px;
        font-size: 12px;
        color: #fff;
        line-height: 16px;
        background-color: $--color-primary-orange;
      }
    }
  }
  .editBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    > div {
      margin-top: 16px;
      width: 550px;
      input {
        border-color: #e7e7e7 !important;
      }
    }
    > .tips {
      width: 550px;
      margin-top: 0;
    }
  }
  .originalImage {
    width: 550px;
    height: 367px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .themeImage {
    position: relative;
    width: 550px;
    height: 367px;
    padding-top: 308px;
    background-size: 100% 100%;
    background-position: left top;
    background-repeat: no-repeat;
    .price {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 210px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      &.priceType1 {
        bottom: 45px;
        > .priceType {
          font-size: 18px;
          margin-bottom: 0;
        }
      }
      &.priceType2 {
        margin-bottom: 8px;
        padding-left: 30px;
        font-size: 28px;
        > .priceType {
          margin-bottom: 12px;
        }
      }
      &.priceType3 {
        left: 0;
        display: inline-flex;
        align-items: center;
        width: max-content;
        padding-left: 15px;
        line-height: 1 !important;
        font-weight: normal;
        > .priceType {
          font-size: 16px;
          margin-bottom: 2px;
        }
        > .fixedPrice {
          line-height: 1;
          &:before {
            vertical-align: 0 !important;
            font-size: 15px;
          }
        }
      }
      .fixedPrice {
        transform: translateY(-10px);
        font-size: 40px;
        line-height: 50px;
        &::before {
          content: '￥';
          font-size: 24px;
          vertical-align: 6px;
        }
        &.small {
          font-size: 30px;
          &::before {
            content: '￥';
            font-size: 16px;
            vertical-align: 3px;
          }
        }
      }
    }
  }
  .titleWrap {
    display: flex;
    align-items: center;
    text-align: center;
    height: 59px;
    > .pendant {
      vertical-align: -4px;
      justify-self: center;
    }
    &.fixedPrice {
      justify-content: center;
      > .text {
        font-size: 26px;
      }
    }
    &.minPrice {
      > .text {
        text-align: left;
        font-size: 30px;
      }
    }
    &.noPrice {
      justify-content: center;
      > .text {
        padding: 0 10px;
        font-size: 30px;
      }
    }
    > .text {
      display: inline-block;
      padding: 0 26px;
      color: #fff;
      font-weight: bold;
      line-height: 59px;
    }
  }



</style>
