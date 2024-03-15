<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
<script setup>
import { ElConfigProvider } from "element-plus"
// 引入中文
import zhCn from "element-plus/es/locale/lang/zh-cn";
</script>
<style lang="less">
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
form,
fieldset,
input,
textarea,
p,
blockquote,
th,
td,
img {
  padding: 0;
  margin: 0;
}
</style>
