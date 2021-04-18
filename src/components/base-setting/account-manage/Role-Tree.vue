<template>
    <transition name="fade">
        <div
            class="Role-Tree"
            ref="RoleTree"
            v-show="show"
            @click.self="close"
        >
            <transition name="slide-right">
                <div
                    v-show="visible"
                    ref="slide"
                    class="slide"
                >
                    <div class="top">
                        <i
                            class="close el-icon-close"
                            @click="close"
                        />
                        <div style="font-size: 18px; font-weight: bold; margin: 20px 0 15px 0;">
                            角色权限设置
                        </div>
                    </div>

                    <el-tree
                        class="tree"
                        ref="tree"
                        size="mini"
                        :data="roleList"
                        :default-expand-all="true"
                        :default-checked-keys="defaultSelected"
                        node-key="aclCode"
                        :show-checkbox="showCheckbox"
                        :props="defaultProps"
                        @check="check"
                    />

                    <!--                    <div class="bottom">-->
                    <!--                        <el-button type="primary" @click="save" v-if="showCheckbox">-->
                    <!--                            保存-->
                    <!--                        </el-button>-->
                    <!--                        <el-button @click="close" v-if="showCheckbox">-->
                    <!--                            取消-->
                    <!--                        </el-button>-->
                    <!--                    </div>-->
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import { getAllRolesByCode } from '../../../apis/setting'
export default {
    name: 'RoleTree',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        roleCode: {
            type: String,
            default: ''
        },
        showCheckbox: {
            type: Boolean,
            default: false
        },
        treeList: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            show: false,
            roleList: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            defaultSelected: [],
            selected: []
        }
    },
    watch: {
        async visible (val) {
            if (val) {
                this.show = true
                try {
                    this.defaultSelected = []
                    if (this.treeList.length) {
                        this.roleList = this.treeList
                        this.searchKeyOfSelected(this.treeList)
                    } else if (this.roleCode) {
                        const { result } = await this.getAllRolesByCode()
                        this.roleList = result
                        this.searchKeyOfSelected(result)
                    }
                } catch (e) {
                    throw e
                }
            } else {
                setTimeout(() => {
                    this.show = false
                }, 200)
            }
        }
    },
    created () {
        this.show = this.visible
    },
    mounted () {
        this.$nextTick(() => {
            this.RoleTree = this.$refs.RoleTree
        })
    },
    methods: {
        async getAllRolesByCode () {
            const { result } = await getAllRolesByCode(this.roleCode)
            return result
        },
        close () {
            this.$emit('update:visible', false)
        },

        // 查找已选中的节点的key
        searchKeyOfSelected (list) {
            for (const item of list) {
                // status=2时必选且不可取消
                if (Number(item.status) === 2) {
                    item.checked = true
                    item.disabled = true
                }
                // status=0选中
                if (item.checked || item.status === 0) {
                    if (item.children) {
                        this.searchKeyOfSelected(item.children)
                    } else {
                        this.defaultSelected.push(item.aclCode)
                    }
                }
            }
        },

        /**
         * @param {array} currentData 当前操作的同级数据
         */
        check (currentData, allChecked) {
            const { tree } = this.$refs
            const { checkedKeys, halfCheckedKeys } = allChecked
            const currentNode = tree.getNode(currentData)

            /**
             * 判断当前取消勾选的是不是必选项，如果是，则提示不可取消
             * 如果当前项的同级节点没有任何已勾选的项，则可以取消勾选
             */
            if (currentData.status === 0 && !checkedKeys.includes(currentData.aclCode)) {
                // 当前项的同级节点是否全部被取消，须排除当前选项和其它统计必须项（有些模块一个级别有两个以上的必选项，如：helper管理）
                const anotherAllCancel = currentNode.parent.data.children
                    .filter(item => currentData.aclCode !== item.aclCode && Number(item.status) !== 0)
                    .every(item => !item.checked)
                if (!anotherAllCancel) {
                    // 设置以此 aclCode 为 key 的节点为选中
                    tree.setChecked(currentData.aclCode, true, true)
                    !checkedKeys.includes(currentData.aclCode) && checkedKeys.push(currentData.aclCode)
                    this.$warning('请先取消其它同级权限，再取消此权限')
                    return
                }
            }

            /**
             * 寻找同级别中的必选项，并自动选中
             * 此操作要一直向上延申，确保与(当前节点的父级同级的节点中的必选节点)被选中
             * 上面的解释比较拗口，如果不能确切的理解，不要轻易修改下面代码
             */
            let parent = currentNode.parent
            while (parent && parent.data.children && currentNode.checked) {
                // 找到当前级别的必选项，须排除当前项
                const must = parent.data.children.filter(item => Number(item.status) === 0 && currentData.aclCode !== item.aclCode)
                if (must.length) {
                    for (const m of must) {
                        tree.setChecked(m.aclCode, true, true)
                        !checkedKeys.includes(m.aclCode) && checkedKeys.push(m.aclCode)
                    }
                }
                parent = parent.parent
            }

            // 全部已选和半选
            this.selected = [...checkedKeys, ...halfCheckedKeys]
            this.save()
        },
        // 根据 tree 组件的勾选情况修改 model roleList
        changeNode (key, list) {
            for (const item of list) {
                if (key.includes(item.aclCode)) {
                    item.checked = true
                    if (item.children) {
                        this.changeNode(key, item.children)
                    }
                } else {
                    item.checked = false
                    if (item.children) {
                        this.changeNode(key, item.children)
                    }
                }
            }
        },
        save () {
            if (!this.selected.length) {
                // this.close()
                return
            }
            this.changeNode(this.selected, this.roleList)
            const changeTreeData = {
                menuCode: this.selected,
                menuTree: this.roleList
            }
            this.$emit('changeTree', changeTreeData)
            // this.close()

            // try {
            //   // await updateRolePower(data)
            //   // this.close()
            // } catch (e) {
            //   throw e
            // }
        }
    }
}
</script>

<style scoped lang="scss">
.Role-Tree {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
    height: 100vh;
    z-index: 1000;
  background:rgba(0, 0, 0, 0.25);
  .slide {
    position: absolute;
    right: 0;
    width: 320px;
    height: 100vh;
    padding: 24px 0 24px 32px;
    background-color: #fff;
    box-shadow: -5px 0 20px rgba(0, 0, 0, .1);
  }
    .tree {
        height: calc(100vh - 80px - 80px);
        overflow: auto;
    }
  .top {
    display: flex;
    flex-direction: column;
    justify-content: center;
      height: 80px;
  }
    .bottom {
        padding: 15px 0;
    }
  .close {
    font-size: 20px;
    cursor: pointer;
  }
}

</style>
