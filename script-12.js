document.addEventListener('DOMContentLoaded', () => {

    // The Answer Key
    const answers = {
        1: [1, 5, 12],
        2: [2, 7, 9, 11],
        3: [2, 3, 4, 6, 7, 8, 9, 10, 11],
        4: [1, 3, 5, 6, 8, 12],
        5: [2, 4, 7, 9, 10, 11],
        6: [2, 6, 7, 8, 9, 10, 11],
        7: [6, 8, 10],
        8: [3, 6, 8],
        9: [6, 9],
        10: [2, 7, 9, 11]
    };

    const TOTAL_OPTIONS = 12; // Numbers 1 through 12

    // Initialize the Dropdowns
    const answerBoxes = document.querySelectorAll('.answer-box');
    const dropdowns = document.querySelectorAll('.multi-select-dropdown');

    // Store selections per question: { qId: [array of selected numbers] }
    const selections = {};

    answerBoxes.forEach((box, index) => {
        const questionId = box.id.split('-')[1];
        const dropdown = document.getElementById(`dropdown-${questionId}`);
        selections[questionId] = [];

        // Build the checkboxes for 1 to 12
        for (let i = 1; i <= TOTAL_OPTIONS; i++) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'dropdown-option';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `q${questionId}-opt${i}`;
            checkbox.value = i;

            const label = document.createElement('label');
            label.htmlFor = `q${questionId}-opt${i}`;
            label.textContent = i;

            optionDiv.appendChild(checkbox);
            optionDiv.appendChild(label);
            dropdown.appendChild(optionDiv);

            // Toggle logic when clicking the wrapper or checkbox
            const toggleCheckbox = (e) => {
                // Prevent duplicate events if checkbox is clicked directly
                if (e.target === label) return;
                if (e.target === optionDiv) {
                    checkbox.checked = !checkbox.checked;
                }

                // Update State and UI
                if (checkbox.checked) {
                    if (!selections[questionId].includes(i)) selections[questionId].push(i);
                } else {
                    selections[questionId] = selections[questionId].filter(num => num !== i);
                }

                // Keep selections sorted numerically for nice display
                selections[questionId].sort((a, b) => a - b);
                renderBadges(questionId);
            };

            optionDiv.addEventListener('click', toggleCheckbox);
        }

        // Toggle dropdown open/close on box click
        box.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent document click from firing immediately
            const isOpen = dropdown.classList.contains('open');

            // Close all others first
            closeAllDropdowns();

            if (!isOpen) {
                dropdown.classList.add('open');
                box.classList.add('active');
            }
        });
    });

    // Render the selected squares inside the actual box
    function renderBadges(questionId) {
        const box = document.getElementById(`box-${questionId}`);
        box.innerHTML = ''; // Clear current

        selections[questionId].forEach(num => {
            const badge = document.createElement('div');
            badge.className = 'selection-badge';
            badge.textContent = num;
            // attach an attribute so we can find it easily during verification
            badge.setAttribute('data-val', num);
            box.appendChild(badge);
        });
    }

    // Close dropdowns if clicked outside
    function closeAllDropdowns() {
        dropdowns.forEach(dd => dd.classList.remove('open'));
        answerBoxes.forEach(box => box.classList.remove('active'));
    }

    document.addEventListener('click', (e) => {
        // Did we click inside a dropdown or box? If not, close.
        if (!e.target.closest('.answer-cell')) {
            closeAllDropdowns();
        }
    });

    // Check Answers Validation Logic
    const checkBtn = document.getElementById('checkAnswersBtn12');
    const resultMessage = document.getElementById('resultMessage12');

    checkBtn.addEventListener('click', () => {
        closeAllDropdowns();

        let allQuestionsCorrect = true;
        let anyEmpty = false;

        Object.keys(answers).forEach(qId => {
            const userSelection = selections[qId];
            const correctSelection = answers[qId];
            const box = document.getElementById(`box-${qId}`);

            if (userSelection.length === 0) {
                anyEmpty = true;
                allQuestionsCorrect = false;
            }

            // We need to evaluate every badge specifically
            const badges = Array.from(box.querySelectorAll('.selection-badge'));

            // Track if user missed any correct answers to flag the whole question
            let missingCorrectAnswers = false;
            correctSelection.forEach(ans => {
                if (!userSelection.includes(ans)) {
                    missingCorrectAnswers = true;
                    allQuestionsCorrect = false;
                }
            });

            badges.forEach(badge => {
                const val = parseInt(badge.getAttribute('data-val'), 10);
                // Clear existing validation classes
                badge.classList.remove('correct', 'incorrect');

                if (correctSelection.includes(val)) {
                    badge.classList.add('correct');
                } else {
                    badge.classList.add('incorrect');
                    allQuestionsCorrect = false;
                }
            });
        });

        resultMessage.style.display = 'block';

        if (allQuestionsCorrect && !anyEmpty) {
            resultMessage.textContent = 'Harika! Tüm sorulara doğru molekülleri atadınız.';
            resultMessage.className = 'result-message success';
        } else if (anyEmpty) {
            resultMessage.textContent = 'Tüm soruları yanıtlamadınız veya bazı doğru cevapları eksik bıraktınız. Lütfen kontrol edin.';
            resultMessage.className = 'result-message error';
        } else {
            resultMessage.textContent = 'Bazı seçimleriniz hatalı (kırmızı) veya eksik. Lütfen doğru olduğundan (yeşil) emin olun.';
            resultMessage.className = 'result-message error';
        }
    });

});
