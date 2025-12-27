// Sorting Algorithm Visualizer
class SortingVisualizer {
    constructor() {
        this.currentMode = 'merge-only';
        this.animationSpeed = 500;
        this.isAnimating = false;
        this.isPaused = false;
        this.array = [];
        this.stepIndex = 0;
        this.steps = [];
        
        this.initializeDOM();
        this.attachEventListeners();
        this.loadInitialArray();
    }

    initializeDOM() {
        // Mode buttons
        this.modeBtns = document.querySelectorAll('.mode-btn');
        
        // Views
        this.mergeOnlyView = document.getElementById('mergeOnlyView');
        this.comparisonView = document.getElementById('comparisonView');
        this.stepView = document.getElementById('stepView');
        
        // Controls
        this.arrayInput = document.getElementById('arrayInput');
        this.arraySizeInput = document.getElementById('arraySize');
        this.generateBtn = document.getElementById('generateBtn');
        this.speedSlider = document.getElementById('animationSpeed');
        this.speedLabel = document.getElementById('speedLabel');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.stepBtn = document.getElementById('stepBtn');
        
        // Merge only elements
        this.recursionTree = document.getElementById('recursionTree');
        this.mergeBars = document.getElementById('mergeBars');
        this.mergeSteps = document.getElementById('mergeSteps');
        this.currentStepDesc = document.getElementById('currentStepDesc');
        
        this.mergeComparisons = document.getElementById('mergeComparisons');
        this.mergeAccesses = document.getElementById('mergeAccesses');
        this.mergeTime = document.getElementById('mergeTime');
        
        // Comparison view elements
        this.bubbleBars = document.getElementById('bubbleBars');
        this.selectionBars = document.getElementById('selectionBars');
        this.mergeCompBars = document.getElementById('mergeCompBars');
        
        // Step view elements
        this.stepBars = document.getElementById('stepBars');
        this.stepInfo = document.getElementById('stepInfo');
        this.operationDesc = document.getElementById('operationDesc');
    }

