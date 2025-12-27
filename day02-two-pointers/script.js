// Two Pointers Technique Implementation
class TwoPointers {
    constructor() {
        this.currentMode = 'palindrome';
        this.palindromeSpeed = 600;
        this.pairSumSpeed = 600;
        this.isAnimating = false;
        
        this.initializeDOM();
        this.attachEventListeners();
    }

    initializeDOM() {
        // Mode buttons
        this.modeBtns = document.querySelectorAll('.mode-btn');
        
        // Sections
        this.palindromeSection = document.getElementById('palindrome-section');
        this.pairSumSection = document.getElementById('pair-sum-section');
        
        // Palindrome elements
        this.palindromeInput = document.getElementById('palindromeInput');
        this.checkPalindromeBtn = document.getElementById('checkPalindromeBtn');
        this.ignoreSpaces = document.getElementById('ignoreSpaces');
        this.ignoreCase = document.getElementById('ignoreCase');
        this.palindromeSpeedSlider = document.getElementById('palindromeSpeed');
        this.palindromeSpeedLabel = document.getElementById('palindromeSpeedLabel');
        this.charContainer = document.getElementById('charContainer');
        this.palindromeResult = document.getElementById('palindromeResult');
        this.palindromeComparisons = document.getElementById('palindromeComparisons');
        this.palindromeStatus = document.getElementById('palindromeStatus');
        
        // Pair sum elements
        this.arrayInput = document.getElementById('arrayInput');
        this.targetSum = document.getElementById('targetSum');
        this.findPairsBtn = document.getElementById('findPairsBtn');
        this.generateRandomBtn = document.getElementById('generateRandomBtn');
        this.sortArrayBtn = document.getElementById('sortArrayBtn');
        this.pairSumSpeedSlider = document.getElementById('pairSumSpeed');
        this.pairSumSpeedLabel = document.getElementById('pairSumSpeedLabel');
        this.numberContainer = document.getElementById('numberContainer');
        this.currentSumDisplay = document.getElementById('currentSum');
        this.pairsList = document.getElementById('pairsList');
        this.pairComparisons = document.getElementById('pairComparisons');
        this.pairsFound = document.getElementById('pairsFound');
    }

