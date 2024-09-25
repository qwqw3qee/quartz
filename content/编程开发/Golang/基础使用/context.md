---
tags:
  - golang
  - context
dg-publish: true
created: 2023-06-05T23:24:05.000+08:00
updated: 2024-09-23T15:56:29.372+08:00
---
# context 是什么
context 可以翻译为上下文，其在项目中主要是用于上下与下层 goroutine 的取消控制以及数据共享，也是 go 语言中 goroutine 之间通信的一种方式，其底层是借助 channel 与 snyc.Mutex 实现的。
