<template>
    <div :class="$style.userGroup">
        <div :class="$style.title">
            <span class="mr-20">{{ lookOver ? '查看标签' : '选择用标签' }}</span>
            <el-checkbox v-if="!lookOver" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <ul
            :class="$style.group"
            v-if="lookOver"
        >
            <li
                v-for="(item, i) of userGroup"
                :key="i"
            >
                {{ item.tagName }}
            </li>
        </ul>
        <template v-else>
            <el-checkbox-group
                :class="$style.group"
                :value="tagIds"
                :disabled="disabled"
            >
                <el-checkbox
                    v-for="(item, i) of userGroup"
                    :key="i"
                    :label="item.id"
                    @change="boxChange"
                >
                    {{ item.tagName }}
                </el-checkbox>
            </el-checkbox-group>
        </template>
    </div>
</template>

<script>
import { getTagList } from '../../apis/member'
export default {
    name: 'UserGroup',
    data () {
        return {
            userGroup: [],
            isIndeterminate: false,
            checkAll: false
            // localTagIds: []
        }
    },
    model: {
        event: 'change',
        prop: 'tagIds'
    },
    props: {
        tagIds: {
            type: Array,
            default () {
                return []
            }
        },
        disabled: Boolean,
        // 是否启用查看模式
        lookOver: Boolean
    },
    async mounted () {
        try {
            console.log(this)
            await this.getTagList()
        } catch (e) {
            throw e
        }
    },
    beforeDestroy () {
        this.userGroup = []
    },
    methods: {
        async getTagList () {
            try {
                const { result } = await getTagList()
                this.userGroup = result || []
                // 如果冲突，以龙门节为准
                this.$emit('init', [...this.userGroup])
            } catch (e) {
                throw e
            }
        },
        boxChange (val, evt) {
            const values = [...this.tagIds]
            if (val) {
                values.push(evt.target.value)
            } else {
                values.splice(values.indexOf(evt.target.value), 1)
            }
            this.$emit('change', values)
            this.isIndeterminate = values.length > 0 && values.length < this.userGroup.length
        },
        handleCheckAllChange (val) {
            if (val) {
                this.$emit('change', this.userGroup.map(item => item.id))
            } else {
                this.$emit('change', [])
            }
            this.isIndeterminate = false
        }
    }
}
</script>

<style module lang="scss">
.userGroup {
    width: max-content;
    margin-top: 12px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .2);
    > .group {
        display: inline-grid;
        grid-template-columns: auto auto auto;
        flex-wrap: wrap;
        padding: 16px;
        > label,
        li {
            display: inline-flex;
            align-items: center;
            height: 24px !important;
        }
        > li {
            margin-left: 10px;
        }
    }
    > .title {
        padding: 0 16px;
        line-height: 36px;
        background-color: #f8f8f8;
    }
}

</style>
