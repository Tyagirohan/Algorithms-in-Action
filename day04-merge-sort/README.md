# 🏁 Sorting Algorithm Race - Merge Sort Visualizer

**Day 4 of #AlgorithmsInAction** 🚀

An interactive sorting visualizer that showcases Merge Sort's divide-and-conquer strategy through three powerful modes: deep dive visualization, head-to-head algorithm comparison, and step-by-step manual control.

## 🎯 Concept: Merge Sort

Merge Sort is a **divide-and-conquer** algorithm that consistently performs in O(n log n) time, making it one of the most efficient and predictable sorting algorithms available.

### Time Complexity
- **Best Case**: O(n log n)
- **Average Case**: O(n log n)
- **Worst Case**: O(n log n) - Consistently fast!
- **Space Complexity**: O(n) - Requires auxiliary space

## ✨ Features

### 🎯 Mode 1: Merge Sort Deep Dive
- **Recursion tree visualization** showing the divide process
- **Live merge operations** with animated comparisons
- **Step-by-step descriptions** of what's happening
- **Real-time statistics**: comparisons, array accesses, time
- **Color-coded bars**: Current operation highlighted

### ⚔️ Mode 2: Algorithm Race
- **Side-by-side comparison** of three algorithms:
  - 🫧 **Bubble Sort** (O(n²)) - Simple but slow
  - 🎯 **Selection Sort** (O(n²)) - Fewer swaps
  - 🏆 **Merge Sort** (O(n log n)) - The winner!
- **Independent counters** for each algorithm
- **Visual speed difference** - watch Merge Sort dominate
- **Completion time tracking**

### 👣 Mode 3: Step-by-Step
- **Manual control** through each sorting step
- **Detailed explanations** for every operation
- **Perfect for learning** and understanding the process
- **Next Step button** to advance at your own pace

### 🎨 Visual Elements
- **Animated bars** with smooth transitions
- **Color coding**:
  - 🟣 Pink: Normal state
  - 🔴 Red: Being compared
  - 🟡 Yellow: Being swapped
  - 🟢 Green: Sorted
  - 🔵 Blue: Current operation
- **5 preset arrays**: Random, Reversed, Already Sorted, All Same, Small Mix
- **Random array generator** (5-50 elements)
- **Adjustable animation speed** (50ms-2000ms)

## 🧠 How Merge Sort Works

### The Three Phases

**1. Divide ✂️**
```
[64, 34, 25, 12, 22, 11, 90, 85]
         ↓
[64, 34, 25, 12] | [22, 11, 90, 85]
         ↓
[64, 34] | [25, 12] | [22, 11] | [90, 85]
         ↓
[64] [34] [25] [12] [22] [11] [90] [85]
```

**2. Conquer ⚔️**
- Base case: Single elements are already sorted!

**3. Merge 🔀**
```
[64] [34] → [34, 64]
[25] [12] → [12, 25]
[34, 64] [12, 25] → [12, 25, 34, 64]

[22] [11] → [11, 22]
[90] [85] → [85, 90]
[11, 22] [85, 90] → [11, 22, 85, 90]

[12, 25, 34, 64] [11, 22, 85, 90] → [11, 12, 22, 25, 34, 64, 85, 90]
```

### The Merge Process
```javascript
// Merging two sorted arrays
Left:  [12, 25, 34, 64]
Right: [11, 22, 85, 90]

Compare 12 vs 11 → Take 11
Compare 12 vs 22 → Take 12
Compare 25 vs 22 → Take 22
Compare 25 vs 85 → Take 25
... and so on

Result: [11, 12, 22, 25, 34, 64, 85, 90]
```

## 🛠️ Tech Stack

- **Vanilla JavaScript**: Core algorithm implementations
- **HTML5**: Semantic structure
- **CSS3**: Gradient animations and transitions
- **No Dependencies**: Pure web technologies!

## 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/Tyagirohan/Algorithms-in-Action.git
cd Algorithms-in-Action/day04-merge-sort
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

No build process needed!

## 💡 Key Learnings

### Why Merge Sort Wins

**⏱️ Consistent Performance**
- Always O(n log n), regardless of input
- No "worst-case nightmare" like QuickSort

