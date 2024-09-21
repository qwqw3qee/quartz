---
tags:
  - golang
  - interface
dg-publish: true
---
## 空接口 interface{}
没有定义任何方法的接口为空接口，空接口可以接收任意数据类型，就是说可以将任意类型的数据赋值给一个空接口，空接口的结构定义位于 `src/runtime/runtime2.go`, 定义如下:​
```go
type eface struct {​
   _type *_type​
   data  unsafe.Pointer​
}​
```
- `_type`：指向接口的动态类型元数据，即接口变量的类型​
- `data`：指向接口的动态值，data 是一个指向变量本身的指针
## 非空接口
非空接口的底层实现按与空接口有所不同，因为其多了方法列表，在底层实现中显然我们需要有地方来存储方法列表，非空接口的结构定义位于 `src/runtime/runtime2.go`, 定义如下:​
​
```go
type iface struct {​
   tab  *itab​
   data unsafe.Pointer​
}​
```
​
- `data`：指向接口的动态值，这里跟空接口一样​
- `tab`：指向一个 itab 的结构，itab 结构里面存储值接口要求的方法列表和 data 对应动态类型信息