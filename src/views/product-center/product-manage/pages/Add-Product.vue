<template>
    <div class="add-product">
        <div class="add-content">
            <div class="content-title" id="basic" ref="basic">
                基本信息
            </div>
            <el-form
                label-width="150px"
                :model="form"
                :rules="rules"
                label-position="left"
                class="main-form"
            >
                <el-form-item label="课程类型" prop="productType">
                    <el-radio v-model="form.productType" label="PHYSICAL_GOODS" border class="pro-type el-icon-check">
                        实体商品
                    </el-radio>
                    <el-tooltip class="item" effect="dark" content="可添加需物流配送的相关商品，例如书籍，衣物，礼品等实体商品。" placement="bottom">
                        <i class="pro-type-intro el-icon-warning-outline fz-18" style="color: #333;" />
                    </el-tooltip>
                    <el-radio v-model="form.productType" label="VIRTUAL_GOODS" border class="pro-type el-icon-check">
                        虚拟商品
                    </el-radio>
                    <el-tooltip class="item" effect="dark" content="可添加无需物流配送服务，线上购买，线下提供服务的相关商品，例如线路，门票等虚拟商品。 " placement="bottom">
                        <i class="pro-type-intro el-icon-warning-outline fz-18" style="color: #333;" />
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="商品名称" prop="productName" id="productName">
                    <el-input style="width: 320px" v-model="form.productName" maxlength="50" placeholder="请输入商品名称" />
                    <span style="margin-left: 20px;color: #999999; font-size: 14px;">商品名称为50个汉字</span>
                </el-form-item>

                <el-form-item label="上传商品图片" prop="productMainImage" id="productMainImage">
                    <div class="flex">
                        <UploadVideo
                            ref="UploadVideo"
                            v-model="videoList"
                            :count="1"
                            :size="20"
                            :box-width="100"
                            :box-height="67"
                            :show-selector="false"
                            :class="videoList.length ? 'mr-20' : ''"
                            :delete-truth="!id"
                        />
                        <UploadImage
                            ref="UploadImage"
                            v-model="imageList"
                            :show-selector="false"
                            :width="750"
                            :height="500"
                            :box-width="100"
                            :box-height="67"
                            :size="2"
                            :count="10 - videoList.length"
                            :delete-truth="!id"
                        />
                        <FileSelector
                            :box-width="100"
                            :box-height="67"
                            :margin-left="videoList.length + imageList.length ? 20 : 0"
                            accept="image/jpg, image/jpeg, image/png, image/bmp, video/mp4, video/webm, video/ogg"
                            @change="fileSelectorChange"
                            upload-text="上传视频/图片"
                            multiple
                            v-if="videoList.length + imageList.length < 10"
                        />
                    </div>

                    <p style="font-size: 12px; color: #999;line-height: 24px">
                        *长按拖拽图片可进行排序
                    </p>
                    <p style="font-size: 14px; color: #999;line-height: 20px">
                        支持上传一个视频且大小不超过20M，显示位置为第一位；<br>
                        支持.jpg .jpeg .png .bmp 格式的图片，建议尺寸为750*500，图片最大不能超过2M；最多可上传10张图片；第一张图片为商品封面图片。
                    </p>
                    <MainImageTheme
                        v-if="imageList.length"
                        @confirm="themeConfirmHandler"
                        @cancel="themeConfirmHandler"
                        :product-image="imageList"
                        :sku="form.productSkuModels"
                        :default-theme="form.themeModel"
                        :product-main-image="form.productMainImage"
                        ref="MainImageTheme"
                    />
                </el-form-item>

                <el-form-item label="商品描述" prop="productDesc" id="productDesc">
                    <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="form.productDesc"
                        maxlength="50"
                        style="width: 420px;"
                        :rows="5"
                        resize="none"
                        show-word-limit
                    />
                    <div class="font-12c">
                        商品分享给好友时展示的描述语，建议50个字以内；
                        <el-button
                            type="text"
                            style="color: #007bff;"
                            @click="showDescriptionDialog = true"
                        >
                            查看示例
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item label="商品标签" class="product-label">
                    <div class="product-label__list">
                        <Draggable
                            style="display: inline-block"
                            :list="productTags"
                            animation="200"
                            ghost-class="ghost"
                            @start="dragging=true"
                            @end="dragging=false"
                        >
                            <span
                                class="product-label__item"
                                v-for="(item, index) of productTags"
                                :key="index"
                            >
                                {{ item.labelName }}
                                <pl-svg class="icon-close" name="icon-close" width="12" @click.stop="removeTag(index)" />
                            </span>
                        </Draggable>
                        <el-button class="product-label__button el-icon-plus" @click="showLabelDialog = true">
                            新增标签
                        </el-button>
                        <span>（标签排序按照选择标签的前后顺序进行展示）</span>
                    </div>
                    <p class="product-label__suggestion">
                        最多可选择4个标签
                    </p>
                </el-form-item>

                <el-form-item label="商品分类" prop="categoryId" id="categoryId">
                    <SelectCategory
                        v-model="classification"
                        show-add
                    />
                </el-form-item>
                <div class="content-title" id="price" ref="price">
                    价格库存
                </div>
                <el-form-item label="商品规格" prop="productSkuModels" id="productSkuModels">
                    <div class="sku-btn">
                        <el-button
                            type="primary"
                            plain
                            style="margin-right: 20px;"
                            @click="addSkuList"
                            :disabled="form.productAttributes.length > 1"
                        >
                            添加新规格
                        </el-button>
                        <span>最多可以添加2个商品规格</span>
                        <el-button
                            type="text"
                            style="margin-left: 10px; color: #007bff;"
                            @click="showSkuSampleDialog = true"
                        >
                            查看示例
                        </el-button>
                    </div>
                    <SkuTable
                        :create-data="form.productAttributes"
                        :edit-data="form.productSkuModels"
                        :product-type="form.productType"
                        @editSku="editSkuTable"
                        @delSku="delSkuTable"
                        v-if="form.productAttributes.length && form.productSkuModels.length"
                    />
                </el-form-item>
                <div class="content-title" id="logistics" ref="logistics" v-if="form.productType === 'PHYSICAL_GOODS'">
                    物流信息
                </div>

                <el-form-item label="物流方式" prop="logisticsType" id="logisticsType" v-if="form.productType === 'PHYSICAL_GOODS'">
                    <el-radio-group v-model="logisticsType">
                        <el-radio :label="1" name="普通快递">
                            普通快递
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="运费模板" prop="shippingTemplateId" id="shippingTemplateId" v-if="form.productType === 'PHYSICAL_GOODS'">
                    <el-select placeholder="请选择运费模板" v-model="form.shippingTemplateId">
                        <el-option
                            v-for="(item, index) of templateList"
                            :key="index"
                            :label="item.templateName"
                            :value="item.id"
                        />
                    </el-select>
                    <el-button
                        type="text"
                        class="text-underline"
                        style="color: #007bff; margin-left: 20px;"
                        @click="templateDetailShow(form.shippingTemplateId)"
                        v-if="form.shippingTemplateId"
                    >
                        预览运费模板
                    </el-button>
                </el-form-item>

                <div class="content-title" id="other" ref="other">
                    其他信息
                </div>

                <el-form-item label="限购" label-width="170px" prop="purchaseLimit" id="purchaseLimit">
                    <div>
                        <el-checkbox v-model="form.purchaseLimit" :true-label="1" :false-label="0">
                            限制每人的购买数量
                        </el-checkbox>
                    </div>
                    <div v-if="form.purchaseLimit">
                        <span style="font-size: 16px; color: #666; margin-right: 10px;">每个账号可购买的数量为</span>
                        <el-input :type="'number'" v-model="form.purchaseQuantity" @blur="purchaseQuantityChange()" :disabled="!form.purchaseLimit" style="width: 136px;" />
                    </div>
                </el-form-item>

                <el-form-item label="是否显示品宣入口" label-width="170px">
                    <el-checkbox v-model="form.showBranding" :true-label="1" :false-label="0" @change="selectPingXuan">
                        显示品宣
                    </el-checkbox>
                    <span class="purchase-sort-description"> （勾选，则在详情页显示品宣内容，点击可查看品宣）</span>
                </el-form-item>

                <el-form-item label="是否参与排序" label-width="170px">
                    <el-checkbox v-model="form.participateSort" :true-label="1" :false-label="0">
                        参与商品排序
                    </el-checkbox>
                    <span class="purchase-sort-description"> (勾选，则该商品参与首页任何模块的排序展示)</span>
                </el-form-item>

                <el-form-item label="退款服务" label-width="170px" prop="supportRefund">
                    <div>
                        <el-checkbox v-model="form.supportRefund" :true-label="1" :false-label="0">
                            支持{{ form.productType === 'PHYSICAL_GOODS'?'退货':'退款' }}服务
                        </el-checkbox>
                        <span class="purchase-sort-description"> (勾选，则该商品支持退款服务)</span>
                    </div>
                </el-form-item>

                <el-form-item v-if="form.supportRefund && form.productType === 'PHYSICAL_GOODS'" label-width="170px" id="supportRefund">
                    <el-select
                        placeholder="请选择退货地址"
                        v-model="form.afterSalesAddress"
                        :disabled="!form.supportRefund"
                        style="width: 300px;"
                    >
                        <el-option
                            v-for="(item, index) in returnAddressList"
                            :key="index"
                            :label="`${item.addressPrefix}${item.agencyAddress}`"
                            :value="item.sequenceNbr"
                        />
                    </el-select>
                    <el-button type="text" class="text-underline" style="color: #007bff; margin-left: 20px;" @click="showAddAddress = true">
                        新建
                    </el-button>
                </el-form-item>

                <el-form-item label="发票服务" label-width="170px">
                    <div>
                        <el-checkbox v-model="form.showInvoice" :true-label="1" :false-label="0">
                            支持开具发票
                        </el-checkbox>
                        <span class="purchase-sort-description"> (勾选，则商品程支持发票服务)</span>
                    </div>
                </el-form-item>

                <el-form-item label="学员信息" v-if="form.productType === 'VIRTUAL_GOODS'" label-width="170px" id="needStudentInfo">
                    <div>
                        <el-checkbox v-model="form.needStudentInfo" :true-label="1" :false-label="0">
                            获取学员信息
                        </el-checkbox>
                        <span class="purchase-sort-description"> (勾选，则选择学员信息时，需填写已设置的学员信息)</span>
                    </div>
                    <div v-if="form.needStudentInfo">
                        <el-radio-group class="mt-10" v-model="customFormType" @change="studentFormChange">
                            <el-radio :label="0">
                                指定学员信息
                            </el-radio>
                            <el-radio :label="1">
                                自定义报名表单
                            </el-radio>
                        </el-radio-group>
                        <div v-if="!customFormType">
                            <div class="purchase-sort-description">
                                用户购买时，可直接在学员列表中选择添加学员信息
                            </div>
                            <div class="specify-student">
                                <div>
                                    <span>
                                        学员姓名
                                    </span>
                                    <el-checkbox checked disabled>
                                        必填
                                    </el-checkbox>
                                </div>
                                <div>
                                    <span>
                                        电话
                                    </span>
                                    <el-checkbox checked disabled>
                                        必填
                                    </el-checkbox>
                                </div>
                            </div>
                        </div>
                        <div v-if="customFormType">
                            <div class="tabel-box" v-if="studentInfoModels.length">
                                <div class="head-title">
                                    <div class="custom-name">
                                        填写内容
                                    </div>
                                    <div class="custom-num">
                                        是否必填
                                    </div>
                                    <div class="custom-button">
                                        操作
                                    </div>
                                </div>
                                <div class="head-title tabel-content" v-for="(item,index) of studentInfoModels" :key="index">
                                    <div class="custom-name">
                                        <el-input style="width: 200px" v-model="item.fieldName" @blur="customValue($event,item)" maxlength="10" placeholder="请输入10字单文本标题" />
                                    </div>
                                    <div class="custom-num">
                                        <el-checkbox v-model="item.required" :true-label="1" :false-label="0">
                                            必填
                                        </el-checkbox>
                                    </div>
                                    <div class="custom-button">
                                        <el-button type="text" @click="deleteStudentInfo(index)">
                                            移除
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                            <el-button @click="addStudentInfo()" type="text" class="custom-add">
                                +新增自定义表单
                            </el-button>
                            <span class="purchase-sort-description"> (至多可添加6个自定义表单信息)</span>
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="定时开售" label-width="170px" prop="shoppingStatus" id="shoppingStatus">
                    <div>
                        <el-checkbox v-model="form.shoppingStatus" :true-label="1" :false-label="0">
                            设置上架商品的开始售卖时间
                        </el-checkbox>
                        <span class="purchase-sort-description"> (设置开售时间后，未到开售时间，商品仅可展示，不可购买)</span>
                    </div>
                    <div v-if="form.shoppingStatus">
                        <el-date-picker
                            v-model="form.shoppingTime"
                            type="datetime"
                            placeholder="请选择售卖的开始时间"
                            :editable="false"
                        />
                    </div>
                </el-form-item>

                <el-form-item label="商品隐藏" label-width="170px" prop="isShow" id="isShow">
                    <el-checkbox v-model="form.isShow" :true-label="0" :false-label="1">
                        上架的商品设置隐藏后，在店铺内不显示，但可以通过链接的方式访问
                    </el-checkbox>
                </el-form-item>

                <el-form-item label="自定义表单" label-width="170px" v-if="form.productType === 'PHYSICAL_GOODS'">
                    <div>
                        <el-checkbox v-model="customFormStatus" @change="customFormChange" :true-label="1" :false-label="0">
                            开启设置自定义备注信息
                        </el-checkbox>
                        <span class="purchase-sort-description"> (勾选后，用户购买商品时，在确定订单时需要填写相应的自定义信息)</span>
                    </div>
                    <div v-if="customFormStatus">
                        <div class="tabel-box" v-if="customFormModels.length">
                            <div class="head-title">
                                <div class="custom-name">
                                    填写内容
                                </div>
                                <div class="custom-num">
                                    是否必填
                                </div>
                                <div class="custom-button">
                                    操作
                                </div>
                            </div>
                            <div class="head-title tabel-content" v-for="(item,index) of customFormModels" :key="index">
                                <div class="custom-name">
                                    <el-input style="width: 200px" v-model="item.fieldName" @blur="customValue($event,item)" maxlength="10" placeholder="请输入10字单文本标题" />
                                </div>
                                <div class="custom-num">
                                    <el-checkbox v-model="item.required" :true-label="1" :false-label="0">
                                        必填
                                    </el-checkbox>
                                </div>
                                <div class="custom-button">
                                    <el-button type="text" @click="deleteCustom(index)">
                                        移除
                                    </el-button>
                                </div>
                            </div>
                        </div>
                        <el-button @click="addCustom()" type="text" class="custom-add">
                            +新增自定义表单
                        </el-button>
                        <span class="purchase-sort-description"> (至多可添加6个自定义表单信息)</span>
                    </div>
                </el-form-item>

                <div class="content-title" ref="detail">
                    商品详情
                </div>

                <el-form-item v-if="form.productType === 'VIRTUAL_GOODS'">
                    <span slot="label" style="display: flex">
                        <span>使用有效期</span>
                        <el-tooltip class="item" effect="dark" placement="bottom">
                            <div slot="content">
                                商品核销使用有效期，不填写则默认<br>
                                长期有效，选择开始时间不可早于当<br>
                                当前时间；<br>
                                商品核销时间截止时，商品默认下架；<br>
                                如下架后修改时间再次上架，原购买数<br>
                                据时间以修改前为准，新数据以新的为<br>
                                准。</div>
                            <i class="pro-type-intro-time el-icon-warning-outline fz-18" style="color: #333;" />
                        </el-tooltip>
                    </span>
                    <el-date-picker
                        v-model="daterange"
                        type="daterange"
                        align="right"
                        start-placeholder="使用开始时间"
                        end-placeholder="使用结束时间"
                        :picker-options="startPickerOptions"
                        format="yyyy.MM.dd"
                        range-separator="至"
                        :editable="false"
                        @change="handleChangeDate"
                    />
                    <span class="ml-20">
                        <el-radio v-model="effectiveTime" :label="1" @change="handelChangeTime">
                            永久有效
                        </el-radio>
                    </span>
                </el-form-item>

                <el-form-item label="使用须知" prop="useDesc" id="useDesc" v-if="form.productType === 'VIRTUAL_GOODS'">
                    <div class="flex">
                        <el-input
                            type="textarea"
                            placeholder="请输入使用须知的内容"
                            v-model="form.useDesc"
                            maxlength="200"
                            style="width: 420px;"
                            :rows="6"
                            resize="none"
                            show-word-limit
                        />
                        <el-button
                            type="text"
                            style="color: #007bff;padding-top: 0;height: 22px;padding-left: 10px;"
                            @click="showUseDescDialog = true"
                        >
                            查看示例
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="编辑详情" prop="detail" id="detail">
                    <PlEditor v-model="form.detail" />
                </el-form-item>
            </el-form>
            <div class="btn-box">
                <el-button :loading="loading" size="mini" plain style="width: 90px;margin-left: 20px" @click="saveAndOnline">
                    保存
                </el-button>
                <el-button :loading="loading" size="mini" type="primary" plain @click="saveAndAdd">
                    保存并新增
                </el-button>
                <el-button :loading="loading" size="mini" type="primary" plain @click="saveAndOnline('online')">
                    保存并上架
                </el-button>
                <div class="btn-description">
                    <div>
                        保存后的商品，不上架到商铺中展示，可在已下架的商品列表中查看；
                    </div>
                    <div>
                        保存并上架的商品，会直接在商铺中展示售卖，并可在出售中的商品列表中查看；
                    </div>
                </div>
            </div>
        </div>
        <point :activities="activities" @saveDraft="saveDraft" :show-draft="showDraft" />
        <ShippingTemplate :template-detail="templateDetail" :show.sync="showShippingTemplate" />
        <!-- 库存规格-->
        <AddSku
            :show.sync="showSkuDialog"
            :create-type.sync="skuModifyType"
            :create-data="form.productAttributes"
            :edit-data="form.productSkuModels"
            @createSku="setSkuTable"
            ref="AddSku"
        />
        <!-- 添加标签 -->
        <AddTags
            :show.sync="showLabelDialog"
            :tags="productTags"
            @confirm="addTagConfirm"
        />
        <!-- 新建地址 -->
        <NewAddress :show.sync="showAddAddress" :address-type="'ShippingAddress'" @refreshList="getReturnAddress()" />

        <el-dialog
            class="description-dialog"
            title="查看示例"
            :visible.sync="showDescriptionDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="770px"
        >
            <div class="description-dialog-box">
                <div>
                    <span>展示途径一：</span>
                    <div>将商品通过微信分享给朋友或分享到朋友圈时，商品描述中填写的内容会展示在商品名称下面。</div>
                    <span>转发微信好友：</span>
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/add-product-example/product/description1.jpg">
                </div>
                <div>
                    <span>展示途径二：</span>
                    <div>商品详情页中，该处的商品描述将在商品名称下方展示。</div>
                    <span>商品详情页：</span>
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/add-product-example/product/description2.jpg">
                </div>
            </div>
            <el-button
                type="primary"
                @click="showDescriptionDialog = false"
            >
                我知道了
            </el-button>
        </el-dialog>

        <el-dialog
            class="description-dialog"
            title="使用须知模板内容"
            :visible.sync="showUseDescDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="770px"
        >
            <div class="useDesc-dialog-box">
                <p>
                    1、商品预订成成功后，会为您生成一个订单核销二维码，请您妥善保存；
                </p>
                <p>
                    2、您可进入登录商城，进入我的订单管理中查看订单核销二维码；
                </p>
                <p>
                    3、当您确认要使用时，请联系商家或到店和商家确认使用时间，并给商家出示订单二维码，以便于商家快速核销您的订单信息；
                </p>
                <p>
                    4、您也可记录核销码信息，或查看订单详情，当面告知商家核销码信息，方便商家进行核销和信息确认；
                </p>
                <p>
                    5、订单核销码如果商家有限定有效期，请您在有效期内联系商家进行核销，过期核销码将作废，无法进行正常核销，您可及时联系商家协商。
                </p>
            </div>
            <el-button
                type="primary"
                @click="showUseDescDialog = false"
            >
                我知道了
            </el-button>
        </el-dialog>

        <el-dialog
            class="sku-dialog"
            title="添加规格步骤"
            :visible.sync="showSkuSampleDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="770px"
        >
            <div class="sku-dialog-box">
                <div>
                    <span>第一步：新增和修改规格名称</span>
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/add-product-example/product/sku-sample-1.png">
                </div>
                <div>
                    <span>第二步：设置规格值，支持新增，编辑和删除</span>
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/add-product-example/product/sku-sample-2.png">
                    <i>保存后，根据规格值设置的内容，进行表格的自动调整和展示</i>
                </div>
                <div>
                    <span>第三步：输入不同规格的实际售价、原价、库</span>
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/add-product-example/product/sku-sample-3.png">
                </div>
                <div>
                    <span>第四步：支持批量输入价格库存等信息</span>
                    <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/add-product-example/product/sku-sample-4.png">
                </div>
            </div>
            <el-button
                type="primary"
                @click="showSkuSampleDialog = false"
            >
                我知道了
            </el-button>
        </el-dialog>

        <el-dialog
            class="draft-upperLimit"
            :visible.sync="draftUpperLimit"
            :show-close="false"
            width="440px"
        >
            <div class="draft-upperLimit-box">
                <div class="content-text">
                    草稿箱50条已满，继续保存，会将较早的草稿 内容删除，确定要保存草稿吗？
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="draftUpperLimit = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="saveDrafeRequest()"
                >替 换</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    getTemplateDetail,
    getProductTemplate,
    addGoods,
    createSku,
    updateGoodsStatus,
    getSingleGoods,
    isAllowSave,
    createDraft,
    modifyDraft,
    modifyGoods
    // updateLabel,
    // deleteLabel
} from '../../../../apis/product-center/goods'
import { getPingXuan } from '../../../../apis/mall'
import PlEditor from '../../../../components/common/Pl-Editor.vue'
import UploadImage from '../../../../components/common/file/Image-Manager.vue'
import UploadVideo from '../../../../components/common/file/Video-Manager.vue'
import FileSelector from '../../../../components/common/file/File-Selector.vue'
import point from '../../../../components/product-center/goods/Point.vue'
import ShippingTemplate from '../../../../components/product-center/goods/Shipping-Template'
import NewAddress from '../../../../components/base-setting/logistics-manage/New-address.vue'
import AddTags from '../../../../components/product-center/goods/Add-Tags.vue'
import AddSku from '../../../../components/product-center/goods/Add-Sku.vue'
import SkuTable from '../../../../components/product-center/goods/Sku-Table.vue'
import SelectCategory from '../../../../components/product-center/category-manage/Select-Category.vue'
import Draggable from '../../../../components/common/draggable'
import MainImageTheme from '../../../../components/product-center/goods/Main-Image-Theme.vue'
import { mapGetters, mapActions } from 'vuex'
import { GET_RETURN_ADDRESS } from '../../../../store/mutation-type'
import { deleteImage } from '../../../../assets/ts/upload'
import moment from 'moment'
export default {
    name: 'AddProduct',
    components: {
        PlEditor,
        UploadImage,
        point,
        ShippingTemplate,
        NewAddress,
        AddTags,
        AddSku,
        SkuTable,
        Draggable,
        UploadVideo,
        FileSelector,
        MainImageTheme,
        SelectCategory
    },
    data () {
        return {
            loading: false,
            videoList: [],
            imageList: [],
            form: {
                // C 端商品显示隐藏 0 隐藏 1 显示
                isShow: 1,
                // 商品类型
                productType: 'PHYSICAL_GOODS',
                // 商品名称
                productName: '',
                // 商品图片
                mediaInfoIds: [],
                // 商品主图
                productMainImage: '',
                // 商品描述
                productDesc: '',
                // 商品标签
                tagIds: [],
                // 商品分类
                categoryId: '',
                subCategoryId: '',
                // 退货地址
                afterSalesAddress: '',
                // sku库存
                productAttributes: [],
                productSkuModels: [],
                // 运费模板
                shippingTemplateId: '',
                // 是否限购
                purchaseLimit: 0,
                // 限购数量
                purchaseQuantity: 0,
                // 参与排序
                participateSort: 1,
                // 显示品宣 4 新增
                showBranding: 1,
                // 是否退换货
                supportRefund: 1,
                // 是否支持发票
                showInvoice: 1,
                // 是否获取学员信息
                needStudentInfo: 0,
                // 是否设置开售时间
                shoppingStatus: 0,
                // 开售时间
                shoppingTime: '',
                // 编辑详情
                detail: '',
                // 使用须知
                useDesc: '',
                // 有效期
                validityPeriodStart: '',
                validityPeriodEnd: '',
                customFormEntityList: [],
                themeModel: null
            },
            // 自定义表单状态
            customFormStatus: 0,
            // 是否学员自定义表单
            customFormType: 0,
            customFormModels: [
                {
                    fieldName: '',
                    required: 1
                }
            ],
            // 学员信息自定义表单
            studentInfoModels: [
                {
                    fieldName: '',
                    required: 1
                }
            ],
            rules: {
                productType: [
                    { required: true }
                ],
                productName: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' },
                    { max: 50, message: '商品名称不能超过50个字符', trigger: 'blur' }
                ],
                productMainImage: [
                    { required: true, message: '上传图片不能为空', trigger: 'blur' }
                ],
                productDesc: [
                    { required: true, message: '商品描述不能为空', trigger: 'blur' },
                    { max: 50, message: '商品描述不能超过50个字符', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '商品分类不能为空', trigger: 'blur' }
                ],
                productSkuModels: [
                    { required: true, message: '商品规格不能为空', trigger: 'blur' }
                ],
                logisticsType: [
                    { required: true, message: '物流方式不能为空', trigger: 'blur' }
                ],
                shippingTemplateId: [
                    { required: true, message: '运费模板不能为空', trigger: 'blur' }
                ],
                useDesc: [
                    { required: true, message: '使用须知不能为空', trigger: 'blur' },
                    { max: 200, message: '使用须知不能超过200个字符', trigger: 'blur' }
                ],
                detail: [
                    { required: true, message: '商品详情不能为空', trigger: 'blur' }
                ]
            },
            // 标签回显
            productTags: [],
            // 商品分类回显
            classification: [],
            showLabelDialog: false,
            draftUpperLimit: false,
            showDescriptionDialog: false,
            showUseDescDialog: false,
            showSkuSampleDialog: false,
            showAddAddress: false,
            templateList: [],
            templateDetail: {},
            showShippingTemplate: false,
            // sku
            showSkuDialog: false,
            skuModifyType: 0,
            activities: [{
                content: '基本信息',
                id: 'basic'
            }, {
                content: '价格库存',
                id: 'price'
            }, {
                content: '物流信息',
                id: 'logistics'
            }, {
                content: '其他信息',
                id: 'other'
            }, {
                content: '商品详情',
                id: 'detail'
            }],
            logisticsType: 1,
            dragging: false,
            showDraft: true,
            daterange: [],
            startPickerOptions: {
                disabledDate: time => time.getTime() < Date.now() - 8.64e7
            },
            effectiveTime: 1
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters({
            returnAddressList: 'goods/returnAddressList'
        }),
        toName () {
            return this.$route.query.toName
        },
        isSafari () {
            return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
        }
    },
    watch: {
        videoList (val) {
            this.form.mediaInfoIds = [...val, ...this.imageList]
        },
        imageList (val) {
            console.log(val, 870)
            this.form.mediaInfoIds = [...this.videoList, ...val]
        },
        'form.purchaseLimit' (val) {
            if (!val) {
                this.form.purchaseQuantity = 0
            }
        },
        'form.productType' (val) {
            if (val === 'PHYSICAL_GOODS') {
                this.activities = [{
                    content: '基本信息',
                    id: 'basic'
                }, {
                    content: '价格库存',
                    id: 'price'
                }, {
                    content: '物流信息',
                    id: 'logistics'
                }, {
                    content: '其他信息',
                    id: 'other'
                }, {
                    content: '商品详情',
                    id: 'detail'
                }]
            } else {
                this.activities = [{
                    content: '基本信息',
                    id: 'basic'
                }, {
                    content: '价格库存',
                    id: 'price'
                }, {
                    content: '其他信息',
                    id: 'other'
                }, {
                    content: '商品详情',
                    id: 'detail'
                }]
            }
        },
        'form.shoppingStatus' (val) {
            if (!val) {
                this.form.shoppingTime = ''
            }
        }
    },
    async created () {
        try {
            await this.init()
            await this.getTemplateList()
            if (!this.returnAddressList.length) {
                await this[GET_RETURN_ADDRESS]()
            }
            this.hasPingXuan = await this.getPingXuan()
            if (this.form.showBranding === 4) {
                // 还没设置过品宣，那就根据是否有品宣内容自动勾选
                if (this.hasPingXuan) {
                    this.form.showBranding = 1
                } else {
                    this.form.showBranding = 0
                }
            }
        } catch (e) {
            throw e
        }
    },
    mounted () {
        window.addEventListener('beforeunload', this.beforeunload)
    },
    beforeDestroy () {
        window.removeEventListener('beforeunload', this.beforeunload)
    },
    methods: {
        ...mapActions({
            [GET_RETURN_ADDRESS]: `goods/${ GET_RETURN_ADDRESS }`
        }),
        beforeunload (e) {
            e.returnValue = '123'
        },
        customValue ($event, item) {
            item.fieldName = $event.target.value.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '')
        },
        async init () {
            if (this.id) {
                const classification = []
                if (this.toName === 'DraftBox') {
                    this.showDraft = true
                } else {
                    this.showDraft = false
                }
                const { result: res } = await getSingleGoods(this.id)
                if (res.shoppingTime && this.isSafari) {
                    res.shoppingTime = moment(res.shoppingTime).format('YYYY/MM/DD HH:mm:ss')
                }
                classification.push(res.categoryId)
                if (res.subCategoryId) {
                    classification.push(res.subCategoryId)
                }
                this.classification = classification
                if (res.validityPeriodStart) {
                    this.daterange.push(new Date(res.validityPeriodStart))
                    this.effectiveTime = 0
                }
                if (res.validityPeriodEnd) {
                    this.daterange.push(new Date(res.validityPeriodEnd))
                    this.effectiveTime = 0
                }

                // 处理自定义表单
                this.processResCustomDate(res)
                res.customFormEntityList = []

                this.form = res
                this.form.themeModel = res.themeModel || null
                // 规格启用与禁用的数据转换
                for (const item of this.form.productSkuModels) {
                    item.status = Boolean(item.status)
                }
                this.productTags = this.form.labelModels

                this.videoList = res.mediaInfoIds.filter(item => item.indexOf('video') > -1)
                this.imageList = res.mediaInfoIds.filter(item => item.indexOf('img') > -1)
            }
            const productType = this.$route.params.productType
            if (productType) {
                this.form.productType = productType
            }
            if (productType === 'VIRTUAL_GOODS') {
                this.form.supportRefund = 0
                this.form.showInvoice = 0
            }
        },
        // 品宣信息是否完整
        async getPingXuan () {
            try {
                const data = await getPingXuan()
                const infos = data.result.mallBrandingRequestModels
                return infos.some(item => item.titleName)
            } catch (e) {
                throw e
            }
        },
        // 勾选品宣时
        selectPingXuan (val) {
            if (!this.hasPingXuan && val) {
                this.$confirm({
                    title: '温馨提示',
                    message: '您还没有设置品宣或设置不完整，请先设置后再编辑',
                    confirmButtonText: '保存并设置',
                    cancelButtonText: '等会再设置'
                })
                    .then(async () => {
                        try {
                            this.form.showBranding = 0
                            await this.saveDraft()
                            this.$router.replace({ name: 'OrgIndex' })
                            this.$warning('编辑内容已保存至草稿箱，请到草稿箱进行查看')
                        } catch (e) {
                            throw e
                        }
                    })
                    .catch(() => {
                        this.form.showBranding = 0
                    })
            }
        },
        productTypeChange (val) {
            if (val === 'PHYSICAL_GOODS') {
                this.form.supportRefund = 1
                this.form.showInvoice = 1
            } else {
                this.form.supportRefund = 0
                this.form.showInvoice = 0
            }
        },
        // 选择文件
        fileSelectorChange (e) {
            const videos = []
            const images = []
            let files = [...e.target.files]
            if (files.some(item => item.type.indexOf('video') > -1)) {
                // 如果有视频，把图片排在前面
                files = [...files.filter(item => item.type.indexOf('image') > -1), ...files.filter(item => item.type.indexOf('video') > -1)]
            }
            for (const f of files) {
                if (f.type.indexOf('image') > -1) {
                    if (images.length + this.imageList.length + this.videoList.length + videos.length === 10) {
                        this.$warning(`只允许上传${ 10 - this.videoList.length }张图片`)
                        continue
                    }
                    images.push(f)
                }

                if (f.type.indexOf('video') > -1 && images.length + this.imageList.length < 10) {
                    if (this.videoList.length || videos.length > 0) {
                        this.$warning('只允许上传一个视频')
                        continue
                    }
                    videos.push(f)
                }
            }
            if (images.length) {
                this.$refs.UploadImage.fileChange({
                    target: {
                        files: images
                    }
                })
            }
            if (videos.length && images.length + this.imageList.length < 10) {
                this.$refs.UploadVideo.fileChange({
                    target: {
                        files: videos
                    }
                })
            }
        },
        purchaseQuantityChange () {
            this.form.purchaseQuantity = parseInt(this.form.purchaseQuantity)
        },
        dateChange () {
            if (!this.daterange) {
                this.form.validityPeriodStart = ''
                this.form.validityPeriodEnd = ''
            }
            if (this.daterange && this.daterange.length === 2) {
                this.form.validityPeriodStart = `${ moment(this.daterange[0]).format('YYYY-MM-DD') } 00:00:00`
                this.form.validityPeriodEnd = `${ moment(this.daterange[1]).format('YYYY-MM-DD') } 23:59:59`
            }
        },
        addCustom () {
            if (this.customFormModels && this.customFormModels.length < 6) {
                this.customFormModels.push({
                    fieldName: '',
                    required: 1
                })
            } else {
                this.$warning('自定义表单至多添加6个')
            }
        },
        addStudentInfo () {
            if (this.studentInfoModels && this.studentInfoModels.length < 6) {
                this.studentInfoModels.push({
                    fieldName: '',
                    required: 1
                })
            } else {
                this.$warning('自定义表单至多添加6个')
            }
        },
        customFormChange () {
            if (this.customFormStatus && !this.customFormModels.length) this.customFormModels.push({ fieldName: '', required: 1 })
        },
        studentFormChange () {
            if (this.form.needStudentInfo && this.customFormType && !this.studentInfoModels.length) this.studentInfoModels.push({ fieldName: '', required: 1 })
        },
        deleteCustom (index) {
            this.customFormModels.splice(index, 1)
            if (!this.customFormModels.length) this.customFormStatus = 0
        },
        deleteStudentInfo (index) {
            this.studentInfoModels.splice(index, 1)
            if (!this.studentInfoModels.length) {
                this.form.needStudentInfo = 0
                this.customFormType = 0
            }
        },
        // 修改主图主题
        themeConfirmHandler (data) {
            this.form.themeModel = data
        },
        // 生成主题图
        generateImage () {
            // 没有图片
            if (!this.imageList.length) {
                this.$warning('请至少上传一张商品图片')
                throw new Error('请至少上传一张商品图片')
            }
            return this.$refs.MainImageTheme.generateImage()
        },
        async saveAndOnline (type) {
            try {
                // 生成主图主题
                this.form.productMainImage = await this.generateImage()
                if (!this.checkData()) {
                    return
                }
                this.loading = true
                this.dateChange()
                // 自定义表单处理
                this.processCustomDate()
                // 将form深拷贝一份，防止类型转换后，提交失败时影响界面表现
                const form = JSON.parse(JSON.stringify(this.form))
                form.tagIds = this.productTags.map(item => item.id)
                // sku数据类型转换
                for (const item of form.productSkuModels) {
                    item.status = Number(item.status)
                    item.realRebate = Number(item.realRebate)
                    item.rebate = Number(item.rebate)
                }
                form.shoppingTime = form.shoppingStatus ? moment(form.shoppingTime).format('YYYY-MM-DD HH:mm:ss') : ''
                form.categoryId = this.classification[0]
                form.subCategoryId = this.classification[1] || ''
                if (this.id) {
                    delete form.id
                    await modifyGoods({ productId: this.id, data: form })
                    if (type === 'online') {
                        await updateGoodsStatus(2, [this.id])
                    }
                    this.$router.replace({ name: 'MyGoods' })
                } else {
                    const { data } = await addGoods(form)
                    if (type === 'online') {
                        await updateGoodsStatus(2, [data.result])
                    }
                    this.$router.replace({ name: 'MyGoods' })
                }
            } catch (e) {
                // 处理失败自定义表单
                this.processResCustomDate(this.form)
                throw e
            } finally {
                this.loading = false
            }
        },
        async saveAndAdd () {
            try {
                // 生成主图主题
                this.form.productMainImage = await this.generateImage()
                if (!this.checkData()) {
                    return
                }
                this.loading = true
                this.dateChange()
                this.form.categoryId = this.classification[0]
                this.form.subCategoryId = this.classification[1] || ''
                this.form.tagIds = this.productTags.map(item => item.id)
                // 规格启用与禁用的数据转换
                for (const item of this.form.productSkuModels) {
                    item.status = Number(item.status)
                }
                this.form.shoppingTime = this.form.shoppingStatus ? moment(this.form.shoppingTime).format('YYYY-MM-DD HH:mm:ss') : ''
                // 自定义表单处理
                this.processCustomDate()
                if (this.id) {
                    delete this.form.id
                    await modifyGoods({ productId: this.id, data: this.form })
                } else {
                    await addGoods(this.form)
                }
                this.form = {
                    isShow: 1,
                    productType: 'PHYSICAL_GOODS',
                    productName: '',
                    mediaInfoIds: [],
                    productMainImage: '',
                    productDesc: '',
                    tagIds: [],
                    categoryId: '',
                    subCategoryId: '',
                    afterSalesAddress: '',
                    productAttributes: [],
                    productSkuModels: [],
                    shippingTemplateId: '',
                    purchaseLimit: 0,
                    purchaseQuantity: 0,
                    participateSort: 1,
                    showBranding: 4,
                    supportRefund: 1,
                    showInvoice: 1,
                    needStudentInfo: 0,
                    shoppingStatus: 0,
                    shoppingTime: '',
                    detail: '',
                    useDesc: '',
                    validityPeriodStart: '',
                    validityPeriodEnd: '',
                    customFormEntityList: [],
                    themeModel: null
                }
                this.daterange = []
                this.form.purchaseLimit = 0
                this.form.showBranding = this.hasPingXuan ? 1 : 0
                this.form.purchaseQuantity = 0
                this.form.participateSort = 1
                if (this.form.productType === 'VIRTUAL_GOODS') {
                    this.form.supportRefund = 0
                    this.form.showInvoice = 0
                } else {
                    this.form.supportRefund = 1
                    this.form.showInvoice = 1
                }
                this.productTags = []
                this.classification = []
                this.showLabelDialog = false
                this.showAddAddress = false
                // 运费模板无需重置  this.templateList = []
                this.templateDetail = {}
                this.showShippingTemplate = false
                this.showSkuDialog = false
                this.skuModifyType = 0
                this.logisticsType = 1
                // 处理图片
                this.videoList = []
                this.imageList = []
                // 处理自定义表单
                this.form.needStudentInfo = 0
                this.customFormStatus = 0
                this.customFormType = 0
                this.customFormModels = [
                    {
                        fieldName: '',
                        required: 1
                    }
                ]
                this.studentInfoModels = [
                    {
                        fieldName: '',
                        required: 1
                    }
                ]
                this.$router.replace({ name: 'AddProduct' })
                document.querySelector('.main-container').scrollTo(0, 0)
                this.$router.replace({ name: 'AddProduct' })
            } catch (e) {
                // 处理失败自定义表单
                this.processResCustomDate(this.form)
                throw e
            } finally {
                this.loading = false
            }
        },
        async saveDraft () {
            try {
                if (this.toName !== 'DraftBox') {
                    const data = await isAllowSave('GOODS')
                    if (!data.result) {
                        this.draftUpperLimit = true
                        return false
                    }
                }
                await this.saveDrafeRequest()
            } catch (e) {
                throw e
            }
        },
        async saveDrafeRequest () {
            this.dateChange()
            this.form.productMainImage = await this.generateImage()
            this.form.categoryId = this.classification[0]
            this.form.subCategoryId = this.classification[1] || ''
            this.form.tagIds = this.productTags.map(item => item.id)
            // 规格启用与禁用的数据转换
            for (const item of this.form.productSkuModels) {
                item.status = Number(item.status)
            }
            this.form.shoppingTime = this.form.shoppingStatus ? moment(this.form.shoppingTime).format('YYYY-MM-DD HH:mm:ss') : ''
            // 自定义表单处理
            this.processCustomDate()
            try {
                if (this.id) {
                    delete this.form.id
                    await modifyDraft({ productId: this.id, data: this.form })
                } else {
                    await createDraft(this.form, 'GOODS')
                }
                this.$router.replace({ name: 'DraftBox' })
            } catch (e) {
                // 处理失败自定义表单
                this.processResCustomDate(this.form)
                throw e
            }
        },
        async getTemplateList () {
            try {
                const { result } = await getProductTemplate()
                this.templateList = result
            } catch (e) {
                throw e
            }
        },
        async templateDetailShow (id) {
            const { result } = await getTemplateDetail(id)
            if (result && Object.keys(result).length) {
                this.templateDetail = result
            }
            this.showShippingTemplate = true
        },
        addTagConfirm (selected) {
            this.productTags = selected
        },
        removeTag (index) {
            this.productTags.splice(index, 1)
        },
        // 库存sku
        addSkuList () {
            this.showSkuDialog = true
        },
        setSkuTable (sku) {
            if (sku && sku.productAttributes && sku.productSkuModels) {
                this.form.productAttributes = sku.productAttributes
                // 01转换成布尔值，开关组件才能正确回显状态
                for (const item of sku.productSkuModels) {
                    item.status = Boolean(item.status)
                }
                this.form.productSkuModels = sku.productSkuModels
            } else {
                this.$error('生成库存规格信息失败')
            }
        },
        editSkuTable (type) {
            this.skuModifyType = type
            this.showSkuDialog = true
        },
        async delSkuTable (type) {
            this.form.productAttributes.splice(type - 1, 1)
            if (!this.form.productAttributes.length) {
                this.form.productSkuModels = []
                this.$refs.AddSku.clearTemp('all')
                return false
            }
            const data = await createSku({ attributeModels: this.form.productAttributes })
            if (data && data.result) {
                this.setSkuTable(data.result)
            }
        },
        // 删除的图片
        async imgRemove (index) {
            const url = this.form.mediaInfoIds.splice(index, 1)[0]
            if (!this.id) {
                // 如果是在添加，直接删除oss上的图片
                try {
                    await deleteImage([url], 'img')
                } catch (e) {
                    throw e
                }
            }
        },
        processCustomDate () {
            if (this.form.productType === 'PHYSICAL_GOODS' && this.customFormStatus) {
                this.form.needStudentInfo = 2
                this.form.customFormEntityList = this.customFormModels
            }
            if (this.form.productType === 'PHYSICAL_GOODS' && !this.customFormStatus) {
                this.form.needStudentInfo = 0
                this.form.customFormEntityList = []
            }
            if (this.form.productType === 'VIRTUAL_GOODS' && this.form.needStudentInfo && !this.customFormType) {
                this.form.needStudentInfo = 1
                this.form.customFormEntityList = []
            }
            if (this.form.productType === 'VIRTUAL_GOODS' && this.form.needStudentInfo && this.customFormType) {
                this.form.needStudentInfo = 2
                this.form.customFormEntityList = this.studentInfoModels
            }
        },
        processResCustomDate (res) {
            // 处理响应数据自定义表单
            if (res.needStudentInfo === 1) {
                res.needStudentInfo = 1
                this.customFormType = 0
            }
            if (res.needStudentInfo === 2) {
                res.needStudentInfo = 1
                if (res.productType === 'PHYSICAL_GOODS') {
                    this.customFormStatus = 1
                    this.customFormModels = res.customFormEntityList
                }
                if (res.productType === 'VIRTUAL_GOODS') {
                    this.customFormType = 1
                    this.studentInfoModels = res.customFormEntityList
                }
            }
        },
        checkData () {
            if (!this.form.productName) {
                this.$warning('商品名称不能为空')
                this.formValidateHandler('productName')
                return false
            }
            if (!this.form.productMainImage) {
                this.$warning('上传图片不能为空')
                this.formValidateHandler('productMainImage')
                return false
            }
            if (!this.form.productDesc) {
                this.$warning('商品描述不能为空')
                this.formValidateHandler('productDesc')
                return false
            }
            this.form.categoryId = this.classification[0]
            if (!this.form.categoryId) {
                this.$warning('商品分类不能为空')
                this.formValidateHandler('categoryId')
                return false
            }
            if (!this.form.productSkuModels.length) {
                this.$warning('商品规格不能为空')
                this.formValidateHandler('productSkuModels')
                return false
            }
            if (this.form.productType === 'PHYSICAL_GOODS' && !this.form.shippingTemplateId) {
                this.$warning('运费模板不能为空')
                this.formValidateHandler('shippingTemplateId')
                return false
            }
            if (this.form.productType === 'PHYSICAL_GOODS' && this.form.supportRefund && !this.form.afterSalesAddress) {
                this.$warning('退货地址不能为空')
                this.formValidateHandler('supportRefund')
                return false
            }
            if (this.form.productType === 'VIRTUAL_GOODS' && !this.form.useDesc) {
                this.$warning('使用须知不能为空')
                this.formValidateHandler('useDesc')
                return false
            }
            if (!this.form.detail) {
                this.$warning('商品详情不能为空')
                this.formValidateHandler('detail')
                return false
            }
            const checkSku = this.form.productSkuModels.some(item => item.price === '' || item.stock === '')
            if (checkSku) {
                this.$warning('规格库存或规格实际售价填写有误')
                this.formValidateHandler('productSkuModels')
                return false
            }
            if (this.form.purchaseLimit) {
                if (!this.form.purchaseQuantity) {
                    this.$warning('限购数量不可为空')
                    this.formValidateHandler('purchaseLimit')
                    return false
                }
                const minBuyNumArray = []
                for (const item of this.form.productSkuModels) {
                    if (item.status) {
                        minBuyNumArray.push(item.minBuyNum)
                    }
                }
                if (this.form.purchaseQuantity < Math.max(...minBuyNumArray)) {
                    this.$warning('限购数量不可小于最小起订的数量')
                    this.formValidateHandler('purchaseLimit')
                    return false
                }
            }
            if (this.form.shoppingStatus && !this.form.shoppingTime) {
                this.$warning('请选择售卖开始时间')
                this.formValidateHandler('purchaseLimit')
                return false
            }

            if (this.form.shoppingStatus && !this.form.shoppingTime) {
                this.$warning('请选择售卖开始时间')
                this.formValidateHandler('shoppingStatus')
                return false
            }
            if (this.form.productType === 'PHYSICAL_GOODS' && this.customFormStatus && (!this.customFormModels.length || this.customFormModels.some(item => !item.fieldName))) {
                this.$warning('实体商品自定义表单信息不能为空')
                this.formValidateHandler('needStudentInfo')
                return false
            }
            if (this.form.productType === 'VIRTUAL_GOODS' && this.form.needStudentInfo && this.customFormType && (!this.studentInfoModels.length || this.studentInfoModels.some(item => !item.fieldName))) {
                this.$warning('虚拟商品自定义表单信息不能为空')
                this.formValidateHandler('needStudentInfo')
                return false
            }

            if (this.form.productType === 'PHYSICAL_GOODS' && this.customFormStatus) {
                const array = []
                for (const item of this.customFormModels) {
                    array.push(item.fieldName)
                }
                if (new Set(array).size !== array.length) {
                    this.$warning('实体商品自定义表单信息不能相同')
                    this.formValidateHandler('needStudentInfo')
                    return false
                }
            }
            if (this.form.productType === 'VIRTUAL_GOODS' && this.form.needStudentInfo && this.customFormType) {
                const array = []
                for (const item of this.studentInfoModels) {
                    array.push(item.fieldName)
                }
                if (new Set(array).size !== array.length) {
                    this.$warning('虚拟商品自定义表单信息不能相同')
                    this.formValidateHandler('needStudentInfo')
                    return false
                }
            }
            return true
        },
        getReturnAddress () {
            this[GET_RETURN_ADDRESS]()
        },

        /**
     * 表单校验事件
     * @param id {String} 错误项的id
     */
        formValidateHandler (id) {
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            }
        },
        handelChangeTime (e) {
            this.effectiveTime = e
            this.daterange = []
            this.form.validityPeriodStart = ''
            this.form.validityPeriodEnd = ''
        },
        handleChangeDate () {
            this.effectiveTime = 0
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'AddProduct' && to.name !== 'DraftBox' && to.name !== 'MyGoods' && to.name !== 'OrgIndex') {
            this.$confirm({
                title: '确定离开该页面吗？',
                message: '请确定您所作的修改已经保存！'
            })
                .then(() => {
                    next()
                })
        } else {
            next()
        }
    }
}
</script>
<style lang="scss" scoped>
.font-12c{
  font-size: 12px;
  color: #cccccc;
}
.main-form {
  ::v-deep .el-form-item__label {
    padding-left: 30px !important;
  }
}
.alink {
  color: #598bf8;
  font-size: 12px;
  text-decoration-line: underline;
}

