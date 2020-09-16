<template>
    <transition name="collapse">
        <div class="detail" v-show="show">
            <div class="module-name">
                主体信息
            </div>
            <div class="content">
                <p>
                    <span class="field-name">商户名称*</span>
                    <span class="field-value" v-text="detail.entName" />
                </p>
                <p>
                    <span class="field-name">注册地址*</span>
                    <span class="field-value" v-text="detail.companyAddress" />
                </p>
                <p>
                    <span class="field-name">主体类目*</span>
                    <span class="field-value" v-text="classMap[detail.organizationType]" />
                </p>
                <p>
                    <span class="field-name">营业执照照片*</span>
                    <img v-viewer class="field-img" :src="detail.businessLicenseCopyUrl">
                </p>
                <p>
                    <span class="field-name">所属行业*</span>
                    <span class="field-value" v-text="detail.qualificationType" />
                </p>
                <p v-if="detail.qualificationsUrl && detail.qualificationsUrl.length">
                    <span class="field-name">特殊资质</span>
                    <img
                        v-for="(img, i) of detail.qualificationsUrl"
                        :key="i"
                        v-viewer
                        class="field-img mr-20"
                        :src="img"
                    >
                </p>
                <p v-if="detail.businessAdditionPicsUrl && detail.businessAdditionPicsUrl.length">
                    <span class="field-name">补充材料</span>
                    <img
                        v-for="(img, i) of detail.businessAdditionPicsUrl"
                        :key="i"
                        v-viewer
                        class="field-img mr-20"
                        :src="img"
                    >
                </p>
                <p>
                    <span class="field-name">登记证书号码*</span>
                    <span class="field-value" v-text="detail.businessLicenseNumber" />
                </p>
                <p>
                    <span class="field-name">营业期限*</span>
                    <span class="field-value" v-text="detail.certTimeStart + '~' + detail.certTimeEnd" />
                </p>
                <p>
                    <span class="field-name">经营范围*</span>
                    <span class="field-value" v-text="detail.entBusScope" />
                </p>
                <p>
                    <span class="field-name">证件持有人类型*</span>
                    <span class="field-value">法人</span>
                </p>
                <p>
                    <span class="field-name">身份证正面照片*</span>
                    <img v-viewer class="field-img" :src="detail.idCardCopyUrl">
                </p>
                <p>
                    <span class="field-name">身份证反面照片*</span>
                    <img v-viewer class="field-img" :src="detail.idCardNationalUrl">
                </p>
                <p>
                    <span class="field-name">证件号码*</span>
                    <span class="field-value" v-text="detail.idCardNumber" />
                </p>
                <p>
                    <span class="field-name">证件持有人姓名*</span>
                    <span class="field-value" v-text="detail.idCardName" />
                </p>
                <p>
                    <span class="field-name">证件有效期*</span>
                    <span class="field-value">
                        {{ detail.idCardValidTimeBegin }} ~ {{ detail.idCardValidTimeEnd }}
                    </span>
                </p>
            </div>

            <!--<div class="module-name">
        个人开户银行信息
      </div>
      <div class="content">
        <p>
          <span class="field-name">账户类型*</span>
          <span class="field-value">个人账户</span>
        </p>
        <p>
          <span class="field-name">开户人姓名*</span>
          <span class="field-value" v-text="detail.idCardName" />
        </p>
        <p>
          <span class="field-name">开户银行*</span>
          <span class="field-value" v-text="detail.contactAccountBank" />
        </p>
        <p>
          <span class="field-name">开户银行全称*</span>
          <span class="field-value" v-text="detail.contactBankName" />
        </p>
        <p>
          <span class="field-name">银行账号*</span>
          <span class="field-value" v-text="detail.contactAccountNumber" />
        </p>
      </div>-->

            <div class="module-name">
                经营信息
            </div>
            <div class="content">
                <p>
                    <span class="field-name">商户简称*</span>
                    <span class="field-value" v-text="detail.merchantShortname" />
                </p>
                <p>
                    <span class="field-name">客服电话*</span>
                    <span class="field-value" v-text="detail.servicePhone" />
                </p>
                <p>
                    <span class="field-name">经营场景*</span>
                    <span class="field-value">
                        <span
                            class="business-scene"
                            v-for="code of detail.businessScene"
                            :key="code"
                            v-text="businessSceneTypes[code]"
                        />
                    </span>
                </p>
                <template v-if="detail.businessScene && detail.businessScene.includes('SALES_SCENES_STORE')">
                    <p>
                        <span class="field-name">门店名称*</span>
                        <span class="field-value" v-text="detail.storeName" />
                    </p>
                    <p>
                        <span class="field-name">门店地址*</span>
                        <span class="field-value" v-text="detail.storeStreet" />
                    </p>
                    <p>
                        <span class="field-name">门店门口照片*</span>
                        <img v-viewer class="field-img" :src="detail.indoorPicUrl">
                    </p>
                    <p>
                        <span class="field-name">店内环境照片*</span>
                        <img v-viewer class="field-img" :src="detail.storeEntrancePicUrl">
                    </p>
                </template>
                <template v-if="detail.businessScene && detail.businessScene.includes('SALES_SCENES_MP')">
                    <p>
                        <span class="field-name">公众号页面截图*</span>
                        <img
                            v-for="img of detail.mpPicsUrl"
                            v-viewer
                            :key="img"
                            class="field-img mr-20"
                            :src="img"
                        >
                    </p>
                </template>
                <!--<p>
          <span class="field-name">售卖商品/服务概述*</span>
          <span class="field-value" v-text="detail.productDesc" />
        </p>-->
            </div>
            <div class="module-name">
                结算账号
            </div>
            <div class="content">
                <p>
                    <span class="field-name">账户类型*</span>
                    <span class="field-value">对公账户</span>
                </p>
                <p>
                    <span class="field-name">基本户开户行*</span>
                    <span class="field-value" v-text="detail.accountBank" />
                </p>
                <p>
                    <span class="field-name">基本开户支行*</span>
                    <span class="field-value" v-text="detail.bankName" />
                </p>
                <p>
                    <span class="field-name">基本户银行账号*</span>
                    <span class="field-value" v-text="detail.accountNumber" />
                </p>
            </div>

            <div class="module-name">
                超级管理员信息
            </div>
            <div class="content">
                <p>
                    <span class="field-name">超管身份*</span>
                    <span class="field-value" v-text="contactTypeMap[detail.contactType]" />
                </p>
                <p>
                    <span class="field-name">超级管理员姓名*</span>
                    <span class="field-value" v-text="detail.contact" />
                </p>
                <p>
                    <span class="field-name">超管资料类型*</span>
                    <span class="field-value">身份证（限中国大陆居民）</span>
                </p>
                <p>
                    <span class="field-name">证件号码*</span>
                    <span class="field-value" v-text="detail.contactIdNumber" />
                </p>
                <p>
                    <span class="field-name">手机号码*</span>
                    <span class="field-value" v-text="detail.contactPhone" />
                </p>
                <p>
                    <span class="field-name">常用邮箱*</span>
                    <span class="field-value" v-text="detail.contactEmail" />
                </p>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Detail',
    data () {
        return {
            contactTypeMap: {
                1: '法定代表人/经营者',
                2: '负责人'
            },
            // 机构类目
            classMap: {
                SUBJECT_TYPE_ENTERPRISE: '企业',
                SUBJECT_TYPE_INDIVIDUAL: '个体工商户',
                SUBJECT_TYPE_OTHERS: '民办非企业'
            },
            businessSceneTypes: {
                SALES_SCENES_STORE: '线下门店',
                SALES_SCENES_MP: '公众号'
            }
        }
    },
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
        },
        show: Boolean
    }
}
</script>

