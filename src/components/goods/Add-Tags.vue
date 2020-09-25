<template>
  <el-dialog
    class="add-tags"
    title="添加标签"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible="show"
    @close="close"
  >
    <template>
      <div class="add-tags__top">
        <el-input
          class="add-tags__top-input"
          v-model.trim="inputAdd"
          type="text"
          placeholder="请填写标签名称"
          maxlength="6"
        />
        <el-button class="add-tags__btn" type="primary" @click="add">
          新增
        </el-button>
      </div>
      <div class="add-tags__selected">
        <span class="add-tags__selected--left">已选择{{ selected.length }}个标签</span>
        <div class="add-tags__selected--right" v-if="selected.length && labelList.length">
          <span
            class="add-tags__label"
            v-for="(id, index) of selected"
            :key="index"
            v-text="getNameById(id)"
          />
        </div>
      </div>
      <div class="add-tags__list" :class="{ 'add-tags__list--expanded': expanded }">
        <template v-if="labelList && labelList.length">
          <el-checkbox-group v-model="selected" class="add-tags__list-wrapper" :max="4">
            <div
              class="add-tags__list-item"
              v-for="(item, i) of (expanded ? labelList : labelList.slice(0, 9))"
              :key="i"
            >
              <template v-if="editId === item.id">
                <el-input
                  class="add-tags__list-input"
                  v-model.trim="inputEdit"
                  :placeholder="item.labelName"
                  maxlength="6"
                />
                <button class="blue" @click="update(item)">
                  保存
                </button>
                <button class="blue" @click="cancel">
                  取消
                </button>
              </template>
              <template v-else>
                <div class="" @click.stop="onCheckboxClick(item.id)">
                  <el-checkbox
                    class="add-tags__label"
                    :key="i"
                    :label="item.id"
                    border
                  >
                    {{ item.labelName }}
                    <pl-svg name="icon-product-label-selected" width="30" height="19" />
                  </el-checkbox>
                </div>
                <button @click="edit(item)">
                  编辑
                </button>
                <button @click="remove(item, i)">
                  移除
                </button>
              </template>
            </div>
          </el-checkbox-group>
          <div
            v-if="labelList.length > 9"
            class="add-tags__list-more"
            @click="expanded = !expanded"
          >
            <span>
              {{ expanded ? '收起' : '查看更多标签' }}
              <i class="el-icon-caret-bottom" />
            </span>
          </div>
        </template>
        <div v-else class="no-content">
          暂无标签
        </div>
      </div>
      <div class="add-tags__bottom">
        <el-button class="add-tags__btn" @click="confirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  getLabelList,
  addLabel,
  updateLabel,
  deleteLabel,
  checkIsLabelUsed
} from '../../apis/product-center/goods'
export default {
  name: 'AddTags',
  props: {
    show: Boolean,
    tags: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      expanded: false,
      inputAdd: '',
      inputEdit: '',
      editId: '',
      selected: [],
      labelList: []
    }
  },
  created () {
    try {
      this.getLabelList()
    } catch (e) {
      throw e
    }
  },
  watch: {
    show (val) {
      if (!val) {
        this.editId = ''
        this.inputEdit = ''
        this.inputAdd = ''
      }
    },
    tags: {
      handler (tags) {
        if (!this.labelList.length) return
        this.selected = tags.filter(item => this.getNameById(item.id)).map(item => item.id)
      },
      deep: true
    }
  },
  methods: {
    getNameById (id) {
      let find = this.labelList.find(item => item.id === id)
      return find ? find.labelName : false
    },
    async getLabelList () {
      try {
        const { data: { result } } = await getLabelList()
        this.labelList = result
        this.$forceUpdate()
      } catch (e) {
        throw e
      }
    },
    async add () {
      const { inputAdd: value } = this
      if (this.labelList.length === 30) { return this.$warning('最多可添加30个标签') }
      if (!value) return this.$warning(this.$route.name.includes('Courses') ? '课程标签不能为空' : '商品标签不能为空')
      let tagsAlert = this.$route.name.includes('Courses') ? '课程标签不可超过6个字' : '商品标签不可超过6个字'
      if (value.length > 6) return this.$warning(tagsAlert)

      await addLabel({ labelName: value })
      this.getLabelList()
      this.$success(this.$route.name.includes('Courses') ? '课程标签添加成功' : '商品标签添加成功')
    },
    async update (label) {
      const { inputEdit: value } = this
      if (!value) return this.$warning(this.$route.name.includes('Courses') ? '课程标签不能为空' : '商品标签不能为空')
      let tagsAlert = this.$route.name.includes('Courses') ? '课程标签不可超过6个字' : '商品标签不可超过6个字'
      if (value.length > 6) return this.$warning(tagsAlert)

      await updateLabel({ id: label.id, labelName: value })
      label.labelName = value
      this.$success(this.$route.name.includes('Courses') ? '课程标签编辑成功' : '商品标签编辑成功')
      this.cancel()
    },
    async remove (label, index) {
      try {
        const res = await checkIsLabelUsed(label.id)
        if (res.data.result) {
          await this.$confirm(this.$route.name.includes('Courses') ? '有课程已使用该标签，确认删除？' : '有商品已使用该标签，确认删除？')
        }
        await deleteLabel(label.id)
        this.labelList.splice(index, 1)
        this.selected = this.selected.filter(id => id !== label.id)
        this.$success(this.$route.name.includes('Courses') ? '课程标签删除成功' : '商品标签删除成功')
      } catch (e) {
        throw e
      }
    },
    edit (item) {
      this.cancel()
      this.editId = item.id
      this.inputEdit = item.labelName
    },
    cancel () {
      this.editId = ''
      this.inputEdit = ''
    },
    confirm () {
      let selected = []
      for (let id of this.selected) {
        selected.push(this.labelList.find(item => item.id === id))
      }
      this.$emit('update:show', false)
      this.$emit('confirm', JSON.parse(JSON.stringify(selected)))
    },
    close () {
      this.$emit('update:show', false)
    },
    onCheckboxClick (id) {
      if (this.selected.length === 4 && !this.selected.includes(id)) {
        let tagsAlert = this.$route.name.includes('Courses') ? '课程标签不可超过4个' : '商品标签不可超过4个'
        return this.$warning(tagsAlert)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .add-tags {
    ::v-deep .el-dialog__body {
      padding: 0 !important;
    }
    .add-tags__label {
      display: inline-block;
      box-sizing: border-box;
      position: relative;
      width: 95px;
      height: 32px;
      line-height: 30px;
      color: #333333;
      border: 1px solid #666666;
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      overflow: hidden;
      &:hover {
        background-color: #F8F8F8;
      }
    }
    &__btn {
      width: 98px;
    }
    &__top {
      display: flex;
      align-items: center;
      padding: 0 27px 16px 27px;
      border-bottom: 1px solid #e7e7e7;
      &-input {
        width: 180px;
        margin-right: 10px;
      }
    }

    &__selected {
      display: flex;
      align-items: flex-start;
      padding: 16px 27px 8px;
      font-size: 14px;
      color: #333333;
      border-bottom: 1px solid #e7e7e7;
      &--left {
        min-width: 100px;
        line-height: 32px;
        margin-bottom: 8px;
      }
      &--right {
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .add-tags__label {
        margin-bottom: 8px;
        margin-left: 8px;
        color: #598BF8;
        border-color: #598BF8;
        background-color: #F8F8F8;
      }
    }

    &__list {
      width: 100%;
      padding: 16px 27px;

      ::v-deep .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      ::v-deep .checkbox-group {
        display: flex;
        flex-wrap: wrap;
      }
      ::v-deep .el-checkbox__input {
        display: none !important;
      }
      ::v-deep .el-checkbox__label {
        padding-left: 0;
      }
      &-input {
        width: 95px;
      }
      &-wrapper {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 0 -15px;
      }
      &-item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        margin: 0 15px 30px;
        flex: 0 0 28%;
        > button {
          margin-left: 10px;
          font-size: 12px;
          color: #666;
          background-color: transparent;
          border: none;
          cursor: pointer;
          &:hover {
            color: #598BF8;
          }
          &.blue {
            color: #598BF8;
          }
        }
      }
      &-more {
        text-align: center;
        font-size: 12px;
        color: #999999;
        padding-bottom: 16px;
        cursor: pointer;
      }
      &--expanded {
        .el-icon-caret-bottom {
          transform: rotate(-180deg);
        }
      }
      .el-icon-caret-bottom {
        color: #333;
        font-size: 10px;
        transition: all 0.3s ease-in-out;
      }
      .add-tags__label {
        position: relative;
        margin: 0;
        padding: 0 !important;
        svg {
          position: absolute;
          top: 0;
          right: 0;
          display: none;
        }
        &.is-checked {
          border-color: #598BF8;
          ::v-deep .el-checkbox__label {
            color: #598BF8 !important;
          }
          svg {
            display: inline;
          }
        }
      }
    }

    &__bottom {
      padding: 32px 0;
      text-align: center;
      border-top: 1px solid #e7e7e7;
    }
    .no-content {
      text-align: center;
      padding: 30px 0;
    }
  }

</style>
