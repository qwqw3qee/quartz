---
dg-publish: true
tags:
  - golang
  - map
---
# map 是什么
在go语言中，map的底层采用hash表，用变种拉链法来解决hash冲突问题。
# 初始化
map是一种无序的基于key-value的数据结构，Go语言中map是引用类型，必须初始化才能使用。
```go
var m map[string]int  
m = make(map[string]int)
```
或者
```go
m := map[string]int{  
   "apple":  1,  
   "banana": 2,  
}
```

# 基本用法
```go
m := map[string]int{  
   "apple":  1,  
   "banana": 2,  
}  
//添加/修改元素  
m["pear"] = 3  
//判断某个键是否存在  
value, ok := m["apple"]  
if ok {  
   fmt.Println(value)  
} else {  
   fmt.Println("not found")  
}  
//map遍历  
//注意顺序是随机的
for key, val := range m {  
   fmt.Println(key, val)  
}  
//删除map的键值对  
delete(m, "banana")  
//map做为切片元素  
var mapSlice = make([]map[string]int, 3)  
mapSlice[0] = make(map[string]int)  
mapSlice[0]["test"] = 0  
//切片作为map的值  
mm := make(map[string][]string)  
mm["city"] = []string{"shaanxi", "hunan"}  
mm["city"] = append(mm["city"], "beijing", "shanghai")
```

# 线程安全性
线程不安全，如果需要线程安全，可通过两个手段
- [[为什么 Go map 和 slice 是非线程安全的？#对 map 上锁 |使用 RWMutex 上锁]]
- [[为什么 Go map 和 slice 是非线程安全的？#sync.Map|使用 sync.Map]]

# go 语言 map 的底层结构
## map 的访问原理
```go
// 当map中没有对应的key时，会返回value对应类型的零值
v     := map[key]
// 当map中没有对应的key时，除了会返回value对应类型的零值,还会返回一个值存不存在的布尔值
v, ok := map[key]    
```
[[map的取值流程|map的取值流程]]
## map的赋值原理
有两点需要注意：
1.  在对 map 进行赋值操作的时候，map 一定要先进行初始化，否则会 panic

2.  map 是非线程安全的，不支持并发读写操作。当有其他线程正在读写 map 时，执行 map 的赋值会报为并发读写错误

[[map的赋值流程|map的赋值流程]]
### map 的扩容
可以看到 map 会在两种情况下触发扩容：
- **map 的负载因子已经超过 6.5**
- **溢出桶的数量过多**

在扩容的时候还有一个条件 `!h.growing()`，这是因为 map 的扩容并不是一个原子操作不是一次性完成的，所以需要判断一下，当前 map 是否正处于扩容状态，避免二次扩容造成混乱。
而这两种情况下，扩容策略是不同的
- 负载因子已经超过 6.5： 双倍扩容
- 溢出桶的数量过多：等量扩容(一般认为溢出桶数量接近数组同数量时)

什么是负载因子？
```Plain
负载因子 = 哈希表中的元素数量 / 桶的数量 
```
**为什么负载因子是6.5？**
源码里对负载因子的定义是6.5，是经过测试后取出的一个比较合理的值，每个 bucket 有 8 个空位，假设map里所有的数组桶都装满元素，没有一个数组桶由溢出桶，那么这是的负载因子刚好是8。而负载因子是6.5的时候，说明数组同快要用完了，存在溢出的情况下，查找一个key很可能要去遍历溢出桶，会造成查找性能下降，所以有必要扩容了
**溢出桶的数量过多？**
可以想象一下这种情况，先往一个map插入很多元素，然后再删除很多元素？在插入很多元素。会造成什么问题？
由于插入了很多元素，在不是完全理想的情况下，肯定会创建一些溢出桶，但是，又由于没有达到负载因子的临界值，所以不会触发扩容，在删除很多元素，这个时候负载因子又会减小，再插入很多元素，会继续创建更多的溢出桶，导致查找元素的时候要去遍历很差过的溢出桶链表，性能下降，所以在这种情况下要进行扩容，新建一个桶数组，把原来的数据拷贝到里面，这样数据排列更紧密，查找性能更快。
