// Binary Search Implementation
class BinarySearch {
    constructor() {
        this.books = Array.from({ length: 100 }, (_, i) => i + 1);
        this.animationSpeed = 800;
        this.isSearching = false;
        this.mode = 'binary'; // 'binary', 'linear', 'both'
        
        this.initializeDOM();
        this.attachEventListeners();
        this.renderBooks();
    }

    initializeDOM() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedLabel = document.getElementById('speedLabel');
        
        this.binaryBtn = document.getElementById('binaryBtn');
        this.linearBtn = document.getElementById('linearBtn');
        this.bothBtn = document.getElementById('bothBtn');
        
        this.binaryContainer = document.getElementById('binaryContainer');
        this.linearContainer = document.getElementById('linearContainer');
        
        this.binaryShelf = document.getElementById('binaryShelf');
        this.linearShelf = document.getElementById('linearShelf');
        
        this.binaryMessage = document.getElementById('binaryMessage');
        this.linearMessage = document.getElementById('linearMessage');
        
        this.binarySteps = document.getElementById('binarySteps');
        this.linearSteps = document.getElementById('linearSteps');
        
        this.binaryStatus = document.getElementById('binaryStatus');
        this.linearStatus = document.getElementById('linearStatus');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.startSearch());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startSearch();
        });
        
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedLabel.textContent = `${this.animationSpeed}ms`;
        });
        
        this.binaryBtn.addEventListener('click', () => this.setMode('binary'));
        this.linearBtn.addEventListener('click', () => this.setMode('linear'));
        this.bothBtn.addEventListener('click', () => this.setMode('both'));
    }

    setMode(mode) {
        this.mode = mode;
        
        // Update button states
        [this.binaryBtn, this.linearBtn, this.bothBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (mode === 'binary') {
            this.binaryBtn.classList.add('active');
            this.binaryContainer.classList.remove('hidden');
            this.linearContainer.classList.add('hidden');
        } else if (mode === 'linear') {
            this.linearBtn.classList.add('active');
            this.binaryContainer.classList.add('hidden');
            this.linearContainer.classList.remove('hidden');
        } else {
            this.bothBtn.classList.add('active');
            this.binaryContainer.classList.remove('hidden');
            this.linearContainer.classList.remove('hidden');
        }
        
        this.reset();
    }

    renderBooks() {
        // Render for binary search - show subset for better visualization
        this.binaryShelf.innerHTML = '';
        const binarySubset = this.books.filter((_, i) => i % 5 === 0); // Show every 5th book
        binarySubset.forEach(bookId => {
            const book = this.createBookElement(bookId);
            this.binaryShelf.appendChild(book);
        });
        
        // Render for linear search - show subset
        this.linearShelf.innerHTML = '';
        const linearSubset = this.books.filter((_, i) => i % 5 === 0);
        linearSubset.forEach(bookId => {
            const book = this.createBookElement(bookId);
            this.linearShelf.appendChild(book);
        });
    }

    createBookElement(bookId) {
        const book = document.createElement('div');
        book.className = 'book';
        book.textContent = bookId;
        book.dataset.id = bookId;
        return book;
    }

    async startSearch() {
        const target = parseInt(this.searchInput.value);
        
        if (isNaN(target) || target < 1 || target > 100) {
            alert('Please enter a valid book ID between 1 and 100');
            return;
        }
        
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.searchBtn.disabled = true;
        this.resetBtn.disabled = false;
        
        this.binaryMessage.classList.remove('visible');
        this.linearMessage.classList.remove('visible');
        
        if (this.mode === 'binary') {
            await this.performBinarySearch(target);
        } else if (this.mode === 'linear') {
            await this.performLinearSearch(target);
        } else {
            // Race both algorithms
            await Promise.all([
                this.performBinarySearch(target),
                this.performLinearSearch(target)
            ]);
        }
        
        this.isSearching = false;
        this.searchBtn.disabled = false;
    }

    async performBinarySearch(target) {
        this.binaryStatus.textContent = '🔍 Searching...';
        this.binarySteps.textContent = '0';
        
        const books = Array.from(this.binaryShelf.querySelectorAll('.book'));
        let left = 0;
        let right = this.books.length - 1;
        let steps = 0;
        let found = false;
        
        while (left <= right) {
            steps++;
            this.binarySteps.textContent = steps;
            
            const mid = Math.floor((left + right) / 2);
            const midValue = this.books[mid];
            
            // Find corresponding book elements to highlight
            const leftBook = books.find(b => parseInt(b.dataset.id) === this.books[left]);
            const rightBook = books.find(b => parseInt(b.dataset.id) === this.books[right]);
            const midBook = books.find(b => parseInt(b.dataset.id) === midValue);
            
            // Clear previous pointers
            books.forEach(b => {
                b.classList.remove('left-pointer', 'right-pointer', 'mid-pointer');
            });
            
            // Add pointers
            if (leftBook) leftBook.classList.add('left-pointer');
            if (rightBook) rightBook.classList.add('right-pointer');
            if (midBook) {
                midBook.classList.add('mid-pointer');
                midBook.classList.add('checking');
            }
            
            await this.sleep(this.animationSpeed);
            
            if (midValue === target) {
                // Found!
                if (midBook) {
                    midBook.classList.remove('checking');
                    midBook.classList.add('found');
                }
                this.showMessage(this.binaryMessage, `✅ Book ${target} found in ${steps} steps!`, 'success');
                this.binaryStatus.textContent = '✅ Found!';
                found = true;
                break;
            } else if (midValue < target) {
                // Eliminate left half
                left = mid + 1;
                books.forEach(b => {
                    const id = parseInt(b.dataset.id);
                    if (id < midValue) {
                        b.classList.add('eliminated');
                    }
                });
                if (midBook) midBook.classList.remove('checking');
            } else {
                // Eliminate right half
                right = mid - 1;
                books.forEach(b => {
                    const id = parseInt(b.dataset.id);
                    if (id > midValue) {
                        b.classList.add('eliminated');
                    }
                });
                if (midBook) midBook.classList.remove('checking');
            }
            
            await this.sleep(this.animationSpeed / 2);
        }
        
        if (!found) {
            this.showMessage(this.binaryMessage, `❌ Book ${target} not found after ${steps} steps`, 'error');
            this.binaryStatus.textContent = '❌ Not Found';
        }
    }

    async performLinearSearch(target) {
        this.linearStatus.textContent = '🔍 Searching...';
        this.linearSteps.textContent = '0';
        
        const books = Array.from(this.linearShelf.querySelectorAll('.book'));
        let steps = 0;
        let found = false;
        
        for (let i = 0; i < this.books.length; i++) {
            steps++;
            this.linearSteps.textContent = steps;
            
            const currentValue = this.books[i];
            const currentBook = books.find(b => parseInt(b.dataset.id) === currentValue);
            
            if (currentBook) {
                currentBook.classList.add('checking');
                await this.sleep(this.animationSpeed);
            }
            
            if (currentValue === target) {
                // Found!
                if (currentBook) {
                    currentBook.classList.remove('checking');
                    currentBook.classList.add('found');
                }
                this.showMessage(this.linearMessage, `✅ Book ${target} found in ${steps} steps!`, 'success');
                this.linearStatus.textContent = '✅ Found!';
                found = true;
                break;
            } else {
                if (currentBook) {
                    currentBook.classList.remove('checking');
                    currentBook.classList.add('eliminated');
                }
            }
        }
        
        if (!found) {
            this.showMessage(this.linearMessage, `❌ Book ${target} not found after ${steps} steps`, 'error');
            this.linearStatus.textContent = '❌ Not Found';
        }
    }

    showMessage(element, message, type) {
        element.textContent = message;
        element.className = `search-message visible ${type}`;
    }

    reset() {
        this.isSearching = false;
        this.searchBtn.disabled = false;
        this.resetBtn.disabled = false;
        
        this.binarySteps.textContent = '0';
        this.linearSteps.textContent = '0';
        
        this.binaryStatus.textContent = 'Ready';
        this.linearStatus.textContent = 'Ready';
        
        this.binaryMessage.classList.remove('visible');
        this.linearMessage.classList.remove('visible');
        
        this.renderBooks();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new BinarySearch();
});

