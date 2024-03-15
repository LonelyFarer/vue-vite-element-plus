<template>
  <el-dialog title="综合查询" v-model="queryModal" @close="modalCancel" width="100%" append-to-body fullscreen>
    <div class="query-modal">
      <div class="query-left">
        <h3 class="title">查询条件及条件分组</h3>
        <el-tree
          :props="treeProps"
          :data="treeData"
          node-key="id"
          show-checkbox
          @check="handleCheckChange"
          @node-click="nodeClickChange"
        ></el-tree>
        <div class="footer-btn">
          <el-button type="primary" @click="addGroup">添加组</el-button>
          <el-button type="primary" @click="insertGroup">插入组</el-button>
          <el-button type="primary" @click="editGroup">修改组</el-button>
          <el-button type="primary" @click="delGroup">删除组</el-button>
        </div>
      </div>
      <div class="query-right">
        <div class="right-top">
          <h3 class="title">查询条件描述</h3>
          <el-input type="textarea" :rows="4" v-model="searchText" readonly></el-input>
        </div>
        <div class="right-center">
          <h3 class="title">设置查询条件值</h3>
          <div class="query-select">
            <div v-if="queryForm.label">
              <el-form :model="queryForm" ref="queryRef" :rules="queryRules">
                <el-row>
                  <el-form-item label="条件所用到的数据列（字段）：" prop="label">
                    <el-input v-model="queryForm.label" readonly />
                  </el-form-item>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="运算符" prop="operate">
                      <el-select
                        v-model="queryForm.operate"
                        placeholder="请选择运算符"
                        ref="operateRef"
                        @change="e=>selectChange(e,'operate')"
                      >
                        <el-option
                          v-for="item in operateOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="值" prop="value">
                      <el-date-picker
                        v-model="queryForm.value"
                        type="date"
                        placeholder="选择日期"
                        style="width:100%"
                        value-format="YYYY-MM-DD"
                        v-if="queryForm.label.includes('日期')"
                      ></el-date-picker>
                      <el-input v-model="queryForm.value" clearable placeholder="请输入" v-else />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="与后继条件关系" prop="relation">
                      <el-select
                        v-model="queryForm.relation"
                        placeholder="请选择与后继条件关系"
                        ref="relationRef"
                        @change="e=>selectChange(e,'relation')"
                      >
                        <el-option
                          v-for="item in relationOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-button @click="addCondition" :loading="loading">添加条件</el-button>
            <el-button @click="editCondition">修改条件</el-button>
            <el-button @click="delCondition">删除条件</el-button>
          </div>
        </div>
        <div class="right-bottom">
          <h3 class="title">选择查询条件字段</h3>
          <div class="query-list">
            <template v-for="item in queryList" :key="item.label">
              <div class="query-item">
                {{ item.label }}
                <div class="query-citem">
                  <template v-for="citem in item.children" :key="citem.name">
                    <div @click="selectQuery(citem)">{{ citem.name }}</div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div>
        <el-button type="primary" @click="clearCondition">清除条件</el-button>
        <el-button type="primary" @click="saveCondition">保存条件</el-button>
        <el-button type="primary" @click="importCondition">载入条件</el-button>
      </div>
      <div>
        <el-button type="primary" @click="addConditionSubmit">确定</el-button>
        <el-button @click="modalCancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
  <el-dialog :title="groupTitle" v-model="groupModal" @close="groupModalCancel" width="800px" append-to-body>
    <el-form :model="groupForm" ref="groupRef" :rules="queryRules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="组名" prop="groupName">
            <el-input v-model="groupForm.groupName" clearable placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="与同层次后继条件或条件组关系" prop="groupRelation">
            <el-select v-model="groupForm.groupRelation" placeholder="请选择" ref="relationRef">
              <el-option v-for="item in relationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <p>组名可以任意，即使重复也无影响</p>
    <div slot="footer" style="text-align: center;">
      <el-button type="primary" @click="addGroupSubmit">确定</el-button>
      <el-button @click="groupModalCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup name="ComprehensiveQuery">

