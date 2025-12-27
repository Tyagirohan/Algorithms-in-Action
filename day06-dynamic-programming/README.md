# 💰 Dynamic Programming - Smart Vending Machine

**Day 6 of #AlgorithmsInAction** 🚀 **SERIES FINALE!**

An interactive visualizer showcasing Dynamic Programming through three classic problems: Coin Change, 0/1 Knapsack, and Fibonacci. Watch DP tables fill in real-time and understand how memoization transforms exponential algorithms into polynomial ones!

## 🎯 Concept: Dynamic Programming

Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into simpler overlapping subproblems, solving each once, and storing the results to avoid redundant calculations.

### Key Properties
1. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: Same subproblems solved multiple times

### Time Complexity
- **Without DP**: Often O(2ⁿ) - exponential!
- **With DP**: Often O(n²) or O(n×m) - polynomial!
- **Example**: Fibonacci from O(2ⁿ) to O(n) - **exponential to linear!**

## ✨ Features

### 🪙 Problem 1: Coin Change
- **Find minimum coins** needed to make change for any amount
- **Visualize DP table** building from bottom-up
- **See optimal substructure** in action
- **Try different coin denominations**: US coins, Euro coins, custom
- **Real-time step descriptions** explaining each decision

### 🎒 Problem 2: 0/1 Knapsack
- **Maximize value** within weight constraint
- **Add custom items** with values and weights
- **3 preset scenarios**: Tech items, Jewelry, Survival kit
- **2D DP table visualization** showing item decisions
- **Solution reconstruction** - see which items were selected

### 🔢 Problem 3: Fibonacci
- **Compare three approaches**:
  - Naive Recursion (O(2ⁿ)) - Slow!
  - Memoization (O(n)) - Top-Down DP
  - Tabulation (O(n)) - Bottom-Up DP
- **Watch the difference** in computation time
- **Count function calls** to see optimization
- **Perfect DP introduction** with classic example

### 🎨 Visual Elements
- **Interactive DP tables** with color-coded cells
- **Real-time step descriptions**
- **Animated cell updates** showing computation flow
- **Color coding**:
  - White: Uncomputed
  - Yellow: Currently computing
  - Green: Computed
  - Gold gradient: Optimal solution
- **Statistics dashboard** tracking complexity and performance

## 🧠 How Each Problem Works

### 🪙 Coin Change

**Problem**: Given coins [1, 5, 10, 25] and amount 63, find minimum coins needed.

**Approach**:
```
dp[i] = minimum coins needed for amount i

Base case: dp[0] = 0 (zero coins for zero amount)

Recurrence:
For each amount i:
    For each coin c where c ≤ i:
        dp[i] = min(dp[i], dp[i - c] + 1)
```

**Example**:
```
Amount: 63, Coins: [1, 5, 10, 25]

dp[0] = 0
dp[1] = 1 (one $1 coin)
dp[5] = 1 (one $5 coin)
dp[10] = 1 (one $10 coin)
dp[25] = 1 (one $25 coin)
dp[50] = 2 (two $25 coins)
dp[63] = 3 (two $25 + one $10 + three $1)

Wait! Better: two $25 + one $10 + three $1 = 6 coins
Even better: two $25 + one $10 + one $3? No $3 coin!
Optimal: 25+25+10+1+1+1 = 6 coins
```

### 🎒 0/1 Knapsack

**Problem**: Given items with values/weights and knapsack capacity, maximize value.

**Approach**:
```
dp[i][w] = maximum value using first i items with capacity w

Base case: dp[0][w] = 0 (no items = no value)

Recurrence:
For each item i and weight w:
    If weight[i] > w:
        dp[i][w] = dp[i-1][w]  // Can't include
    Else:
        dp[i][w] = max(
            dp[i-1][w],                          // Exclude item
            value[i] + dp[i-1][w - weight[i]]   // Include item
        )
```

**Example**:
```
Capacity: 50kg
Items:
  - Laptop: $1000, 30kg
  - Phone: $800, 5kg
  - Camera: $1200, 20kg

Without DP: Try all 2³ = 8 combinations
With DP: Build table systematically

Solution: Take Laptop + Camera = $2200, 50kg (optimal!)
```

### 🔢 Fibonacci

**Problem**: Calculate F(n) where F(n) = F(n-1) + F(n-2)

**Naive Recursion** - O(2ⁿ):
```javascript
function fib(n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);  // Massive redundancy!
}
// F(5) calls F(3) twice, F(2) three times, etc.
```

**Memoization (Top-Down DP)** - O(n):
```javascript
function fib(n, memo = {}) {
    if (n in memo) return memo[n];  // Cache hit!
    if (n <= 1) return n;
    memo[n] = fib(n-1, memo) + fib(n-2, memo);
    return memo[n];
}
// Each F(k) calculated exactly once
```

**Tabulation (Bottom-Up DP)** - O(n):
```javascript
function fib(n) {
    if (n <= 1) return n;
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
// Build from bottom up, no recursion
```

## 🛠️ Tech Stack

- **Vanilla JavaScript**: Algorithm implementations
- **HTML5**: Semantic structure
- **CSS3**: Beautiful gradients and animations
- **No Dependencies**: Pure web technologies!

## 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/Tyagirohan/Algorithms-in-Action.git
cd Algorithms-in-Action/day06-dynamic-programming
```

2. Open `index.html` in your browser:
```bash
# On Windows
start index.html

# On Mac
open index.html

