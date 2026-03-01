document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('quizTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const checkBtn = document.getElementById('checkBtn');
    const resultMessage = document.getElementById('resultMessage');

    // Handle Checkbox Selection
    rows.forEach(row => {
        const checkboxes = row.querySelectorAll('.checkbox');
        
        checkboxes.forEach(cb => {
            cb.addEventListener('click', () => {
                // Remove check from both first
                checkboxes.forEach(box => {
                    box.classList.remove('checked', 'dogru', 'yanlis');
                    box.innerHTML = '';
                });

                // Add check to the clicked one
                const type = cb.getAttribute('data-type');
                cb.classList.add('checked', type);
                
                if (type === 'dogru') {
                    cb.innerHTML = '✓';
                } else if (type === 'yanlis') {
                    cb.innerHTML = 'X';
                }

                // Remove feedback classes if user toggles after a check
                row.classList.remove('row-success', 'row-error');
                resultMessage.style.display = 'none';
            });
        });
    });

    // Check Answers
    if(checkBtn) {
        checkBtn.addEventListener('click', () => {
            let allCorrect = true;
            let answeredCount = 0;

            rows.forEach(row => {
                const correctAnswer = row.getAttribute('data-answer');
                const selectedCheckbox = row.querySelector('.checkbox.checked');

                // Clear previous feedback
                row.classList.remove('row-success', 'row-error');

                if (selectedCheckbox) {
                    answeredCount++;
                    const selectedType = selectedCheckbox.getAttribute('data-type');

                    if (selectedType === correctAnswer) {
                        row.classList.add('row-success');
                    } else {
                        row.classList.add('row-error');
                        allCorrect = false;
                        
                        // Small delay to restart animation if needed
                        setTimeout(() => {
                            row.classList.remove('row-error');
                            void row.offsetWidth; // trigger reflow
                            row.classList.add('row-error');
                        }, 10);
                    }
                } else {
                    allCorrect = false;
                }
            });

            if (answeredCount < rows.length) {
                resultMessage.textContent = 'Lütfen tüm soruları işaretleyiniz!';
                resultMessage.className = 'result-message error';
                resultMessage.style.display = 'block';
            } else if (allCorrect) {
                resultMessage.textContent = 'Tebrikler! Tüm cevaplarınız doğru.';
                resultMessage.className = 'result-message success';
                resultMessage.style.display = 'block';
            } else {
                resultMessage.textContent = 'Bazı cevaplarınız hatalı. Lütfen kırmızı ile işaretlenenleri kontrol edin.';
                resultMessage.className = 'result-message error';
                resultMessage.style.display = 'block';
            }
        });
    }
});
