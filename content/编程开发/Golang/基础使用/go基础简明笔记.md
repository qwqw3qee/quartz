---
tags:
  - golang
dg-publish: true
created: 2023-04-11T23:53:45.000+08:00
updated: 2024-09-23T15:56:29.364+08:00
---
## 结构
## 变量
### 变量声明
指定变量类型，如果没有初始化，则变量默认为零值。
- 数值类型（包括 complex64/128）为 **0**
- 布尔类型为 **false**
- 字符串为 **""**（空字符串）
- 以下几种类型为 **nil**：

```go
var a *int
var a []int
var a map[string] int
var a chan int
var a func(string) int
var a error // error 是接口
```
## 条件句
###  `switch`
switch 中，每个 case 都默认 break。即如果是 case1，那么执行完之后，就会跳出 switch 条件选择。如果希望从某个 case 顺序往下执行，可以使用 fallthrough 关键字。
## 数组与切片
## 循环
###  `for range`
for range取不到所有元素的地址
### 对大数组重置的效率问题
```go
//假设值都为1，这里只赋值3个
var arr = [204800]int{1, 1, 1} 
for i, _ := range &arr {
    arr[i] = 0
}
```
答案是：重置的效率很高
因为 go 对这种重置元素值为默认值的遍历是有优化，详见源码：[go源码：memclrrange](https://link.zhihu.com/?target=https%3A//github.com/golang/go/blob/ea020ff3de9482726ce7019ac43c1d301ce5e3de/src/cmd/compile/internal/gc/range.go%23L363)
## 函数
### 函数闭包
## 常量
## 运算符
## 指针
## 结构体
## 方法
## 接口
当某一种类型实现了所有这些声明的方法，那么就称这种类型为该接口的一种实现。
### 空接口
所有的类型都实现了空接口，因此空接口可以存储任意类型的数值
`Golang` 很多库的源代码都会以空接口作为参数，表示接受任意类型的参数
```go
package main

import (
    "fmt"
)

func main() {
    var any interface{}
    any = 10
    fmt.Println(any)

    any = "golang"
    fmt.Println(any)

    any = true
    fmt.Println(any)
}
```
运行结果：
```go
10
golang
true
```
### 类型断言（Type Assertion）
断言的一般格式为：
```go
value, ok := x.(T)   // x为接口类型，ok为bool类型
```
- T 是具体某个类型，类型断言会检查 x 的动态类型是否等于具体类型 T。如果检查成功，类型断言返回的结果是 x 的值，其类型是 T。  
- T 是接口类型，类型断言会检查 x 的动态类型是否满足 T。如果检查成功，返回值是一个类型为 T 的接口值。   
- 无论 T 是什么类型，如果 x 是 nil 接口值，类型断言都会失败。

##  `error` 类型
[[./go语言error|go语言error]]
##  `defer` 关键字
[[./defer|defer]]
[[./defer执行顺序问题|defer执行顺序问题]]
##  `panic/recover` 异常捕获
[[./go语言异常捕获|go语言异常捕获]]