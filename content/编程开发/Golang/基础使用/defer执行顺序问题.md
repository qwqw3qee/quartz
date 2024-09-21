---
tags:
  - golang
  - defer
dg-publish: true
---
# defer 与 return
前面第一小节我们介绍过defer函数的执行是在return的时候，那么在具体一点，在return的时候，defer具体做了什么？又会带来什么结果？这是一个非常值得探讨的问题，也是面试官在面试中经常会问的问题，往往通过这个问题就可一看出一个面试者对go语言掌握的扎不扎实。

看下面例子：

```go
package main

import "fmt"


func deferRun() {
  var num = 1
  defer fmt.Printf("num is %d", num)
  
  num = 2
  return
}

func main(){
    deferRun()
}
```

运行结果：

```go
num is 1
```

为什么？

延迟函数 **defer** fmt.Printf("num is %d", num) 的参数num在 defer 语句出现的时候就已经确定，num=1，所以不管后面怎么修改 a 的值，最终调用defer函数传递给defer函数的参数已经固定是1了，不会再变化。

例子2:

```go
package main

import "fmt"

func main() {
 deferRun()
}

func deferRun() {
 var arr = [4]int{1, 2, 3, 4}
 defer printArr(&arr)
 
 arr[0] = 100
 return
}

func printArr(arr *[4]int) {
 for i := range arr {
  fmt.Println(arr[i])
 }
}
```

运行结果：

```go
100
2
3
4
```

为什么？

通过前一个地址，我们知道在defer出现的时候，参数已经确定，但是这里传递的是地址，地址没变，但是地址对应的内容被修改了，所以输出会被修改。

在看下面例子：

```go
package main

import "fmt"

func main() {
   res := deferRun()
   fmt.Println(res)
}

func deferRun() (res int) {
  num := 1
  
  defer func() {
    res++
  }()
  
  return num
}
```

运行结果：

```go
2
```

为什么？

这是一个非常经典的例子，要想准确的的只程序的执行结果，需要我们对函数return的执行有一个细致的了解。其实函数的return并非一个原子操作，return的过程可以被分解为以下三步：
1.  设置返回值
2.  执行defer语句
3.  将结果返回   

所以，在本例中，第一步是讲result的值设置为num，此时还未执行defer，num的值是1，所以result被设置为1，然后再执行defer语句讲result+1，最终将result返回，所以会打印出2

继续看下面例子：

```go
package main

import "fmt"

func main() {
    res := deferRun()
    fmt.Println(res)
}

func deferRun() int {
  var num int
  defer func() {
    num++
  }()
  
  return 1
}
```
运行结果：
```go
1
```

本例和前面的区别返回值是匿名的，但是我们可以同样运用上面的思路，自己创建一个返回值，这里假设为res，运用前面的思路分析，第一步讲res设置为1，第二步执行defer将num+1，第三步将res返回，所以最终结果是1。

继续看：

```go
package main

import "fmt"

func main() {
    res := deferRun()
    fmt.Println(res)
}

func deferRun() int {
  num := 1
  defer func() {
    num++
  }()
  
  return num
}
```

运行结果：

```go
1
```

同样的思路不难分析：自己创建一个返回值，这里假设为res，第一步讲res设置为num，所以res的值为1，第二步执行defer将num+1，此时num为2，但是res为1，第三步将res返回，所以最终结果是1。

接着看：

```go
package main

import "fmt"

func main() {
    res := deferRun()
    fmt.Println(res)
}

func deferRun() (res int) {
  num := 1
  defer func() {
    num++
  }()
  
  return num
}
```

运行结果：

```go
1
```

不难分析运行结果还是1，同样的三步分析法，因为defer改变的是num的值，而不是改变的res的值，所以结果不会变，不过defer函数里变为res++，那么结果就是2了。

所以，当我们碰到defer与return确定最终的返回值，可以总结为以下两点：

1.  defer 定义的延迟函数的参数在 defer 语句出时就已经确定下来了
2.  return 不是原子级操作，执行过程是: 设置返回值—>执行 defer 语句—>将结果返回