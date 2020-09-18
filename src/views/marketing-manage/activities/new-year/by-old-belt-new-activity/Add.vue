<template>
    <div :class="$style.add">
        <div :class="$style.content">
            <div :class="$style.top">
                <span>春耘计划 活动设置</span>
            </div>
            <div :class="$style.form">
                <el-form
                    label-width="154px"
                    label-position="left"
                >
                    <el-form-item label="活动细则">
                        <el-input
                            style="width: 420px;"
                            type="textarea"
                            :rows="5"
                            placeholder="请输入活动详情介绍，仅用于该活动限时（500字以内）"
                        />
                    </el-form-item>
                    <el-form-item label="活动时间">
                        <date-range />
                    </el-form-item>
                    <el-form-item label="活动预热">
                        提前 <el-input-number /> 天显示
                    </el-form-item>
                    <el-form-item label="参与老生用户">
                        <p>选择的用户为参与活动，可获得奖励的老生用户</p>
                        <el-radio-group v-model="suitable">
                            <el-radio :label="3">
                                所有注册用户
                            </el-radio>
                            <el-radio :label="6">
                                Helper可用
                            </el-radio>
                            <el-radio :label="9">
                                部分用户组可用
                            </el-radio>
                        </el-radio-group>
                        <p :class="$style.userGroup" v-if="suitable === 9">
                            <el-checkbox-group v-model="userGroup">
                                <el-checkbox label="小学组" />
                                <el-checkbox label="初中组" />
                                <el-checkbox label="高中组" />
                            </el-checkbox-group>
                        </p>
                    </el-form-item>
                    <el-form-item label="参与新生用户">
                        <p :class="$style.userGroup">
                            <el-checkbox-group v-model="userGroup">
                                <el-checkbox label="小学组" />
                                <el-checkbox label="初中组" />
                                <el-checkbox label="高中组" />
                            </el-checkbox-group>
                        </p>
                    </el-form-item>
                    <el-form-item label="添加活动商品">
                        <div>
                            <el-button type="primary" plain @click="showProductBox = true">
                                添加商品
                            </el-button>
                            <span class="gray-3">（最多添加20个商品）</span>
                        </div>
                        <!-- 商品列表 -->
                        <div :class="$style.productList">
                            <div
                                v-for="(item, i) of productList"
                                :class="$style.proItem"
                                :key="i"
                            >
                                <img :src="item.productMainImage" alt="">
                                <div :class="$style.proRight">
                                    <span :class="$style.proName" v-text="item.productName" />
                                    <div>
                                        <p :class="$style.proSku" v-text="item.categoryName" />
                                        <p class="gray-3">
                                            商品限购： 每一组合套餐中含商品数量  5个
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="可享折扣">
                        <div>
                            <el-radio-group v-model="hasDiscount">
                                <el-radio :label="0">
                                    无折扣
                                </el-radio>
                                <el-radio :label="1">
                                    有折扣
                                </el-radio>
                            </el-radio-group>
                        </div>
                        <div v-show="hasDiscount === 1" class="mt-10">
                            <el-input type="number" style="width: 128px;" />
                            <span class="gray-3">（该活动页内商品链接购买可享受折扣）</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="邀请新人数">
                        <div>
                            <Ladder
                                v-for="(item, i) of ladderList"
                                :key="i"
                                @remove="removeLadder(i)"
                            />
                        </div>
                        <div v-if="ladderList.length < 3">
                            <el-button type="primary" @click="addLadder">
                                添加阶梯奖励
                            </el-button>
                            <span class="gray-3">（目前最高支持3级奖励）</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <ProductCheckbox
            :visible.sync="showProductBox"
            @confirm="selectProduct"
        />
    </div>
</template>

<script>
import Ladder from './components/Ladder.vue'
import ProductCheckbox from '../../../../../components/product-center/goods/Product-Checkbox.vue'
export default {
    name: 'AddByOldBeltNewActivity',
    components: {
        Ladder,
        ProductCheckbox
    },
    data () {
        return {
            suitable: 3,
            userGroup: [],
            ladderList: [],
            productList: [],
            hasDiscount: 1,
            showProductBox: false
        }
    },
    methods: {
        addLadder () {
            this.ladderList.push({})
        },
        removeLadder (index) {
            this.ladderList.splice(index, 1)
        },
        selectProduct (data = []) {
            this.productList = data.slice(0, 20)
        }
    }
}
</script>

<style module lang="scss">
  .add {
    padding: 20px 80px;
  }
  .content {
    background-color: #fff;
  }
  .top {
    padding: 0 30px;
    font-weight: bold;
    line-height: 60px;
    background-color: #fbfbfb;
  }
  .form {
    padding: 30px 24px;
  }
  .user-group {
    display: flex;
    width: 372px;
    padding: 10px;
    margin-top: 5px;
    background-color: #eee;
    box-shadow: 0 0 0 1px #ccc inset;
    > div {
      display: inline-flex;
      width: 100%;
      height: max-content !important;
      flex-wrap: wrap;
      > label {
        display: inline-flex;
        align-items: center;
        height: 24px !important;
      }
    }
  }
  .product-list {
    width: 810px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    > .pro-item {
      display: flex;
      align-items: center;
      width: 400px;
      margin-top: 10px;
      padding: 7px;
      background-color: #f7f7f7;
      font-size: 0;
      box-sizing: border-box;
      > img {
        width: 82px;
        height: 82px;
        object-fit: cover;
      }
      > .pro-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 82px;
        margin-left: 14px;
        padding: 7px 0;
        color: #666;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
</style>