.add-product {
  background-color: #f5f6f7;
}
/* 商品类型 */
.pro-type {
  position: relative;
  margin: 0;
  padding: 0 13px !important;
  line-height: 30px;
  overflow: hidden;
  border-radius: 6px;
  ::v-deep .el-radio__input {
    display: none !important;
  }
  ::v-deep .el-radio__label {
    padding-left: 0;
  }
  &.is-checked.el-icon-check:after {
    position: absolute;
    right: 0;
    content: '';
    font-size: 12px;
    border-top: 16px solid #4F63FF;
    border-left: 26px solid transparent;
    z-index: 1;
  }
  &.el-icon-check:before {
    display: none;
  }
  &.is-checked {
    &.el-icon-check:before {
      display: inline;
      position: absolute;
      right: 0;
      top: 0;
      line-height: 12px;
      font-size: 12px;
      color: #fff;
      z-index: 2;
    }
  }
}
.pro-type-intro {
  display: inline-block;
  margin-left: 6px;
  margin-right: 30px;
  transform: translateY(-8px);
  &:hover {
    color: #EC742E;
  }
}
.pro-type-intro-time {
  display: inline-block;
  margin-left: 6px;
  &:hover {
    color: #EC742E;
  }
}
.purchase-sort-description {
  font-size: 12px;
  color: #999;
}
.add-content {
  margin-top: 20px;
  margin-left: 80px;
  margin-right: 26px;
  background-color: #fff;
  .content-title {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    height: 60px;
    margin-top: 37px;
    padding-left: 30px;
    font-size: 14px;
    font-weight: bold;
    border-top: 1px solid #e7e7e7;
    background-color: #fbfbfb;
  }

  .specify-student{
    display: inline-flex;
    padding: 10px;
    border: 1px solid #e7e7e7;
    >div{
      display: flex;
      flex-direction: column;
      margin-right: 15px;
      font-size: 14px;
      color: #606266;
    }
  }

  .btn-box {
    border-top: 1px solid #e7e7e7;
    padding: 24px;

    .btn-description {
      padding-top: 24px;
      padding-bottom: 67px;

      > div {
        padding-bottom: 10px;
        font-size: 12px;
        color: #999999;
      }
    }
  }

  .tabel-box{
    width: 640px;
    margin-top: 12px;
    border-top: 1px solid #CCCCCC;
    border-right: 1px solid #CCCCCC;
    border-left: 1px solid #CCCCCC;
    .head-title{
      display: flex;
      padding: 10px;
      border-bottom: 1px solid #CCCCCC;
      font-size: 12px;
      color: #333333;
      font-weight: bold;
      .custom-name{
        width: 260px;
      }
      .custom-num{
        width: 160px;
      }
      .custom-button{
        width: 70px;
      }
    }
    .tabel-content{
      font-weight: normal;
      .choose-btn{
        width: 90px;
        display: flex;
        justify-content: center;
      }
    }
  }
  .custom-add{
    font-size: 14px;
    margin-top: 5px;
    margin-right: 15px;
  }
}

