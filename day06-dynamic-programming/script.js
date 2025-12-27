// Dynamic Programming Visualizer
class DPVisualizer {
    constructor() {
        this.currentProblem = 'coin-change';
        this.animationSpeed = 500;
        this.isAnimating = false;
        
        this.initializeDOM();
        this.attachEventListeners();
    }

    initializeDOM() {
        // Controls for each problem
        this.coinChangeControls = document.getElementById('coinChangeControls');
        this.knapsackControls = document.getElementById('knapsackControls');
        this.fibonacciControls = document.getElementById('fibonacciControls');
        
        // Visualization elements
        this.vizTitle = document.getElementById('vizTitle');
        this.dpTable = document.getElementById('dpTable');
        this.dpTableContainer = document.querySelector('.dp-table-container');
        this.recursionTreeContainer = document.getElementById('recursionTreeContainer');
        this.recursionTree = document.getElementById('recursionTree');
        this.stepDesc = document.getElementById('stepDesc');
        
        // Stats
        this.subproblemsCount = document.getElementById('subproblemsCount');
        this.timeComplexity = document.getElementById('timeComplexity');
        this.spaceComplexity = document.getElementById('spaceComplexity');
        this.computeTime = document.getElementById('computeTime');
        
        // Solution
        this.solutionBox = document.getElementById('solutionBox');
        this.solutionDetails = document.getElementById('solutionDetails');
        
        // Speed control
        this.speedSlider = document.getElementById('animationSpeed');
        this.speedLabel = document.getElementById('speedLabel');
    }

    attachEventListeners() {
        // Problem switching
        document.querySelectorAll('.problem-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchProblem(btn.dataset.problem));
        });
        
