// Sliding Window Implementation
class SlidingWindow {
    constructor() {
        this.currentProblem = 'max-profit';
        this.animationSpeed = 800;
        this.isAnimating = false;
        this.stockData = [];
        this.windowSize = 3;
        
        this.initializeDOM();
        this.attachEventListeners();
    }

    initializeDOM() {
        // Problem buttons
        this.problemBtns = document.querySelectorAll('.problem-btn');
        
        // Input elements
        this.stockPricesInput = document.getElementById('stockPrices');
        this.windowSizeInput = document.getElementById('windowSize');
        this.windowSizeSection = document.getElementById('windowSizeSection');
        
        // Action buttons
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.generateRandomBtn = document.getElementById('generateRandomBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Speed control
        this.speedSlider = document.getElementById('animationSpeed');
        this.speedLabel = document.getElementById('speedLabel');
        
        // Stats
        this.windowsCheckedEl = document.getElementById('windowsChecked');
        this.currentSumEl = document.getElementById('currentSum');
        this.bestResultEl = document.getElementById('bestResult');
        
        // Visualization
        this.chartCanvas = document.getElementById('stockChart');
        this.ctx = this.chartCanvas.getContext('2d');
        this.windowInfo = document.getElementById('windowInfo');
        this.dataBars = document.getElementById('dataBars');
        this.resultBox = document.getElementById('resultBox');
        this.resultContent = document.getElementById('resultContent');
    }

    attachEventListeners() {
        // Problem switching
        this.problemBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchProblem(btn.dataset.problem));
        });
        
        // Actions
        this.analyzeBtn.addEventListener('click', () => this.analyze());
        this.generateRandomBtn.addEventListener('click', () => this.generateRandomData());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Speed control
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedLabel.textContent = `${this.animationSpeed}ms`;
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.stockPricesInput.value = btn.dataset.prices;
                if (btn.dataset.window) {
                    this.windowSizeInput.value = btn.dataset.window;
                }
                this.updateVisualization();
            });
        });
        
        // Input changes
        this.stockPricesInput.addEventListener('input', () => this.updateVisualization());
    }

    switchProblem(problem) {
        this.currentProblem = problem;
        
        // Update button states
        this.problemBtns.forEach(btn => {
            if (btn.dataset.problem === problem) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show/hide window size input based on problem
        if (problem === 'longest-gain' || problem === 'max-subarray') {
            this.windowSizeSection.style.display = 'none';
        } else {
            this.windowSizeSection.style.display = 'block';
        }
        
        this.reset();
    }

    updateVisualization() {
        const pricesStr = this.stockPricesInput.value.trim();
        if (!pricesStr) {
            this.dataBars.innerHTML = '<p class="empty-message">Enter stock prices to visualize</p>';
            return;
        }
        
        this.stockData = pricesStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        this.renderBars();
        this.drawChart();
    }

    renderBars() {
        this.dataBars.innerHTML = '';
        
        if (this.stockData.length === 0) {
            this.dataBars.innerHTML = '<p class="empty-message">Enter stock prices to visualize</p>';
            return;
        }
        
        const maxValue = Math.max(...this.stockData);
        const minValue = Math.min(...this.stockData);
        const range = maxValue - minValue || 1;
        
        this.stockData.forEach((price, index) => {
            const container = document.createElement('div');
            container.className = 'bar-container';
            
            const bar = document.createElement('div');
            bar.className = 'bar';
            const height = ((price - minValue) / range) * 150 + 30;
            bar.style.height = `${height}px`;
            bar.dataset.index = index;
            
            const value = document.createElement('span');
            value.className = 'bar-value';
            value.textContent = price;
            bar.appendChild(value);
            
            const label = document.createElement('span');
            label.className = 'bar-label';
            label.textContent = `D${index + 1}`;
            
            container.appendChild(bar);
            container.appendChild(label);
            this.dataBars.appendChild(container);
        });
    }

    drawChart() {
        if (this.stockData.length === 0) return;
        
        const canvas = this.chartCanvas;
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        this.ctx.scale(2, 2);
        
        const padding = 40;
        const width = canvas.width / 2 - padding * 2;
        const height = canvas.height / 2 - padding * 2;
        
        const maxValue = Math.max(...this.stockData);
        const minValue = Math.min(...this.stockData);
        const range = maxValue - minValue || 1;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height + padding);
        this.ctx.lineTo(width + padding, height + padding);
        this.ctx.stroke();
        
        // Draw line
        this.ctx.strokeStyle = '#4facfe';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const stepX = width / (this.stockData.length - 1 || 1);
        
        this.stockData.forEach((price, index) => {
            const x = padding + index * stepX;
            const y = height + padding - ((price - minValue) / range) * height;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            // Draw point
            this.ctx.fillStyle = '#4facfe';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.stroke();
    }

    async analyze() {
        if (this.isAnimating) return;
        
        const pricesStr = this.stockPricesInput.value.trim();
        if (!pricesStr) {
            alert('Please enter stock prices');
            return;
        }
        
        this.stockData = pricesStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        
        if (this.stockData.length < 2) {
            alert('Please enter at least 2 prices');
            return;
        }
        
        this.windowSize = parseInt(this.windowSizeInput.value) || 3;
        
        if (this.currentProblem === 'max-profit' && this.windowSize > this.stockData.length) {
            alert(`Window size cannot be larger than array length (${this.stockData.length})`);
            return;
        }
        
        this.isAnimating = true;
        this.analyzeBtn.disabled = true;
        this.resultBox.classList.remove('visible');
        
        this.renderBars();
        
        // Run appropriate algorithm
        switch (this.currentProblem) {
            case 'max-profit':
                await this.findMaxProfit();
                break;
            case 'longest-gain':
                await this.findLongestGainStreak();
                break;
            case 'max-subarray':
                await this.findMaxSubarraySum();
                break;
        }
        
        this.isAnimating = false;
        this.analyzeBtn.disabled = false;
    }

    async findMaxProfit() {
        const bars = Array.from(this.dataBars.querySelectorAll('.bar'));
        let windowSum = 0;
        let maxSum = -Infinity;
        let maxIndex = 0;
        let windowsChecked = 0;
        
        // Calculate first window
        for (let i = 0; i < this.windowSize; i++) {
            windowSum += this.stockData[i];
        }
        
        maxSum = windowSum;
        maxIndex = 0;
        windowsChecked++;
        
        this.windowsCheckedEl.textContent = windowsChecked;
        this.currentSumEl.textContent = windowSum;
        this.bestResultEl.textContent = maxSum;
        
        // Highlight first window
        for (let i = 0; i < this.windowSize; i++) {
            bars[i].classList.add('in-window');
        }
        
        this.windowInfo.innerHTML = `<p>Window [0-${this.windowSize - 1}]: Sum = ${windowSum}</p>`;
        
        await this.sleep(this.animationSpeed);
        
        // Slide the window
        for (let i = this.windowSize; i < this.stockData.length; i++) {
            windowsChecked++;
            
            // Remove left element, add right element
            windowSum = windowSum - this.stockData[i - this.windowSize] + this.stockData[i];
            
            // Clear previous window highlighting
            bars.forEach(bar => bar.classList.remove('in-window'));
            
            // Highlight current window
            for (let j = i - this.windowSize + 1; j <= i; j++) {
                bars[j].classList.add('in-window');
            }
            
            this.windowsCheckedEl.textContent = windowsChecked;
            this.currentSumEl.textContent = windowSum;
            
            this.windowInfo.innerHTML = `<p>Window [${i - this.windowSize + 1}-${i}]: Sum = ${windowSum}</p>`;
            
            if (windowSum > maxSum) {
                maxSum = windowSum;
                maxIndex = i - this.windowSize + 1;
                this.bestResultEl.textContent = maxSum;
            }
            
            await this.sleep(this.animationSpeed);
        }
        
        // Highlight best window
        bars.forEach(bar => bar.classList.remove('in-window'));
        for (let i = maxIndex; i < maxIndex + this.windowSize; i++) {
            bars[i].classList.add('best-window');
        }
        
        this.windowInfo.innerHTML = `<p>✅ Best Window Found: Days ${maxIndex + 1}-${maxIndex + this.windowSize}</p>`;
        
        this.resultContent.innerHTML = `
            <p>🎯 Maximum Profit Window Found!</p>
            <p>Days ${maxIndex + 1} to ${maxIndex + this.windowSize}: Total = $${maxSum}</p>
            <p>Average: $${(maxSum / this.windowSize).toFixed(2)} per day</p>
        `;
        this.resultBox.classList.add('visible');
    }

    async findLongestGainStreak() {
        const bars = Array.from(this.dataBars.querySelectorAll('.bar'));
        let maxLength = 0;
        let maxStart = 0;
        let currentStart = 0;
        let currentLength = 0;
        let windowsChecked = 0;
        
        for (let i = 1; i < this.stockData.length; i++) {
            windowsChecked++;
            this.windowsCheckedEl.textContent = windowsChecked;
            
            bars.forEach(bar => bar.classList.remove('in-window'));
            bars[i].classList.add('in-window');
            
            if (this.stockData[i] > this.stockData[i - 1]) {
                if (currentLength === 0) {
                    currentStart = i - 1;
                }
                currentLength++;
                
                // Highlight current streak
                for (let j = currentStart; j <= i; j++) {
                    bars[j].classList.add('in-window');
                }
                
                this.currentSumEl.textContent = currentLength + 1;
                this.windowInfo.innerHTML = `<p>Current Gain Streak: ${currentLength + 1} days</p>`;
                
                if (currentLength > maxLength) {
                    maxLength = currentLength;
                    maxStart = currentStart;
                    this.bestResultEl.textContent = maxLength + 1;
                }
            } else {
                currentLength = 0;
                this.currentSumEl.textContent = '0';
                this.windowInfo.innerHTML = `<p>Streak broken at day ${i + 1}</p>`;
            }
            
            await this.sleep(this.animationSpeed);
        }
        
        // Highlight best streak
        bars.forEach(bar => bar.classList.remove('in-window'));
        for (let i = maxStart; i <= maxStart + maxLength; i++) {
            bars[i].classList.add('best-window');
        }
        
        this.resultContent.innerHTML = `
            <p>📊 Longest Gain Streak Found!</p>
            <p>Days ${maxStart + 1} to ${maxStart + maxLength + 1}: ${maxLength + 1} consecutive days of growth</p>
            <p>Gain: $${this.stockData[maxStart + maxLength] - this.stockData[maxStart]}</p>
        `;
        this.resultBox.classList.add('visible');
    }

    async findMaxSubarraySum() {
        const bars = Array.from(this.dataBars.querySelectorAll('.bar'));
        let maxSum = this.stockData[0];
        let currentSum = this.stockData[0];
        let maxStart = 0;
        let maxEnd = 0;
        let currentStart = 0;
        let windowsChecked = 0;
        
        bars[0].classList.add('in-window');
        this.bestResultEl.textContent = maxSum;
        
        await this.sleep(this.animationSpeed / 2);
        
        for (let i = 1; i < this.stockData.length; i++) {
            windowsChecked++;
            this.windowsCheckedEl.textContent = windowsChecked;
            
            // Kadane's algorithm
            if (currentSum < 0) {
                currentSum = this.stockData[i];
                currentStart = i;
                
                bars.forEach(bar => bar.classList.remove('in-window'));
                bars[i].classList.add('in-window');
            } else {
                currentSum += this.stockData[i];
                bars[i].classList.add('in-window');
            }
            
            this.currentSumEl.textContent = currentSum;
            this.windowInfo.innerHTML = `<p>Current Subarray Sum: ${currentSum}</p>`;
            
            if (currentSum > maxSum) {
                maxSum = currentSum;
                maxStart = currentStart;
                maxEnd = i;
                this.bestResultEl.textContent = maxSum;
            }
            
            await this.sleep(this.animationSpeed);
        }
        
        // Highlight best subarray
        bars.forEach(bar => bar.classList.remove('in-window'));
        for (let i = maxStart; i <= maxEnd; i++) {
            bars[i].classList.add('best-window');
        }
        
        this.resultContent.innerHTML = `
            <p>🎯 Maximum Subarray Found!</p>
            <p>Days ${maxStart + 1} to ${maxEnd + 1}: Sum = $${maxSum}</p>
            <p>Length: ${maxEnd - maxStart + 1} days</p>
        `;
        this.resultBox.classList.add('visible');
    }

    generateRandomData() {
        const length = Math.floor(Math.random() * 8) + 8; // 8-15 elements
        const basePrice = Math.floor(Math.random() * 50) + 50; // 50-100
        const data = [basePrice];
        
        for (let i = 1; i < length; i++) {
            const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
            data.push(Math.max(10, data[i - 1] + change));
        }
        
        this.stockPricesInput.value = data.join(',');
        
        // Random window size
        const randomWindow = Math.floor(Math.random() * 3) + 3; // 3-5
        this.windowSizeInput.value = randomWindow;
        
        this.updateVisualization();
    }

    reset() {
        this.windowsCheckedEl.textContent = '0';
        this.currentSumEl.textContent = '-';
        this.bestResultEl.textContent = '-';
        this.resultBox.classList.remove('visible');
        this.windowInfo.innerHTML = '<p>Configure settings and click "Analyze" to start</p>';
        
        const bars = this.dataBars.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.classList.remove('in-window', 'best-window');
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new SlidingWindow();
});