/* 标签管理 */
.product-label {
  font-size: 14px;
  color: #999;
  &__list {
    margin-bottom: 10px;
  }
  &__item {
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    height: 30px;
    line-height: 28px;
    border: 1px solid rgba(204, 204, 204, 1);
    padding: 0 16px;
    font-size: 12px;
    color: #666666;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      .icon-close {
        transform: scale(1, 1);
      }
    }
    .icon-close {
      position: absolute;
      right: -8px;
      top: -8px;
      font-size: 16px;
      line-height: 16px;
      cursor: pointer;
      transform: scale(0, 0);
      transition: transform .2s ease-in-out;
      &:before {
        color: #333;
      }
    }
  }
  &__button {
    margin-right: 10px;
    color: #999999;
    background-color: #f8f8f8;
    border: 1px solid rgba(204, 204, 204, 1);
  }
  &__suggestion {
    font-size: 12px;
    line-height: 16px;
  }
}
/* 规格 */
.sku-btn{
  .is-disabled{
    color: #cccccc;
    border-color: #cccccc;
  }
  span{
    color: #999999;
    font-size: 14px;
  }
}
/* 图片列表 */
.description-dialog {
  ::v-deep .el-dialog__header{
    display: flex;
    align-items: center;
  }
  .description-dialog-box{
    display: flex;
    flex-direction: row;
    > div{
      width: 50%;
      padding-left: 35px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span{
        display: block;
        width:274px;
        color: #4F63FF;
        font-size: 14px;
        margin-bottom: 10px;
      }
      div{
        width:274px;
        height:66px;
        margin-bottom: 40px;
        color: #999999;
      }
      img{
        width: 200px;
      }
    }
  }

  .useDesc-dialog-box{
    padding: 0 50px;
    >p{
      font-size: 16px;
      line-height: 32px;
      color: #999999;
    }
  }
  .el-button--primary{
    display: block;
    margin: 30px auto 0;
  }
}

.sku-dialog{
  ::v-deep .el-dialog__header{
    display: flex;
    align-items: center;
  }
  .sku-dialog-box{
    display: flex;
    flex-direction: column;
    padding-left: 35px;
    span{
      display: block;
      color: #4F63FF;
      font-size: 14px;
      margin: 24px 0;
    }
    i{
      display: block;
      margin: 14px 0 0 8px;
      color: #D2524C;
      font-size: 12px;
    }
  }
  .el-button--primary{
    display: block;
    margin: 60px auto 0;
  }
}

.draft-upperLimit{
  ::v-deep .el-dialog{
    .el-dialog__header {
      padding: 16px;
    }
    .el-dialog__body {
      padding-bottom: 0;
    }
  }
  .draft-upperLimit-box{
    display: flex;
    justify-content: center;
    .content-text{
      width:323px;
      height:42px;
      font-size:16px;
      font-weight:bold;
      color: #333333;
      line-height:21px;
      text-align: center;
    }
  }
}

</style>