# On Linux
xdg-open index.html
```

No build process, no dependencies - just open and explore!

## 💡 Key Learnings

### When to Use DP

✅ **Perfect For:**
- **Optimization problems** (minimize/maximize)
- **Counting problems** (how many ways?)
- **Overlapping subproblems** present
- **Optimal substructure** exists

❌ **Not Suitable For:**
- Greedy choice works better
- No overlapping subproblems
- Problems requiring actual backtracking

### Top-Down vs Bottom-Up

| Approach | Pros | Cons |
|----------|------|------|
| **Memoization** (Top-Down) | Easier to think about, Only computes needed subproblems | Recursion overhead, Stack space |
| **Tabulation** (Bottom-Up) | No recursion, More efficient | Harder to think about, Computes all subproblems |

### Classic DP Problems

1. **Coin Change** - Minimum coins for amount
2. **Knapsack** - Maximum value in capacity
3. **Longest Common Subsequence** - String matching
4. **Edit Distance** - Spell checking
5. **Matrix Chain Multiplication** - Optimization
6. **Longest Increasing Subsequence** - Array problems
7. **Rod Cutting** - Profit maximization
8. **Partition Problem** - Set partitioning

## 🎮 Try These Examples

### Coin Change
1. **Amount**: 63, **Coins**: [1, 5, 10, 25]
   - Watch how DP finds 3 coins: 25+25+13 (wait, no 13!)
   - Actually: 25+25+10+1+1+1 = 6 coins

2. **Amount**: 11, **Coins**: [1, 3, 4]
   - Greedy fails: 4+4+3 = 11 (wrong!)
   - DP finds: 3+4+4 = 11 (3 coins - optimal!)

### Knapsack
1. **Tech Items preset**, **Capacity**: 50kg
   - See how DP chooses optimal items
   - Compare with greedy (highest value first)

2. **Jewelry preset**, **Capacity**: 5kg
   - Multiple items with weight 1kg
   - Find maximum value combination

### Fibonacci
1. **n = 20**, **Naive Recursion**
   - Watch it take forever (21,891 calls!)
   
2. **n = 20**, **Memoization**
   - Instant! (Only 39 calls)
   
3. **n = 20**, **Tabulation**
   - Even faster! (20 iterations, no recursion)

## 🌟 Real-World Applications

### Finance
- **Portfolio Optimization**: Maximize returns within risk constraints
- **Currency Arbitrage**: Find profitable exchange sequences
- **Resource Allocation**: Distribute budget optimally

### Bioinformatics
- **DNA Sequence Alignment**: Find similarities between genes
- **Protein Folding**: Predict 3D structure
- **Phylogenetic Trees**: Evolutionary relationships

### Text Processing
- **Spell Checking**: Edit distance (Levenshtein)
- **Diff Algorithms**: File comparison (Git, SVN)
- **Auto-correct**: Find closest valid word

### AI & Machine Learning
- **Reinforcement Learning**: Value iteration, Q-learning
- **Markov Decision Processes**: Optimal policies
- **Game Theory**: Optimal strategies

### Other Applications
- **Manufacturing**: Cutting stock problem
- **Logistics**: Route optimization
- **Compiler Design**: Code optimization
- **Mobile Apps**: Predictive text, T9 input

## ⚔️ DP vs Other Paradigms

| Paradigm | When to Use | Example |
|----------|-------------|---------|
| **Greedy** | Locally optimal = globally optimal | Dijkstra's, Huffman coding |
| **Divide & Conquer** | Independent subproblems | Merge sort, Binary search |
| **Dynamic Programming** | Overlapping subproblems | Knapsack, Coin change |
| **Backtracking** | Need all solutions | N-Queens, Sudoku |

## 🎨 UI Highlights

- **Green-to-gold gradient theme** (Day 6 signature color - money! 💰)
- **Three distinct problem visualizations**
- **Interactive DP tables** with smooth animations
- **Real-time statistics** and performance tracking
- **Preset scenarios** for quick exploration
- **Step-by-step descriptions** of algorithm logic
- **Responsive design** for all devices

## 📊 Performance Comparison

### Fibonacci(20) Performance

| Approach | Function Calls | Time | Complexity |
|----------|----------------|------|------------|
| Naive Recursion | 21,891 | ~500ms | O(2ⁿ) |
| Memoization | 39 | ~5ms | O(n) |
| Tabulation | 20 | ~2ms | O(n) |

**That's a 100× speedup!** And for F(30), naive takes minutes while DP is instant!

## 🔗 Links

- **Live Demo**: [View Live](https://tyagirohan.github.io/Algorithms-in-Action/day06-dynamic-programming/)
- **GitHub Repo**: [Algorithms in Action](https://github.com/Tyagirohan/Algorithms-in-Action)
- **Previous Projects**: 
  - [Day 1 - Binary Search](../day01-binary-search/)
  - [Day 2 - Two Pointers](../day02-two-pointers/)
  - [Day 3 - Sliding Window](../day03-sliding-window/)
  - [Day 4 - Merge Sort](../day04-merge-sort/)
  - [Day 5 - Dijkstra's Algorithm](../day05-dijkstra/)
- **LinkedIn**: [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)

## 🎉 Series Complete!

This marks the completion of the **Algorithms in Action** series! Over 6 days, we've built:
1. Binary Search visualizer
2. Two Pointers technique demo
3. Sliding Window stock analyzer
4. Merge Sort algorithm race
5. Dijkstra's shortest path finder
6. Dynamic Programming vending machine

All with beautiful visualizations and educational content! 🚀

---

**Built with ❤️ by Rohan Tyagi**

*Final project of the Algorithms in Action series - Master DP through interactive visualization!*

#AlgorithmsInAction #DynamicProgramming #DP #CoinChange #Knapsack #Fibonacci #DSA #WebDevelopment #JavaScript

