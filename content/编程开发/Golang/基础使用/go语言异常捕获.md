---
tags:
  - golang
  - error
dg-publish: true
created: 2023-05-04T17:16:36.000+08:00
updated: 2024-09-23T15:56:29.355+08:00
---
# recover 异常捕获

异常其实就是指程序运行过程中发生了panic，那么我们为了不让程序core，可以在程序中加入recover机制，将异常捕获，打印出异常，这样也方便我们定位错误。而捕获的方式我们之前在讲defer的时候也提到过，一般是用recover和defer搭配使用来捕获异常。

下面请看个具体例子：

```go
func main() {         
    defer func() {                 
        if error:=recover();error!=nil{   
            fmt.Println("出现了panic,使用reover获取信息:",error)   
        }         
    }()         
    fmt.Println("11111111111")        
    panic("出现panic")         
    fmt.Println("22222222222") 
 }
```

运行结果：

```go
11111111111
出现了panic,使用reover获取信息: 出现panic
```

注意，这里有了recover之后，程序不会在panic出中断，再执行完panic之后，会接下来执行defer recover函数，但是当前函数panic后面的代码不会被执行，但是调用该函数的代码会接着执行。

如果我们在main函数中为加入defer func(){...}，当我们的程序运行到底8行时就会panic掉，而通常在我们的业务程序中对于程序panic是不可容忍的，我们需要程序健壮的运行，而不是是不是因为一些panic挂掉又被拉起，所以当发生panic的时候我们要让程序能够继续运行，并且获取到放生panic的具体错误，这就可以用上述方法。

# panic传递

当一个函数发生了panic之后，若在当前函数中没有recover，会一直向外层传递直到主函数，如果迟迟没有recover的话，那么程序将终止。如果在过程中遇到了最近的recover，则将被捕获。

看下面例子：

```go
package main

import "fmt"

func testPanic1(){
   fmt.Println("testPanic1上半部分")
   testPanic2()
   fmt.Println("testPanic1下半部分")
}

func testPanic2(){
   defer func() {
      recover()
   }()
   fmt.Println("testPanic2上半部分")
   testPanic3()
   fmt.Println("testPanic2下半部分")
}

func testPanic3(){
   fmt.Println("testPanic3上半部分")
   panic("在testPanic3出现了panic")
   fmt.Println("testPanic3下半部分")
}

func main() {
   fmt.Println("程序开始")
   testPanic1()
   fmt.Println("程序结束")
}
```

运行结果：

```go
程序开始
testPanic1上半部分
testPanic2上半部分
testPanic3上半部分
testPanic1下半部分
程序结束
```

解析：

调用链：main-->testPanic1-->testPanic2-->testPanic3，但是在testPanic3中发现了一个panic，由于testPanic3没有recover，向上找，在testPanic2中找到了recover，panic被捕获了，程序接着运行，由于testPanic3发生了panic，所以不再继续运行，函数跳出返回到testPanic2，testPanic2中捕获到了panic，也不会再继续执行，跳出函数testPanic2，到了testPanic1接着运行。

所以recover和panic可以总结为以下两点：

1.  recover()只能恢复当前函数级或以当前函数为首的调用链中的函数中的panic(),恢复后调用当前函数结束,但是调用此函数的函数继续执行
    
2.  函数发生了panic之后会一直向上传递,如果直至main函数都没有recover()，程序将终止，如果是碰见了recover()，将被recover捕获。
    

# panic在多goroutine中的表现

并发环境下的异常捕获将会在go并发编程中的goroutine小节中介绍