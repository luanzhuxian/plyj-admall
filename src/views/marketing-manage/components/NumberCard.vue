<template>
    <div class="number-card">
        <div v-if="value2 < 0" class="style1">
            <div class="title fz-18 font-weight-bold">
                {{ title }}
            </div>
            <div class="value-line">
                <span class="value">{{ value }}</span>
                <span class="unit-name">{{ unitName }}</span>
            </div>
        </div>
        <div v-else class="style2">
            <div style="margin-bottom: 30px;">
                <span class="title">{{ title }}</span>
                <span class="value">{{ value }}</span>
                <span class="unit-name">{{ unitName }}</span>
            </div>
            <div>
                <span class="title">{{ title2 }}</span>
                <span class="value">{{ value2 }}</span>
                <span class="unit-name">{{ unitName2 }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NumberCard',
    props: {
        title: {
            type: String,
            required: true
        },
        title2: {
            type: String,
            default: ''
        },
        value: {
            type: [Number, String],
            required: true
        },
        value2: {
            type: Number,
            default: -1
        },
        unitName: {
            type: String,
            required: true
        },
        unitName2: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.number-card {
  width: 299px;
  height: 112px;
  padding-top: 10px;
  padding-left: 40px;
  border-right: 1px solid rgb(231,231,231);
  color: #333;

  .style1 {
    .title {
      margin-bottom: 20px;
    }

    .value-line {
      display: flex;
      align-items: baseline;
    }

    .value {
      font-size: 50px;
      color: #333;
      margin-right: 25px;
    }

    .unit-name {
      font-size: 14px;
    }
  }

  .style2 {
    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .value {
      font-size: 24px;
      font-weight: bold;
    }

    .unit-name {
      font-size: 14px;
    }
  }
}
</style>