const props = defineProps({
  queryShow: { default: '', type: String },
})
const { proxy } = getCurrentInstance()

const treeProps = ref({
  children: 'children',
  label: 'name'
})
const treeData = ref([{
  id: 1,
  name: '条件组【并且】',
  groupName: '条件组',
  groupRelation: '&&',
  children: [{
    id: 9,
    name: '设备状态等于在用或者',
    operate: '=',
    operateLabel: '等于',
    value: '在用',
    relation: '||',
    relationLabel: '或者',
    label: '设备状态',
  }, {
    id: 10,
    name: '设备状态等于停用',
    operate: '=',
    operateLabel: '等于',
    value: '停用',
    relation: '||',
    relationLabel: '或者',
    label: '设备状态',
  }]
}, {
  id: 2,
  name: '预警起始日期等于2022-09-12或者',
  operate: '=',
  operateLabel: '等于',
  value: '2022-09-12',
  relation: '||',
  relationLabel: '或者',
  label: '预警起始日期',
}, {
  id: 3,
  name: '预警截止日期等于2022-09-15或者',
  operate: '=',
  operateLabel: '等于',
  value: '2022-09-15',
  relation: '||',
  relationLabel: '或者',
  label: '预警截止日期',
}])
const queryModal = ref(false)
const groupModal = ref(false)
const groupTitle = ref('新建条件组')
const searchText = ref('')
const selectData = ref({})
const relationOptions = ref([
  { label: '或者', value: '||' },
  { label: '并且', value: '&&' },
])
const operateOptions = ref([
  { label: '等于', value: '=' },
  { label: '大于', value: '>' },
  { label: '不等于', value: '!=' }
])
const queryList = ref([
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '预警信息', children: [{ name: '预警起始日期' }, { name: '预警结束日期' }] },
  { label: '设备基本信息', children: [{ name: '注册代码' }, { name: '设备代码' }] }
])
const queryForm = ref({
  label: '',
  value: '',
  operate: '',
  relation: '',
  operateLabel: '',
  relationLabel: ''
})
const groupForm = ref({
  groupName: '',
  groupRelation: '',
})
const queryRules = {
  groupName: [{ required: true, trigger: "blur", message: "请输入" }],
  groupRelation: [{ required: true, trigger: "change", message: "请选择" }],
  label: [{ required: true, trigger: "change", message: "请选择" }],
  operate: [{ required: true, trigger: "change", message: "请选择" }],
  value: [{ required: true, trigger: "blur", message: "请输入" }],
  relation: [{ required: true, trigger: "change", message: "请选择" }]
}
const loading = ref(false)
const emits = defineEmits(['update:queryShow'])
function modalCancel () {
  queryModal.value = false
  proxy.$refs.queryRef && proxy.$refs.queryRef.resetFields()
  emits("update:queryShow", false)
  clearValue()
  searchText.value = ''
  console.log(queryForm.value, 'vvv')
}
function clearValue () {
  queryForm.value = {
    label: '',
    value: '',
    operate: '',
    relation: '',
    operateLabel: '',
    relationLabel: ''
  }
}
// 添加条件
function addCondition () {
  if (!queryForm.value.id) {
    if (!queryForm.value.label) {
      proxy.$modal.confirm('请先选择添加条件').then(() => {

      }).catch(() => { })
    } else {
      proxy.$refs.queryRef.validate(valid => {
        if (valid) {
          // loading.value = true
          searchText.value += `（${queryForm.value.label} ${queryForm.value.operateLabel} ${queryForm.value.value}）${queryForm.value.relationLabel}`
          // proxy.$refs.queryRef.resetFields()
          clearValue()
        }
      })
    }
  }
}
// 修改条件
function editCondition () {
  if (queryForm.value.id) {
    editCond(queryForm.value).then(res => {
      proxy.$modal.alertSuccess('修改成功')
    })
  }
}
// 删除 条件
function delCondition () {
  if (queryForm.value.id) {
    proxy.$modal.confirm('确认删除该条件吗？').then(() => {
      console.log(queryForm.value, 'queryForm.value')
      delCond({ id: queryForm.value.id }).then(res => {
        clearValue()
        getGroup()
      })
    }).catch(() => { })
  }
}
// 选择条件
function selectQuery (v) {
  clearValue()
  queryForm.value.label = v.name
  console.log(queryForm.value, 'qqqq')
}
// 确定添加条件
function addConditionSubmit () {
  addQuery(queryForm.value).then((res) => {
    loading.value = false
    modalCancel()
  }).catch(() => {
    loading.value = false
  })
}
function selectChange (e, ref) {
  nextTick(() => {
    queryForm.value[`${ref}Label`] = proxy.$refs[`${ref}Ref`].currentPlaceholder
    queryForm.value[ref] = e
  })
}
// 清除条件
function clearCondition () {
  searchText.value = ''
  proxy.$refs.queryRef.resetFields()
}
// 保存条件
function saveCondition () {

}
// 载入条件
function importCondition () {
}
function handleCheckChange (data, checked) {
  selectData.value = data
  console.log(data, checked, 'd')
}
function nodeClickChange (data) {
  console.log(data, 'qqq')
  if (!data.children) {
    queryForm.value = JSON.parse(JSON.stringify(data))
    console.log(data, queryForm.value, 'qqq')
  }
}

