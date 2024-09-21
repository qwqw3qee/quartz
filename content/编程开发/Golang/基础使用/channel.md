---
tags:
  - golang
  - channel
dg-publish: true
---
# 总结
- 关闭一个未初始化的 channel 会产生 panic
- Channel 只能被关闭一次，对同一个 channel 重复关闭会产生 panic
- 向一个已关闭的 channel 发送消息会产生 panic
- 从一个已关闭的 channel 读取消息不会发生 panic，会一直读取到零值
- Channel 可以读端和写端都可有多个 goroutine 操作，在一端关闭 channel 的时候，该 channel 读端的所有 goroutine 都会收到 channel 已关闭的消息
- Channel 是并发安全的，多个 goroutine 同时读取 channel 中的数据，不会产生并发安全问题

# channel 介绍
## 用途
在 go 语言中，通过 channel 与 select 的搭配使用以及调度器对 goroutine 的调度，可以很高效的实现协程的阻塞和唤醒以及多路复用。
## 分类
- 有缓冲 channel 
- 无缓冲 channel
# channel 的数据结构
channel 用 make 函数创建初始化的时候会在==堆==上分配一个 runtime.hchan 类型的数据结构，并返回指针指向堆上这块 hchan 内存区域，所以 channel 是一个引用类型
为 channel 开辟内存分为三种情况：
# channel 操作
## channel 初始化
1. **没有缓冲区buf，即创建无缓冲区的channel，只分配hchan本身结构体大小的内存**
2. **有缓冲区buf， 但元素类型不含指针，一次为当前的 hchan结构和buf数组分配一块连续的内存空间**
3. **有缓冲区，且元素包含指针类型，分两次分配内存，先为 hchan 结构和分配内存，再为 buf 数组元素分配内存**

## channel 写入
针对 channel 的不同状态，向 channel 写入结果如下：

| 操作         | channel 状态 | 结果    |
| ---------- | ---------- | ----- |
| 发送 (write) | nil        | 阻塞    |
| 发送 (write) | 有缓冲区，缓冲区未满 | 成功写入  |
| 发送 (write) | 无缓冲区或者缓冲区满 | 阻塞    |
| 发送 (write) | 关闭         | panic |

往 channel 发送数据分为三种方式：**直接发送，缓冲发送还有阻塞发送**
**直接发送：** 当前 channel 有正在阻塞等待接收数据的 goroutine，那么直接发送数据，直接从一个 goroutine 操作另一个 goroutine 的栈，将待发送数据直接 copy 到接收处
**缓冲发送：** 会判定缓冲区的剩余空间，如果有剩余空间，则将数据拷贝到 channel 中，sendx 索引自行自增 1(若 sendx 等于 dataqsiz ，则将 sendx 置0，原因是 buf 是一个环形数组)，自增完成之后，队列总数自增 1
**阻塞发送：** 当前 channel 没有正在阻塞等待接收数据的 goroutine 并且是 channel 的缓冲区满了之后，发送 goroutine 就就会阻塞，首先获取 `sudog` ，将发松平的 goroutine 绑定到 sudog 上，加入到当前 channel 的发送阻塞队列，调用 `gopark` 方法挂起当前 goroutine，等待被唤醒
## channel 读取
针对 channel 的不同状态，从 channel 读取数据结果如下：​

|操作​|channel 状态​ |结果​|
|---|---|---|
|接收(read)​|nil​|阻塞​|
|接收(read)​|打开，有元素​|读取到正常值​|
|接收(read)​|打开，没有元素​ |阻塞​|
|接收(read)​|关闭​，有元素|读到正常值|
|接收(read)​|关闭​，没有元素 |读取到默认值(空值)​ |

## channel 关闭

|操作​ |channel 状态​ |结果​|
|---|---|---|
|关闭 (close)​|nil​ |panic|
|关闭 (close)​|已关闭|panic|



​