    attachEventListeners() {
        // Mode switching
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // Palindrome
        this.checkPalindromeBtn.addEventListener('click', () => this.checkPalindrome());
        this.palindromeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkPalindrome();
        });
        this.palindromeSpeedSlider.addEventListener('input', (e) => {
            this.palindromeSpeed = parseInt(e.target.value);
            this.palindromeSpeedLabel.textContent = `${this.palindromeSpeed}ms`;
        });
        
        // Quick test buttons for palindrome
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.palindromeInput.value = btn.dataset.text;
                this.checkPalindrome();
            });
        });
        
        // Pair sum
        this.findPairsBtn.addEventListener('click', () => this.findPairs());
        this.generateRandomBtn.addEventListener('click', () => this.generateRandomArray());
        this.sortArrayBtn.addEventListener('click', () => this.sortArray());
        this.pairSumSpeedSlider.addEventListener('input', (e) => {
            this.pairSumSpeed = parseInt(e.target.value);
            this.pairSumSpeedLabel.textContent = `${this.pairSumSpeed}ms`;
        });
        
        // Quick test buttons for pair sum
        document.querySelectorAll('.quick-btn-pair').forEach(btn => {
            btn.addEventListener('click', () => {
                this.arrayInput.value = btn.dataset.array;
                this.targetSum.value = btn.dataset.target;
                this.findPairs();
            });
        });
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
        
        // Show appropriate section
        if (mode === 'palindrome') {
            this.palindromeSection.classList.add('active');
            this.pairSumSection.classList.remove('active');
        } else {
            this.palindromeSection.classList.remove('active');
            this.pairSumSection.classList.add('active');
        }
    }

    // Palindrome functionality
    async checkPalindrome() {
        if (this.isAnimating) return;
        
        let text = this.palindromeInput.value;
        if (!text) {
            alert('Please enter some text');
            return;
        }
        
        this.isAnimating = true;
        this.checkPalindromeBtn.disabled = true;
        this.palindromeResult.classList.remove('visible');
        
        // Process text based on options
        if (this.ignoreSpaces.checked) {
            text = text.replace(/[^a-zA-Z0-9]/g, '');
        }
        if (this.ignoreCase.checked) {
            text = text.toLowerCase();
        }
        
        // Render characters
        this.renderCharacters(text);
        
        // Perform palindrome check
        const isPalindrome = await this.animatePalindromeCheck(text);
        
        // Show result
        this.showPalindromeResult(isPalindrome);
        
        this.isAnimating = false;
        this.checkPalindromeBtn.disabled = false;
    }

    renderCharacters(text) {
        this.charContainer.innerHTML = '';
        for (let char of text) {
            const charBox = document.createElement('div');
            charBox.className = 'char-box';
            charBox.textContent = char;
            this.charContainer.appendChild(charBox);
        }
    }

    async animatePalindromeCheck(text) {
        const chars = Array.from(this.charContainer.children);
        let left = 0;
        let right = text.length - 1;
        let comparisons = 0;
        
        this.palindromeStatus.textContent = '🔍 Checking...';
        
        // Show pointer indicators
        document.querySelectorAll('#palindrome-section .pointer-indicator').forEach(el => {
            el.classList.add('visible');
        });
        
        while (left < right) {
            comparisons++;
            this.palindromeComparisons.textContent = comparisons;
            
            // Highlight current pointers
            chars[left].classList.add('left-pointer');
            chars[right].classList.add('right-pointer');
            
            await this.sleep(this.palindromeSpeed);
            
            if (text[left] !== text[right]) {
                // Mismatch found
                chars[left].classList.add('mismatch');
                chars[right].classList.add('mismatch');
                this.palindromeStatus.textContent = '❌ Not a palindrome';
                
                await this.sleep(this.palindromeSpeed);
                return false;
            }
            
            // Match found
            chars[left].classList.add('match');
            chars[right].classList.add('match');
            chars[left].classList.remove('left-pointer');
            chars[right].classList.remove('right-pointer');
            
            left++;
            right--;
            
            await this.sleep(this.palindromeSpeed / 2);
        }
        
        this.palindromeStatus.textContent = '✅ Is a palindrome!';
        return true;
    }

    showPalindromeResult(isPalindrome) {
        const message = isPalindrome 
            ? `✅ Yes! This is a palindrome!` 
            : `❌ No, this is not a palindrome`;
        
        this.palindromeResult.textContent = message;
        this.palindromeResult.className = `result-message visible ${isPalindrome ? 'success' : 'error'}`;
    }

    // Pair sum functionality
    async findPairs() {
        if (this.isAnimating) return;
        
        const arrayStr = this.arrayInput.value.trim();
        const target = parseInt(this.targetSum.value);
        
        if (!arrayStr || isNaN(target)) {
            alert('Please enter a valid array and target sum');
            return;
        }
        
        const arr = arrayStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        
        if (arr.length < 2) {
            alert('Array must have at least 2 elements');
            return;
        }
        
        // Check if array is sorted
        const isSorted = arr.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
        if (!isSorted) {
            if (confirm('Array is not sorted. Sort it now?')) {
                arr.sort((a, b) => a - b);
                this.arrayInput.value = arr.join(',');
            } else {
                return;
            }
        }
        
        this.isAnimating = true;
        this.findPairsBtn.disabled = true;
        this.pairsList.innerHTML = '';
        this.currentSumDisplay.classList.remove('visible');
        
        // Render numbers
        this.renderNumbers(arr);
        
        // Find pairs
        await this.animatePairSum(arr, target);
        
        this.isAnimating = false;
        this.findPairsBtn.disabled = false;
    }

    renderNumbers(arr) {
        this.numberContainer.innerHTML = '';
        arr.forEach(num => {
            const numBox = document.createElement('div');
            numBox.className = 'num-box';
            numBox.textContent = num;
            numBox.dataset.value = num;
            this.numberContainer.appendChild(numBox);
        });
    }

    async animatePairSum(arr, target) {
        const numBoxes = Array.from(this.numberContainer.children);
        let left = 0;
        let right = arr.length - 1;
        let comparisons = 0;
        let pairsCount = 0;
        
        this.pairComparisons.textContent = '0';
        this.pairsFound.textContent = '0';
        
        // Show pointer indicators
        document.querySelectorAll('#pair-sum-section .pointer-indicator').forEach(el => {
            el.classList.add('visible');
        });
        
        this.currentSumDisplay.classList.add('visible');
        
        while (left < right) {
            comparisons++;
            this.pairComparisons.textContent = comparisons;
            
            // Highlight current pointers
            numBoxes[left].classList.add('left-pointer');
            numBoxes[right].classList.add('right-pointer');
            
            const sum = arr[left] + arr[right];
            this.currentSumDisplay.textContent = `${arr[left]} + ${arr[right]} = ${sum}`;
            
            await this.sleep(this.pairSumSpeed);
            
            if (sum === target) {
                // Found a pair!
                numBoxes[left].classList.add('match');
                numBoxes[right].classList.add('match');
                
                pairsCount++;
                this.pairsFound.textContent = pairsCount;
                this.addPairToList(arr[left], arr[right], sum);
                
                await this.sleep(this.pairSumSpeed);
                
                numBoxes[left].classList.remove('left-pointer', 'match');
                numBoxes[right].classList.remove('right-pointer', 'match');
                
                left++;
                right--;
            } else if (sum < target) {
                numBoxes[left].classList.remove('left-pointer');
                left++;
            } else {
                numBoxes[right].classList.remove('right-pointer');
                right--;
            }
            
            await this.sleep(this.pairSumSpeed / 3);
        }
        
        this.currentSumDisplay.textContent = pairsCount > 0 
            ? `✅ Found ${pairsCount} pair${pairsCount > 1 ? 's' : ''}!`
            : `❌ No pairs found that sum to ${target}`;
    }

    addPairToList(num1, num2, sum) {
        const pairItem = document.createElement('div');
        pairItem.className = 'pair-item';
        pairItem.textContent = `✅ ${num1} + ${num2} = ${sum}`;
        this.pairsList.appendChild(pairItem);
    }

    generateRandomArray() {
        const length = Math.floor(Math.random() * 10) + 8; // 8-17 elements
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(Math.floor(Math.random() * 50) + 1);
        }
        arr.sort((a, b) => a - b);
        this.arrayInput.value = arr.join(',');
        
        // Generate a reasonable target
        const randomTarget = arr[Math.floor(Math.random() * arr.length)] + 
                           arr[Math.floor(Math.random() * arr.length)];
        this.targetSum.value = randomTarget;
    }

    sortArray() {
        const arrayStr = this.arrayInput.value.trim();
        if (!arrayStr) {
            alert('Please enter an array first');
            return;
        }
        
        const arr = arrayStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        arr.sort((a, b) => a - b);
        this.arrayInput.value = arr.join(',');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TwoPointers();
});

