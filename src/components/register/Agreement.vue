<template>
    <el-dialog
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="show"
        @close="close"
    >
        <div class="service-protocol" v-if="agreement">
            <component :is="agreement" />
        </div>
        <span slot="footer">
            <el-button
                size="large"
                type="primary"
                @click="close"
            >
                确 定
            </el-button>
        </span>
    </el-dialog>
</template>
<script>
import YajiService from './agreements/Yaji-Service.vue'
import BanOnGoods from './agreements/Ban-On-Goods.vue'
import ElectronicCommerceLaw from './agreements/Electronic-Commerce-Law.vue'
import Live from './agreements/Live.vue'
import Pay from './agreements/Pay.vue'
import Privacy from './agreements/Privacy.vue'
import ResourceLibrary from './agreements/Resource-Library.vue'
export default {
    name: 'Agreement',
    data () {
        return {
            agreementMap: {
                1: YajiService,
                2: BanOnGoods,
                3: Privacy,
                4: Pay,
                5: ElectronicCommerceLaw,
                6: Live,
                7: ResourceLibrary
            }
        }
    },
    props: {
        type: {
            type: [String, Number],
            default: 1
        },
        show: Boolean
    },
    computed: {
        agreement () {
            return this.agreementMap[this.type] || null
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}

</script>

<style lang="scss">
.service-protocol {
  height: 600px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
  word-break: break-all;
  .protocol-h2 {
    font-size: 36px;
    text-align: center;
    line-height: 50px;
  }
  .protocol-h3 {
    font-size: 32px;
    margin: 50px 0;
  }
  .protocol-h4 {
    font-size: 28px;
    font-weight: bold;
    margin: 25px 0;
  }
  .protocol-h5 {
    padding-left: 1em;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  p {
    line-height: 25px;
  }
  .indent1 {
    text-indent: 1em;
  }
  .indent2 {
    text-indent: 2em;
  }
  .indent3 {
    text-indent: 3em;
  }
  .list-rest {
    counter-reset: no 0;
    counter-reset: subNo 0;
    .counter {
      line-height: 25px;
      &:before {
        counter-increment: subNo;
        content: counters(subNo, '.')'、';
      }
    }
  }
}
</style>