function groupModalCancel () {
  groupModal.value = false
  proxy.$refs.groupRef && proxy.$refs.groupRef.resetFields()
}
// 获取组
function getGroup () {

}
function addGroup () {
  groupTitle.value = '新建条件组'
  groupModal.value = true
}
function editGroup () {
  if (!selectData.value.children) {
    proxy.$modal.confirm('请选择要修改的组')
  } else {
    groupModal.value = true
    groupTitle.value = '修改条件组'
    Object.assign(groupForm, selectData)
  }
}
function delGroup () {
  if (!selectData.value.id) {
    proxy.$modal.confirm('请选择要删除的组')
  } else {
    proxy.$modal.confirm('确认删除选中的条件组吗？').then(() => {
      getGroup()
      console.log(selectData.value)
    }).catch(() => { })
  }
}
function insertGroup () {

}
function addGroupSubmit () {
  proxy.$refs.groupRef.validate(valid => {
    if (valid) {
      // loading.value = true
      // 添加/修改组
      let api = { '修改条件组': editGroupData, '新建条件组': addGroupData }
      api[groupTitle].then(res => {
        proxy.$modal.alertSuccess(res.msg)
        groupModal.value = false
        groupModalCancel()
      })
    }
  })
}
watch(() => props.queryShow, val => {
  queryModal.value = val
}, { immediate: true })
</script>

<style lang="less">
@borderColor: #ccc;
.query-modal {
  display: flex;
  border: 1px solid @borderColor;
  .title {
    margin: 0;
    padding: 5px 10px;
    border-bottom: 1px solid @borderColor;
  }
  .query-left {
    width: 340px;
    border-right: 1px solid @borderColor;
    position: relative;
    .el-tree {
      overflow: auto;
      height: calc(100% - 100px);
      border: 1px solid #ccc;
      margin: 10px;
    }
    .footer-btn {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      text-align: center;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      .el-button + .el-button {
        margin-left: 0;
      }
    }
  }
  .query-right {
    width: calc(100% - 340px);
    .right-top {
      .el-textarea {
        padding: 10px;
        width: calc(100% - 20px);
        border-bottom: 1px solid @borderColor;
      }
    }
    .right-center {
      .query-select {
        padding: 10px;
        border-bottom: 1px solid @borderColor;
      }
    }
    .right-bottom {
      .query-list {
        height: 240px;
        // display: flex;
        overflow: auto;
        white-space: nowrap;
        .query-item {
          width: 150px;
          height: 100%;
          text-align: center;
          padding: 0 0 0 5px;
          display: inline-block;
          .query-citem {
            height: calc(100% - 30px);
            overflow: auto;
            border: 1px solid @borderColor;
            div {
              text-align: left;
              cursor: pointer;
            }
            div:hover {
              background: #409eff;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
.dialog-footer {
  height: 40px;
  display: flex;
  align-items: end;
  justify-content: space-between;
}
</style>
