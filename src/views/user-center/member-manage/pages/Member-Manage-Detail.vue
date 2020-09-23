<template>
    <div class="member-detail">
        <!--用户信息-->
        <div class="container bg-white mt-20">
            <p class="title">用户基本信息</p>
            <div class="header">
                <img
                    slot="left"
                    class="face"
                    :src="memberDetail.userImage"
                >
                <div class="intro">
                    <div class="detail">
                        <span class="user-type" v-if="memberDetail.type">{{ USER_TYPE[memberDetail.type] && USER_TYPE[memberDetail.type].split('')[0] }}</span>
                        <span
                            slot="right-top"
                            class="name"
                            v-text="memberDetail.nickName"
                        />
                        <template>
                            <pl-svg v-if="memberDetail.gender === 2" name="icon-women-be552" width="10" height="10" />
                            <pl-svg v-if="memberDetail.gender === 1" name="icon-man-8b747" width="10" height="10" />
                        </template>
                    </div>
                    <div
                        class="member-type"
                        v-text="ROLE[memberDetail.roleCode]"
                    />
                </div>
                <div class="info-list">
                    <Field
                        title="手机号："
                        :text="memberDetail.mobile"
                    />
                    <Field
                        title="姓名："
                        :text="memberDetail.name || '--'"
                    />
                    <Field
                        title="地址："
                        :text="memberDetail.addressPath + memberDetail.address || '--'"
                    />
                    <div class="tag-list">
                        <span>标签：</span>
                        <span class="tags" v-if="memberDetail.tags && memberDetail.tags.length">
                            <span v-for="item in memberDetail.tags" :key="item.id">{{ item && item.tagName }} </span>
                        </span>
                        <a @click="showAddTagDialog = true">
                            编辑
                        </a>
                    </div>
                    <Field
                        title="来源："
                        :text="memberDetail.source"
                    />
                    <div class="record">
                        <span>记录：</span>
                        <div class="list" v-if="memberDetail.record && memberDetail.record.length">
                            <p v-for="item in memberDetail.record" :key="item.id">
                                {{ item }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--备注用户信息-->
        <div class="container bg-white mt-20">
            <p class="title">
                备注用户信息
                <template v-if="!isEdit">
                    <el-button type="text" @click="edit">编辑</el-button>
                </template>
                <template v-else>
                    <el-button type="text" @click="saveAddMemberDetail">保存</el-button>
                    <el-button type="text" @click="isEdit = false">取消</el-button>
                </template>
            </p>
            <div class="remark-detail">
                <SearchBox>
                    <div class="text" v-if="!isEdit">
                        <div>
                            <span>真实姓名：</span>
                            <span>{{ memberDetail.name || '--' }}</span>
                        </div>
                        <div>
                            <span>用户身份：</span>
                            <span>{{ USER_TYPE[memberDetail.type] || '--' }}</span>
                        </div>
                        <div>
                            <span>手机号码：</span>
                            <span>{{ memberDetail.mobile || '--' }}</span>
                        </div>
                        <div>
                            <span>生日：</span>
                            <span>{{ memberDetail.birthday || '--' }}</span>
                        </div>
                        <div>
                            <span>性别：</span>
                            <span>{{ GENDER[memberDetail.gender] || '--' }}</span>
                        </div>
                        <div>
                            <span>微信号：</span>
                            <span>{{ memberDetail.wechatNumber || '--' }}</span>
                        </div>
                        <div>
                            <span>邮箱：</span>
                            <span>{{ memberDetail.email || '--' }}</span>
                        </div>
                        <div class="fill">
                            <span>所在区域：</span>
                            <span>{{ (memberDetail.addressPath + memberDetail.address) || '--' }}</span>
                        </div>
                        <div v-if="memberDetail.type !== 2">
                            <span>行业：</span>
                            <span>{{ memberDetail.industry || '--' }}</span>
                        </div>
                        <div v-if="memberDetail.type !== 2">
                            <span>公司：</span>
                            <span>{{ memberDetail.company || '--' }}</span>
                        </div>
                        <div v-if="memberDetail.type !== 2">
                            <span>职位：</span>
                            <span>{{ memberDetail.workPosition || '--' }}</span>
                        </div>
                        <div class="fill">
                            <span>备注：</span>
                            <span>{{ memberDetail.remark }}</span>
                            <el-button type="text" @click="isShowRemarkList = true">查看更多</el-button>
                        </div>
                    </div>
                    <template v-else>
                        <el-form-item label="真实姓名：">
                            <el-input
                                clearable
                                placeholder="请输入真实姓名"
                                maxlength="16"
                                v-model="addMemberDetailForm.name"
                            />
                        </el-form-item>
                        <el-form-item label="用户身份：">
                            <el-radio-group class="mr-20" v-model="addMemberDetailForm.type">
                                <el-radio :label="1">家长</el-radio>
                                <el-radio :label="2">学生</el-radio>
                                <el-radio :label="3">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-show="addMemberDetailForm.type === 3">
                            <el-input
                                clearable
                                placeholder="请输入用户身份"
                                maxlength="8"
                                v-model="addMemberDetailForm.other"
                            />
                        </el-form-item>
                        <el-form-item label="生日：">
                            <el-date-picker
                                v-model="addMemberDetailForm.birthday"
                                type="date"
                                placeholder="选择生日日期" />
                        </el-form-item>
                        <el-form-item label="邮箱：">
                            <el-input
                                clearable
                                type="email"
                                maxlength="20"
                                placeholder="请输入邮箱"
                                v-model="addMemberDetailForm.email"
                            />
                        </el-form-item>
                        <el-form-item label="微信号：">
                            <el-input
                                clearable
                                maxlength="20"
                                placeholder="请输入微信号"
                                v-model="addMemberDetailForm.wechatNumber"
                            />
                        </el-form-item>
                        <el-form-item
                            label="所在区域"
                            prop="addressPath"
                        >
                            <CityPicker
                                @selected="selectedCity"
                                :default-value="addressCode"
                            />
                        </el-form-item>
                        <el-form-item
                            label="详细地址"
                            prop="agencyAddress"
                        >
                            <el-input
                                maxlength="30"
                                v-model="addMemberDetailForm.address"
                                placeholder="请输入详细地址"
                            />
                        </el-form-item>
                        <el-form-item v-show="addMemberDetailForm.type !== 2" label="行业：">
                            <el-input
                                clearable
                                placeholder="请输入行业"
                                maxlength="30"
                                v-model="addMemberDetailForm.industry"
                            />
                        </el-form-item>
                        <el-form-item v-show="addMemberDetailForm.type !== 2" label="公司：">
                            <el-input
                                clearable
                                placeholder="请输入公司名称"
                                maxlength="30"
                                v-model="addMemberDetailForm.company"
                            />
                        </el-form-item>
                        <el-form-item v-show="addMemberDetailForm.type !== 2" label="职位：">
                            <el-input
                                clearable
                                type="email"
                                placeholder="请输入职位"
                                maxlength="20"
                                v-model="addMemberDetailForm.workPosition"
                            />
                        </el-form-item>
                    </template>
                </SearchBox>
            </div>
        </div>

        <div class="container bg-white mt-20">
            <p class="title">
                用户行为数据
            </p>
            <div class="data-list">
                <div>
                    近30天自购订单量
                    <b>{{ memberData.currentMonthOrder }}</b>
                </div>
                <div>
                    累计自购订单量
                    <b>{{ memberData.totalOrder }}</b>
                </div>
                <div>
                    支付总额
                    <b>{{ memberData.totalAmount }}</b>
                </div>
                <div>
                    分享订单量
                    <b>{{ memberData.shareOrder }}</b>
                </div>
            </div>
            <pl-tabs :value="tabName" :tabs="Tab_List" @tabClick="tabClick" />
            <div class="tab-detail">
                <!--购买记录-->
                <template v-if="tabName === 'OrderList'">
                    <SearchBox>
                        <el-form-item label="关键字：">
                            <el-input
                                clearable
                                style="width: 300px;"
                                @change="searchOrderList"
                                placeholder="请输入用户昵称/真实姓名/手机号"
                                v-model="orderListForm.keyword"
                            />
                        </el-form-item>
                        <el-form-item label="产品类型：">
                            <el-select
                                v-model="orderListForm.goodsType"
                                @change="searchOrderList"
                                clearable
                            >
                                <el-option
                                    v-for="item in Order_Type"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支付时间：">
                            <date-range
                                style="width: 380px;"
                                :init="orderListTimeRange"
                                @change="formatOrderListTimeRange"
                                disable-after
                                clearable
                                ref="dateRange"
                            />
                        </el-form-item>
                        <el-form-item label="订单状态：">
                            <el-select
                                v-model="orderListForm.orderStatus"
                                @change="searchOrderList"
                                clearable
                            >
                                <el-option
                                    v-for="item of ORDER_STATUS"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="searchOrderList"
                            >
                                查询
                            </el-button>
                            <el-button
                                @click="changeExportOrderList"
                                type="primary"
                                plain
                                v-if="orderList && orderList.length"
                            >
                                导出数据
                            </el-button>
                            <el-button type="text" @click="resetOrderList">清空筛选条件</el-button>
                        </el-form-item>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="orderList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png" alt="">
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="orderId"
                                label="订单号"
                            />
                            <el-table-column
                                prop="goodName"
                                label="产品名称"
                            />
                            <el-table-column
                                prop="categoryName"
                                label="产品类型"
                            />
                            <el-table-column
                                prop="orderNumber"
                                label="数量"
                            />
                            <el-table-column
                                prop="unitPrice"
                                label="单价（元）">
                                <template #default="{ row }">
                                    {{ row.unitPrice / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="orderStatus"
                                label="订单状态"
                            />
                            <el-table-column
                                fixed="right"
                                label="操作"
                            >
                                <template>
                                    <div class="operate">
                                        <a @click="$router.push({ name: 'MemberManageDetail'})">
                                            订单详情
                                        </a>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination
                            @change="getOrderList"
                            @sizeChange="orderListSizeChange"
                            v-model="orderListForm.current"
                            :total="orderListTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
                <!--分享记录-->
                <template v-if="tabName === 'ShareList'">
                    <SearchBox>
                        <el-form-item label="关键字：">
                            <el-input
                                clearable
                                style="width: 300px;"
                                @change="searchShareList"
                                placeholder="请输入订单号/商品名称/分享人"
                                v-model="shareListForm.keyword"
                            />
                        </el-form-item>
                        <el-form-item label="产品类型：">
                            <el-select
                                v-model="shareListForm.goodsType"
                                @change="searchShareList"
                                clearable
                            >
                                <el-option
                                    v-for="item in Order_Type"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单类型：">
                            <el-select
                                v-model="orderListForm.orderStatus"
                                @change="searchShareList"
                                clearable
                            >
                                <el-option
                                    v-for="item in ORDER_STATUS"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="支付时间：">
                            <date-range
                                style="width: 380px;"
                                :init="shareListTimeRange"
                                @change="formatShareListTimeRange"
                                disable-after
                                clearable
                                ref="dateRange"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="searchShareList"
                            >
                                查询
                            </el-button>
                            <el-button
                                @click="changeExportShareList"
                                type="primary"
                                plain
                                v-if="shareList && shareList.length"
                            >
                                导出数据
                            </el-button>
                            <el-button type="text" @click="resetShareList">清空筛选条件</el-button>
                        </el-form-item>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="shareList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png" alt="">
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="orderId"
                                label="订单号"
                            />
                            <el-table-column
                                prop="goodName"
                                label="产品名称"
                            />
                            <el-table-column
                                prop="categoryName"
                                label="产品类型"
                            />
                            <el-table-column
                                prop="orderNumber"
                                label="数量"
                            />
                            <el-table-column
                                prop="unitPrice"
                                label="单价（元）">
                                <template #default="{ row }">
                                    {{ row.unitPrice / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="amount"
                                label="实付款（元）">
                                <template #default="{ row }">
                                    {{ row.amount / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="userName"
                                label="分享人"
                            />
                            <el-table-column
                                prop="orderStatus"
                                label="订单状态"
                            />
                            <el-table-column
                                prop="payTime"
                                label="支付时间"
                            />
                            <el-table-column
                                fixed="right"
                                label="操作"
                            >
                                <template>
                                    <div class="operate">
                                        <a @click="$router.push({ name: 'MemberManageDetail'})">
                                            订单详情
                                        </a>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination
                            @change="getShareList"
                            @sizeChange="shareListSizeChange"
                            v-model="shareListForm.current"
                            :total="shareListTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
                <!--直播观看记录-->
                <template v-if="tabName === 'LiveWatchList'">
                    <SearchBox>
                        <el-form-item label="关键字：">
                            <el-input
                                clearable
                                style="width: 300px;"
                                @change="searchLiveWatchList"
                                placeholder="请输入直播名称"
                                v-model="liveWatchListForm.keyword"
                            />
                        </el-form-item>
                        <el-form-item label="类型：">
                            <el-select
                                v-model="liveWatchListForm.liveType"
                                @change="searchLiveWatchList"
                                clearable
                            >
                                <el-option :value="''" label="全部" />
                                <el-option :value="'live'" label="直播" />
                                <el-option :value="'video'" label="录像" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="形式：">
                            <el-select
                                v-model="liveWatchListForm.liveMode"
                                @change="searchLiveWatchList"
                                clearable
                            >
                                <el-option :value="''" label="全部" />
                                <el-option :value="'public'" label="公开课" />
                                <el-option :value="'private'" label="私享课" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="直播时间：">
                            <date-range
                                style="width: 380px;"
                                :init="liveWatchTimeRange"
                                @change="formatLiveWatchListTimeRange"
                                disable-after
                                clearable
                                ref="dateRange"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="searchLiveWatchList"
                            >
                                查询
                            </el-button>
                            <el-button
                                @click="changeExportLiveWatchList"
                                type="primary"
                                plain
                                v-if="liveWatchList && liveWatchList.length"
                            >
                                导出数据
                            </el-button>
                            <el-button type="text" @click="resetLiveWatchList">清空筛选条件</el-button>
                        </el-form-item>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="liveWatchList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png" alt="">
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="liveStartTime"
                                label="直播时间"
                            />
                            <el-table-column
                                prop="liveName"
                                label="直播信息"
                            />
                            <el-table-column
                                prop="liveMode"
                                label="形式"
                            />
                            <el-table-column
                                prop="liveType"
                                label="类型"
                            />
                            <el-table-column
                                prop="amount"
                                label="实付款（元）">
                                <template #default="{ row }">
                                    {{ row.amount / 100 }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="amount"
                                label="支付优惠"
                            />
                            <el-table-column
                                prop="sharer"
                                label="分享人"
                            />
                            <el-table-column
                                prop="firstViewingTime"
                                label="首次观看时间"
                            />
                            <el-table-column
                                fixed="right"
                                label="操作"
                            >
                                <template>
                                    <div class="operate">
                                        <a @click="$router.push({ name: 'MemberManageDetail'})">
                                            订单详情
                                        </a>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination
                            @change="getLiveWatchList"
                            @sizeChange="liveWatchListSizeChange"
                            v-model="liveWatchListForm.current"
                            :total="liveWatchListTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
                <!--云课堂学习进度-->
                <template v-if="tabName === 'LineLearningList'">
                    <SearchBox>
                        <el-form-item label="关键字：">
                            <el-input
                                clearable
                                style="width: 300px;"
                                @change="searchLineLearningList"
                                placeholder="请输入课程名称"
                                v-model="lineLearningListForm.keyword"
                            />
                        </el-form-item>
                        <el-form-item label="类型：">
                            <el-select
                                v-model="lineLearningListForm.courseType"
                                @change="searchLineLearningList"
                                clearable
                            >
                                <el-option :value="''" label="全部" />
                                <el-option :value="1" label="视频单课" />
                                <el-option :value="2" label="系列课" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分类：">
                            <el-select
                                v-model="lineLearningListForm.courseCategory"
                                @change="searchLineLearningList"
                                clearable
                            >
                                <el-option :value="''" label="全部" />
                                <el-option :value="1" label="直播" />
                                <el-option :value="2" label="录播" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="searchLineLearningList"
                            >
                                查询
                            </el-button>
                            <el-button
                                @click="changeExportLineLearningList"
                                type="primary"
                                plain
                                v-if="lineLearningList && lineLearningList.length"
                            >
                                导出数据
                            </el-button>
                            <el-button type="text" @click="resetLineLearningList">清空筛选条件</el-button>
                        </el-form-item>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="liveWatchList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png" alt="">
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="courseName"
                                label="课程名称"
                            />
                            <el-table-column
                                prop="courseType"
                                label="类型"
                            />
                            <el-table-column
                                prop="courseCategory"
                                label="分类"
                            />
                            <el-table-column
                                prop="learnStatus"
                                label="学习状态"
                            />
                            <el-table-column
                                prop="firstViewingTime"
                                label="首次观看时间"
                            />
                            <el-table-column
                                prop="dataFlowSizeShow"
                                label="消耗流量"
                            />
                            <el-table-column
                                prop="shareName"
                                label="分享人"
                            />
                            <el-table-column
                                fixed="right"
                                label="学习进度"
                            >
                                <template #default="{ row }">
                                    <div class="operate" v-if="row.courseType === 2">
                                        <a @click="watchDetail(row)">
                                            查看
                                        </a>
                                    </div>
                                    <span v-else>{{ row.learnProgress }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination
                            @change="getLineLearningList"
                            @sizeChange="lineLearningListSizeChange"
                            v-model="lineLearningListForm.current"
                            :total="lineLearningListTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
                <!--备注-->
                <template v-if="tabName === 'RemarkList'">
                    <div class="list">
                        <el-button
                            @click="addRemark"
                            style="width: 98px;"
                            type="primary"
                            plain
                        >
                            添加备注
                        </el-button>
                        <el-table
                            :data="remarkList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <img width="136" src="https://mallcdn.youpenglai.com/static/admall-new/3.0.0/no-data.png" alt="">
                                    <p>该会员还没有备注哦</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="content"
                                label="备注内容"
                            />
                            <el-table-column
                                prop="createTime"
                                label="添加时间"
                            />
                            <el-table-column
                                prop="createUser"
                                label="添加人"
                            />
                            <el-table-column
                                fixed="right"
                                label="操作"
                            >
                                <template #default="{row}">
                                    <div class="operate">
                                        <a @click="deleteRemark(row.id)">
                                            删除
                                        </a>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination
                            @change="getRemarkList"
                            @sizeChange="remarkListSizeChange"
                            v-model="remarkListForm.current"
                            :total="remarkListTotal"
                            :sizes="true"
                        />
                    </div>
                </template>
            </div>
        </div>

        <!-- 添加标签 -->
        <add-tags
            :show.sync="showAddTagDialog"
            :current-member="memberDetail"
            @confirm="getMemberDetail"
        />
        <!--查看学习进度-->
        <WatchDetailList
            :show.sync="showWatchDetailList"
            :course-id="courseResourceId"
            :user-id="selectedUserId"
        />
        <!--添加备注-->
        <AddRemark :show.sync="showAddRemark"
                   :user-id="userId"
                   @success="getRemarkList"
        />
        <!--显示备注信息列表-->
        <RemarkList
            :show.sync="isShowRemarkList"
            :user-id="userId"
            @close="getMemberDetail"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Pagination from '../../../../components/common/Pagination.vue'

import Field from '../../../../components/common/Field.vue'
import CityPicker from '../../../../components/common/City-Picker.vue'
import AddTags from '../components/Add-Tags.vue'
import WatchDetailList from '../components/Watch-Detail-List.vue'
import AddRemark from '../components/Add-Remark.vue'
import RemarkList from '../components/Remark-List.vue'

import {
    getMemberDetail,
    saveMemberInfo,
    getOrderList,
    getRemarkList,
    getLiveWatchList,
    getLineLearningList,
    deleteRemark,
    getMemberOrderCount
} from '../../../../apis/member'

  @Component({
      components: {
          AddTags,
          Field,
          CityPicker,
          Pagination,
          WatchDetailList,
          RemarkList,
          AddRemark
      }
  })

export default class MemberManageDetail extends Vue {
    // 角色
    ROLE = {
        MEMBERSHIP: '普通会员',
        HELPER: 'Helper'
    }

    USER_TYPE = {
        1: '家长',
        2: '学生',
        3: '其他'
    }

    // 用户行为数据Tab
    Tab_List = [
        { name: 'OrderList', label: '购买记录' },
        { name: 'ShareList', label: '分享记录' },
        { name: 'LiveWatchList', label: '直播观看记录' },
        { name: 'LineLearningList', label: '云课堂学习进度' },
        { name: 'RemarkList', label: '备注' }
    ]

    Order_Type = [
        { value: '', label: '全部' },
        { value: 'PHYSICAL_GOODS', label: '实体商品' },
        { value: 'VIRTUAL_GOODS', label: '虚拟商品' },
        { value: 'EXPERIENCE_CLASS', label: '体验课' },
        { value: 'FORMAL_CLASS', label: '正式课' },
        { value: 'KNOWLEDGE_COURSE', label: '知识课程' },
        { value: '"SERIES_OF_COURSE', label: '系列课' },
        { value: '"LIVE_GOODS', label: '直播订单' },
        { value: 'VIDEO_GOODS', label: '录播订单' }
    ]

      ORDER_STATUS= [
          {
              label: '全部',
              value: ''
          },
          {
              label: '待发货',
              value: 'WAIT_SHIP'
          },
          {
              label: '待收货',
              value: 'WAIT_RECEIVE'
          },
          {
              label: '待付款',
              value: 'WAIT_PAY'
          },
          {
              label: '订单完成',
              value: 'FINISHED'
          },
          {
              label: '订单关闭',
              value: 'CLOSED'
          }
      ]

    GENDER = {
        0: '保密',
        1: '男',
        2: '女'
    }

    // 请求用户数据参数
    userId = ''

    // 用户数据
    memberDetail = {
        userImage: '',
        type: '',
        nickName: '',
        gender: '',
        roleCode: '',
        mobile: '',
        name: '',
        province: '',
        region: '',
        city: '',
        town: '',
        addressPath: '',
        address: '',
        tags: '',
        source: '',
        wechatNumber: '',
        email: '',
        birthday: '',
        company: '',
        createTime: '',
        id: '',
        lastLoginTime: '',
        lastPurchaseTime: '',
        remark: '',
        workPosition: ''
    }

    // 是否显示添加标签弹框
    showAddTagDialog = false

    // 是否编辑用户备注信息
    isEdit = false

    // 用户行为数据统计
    memberData = {
        currentMonthOrder: 0,
        totalOrder: 0,
        totalAmount: 0,
        shareOrder: 0
    }

    // 显示备注列表
      isShowRemarkList = false

    // 当前所在的tab页
    tabName = this.Tab_List[0].name

    // 生命周期函数
    async created () {
        const { userId } = this.$route.params
        this.userId = userId
        await this.getMemberDetail()
        await this.getMemberOrderCount()
    }

    // methods
    async getMemberDetail () {
        try {
            const { result } = await getMemberDetail(this.userId)
            this.memberDetail = result || {}
        } catch (e) {
            throw e
        }
    }

    async getMemberOrderCount () {
        try {
            const { result } = await getMemberOrderCount(this.userId)
            this.memberData = result || {}
        } catch (e) {
            throw e
        }
    }

    addressCode: string[] = []
    addMemberDetailForm: DynamicObject = {
        mallUserId: '',
        name: '',
        // 1家长，2学生，3其他
        type: '',
        other: '',
        birthday: '',
        email: '',
        wechatNumber: '',
        province: '',
        city: '',
        town: '',
        addressPath: '',
        region: '',
        address: '',
        industry: '',
        company: '',
        workPosition: ''
    }

    selectedCity (val: Array<any>) {
        const form = this.addMemberDetailForm
        form.province = val[0].code
        form.city = val[1].code
        form.region = val[2] ? val[2].code : ''
        form.town = val[3] ? val[3].code : ''
        form.addressPath = val[0].name +
            val[1].name +
            (val[2] ? val[2].name : '') +
            (val[3] ? val[3].name : '')
    }

    edit () {
        const { name, type, birthday, email, wechatNumber, province, city, region, address, town, company, workPosition } = this.memberDetail
        this.addMemberDetailForm = { name, type, birthday, email, wechatNumber, province, city, region, address, town, company, workPosition }
        this.addressCode = [province, city, region, town]
        this.isEdit = true
    }

    // 保存备注用户信息
    async saveAddMemberDetail () {
        try {
            const params = { ...this.addMemberDetailForm }
            if (Number(params.type) === 2) {
                params.industry = ''
                params.workPosition = ''
                params.company = ''
            }
            params.mallUserId = this.userId
            await saveMemberInfo(params)
            this.isEdit = false
            await this.getMemberDetail()
        } catch (e) {
            throw e
        }
    }

    tabClick (data: DynamicObject) {
        this.tabName = data.name
        if (this.tabName === 'OrderList') {
            this.getOrderList()
        }
        if (this.tabName === 'ShareList') {
            this.getShareList()
        }
        if (this.tabName === 'LiveWatchList') {
            this.getLiveWatchList()
        }
        if (this.tabName === 'LineLearningList') {
            this.getLineLearningList()
        }
        if (this.tabName === 'RemarkList') {
            this.getRemarkList()
        }
    }

    // 购买记录
    orderListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        goodsType: '',
        orderStatus: '',
        helper: false,
        payStartTime: '',
        payEndTime: ''
    }

    orderListTimeRange = []
    orderList = []
    orderListTotal = 0
    async formatOrderListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.orderListForm.payStartTime = start
            this.orderListForm.payEndTime = end
            await this.searchOrderList()
        } catch (e) {
            throw e
        }
    }

    async orderListSizeChange (val: number) {
        try {
            this.orderListForm.current = 1
            this.orderListForm.size = val
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    async getOrderList () {
        try {
            this.orderListForm.mallUserId = this.userId
            const { result: { records, total } } = await getOrderList(this.orderListForm)
            this.orderList = records || []
            this.orderListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async searchOrderList () {
        try {
            this.orderListForm.current = 1
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    async resetOrderList () {
        try {
            this.orderListForm = {
                mallUserId: '',
                current: 1,
                size: 10,
                keyword: '',
                goodsType: '',
                orderStatus: '',
                helper: false,
                payStartTime: '',
                payEndTime: ''
            }
            this.orderListTimeRange = []
            await this.getOrderList()
        } catch (e) {
            throw e
        }
    }

    changeExportOrderList () {
        // todo
        console.log(1111)
    }

    // 分享记录
    shareListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        goodsType: '',
        orderStatus: '',
        helper: true,
        payStartTime: '',
        payEndTime: ''
    }

    shareListTimeRange = []
    shareList = []
    shareListTotal = 0
    async formatShareListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.shareListForm.payStartTime = start
            this.shareListForm.payEndTime = end
            await this.searchShareList()
        } catch (e) {
            throw e
        }
    }

    async shareListSizeChange (val: number) {
        try {
            this.orderListForm.current = 1
            this.orderListForm.size = val
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    async getShareList () {
        try {
            this.shareListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getOrderList(this.shareListForm)
            this.shareList = records || []
            this.shareListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async searchShareList () {
        try {
            this.shareListForm.current = 1
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    async resetShareList () {
        try {
            this.orderListForm = {
                mallUserId: '',
                current: 1,
                size: 10,
                keyword: '',
                goodsType: '',
                orderStatus: '',
                helper: true,
                payStartTime: '',
                payEndTime: ''
            }
            this.shareListTimeRange = []
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    changeExportShareList () {
        // todo
        console.log(1111)
    }

    // 直播观看记录
    liveWatchListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        liveMode: '',
        liveType: '',
        liveStartTime: '',
        liveEndTime: '',
        liveWatchStartTime: '',
        liveWatchEndTime: ''
    }

    liveWatchTimeRange = []
    liveWatchList = []
    liveWatchListTotal = 0
    async formatLiveWatchListTimeRange ({ start, end }: DynamicObject) {
        try {
            this.liveWatchListForm.liveWatchStartTime = start
            this.liveWatchListForm.liveWatchEndTime = end
            await this.searchLiveWatchList()
        } catch (e) {
            throw e
        }
    }

    async liveWatchListSizeChange (val: number) {
        try {
            this.liveWatchListForm.current = 1
            this.liveWatchListForm.size = val
            await this.getShareList()
        } catch (e) {
            throw e
        }
    }

    async getLiveWatchList () {
        try {
            this.liveWatchListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getLiveWatchList(this.liveWatchListForm)
            this.liveWatchList = records || []
            this.liveWatchListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async searchLiveWatchList () {
        try {
            this.liveWatchListForm.current = 1
            await this.getLiveWatchList()
        } catch (e) {
            throw e
        }
    }

    async resetLiveWatchList () {
        try {
            this.liveWatchListForm = {
                mallUserId: '',
                current: 1,
                size: 10,
                keyword: '',
                liveMode: '',
                liveType: '',
                liveStartTime: '',
                liveEndTime: '',
                liveWatchStartTime: '',
                liveWatchEndTime: ''
            }
            this.liveWatchTimeRange = []
            await this.getLiveWatchList()
        } catch (e) {
            throw e
        }
    }

    changeExportLiveWatchList () {
        // todo
        console.log(1111)
    }

    // 云课堂学习进度
    lineLearningListForm = {
        mallUserId: '',
        current: 1,
        size: 10,
        keyword: '',
        courseType: '',
        courseCategory: ''
    }

    lineLearningList = []
    lineLearningListTotal = 0

    // 查看学习进度
    showWatchDetailList = false
    selectedUserId = this.userId
    courseResourceId = ''

    async lineLearningListSizeChange (val: number) {
        try {
            this.lineLearningListForm.current = 1
            this.lineLearningListForm.size = val
            await this.getLineLearningList()
        } catch (e) {
            throw e
        }
    }

    async getLineLearningList () {
        try {
            this.lineLearningListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getLineLearningList(this.lineLearningListForm)
            this.lineLearningList = records || []
            this.lineLearningListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    watchDetail (row: DynamicObject) {
        this.showWatchDetailList = true
        this.courseResourceId = row.id
    }

    async searchLineLearningList () {
        try {
            this.lineLearningListForm.current = 1
            await this.getLineLearningList()
        } catch (e) {
            throw e
        }
    }

    async resetLineLearningList () {
        try {
            this.lineLearningListForm = {
                mallUserId: '',
                current: 1,
                size: 10,
                keyword: '',
                courseType: '',
                courseCategory: ''
            }
            await this.getLineLearningList()
        } catch (e) {
            throw e
        }
    }

    changeExportLineLearningList () {
        // todo
        console.log(1111)
    }

    // 备注
    showAddRemark = false
    addRemark () {
        this.showAddRemark = true
    }

    remarkListForm = {
        mallUserId: '',
        current: 1,
        size: 10
    }

    remarkList = []
    remarkListTotal = 0
    async remarkListSizeChange (val: number) {
        try {
            this.remarkListForm.current = 1
            this.remarkListForm.size = val
            await this.getRemarkList()
        } catch (e) {
            throw e
        }
    }

    async getRemarkList () {
        try {
            this.remarkListForm.mallUserId = this.userId
            const { result: { records, total } }: DynamicObject = await getRemarkList(this.remarkListForm)
            this.remarkList = records || []
            this.remarkListTotal = total || 0
        } catch (e) {
            throw e
        }
    }

    async deleteRemark (id: string) {
        try {
            await deleteRemark({ id })
            await this.getRemarkList()
            await this.getMemberDetail()
        } catch (e) {
            throw e
        }
    }
}
</script>

<style scoped lang="scss">
    .container {
        margin: 0 auto;
        padding: 44px 34px;
        >.title {
            margin-bottom: 40px;
        }

        .header {
            display: flex;
            .face {
                width: 88px;
                height: 88px;
                border-radius: 50%;
                object-fit: cover;
            }

            .intro {
                margin-left: 15px;
                .detail {
                    display: flex;
                    line-height: 18px;
                    .user-type {
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        border: 1px solid #F79F1A;
                        border-radius: 5px;
                        font-size: 12px;
                        font-family: Microsoft YaHei UI;
                        line-height: 15px;
                        text-align: center;
                        color: #F79F1A;
                    }
                    .name {
                        width: 76px;
                        margin: 0 6px;
                        @include elps-wrap(1);
                    }
                }
                .member-type {
                    margin-left: 24px;
                    font-size: 12px;
                    font-weight: 400;
                    color: #6FD79F;
                }
            }

            .info-list {
                display: grid;
                margin-left: 24px;
                min-width: 500px;
                grid-template-columns: repeat(2, 50%);
                grid-row-gap: 24px;
                font-size: 16px;
                .tag-list {
                    .tags {
                        padding: 0 13px;
                        font-size: 14px;
                        &:first-child {
                            margin-left: -20px!important;
                        }
                    }
                    >a {
                        color: #4F63FF;
                    }
                }
                .record {
                    grid-column: 1 / 2;
                    > .list {
                        vertical-align: text-top;
                        display: inline-block;
                        > p {
                            margin-bottom: 16px;
                        }
                    }
                }
            }
        }

        .remark-detail {
            .text {
                min-width: 600px;
                display: grid;
                grid-template-columns: repeat(3, 33.33%);
                grid-row-gap: 33px;
                .fill {
                    grid-column: 1 / 3;
                }
            }
        }

        .data-list {
            display: flex;
            margin: 20px 0 33px;
            > div {
                margin: 0 98px;
                > b {
                    display: block;
                    font-size: 48px;
                }
            }
        }

        .tab-detail{
            .no-data{
                margin: 60px 0;
            }
        }
    }
    .operate {
        color: #458bff !important;
    }
    .mb-10 {
        margin-bottom: 10px!important;
    }
    .mt-20 {
        margin-top: 20px;
    }
    .ml-20 {
        margin-left: 20px;
    }
    .mr-20 {
        margin-right: 20px!important;
    }
</style>00.
