<template>
    <div class="member-detail">
        <div class="container bg-white mt-20">
            <p class="title">用户基本信息</p>
            <div class="header">
                <img
                    slot="left"
                    class="face"
                    :src="memberDetail.avatarUrl"
                >
                <div class="intro">
                    <div class="detail">
                        <span class="user-type">{{ USER_TYPE[memberDetail.userType] }}</span>
                        <span
                            slot="right-top"
                            class="name"
                            v-text="memberDetail.nickName"
                        />
                        <template>
                            <pl-svg v-if="memberDetail.gender === 0" name="icon-women-be552" width="10" height="10" />
                            <pl-svg v-if="memberDetail.gender === 1" name="icon-man-8b747" width="10" height="10" />
                        </template>
                    </div>
                    <div
                        class="member-type"
                        v-text="ROLE[form.roleCode]"
                    />
                </div>
                <div class="info-list">
                    <Field
                        title="手机号："
                        :text="memberDetail.mobile"
                    />
                    <Field
                        title="姓名："
                        :text="memberDetail.realName"
                    />
                    <Field
                        title="地址："
                        :text="memberDetail.address"
                    />
                    <div class="tag-list">
                        <span>标签：</span>
                        <span class="tags" v-if="memberDetail.userTags && memberDetail.userTags.length">
                            <span v-for="item in memberDetail.userTags" :key="item">{{ item }}</span>
                        </span>
                        <a @click="showAddTagDialog = true">
                            编辑
                        </a>
                    </div>
                    <Field
                        title="来源："
                        :text="memberDetail.userSource"
                    />
                    <div class="record">
                        <span>记录：</span>
                        <div class="list" v-if="memberDetail.record && memberDetail.record.length">
                            <p v-for="item in memberDetail.record" :key="item">
                                {{ item }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container bg-white mt-20">
            <p class="title">
                备注用户信息
                <template v-if="!isEdit">
                    <el-button type="text" @click="isEdit = true">编辑</el-button>
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
                            <span>{{ memberDetail.userName }}</span>
                        </div>
                        <div>
                            <span>用户身份：</span>
                            <span>{{ USER_TYPE[memberDetail.userType] }}</span>
                        </div>
                        <div>
                            <span>年龄：</span>
                            <span>{{ memberDetail.userName }}</span>
                        </div>
                        <div>
                            <span>手机号码：</span>
                            <span>{{ memberDetail.mobile }}</span>
                        </div>
                        <div>
                            <span>生日：</span>
                            <span>{{ memberDetail.userName }}</span>
                        </div>
                        <div>
                            <span>性别：</span>
                            <span>{{ memberDetail.gender }}</span>
                        </div>
                        <div>
                            <span>微信号：</span>
                            <span>{{ memberDetail.userName }}</span>
                        </div>
                        <div>
                            <span>邮箱：</span>
                            <span>{{ memberDetail.userName }}</span>
                        </div>
                        <div class="fill">
                            <span>所在区域：</span>
                            <span>{{ memberDetail.userName }}</span>
                        </div>
                        <div class="fill">
                            <span>备注：</span>
                            <span>{{ memberDetail.userName }}</span>
                            <el-button type="text" @click="tabName = 'RemarkList'">查看更多</el-button>
                        </div>
                    </div>
                    <el-form
                        v-else
                        :inline="true"
                        class="border-bottom mb-20"
                    >
                        <el-form-item class="mb-10 mr-20" label="真实姓名：">
                            <el-input
                                clearable
                                placeholder="请输入真实姓名"
                                maxlength="8"
                                v-model="addMemberDetailForm.userName"
                            />
                        </el-form-item>
                        <el-form-item class="mb-10" label="用户身份：">
                            <el-radio-group class="mr-20" v-model="addMemberDetailForm.userType">
                                <el-radio :label="0">家长</el-radio>
                                <el-radio :label="1">学生</el-radio>
                                <el-radio :label="2">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item class="mb-10 mr-20" v-show="addMemberDetailForm.userType === 2">
                            <el-input
                                clearable
                                placeholder="请输入用户身份"
                                maxlength="8"
                                v-model="addMemberDetailForm.userTypeText"
                            />
                        </el-form-item>
                        <el-form-item label="生日：" class="mb-10 mr-20">
                            <el-date-picker
                                v-model="addMemberDetailForm.birthday"
                                type="date"
                                placeholder="选择生日日期" />
                        </el-form-item>
                        <el-form-item class="mb-10 mr-20" label="年龄：">
                            <el-input
                                clearable
                                type="number"
                                placeholder="请输入年龄"
                                v-model="addMemberDetailForm.age"
                            />
                        </el-form-item>
                        <el-form-item class="mb-10 mr-20" label="邮箱：">
                            <el-input
                                clearable
                                type="email"
                                placeholder="请输入邮箱"
                                v-model="addMemberDetailForm.email"
                            />
                        </el-form-item>
                        <el-form-item class="mb-10 mr-20" label="微信号：">
                            <el-input
                                clearable
                                type="email"
                                placeholder="请输入微信号"
                                v-model="addMemberDetailForm.weChat"
                            />
                        </el-form-item>
                        <el-form-item class="mb-10 mr-20" label="所在区域：">
                            <el-input
                                clearable
                                type="email"
                                placeholder="请输入微信号"
                                v-model="addMemberDetailForm.a"
                            />
                        </el-form-item>
                        <el-form-item
                            label="所在区域"
                            class="mb-10 mr-20"
                            prop="addressPrefix"
                        >
                            <CityPicker
                                @selected="selectedCity"
                                :default-value="addressCode"
                            />
                        </el-form-item>
                        <el-form-item
                            label="详细地址"
                            class="mb-10 mr-20"
                            prop="agencyAddress"
                        >
                            <el-input
                                v-model="addMemberDetailForm.agencyAddress"
                                placeholder="请输入详细地址"
                            />
                        </el-form-item>
                        <el-form-item class="mb-10 mr-20" label="备注：">
                            <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                clearable
                                v-model="addMemberDetailForm.remarkDetail"
                            />
                        </el-form-item>
                    </el-form>
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
                    <b>{{ memberData.order30DayCount }}</b>
                </div>
                <div>
                    累计自购订单量
                    <b>{{ memberData.selfOrderCount }}</b>
                </div>
                <div>
                    支付总额
                    <b>{{ memberData.totalAmount }}</b>
                </div>
                <div>
                    分享订单量
                    <b>{{ memberData.shareOrderCount }}</b>
                </div>
            </div>
            <pl-tabs :value="tabName" :tabs="Tab_List" @tabClick="tabClick" />
            <div class="tab-detail">
                <!--购买记录-->
                <template v-if="tabName === 'OrderList'">
                    <SearchBox>
                        <el-form
                            :inline="true"
                            class="border-bottom mb-20"
                        >
                            <el-form-item class="mb-10 mr-20" label="关键字：">
                                <el-input
                                    clearable
                                    style="width: 300px;"
                                    @change="searchOrderList"
                                    placeholder="请输入用户昵称/真实姓名/手机号"
                                    v-model="orderListForm.keyword"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="产品类型：">
                                <el-select
                                    v-model="orderListForm.orderType"
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
                            <el-form-item label="支付时间：" class="mb-10 mr-20">
                                <date-range
                                    style="width: 380px;"
                                    :init="[orderListForm.startTime, orderListForm.endTime]"
                                    @change="formatOrderListTimeRange"
                                    disable-after
                                    clearable
                                    ref="dateRange"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="订单状态：">
                                <el-select
                                    v-model="orderListForm.roleType"
                                    @change="searchOrderList"
                                    clearable
                                >
                                    <el-option :value="''" label="全部" />
                                    <el-option value="MEMBERSHIP" label="普通会员" />
                                    <el-option value="HELPER" label="Helper" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button
                                    type="primary"
                                    style="width:98px"
                                    @click="searchOrderList"
                                >
                                    查询
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10 mt-20 ml-20">
                                <el-button
                                    @click="changeExportOrderList"
                                    style="width: 98px;"
                                    type="primary"
                                    plain
                                    v-if="orderList && orderList.length"
                                >
                                    导出数据
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10">
                                <el-button type="text" @click="resetOrderList">清空筛选条件</el-button>
                            </el-form-item>
                        </el-form>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="orderList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <pl-svg name="icon-no-data-f423f" fill="#eee" width="136" height="89" />
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="userName"
                                label="订单号"
                            />
                            <el-table-column
                                prop="userName"
                                label="产品名称"
                            />
                            <el-table-column
                                prop="userName"
                                label="产品类型"
                            />
                            <el-table-column
                                prop="userName"
                                label="数量"
                            />
                            <el-table-column
                                prop="userName"
                                label="单价（元）"
                            />
                            <el-table-column
                                prop="userName"
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
                        <el-form
                            :inline="true"
                            class="border-bottom mb-20"
                        >
                            <el-form-item class="mb-10 mr-20" label="关键字：">
                                <el-input
                                    clearable
                                    style="width: 300px;"
                                    @change="searchShareList"
                                    placeholder="请输入订单号/商品名称/分享人"
                                    v-model="shareListForm.keyword"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="产品类型：">
                                <el-select
                                    v-model="shareListForm.orderType"
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
                            <el-form-item class="mb-10 mr-20" label="订单类型：">
                                <el-select
                                    v-model="orderListForm.orderType"
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
                            <el-form-item class="mb-10 mr-20" label="支付时间：">
                                <date-range
                                    style="width: 380px;"
                                    :init="[shareListForm.startTime, shareListForm.endTime]"
                                    @change="formatShareListTimeRange"
                                    disable-after
                                    clearable
                                    ref="dateRange"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button
                                    type="primary"
                                    style="width:98px"
                                    @click="searchShareList"
                                >
                                    查询
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button
                                    @click="changeExportShareList"
                                    style="width: 98px;"
                                    type="primary"
                                    plain
                                    v-if="orderList && orderList.length"
                                >
                                    导出数据
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10">
                                <el-button type="text" @click="resetShareList">清空筛选条件</el-button>
                            </el-form-item>
                        </el-form>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="orderList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <pl-svg name="icon-no-data-f423f" fill="#eee" width="136" height="89" />
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="userName"
                                label="订单号"
                            />
                            <el-table-column
                                prop="userName"
                                label="产品名称"
                            />
                            <el-table-column
                                prop="userName"
                                label="产品类型"
                            />
                            <el-table-column
                                prop="userName"
                                label="数量"
                            />
                            <el-table-column
                                prop="userName"
                                label="单价（元）"
                            />
                            <el-table-column
                                prop="userName"
                                label="实付款（元）"
                            />
                            <el-table-column
                                prop="userName"
                                label="分享人"
                            />
                            <el-table-column
                                prop="userName"
                                label="订单状态"
                            />
                            <el-table-column
                                prop="userName"
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
                        <el-form
                            :inline="true"
                            class="border-bottom mb-20"
                        >
                            <el-form-item class="mb-10 mr-20" label="关键字：">
                                <el-input
                                    clearable
                                    style="width: 300px;"
                                    @change="searchLiveWatchList"
                                    placeholder="请输入直播名称"
                                    v-model="liveWatchListForm.keyword"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="类型：">
                                <el-select
                                    v-model="liveWatchListForm.liveType"
                                    @change="searchLiveWatchList"
                                    clearable
                                >
                                    <el-option :value="''" label="全部" />
                                    <el-option :value="1" label="直播" />
                                    <el-option :value="2" label="录播" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="形式：">
                                <el-select
                                    v-model="liveWatchListForm.pattern"
                                    @change="searchLiveWatchList"
                                    clearable
                                >
                                    <el-option :value="''" label="全部" />
                                    <el-option :value="1" label="直播" />
                                    <el-option :value="2" label="录播" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="直播时间：">
                                <date-range
                                    style="width: 380px;"
                                    :init="[liveWatchListForm.startTime, liveWatchListForm.endTime]"
                                    @change="formatShareListTimeRange"
                                    disable-after
                                    clearable
                                    ref="dateRange"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button
                                    type="primary"
                                    style="width:98px"
                                    @click="searchLiveWatchList"
                                >
                                    查询
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button
                                    @click="changeExportLiveWatchList"
                                    style="width: 98px;"
                                    type="primary"
                                    plain
                                    v-if="liveWatchList && liveWatchList.length"
                                >
                                    导出数据
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button type="text" @click="resetLiveWatchList">清空筛选条件</el-button>
                            </el-form-item>
                        </el-form>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="liveWatchList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <pl-svg name="icon-no-data-f423f" fill="#eee" width="136" height="89" />
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="userName"
                                label="直播时间"
                            />
                            <el-table-column
                                prop="userName"
                                label="直播信息"
                            />
                            <el-table-column
                                prop="userName"
                                label="形式"
                            />
                            <el-table-column
                                prop="userName"
                                label="类型"
                            />
                            <el-table-column
                                prop="userName"
                                label="实付款（元）"
                            />
                            <el-table-column
                                prop="userName"
                                label="支付优惠"
                            />
                            <el-table-column
                                prop="userName"
                                label="分享人"
                            />
                            <el-table-column
                                prop="userName"
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
                        <el-form
                            :inline="true"
                            class="border-bottom mb-20"
                        >
                            <el-form-item class="mb-10 mr-20" label="关键字：">
                                <el-input
                                    clearable
                                    style="width: 300px;"
                                    @change="searchLineLearningList"
                                    placeholder="请输入课程名称"
                                    v-model="lineLearningListForm.keyword"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="类型：">
                                <el-select
                                    v-model="lineLearningListForm.type"
                                    @change="searchLineLearningList"
                                    clearable
                                >
                                    <el-option :value="''" label="全部" />
                                    <el-option :value="1" label="视频单课" />
                                    <el-option :value="2" label="系列课" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20" label="分类：">
                                <el-select
                                    v-model="lineLearningListForm.classifyId"
                                    @change="searchLineLearningList"
                                    clearable
                                >
                                    <el-option :value="''" label="全部" />
                                    <el-option :value="1" label="直播" />
                                    <el-option :value="2" label="录播" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="首次观看时间：" class="mb-10 mr-20">
                                <date-range
                                    style="width: 380px;"
                                    :init="[lineLearningListForm.startTime, lineLearningListForm.endTime]"
                                    @change="formatLineLearningListTimeRange"
                                    disable-after
                                    clearable
                                    ref="dateRange"
                                />
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button
                                    type="primary"
                                    style="width:98px"
                                    @click="searchLineLearningList"
                                >
                                    查询
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10 mr-20">
                                <el-button
                                    @click="changeExportLineLearningList"
                                    style="width: 98px;"
                                    type="primary"
                                    plain
                                    v-if="lineLearningList && lineLearningList.length"
                                >
                                    导出数据
                                </el-button>
                            </el-form-item>
                            <el-form-item class="mb-10">
                                <el-button type="text" @click="resetLineLearningList">清空筛选条件</el-button>
                            </el-form-item>
                        </el-form>
                    </SearchBox>
                    <div class="list">
                        <el-table
                            :data="liveWatchList"
                            class="table-customer"
                            style="width: 100%"
                        >
                            <template slot="empty">
                                <div class="no-data">
                                    <pl-svg name="icon-no-data-f423f" fill="#eee" width="136" height="89" />
                                    <p>请点击查询，查看用户更多数据~</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="userName"
                                label="课程名称"
                            />
                            <el-table-column
                                prop="userName"
                                label="类型"
                            />
                            <el-table-column
                                prop="userName"
                                label="分类"
                            />
                            <el-table-column
                                prop="userName"
                                label="学习状态"
                            />
                            <el-table-column
                                prop="userName"
                                label="首次观看时间"
                            />
                            <el-table-column
                                prop="userName"
                                label="消耗流量"
                            />
                            <el-table-column
                                prop="userName"
                                label="分享人"
                            />
                            <el-table-column
                                prop="userName"
                                label="首次观看时间"
                            />
                            <el-table-column
                                fixed="right"
                                label="学习进度"
                            >
                                <template #default="{row}">
                                    <div class="operate">
                                        <a @click="showWatchDetailList = true; courseResourceId = row.id">
                                            查看
                                        </a>
                                    </div>
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
                                    <pl-svg name="icon-no-data-f423f" fill="#eee" width="136" height="89" />
                                    <p>该会员还没有备注哦</p>
                                </div>
                            </template>
                            <el-table-column
                                prop="userName"
                                label="备注内容"
                            />
                            <el-table-column
                                prop="userName"
                                label="添加时间"
                            />
                            <el-table-column
                                prop="userName"
                                label="添加人"
                            />
                            <el-table-column
                                fixed="right"
                                label="操作"
                            >
                                <template>
                                    <div class="operate">
                                        <a @click="$router.push({ name: 'MemberManageDetail'})">
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
                   :user-id="selectedUserId"
        />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Pagination from '../../../../components/common/Pagination'

import Field from '../../../../components/common/Field.vue'
import CityPicker from '../../../../components/common/City-Picker'
import AddTags from '../components/Add-Tags'
import WatchDetailList from '../components/Watch-Detail-List'
import AddRemark from '../components/Add-Remark'

import { getMemberDetail, getOrderList } from '../../../../apis/member'

  @Component({
      components: {
          AddTags,
          Field,
          CityPicker,
          Pagination,
          WatchDetailList,
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
        1: '家',
        2: '学',
        3: '其'
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

    // 请求用户数据参数
    form = {
        roleCode: '',
        mallUserId: ''
    }

    // 用户数据
    memberDetail = {}

    // 是否显示添加标签弹框
    showAddTagDialog = false

    // 是否编辑用户备注信息
    isEdit = false

    // 用户行为数据统计
    memberData = {
        order30DayCount: 1223,
        selfOrderCount: 89,
        totalAmount: 6565,
        shareOrderCount: 5545
    }

    // 当前所在的tab页
    tabName = this.Tab_List[0].name

    // 生命周期函数
    async created () {
        const { roleCode, id } = this.$route.params
        this.from = this.$route.query.from
        this.form.mallUserId = id
        this.form.roleCode = roleCode
        await this.getMemberDetail()
    }

    // methods
    async getMemberDetail () {
        try {
            const { data: res } = await getMemberDetail(this.form)
            if (res.result && res.result.idCard) {
                res.result.idCard = res.result.idCard.replace(/^(\d{4})\d{9}(\d+)/, '$1*********$2')
            }
            this.memberDetail = res.result || {}
        } catch (e) {
            throw e
        }
    }

    addressCode = []
    addMemberDetailForm = {
        userName: ''
    }

    selectedCity (val) {
        const form = this.addMemberDetailForm
        form.province = val[0].code
        form.city = val[1].code
        form.region = val[2] ? val[2].code : ''
        form.town = val[3] ? val[3].code : ''
        form.addressPrefix = val[0].name +
        val[1].name +
        (val[2] ? val[2].name : '') +
        (val[3] ? val[3].name : '')
    }

    // 保存备注用户信息
    async saveAddMemberDetail () {
        try {
            await this.getMemberDetail()
        } catch (e) {
            throw e
        }
    }

    tabClick (data) {
        this.tabName = data.name
        if (this.tabName === 'RemarkList') {
            this.getRemarkList()
        }
    }

    // 购买记录
    orderListForm = {
        current: 1,
        size: 10,
        keyword: '',
        orderType: '',
        startTime: '',
        endTime: '',
        roleType: ''
    }

    orderList = []
    orderListTotal = 0
    async formatOrderListTimeRange ({ start, end }) {
        try {
            this.orderListForm.startTime = start
            this.orderListForm.endTime = end
            await this.searchOrderList()
        } catch (e) {
            throw e
        }
    }

    async orderListSizeChange (val) {
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
            const { data: { result } } = await getOrderList(this.orderListForm)
            this.orderList = result.records || []
            this.orderListTotal = result.total || []
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
                current: 1,
                size: 10,
                keyword: '',
                orderType: '',
                startTime: '',
                endTime: '',
                roleType: ''
            }
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
        current: 1,
        size: 10,
        keyword: '',
        orderType: '',
        startTime: '',
        endTime: ''
    }

    shareList = []
    shareListTotal = 0
    async formatShareListTimeRange ({ start, end }) {
        try {
            this.shareListForm.startTime = start
            this.shareListForm.endTime = end
            await this.searchShareList()
        } catch (e) {
            throw e
        }
    }

    async shareListSizeChange (val) {
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
            const { data: { result } } = await getOrderList(this.shareListForm)
            this.shareList = result.records || []
            this.shareListTotal = result.total || []
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
                current: 1,
                size: 10,
                keyword: '',
                orderType: '',
                startTime: '',
                endTime: '',
                roleType: ''
            }
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
        current: 1,
        size: 10,
        keyword: '',
        liveType: '',
        pattern: '',
        startTime: '',
        endTime: ''
    }

    liveWatchList = []
    liveWatchListTotal = 0
    async formatLiveWatchListTimeRange ({ start, end }) {
        try {
            this.liveWatchListForm.startTime = start
            this.liveWatchListForm.endTime = end
            await this.searchLiveWatchList()
        } catch (e) {
            throw e
        }
    }

    async liveWatchListSizeChange (val) {
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
            const { data: { result } } = await getOrderList(this.shareListForm)
            this.liveWatchList = result.records || []
            this.liveWatchListTotal = result.total || []
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
                current: 1,
                size: 10,
                keyword: '',
                liveType: '',
                pattern: '',
                startTime: '',
                endTime: ''
            }
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
        current: 1,
        size: 10,
        keyword: '',
        type: '',
        classifyId: '',
        startTime: '',
        endTime: ''
    }

    lineLearningList = []
    lineLearningListTotal = 0

    // 查看学习进度
    showWatchDetailList = false
    selectedUserId = this.form.mallUserId
    courseResourceId = ''
    async formatLineLearningListTimeRange ({ start, end }) {
        try {
            this.lineLearningListForm.startTime = start
            this.lineLearningListForm.endTime = end
            await this.searchLineLearningList()
        } catch (e) {
            throw e
        }
    }

    async lineLearningListSizeChange (val) {
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
            const { data: { result } } = await getOrderList(this.shareListForm)
            this.lineLearningList = result.records || []
            this.lineLearningListTotal = result.total || []
        } catch (e) {
            throw e
        }
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
                current: 1,
                size: 10,
                keyword: '',
                liveType: '',
                pattern: '',
                startTime: '',
                endTime: ''
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
        current: 1,
        size: 10
    }

    remarkList = []
    remarkListTotal = 0
    async remarkListSizeChange (val) {
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
            const { data: { result } } = await getOrderList(this.shareListForm)
            this.remarkList = result.records || []
            this.remarkListTotal = result.total || []
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
                        border-left: 1px solid;
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