        // Coin Change
        document.getElementById('solveCoinBtn').addEventListener('click', () => this.solveCoinChange());
        document.querySelectorAll('.preset-coin-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('coinValues').value = btn.dataset.coins;
            });
        });
        
        // Knapsack
        document.getElementById('solveKnapsackBtn').addEventListener('click', () => this.solveKnapsack());
        document.getElementById('addItemBtn').addEventListener('click', () => this.addItem());
        document.querySelectorAll('.preset-item-btn').forEach(btn => {
            btn.addEventListener('click', () => this.loadItemPreset(btn.dataset.preset));
        });
        
        // Fibonacci
        document.getElementById('solveFibBtn').addEventListener('click', () => this.solveFibonacci());
        
        // Speed control
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedLabel.textContent = `${this.animationSpeed}ms`;
        });
        
        // Remove item buttons (delegate)
        document.getElementById('itemsList').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                e.target.parentElement.remove();
            }
        });
    }

    switchProblem(problem) {
        this.currentProblem = problem;
        
        // Update button states
        document.querySelectorAll('.problem-btn').forEach(btn => {
            if (btn.dataset.problem === problem) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show appropriate controls
        this.coinChangeControls.classList.add('hidden');
        this.knapsackControls.classList.add('hidden');
        this.fibonacciControls.classList.add('hidden');
        
        // Show/hide visualization containers
        this.dpTableContainer.classList.remove('hidden');
        this.recursionTreeContainer.classList.add('hidden');
        
        if (problem === 'coin-change') {
            this.coinChangeControls.classList.remove('hidden');
            this.vizTitle.textContent = '💰 Coin Change Visualization';
        } else if (problem === 'knapsack') {
            this.knapsackControls.classList.remove('hidden');
            this.vizTitle.textContent = '🎒 Knapsack Visualization';
        } else if (problem === 'fibonacci') {
            this.fibonacciControls.classList.remove('hidden');
            this.vizTitle.textContent = '🔢 Fibonacci Visualization';
            this.recursionTreeContainer.classList.remove('hidden');
            this.dpTableContainer.classList.add('hidden');
        }
        
        this.reset();
    }

    async solveCoinChange() {
        if (this.isAnimating) return;
        
        const amount = parseInt(document.getElementById('targetAmount').value);
        const coinsStr = document.getElementById('coinValues').value;
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid target amount');
            return;
        }
        
        const coins = coinsStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
        
        if (coins.length === 0) {
            alert('Please enter valid coin denominations');
            return;
        }
        
        this.isAnimating = true;
        this.solutionBox.classList.add('hidden');
        
        const startTime = Date.now();
        
        // Initialize DP table
        const dp = Array(amount + 1).fill(Infinity);
        const parent = Array(amount + 1).fill(-1);
        dp[0] = 0;
        
        // Update stats
        this.timeComplexity.textContent = `O(amount × coins) = O(${amount} × ${coins.length})`;
        this.spaceComplexity.textContent = `O(amount) = O(${amount})`;
        
        // Render initial table
        this.renderCoinChangeTable(dp, amount, -1);
        this.stepDesc.textContent = 'Initialized: dp[0] = 0, all others = ∞';
        
        await this.sleep(this.animationSpeed);
        
        let subproblems = 0;
        
        // Fill DP table
        for (let i = 1; i <= amount; i++) {
            this.stepDesc.textContent = `Computing dp[${i}]: Finding minimum coins for amount ${i}`;
            
            for (let coin of coins) {
                if (coin <= i) {
                    subproblems++;
                    this.subproblemsCount.textContent = subproblems;
                    
                    if (dp[i - coin] + 1 < dp[i]) {
                        dp[i] = dp[i - coin] + 1;
                        parent[i] = coin;
                        
                        this.renderCoinChangeTable(dp, amount, i);
                        this.stepDesc.textContent = `dp[${i}] = dp[${i - coin}] + 1 = ${dp[i]} (using coin ${coin})`;
                        
                        await this.sleep(this.animationSpeed);
                    }
                }
            }
            
            this.renderCoinChangeTable(dp, amount, i, true);
            await this.sleep(this.animationSpeed / 2);
        }
        
        const endTime = Date.now();
        this.computeTime.textContent = `${endTime - startTime}ms`;
        
        // Show solution
        if (dp[amount] === Infinity) {
            this.showSolution('❌ No solution exists', 'Cannot make this amount with given coins');
        } else {
            const usedCoins = [];
            let curr = amount;
            while (curr > 0) {
                usedCoins.push(parent[curr]);
                curr -= parent[curr];
            }
            
            const coinCounts = {};
            usedCoins.forEach(coin => {
                coinCounts[coin] = (coinCounts[coin] || 0) + 1;
            });
            
            let solutionText = `<p><strong>Minimum coins needed:</strong> ${dp[amount]}</p>`;
            solutionText += `<p><strong>Coins used:</strong></p><ul>`;
            for (let coin in coinCounts) {
                solutionText += `<li>${coinCounts[coin]} × $${coin} coin(s)</li>`;
            }
            solutionText += `</ul>`;
            solutionText += `<p><strong>Total:</strong> $${amount}</p>`;
            
            this.showSolution('✅ Optimal Solution Found!', solutionText);
        }
        
        this.isAnimating = false;
    }

    renderCoinChangeTable(dp, amount, current, completed = false) {
        let html = '<div class="dp-row">';
        html += '<div class="dp-cell header">Amount</div>';
        for (let i = 0; i <= Math.min(amount, 20); i++) {
            html += `<div class="dp-cell header">${i}</div>`;
        }
        if (amount > 20) html += '<div class="dp-cell header">...</div>';
        html += '</div>';
        
        html += '<div class="dp-row">';
        html += '<div class="dp-cell header">Min Coins</div>';
        for (let i = 0; i <= Math.min(amount, 20); i++) {
            const value = dp[i] === Infinity ? '∞' : dp[i];
            let cellClass = 'dp-cell';
            if (i === current && !completed) cellClass += ' current';
            else if (i === current && completed) cellClass += ' computed';
            else if (i <= current && dp[i] !== Infinity) cellClass += ' computed';
            
            html += `<div class="${cellClass}">${value}</div>`;
        }
        if (amount > 20) {
            const value = dp[amount] === Infinity ? '∞' : dp[amount];
            html += `<div class="dp-cell ${current === amount ? 'current' : ''}">${value}</div>`;
        }
        html += '</div>';
        
        this.dpTable.innerHTML = html;
    }

    async solveKnapsack() {
        if (this.isAnimating) return;
        
        const capacity = parseInt(document.getElementById('knapsackCapacity').value);
        
        if (!capacity || capacity <= 0) {
            alert('Please enter a valid knapsack capacity');
            return;
        }
        
        // Get items
        const items = [];
        document.querySelectorAll('#itemsList .item-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            const name = inputs[0].value.trim();
            const value = parseInt(inputs[1].value);
            const weight = parseInt(inputs[2].value);
            
            if (name && value > 0 && weight > 0) {
                items.push({ name, value, weight });
            }
        });
        
        if (items.length === 0) {
            alert('Please add at least one item');
            return;
        }
        
        this.isAnimating = true;
        this.solutionBox.classList.add('hidden');
        
        const startTime = Date.now();
        const n = items.length;
        
        // Initialize DP table
        const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
        
        this.timeComplexity.textContent = `O(n × capacity) = O(${n} × ${capacity})`;
        this.spaceComplexity.textContent = `O(n × capacity) = O(${n} × ${capacity})`;
        
        this.renderKnapsackTable(dp, items, capacity, 0, 0);
        this.stepDesc.textContent = 'Initialized: All dp values = 0';
        
        await this.sleep(this.animationSpeed);
        
        let subproblems = 0;
        
        // Fill DP table
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                subproblems++;
                this.subproblemsCount.textContent = subproblems;
                
                if (items[i-1].weight <= w) {
                    const include = items[i-1].value + dp[i-1][w - items[i-1].weight];
                    const exclude = dp[i-1][w];
                    dp[i][w] = Math.max(include, exclude);
                    
                    this.stepDesc.textContent = `Item "${items[i-1].name}": max(include=$${include}, exclude=$${exclude}) = $${dp[i][w]}`;
                } else {
                    dp[i][w] = dp[i-1][w];
                    this.stepDesc.textContent = `Item "${items[i-1].name}" too heavy (${items[i-1].weight}kg > ${w}kg), skip`;
                }
                
                this.renderKnapsackTable(dp, items, capacity, i, w);
                await this.sleep(this.animationSpeed / 4);
            }
        }
        
        const endTime = Date.now();
        this.computeTime.textContent = `${endTime - startTime}ms`;
        
        // Reconstruct solution
        const selected = [];
        let w = capacity;
        for (let i = n; i > 0; i--) {
            if (dp[i][w] !== dp[i-1][w]) {
                selected.push(items[i-1]);
                w -= items[i-1].weight;
            }
        }
        
        let solutionText = `<p><strong>Maximum value:</strong> $${dp[n][capacity]}</p>`;
        solutionText += `<p><strong>Items selected:</strong></p><ul>`;
        let totalWeight = 0;
        selected.forEach(item => {
            solutionText += `<li>${item.name}: $${item.value}, ${item.weight}kg</li>`;
            totalWeight += item.weight;
        });
        solutionText += `</ul>`;
        solutionText += `<p><strong>Total weight:</strong> ${totalWeight}kg / ${capacity}kg</p>`;
        
        this.showSolution('✅ Optimal Solution Found!', solutionText);
        this.isAnimating = false;
    }

    renderKnapsackTable(dp, items, capacity, currentItem, currentWeight) {
        // Show more columns for better visualization
        const showAll = capacity <= 25; // Show all if capacity is reasonable
        const maxCols = showAll ? capacity : 15;
        const displayCapacity = Math.min(capacity, maxCols);
        
        let html = '<div class="dp-row">';
        html += '<div class="dp-cell header">Item \\ Weight</div>';
        for (let w = 0; w <= displayCapacity; w++) {
            html += `<div class="dp-cell header">${w}</div>`;
        }
        
        // Show intermediate columns if capacity is large
        if (capacity > maxCols) {
            const midPoint = Math.floor(capacity / 2);
            html += `<div class="dp-cell header">...${midPoint}...</div>`;
            html += `<div class="dp-cell header">${capacity}</div>`;
        }
        html += '</div>';
        
        for (let i = 0; i <= items.length; i++) {
            html += '<div class="dp-row">';
            const itemName = i === 0 ? '∅' : items[i-1].name.substring(0, 8);
            html += `<div class="dp-cell header">${itemName}</div>`;
            
            for (let w = 0; w <= displayCapacity; w++) {
                let cellClass = 'dp-cell';
                if (i === currentItem && w === currentWeight) cellClass += ' current';
                else if (i <= currentItem && w <= currentWeight) cellClass += ' computed';
                
                html += `<div class="${cellClass}">${dp[i][w]}</div>`;
            }
            
            // Show midpoint and final value if capacity is large
            if (capacity > maxCols) {
                const midPoint = Math.floor(capacity / 2);
                let midClass = 'dp-cell';
                if (i === currentItem && midPoint === currentWeight) midClass += ' current';
                else if (i <= currentItem && midPoint <= currentWeight) midClass += ' computed';
                
                html += `<div class="${midClass}">${dp[i][midPoint]}</div>`;
                
                let finalClass = 'dp-cell';
                if (i === currentItem && capacity === currentWeight) finalClass += ' current';
                else if (i <= currentItem) finalClass += ' computed';
                
                html += `<div class="${finalClass}">${dp[i][capacity]}</div>`;
            }
            html += '</div>';
        }
        
        this.dpTable.innerHTML = html;
    }

    async solveFibonacci() {
        if (this.isAnimating) return;
        
        const n = parseInt(document.getElementById('fibNumber').value);
        const approach = document.querySelector('input[name="fibApproach"]:checked').value;
        
        if (n < 0 || n > 40) {
            alert('Please enter a number between 0 and 40');
            return;
        }
        
        this.isAnimating = true;
        this.solutionBox.classList.add('hidden');
        this.recursionTree.innerHTML = '';
        
        const startTime = Date.now();
        let result, calls = 0;
        
        if (approach === 'recursive') {
            this.timeComplexity.textContent = 'O(2ⁿ)';
            this.spaceComplexity.textContent = 'O(n)';
            result = await this.fibRecursive(n, 0, (count) => calls = count);
        } else if (approach === 'memoized') {
            this.timeComplexity.textContent = 'O(n)';
            this.spaceComplexity.textContent = 'O(n)';
            const memo = {};
            result = await this.fibMemoized(n, memo, 0, (count) => calls = count);
        } else {
            this.timeComplexity.textContent = 'O(n)';
            this.spaceComplexity.textContent = 'O(n)';
            result = await this.fibTabulation(n, (count) => calls = count);
        }
        
        const endTime = Date.now();
        this.computeTime.textContent = `${endTime - startTime}ms`;
        this.subproblemsCount.textContent = calls;
        
        let solutionText = `<p><strong>F(${n}) = ${result}</strong></p>`;
        solutionText += `<p><strong>Approach:</strong> ${approach === 'recursive' ? 'Naive Recursion' : approach === 'memoized' ? 'Memoization (Top-Down DP)' : 'Tabulation (Bottom-Up DP)'}</p>`;
        solutionText += `<p><strong>Function calls:</strong> ${calls}</p>`;
        solutionText += `<p><strong>Time:</strong> ${endTime - startTime}ms</p>`;
        
        this.showSolution('✅ Fibonacci Calculated!', solutionText);
        this.isAnimating = false;
    }

    async fibRecursive(n, depth, updateCalls) {
        updateCalls(this.subproblemsCount.textContent = parseInt(this.subproblemsCount.textContent || 0) + 1);
        
        this.stepDesc.textContent = `Computing F(${n}) recursively...`;
        await this.sleep(Math.min(this.animationSpeed, 100));
        
        if (n <= 1) return n;
        
        return await this.fibRecursive(n - 1, depth + 1, updateCalls) + 
               await this.fibRecursive(n - 2, depth + 1, updateCalls);
    }

    async fibMemoized(n, memo, depth, updateCalls) {
        if (n in memo) {
            this.stepDesc.textContent = `F(${n}) already computed: ${memo[n]} (cache hit!)`;
            await this.sleep(Math.min(this.animationSpeed / 2, 50));
            return memo[n];
        }
        
        updateCalls(this.subproblemsCount.textContent = parseInt(this.subproblemsCount.textContent || 0) + 1);
        
        this.stepDesc.textContent = `Computing F(${n}) with memoization...`;
        await this.sleep(Math.min(this.animationSpeed, 100));
        
        if (n <= 1) {
            memo[n] = n;
            return n;
        }
        
        memo[n] = await this.fibMemoized(n - 1, memo, depth + 1, updateCalls) + 
                  await this.fibMemoized(n - 2, memo, depth + 1, updateCalls);
        
        this.stepDesc.textContent = `F(${n}) = ${memo[n]} (cached)`;
        return memo[n];
    }

    async fibTabulation(n, updateCalls) {
        if (n <= 1) return n;
        
        const dp = Array(n + 1);
        dp[0] = 0;
        dp[1] = 1;
        
        this.renderFibTable(dp, n, 1);
        this.stepDesc.textContent = 'Base cases: F(0) = 0, F(1) = 1';
        await this.sleep(this.animationSpeed);
        
        for (let i = 2; i <= n; i++) {
            updateCalls(this.subproblemsCount.textContent = parseInt(this.subproblemsCount.textContent || 0) + 1);
            
            dp[i] = dp[i-1] + dp[i-2];
            this.stepDesc.textContent = `F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`;
            
            this.renderFibTable(dp, n, i);
            await this.sleep(this.animationSpeed);
        }
        
        return dp[n];
    }

    renderFibTable(dp, n, current) {
        const maxDisplay = 15;
        let html = '<div class="dp-row">';
        html += '<div class="dp-cell header">n</div>';
        for (let i = 0; i <= Math.min(n, maxDisplay); i++) {
            html += `<div class="dp-cell header">${i}</div>`;
        }
        if (n > maxDisplay) html += '<div class="dp-cell header">...</div>';
        html += '</div>';
        
        html += '<div class="dp-row">';
        html += '<div class="dp-cell header">F(n)</div>';
        for (let i = 0; i <= Math.min(n, maxDisplay); i++) {
            let cellClass = 'dp-cell';
            if (i === current) cellClass += ' current';
            else if (i < current && dp[i] !== undefined) cellClass += ' computed';
            
            html += `<div class="${cellClass}">${dp[i] !== undefined ? dp[i] : '-'}</div>`;
        }
        if (n > maxDisplay) {
            html += `<div class="dp-cell ${current === n ? 'current' : ''}">${dp[n] !== undefined ? dp[n] : '-'}</div>`;
        }
        html += '</div>';
        
        this.dpTable.innerHTML = html;
    }

    addItem() {
        const itemsList = document.getElementById('itemsList');
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" placeholder="Name" />
            <input type="number" placeholder="Value" min="1" />
            <input type="number" placeholder="Weight" min="1" />
            <button class="remove-item-btn">✖</button>
        `;
        itemsList.appendChild(itemRow);
    }

    loadItemPreset(preset) {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';
        
        const presets = {
            tech: [
                { name: 'Laptop', value: 1000, weight: 30 },
                { name: 'Phone', value: 800, weight: 5 },
                { name: 'Tablet', value: 500, weight: 10 },
                { name: 'Headphones', value: 200, weight: 2 },
                { name: 'Camera', value: 1200, weight: 20 }
            ],
            jewelry: [
                { name: 'Diamond', value: 5000, weight: 1 },
                { name: 'Gold Ring', value: 3000, weight: 2 },
                { name: 'Ruby', value: 4000, weight: 1 },
                { name: 'Emerald', value: 3500, weight: 1 },
                { name: 'Pearl', value: 2000, weight: 1 }
            ],
            survival: [
                { name: 'Water', value: 100, weight: 20 },
                { name: 'Food', value: 90, weight: 15 },
                { name: 'Knife', value: 50, weight: 2 },
                { name: 'Rope', value: 40, weight: 5 },
                { name: 'Tent', value: 70, weight: 25 },
                { name: 'First Aid', value: 60, weight: 3 }
            ]
        };
        
        const items = presets[preset] || [];
        items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = 'item-row';
            itemRow.innerHTML = `
                <input type="text" placeholder="Name" value="${item.name}" />
                <input type="number" placeholder="Value" value="${item.value}" min="1" />
                <input type="number" placeholder="Weight" value="${item.weight}" min="1" />
                <button class="remove-item-btn">✖</button>
            `;
            itemsList.appendChild(itemRow);
        });
    }

    showSolution(title, details) {
        this.solutionBox.querySelector('h3').textContent = title;
        this.solutionDetails.innerHTML = details;
        this.solutionBox.classList.remove('hidden');
    }

    reset() {
        this.isAnimating = false;
        this.solutionBox.classList.add('hidden');
        this.dpTable.innerHTML = '<p class="empty-message">Configure problem and click solve to visualize</p>';
        this.stepDesc.textContent = 'Waiting to start...';
        this.subproblemsCount.textContent = '0';
        this.timeComplexity.textContent = '-';
        this.spaceComplexity.textContent = '-';
        this.computeTime.textContent = '0ms';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new DPVisualizer();
});