    attachEventListeners() {
        // Mode switching
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // Controls
        this.generateBtn.addEventListener('click', () => this.generateRandomArray());
        this.startBtn.addEventListener('click', () => this.startSort());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.stepBtn.addEventListener('click', () => this.nextStep());
        
        // Speed control
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedLabel.textContent = `${this.animationSpeed}ms`;
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.arrayInput.value = btn.dataset.array;
                this.loadInitialArray();
            });
        });
        
        // Array input change
        this.arrayInput.addEventListener('input', () => this.loadInitialArray());
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        this.modeBtns.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show appropriate view
        this.mergeOnlyView.classList.add('hidden');
        this.comparisonView.classList.add('hidden');
        this.stepView.classList.add('hidden');
        
        if (mode === 'merge-only') {
            this.mergeOnlyView.classList.remove('hidden');
            this.stepBtn.style.display = 'none';
        } else if (mode === 'comparison') {
            this.comparisonView.classList.remove('hidden');
            this.stepBtn.style.display = 'none';
        } else {
            this.stepView.classList.remove('hidden');
            this.stepBtn.style.display = 'block';
        }
        
        this.reset();
    }

    loadInitialArray() {
        const arrayStr = this.arrayInput.value.trim();
        if (!arrayStr) return;
        
        this.array = arrayStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        this.renderBars();
    }

    generateRandomArray() {
        const size = parseInt(this.arraySizeInput.value) || 15;
        const array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
        }
        this.arrayInput.value = array.join(',');
        this.loadInitialArray();
    }

    renderBars() {
        if (this.array.length === 0) return;
        
        const maxValue = Math.max(...this.array);
        
        // Render for current mode
        if (this.currentMode === 'merge-only') {
            this.renderBarsInContainer(this.mergeBars, this.array, maxValue);
        } else if (this.currentMode === 'comparison') {
            this.renderBarsInContainer(this.bubbleBars, this.array, maxValue);
            this.renderBarsInContainer(this.selectionBars, this.array, maxValue);
            this.renderBarsInContainer(this.mergeCompBars, this.array, maxValue);
        } else {
            this.renderBarsInContainer(this.stepBars, this.array, maxValue);
        }
    }

    renderBarsInContainer(container, array, maxValue) {
        container.innerHTML = '';
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            const height = (value / maxValue) * 200;
            bar.style.height = `${height}px`;
            bar.textContent = value;
            bar.dataset.index = index;
            bar.dataset.value = value;
            container.appendChild(bar);
        });
    }

    async startSort() {
        if (this.array.length === 0) {
            alert('Please enter an array to sort');
            return;
        }
        
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        if (this.currentMode === 'merge-only') {
            await this.visualizeMergeSort();
        } else if (this.currentMode === 'comparison') {
            await this.runComparison();
        } else {
            this.prepareStepByStep();
        }
        
        this.isAnimating = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
    }

    async visualizeMergeSort() {
        const arr = [...this.array];
        const startTime = Date.now();
        let comparisons = 0;
        let accesses = 0;
        
        this.recursionTree.innerHTML = '';
        this.currentStepDesc.textContent = 'Starting merge sort...';
        
        const mergeSortRecursive = async (array, start = 0, level = 0) => {
            if (array.length <= 1) return array;
            
            accesses += array.length;
            this.updateStats(comparisons, accesses, Date.now() - startTime);
            
            const mid = Math.floor(array.length / 2);
            const left = array.slice(0, mid);
            const right = array.slice(mid);
            
            this.currentStepDesc.textContent = `Dividing array at position ${start}: [${array.join(', ')}] → [${left.join(', ')}] | [${right.join(', ')}]`;
            
            await this.sleep(this.animationSpeed);
            
            const sortedLeft = await mergeSortRecursive(left, start, level + 1);
            const sortedRight = await mergeSortRecursive(right, start + mid, level + 1);
            
            return await this.merge(sortedLeft, sortedRight, start, () => {
                comparisons++;
                accesses += 2;
                this.updateStats(comparisons, accesses, Date.now() - startTime);
            });
        };
        
        const sorted = await mergeSortRecursive(arr);
        this.currentStepDesc.textContent = '✅ Sorting complete!';
        
        // Highlight all bars as sorted
        const bars = this.mergeBars.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.add('sorted'));
    }

    async merge(left, right, startIndex, onCompare) {
        const result = [];
        let i = 0, j = 0;
        
        this.currentStepDesc.textContent = `Merging: [${left.join(', ')}] and [${right.join(', ')}]`;
        
        while (i < left.length && j < right.length) {
            while (this.isPaused) {
                await this.sleep(100);
            }
            
            onCompare();
            
            if (left[i] <= right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
            
            await this.sleep(this.animationSpeed / 2);
        }
        
        while (i < left.length) {
            result.push(left[i]);
            i++;
        }
        
        while (j < right.length) {
            result.push(right[j]);
            j++;
        }
        
        // Update visualization
        const bars = Array.from(this.mergeBars.querySelectorAll('.bar'));
        result.forEach((value, index) => {
            const bar = bars[startIndex + index];
            if (bar) {
                bar.textContent = value;
                bar.dataset.value = value;
                const maxValue = Math.max(...this.array);
                bar.style.height = `${(value / maxValue) * 200}px`;
                bar.classList.add('current');
                setTimeout(() => bar.classList.remove('current'), this.animationSpeed);
            }
        });
        
        return result;
    }

    updateStats(comparisons, accesses, time) {
        this.mergeComparisons.textContent = comparisons;
        this.mergeAccesses.textContent = accesses;
        this.mergeTime.textContent = `${time}ms`;
    }

    async runComparison() {
        const arrays = {
            bubble: [...this.array],
            selection: [...this.array],
            merge: [...this.array]
        };
        
        // Run all three algorithms simultaneously
        await Promise.all([
            this.bubbleSort(arrays.bubble),
            this.selectionSort(arrays.selection),
            this.mergeSortComparison(arrays.merge)
        ]);
    }

    async bubbleSort(arr) {
        const startTime = Date.now();
        let comparisons = 0;
        let swaps = 0;
        const bars = Array.from(this.bubbleBars.querySelectorAll('.bar'));
        
        document.getElementById('bubbleStatus').textContent = 'Sorting...';
        document.getElementById('bubbleStatus').classList.add('sorting');
        
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                while (this.isPaused) await this.sleep(100);
                
                comparisons++;
                document.getElementById('bubbleComparisons').textContent = comparisons;
                
                bars[j].classList.add('comparing');
                bars[j + 1].classList.add('comparing');
                await this.sleep(this.animationSpeed);
                
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swaps++;
                    document.getElementById('bubbleSwaps').textContent = swaps;
                    
                    this.swapBars(bars[j], bars[j + 1]);
                    [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
                }
                
                bars[j].classList.remove('comparing');
                bars[j + 1].classList.remove('comparing');
            }
            bars[arr.length - i - 1].classList.add('sorted');
        }
        
        bars[0].classList.add('sorted');
        document.getElementById('bubbleTime').textContent = `${Date.now() - startTime}ms`;
        document.getElementById('bubbleStatus').textContent = 'Complete!';
        document.getElementById('bubbleStatus').classList.remove('sorting');
        document.getElementById('bubbleStatus').classList.add('complete');
    }

    async selectionSort(arr) {
        const startTime = Date.now();
        let comparisons = 0;
        let swaps = 0;
        const bars = Array.from(this.selectionBars.querySelectorAll('.bar'));
        
        document.getElementById('selectionStatus').textContent = 'Sorting...';
        document.getElementById('selectionStatus').classList.add('sorting');
        
        for (let i = 0; i < arr.length - 1; i++) {
            let minIdx = i;
            bars[i].classList.add('current');
            
            for (let j = i + 1; j < arr.length; j++) {
                while (this.isPaused) await this.sleep(100);
                
                comparisons++;
                document.getElementById('selectionComparisons').textContent = comparisons;
                
                bars[j].classList.add('comparing');
                await this.sleep(this.animationSpeed);
                
                if (arr[j] < arr[minIdx]) {
                    bars[minIdx].classList.remove('comparing');
                    minIdx = j;
                } else {
                    bars[j].classList.remove('comparing');
                }
            }
            
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                swaps++;
                document.getElementById('selectionSwaps').textContent = swaps;
                
                this.swapBars(bars[i], bars[minIdx]);
                [bars[i], bars[minIdx]] = [bars[minIdx], bars[i]];
            }
            
            bars[i].classList.remove('current', 'comparing');
            bars[i].classList.add('sorted');
        }
        
        bars[arr.length - 1].classList.add('sorted');
        document.getElementById('selectionTime').textContent = `${Date.now() - startTime}ms`;
        document.getElementById('selectionStatus').textContent = 'Complete!';
        document.getElementById('selectionStatus').classList.remove('sorting');
        document.getElementById('selectionStatus').classList.add('complete');
    }

    async mergeSortComparison(arr) {
        const startTime = Date.now();
        let comparisons = 0;
        let merges = 0;
        
        document.getElementById('mergeCompStatus').textContent = 'Sorting...';
        document.getElementById('mergeCompStatus').classList.add('sorting');
        
        const mergeSortHelper = async (array, left, right) => {
            if (left >= right) return;
            
            const mid = Math.floor((left + right) / 2);
            await mergeSortHelper(array, left, mid);
            await mergeSortHelper(array, mid + 1, right);
            await mergeHelper(array, left, mid, right);
        };
        
        const mergeHelper = async (array, left, mid, right) => {
            while (this.isPaused) await this.sleep(100);
            
            merges++;
            document.getElementById('mergeMerges').textContent = merges;
            
            const leftArr = array.slice(left, mid + 1);
            const rightArr = array.slice(mid + 1, right + 1);
            
            let i = 0, j = 0, k = left;
            
            while (i < leftArr.length && j < rightArr.length) {
                comparisons++;
                document.getElementById('mergeCompComparisons').textContent = comparisons;
                
                if (leftArr[i] <= rightArr[j]) {
                    array[k] = leftArr[i];
                    i++;
                } else {
                    array[k] = rightArr[j];
                    j++;
                }
                
                this.updateBar(this.mergeCompBars, k, array[k]);
                k++;
                await this.sleep(this.animationSpeed / 4);
            }
            
            while (i < leftArr.length) {
                array[k] = leftArr[i];
                this.updateBar(this.mergeCompBars, k, array[k]);
                i++;
                k++;
            }
            
            while (j < rightArr.length) {
                array[k] = rightArr[j];
                this.updateBar(this.mergeCompBars, k, array[k]);
                j++;
                k++;
            }
        };
        
        await mergeSortHelper(arr, 0, arr.length - 1);
        
        const bars = this.mergeCompBars.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.add('sorted'));
        
        document.getElementById('mergeCompTime').textContent = `${Date.now() - startTime}ms`;
        document.getElementById('mergeCompStatus').textContent = 'Complete! 🏆';
        document.getElementById('mergeCompStatus').classList.remove('sorting');
        document.getElementById('mergeCompStatus').classList.add('complete');
    }

    updateBar(container, index, value) {
        const bars = container.querySelectorAll('.bar');
        const bar = bars[index];
        if (bar) {
            bar.textContent = value;
            bar.dataset.value = value;
            const maxValue = Math.max(...this.array);
            bar.style.height = `${(value / maxValue) * 200}px`;
            bar.classList.add('current');
            setTimeout(() => bar.classList.remove('current'), this.animationSpeed / 2);
        }
    }

    swapBars(bar1, bar2) {
        const tempHeight = bar1.style.height;
        const tempText = bar1.textContent;
        const tempValue = bar1.dataset.value;
        
        bar1.style.height = bar2.style.height;
        bar1.textContent = bar2.textContent;
        bar1.dataset.value = bar2.dataset.value;
        
        bar2.style.height = tempHeight;
        bar2.textContent = tempText;
        bar2.dataset.value = tempValue;
        
        bar1.classList.add('swapping');
        bar2.classList.add('swapping');
        
        setTimeout(() => {
            bar1.classList.remove('swapping');
            bar2.classList.remove('swapping');
        }, 300);
    }

    prepareStepByStep() {
        this.steps = [];
        this.generateMergeSortSteps([...this.array], 0);
        this.stepIndex = 0;
        this.stepInfo.textContent = `Total steps: ${this.steps.length}. Click "Next Step" to begin.`;
        this.renderBarsInContainer(this.stepBars, this.array, Math.max(...this.array));
        this.isAnimating = true;
    }

    generateMergeSortSteps(arr, depth = 0) {
        const indent = '  '.repeat(depth);
        
        // Initial state
        if (depth === 0) {
            this.steps.push({
                array: [...arr],
                description: `📋 Initial array: [${arr.join(', ')}]`,
                highlights: []
            });
        }
        
        // Base case
        if (arr.length <= 1) {
            this.steps.push({
                array: [...this.array],
                description: `${indent}✅ Base case: [${arr.join(', ')}] - Already sorted (single element)`,
                highlights: []
            });
            return arr;
        }
        
        // Divide step
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        
        this.steps.push({
            array: [...this.array],
            description: `${indent}✂️ DIVIDE: [${arr.join(', ')}] → Left: [${left.join(', ')}] | Right: [${right.join(', ')}]`,
            highlights: []
        });
        
        // Recursively sort left
        this.steps.push({
            array: [...this.array],
            description: `${indent}⬅️ Sorting left half: [${left.join(', ')}]`,
            highlights: []
        });
        const sortedLeft = this.generateMergeSortSteps(left, depth + 1);
        
        // Recursively sort right
        this.steps.push({
            array: [...this.array],
            description: `${indent}➡️ Sorting right half: [${right.join(', ')}]`,
            highlights: []
        });
        const sortedRight = this.generateMergeSortSteps(right, depth + 1);
        
        // Merge step
        this.steps.push({
            array: [...this.array],
            description: `${indent}🔀 MERGE: Combining [${sortedLeft.join(', ')}] and [${sortedRight.join(', ')}]`,
            highlights: []
        });
        
        // Perform merge and track steps
        const merged = this.mergeWithSteps(sortedLeft, sortedRight, depth);
        
        this.steps.push({
            array: [...this.array],
            description: `${indent}✅ Merged result: [${merged.join(', ')}]`,
            highlights: []
        });
        
        return merged;
    }
    
    mergeWithSteps(left, right, depth) {
        const result = [];
        let i = 0, j = 0;
        const indent = '  '.repeat(depth);
        
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                this.steps.push({
                    array: [...this.array],
                    description: `${indent}  Compare ${left[i]} ≤ ${right[j]} → Take ${left[i]} from left`,
                    highlights: []
                });
                result.push(left[i]);
                i++;
            } else {
                this.steps.push({
                    array: [...this.array],
                    description: `${indent}  Compare ${left[i]} > ${right[j]} → Take ${right[j]} from right`,
                    highlights: []
                });
                result.push(right[j]);
                j++;
            }
        }
        
        // Add remaining elements
        while (i < left.length) {
            this.steps.push({
                array: [...this.array],
                description: `${indent}  Add remaining ${left[i]} from left`,
                highlights: []
            });
            result.push(left[i]);
            i++;
        }
        
        while (j < right.length) {
            this.steps.push({
                array: [...this.array],
                description: `${indent}  Add remaining ${right[j]} from right`,
                highlights: []
            });
            result.push(right[j]);
            j++;
        }
        
        return result;
    }

    nextStep() {
        if (this.stepIndex < this.steps.length) {
            const step = this.steps[this.stepIndex];
            this.operationDesc.textContent = step.description;
            
            // Update the step info
            this.stepInfo.textContent = `Step ${this.stepIndex + 1} of ${this.steps.length}`;
            
            this.stepIndex++;
            
            if (this.stepIndex >= this.steps.length) {
                this.operationDesc.textContent += '\n\n🎉 All steps complete! The array is now sorted.';
                this.stepInfo.textContent = `Completed all ${this.steps.length} steps!`;
                this.isAnimating = false;
                
                // Mark all bars as sorted
                const bars = this.stepBars.querySelectorAll('.bar');
                bars.forEach(bar => bar.classList.add('sorted'));
            }
        }
    }

    reset() {
        this.isAnimating = false;
        this.isPaused = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '⏸️ Pause';
        
        this.loadInitialArray();
        
        if (this.currentMode === 'merge-only') {
            this.currentStepDesc.textContent = 'Waiting to start...';
            this.recursionTree.innerHTML = '<p class="empty-message">Click "Start Sort" to see the divide & conquer process</p>';
            if (this.mergeComparisons) this.mergeComparisons.textContent = '0';
            if (this.mergeAccesses) this.mergeAccesses.textContent = '0';
            if (this.mergeTime) this.mergeTime.textContent = '0ms';
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});

