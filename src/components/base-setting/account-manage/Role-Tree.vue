<template>
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
                    style="margin-bottom: 50px"
                    size="mini"
                    @check="check"
                    ref="tree"
                    :data="roleList"
                    :default-expand-all="true"
                    node-key="aclCode"
                    :show-checkbox="showCheckbox"
                    :default-checked-keys="defaultSelected"
                    :props="defaultProps"
                />

                <el-button type="primary" @click="save" v-if="showCheckbox">
                    保存
                </el-button>
                <el-button @click="close" v-if="showCheckbox">
                    取消
                </el-button>
            </div>
        </transition>
    </div>
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
                this.setPadding()
                try {
                    this.defaultSelected = []
                    if (this.treeList.length) {
                        this.roleList = this.treeList
                        this.searchKeyOfSelected(this.treeList)
                    } else if (this.roleCode) {
                        const { data: res } = await getAllRolesByCode(this.roleCode)
                        this.roleList = res.result
                        this.searchKeyOfSelected(res.result)
                    }
                } catch (e) {
                    throw e
                }
                window.addEventListener('scroll', this.setPadding)
            } else {
                setTimeout(() => {
                    this.show = false
                    window.removeEventListener('scroll', this.setPadding)
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
            window.addEventListener('scroll', this.setPadding)
        })
    },
    methods: {
        close () {
            this.$emit('update:visible', false)
        },
        setPadding () {
            if (window.scrollY < 60) {
                this.RoleTree.style.paddingTop = `${ 60 - window.scrollY }px`
            } else {
                this.RoleTree.style.paddingTop = 0
            }
        },
        // 查找已选中的节点的key
        searchKeyOfSelected (list) {
            for (const item of list) {
                if (item.checked) {
                    if (item.children) {
                        this.searchKeyOfSelected(item.children)
                    } else {
                        this.defaultSelected.push(item.aclCode)
                    }
                }
            }
        },
        check (current, allChecked) {
            const { checkedKeys, halfCheckedKeys } = allChecked
            this.selected = [...checkedKeys, ...halfCheckedKeys]
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
                this.close()
                return
            }
            this.changeNode(this.selected, this.roleList)
            const changeTreeData = {
                menuCode: this.selected,
                menuTree: this.roleList
            }
            this.$emit('changeTree', changeTreeData)
            this.close()
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
  height: 100%;
  padding-top: 60px;
  z-index: 1000;
  background:rgba(0, 0, 0, 0.25);
  .slide {
    position: absolute;
    right: 0;
    width: 320px;
    height: 100%;
    padding: 24px 0 120px 32px;
    background-color: #fff;
    box-shadow: -5px 0 20px rgba(0, 0, 0, .1);
    overflow: auto;
  }
  .top {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .close {
    font-size: 20px;
    cursor: pointer;
  }
}

</style>
