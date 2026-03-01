document.addEventListener('DOMContentLoaded', () => {
    // 1. Define Node Positions (x, y) relative to the container for perfect symmetry
    // Dimensions: Tree Node = 220x70. Exit = 100x40.
    const nodeWidth = 220;
    const nodeHeight = 70;
    const exitWidth = 100;
    const exitHeight = 40;

    const nodeData = {
        'node-1': { x: 50, y: 345 },
        'node-2': { x: 320, y: 185 },
        'node-3': { x: 320, y: 505 },
        'node-4': { x: 590, y: 105 },
        'node-5': { x: 590, y: 265 },
        'node-6': { x: 590, y: 425 },
        'node-7': { x: 590, y: 585 },
        'exit-1': { x: 860, y: 65 },
        'exit-2': { x: 860, y: 145 },
        'exit-3': { x: 860, y: 225 },
        'exit-4': { x: 860, y: 305 },
        'exit-5': { x: 860, y: 385 },
        'exit-6': { x: 860, y: 465 },
        'exit-7': { x: 860, y: 545 },
        'exit-8': { x: 860, y: 625 },
    };

    // Only these choices lead to the next valid step toward exit 2
    const correctPathChoices = {
        'node-1': 'D',
        'node-2': 'D',
        'node-4': 'Y'
    };

    let currentState = {
        selections: {},         // e.g. 'node-1': { choice: 'D', target: 'node-2', isCorrect: true }
        currentExit: null
    };

    const svgLines = document.getElementById('treeSvg');
    const buttonsContainer = document.getElementById('treeButtonsContainer');
    const checkBtn = document.getElementById('checkAnswersBtn14');
    const resultMsg = document.getElementById('resultMessage14');

    // 2. Initialization & Draw Base Lines
    function init() {
        // Position all nodes
        for (const [id, pos] of Object.entries(nodeData)) {
            const el = document.getElementById(id);
            if (el) {
                el.style.left = pos.x + 'px';
                el.style.top = pos.y + 'px';
            }
        }

        // Hide check answers button since feedback is immediate
        if (checkBtn) checkBtn.style.display = 'none';

        // Draw initial state
        drawAllConnectionsAndButtons();
    }

    function drawAllConnectionsAndButtons() {
        svgLines.innerHTML = '';
        buttonsContainer.innerHTML = '';

        const nodes = document.querySelectorAll('.tree-node');
        nodes.forEach(node => {
            const srcId = node.id;
            const targetD = node.getAttribute('data-target-d');
            const targetY = node.getAttribute('data-target-y');

            // Find selected state if any
            const sel = currentState.selections[srcId];

            // Draw line and button for D
            createLineAndButton(srcId, targetD, 'D', sel && sel.choice === 'D' ? sel : null);

            // Draw line and button for Y
            createLineAndButton(srcId, targetY, 'Y', sel && sel.choice === 'Y' ? sel : null);
        });
    }

    function createLineAndButton(srcId, tgtId, choice, selData) {
        const src = nodeData[srcId];
        const tgt = nodeData[tgtId];
        const isTgtExit = tgtId.startsWith('exit');

        const startX = src.x + nodeWidth;
        const startY = src.y + (nodeHeight / 2);

        const endX = tgt.x;
        const endY = tgt.y + (isTgtExit ? (exitHeight / 2) : (nodeHeight / 2));

        // The line goes right 35px, then up/down, then right into the target
        const midX = startX + 35;

        const isSelected = !!selData;
        const isCorrect = selData ? selData.isCorrect : false;

        // Determine line color
        let strokeColor = '#ecf0f1'; // Default faint line
        if (isSelected) {
            strokeColor = isCorrect ? '#00b050' : '#ff0000';
        }

        // Draw SVG Path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', isSelected ? '3' : '2');
        path.classList.add(`path-${srcId}`);
        svgLines.appendChild(path);

        // Place Button exactly halfway on the vertical segment
        const btnYPos = startY + (endY - startY) / 2;

        const btn = document.createElement('button');
        btn.className = `branch-btn btn-${choice.toLowerCase()}`;

        // Is source node active?
        const isSrcActive = document.getElementById(srcId).classList.contains('active');
        if (isSrcActive) {
            btn.classList.add('active-btn');
        }

        if (isSelected) {
            btn.classList.add(isCorrect ? 'selected-correct' : 'selected-incorrect');
        }

        btn.textContent = choice;
        // Position centered on the vertical line (midX). Button is 36x36, so offset is 18
        btn.style.left = (midX - 18) + 'px';
        btn.style.top = (btnYPos - 18) + 'px';

        btn.addEventListener('click', () => {
            if (!document.getElementById(srcId).classList.contains('active')) return;
            handleChoice(srcId, tgtId, choice);
        });

        buttonsContainer.appendChild(btn);
    }

    function handleChoice(srcId, tgtId, choice) {
        // Clear anything downstream
        clearPathFrom(srcId);

        // Validate choice
        const isCorrect = correctPathChoices[srcId] === choice;

        currentState.selections[srcId] = { choice, target: tgtId, isCorrect };

        // Handle target activation ONLY if correct
        if (isCorrect) {
            const tgtEl = document.getElementById(tgtId);
            if (tgtEl) {
                tgtEl.classList.add('active');
                if (tgtId.startsWith('exit')) {
                    currentState.currentExit = tgtId;
                    checkCompletion();
                } else {
                    currentState.currentExit = null;
                }
            }
        }

        drawAllConnectionsAndButtons();

        // Optional UX: If they click wrong, show a quick message
        if (!isCorrect) {
            resultMsg.textContent = "Yanlış seçim! Bu yoldan ilerleyemezsiniz.";
            resultMsg.className = "result-message incorrect";
            resultMsg.style.display = 'block';
            setTimeout(() => { if (resultMsg.textContent.includes('Yanlış')) resultMsg.style.display = 'none'; }, 2000);
        } else {
            resultMsg.style.display = 'none';
        }
    }

    function clearPathFrom(startId) {
        if (!currentState.selections[startId]) return;

        let tgtId = currentState.selections[startId].target;

        // Deactivate target
        const tgtEl = document.getElementById(tgtId);
        if (tgtEl) {
            tgtEl.classList.remove('active');
            if (tgtId.startsWith('exit')) {
                currentState.currentExit = null;
            }
        }

        if (!tgtId.startsWith('exit')) {
            clearPathFrom(tgtId);
            // also ensure target's children selections are removed
            if (currentState.selections[tgtId]) {
                delete currentState.selections[tgtId];
            }
        }

        delete currentState.selections[startId];
    }

    function checkCompletion() {
        if (currentState.currentExit === 'exit-2') {
            document.getElementById('exit-2').classList.add('exit-correct');
            resultMsg.innerHTML = "🎉 <strong>Tebrikler!</strong> Doğru çıkışa ulaştınız. (2. ÇIKIŞ) 🎉";
            resultMsg.className = "result-message correct";
            resultMsg.style.display = 'block';
        }
    }

    init();
});
