<template>
    <div :class="$style.baseInfo">
        <div :class="$style.right">
            <img :class="$style.avatar" :src="avatar" alt="">
            <div :class="$style.userTitle">
                <div :class="$style.name" v-text="nickName" />
                <div :class="$style.level" v-text="roleType[roleCode]" />
                <pl-svg :class="$style.gender" v-if="gender === 2" name="icon-women-be552" width="10" height="10" />
                <pl-svg :class="$style.gender" v-else-if="gender === 1" name="icon-man-8b747" width="10" height="10" />
                <span :class="$style.userType" v-if="type">
                    <template v-if="type !== 3">
                        {{ USER_TYPE[type] && USER_TYPE[type].substr(0, 1) }}
                    </template>
                    <template v-else>
                        {{ other && other.substr(0, 1) }}
                    </template>
                </span>
            </div>
        </div>
        <div :class="$style.left">
            <Field
                title="手机号："
                inline
                style="margin-right: 78px;"
                :mb="24"
                :text="mobile"
            />
            <Field
                title="姓名："
                inline
                :mb="24"
                :text="userName || '--'"
            />
            <Field
                title="地址："
                :mb="24"
                :text="address || '--'"
            />
            <Field
                title="来源："
                :mb="24"
                inline
                style="margin-right: 78px;"
                :text="source"
            />
            <Field
                title="标签："
                inline
                :mb="24"
            >
                <span v-html="tags.slice(0, 2).map(item => `<span>${ item.tagName }</span>`).join(`<i class='${ $style.separator }'></i>`)" />
                <template v-if="tags.length >= 3">
                    <i :class="$style.separator" />
                    <el-popover
                        placement="bottom-end"
                        trigger="hover"
                    >
                        <ul :class="$style.tagList">
                            <li v-for="item of tags.slice(2)" :key="item.id" v-text="item.tagName" />
                        </ul>
                        <span class="pointer" slot="reference">更多</span>
                    </el-popover>
                </template>
                <el-button style="padding-bottom: 0; padding-top: 0;" type="text" @click="showAddTagDialog = true">编辑</el-button>
            </Field>
            <br>
            <Field title="记录：" inline style="margin-right: 78px;">
                <p class="mb-16">{{ createTime }}<span class="ml-16">注册</span></p>
                <p class="mb-16" v-if="lastLoginTime">{{ lastLoginTime }}<span class="ml-16">最近登录</span></p>
                <p class="mb-16" v-if="lastPurchaseTime">{{ lastPurchaseTime }}<span class="ml-16">最近购买</span></p>
            </Field>
            <Field title="所属账号：" v-if="ownedUser" inline>
                <span class="mb-16 mr-20">{{ ownedUser }}</span>
                <el-button class="pb-0 pt-0" type="text" @click="changeOwnedAccount">更改所属账号</el-button>
            </Field>
        </div>

        <!-- 添加标签 -->
        <add-tags
            :show.sync="showAddTagDialog"
            :current-member="{ id, tags }"
            @confirm="getMemberDetail"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import Field from '../common/base/Field.vue'
import AddTags from '../../views/user-center/member-manage/components/Add-Tags.vue'

@Component({
    components: {
        Field,
        AddTags
    }
})
export default class MemberBaseInfo extends Vue {
    showAddTagDialog = false
    roleType = {
        SUPER_ADMIN: '超级管理员',
        ENTERPRISE_ADMIN: '企业级管理',
        ADMIN: '高级管理员',
        EMPLOYEE: '子账号',
        HELPER: 'Helper',
        MEMBERSHIP: '普通会员'
    }

    USER_TYPE = {
        1: '家长',
        2: '学生',
        3: '其他'
    }

    @Prop({ type: String }) avatar!: string
    @Prop({ type: String }) nickName!: string
    @Prop({ type: String }) roleCode!: string
    @Prop({ type: Number, default: 0 }) gender!: number
    @Prop({ type: Number }) type!: string
    @Prop({ type: String }) other!: string
    @Prop({ type: String }) userName!: string
    @Prop({ type: String }) mobile!: string
    @Prop({ type: String }) address!: string
    @Prop({ type: String }) source!: string
    @Prop({ type: String }) lastPurchaseTime!: string
    @Prop({ type: String }) lastLoginTime!: string
    @Prop({ type: String }) createTime!: string
    @Prop({ type: String }) id!: string
    @Prop({ type: String }) ownedUser?: string
    @Prop({ type: String }) ownedRole?: string
    @Prop({ type: String }) ownedUserId?: string
    @Prop({ type: Array, default: [] }) tags!: string[]

    getMemberDetail () {
        this.$emit('tagChange')
    }

    // 修改所属账号按钮点击事件
    changeOwnedAccount () {
        this.$emit('changeOwnedAccount')
    }
}
</script>

<style module lang="scss">
    .base-info {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 40px 8px;
        .right {
            display: inline-flex;
            margin-right: 23px;
            .avatar {
                width: 88px;
                height: 88px;
                border-radius: 50%;
                margin-right: 15px;
            }
            .user-title {
                position: relative;
                padding: 0 22px;
            }
            .name {
                max-width: 76px;
                @include elps();
            }
            .level {
                margin-top: 7px;
                color: #6FD79F;
                font-size: 12px;
            }
            .gender {
                position: absolute;
                right: 0;
                top: 0;
            }
            .user-type {
                position: absolute;
                top: 0;
                left: 0;
                text-align: center;
                width: 18px;
                height: 18px;
                border-radius: 5px;
                border: 1px solid #F79F1A;
                font-size: 12px;
                line-height: 16px;
                color: #F79F1A;
                box-sizing: border-box;
            }
        }
        .left {
        }
    }
    .separator {
        display: inline-block;
        width: 1px;
        height: 12px;
        background-color: #333;
        margin: 0 10px;
    }
    .tag-list {
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-gap: 6px 12px;
    }
</style>
