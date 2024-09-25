---
dg-publish: true
tags:
  - golang
created: 2023-02-28T21:20:24.000+08:00
updated: 2024-09-23T15:56:29.310+08:00
---
## 排序
> 参考：[Golang sort包排序（详细全集）](https://blog.csdn.net/qq_43279457/article/details/121730095)
### 方法一 ：sort.Slice()方法
```go
package main  
  
import (  
   "fmt"  
   "sort"
)    
func main() {  
   arr := []int{8, 3, 5, 7, 1, 4}  
   sort.Slice(arr, func(i, j int) bool {  
      return arr[i] < arr[j]  
   })  
   fmt.Println(arr)  
}
```
### 方法二：在一开始时创建具有排序方法的切片
```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	arr := sort.IntSlice{8, 3, 5, 7, 1, 4}
	arr.Sort()
	fmt.Println(arr)
}

```
### 方法三 ：对自定义结构体的排序
```go
package main

import (
	"fmt"
	"sort"
)

type Point struct {
	x, y int
}
type Points []Point

func (p Points) Len() int {
	return len(p)
}
func (p Points) Less(i, j int) bool {
	if p[i].x != p[j].x {
		return p[i].x < p[j].x
	}
	return p[i].y < p[j].y
}
func (p Points) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}

func main() {
	arr := Points{{1, 2}, {1, 3}, {2, 3}}
	sort.Sort(arr)
	fmt.Println(arr)
}

```
注意：默认的 sort() 会自动选择快排、堆排序和插入排序，是不稳定排序，如果需要稳定排序，请使用 sort.Stable()(其使用的是归并排序)

## 二分查找
对一个完整的有序数组进行二分查找
```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	// 定义一个有序切片
	nums := []int{1, 2, 3, 3, 3, 4, 5, 6, 7}
	// 查找第一个大于 3 的元素的下标
	index := sort.Search(len(nums), func(i int) bool { return nums[i] > 3 })
	fmt.Println("upper_bound index:", index)
	// 查找第一个大于等于 3 的元素的下标
	index = sort.Search(len(nums), func(i int) bool { return nums[i] >= 3 })
	fmt.Println("lower_bound index:", index)
}

```
对子切片中的元素进行二分查找，可通过改造 Search()函数的参数实现
```go
package main

import (
	"fmt"
	"sort"
)

//LowerBound
/*
 * @input int st    起始位置
 * @input int ed    结束位置的后一位
 * @input int key   查找元素
 * @input []int arr 查找的数组
 * @return int      要查找的元素在子切片中的相对位置，在原切片中的位置为st+index
 */
func LowerBound(st, ed int, key int, arr []int) (index int) {
	return sort.Search(ed-st, func(i int) bool {
		return arr[st+i] >= key
	})
}
func UpperBound(st, ed int, key int, arr []int) (index int) {
	return sort.Search(ed-st, func(i int) bool {
		return arr[st+i] > key
	})
}
func main() {
	// 定义一个已排序的切片
	nums := []int{1, 2, 3, 4, 5, 5, 5, 5, 6, 7, 8, 9, 10}
	//index为在子切片中的位置，对应原切片st+index
	index := LowerBound(2, 8, 5, nums)
	fmt.Println("lower_bound index:", index)
	index = UpperBound(2, 8, 5, nums)
	fmt.Println("upper_bound index:", index)

}
```
