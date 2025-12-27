# 🗺️ Dijkstra's Algorithm - City Route Planner

**Day 5 of #AlgorithmsInAction** 🚀

An interactive graph visualizer that demonstrates Dijkstra's shortest path algorithm through a beautiful city network map. Build your own networks, explore preset cities, and watch the algorithm find optimal routes in real-time!

## 🎯 Concept: Dijkstra's Algorithm

Dijkstra's Algorithm is a **greedy graph search algorithm** that finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It's the foundation of modern GPS navigation and network routing!

### Time Complexity
- **With Priority Queue**: O((V + E) log V)
- **With Array**: O(V²)
- **Space Complexity**: O(V) for distance and visited tracking

Where V = number of vertices (cities) and E = number of edges (roads)

## ✨ Features

### 🎮 Mode 1: Interactive Mode
- **Build your own city network** from scratch
- **Add cities** with custom names
- **Create roads** between cities with distances
- **Find shortest paths** between any two cities
- **Random network generator** for quick testing
- **Visual graph** with draggable nodes (canvas-based)

### 🏙️ Mode 2: Preset Cities
- **4 pre-built networks**:
  - 🏘️ Simple Network (5 cities)
  - 🌆 Complex City (8 cities, multiple routes)
  - 🛣️ Highway System (10 real US cities)
  - 🚇 Metro Network (dense connections)
- **Ready to explore** - instant pathfinding
- **Different scenarios** showcasing algorithm behavior

### 👣 Mode 3: Step-by-Step
- **Manual control** through algorithm execution
- **Watch each iteration** of Dijkstra's process
- **Perfect for learning** how the algorithm works
- **See distance updates** in real-time

### 🎨 Visual Elements
- **Interactive canvas** with beautiful graph rendering
- **Color-coded nodes**:
  - 🟣 Purple: Unvisited cities
  - 🟡 Yellow: Current city being processed
  - 🟢 Green: Visited cities
  - 🔴 Red: Shortest path
- **Distance table** showing algorithm progress
- **Real-time statistics** tracking
- **Animated pathfinding** with adjustable speed

## 🧠 How Dijkstra's Algorithm Works

### The Greedy Strategy

Dijkstra's makes the **greedy choice** of always visiting the unvisited node with the smallest known distance. This guarantees finding the shortest path!

### Step-by-Step Process

**1. Initialize**
```
Set distance[start] = 0
Set distance[all others] = ∞
Mark all nodes as unvisited
```

**2. Main Loop**
```
While unvisited nodes exist:
    1. Pick unvisited node with minimum distance (greedy!)
    2. For each neighbor:
        - Calculate: new_distance = current_distance + edge_weight
        - If new_distance < neighbor_distance:
            - Update neighbor_distance
            - Set previous[neighbor] = current
    3. Mark current node as visited
```

**3. Reconstruct Path**
```
Start from destination
Follow previous[] pointers back to source
Reverse to get final path
```

### Example Walkthrough

**Network:**
```
    A --4-- B
    |       |
    2       5
    |       |
    C --8-- D
    |       |
   10       2
    |       |
    E ------+
```

**Finding shortest path from A to E:**

```
Step 1: Start at A (distance = 0)
  - Update B: 0 + 4 = 4
  - Update C: 0 + 2 = 2
  
Step 2: Visit C (smallest distance = 2)
  - Update D: 2 + 8 = 10
  - Update E: 2 + 10 = 12
  
Step 3: Visit B (distance = 4)
  - Update D: 4 + 5 = 9 (better than 10!)
  
Step 4: Visit D (distance = 9)
  - Update E: 9 + 2 = 11 (better than 12!)
  
Step 5: Visit E (distance = 11)
  - Done!

Result: A → C → B → D → E = 11 km
```

## 🛠️ Tech Stack

- **Vanilla JavaScript**: Algorithm implementation
- **HTML5 Canvas**: Interactive graph visualization
- **HTML5**: Semantic structure
- **CSS3**: Gradient animations and responsive design
- **No Dependencies**: Pure web technologies!

## 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/Tyagirohan/Algorithms-in-Action.git
cd Algorithms-in-Action/day05-dijkstra
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

No installation, no dependencies - just pure browser magic!

## 💡 Key Learnings

### Why Dijkstra's Works

The **greedy choice property**: Once a node is visited, we've found its shortest path. Why?

- We always process nodes in order of increasing distance
- If there were a shorter path through unvisited nodes, we would have found a shorter distance to those nodes first
- Mathematical proof by contradiction!

