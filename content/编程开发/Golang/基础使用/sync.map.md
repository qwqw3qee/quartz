---
tags:
  - golang
  - sync
  - map
dg-publish: true
created: 2023-05-27T20:01:05.000+08:00
updated: 2024-09-23T15:56:29.333+08:00
---
从功能上看，sync.map 是一个读写分离的 map，采用了空间换时间的策略来提高数据的读写性能，其内部其实用了两个 map 来实现，一个 read map 和一个 dirty map。在并发处理上，相比于我们前面提到的普通 map 的无脑加锁操作，sync.map 将读和写分开，==读数据优先从 read 中读取，对 read 的操作是不会加锁的，当 read 读取不到才会去 dirty 读，而写数据只会在 dirty 写，只有对 dirty 操作时需要加锁的==，这样区分加锁时机，就提升了并发性能。
# sync.map 方法
sync.map跟map一样，提供了数据的增删改查功能，这里我们对照map从源代码来分析一下sync.map各个功能的具体实现
- `Store()`：更新/插入一个键值对
- `Load()`：返回一个key对应的value
- `Delete()`：删除一个键值对
- `Range()`：对 sync.Map 进行遍历

	