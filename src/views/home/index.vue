<template>
  <div class="card">
    <el-button type="primary" @click="count++">
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
</template>
<script setup>
import { ref } from 'vue';
import { getHomes } from '@/api/home';
import useUserStore from '@/store/modules/user';

const count = ref(0);
const name = ref('');
const randSrc = ref('');

function getHomesData() {
  useUserStore()
    .getInfo()
    .then((res) => {
      name.value = res;
    });
  getImgs();
}
function getImgs() {
  getHomes().then((res) => {
    randSrc.value = res.data.captchaImg;
  });
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
