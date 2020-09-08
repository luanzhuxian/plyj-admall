<template>
    <el-dialog
        class="add-tags"
        title="设置用户标签"
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
                    :maxlength="maxTagNameLength"
                />
                <el-button class="add-tags__btn" type="primary" @click="add">
                    新增
                </el-button>
            </div>
            <!-- 已选中的标签 -->
            <div class="add-tags__selected">
                <span class="add-tags__selected--left">已选择{{ selected.length }}个标签</span>
                <div class="add-tags__selected--right" v-if="selected.length && tagList.length">
                    <span
                        class="el-icon-check"
                        v-for="id of selected"
                        :key="id"
                        v-text="getNameById(id)"
                    />
                </div>
            </div>
            <!-- 所有标签 -->
            <div class="add-tags__list" :class="{ 'add-tags__list--expanded': expanded }">
                <template v-if="tagList && tagList.length">
                    <el-checkbox-group v-model="selected" class="add-tags__list-wrapper" :max="maxSetTagNum">
                        <div
                            class="add-tags__list-item"
                            v-for="(item, i) of (expanded ? tagList : tagList.slice(0, 9))"
                            :key="item.id"
                        >
                            <!-- 编辑标签 -->
                            <template v-if="editId === item.id">
                                <el-input
                                    class="add-tags__list-input"
                                    v-model.trim="inputEdit"
                                    :placeholder="item.tagName"
                                    :maxlength="maxTagNameLength"
                                />
                                <button class="blue" @click="update(item)">
                                    保存
                                </button>
                                <button class="blue" @click="cancelEdit">
                                    取消
                                </button>
                            </template>
                            <!-- 查看标签 -->
                            <template v-else>
                                <div class="" @click.stop="onCheckboxClick(item.id)">
                                    <el-checkbox
                                        class="el-icon-check"
                                        :key="item.id"
                                        :label="item.id"
                                        border
                                    >
                                        {{ item.tagName }}
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
                        v-if="tagList.length > 9"
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
import { addTag, updateTag, getTagList, deleteTag, checkIsTagUsed, addTagToMember } from '../../../../apis/member'

export default {
    name: 'AddTags',
    props: {
        show: Boolean,
        currentMember: {
            type: Object,
            required: true,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            maxSetTagNum: 4,
            // 标签最小长度
            minTagNameLength: 2,
            // 标签最大长度
            maxTagNameLength: 8,
            // 更多
            expanded: false,
            // 新增标签
            inputAdd: '',
            // 编辑标签
            inputEdit: '',
            // 编辑标签的id
            editId: '',
            // 已选中的标签
            selected: [],
            // 所有标签
            tagList: []
        }
    },
    watch: {
        show (val) {
            val ? this.getTagList() : this.clearData()
        },
        currentMember: {
            // 获取已选中标签的id列表
            handler (member) {
                const tags = member.tags || []
                this.selected = tags.map(item => item.id)
            },
            deep: true
        }
    },
    methods: {
        // 根据id获取标签名称
        getNameById (id) {
            const find = this.tagList.find(item => item.id === id)
            return find ? find.tagName : ''
        },
        // 清除数据
        clearData () {
            this.inputEdit = ''
            this.inputAdd = ''
            this.editId = ''
            this.expanded = false
        },
        // 获取所有标签列表
        async getTagList () {
            try {
                const { data: { result } } = await getTagList()
                this.tagList = result
                // 强制刷新当前组件
                this.$forceUpdate()
            } catch (e) {
                throw e
            }
        },
        // 新增标签
        async add () {
            try {
                if (!this.inputAdd) return this.$warning('用户标签名称不能为空')
                if (this.inputAdd.length < this.minTagNameLength) return this.$warning('用户标签名称为2到8个字')
                const { data } = await addTag(this.inputAdd)
                // 在添加标签中新建标签，用户选中时，自动选中
                if (this.selected.length < 4) {
                    const id = data && data.result && data.result.id
                    this.selected.push(id)
                }
                this.getTagList()
                this.$success('添加标签成功')
                this.inputAdd = ''
            } catch (e) {
                throw e
            }
        },
        // 修改标签
        async update (tag) {
            try {
                if (!this.inputEdit) return this.$warning('用户标签名称不能为空')
                if (this.inputEdit.length < this.minTagNameLength) return this.$warning('用户标签名称为2到8个字')
                await updateTag(tag.id, this.inputEdit)
                this.$success('编辑标签成功')
                this.cancelEdit()
                this.getTagList()
            } catch (e) {
                throw e
            }
        },
        // 删除标签
        async remove (tag, index) {
            try {
                // TODO.删除分为两种，有无活动（需要等待新春包上传后）,有活动不允许删除;有无使用
                const { data } = await checkIsTagUsed(tag.id)
                if (data.result) {
                    await this.$confirm('删除标签后，该标签下的所有用户将失去该标签属性。是否确定删除？')
                }
                await deleteTag(tag.id)
                this.tagList.splice(index, 1)
                this.selected = this.selected.filter(id => id !== tag.id)
                this.$success('删除用户标签成功')
            } catch (e) {
                throw e
            }
        },
        // 编辑按钮
        edit (item) {
            this.cancelEdit()
            this.editId = item.id
            this.inputEdit = item.tagName
        },
        // 取消编辑
        cancelEdit () {
            this.editId = ''
            this.inputEdit = ''
        },
        // 确认
        async confirm () {
            try {
                const selected = []
                for (const id of this.selected) {
                    selected.push(this.tagList.find(item => item.id === id))
                }
                if (selected.length > 4) {
                    return this.$warning(`标签数量不能超过${ this.maxSetTagNum }个`)
                }
                await addTagToMember(this.currentMember.userId, this.selected)
                this.close()
            } catch (e) {
                throw e
            }
        },
        // 关闭弹框
        close () {
            this.$emit('update:show', false)
            this.$emit('confirm')
        },
        // 检查是否可以选择标签
        onCheckboxClick (id) {
            if (this.selected.length === this.maxSetTagNum && !this.selected.includes(id)) {
                return this.$warning(`标签数量不能超过${ this.maxSetTagNum }个`)
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .add-tags {
    ::v-deep .el-dialog__body {
      padding: 0 !important;
      position: relative;
    }

    .el-icon-check {
      display: inline-block;
      box-sizing: border-box;
      position: relative;
      width: 130px;
      height: 32px;
      line-height: 30px;
      color: #333333;
      border: 1px solid #666666;
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      overflow: hidden;
      &:before {
        display: none;
      }

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

      .el-icon-check {
        margin-bottom: 8px;
        margin-left: 8px;
        color: #598BF8;
        border-color: #598BF8;
        background-color: #F8F8F8;
        &:before {
          display: none;
        }
      }
    }

    &__list {
      width: 100%;
      padding: 16px 27px;
      max-height: 450px;
      overflow: auto;

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

      ::v-deep .el-checkbox__tag {
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

      .el-icon-check {
        position: relative;
        margin: 0;
        padding: 0 !important;
        &:before {
          display: none;
        }

        &.is-checked {
          border-color: #598BF8;

          ::v-deep .el-checkbox__tag {
            color: #598BF8 !important;
          }

          &:after {
            position: absolute;
            right: 0;
            content: '';
            font-size: 12px;
            border-top: 16px solid #598BF8;
            border-left: 26px solid transparent;
            z-index: 1;
          }

          &:before {
            display: inline;
            position: absolute;
            right: 0;
            font-size: 12px;
            color: #fff;
            line-height: 12px;
            z-index: 2;
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
