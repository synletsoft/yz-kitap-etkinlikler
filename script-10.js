document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('checkBtn10');
    const resultMessage = document.getElementById('resultMessage10');

    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            const selects = document.querySelectorAll('select[data-correct]');
            let allCorrect = true;
            let answeredCount = 0;

            selects.forEach(select => {
                const correctAnswer = select.getAttribute('data-correct');
                const selectedValue = select.value;

                // Clear styling initially
                select.classList.remove('correct-input', 'incorrect-input');

                if (selectedValue !== "") {
                    answeredCount++;
                    if (selectedValue === correctAnswer) {
                        select.classList.add('correct-input');
                    } else {
                        select.classList.add('incorrect-input');
                        allCorrect = false;

                        // Small delay to restart animation
                        setTimeout(() => {
                            select.classList.remove('incorrect-input');
                            void select.offsetWidth;
                            select.classList.add('incorrect-input');
                        }, 10);
                    }
                } else {
                    allCorrect = false;
                }
            });

            if (answeredCount < selects.length) {
                resultMessage.textContent = 'Lütfen tüm boşlukları ve seçimleri doldurunuz!';
                resultMessage.className = 'result-message error';
                resultMessage.style.display = 'block';
            } else if (allCorrect) {
                resultMessage.textContent = 'Tebrikler! Tüm cevaplarınız doğru.';
                resultMessage.className = 'result-message success';
                resultMessage.style.display = 'block';
            } else {
                resultMessage.textContent = 'Bazı cevaplarınız hatalı. Lütfen kırmızı ile işaretlenenleri düzeltin.';
                resultMessage.className = 'result-message error';
                resultMessage.style.display = 'block';
            }
        });
    }

    // Reset styles on change so user knows it registers their change
    const allSelects = document.querySelectorAll('select');
    allSelects.forEach(select => {
        select.addEventListener('change', () => {
            select.classList.remove('correct-input', 'incorrect-input');
        });
    });
});