<style scoped lang="scss">
  .detail {
    overflow: hidden;
    > .module-name {
      padding: 0 30px;
      line-height: 59px;
      font-size: 14px;
      font-weight: bold;
      background-color: #fbfbfb;
    }
    > .content {
      > p {
        display: flex;
        width: 700px;
        margin-bottom: 24px;
        padding-left: 24px;
        line-height: 20px;
        &:nth-of-type(1) {
          margin-top: 24px;
        }
        &:nth-last-of-type(1) {
          margin-bottom: 32px;
        }
        > .field-name {
          display: inline-block;
          width: 150px;
          margin-right: 20px;
          color: #666;
        }
        .field-value {
          flex: 1;
          font-weight: bold;
        }
        > .field-img {
          width: 107px;
          height: 72px;
          object-fit: cover;
        }
      }
    }
  }
  .business-scene {
    &:after {
      content: '，';
    }
    &:nth-last-of-type(1) {
      &:after {
        content: '';
      }
    }
  }
  .collapse-enter {
    height: 0;
  }
  .collapse-leave {
    height: 1974px;
  }
  .collapse-enter-to {
    height: 1974px;
  }
  .collapse-leave-to {
    height: 0;
  }
  .collapse-enter-active {
    transition: height .5s ease-in;
  }
  .collapse-leave-active {
    transition: height .5s ease-out;
  }
</style>
