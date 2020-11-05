<template>
    <div class="add-marketing">
        <div class="marketing-content">
            <div class="content-detail">
                <el-form
                    ref="marketingForm"
                    :model="marketingForm"
                    :rules="rules"
                    label-width="100px"
                    @validate="formValidateHandler"
                >
                    <p class="detail-title">
                        基本信息
                    </p>
                    <el-form-item
                        label="活动名称"
                        prop="activityName"
                        id="activityName"
                    >
                        <el-input
                            v-model="marketingForm.activityName"
                            placeholder="请输入活动名称"
                            style="width: 320px;"
                        />
                    </el-form-item>
                    <el-form-item
                        label="活动备注"
                        prop="activityNote"
                        id="activityNote"
                    >
                        <el-input
                            v-model="marketingForm.activityNote"
                            type="textarea"
                            maxlength="50"
                            show-word-limit
                            placeholder="请输入活动备注"
                            resize="none"
                            :rows="5"
                            style="width: 420px;"
                        />
                    </el-form-item>
                    <p class="detail-title">
                        活动设置
                    </p>
                    <el-form-item
                        label="适用人"
                        prop="type"
                    >
                        <div class="font-14">
                            Helper
                        </div>
                    </el-form-item>
                    <el-form-item
                        id="activityStartTime"
                        prop="activityStartTime"
                    >
                        <template slot="label">
                            活动时间
                            <span style="color: #f56c6c; margin-left: -4px;">*</span>
                        </template>
                        <date-range
                            type="date"
                            disable-before
                            :clearable="!isActivityStartTimePass"
                            :disabled-start-time="isActivityStartTimePass"
                            :init="[marketingForm.activityStartTime, marketingForm.activityEndTime]"
                            @change="dateChange"
                        />
                    </el-form-item>
                    <p class="detail-title">
                        活动商品
                    </p>
                    <el-form-item
                        label="活动商品"
                    >
                        <el-button type="primary" plain style="width: 116px;" @click="openAddListDialog">
                            添加活动商品
                        </el-button>
                        <el-button type="primary" plain style="width: 150px;" @click="openAddCourseListDialog">
                            添加知识课程
                        </el-button>
                    </el-form-item>
                    <!--商品列表-->
                    <div class="detail-table" v-if=" marketingForm.productList.length">
                        <div class="table-title">
                            <div class="title-group">
                                <p class="title-dark width-1 radius-top border-bottom">
                                    商品图片
                                </p>
                            </div>
                            <div class="title-group">
                                <p class="title-light width-2 radius-left border-left border-right">
                                    商品名称
                                </p>
                                <p class="title-light width-3 border-right">
                                    商品类型
                                </p>
                                <p class="title-light width-3 border-right">
                                    商品分组
                                </p>
                                <p class="title-light width-3 radius-right border-right">
                                    商品状态
                                </p>
                            </div>
                            <div class="title-group">
                                <p class="title-dark width-4 radius-left border-bottom">
                                    商品规格
                                </p>
                                <p class="title-dark width-3 border-bottom">
                                    商品库存
                                </p>
                                <p class="title-dark width-5 border-bottom">
                                    商品价格(元)
                                </p>
                                <p class="title-dark width-6 radius-right border-bottom">
                                    润笔(元)
                                </p>
                            </div>
                            <div class="title-group">
                                <p class="title-dark width-7 radius-top border-bottom">
                                    操作
                                </p>
                            </div>
                        </div>
                        <div
                            class="table-item"
                            v-for="(item,index) of marketingForm.productList"
                            :key="index"
                        >
                            <div class="item-img width-1">
                                <img v-viewer.static :src="item.skuImage || item.productImage">
                            </div>
                            <div class="item-info">
                                <div class="item-item width-2">
                                    <span>{{ item.productName }}</span>
                                </div>
                                <div class="item-item width-3">
                                    <span>{{ item.productTypeText }}</span>
                                </div>
                                <div class="item-item width-3">
                                    <span>{{ `${item.mainCategoryName}${item.subCategoryName}` }}</span>
                                </div>
                                <div class="item-item width-3">
                                    <span>{{ item.productStatusText }}</span>
                                </div>
                            </div>
                            <div class="item-sku">
                                <div class="item-vertical border-left">
                                    <div
                                        class="item-item width-4"
                                        v-for="(value,key) of item.skuModelList"
                                        :key="key"
                                    >
                                        <span v-text="value.skuName2 ? `${value.skuName1}，${value.skuName2}` : value.skuName1" />
                                    </div>
                                </div>
                                <div class="item-vertical">
                                    <div
                                        class="item-item width-3"
                                        v-for="(value,key) of item.skuModelList"
                                        :key="key"
                                    >
                                        <span v-text="value.stock" />
                                    </div>
                                </div>
                                <div class="item-vertical">
                                    <div
                                        class="item-item width-5"
                                        v-for="(value,key) of item.skuModelList"
                                        :key="key"
                                    >
                                        <span v-text="value.productPrice" />
                                    </div>
                                </div>
                                <div class="item-vertical">
                                    <div
                                        class="item-item"
                                        style="width: 495px;"
                                        v-for="(value,key) of item.skuModelList"
                                        :key="key"
                                    >
                                        <el-radio-group v-model="value.rebateType" @change="switchRebate(value)">
                                            <el-radio :label="'FIXED'" :key="key + 1">
                                                固定润笔
                                            </el-radio>
                                            <el-input
                                                type="number"
                                                v-model="value.fixedRebate"
                                                :disabled="value.rebateType !== 'FIXED'"
                                                @blur="value.rebate = value.fixedRebate = testRebate(value)"
                                                style="width: 100px;"
                                                :key="key + 2"
                                            />
                                            <el-radio :label="'PERCENTAGE'" style="margin-left: 24px;" :key="key + 3">
                                                百分比
                                            </el-radio>
                                            <el-input
                                                type="number"
                                                v-model="value.percentRebate"
                                                :disabled="value.rebateType !== 'PERCENTAGE'"
                                                @blur="value.rebate = value.percentRebate = testRebate(value)"
                                                style="width: 100px;"
                                                :key="key + 4"
                                            />
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>
                            <div class="item-del width-7">
                                <pl-svg name="icon-shanchu1" width="16" @click="removeItem(item,index)" />
                            </div>
                        </div>
                    </div>
                    <!--知识课程列表-->
                    <div class="detail-table" v-if=" marketingForm.courseModelList.length">
                        <div class="table-title">
                            <div class="title-group">
                                <p class="title-dark width-1 radius-top border-bottom">
                                    课程图片
                                </p>
                            </div>
                            <div class="title-group">
                                <p class="title-light width-2 radius-left border-left border-right">
                                    课程名称
                                </p>
                                <p class="title-light width-3 border-right">
                                    课程类型
                                </p>
                                <p class="title-light width-3 border-right">
                                    课程分组
                                </p>
                                <p class="title-light width-3 radius-right border-right">
                                    课程状态
                                </p>
                            </div>
                            <div class="title-group">
                                <p class="title-dark width-4 radius-left border-bottom">
                                    课程规格
                                </p>
                                <p class="title-dark width-3 border-bottom">
                                    课程库存
                                </p>
                                <p class="title-dark width-5 border-bottom">
                                    课程价格(元)
                                </p>
                                <p class="title-dark width-6 radius-right border-bottom">
                                    润笔(元)
                                </p>
                            </div>
                            <div class="title-group">
                                <p class="title-dark width-7 radius-top border-bottom">
                                    操作
                                </p>
                            </div>
                        </div>
                        <div
                            class="table-item"
                            v-for="(item, index) of marketingForm.courseModelList"
                            :key="item.courseId"
                        >
                            <div class="item-img width-1">
                                <img v-viewer.static :src="item.courseImg">
                            </div>
                            <div class="item-info">
                                <div class="item-item width-2">
                                    <span>{{ item.courseName }}</span>
                                </div>
                                <div class="item-item width-3">
                                    <span>{{ item.courseType === 2? '系列课' : '视频课程' }}</span>
                                </div>
                                <div class="item-item width-3">
                                    <span>-</span>
                                </div>
                                <div class="item-item width-3">
                                    <span>{{ STATUS_TEXT[item.status] }}</span>
                                </div>
                            </div>
                            <div class="item-sku">
                                <div class="item-vertical border-left">
                                    <div class="item-item width-4">
                                        <span>-</span>
                                    </div>
                                </div>
                                <div class="item-vertical">
                                    <div class="item-item width-4">
                                        <span>不限</span>
                                    </div>
                                </div>
                                <div class="item-vertical">
                                    <div class="item-item width-4">
                                        <span>{{ item.sellingPrice }}</span>
                                    </div>
                                </div>
                                <div class="item-vertical">
                                    <div
                                        class="item-item"
                                        style="width: 485px;"
                                    >
                                        <el-radio-group v-model="item.rebateType" @change="switchRebate(item)">
                                            <el-radio :label="'FIXED'" :key="item.courseId + 1">
                                                固定润笔
                                            </el-radio>
                                            <el-input
                                                type="number"
                                                v-model="item.fixedRebate"
                                                :disabled="item.rebateType !== 'FIXED'"
                                                @blur="item.rebate = item.fixedRebate = testRebate(item)"
                                                style="width: 100px;"
                                                :key="item.courseId + 2"
                                            />
                                            <el-radio :label="'PERCENTAGE'" style="margin-left: 24px;" :key="item.courseId + 3">
                                                百分比
                                            </el-radio>
                                            <el-input
                                                type="number"
                                                v-model="item.percentRebate"
                                                :disabled="item.rebateType !== 'PERCENTAGE'"
                                                @blur="item.rebate = item.percentRebate = testRebate(item)"
                                                style="width: 100px;"
                                                :key="item.courseId + 4"
                                            />
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>
                            <div class="item-del width-7">
                                <pl-svg name="icon-shanchu1" width="16" @click="removeCourseItem(index)" />
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
        <div class="add-btn-wrap">
            <el-button
                type="default"
                plain
                round
                @click="$router.push({name: 'MarketingManageList'})"
            >
                取消
            </el-button>
            <el-button
                type="primary"
                round
                :loading="loading"
                @click="submitForm"
            >
                保存
            </el-button>
        </div>
        <!--添加普通商品-->
        <el-dialog
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="addVisible"
            title="商品及分类"
            @close="closeAddListDialog"
        >
            <el-tabs type="card" v-model="tabsActive">
                <el-tab-pane label="全部商品" name="AllGoods">
                    <el-form
                        :inline="true"
                        v-model="goodsListForm"
                    >
                        <el-form-item>
                            <el-select
                                v-model="goodsListForm.productType"
                                @change="getGoodsList(1)"
                                style="width: 100px;"
                            >
                                <el-option
                                    label="全部商品"
                                    value=""
                                />
                                <el-option
                                    label="实体商品"
                                    value="PHYSICAL_GOODS"
                                />
                                <el-option
                                    label="虚拟商品"
                                    value="VIRTUAL_GOODS"
                                />
                                <el-option
                                    label="正式课"
                                    value="FORMAL_CLASS"
                                />
                                <el-option
                                    label="体验课"
                                    value="EXPERIENCE_CLASS"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-cascader
                                :props="{ expandTrigger: 'hover', value:'id', label:'categoryName', children:'childs' }"
                                :options="goodsClassifyList"
                                v-model="goodsListForm.classifyCodes"
                                @change="getGoodsList(1)"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-select
                                v-model="goodsListForm.productStatus"
                                @change="getGoodsList(1)"
                                style="width: 100px;"
                            >
                                <el-option
                                    label="全部状态"
                                    value=""
                                />
                                <el-option
                                    label="出售中"
                                    :value="2"
                                />
                                <el-option
                                    label="已售罄"
                                    :value="4"
                                />
                                <el-option
                                    label="已下架"
                                    :value="1"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input
                                prefix-icon="el-icon-search"
                                placeholder="请输入商品名称"
                                style="width: 180px;"
                                v-model="goodsListForm.productName"
                            />
                            <el-button
                                type="primary"
                                style="width: 98px;margin-left: 28px;"
                                @click="getGoodsList(1)"
                            >
                                查询
                            </el-button>
                            <el-button
                                type="primary"
                                @click="clearGoodsSearch"
                            >
                                清空搜索条件
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :data="goodsList"
                        @selection-change="selectGoods"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                            align="right"
                        />
                        <el-table-column>
                            <template slot-scope="{ row }">
                                <img
                                    width="60"
                                    height="60"
                                    :src="row.productImage"
                                    v-viewer
                                >
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="productName"
                            label="商品名称"
                        />
                        <el-table-column
                            property="productTypeText"
                            label="类型"
                            width="100"
                        />
                        <el-table-column
                            property="mainCategoryName"
                            label="分类"
                            width="150"
                        />
                        <el-table-column
                            property="totalStock"
                            label="剩余库存"
                            width="100"
                        />
                        <el-table-column
                            label="价格"
                            width="150"
                        >
                            <template slot-scope="{row}">
                                <span v-text="row.minPrice === row.maxPrice ? row.minPrice : `${row.minPrice}-${row.maxPrice}`" />
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="productStatusText"
                            label="商品状态"
                            width="100"
                        />
                    </el-table>
                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :current-page="goodsPageSize.current"
                        :page-size="goodsPageSize.size"
                        :total="goodsPageSize.total"
                        @current-change="getGoodsList"
                        style="margin-top: 12px;text-align: center;"
                    />
                    <div style="margin-top: 32px;text-align: center;">
                        <el-button
                            type="primary"
                            style="width: 70px;"
                            @click="confirmGoods"
                        >
                            确定
                        </el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="全部分类" name="AllClassify">
                    <el-form v-model="classifyListForm">
                        <el-form-item>
                            <el-input
                                prefix-icon="el-icon-search"
                                placeholder="请输入分类名称"
                                type="text"
                                clearable
                                v-model="classifyListForm.categoryName"
                                style="width: 200px;"
                                @clear="getClassifyList(1)"
                            />
                            <el-button
                                type="primary"
                                style="width: 98px;margin-left: 20px;"
                                @click="getClassifyList(1)"
                            >
                                查询
                            </el-button>
                            <el-button
                                type="primary"
                                @click="clearClassifySearch"
                            >
                                清空搜索条件
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                        :data="classifyList"
                        empty-text="请输入分类信息进行搜索"
                    >
                        <el-table-column width="60">
                            <template slot-scope="{ row }">
                                <div class="single-radio">
                                    <el-radio v-model="row.isSelected" :label="true" @change="singleRadio(row)">
                    &nbsp;
                                    </el-radio>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            property="categoryName"
                            label="分组名称"
                        />
                        <el-table-column
                            property="productInActivityCount"
                            label="已参加活动数量"
                        />
                        <el-table-column
                            property="productNotInActivityCount"
                            label="剩余商品数"
                        />
                        <el-table-column
                            property="productTotalCount"
                            label="商品数量"
                        />
                        <el-table-column
                            property="createTime"
                            label="创建时间"
                        />
                    </el-table>
                    <el-pagination
                        small
                        layout="prev, pager, next"
                        :current-page="classifyPageSize.current"
                        :page-size="classifyPageSize.size"
                        :total="classifyPageSize.total"
                        @current-change="setClassifyPageSize"
                        style="margin-top: 12px;text-align: center;"
                    />
                    <div style="margin-top: 32px;text-align: center;">
                        <el-button
                            type="primary"
                            style="width: 70px;"
                            @click="confirmClassify"
                        >
                            确定
                        </el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!-- 添加知识课程 -->
        <model-course
            :show.sync="showCourseBox"
            :default-selected="selectedCourseIdList()"
            @confirm="selectCourse"
        />
    </div>
