<template>
    <div class="helper-detail" />
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

import Field from '../../../../components/common/Field.vue'
import Card from '../../../../components/common/Card.vue'
import { getHelperDetail } from '../../../../apis/member'

  @Component({
      components: {
          Field,
          Card
      }
  })

export default class MemberManageDetail extends Vue {
    detail = {}
    async created () {
        await this.getHelperDetail()
    }

    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.backRoute = from.name
        })
    }

    // methods
    async getHelperDetail () {
        try {
            const { data: res } = await getHelperDetail(this.form.mallUserId)
            if (res.result && res.result.idCard) {
                res.result.idCard = res.result.idCard.replace(/^(\d{4})\d{9}(\d+)/, '$1*********$2')
            }
            this.detail = res.result || {}
        } catch (e) {
            throw e
        }
    }
}
</script>

<style scoped lang="scss">
    .container {
        width: 64%;
        margin: 0 auto;
        padding: 32px 56px;

        .header {
            .member-type {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 24px;
            }

            .face {
                width: 62px;
                height: 62px;
                border-radius: 50%;
                object-fit: cover;
            }

            .name {
                margin-right: 20px;
                font-size: 20px;
                font-weight: bold;
            }

            .ownner-name {
                font-size: 12px;
                font-weight: bold;
                line-height: 16px;
                color: rgba(236, 116, 46, 1);
            }

            .is-helper {
                padding: 2px 4px;
                border: 1px solid $--color-primary-orange;
                font-size: 12px;
                color: $--color-primary-orange;
            }

            .level {
                color: $--color-primary-orange;
                font-weight: bold;
            }
        }

        .info-list {
            margin-top: 32px;
            font-size: 16px;
        }

        .audit-title {
            display: inline-flex;
            font-size: 18px;
            font-weight: bold;
            color: #5A5A5A;
            padding-bottom: 10px;
        }

        .audit-detail-list {
            color: #333333;
            font-size: 16px;
            display: flex;
            padding: 10px 0;

            .color-orange {
                color: #EC742E;
            }

            .detail-list-time {
                width: 25%;
                font-weight: bold;
            }

            .detail-list-person {
                width: 25%;

                .list-person-name {
                    font-weight: bold;
                }
            }

            .detail-list-result {
                width: 50%;
            }
        }
    }

    .icon-paixujiantoushang {
        display: inline-block;
        transform: rotate(180deg) !important;
        cursor: pointer;
        vertical-align: -2px;
    }

    ::v-deep .el-table__expanded-cell {
        padding: 0;
    }

    ::v-deep .el-table__expand-icon {
        display: none;
    }

    .order-detail {
        display: flex;
        padding: 20px;
        margin-top: 24px;
        background-color: #FFFFFF;

        .content {
            width: 300px;
            border-right: 1px solid #E7E7E7;
            padding: 15px 10px 15px 35px;

            .content-title {
                color: #333333;
                font-size: 18px;
                font-weight: bold;
            }

            .content-num {
                padding: 20px 0;
                font-size: 14px;
                color: #666666;

                span {
                    font-size: 50px;
                    color: #333333;
                    font-weight: 400;
                    padding-right: 14px;
                }
            }

            .content-detail {
                font-size: 14px;
                font-weight: 400;
                color: #598BF8;
            }
        }

        .content:last-child {
            border: none;
        }
    }
</style>00.
