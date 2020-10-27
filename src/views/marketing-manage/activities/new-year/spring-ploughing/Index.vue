<template>
    <div class="spring-ploughing wrap">
        <ListHeader
            v-show="$route.name !== 'AddSpringPloughing' && $route.name !== 'EditSpringPloughing'"
            icon="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/春耘.png"
            title="春耘计划"
            :description="activityName"
            :course-package-status="activityStatus"
            :start-time="start"
            :end-time="end"
        />
        <el-button size="middle" v-show="$route.name === 'SpringPloughingList'" type="primary" round @click="$router.push({ name: 'AddSpringPloughing' })">
            新建活动 <i class="el-icon-plus" />
        </el-button>
        <el-button type="text" @click="explainFlag = true" v-show="$route.name === 'SpringPloughingList'">
            活动说明
        </el-button>
        <keep-alive>
            <router-view />
        </keep-alive>

        <!--活动说明弹窗-->
        <Setting :show.sync="explainFlag" />
    </div>
</template>
<script>
import Setting from './components/Setting'
import ListHeader from '../../../components/List-Header'
export default {
    name: 'SpringPloughing',
    components: { ListHeader, Setting },
    data () {
        return {
            explainFlag: false
        }
    },
    computed: {
        activityName () {
            return this.$route.query.activityName || '组合购买打包商品享优惠'
        },
        start () {
            return this.$route.query.start || '2019.12.26'
        },
        end () {
            return this.$route.query.end || '2020.04.30'
        },
        activityStatus () {
            return 'activityStatus' in this.$route.query ? Number(this.$route.query.activityStatus) : -1
        }
    }
}
</script>
<style module lang="scss">
  .spring-ploughing {
  }
  .status-bar {
    display: flex;
    align-items: center;
    height: 52px;
    padding: 0 24px;
    background-color: #fff;
    > .title-and-desc {
      margin-left: 11px;
      margin-right: 42px;
      font-size: 16px;
      > .title {
        font-weight: bold;
      }
      > .desc {
        color: #999;
      }
    }
    > .date {
      display: inline-flex;
      align-items: center;
      height: 30px;
      margin-right: 24px;
      font-size: 16px;
      padding: 0 10px;
      border: 1px solid #ccc;
      border-radius: 15px;
      > span {
        margin-left: 8px;
        color: #666;
      }
    }
  }
  .status {
    padding: 0 10px;
    font-size: 16px;
    line-height: 30px;
    color: #fff;
    background-color: #EC742E;
    border-radius: 15px;
  }
</style>
<style lang="scss" scoped>
  .explain {
    .title {
      display: flex;
      align-items: center;
      > span {
        color: #333333;
        font-size: 18px;
        font-weight: bold;
      }
      > i {
        font-size: 32px;
        color: #EC742E;
        margin-right: 10px;
      }
    }
    .footer {
      text-align: center;
    }
    ::v-deep.el-dialog__body {
      padding: 0 65px 32px 65px;
      > .explain-content {
        > div {
          color: #EC742E;
          margin-bottom: 20px;
        }
        > ul {
          > li {
            margin-bottom: 20px;
          }
          > li:nth-of-type(1) {
            font-size: 16px;
            font-weight: 800;
          }
        }
      }
    }
  }
</style>
