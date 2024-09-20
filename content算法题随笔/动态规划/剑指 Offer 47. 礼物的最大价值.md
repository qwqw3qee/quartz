---
tags:
  - leetcode
  - 动态规划
  - 滚动数组
  - dfs
  - 记忆化搜索
dg-publish: true
---
## 题目
题目：[剑指 Offer 47. 礼物的最大价值 - 力扣（LeetCode）](https://leetcode.cn/problems/li-wu-de-zui-da-jie-zhi-lcof/)
## 思路
### 一、dfs+记忆化搜索
直接 dfs 会超时，所以需要记忆化搜索剪枝
代码：
```go
func dfs(grid, cache [][]int, i, j , lenI, lenJ int) int{
    if cache[i][j] != 0{
        return cache[i][j]
    }
    if i == lenI-1 && j == lenJ-1 {
        return grid[i][j]
    } 
    if i == lenI - 1{
        cache[i][j] = grid[i][j] + dfs(grid, cache, i, j + 1,lenI, lenJ)
        return cache[i][j]
    }
    if j == lenJ - 1{
        cache[i][j] = grid[i][j] + dfs(grid, cache, i + 1, j,lenI, lenJ)
        return cache[i][j]
    }
    cache[i][j] = grid[i][j] + max(dfs(grid, cache, i+1, j,lenI,lenJ), dfs(grid, cache, i, j+1,lenI, lenJ))
    return cache[i][j]

} 
func max(x,y int) int {
    if x > y{
        return x
    }
    return y
}
func maxValue(grid [][]int) int {
    lenI := len(grid)
    lenJ := len(grid[0])
    cache := make([][]int,lenI)
    for i := range cache{
        cache[i] = make([]int, lenJ)
    } 
    return dfs(grid,cache,0,0,lenI,lenJ)
}
```

### 二、动态规划
状态转移方程：
$$
dp[i][j] = max(dp[i-1][j],dp[i][j-1])+grid[i][j]
$$
可用滚动数组优化压缩为一维数组。
代码：
```go
func maxValue(grid [][]int) int {
    m, n := len(grid), len(grid[0])
    dp := make([][]int,m)
    for i := range dp{
        dp[i] = make([]int, n)
    }
    dp[0][0] = grid[0][0]
    for i := 1; i < m; i++{
        dp[i][0] = dp[i-1][0] + grid[i][0] 
    }
    for j := 1; j < n; j++{
        dp[0][j] = dp[0][j-1] + grid[0][j]
    }
    for i := 1; i < m; i++{
        for j := 1; j < n; j++{
            dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        }
    }
    return dp[m-1][n-1]
}
func max(x,y int) int{
    if x < y{
        return y
    }
    return x
}
```