**📏 Predictable**
- Sorted, reversed, or random - same speed!
- Perfect for guaranteed performance

**✅ Stable**
- Preserves relative order of equal elements
- Important for multi-key sorting

**🔧 Parallelizable**
- Each half can be sorted independently
- Perfect for multi-core processors

### Performance Comparison

For an array of **1,000 elements**:

| Algorithm | Comparisons | Time Complexity |
|-----------|-------------|-----------------|
| Bubble Sort | ~500,000 | O(n²) |
| Selection Sort | ~500,000 | O(n²) |
| Merge Sort | ~10,000 | O(n log n) |

**Merge Sort is 50× faster!** 🚀

### When to Use Each Algorithm

**Merge Sort ✅**
- Large datasets
- Need guaranteed O(n log n)
- Stability matters
- External sorting (databases)

**Bubble Sort 🫧**
- Teaching purposes
- Nearly sorted data
- Very small arrays (<10 elements)

**Selection Sort 🎯**
- Minimizing swaps is critical
- Small arrays
- Memory writes are expensive

## 🎮 Try These Examples

### See the Speed Difference
1. **Select "Algorithm Race" mode**
2. **Use "Random" preset** (8 elements)
3. **Click "Start Sort"**
4. **Watch** Merge Sort finish while others are halfway!

### Understand the Process
1. **Select "Merge Sort Only" mode**
2. **Use "Small Mix" preset** (10 elements)
3. **Set speed to 1000ms** (slower)
4. **Watch the divide & conquer** magic!

### Test Edge Cases
- **Already Sorted**: See why O(n log n) is still required
- **Reversed**: Watch Merge Sort handle worst case easily
- **All Same**: Observe stable sorting behavior

## 🌟 Real-World Applications

### External Sorting
- Sorting massive datasets that don't fit in RAM
- Database systems use merge sort variants
- Example: Sorting 1TB of data on disk

### Linked Lists
- O(1) merge operation for linked lists
- No random access needed
- More efficient than QuickSort for linked lists

### Inversion Count
- Count pairs (i, j) where i < j but arr[i] > arr[j]
- Used in collaborative filtering
- Recommendation systems

### Parallel Processing
- Divide phase is naturally parallel
- Multi-threaded implementations
- GPU acceleration possible

### Stable Sorting
- Sorting database records by multiple keys
- Maintaining original order for equal elements
- Critical for some applications

## 📊 Complexity Analysis

### Time Complexity Breakdown

**Divide**: O(log n) - Keep splitting in half
```
Level 0: 1 array of n elements
Level 1: 2 arrays of n/2 elements
Level 2: 4 arrays of n/4 elements
...
Level log n: n arrays of 1 element
```

**Merge**: O(n) per level - Compare and merge all elements
```
Each level processes all n elements once
```

**Total**: O(n) × O(log n) = **O(n log n)**

### Space Complexity
- **Auxiliary Space**: O(n) for temporary arrays
- **Call Stack**: O(log n) for recursion depth
- **Total**: O(n)

## 🎨 UI Highlights

- **Mint-to-pink gradient theme** (Day 4 signature color)
- **Three distinct visualization modes**
- **Smooth bar animations** with color transitions
- **Real-time stats** for all algorithms
- **Pause/Resume** functionality
- **Preset arrays** for quick testing
- **Responsive design** for all devices

## 🔗 Links

- **Live Demo**: [View Live](https://tyagirohan.github.io/Algorithms-in-Action/day04-merge-sort/)
- **GitHub Repo**: [Algorithms in Action](https://github.com/Tyagirohan/Algorithms-in-Action)
- **Previous Projects**: 
  - [Day 1 - Binary Search](../day01-binary-search/)
  - [Day 2 - Two Pointers](../day02-two-pointers/)
  - [Day 3 - Sliding Window](../day03-sliding-window/)
- **LinkedIn**: [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)

## 🎯 What's Next?

**Day 5**: Dijkstra's Algorithm - City Route Planner

---

**Built with ❤️ by Rohan Tyagi**

*Part of the Algorithms in Action series - Mastering algorithms through interactive visualizations*

#AlgorithmsInAction #MergeSort #Sorting #DSA #WebDevelopment #JavaScript

