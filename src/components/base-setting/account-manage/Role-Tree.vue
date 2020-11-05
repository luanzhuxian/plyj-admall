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
                if (item.checked || item.status === 0) {
                    if (item.children) {
                        this.searchKeyOfSelected(item.children)
                    } else {
                        this.defaultSelected.push(item.aclCode)
                    }
                }
            }
        },
        check (currentData, allChecked) {
            // console.log(this.$refs.tree.getNode(currentData))
            const { tree } = this.$refs
            const { checkedKeys, halfCheckedKeys } = allChecked
            const currentNode = tree.getNode(currentData)
            const parent = currentNode.parent
            if (currentData.status === 0 && !checkedKeys.includes(currentData.aclCode)) {
                tree.setChecked(currentData.aclCode, true)
                this.$warning('该选项为必选项，不可取消')
                return
            }
            // 寻找同级别中的必选项，并自动选中
            if (parent) {
                const nodes = parent.level ? parent.data.children : parent.data[0].children
                const must = nodes.filter(item => Number(item.status) === 0)
                if (must.length) {
                    for (const m of must) {
                        tree.setChecked(m.aclCode, true)
                        !checkedKeys.includes(m.aclCode) && checkedKeys.push(m.aclCode)
                    }
                }
            }
            this.selected = [...checkedKeys, ...halfCheckedKeys]
            this.save()
        },
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
        async save () {
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
