// Dijkstra's Algorithm Visualizer
class DijkstraVisualizer {
    constructor() {
        this.currentMode = 'interactive';
        this.animationSpeed = 800;
        this.isAnimating = false;
        
        this.graph = {};
        this.nodes = [];
        this.edges = [];
        
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.initializeCanvas();
        this.initializeDOM();
        this.attachEventListeners();
        
        // Load a simple default graph
        this.loadPreset('simple');
    }

    initializeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 40;
        this.canvas.height = 500;
    }

    initializeDOM() {
        // Mode controls
        this.interactiveControls = document.getElementById('interactiveControls');
        this.presetControls = document.getElementById('presetControls');
        this.stepControls = document.getElementById('stepControls');
        
        // Interactive mode elements
        this.cityNameInput = document.getElementById('cityName');
        this.fromCitySelect = document.getElementById('fromCity');
        this.toCitySelect = document.getElementById('toCity');
        this.roadDistanceInput = document.getElementById('roadDistance');
        this.startCitySelect = document.getElementById('startCity');
        this.endCitySelect = document.getElementById('endCity');
        
        // Preset mode elements
        this.presetStartSelect = document.getElementById('presetStartCity');
        this.presetEndSelect = document.getElementById('presetEndCity');
        
        // Stats
        this.cityCountEl = document.getElementById('cityCount');
        this.roadCountEl = document.getElementById('roadCount');
        this.visitedCountEl = document.getElementById('visitedCount');
        this.shortestDistanceEl = document.getElementById('shortestDistance');
        this.algorithmStepsEl = document.getElementById('algorithmSteps');
        
        // Results
        this.pathResult = document.getElementById('pathResult');
        this.pathDetails = document.getElementById('pathDetails');
        
        // Distance table
        this.distanceTable = document.getElementById('distanceTable');
        
        // Step mode
        this.stepDescription = document.getElementById('stepDescription');
        
        // Speed control
        this.speedSlider = document.getElementById('animationSpeed');
        this.speedLabel = document.getElementById('speedLabel');
    }

    attachEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // Interactive mode buttons
        document.getElementById('addCityBtn').addEventListener('click', () => this.addCity());
        document.getElementById('addRoadBtn').addEventListener('click', () => this.addRoad());
        document.getElementById('findPathBtn').addEventListener('click', () => this.findPath());
        document.getElementById('clearGraphBtn').addEventListener('click', () => this.clearGraph());
        document.getElementById('randomGraphBtn').addEventListener('click', () => this.generateRandomGraph());
        
        // Preset mode
        document.querySelectorAll('.preset-card').forEach(btn => {
            btn.addEventListener('click', () => this.loadPreset(btn.dataset.preset));
        });
        document.getElementById('presetFindPathBtn').addEventListener('click', () => this.findPathPreset());
        
        // Step mode
        document.getElementById('stepStartBtn').addEventListener('click', () => this.initializeStepMode());
        document.getElementById('nextStepBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('stepResetBtn').addEventListener('click', () => this.resetStepMode());
        
        // Speed control
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedLabel.textContent = `${this.animationSpeed}ms`;
        });
        
        // City name enter key
        this.cityNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCity();
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show appropriate controls
        this.interactiveControls.classList.add('hidden');
        this.presetControls.classList.add('hidden');
        this.stepControls.classList.add('hidden');
        
        if (mode === 'interactive') {
            this.interactiveControls.classList.remove('hidden');
        } else if (mode === 'preset') {
            this.presetControls.classList.remove('hidden');
            this.loadPreset('simple');
        } else {
            this.stepControls.classList.remove('hidden');
            this.loadPreset('simple');
        }
        
        this.reset();
    }

    addCity() {
        const name = this.cityNameInput.value.trim().toUpperCase();
        if (!name) {
            alert('Please enter a city name');
            return;
        }
        
        if (this.graph[name]) {
            alert('City already exists!');
            return;
        }
        
        // Add node to graph
        this.graph[name] = [];
        
        // Add node with random position
        const node = {
            id: name,
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: Math.random() * (this.canvas.height - 100) + 50
        };
        this.nodes.push(node);
        
        this.cityNameInput.value = '';
        this.updateSelects();
        this.updateStats();
        this.draw();
    }

    addRoad() {
        const from = this.fromCitySelect.value;
        const to = this.toCitySelect.value;
        const distance = parseInt(this.roadDistanceInput.value);
        
        if (!from || !to) {
            alert('Please select both cities');
            return;
        }
        
        if (from === to) {
            alert('Cannot create a road to the same city!');
            return;
        }
        
        if (!distance || distance <= 0) {
            alert('Please enter a valid distance');
            return;
        }
        
        // Check if edge already exists
        const exists = this.graph[from].some(e => e.to === to);
        if (exists) {
            alert('Road already exists!');
            return;
        }
        
        // Add edges (bidirectional)
        this.graph[from].push({ to, weight: distance });
        this.graph[to].push({ to: from, weight: distance });
        
        this.edges.push({ from, to, weight: distance });
        
        this.updateStats();
        this.draw();
    }

    updateSelects() {
        const cities = Object.keys(this.graph);
        
        // Update all select elements
        [this.fromCitySelect, this.toCitySelect, this.startCitySelect, 
         this.endCitySelect, this.presetStartSelect, this.presetEndSelect].forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select City</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                if (city === currentValue) option.selected = true;
                select.appendChild(option);
            });
        });
    }

    updateStats() {
        this.cityCountEl.textContent = this.nodes.length;
        this.roadCountEl.textContent = this.edges.length;
    }

    async findPath() {
        const start = this.startCitySelect.value;
        const end = this.endCitySelect.value;
        
        if (!start || !end) {
            alert('Please select start and end cities');
            return;
        }
        
        if (start === end) {
            alert('Start and end cities must be different!');
            return;
        }
        
        await this.runDijkstra(start, end);
    }

    async findPathPreset() {
        const start = this.presetStartSelect.value;
        const end = this.presetEndSelect.value;
        
        if (!start || !end) {
            alert('Please select start and end cities');
            return;
        }
        
        if (start === end) {
            alert('Start and end cities must be different!');
            return;
        }
        
        await this.runDijkstra(start, end);
    }

    async runDijkstra(start, end) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.pathResult.classList.add('hidden');
        this.visitedCountEl.textContent = '0';
        this.shortestDistanceEl.textContent = '-';
        this.algorithmStepsEl.textContent = '0';
        
        // Initialize
        const distances = {};
        const previous = {};
        const visited = new Set();
        const unvisited = new Set();
        
        // Set all distances to infinity
        for (let node in this.graph) {
            distances[node] = Infinity;
            unvisited.add(node);
        }
        distances[start] = 0;
        
        let steps = 0;
        
        // Update distance table
        this.updateDistanceTable(distances, visited, start);
        
        while (unvisited.size > 0) {
            // Find node with minimum distance
            let current = null;
            let minDist = Infinity;
            
            for (let node of unvisited) {
                if (distances[node] < minDist) {
                    minDist = distances[node];
                    current = node;
                }
            }
            
            if (current === null || distances[current] === Infinity) break;
            
            // Mark as visited
            visited.add(current);
            unvisited.delete(current);
            steps++;
            
            this.visitedCountEl.textContent = visited.size;
            this.algorithmStepsEl.textContent = steps;
            
            // Draw current state
            this.drawWithState(visited, current, previous, start, end);
            this.updateDistanceTable(distances, visited, current);
            
            await this.sleep(this.animationSpeed);
            
            // If we reached the end, we can stop
            if (current === end) break;
            
            // Update distances to neighbors
            for (let edge of this.graph[current]) {
                if (visited.has(edge.to)) continue;
                
                const newDist = distances[current] + edge.weight;
                
                if (newDist < distances[edge.to]) {
                    distances[edge.to] = newDist;
                    previous[edge.to] = current;
                    
                    this.updateDistanceTable(distances, visited, current);
                    await this.sleep(this.animationSpeed / 2);
                }
            }
        }
        
        // Reconstruct path
        const path = [];
        let current = end;
        
        while (current) {
            path.unshift(current);
            current = previous[current];
        }
        
        // Show result
        if (path.length > 1 && path[0] === start) {
            this.shortestDistanceEl.textContent = `${distances[end]} km`;
            this.drawFinalPath(path, distances[end]);
            this.showPathResult(path, distances[end]);
        } else {
            alert('No path found between these cities!');
        }
        
        this.isAnimating = false;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 3;
        
        for (let edge of this.edges) {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x, fromNode.y);
                this.ctx.lineTo(toNode.x, toNode.y);
                this.ctx.stroke();
                
                // Draw weight
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(midX - 15, midY - 12, 30, 24);
                
                this.ctx.fillStyle = '#333';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(edge.weight, midX, midY);
            }
        }
        
        // Draw nodes
        for (let node of this.nodes) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
            this.ctx.fillStyle = '#667eea';
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // Draw label
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.id, node.x, node.y);
        }
    }

    drawWithState(visited, current, previous, start, end) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges
        this.ctx.lineWidth = 3;
        
        for (let edge of this.edges) {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
                this.ctx.strokeStyle = '#e0e0e0';
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x, fromNode.y);
                this.ctx.lineTo(toNode.x, toNode.y);
                this.ctx.stroke();
                
                // Draw weight
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(midX - 15, midY - 12, 30, 24);
                
                this.ctx.fillStyle = '#333';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(edge.weight, midX, midY);
            }
        }
        
        // Draw nodes
        for (let node of this.nodes) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
            
            if (node.id === current) {
                this.ctx.fillStyle = '#fbbf24'; // Current (yellow)
            } else if (visited.has(node.id)) {
                this.ctx.fillStyle = '#48bb78'; // Visited (green)
            } else {
                this.ctx.fillStyle = '#667eea'; // Unvisited (purple)
            }
            
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // Draw label
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.id, node.x, node.y);
        }
    }

    drawFinalPath(path, distance) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all edges normally
        this.ctx.lineWidth = 3;
        
        for (let edge of this.edges) {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
                // Check if this edge is in the path
                let inPath = false;
                for (let i = 0; i < path.length - 1; i++) {
                    if ((path[i] === edge.from && path[i + 1] === edge.to) ||
                        (path[i] === edge.to && path[i + 1] === edge.from)) {
                        inPath = true;
                        break;
                    }
                }
                
                this.ctx.strokeStyle = inPath ? '#f56565' : '#e0e0e0';
                this.ctx.lineWidth = inPath ? 5 : 3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x, fromNode.y);
                this.ctx.lineTo(toNode.x, toNode.y);
                this.ctx.stroke();
                
                // Draw weight
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(midX - 15, midY - 12, 30, 24);
                
                this.ctx.fillStyle = inPath ? '#f56565' : '#333';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(edge.weight, midX, midY);
            }
        }
        
        // Draw nodes
        for (let node of this.nodes) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
            
            if (path.includes(node.id)) {
                this.ctx.fillStyle = '#f56565'; // Path node (red)
            } else {
                this.ctx.fillStyle = '#48bb78'; // Visited (green)
            }
            
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // Draw label
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.id, node.x, node.y);
        }
    }

    updateDistanceTable(distances, visited, current) {
        const sortedNodes = Object.keys(distances).sort();
        
        let html = '<div class="table-row header"><div>City</div><div>Distance</div><div>Status</div></div>';
        
        for (let node of sortedNodes) {
            const dist = distances[node] === Infinity ? '∞' : distances[node];
            const status = visited.has(node) ? 'Visited' : 'Unvisited';
            const rowClass = node === current ? 'current' : visited.has(node) ? 'visited' : '';
            
            html += `<div class="table-row ${rowClass}">
                <div><strong>${node}</strong></div>
                <div>${dist} km</div>
                <div>${status}</div>
            </div>`;
        }
        
        this.distanceTable.innerHTML = html;
    }

    showPathResult(path, distance) {
        const pathStr = path.join(' → ');
        this.pathDetails.innerHTML = `
            <p><strong>Path:</strong> ${pathStr}</p>
            <p><strong>Total Distance:</strong> ${distance} km</p>
            <p><strong>Cities Visited:</strong> ${path.length}</p>
        `;
        this.pathResult.classList.remove('hidden');
    }

    loadPreset(preset) {
        this.clearGraph();
        
        const presets = {
            simple: {
                nodes: ['A', 'B', 'C', 'D', 'E'],
                edges: [
                    { from: 'A', to: 'B', weight: 4 },
                    { from: 'A', to: 'C', weight: 2 },
                    { from: 'B', to: 'C', weight: 1 },
                    { from: 'B', to: 'D', weight: 5 },
                    { from: 'C', to: 'D', weight: 8 },
                    { from: 'C', to: 'E', weight: 10 },
                    { from: 'D', to: 'E', weight: 2 }
                ]
            },
            complex: {
                nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                edges: [
                    { from: 'A', to: 'B', weight: 7 },
                    { from: 'A', to: 'C', weight: 9 },
                    { from: 'A', to: 'F', weight: 14 },
                    { from: 'B', to: 'C', weight: 10 },
                    { from: 'B', to: 'D', weight: 15 },
                    { from: 'C', to: 'D', weight: 11 },
                    { from: 'C', to: 'F', weight: 2 },
                    { from: 'D', to: 'E', weight: 6 },
                    { from: 'E', to: 'F', weight: 9 },
                    { from: 'F', to: 'G', weight: 12 },
                    { from: 'G', to: 'H', weight: 4 },
                    { from: 'E', to: 'H', weight: 8 }
                ]
            },
            highway: {
                nodes: ['NYC', 'BOS', 'PHL', 'DC', 'ATL', 'MIA', 'CHI', 'DET', 'CLE', 'PIT'],
                edges: [
                    { from: 'NYC', to: 'BOS', weight: 215 },
                    { from: 'NYC', to: 'PHL', weight: 95 },
                    { from: 'PHL', to: 'DC', weight: 140 },
                    { from: 'DC', to: 'ATL', weight: 640 },
                    { from: 'ATL', to: 'MIA', weight: 660 },
                    { from: 'NYC', to: 'PIT', weight: 370 },
                    { from: 'PIT', to: 'CLE', weight: 135 },
                    { from: 'CLE', to: 'DET', weight: 170 },
                    { from: 'DET', to: 'CHI', weight: 280 },
                    { from: 'CHI', to: 'CLE', weight: 345 }
                ]
            },
            metro: {
                nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
                edges: [
                    { from: 'A', to: 'B', weight: 2 },
                    { from: 'A', to: 'C', weight: 3 },
                    { from: 'B', to: 'C', weight: 1 },
                    { from: 'B', to: 'D', weight: 4 },
                    { from: 'B', to: 'E', weight: 5 },
                    { from: 'C', to: 'D', weight: 2 },
                    { from: 'C', to: 'E', weight: 3 },
                    { from: 'D', to: 'E', weight: 1 },
                    { from: 'D', to: 'F', weight: 6 },
                    { from: 'E', to: 'F', weight: 2 }
                ]
            }
        };
        
        const data = presets[preset];
        if (!data) return;
        
        // Add nodes in a circular layout
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 80;
        
        data.nodes.forEach((name, index) => {
            const angle = (index / data.nodes.length) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.graph[name] = [];
            this.nodes.push({ id: name, x, y });
        });
        
        // Add edges
        data.edges.forEach(edge => {
            this.graph[edge.from].push({ to: edge.to, weight: edge.weight });
            this.graph[edge.to].push({ to: edge.from, weight: edge.weight });
            this.edges.push(edge);
        });
        
        this.updateSelects();
        this.updateStats();
        this.draw();
    }

    generateRandomGraph() {
        this.clearGraph();
        
        const cityNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const numCities = Math.floor(Math.random() * 4) + 5; // 5-8 cities
        
        // Add cities in circular layout
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 80;
        
        for (let i = 0; i < numCities; i++) {
            const name = cityNames[i];
            const angle = (i / numCities) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.graph[name] = [];
            this.nodes.push({ id: name, x, y });
        }
        
        // Add random edges
        const cities = Object.keys(this.graph);
        for (let i = 0; i < cities.length; i++) {
            for (let j = i + 1; j < cities.length; j++) {
                if (Math.random() > 0.5) { // 50% chance of connection
                    const weight = Math.floor(Math.random() * 20) + 5; // 5-25 km
                    this.graph[cities[i]].push({ to: cities[j], weight });
                    this.graph[cities[j]].push({ to: cities[i], weight });
                    this.edges.push({ from: cities[i], to: cities[j], weight });
                }
            }
        }
        
        this.updateSelects();
        this.updateStats();
        this.draw();
    }

    clearGraph() {
        this.graph = {};
        this.nodes = [];
        this.edges = [];
        this.pathResult.classList.add('hidden');
        this.visitedCountEl.textContent = '0';
        this.shortestDistanceEl.textContent = '-';
        this.algorithmStepsEl.textContent = '0';
        this.distanceTable.innerHTML = '<p class="empty-message">Add cities to see distance calculations</p>';
        this.updateSelects();
        this.updateStats();
        this.draw();
    }

    reset() {
        this.isAnimating = false;
        this.pathResult.classList.add('hidden');
        this.visitedCountEl.textContent = '0';
        this.shortestDistanceEl.textContent = '-';
        this.algorithmStepsEl.textContent = '0';
        this.draw();
    }

    initializeStepMode() {
        // Simplified for now - just run normal dijkstra
        const start = this.presetStartSelect.value || Object.keys(this.graph)[0];
        const end = this.presetEndSelect.value || Object.keys(this.graph)[Object.keys(this.graph).length - 1];
        this.runDijkstra(start, end);
    }

    nextStep() {
        // Would implement step-by-step logic here
        this.stepDescription.textContent = 'Step-by-step mode in progress...';
    }

    resetStepMode() {
        this.reset();
        this.stepDescription.textContent = 'Select a preset city network and click Initialize to begin';
        document.getElementById('nextStepBtn').disabled = true;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new DijkstraVisualizer();
});

