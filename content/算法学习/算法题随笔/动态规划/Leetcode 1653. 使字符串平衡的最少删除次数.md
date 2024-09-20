---
tags:
  - leetcode
  - 动态规划
  - 前缀和
  - 贪心
dg-publish: true
---
## 题目
题目：[1653. 使字符串平衡的最少删除次数 - 力扣（LeetCode）](https://leetcode.cn/problems/minimum-deletions-to-make-string-balanced/)
## 思路
### 1、贪心+前缀和
遍历每个字母间隔，对于每一个间隔，有：
- 删除左侧的所有'b'，删除右侧的所有'a'

取删除数最小的间隔
### 2、动态规划
定义 dp\[i\]为前 i 个字符中的最小删除数, 有状态转移方程
$$
dp[i]=\begin{cases}
dp[i-1],&\text{s[i]=='b'}\\
min(dp[i-1]+1,count('b'))&\text{s[i]=='a'}
\end{cases}


$$
其中一维数组 dp 可压缩
代码：
```go
func minimumDeletions(s string) int {
    length := len(s)
    dp := 0
    cntB := 0
    if s[0] == 'b'{
        cntB++
    }
    for i:=1; i<length; i++{
        if s[i] == 'b'{
            cntB++
        }else{
            dp = min(dp + 1, cntB)
        }
    }
    return dp
}
func min(x,y int) int{
    if(x < y) {
        return x
    }
    return y
}
```