### Limitations

**❌ Cannot handle negative edge weights**
- Would need Bellman-Ford algorithm instead
- Greedy approach breaks with negative cycles

**✅ Perfect for:**
- Road networks (distances always positive)
- Network routing (costs always positive)
- Any graph with non-negative weights

### Performance Optimization

**Priority Queue vs Array:**

| Implementation | Time Complexity | Best For |
|---------------|-----------------|----------|
| Simple Array | O(V²) | Dense graphs |
| Binary Heap | O((V+E) log V) | Sparse graphs |
| Fibonacci Heap | O(E + V log V) | Theoretical optimum |

**For our city networks:**
- Usually sparse (not every city connects to every city)
- Priority queue (binary heap) is optimal!

## 🎮 Try These Examples

### Interactive Mode
1. **Build a network**:
   - Add cities: NYC, LA, CHI, MIA
   - Connect them with roads
   - Find shortest route NYC → MIA

2. **Test edge cases**:
   - Disconnected graphs (no path exists)
   - Multiple equally short paths
   - Dense vs sparse networks

### Preset Mode
1. **Simple Network**:
   - Start: A, End: E
   - Watch greedy selection in action

2. **Highway System**:
   - Start: NYC, End: MIA
   - Real US highway distances!

3. **Complex City**:
   - Start: A, End: H
   - Multiple alternative routes

## 🌟 Real-World Applications

### Navigation Systems
- 🗺️ **Google Maps**: Finds shortest routes in real-time
- 🚗 **GPS Devices**: Traffic-aware routing
- ✈️ **Flight Planning**: Cheapest flight routes

### Network Infrastructure
- 🌐 **Internet Routing**: Packet forwarding (OSPF protocol)
- 📞 **Telecommunications**: Call routing optimization
- 💻 **Network Design**: Optimal cable laying

### Logistics & Transportation
- 🚚 **Delivery Optimization**: Package routing
- 🚆 **Rail Networks**: Train scheduling
- 🚌 **Public Transit**: Bus route planning

### Other Applications
- 🎮 **Game AI**: NPC pathfinding
- 🤖 **Robotics**: Navigation and obstacle avoidance
- 💰 **Currency Exchange**: Best conversion rates
- 🏥 **Emergency Response**: Fastest ambulance routes

## ⚔️ Algorithm Comparison

| Algorithm | Use Case | Handles Negative? | Complexity |
|-----------|----------|-------------------|------------|
| **Dijkstra's** | Single-source, non-negative | ❌ No | O((V+E) log V) |
| **Bellman-Ford** | Handles negative weights | ✅ Yes | O(VE) |
| **A*** | With good heuristic | ❌ No | Often better |
| **BFS** | Unweighted graphs | N/A | O(V+E) |
| **Floyd-Warshall** | All-pairs shortest path | ✅ Yes | O(V³) |

## 🎨 UI Highlights

- **Purple gradient theme** (Day 5 signature color)
- **Interactive canvas** with smooth animations
- **Real-time distance table** updates
- **3 distinct modes** for different learning styles
- **4 preset networks** for instant exploration
- **Color-coded visualization** of algorithm progress
- **Responsive design** for all devices

## 📊 Statistics Tracking

Watch the algorithm work:
- **Cities**: Total nodes in graph
- **Roads**: Total edges (bidirectional)
- **Cities Visited**: Nodes processed by algorithm
- **Shortest Distance**: Final path length
- **Algorithm Steps**: Iterations performed

## 🔗 Links

- **Live Demo**: [View Live](https://tyagirohan.github.io/Algorithms-in-Action/day05-dijkstra/)
- **GitHub Repo**: [Algorithms in Action](https://github.com/Tyagirohan/Algorithms-in-Action)
- **Previous Projects**: 
  - [Day 1 - Binary Search](../day01-binary-search/)
  - [Day 2 - Two Pointers](../day02-two-pointers/)
  - [Day 3 - Sliding Window](../day03-sliding-window/)
  - [Day 4 - Merge Sort](../day04-merge-sort/)
- **LinkedIn**: [Rohan Tyagi](https://www.linkedin.com/in/rohan-tyagi-333675202/)

## 🎯 What's Next?

**Day 6**: Dynamic Programming - Smart Vending Machine

---

**Built with ❤️ by Rohan Tyagi**

*Part of the Algorithms in Action series - Mastering algorithms through interactive visualizations*

#AlgorithmsInAction #Dijkstra #ShortestPath #GraphAlgorithms #DSA #WebDevelopment #JavaScript