</template>
<script>
import moment from 'moment'
import ModelCourse from '../../components/Modal-Course.vue'
import { getActivity, getProductJust, getProductSkuByProductId, getCategoryName, getProductByCategoryId, marketingActivityCreate, updateMarketingActivity } from '../../../../apis/marketing-manage/helper.js'
import { getCategoryTreePlatform } from '../../../../apis/product-center/goods'
export default {
    name: 'AddHelperMarketing',
    data () {
        const checkTime = (rule, value, callBack) => {
            if (!this.marketingForm.activityStartTime) {
                callBack(new Error('请选择活动开始时间'))
                return
            }
            if (!this.marketingForm.activityEndTime) {
                callBack(new Error('请选择活动结束时间'))
                return
            }
            if (this.id && (new Date(this.marketingForm.activityEndTime).getTime() < Date.now())) {
                callBack(new Error('编辑活动，活动结束时间不得小于当前时间'))
                return
            }
            callBack()
        }
        return {
            loading: false,
            // 活动id，为空时是创建活动，否则为编辑活动
            id: '',
            // 发送数据对象及页面展示数据
            marketingForm: {
                activityName: '',
                activityNote: '',
                activityStartTime: '',
                activityEndTime: '',
                productList: [],
                courseModelList: []
            },
            isActivityStartTimePass: false,
            STATUS_TEXT: {
                1: '出售中',
                2: '已下架'
            },
            // 添加商品
            addVisible: false,
            tabsActive: 'AllGoods',
            // 添加课程
            showCourseBox: false,
            // 添加具体的商品
            goodsList: [],
            goodsListForm: {
                activityId: '',
                productName: '',
                current: 1,
                size: 4,
                productType: '',
                productStatus: '',
                categoryCode: '',
                subCategoryCode: '',
                classifyCodes: [''],
                excludeIds: [],
                includeProductIds: []
            },
            goodsPageSize: {
                current: 1,
                size: 1,
                total: 0
            },
            selectedGoods: '',
            // 添加单个分类商品
            classifyList: [],
            classifyListForm: {
                activityId: '',
                categoryName: '',
                current: 1,
                size: 4,
                excludeIds: [],
                includeProductIds: []
            },
            isClassifySelect: false,
            classifyPageSize: {
                current: 1,
                size: 1,
                total: 0
            },
            goodsClassifyList: [],
            rules: {
                activityName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '不能超过10个字符', trigger: 'blur' }
                ],
                activityNote: [
                    { required: true, message: '请输入活动备注', trigger: 'blur' },
                    { min: 1, max: 50, message: '不能超过50个字符', trigger: 'blur' }
                ],
                activityStartTime: [
                    { validator: checkTime, trigger: 'blur' }
                ]
            }
        }
    },
    components: {
        ModelCourse
    },
    watch: {
    // 监听本地操作数组的变化，删除已经存在本地的包含ID，防止影响服务器的未参加活动数量的判断
        'marketingForm.productList' (array) {
            for (const item of array) {
                if (this.goodsListForm.includeProductIds.includes(item.productId)) {
                    this.goodsListForm.includeProductIds.splice(this.goodsListForm.includeProductIds.indexOf(item.productId), 1)
                }
                if (this.classifyListForm.includeProductIds.includes(item.productId)) {
                    this.classifyListForm.includeProductIds.splice(this.classifyListForm.includeProductIds.indexOf(item.productId), 1)
                }
            }
        }
    },
    created () {
    // 如果不是新建活动，则请求列表进行展示
        if (this.$route.params.id) {
            this.id = this.$route.params.id
            this.getMarketing(this.id)
        } else {
            this.id = ''
            this.marketingForm.activityStartTime = `${ moment().format('YYYY-MM-DD') } 00:00:00`
            this.marketingForm.activityEndTime = `${ moment().format('YYYY-MM-DD') } 23:59:59`
        }
    },
    methods: {
    // 获取展示数据列表
        async getMarketing (id) {
            try {
                const data = await getActivity(id)
                const { activityName, activityNote, activityStartTime, activityEndTime, productList, courseModelList } = data.result
                for (const item of productList) {
                    if (item && item.skuModelList) {
                        for (const value of item.skuModelList) {
                            // 后端是通过rebateType来判断返利的类型，因此需要自己新建属性来进行额外的扩展，方便后续v-model进行用户输入取值
                            value.fixedRebate = value.rebateType === 'FIXED' ? value.rebate : ''
                            value.percentRebate = value.rebateType === 'FIXED' ? '' : value.rebate
                        }
                    }
                }
                for (const item of courseModelList) {
                    item.fixedRebate = item.rebateType === 'FIXED' ? item.rebate : ''
                    item.percentRebate = item.rebateType === 'FIXED' ? '' : item.rebate
                }
                this.marketingForm = { activityName, activityNote, activityStartTime, activityEndTime, productList, courseModelList }
                this.isActivityStartTimePass = new Date(this.marketingForm.activityStartTime).getTime() < Date.now()
            } catch (e) {
                throw e
            }
        },
        dateChange (val) {
            this.marketingForm.activityStartTime = val.start
            this.marketingForm.activityEndTime = val.end
            this.$refs.marketingForm.validateField('activityStartTime')
        },
        switchRebate (item) {
            item.rebate = ''
            item.rebateType === 'FIXED' ? item.percentRebate = '' : item.fixedRebate = ''
        },
        testRebate (item) {
            if (item.rebateType === 'FIXED') {
                // 固定返利需要是正整数，可以为0
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.fixedRebate)) {
                    return item.fixedRebate
                }
                return ''
            }
            // 百分比返利需要大于0%，小于等于100%
            if (/^100$|^(\d|[1-9]\d)$/.test(item.percentRebate)) {
                return item.percentRebate
            }
            return ''
        },
        removeItem (item, index) {
            // 删除本地操作的数组时，进行判断，防止包含ID里面有重复数据
            if (!this.goodsListForm.includeProductIds.includes(item.productId)) {
                this.goodsListForm.includeProductIds.push(item.productId)
            }
            if (!this.classifyListForm.includeProductIds.includes(item.productId)) {
                this.classifyListForm.includeProductIds.push(item.productId)
            }
            this.marketingForm.productList.splice(index, 1)
        },
        removeCourseItem (index) {
            this.marketingForm.courseModelList.splice(index, 1)
        },
        async getGoodsList (current) {
            try {
                if (this.marketingForm.productList.length) {
                    for (const item of this.marketingForm.productList) {
                        if (item.productId || item.productSeq) {
                            // 排除ID中添加本地数组的数据
                            this.goodsListForm.excludeIds.push(item.productId || item.productSeq)
                        }
                    }
                    // 虽然之前进行了判断，但是为了安全起见，仍然进行一次去重操作
                    this.goodsListForm.excludeIds = [...new Set(this.goodsListForm.excludeIds)]
                    this.goodsListForm.includeProductIds = [...new Set(this.goodsListForm.includeProductIds)]
                }
                this.goodsListForm.activityId = this.id
                this.goodsListForm.categoryCode = this.goodsListForm.classifyCodes[0] || ''
                this.goodsListForm.subCategoryCode = this.goodsListForm.classifyCodes[1] || ''
                // 如果参数中指定了当前分页数据，采用该数据
                if (current) {
                    this.goodsListForm.current = current
                }
                // 深拷贝一份本地数据，防止页面显示数据被修改
                const goodsListForm = JSON.parse(JSON.stringify(this.goodsListForm))
                // 删除前端自定义的数据，防止后端报错
                delete goodsListForm.classifyCodes
                const data = await getProductJust(goodsListForm)
                if (data && data.result && data.result.records && data.result.records.length) {
                    this.goodsList = data.result.records
                    this.goodsPageSize = {
                        current: data.result.current,
                        size: data.result.size,
                        total: data.result.total
                    }
                } else {
                    this.goodsList = []
                    this.goodsPageSize = {
                        current: 1,
                        size: 1,
                        total: 0
                    }
                }
            } catch (e) {
                throw e
            }
        },
        async getClassifyList (current) {
            try {
                if (this.marketingForm.productList.length) {
                    for (const item of this.marketingForm.productList) {
                        if (item.productId || item.productSeq) {
                            // 排除ID添加数据
                            this.classifyListForm.excludeIds.push(item.productId || item.productSeq)
                        }
                    }
                    // 虽然之前进行了判断，但是为了安全起见，仍然进行一次去重操作
                    this.classifyListForm.excludeIds = [...new Set(this.classifyListForm.excludeIds)]
                    this.classifyListForm.includeProductIds = [...new Set(this.classifyListForm.includeProductIds)]
                }
                this.classifyListForm.activityId = this.id
                // 如果指定了当前的分页，采用这个数据
                if (current) {
                    this.classifyListForm.current = current
                }
                const data = await getCategoryName(this.classifyListForm)
                if (data && data.result && data.result.records && data.result.records.length) {
                    for (const item of data.result.records) {
                        item.isSelected = false
                    }
                    this.classifyList = data.result.records
                    this.classifyPageSize = {
                        current: data.result.current,
                        size: data.result.size,
                        total: data.result.total
                    }
                } else {
                    this.classifyList = []
                    this.classifyPageSize = {
                        current: 1,
                        size: 1,
                        total: 0
                    }
                }
            } catch (e) {
                throw e
            }
        },
        async getGoodsClassifyList () {
            const data = await getCategoryTreePlatform()
            if (data && data.result && data.result.length) {
                // 添加前端自定义的数据，方便展示
                data.result.unshift({ categoryName: '全部分类', id: '' })
                this.goodsClassifyList = data.result
            }
        },
        clearGoodsSearch () {
            // 为了保留排除与包含ID，在这只能单个属性进行重置
            this.goodsListForm.productName = ''
            this.goodsListForm.current = 1
            this.goodsListForm.size = 4
            this.goodsListForm.productType = ''
            this.goodsListForm.productStatus = ''
            this.goodsListForm.categoryCode = ''
            this.goodsListForm.subCategoryCode = ''
            this.goodsListForm.classifyCodes = ['']
            this.getGoodsList(1)
        },
        clearClassifySearch () {
            // 为了保留排除与包含ID，在这只能单个属性进行重置
            this.classifyListForm.categoryName = ''
            this.classifyListForm.current = 1
            this.classifyListForm.size = 4
            this.getClassifyList(1)
        },
        selectGoods (selected) {
            const array = []
            for (const item of selected) {
                array.push(item.productId || item.productSeq)
            }
            this.selectedGoods = array
        },
        async confirmGoods () {
            if (!this.selectedGoods.length) {
                this.$error('请最少选择1个商品')
                return false
            }
            const data = await getProductSkuByProductId({
                activityId: this.id,
                productIds: this.selectedGoods
            })
            if (data && data.result && data.result) {
                for (const item of data.result) {
                    if (item && item.skuModelList) {
                        for (const value of item.skuModelList) {
                            // 添加新的商品时，默认设置为百分比返利类型，且返利值为1%
                            value.rebateType = 'PERCENTAGE'
                            value.percentRebate = 1
                            value.fixedRebate = ''
                        }
                    }
                    this.marketingForm.productList.push(item)
                }
            }
            this.addVisible = false
        },
        selectCourse (data = []) {
            const list = []
            for (const item of data) {
                list.push({
                    courseId: item.id,
                    courseName: item.courseName,
                    courseImg: item.courseImg,
                    courseType: item.courseType,
                    status: item.status,
                    sellingPrice: item.sellingPrice,
                    // 添加新的商品时，默认设置为百分比返利类型，且返利值为1%
                    rebateType: 'PERCENTAGE',
                    percentRebate: 1,
                    fixedRebate: ''
                })
            }
            this.marketingForm.courseModelList = list
        },
        selectedCourseIdList () {
            const list = JSON.parse(JSON.stringify(this.marketingForm.courseModelList))
            list.forEach(item => {
                item.productId = item.courseId
                item.productType = 'KNOWLEDGE_COURSE'
                delete item.courseId
            })
            return list
        },
        singleRadio (row) {
            for (const item of this.classifyList) {
                item.isSelected = false
            }
            row.isSelected = true
            // 如果用户点击过单选按钮，则后续不用提示最少选择1个分类，比较取巧的一个办法
            this.isClassifySelect = true
        },
        setClassifyPageSize (size) {
            this.getClassifyList(size)
            this.isClassifySelect = false
        },
        async confirmClassify () {
            if (!this.isClassifySelect) {
                this.$error('请最少选择1个分类')
                return false
            }
            for (const items of this.classifyList) {
                if (items.isSelected) {
                    if (items.productNotInActivityCount === 0) {
                        this.$error('该分类下暂无可添加商品，请选择其他分类')
                        return false
                    }
                    const data = await getProductByCategoryId({
                        activityId: this.id,
                        categoryId: items.categoryId,
                        includeProductIds: this.classifyListForm.includeProductIds
                    })
                    if (data && data.result && data.result) {
                        const array = []
                        for (const value of this.marketingForm.productList) {
                            if (value.productId) {
                                array.push(value.productId)
                            }
                        }
                        for (const item of data.result) {
                            if (item && item.skuModelList) {
                                if (!array.includes(item.productId)) {
                                    for (const value of item.skuModelList) {
                                        // 添加新的商品时，默认设置为百分比返利类型，且返利值为1%
                                        value.rebateType = 'PERCENTAGE'
                                        value.percentRebate = 1
                                    }
                                    this.marketingForm.productList.push(item)
                                }
                            }
                        }
                    }
                    this.addVisible = false
                    break
                }
            }
        },
        openAddListDialog () {
            this.getGoodsList(1)
            this.getClassifyList(1)
            this.getGoodsClassifyList()
            this.addVisible = true
        },
        openAddCourseListDialog () {
            this.showCourseBox = true
        },
        closeAddListDialog () {
            // 关闭窗口后，进行清理操作
            this.goodsList = []
            this.goodsListForm = {
                activityId: '',
                productName: '',
                current: 1,
                size: 4,
                productType: '',
                productStatus: '',
                categoryCode: '',
                subCategoryCode: '',
                classifyCodes: [''],
                excludeIds: [],
                // 保留包含的数组
                includeProductIds: this.goodsListForm.includeProductIds
            }
            this.classifyList = []
            this.classifyListForm = {
                activityId: '',
                categoryName: '',
                current: 1,
                size: 4,
                excludeIds: [],
                // 保留包含的数组
                includeProductIds: this.classifyListForm.includeProductIds
            }
            this.addVisible = false
            this.tabsActive = 'AllGoods'
        },
        // 表单校验事件
        formValidateHandler (prop, isPass, message) {
            if (!isPass && message && !this.hasValidate && this.submiting) {
                const el = document.getElementById(prop)
                if (el) {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    })
                    this.$warning(message)
                }
                this.hasValidate = true
            }
            clearTimeout(this.validateTimer)
            this.validateTimer = setTimeout(() => {
                this.hasValidate = false
                this.submiting = false
            }, 1000)
        },
        async checkData (marketingForm) {
            await this.$refs.marketingForm.validate()
            if (!this.marketingForm.productList.length && !this.marketingForm.courseModelList.length) {
                this.$error('请最少添加1个商品')
                return false
            }
            for (const item of marketingForm.productList) {
                if (item && item.skuModelList) {
                    for (const value of item.skuModelList) {
                        if (String(value.rebate) || String(value.fixedRebate) || String(value.percentRebate)) {
                            if (String(value.fixedRebate) || String(value.percentRebate)) {
                                value.rebate = value.fixedRebate || value.percentRebate || '0'
                                // 删除前端自定义的数据，防止后端报错
                                delete value.fixedRebate
                                delete value.percentRebate
                            }
                        } else {
                            this.$error('请完善每个商品润笔')
                            return false
                        }
                    }
                }
                if (item.productSeq) {
                    item.productId = item.productSeq
                    delete item.productSeq
                }
                // 删除一些后端单独给某些接口新增的数据，防止他们在存数据的时候受到别的数据的干扰导致报错
                delete item.totalStock
                delete item.maxPrice
                delete item.minPrice
            }
            for (const item of marketingForm.courseModelList) {
                if (String(item.rebate) || String(item.fixedRebate) || String(item.percentRebate)) {
                    if (String(item.fixedRebate) || String(item.percentRebate)) {
                        item.rebate = item.fixedRebate || item.percentRebate || '0'
                        // 删除前端自定义的数据，防止后端报错
                        delete item.fixedRebate
                        delete item.percentRebate
                    }
                } else {
                    this.$error('请完善每个课程润笔')
                    return false
                }
            }
            return true
        },
        async submitForm () {
            try {
                this.submiting = true // 标记正在提交
                // 深拷贝一份本地数据，避免本地数据被修改
                const marketingForm = JSON.parse(JSON.stringify(this.marketingForm))
                if (!await this.checkData(marketingForm)) {
                    return
                }
                this.loading = true
                if (this.id) {
                    // 修改
                    await updateMarketingActivity({ id: this.id, data: marketingForm })
                    await this.$success('修改成功')
                    this.$router.push({ name: 'MarketingManageList' })
                } else {
                    // 创建
                    await marketingActivityCreate(marketingForm)
                    await this.$success('创建成功')
                    this.$router.push({ name: 'MarketingManageList' })
                }
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .add-marketing{
      padding-bottom: 100px;
    .marketing-top {
      display: flex;
      align-items: center;
      height: 52px;
      padding-left: 24px;
      color: #2E2E2E;
      border-bottom: 1px solid #e7e7e7;
      background-color: #ffffff;
      ::v-deep .el-icon-back {
        margin-right: 32px;
        color: #4F63FF;
        font-size: 24px;
        font-weight: bolder;
        cursor: pointer;
      }
      span{
        color: #333333;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .marketing-content{
        background: #fff;
      .content-detail{
          padding: 30px;
        ::v-deep .el-form-item__content{
          margin-left: 180px !important;
        }
        ::v-deep .el-form-item{
          margin-bottom: 32px;
        }
        .detail-title{
          display: flex;
          align-items: center;
          height: 60px;
          margin-bottom: 24px;
          padding-left: 30px;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
          background-color: #FBFBFB;
        }
        ::v-deep .separator{
          margin: 0 6px;
          color: #A8A8A8;
          font-size: 12px;
        }
        .detail-table {
          display: flex;
          flex-direction: column;
          margin: 24px 0 0 24px;
          padding-bottom: 32px;
          .width-1{
            width: 122px;
          }
          .width-2{
            width: 196px;
          }
          .width-3{
            width: 88px;
          }
          .width-4{
            width: 114px;
          }
          .width-5{
            width: 130px;
          }
          .width-6{
            width: 500px;
          }
          .width-7{
            width: 60px;
          }
          .radius-top{
            border-radius: 10px 10px 0 0;
          }
          .radius-left{
            border-radius: 10px 0 0 0;
          }
          .radius-right{
            border-radius: 0 10px 0 0;
          }
          .border-left{
            border-left: 1px solid #E7E7E7;
          }
          .border-right{
            border-right: 1px solid #E7E7E7;
          }
          .border-bottom{
            border-bottom: 1px solid #E7E7E7;
          }
          .table-title{
            display: flex;
            align-items: center;
            .title-group{
              display: flex;
              align-items: center;
              margin-right: 10px;
              &:last-of-type{
                margin-right: 0;
              }
              .title-dark{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 60px;
                color: #000000;
                font-size: 14px;
                font-weight: bold;
                background-color: #F8F8F8;
              }
              .title-light{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 60px;
                color: #000000;
                font-size: 14px;
                font-weight: bold;
                border-top: 1px solid #E7E7E7;
                border-bottom: 1px solid #E7E7E7;
              }
            }
          }
          .table-item{
            display: flex;
            align-items: stretch;
            .item-img{
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 60px;
              margin-right: 10px;
              border-bottom: 1px solid #E7E7E7;
              border-left: 1px solid #E7E7E7;
              border-right: 1px solid #E7E7E7;
              img{
                width: 74px;
                height: 50px;
                object-fit: cover;
              }
            }
            .item-info{
              display: flex;
              align-items: stretch;
              justify-content: center;
              min-height: 60px;
              margin-right: 10px;
              border-bottom: 1px solid #E7E7E7;
              .item-item{
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid #E7E7E7;
                &:first-of-type{
                  border-left: 1px solid #E7E7E7;
                }
                & > span{
                  display: block;
                  width: 80%;
                  text-align: center;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }
            .item-sku{
              display: flex;
              align-items: stretch;
              justify-content: center;
              min-height: 60px;
              .item-vertical{
                display: flex;
                flex-direction: column;
                border-right: 1px solid #E7E7E7;
                .item-item{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 60px;
                  border-bottom: 1px solid #E7E7E7;
                  & > span{
                    display: block;
                    width: 80%;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
            .item-del{
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 60px;
              margin-left: 10px;
              border-left: 1px solid #E7E7E7;
              border-right: 1px solid #E7E7E7;
              border-bottom: 1px solid #E7E7E7;
              i{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                min-height: 60px;
                border-bottom: 1px solid #E7E7E7;
                cursor: pointer;
              }
            }
          }
        }
      }
      .content-btn{
        box-sizing: border-box;
        margin-left: 24px;
        padding: 30px 0;
        border-top: 1px solid #E7E7E7;
      }
    }
    ::v-deep .el-dialog{
      .single-radio{
        display: flex;
        align-items: center;
        min-height: 50px;
      }
      .el-pager li.active,.el-pager li:hover{
        color: #EC742E;
      }
    }
  }
</style>
