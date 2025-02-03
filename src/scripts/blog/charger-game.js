class ChargerGame {
    constructor() {
        this.currentLevel = 0;
        this.levels = [
            {
                id: 1,
                title: "Hardware Basics",
                description: "Learn the fundamental components of an AC charger",
                challenges: [
                    {
                        type: "drag-and-drop",
                        task: "Assemble the basic AC charger components",
                        elements: [
                            "Contactor",
                            "MCU",
                            "Current Sensors",
                            "PWM Generator",
                            "Power Supply"
                        ]
                    }
                ]
            },
            {
                id: 2,
                title: "IEC 61851-1 States",
                description: "Master the charging states",
                challenges: [
                    {
                        type: "state-machine",
                        task: "Guide the charging process through correct states",
                        states: [
                            "State A (Standby)",
                            "State B (Vehicle Connected)",
                            "State C (Charging)",
                            "State D (Special Charging)",
                            "Error State"
                        ]
                    }
                ]
            },
            {
                id: 3,
                title: "ISO 15118 Communication",
                description: "Explore the OSI layers of V2G communication",
                challenges: [
                    {
                        type: "layer-stack",
                        task: "Build the communication stack",
                        layers: [
                            "Application Layer (V2G Messages)",
                            "Transport Layer (TCP/IP)",
                            "Network Layer (IPv6)",
                            "Data Link (HomePlug GreenPHY)",
                            "Physical Layer (Control Pilot)"
                        ]
                    }
                ]
            }
        ];
        this.initializeGame();
    }

    initializeGame() {
        // Create level buttons
        const levelSelector = document.querySelector('.level-selector');
        this.levels.forEach((level, index) => {
            const button = document.createElement('button');
            button.textContent = level.title;
            button.addEventListener('click', () => this.selectLevel(index));
            levelSelector.appendChild(button);
        });

        // Initialize first level
        this.selectLevel(0);
    }

    selectLevel(index) {
        this.currentLevel = index;
        const level = this.levels[index];
        
        // Update buttons
        const buttons = document.querySelectorAll('.level-selector button');
        buttons.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        // Update task description
        const taskDiv = document.querySelector('.current-task');
        taskDiv.innerHTML = `
            <h3>${level.title}</h3>
            <p>${level.description}</p>
            <p class="task-instruction">${level.challenges[0].task}</p>
        `;

        // Initialize level content based on type
        this.initializeLevelContent(level.challenges[0]);
    }

    initializeLevelContent(challenge) {
        const gameStage = document.querySelector('.game-stage');
        gameStage.innerHTML = ''; // Clear previous content

        switch (challenge.type) {
            case 'drag-and-drop':
                this.setupDragAndDrop(challenge, gameStage);
                break;
            case 'state-machine':
                this.setupStateMachine(challenge, gameStage);
                break;
            case 'layer-stack':
                this.setupLayerStack(challenge, gameStage);
                break;
        }
    }

    setupDragAndDrop(challenge, container) {
        const elementsContainer = document.createElement('div');
        elementsContainer.className = 'elements-container';
        
        // Create schematic area
        const schematicArea = document.createElement('div');
        schematicArea.className = 'schematic-area';
        schematicArea.innerHTML = `
            <div class="schematic-grid">
                <div class="drop-zone" data-position="power">Power Input</div>
                <div class="drop-zone" data-position="control">Control Unit</div>
                <div class="drop-zone" data-position="measurement">Measurement</div>
                <div class="drop-zone" data-position="output">EV Output</div>
            </div>
        `;
        
        // Track correct placements
        this.correctPlacements = {
            'Power Supply': 'power',
            'MCU': 'control',
            'Current Sensors': 'measurement',
            'Contactor': 'output',
            'PWM Generator': 'control'
        };
        
        this.score = 0;
        this.updateScore();
        
        challenge.elements.forEach(element => {
            const div = document.createElement('div');
            div.className = 'draggable';
            div.draggable = true;
            div.textContent = element;
            
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element);
                div.classList.add('dragging');
            });
            
            // Add touch events
            this.setupTouchEvents(div);
            
            elementsContainer.appendChild(div);
        });

        // Update drop handling
        const dropZones = schematicArea.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const component = e.dataTransfer.getData('text/plain');
                const position = zone.dataset.position;
                
                if (this.correctPlacements[component] === position) {
                    this.score += 10;
                    zone.classList.add('correct');
                    this.updateComponentInfo(component, true);
                } else {
                    zone.classList.add('incorrect');
                    setTimeout(() => zone.classList.remove('incorrect'), 1000);
                    this.updateComponentInfo(component, false);
                }
                
                this.updateScore();
            });
            
            zone.addEventListener('dragover', e => e.preventDefault());
        });

        container.appendChild(elementsContainer);
        container.appendChild(schematicArea);
    }

    updateScore() {
        const infoPanel = document.querySelector('.info-panel');
        const scoreDiv = infoPanel.querySelector('.score') || document.createElement('div');
        scoreDiv.className = 'score';
        scoreDiv.textContent = `Score: ${this.score}`;
        infoPanel.prepend(scoreDiv);
    }

    updateComponentInfo(component, correct) {
        const infoPanel = document.querySelector('.component-info');
        const componentInfo = {
            'Contactor': {
                description: 'Controls the main power flow to the EV. Essential for safety.',
                position: 'Should be placed at the output to control power to the vehicle.'
            },
            'MCU': {
                description: 'Microcontroller Unit - The brain of the charging station.',
                position: 'Belongs in the control section to manage all operations.'
            },
            'Current Sensors': {
                description: 'Monitors charging current for safety and billing.',
                position: 'Belongs in the measurement section to monitor current.'
            },
            'PWM Generator': {
                description: 'Creates control pilot signal for EV communication.',
                position: 'Belongs in the control section to generate control signals.'
            },
            'Power Supply': {
                description: 'Provides stable power for control electronics.',
                position: 'Belongs in the power input section to provide power.'
            }
        };

        const info = componentInfo[component];
        infoPanel.innerHTML = `
            <h4>${component}</h4>
            <p>${info.description}</p>
            <p class="placement-hint ${correct ? 'correct' : 'incorrect'}">
                ${correct ? '✓ Correct placement!' : `Hint: ${info.position}`}
            </p>
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
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new ChargerGame();
}); 