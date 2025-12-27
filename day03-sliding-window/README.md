# 📈 Sliding Window - Stock Market Analyzer

**Day 3 of #AlgorithmsInAction** 🚀

An interactive stock market analyzer that demonstrates the Sliding Window technique through three different algorithmic problems: maximum profit windows, longest gain streaks, and maximum subarray sums.

## 🎯 Concept: Sliding Window

The Sliding Window technique maintains a "window" of elements and efficiently slides it across a data structure, updating calculations incrementally rather than recalculating from scratch. This optimization reduces time complexity from O(n×k) to O(n).

### Time Complexity
- **Brute Force**: O(n×k) - Recalculate entire window each time
- **Sliding Window**: O(n) - Reuse previous calculations
- **Space Complexity**: O(1) - Only store window boundaries

## ✨ Features

### 💰 Problem 1: Max Profit in K Days
- **Find the best K-day window** for maximum total profit
- **Fixed window size** sliding through stock prices
- **Visual comparison** of all possible windows
- **Real-time sum calculation** as window slides

### 📊 Problem 2: Longest Gain Streak
- **Find longest consecutive days** of price increases
- **Variable window** that grows/shrinks dynamically
- **Streak tracking** with visual highlighting
- **Break detection** when prices drop

### 🎯 Problem 3: Maximum Subarray Sum (Kadane's Algorithm)
- **Find the subarray** with the largest sum
- **Dynamic window** adjustment based on running sum
- **Handles negative numbers** intelligently
- **Classic DP + Sliding Window** combination

### 🎨 Visual Elements
- **Animated bar chart** showing stock prices
- **Live chart** with price trends
- **Color-coded windows**:
  - 🔵 Blue: Normal bars
  - 🟢 Green: Current window being checked
  - 🟠 Orange: Best window found
- **Real-time statistics** dashboard
- **4 preset scenarios**: Bull Market, Bear Market, Volatile, Steady Growth

## 🧠 How Sliding Window Works

### The Magic of Incremental Calculation

**Brute Force Approach:**
```javascript
// Recalculate entire window each time - O(n×k)
for (let i = 0; i <= arr.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
        sum += arr[j];  // Recalculating everything!
    }
    maxSum = Math.max(maxSum, sum);
}
```

**Sliding Window Approach:**
```javascript
// Reuse calculations - O(n)
let windowSum = calculateInitialWindow(arr, k);
let maxSum = windowSum;

for (let i = k; i < arr.length; i++) {
    // Just subtract left and add right!
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
}
```

### The Key Insight
Instead of recalculating the sum of all K elements:
- **Remove** the leftmost element that's leaving the window
- **Add** the rightmost element that's entering the window
- Result: O(1) operation per slide instead of O(k)

## 🛠️ Tech Stack

- **Vanilla JavaScript**: Core algorithm implementation
- **Canvas API**: Real-time stock chart rendering
- **HTML5**: Semantic structure
- **CSS3**: Gradient animations and responsive design
- **No Dependencies**: Pure web technologies!

## 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/Tyagirohan/Algorithms-in-Action.git
cd Algorithms-in-Action/day03-sliding-window
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

### Performance Improvement

For an array of **1,000 elements** with window size **100**:

| Approach | Time Complexity | Operations | Speed |
|----------|----------------|------------|-------|
| Brute Force | O(n×k) | ~90,000 | Baseline |
| Sliding Window | O(n) | ~1,000 | **90× faster!** |

### When to Use Sliding Window

✅ **Perfect For:**
- Fixed or variable size subarrays/substrings
- Contiguous sequences
- Moving averages
- Maximum/minimum in windows
- Substring problems with constraints

❌ **Not Suitable For:**
- Non-contiguous subsequences
- Problems requiring element reordering
- When you need to consider all combinations

### Problem Patterns

**Fixed Window:**
- Window size is constant
- Slide by exactly 1 position
- Example: Max sum of K consecutive elements

**Variable Window:**
- Window size changes based on conditions
- May grow or shrink
- Example: Longest substring without repeating characters

**Dynamic Window (Kadane's):**
- Window resets when sum becomes negative
- Optimal subarray problem
- Example: Maximum subarray sum

## 🎮 Try These Examples

### Max Profit (Fixed Window)
**Data**: `10,15,12,20,18,25,22,30`  
**Window**: `3 days`  
**Result**: Days 6-8 (18, 25, 22, 30) = Best profit window

### Longest Gain Streak
**Data**: `50,45,48,42,40,38,35,32` (Bear Market)  
**Result**: Days 2-3 only 2-day streak in downtrend

### Maximum Subarray
**Data**: `20,22,18,25,21,24,19,28,26,30`  
**Result**: Entire array (all positive) = Maximum sum

## 🌟 Real-World Applications

### Financial
- 📈 **Moving Averages**: SMA, EMA calculations
- 💰 **Trading Strategies**: Best buy/sell windows
- 📊 **Risk Analysis**: Volatility in time periods
- 💳 **Fraud Detection**: Unusual transaction patterns

### Data Analysis
- 🌡️ **Weather**: Average temperature trends
- 🚗 **Traffic**: Peak hour analysis
- 📱 **App Analytics**: User engagement windows
- 🏃 **Fitness**: Performance metrics over intervals

### String Processing
- 🔍 **Pattern Matching**: Substring search
- 📝 **Text Analysis**: Word frequency in passages
- 🔐 **Validation**: Password strength checks
- 🧬 **Bioinformatics**: DNA sequence analysis

## 🎨 UI Highlights

- **Cyan-to-blue gradient theme** (Day 3 signature color)
- **Dual visualization**: Bar chart + line chart
- **Smooth animations** with adjustable speed (100ms-2000ms)
- **Three problem modes** with easy switching
- **Quick preset buttons** for instant demos
- **Comprehensive stats panel** with live updates
- **Fully responsive** design for all devices

## 📊 Algorithm Variations Implemented

1. **Fixed Window Maximum Sum** - Classic sliding window
2. **Variable Window (Longest Streak)** - Two-pointer variation
3. **Kadane's Algorithm** - DP with sliding window principles

## 🔗 Links

- **Live Demo**: [View Live](https://tyagirohan.github.io/Algorithms-in-Action/day03-sliding-window/)
- **GitHub Repo**: [Algorithms in Action](https://github.com/Tyagirohan/Algorithms-in-Action)
- **Previous Projects**: 
  - [Day 1 - Binary Search](../day01-binary-search/)
  - [Day 2 - Two Pointers](../day02-two-pointers/)
- **LinkedIn**: [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)

## 🎯 What's Next?

**Day 4**: Merge Sort - Sorting Algorithm Race

---

**Built with ❤️ by Rohan Tyagi**

*Part of the Algorithms in Action series - Learning algorithms through interactive visualizations*

#AlgorithmsInAction #SlidingWindow #DSA #StockMarket #WebDevelopment #JavaScript

