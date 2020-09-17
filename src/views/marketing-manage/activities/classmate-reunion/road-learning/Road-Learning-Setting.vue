<template>
    <div class="road-learning-setting bg-white">
        <div>活动说明：</div>
        <p class="font-weight-bold">
            见学之旅活动，是在一定活动时间内进行的签到活动，满足活动签到条件，即可抽取奖品；<br>
            见学之旅目前涉及的签到数量是固定的，为10次，每次签到都会体现出见学轨迹；
        </p>
    </div>
</template>

<script>
export default {
    name: 'RoadLearningSetting'
}
</script>

<style lang="scss" scoped>
.road-learning-setting {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  min-height: 400px;
  padding: 32px;
  font-size: 18px;

  div {
    width: 140px;
  }

  p {
    line-height: 32px;
  }
}
</style>
