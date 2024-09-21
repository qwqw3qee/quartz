---
tags:
  - vue
dg-publish: true
---
### 模板语法
- 绑定文本：`{{}}`
- 绑定属性：`:`
- 绑定事件：`@`


### 组件传值 
- 父级向子级传递数据，用属性（props属性）
- 子级向父级传递数据，用事件（自定义事件，`this.$emit()`）
- 全局变量（新建js，state属性）

### 计算属性与侦听器的选择
- 一个值改变影响多个值，用侦听器（watch）
- 多个值改变得到一个值，用计算属性（computed）

### 生命周期钩子
- `created()`
- `mounted()`

### 插槽，具名插槽
`<slot></slot>`

### DOM操作
- `this.$refs.`
- 一般不需要获取真实DOM

### 过滤器
- filter属性
- `|`使用

### 数据双向绑定
- `v-model`

### 路由
- 工作方式
- `<router-link to=""></router-link>`
- `<router-view \>`
- 跳转：`this.$router.push()`

### 项目部署


### 配置文件
- `.env.development`
- `.env.production`
- 变量名：`VUE_APP_XXX`
- 使用：`process.env.变量名`


