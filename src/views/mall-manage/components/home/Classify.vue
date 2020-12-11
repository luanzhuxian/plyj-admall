<template>
    <div :class="$style.classify">
        <ul :class="$style.classifyList" v-if="show">
            <li
                :class="$style.classifyListItem"
                v-for="(item, i) of list"
                :key="i"
            >
                <img :class="$style.classifyListItemIcon" :src="item.image" alt="">
                <div :class="$style.classifyListItemName">
                    {{ item.name }}
                </div>
            </li>
        </ul>
        <ul :class="$style.classifyList" v-else>
            <li
                :class="$style.classifyListItem"
                v-for="(item, i) of defaultData"
                :key="i"
            >
                <img :class="$style.classifyListItemIcon" :src="item.icon" alt="">
                <div :class="$style.classifyListItemName">
                    {{ item.name }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TemplateModule } from '../../utils/types'

const defaultData = [{
    icon: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_course.png',
    name: '课程'
}, {
    icon: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_book.png',
    name: '书籍'
}, {
    icon: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_education.png',
    name: '教育'
}, {
    icon: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/ico_surrounding.png',
    name: '周边'
}]

@Component
export default class Classify extends Vue {
    /* props */
    @Prop({
        type: Object,
        default () {
            return { values: [] }
        }
    }) readonly data!: TemplateModule

    /* data */
    defaultData = defaultData

    /* computed */
    get list () {
        return this.data.values.filter(item => item.id && item.name)
    }

    get show () {
        return this.list.length
    }
}
</script>

<style lang="scss" module>
.classify-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    border-radius: 10px;
    height: 107px;
    &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50px;
        &-icon {
            width: 50px;
            height: 50px;
            object-fit: cover;
        }
        &-name {
            max-width: 75px;
            font-size: 10px;
            line-height: 14px;
            color: #333333;
            text-align: center;
            @include elps();
        }
    }
}

</style>
