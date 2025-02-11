class ChargerGame {
    constructor() {
        this.currentLevel = 0;
        this.score = 0;
        this.maxLives = 3;
        this.lives = this.maxLives;
        this.levels = [
            {
                id: 1,
                title: "Hardware Basics",
                description: "Learn the fundamental components of an AC charger",
                difficulty: "Easy",
                points: 100,
                challenges: [
                    {
                        type: "drag-and-drop",
                        task: "Assemble the AC charger components in the correct sequence",
                        elements: [
                            { id: "contactor", name: "Contactor", hint: "Power Switch" },
                            { id: "mcu", name: "MCU", hint: "Control Unit" },
                            { id: "sensors", name: "Sensors", hint: "Current Monitor" },
                            { id: "pwm", name: "PWM", hint: "Signal Control" },
                            { id: "psu", name: "Power Supply", hint: "Power Source" }
                        ],
                        positions: [
                            { id: "psu", label: "AC Input Stage" },
                            { id: "mcu", label: "System Brain" },
                            { id: "sensors", label: "Safety Check" },
                            { id: "pwm", label: "EV Communication" },
                            { id: "contactor", label: "Vehicle Connection" }
                        ]
                    }
                ],
                quiz: {
                    question: "Which component acts as the main safety switch?",
                    options: ["MCU", "Contactor", "PWM Generator", "Current Sensors"],
                    correct: 1
                }
            },
            {
                id: 2,
                title: "IEC 61851-1 States",
                description: "Master the charging states and transitions",
                difficulty: "Medium",
                points: 150,
                challenges: [
                    {
                        type: "state-machine",
                        task: "Guide the charging process through correct states",
                        states: [
                            { id: "A", name: "Standby", transitions: ["B"] },
                            { id: "B", name: "Vehicle Connected", transitions: ["A", "C", "E"] },
                            { id: "C", name: "Charging", transitions: ["B", "D"] },
                            { id: "D", name: "Special Charging", transitions: ["B"] },
                            { id: "E", name: "Error", transitions: ["A"] }
                        ],
                        scenario: [
                            "Vehicle connects",
                            "Start charging",
                            "Error detected",
                            "Reset system"
                        ]
                    }
                ]
            },
            {
                id: 3,
                title: "ISO 15118 Communication",
                description: "Explore V2G communication layers",
                difficulty: "Hard",
                points: 200,
                challenges: [
                    {
                        type: "protocol-stack",
                        task: "Build the communication stack in correct order",
                        layers: [
                            { id: "app", name: "Application (V2G Messages)" },
                            { id: "transport", name: "Transport (TCP/IP)" },
                            { id: "network", name: "Network (IPv6)" },
                            { id: "datalink", name: "Data Link (HomePlug GreenPHY)" },
                            { id: "physical", name: "Physical (Control Pilot)" }
                        ]
                    }
                ]
            }
        ];

        // Initialize game UI once
        this.initializeGame();
    }

    initializeGame() {
        const gameStage = document.querySelector('.game-stage');
        const levelSelector = document.querySelector('.level-selector');
        if (!gameStage || !levelSelector) return;

        // Clear any existing content
        gameStage.innerHTML = '';
        levelSelector.innerHTML = '';

        // Create game elements container
        const gameElements = document.createElement('div');
        gameElements.className = 'game-elements';
        gameStage.appendChild(gameElements);

        // Add level buttons
        this.levels.forEach((level, index) => {
            const button = document.createElement('button');
            button.textContent = `Level ${level.id}: ${level.title}`;
            button.className = index === this.currentLevel ? 'active' : '';
            button.onclick = () => {
                // Update active button
                levelSelector.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // Load selected level
                this.currentLevel = index;
                this.loadLevel(index);
            };
            levelSelector.appendChild(button);
        });

        // Load the first level
        this.loadLevel(this.currentLevel);
        
        // Initialize score and lives display
        this.updateScore();
        this.updateLives();
    }

    loadLevel(levelIndex) {
        const level = this.levels[levelIndex];
        const container = document.querySelector('.game-elements');
        if (!container) return;

        container.innerHTML = '';  // Clear previous level content
        
        // Setup the current level's challenge
        if (level.challenges[0].type === "drag-and-drop") {
            this.setupDragAndDrop(level.challenges[0], container);
        }
    }

    setupDragAndDrop(challenge, container) {
        const elementsContainer = document.createElement('div');
        elementsContainer.className = 'elements-container';
        
        // Create schematic area with labeled positions
        const schematicArea = document.createElement('div');
        schematicArea.className = 'schematic-area';
        schematicArea.innerHTML = `
            <div class="schematic-grid">
                ${challenge.positions.map(pos => `
                    <div class="drop-zone" data-position="${pos.id}">
                        ${pos.label}
                    </div>
                `).join('')}
            </div>
        `;
        
        // Create draggable elements with simpler labels
        challenge.elements.forEach(element => {
            const div = document.createElement('div');
            div.className = 'draggable';
            div.draggable = true;
            div.dataset.id = element.id;
            div.innerHTML = `
                <strong>${element.name}</strong>
                <span class="hint">${element.hint}</span>
            `;
            
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element.id);
                div.classList.add('dragging');
            });
            
            div.addEventListener('dragend', () => {
                div.classList.remove('dragging');
            });
            
            elementsContainer.appendChild(div);
        });

        // Update drop zone behavior
        const dropZones = schematicArea.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', e => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const componentId = e.dataTransfer.getData('text/plain');
                
                if (componentId === zone.dataset.position) {
                    zone.classList.add('correct');
                    this.score += 10;
                    this.updateScore();
                    
                    // Check if all components are placed correctly
                    const allCorrect = Array.from(dropZones).every(z => z.classList.contains('correct'));
                    if (allCorrect) {
                        this.score += 50;
                        this.updateScore();
                        this.showFeedback(true, "Level completed! +50 points");
                        setTimeout(() => this.loadNextLevel(), 2000);
                    }
                } else {
                    zone.classList.add('incorrect');
                    setTimeout(() => zone.classList.remove('incorrect'), 1000);
                    this.lives--;
                    this.updateLives();
                    this.showFeedback(false, "Try again!");
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            });
        });

        container.appendChild(elementsContainer);
        container.appendChild(schematicArea);
    }

    updateScore() {
        const scoreElement = document.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    updateLives() {
        const livesContainer = document.querySelector('.lives');
        if (livesContainer) {
            const percentage = (this.lives / this.maxLives) * 100;
            livesContainer.innerHTML = `
                <div class="battery-container">
                    <div class="battery-level" style="
                        height: ${percentage}%;
                        background-color: ${
                            percentage > 66 ? 'var(--primary-color)' :
                            percentage > 33 ? '#fbbf24' : // Yellow
                            '#ef4444' // Red
                        }
                    "></div>
                </div>
            `;
        }
    }

    checkAnswer(answer, correct) {
        if (answer === correct) {
            this.score += this.levels[this.currentLevel].points;
            this.updateScore();
            this.showFeedback(true, "Correct! Well done!");
        } else {
            this.lives--;
            this.updateLives();
            this.showFeedback(false, "Try again!");
            
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    }

    showFeedback(isCorrect, message) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.textContent = message;
        document.querySelector('.game-stage').appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 2000);
    }

    gameOver() {
        const gameStage = document.querySelector('.game-stage');
        gameStage.innerHTML = `
            <div class="game-over">
                <h2>Game Over</h2>
                <p>Final Score: ${this.score}</p>
                <button onclick="location.reload()">Play Again</button>
            </div>
        `;
    }

    setupTouchEvents(element) {
        let touchTimeout;
        
        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchTimeout = setTimeout(() => {
                element.draggable = true;
                const dragEvent = new Event('dragstart');
                element.dispatchEvent(dragEvent);
            }, 200);
        });

        element.addEventListener('touchend', () => {
            clearTimeout(touchTimeout);
            element.draggable = false;
        });

        element.addEventListener('touchmove', (e) => {
            if (element.draggable) {
                e.preventDefault();
                const touch = e.touches[0];
                const dropZones = document.querySelectorAll('.drop-zone');
                
                dropZones.forEach(zone => {
                    const rect = zone.getBoundingClientRect();
                    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                        const dropEvent = new Event('drop');
                        dropEvent.dataTransfer = new DataTransfer();
                        dropEvent.dataTransfer.setData('text/plain', element.textContent);
                        zone.dispatchEvent(dropEvent);
                    }
                });
            }
        });
    }

    loadNextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.loadLevel(this.currentLevel + 1);
        } else {
            this.showVictory();
        }
    }

    showVictory() {
        const gameStage = document.querySelector('.game-stage');
        gameStage.innerHTML = `
            <div class="victory">
                <h2>Congratulations!</h2>
                <p>You've completed all levels!</p>
                <p>Final Score: ${this.score}</p>
                <button onclick="location.reload()">Play Again</button>
            </div>
        `;
    }
}

// Create only one instance of the game
document.addEventListener('DOMContentLoaded', () => {
    new ChargerGame();
}); 