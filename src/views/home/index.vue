<template>
  <div class="card">
    <el-button type="primary" @click="showModal">
      <el-icon>
        <i-ep-plus />
      </el-icon>
      count is {{ count }}
    </el-button>
    <p>
      {{ name }}
      <img :src="randSrc" @click="getImgs" class="img" />
    </p>
  </div>
  <ComprehensiveQuery v-model:queryShow="queryShow" />
</template>
<script setup>
// 分页组件
import ComprehensiveQuery from '@/components/ComprehensiveQuery/ComprehensiveQuery'
import { ref } from 'vue'
import { getHomes } from '@/api/home'
import useUserStore from '@/store/modules/user'

const count = ref(0)
const name = ref('')
const randSrc = ref('')
const queryShow = ref(true)
function getHomesData () {
  useUserStore()
    .getInfo()
    .then((res) => {
      name.value = res
    })
  getImgs()
}
function getImgs () {
  getHomes().then((res) => {
    randSrc.value = res.data.captchaImg
  })
}
function showModal () {
  queryShow.value = true
}
getHomesData();
</script>

<style lang="less" scoped>
.card {
  .img {
    width: 74px;
    height: 32px;
  }
}
</style>
