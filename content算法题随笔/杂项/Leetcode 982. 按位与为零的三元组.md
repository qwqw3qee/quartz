---
tags:
  - leetcode
  - 位运算
  - 状态压缩
  - 子集优化
  - 常数优化
dg-publish: true
---
题目：[982. 按位与为零的三元组 - 力扣（LeetCode）](https://leetcode.cn/problems/triples-with-bitwise-and-equal-to-zero/)

```go
func countTriplets(nums []int) int {
    mp := map[int]int{}
    for _,i := range nums{
        for _,j := range nums{
            mp[i&j]++
        }
    }
    res := 0
    for _,k := range nums{
        set := k ^ 0xffff
        for sub := set; sub > 0; sub = (sub-1)&set{
            res += mp[sub]
        }
        res += mp[0]
    }
    
    return res
}
```