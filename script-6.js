document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('.discipline-select');
    const inputs = document.querySelectorAll('.blank-input');
    const checkBtn = document.getElementById('checkBtn6');
    const resultMessage = document.getElementById('resultMessage6');

    // Doğru cevap anahtarı
    const answerKey = {
        'a': 'Fizikokimya',
        'b': 'Analitik Kimya',
        'c': 'Organik Kimya',
        'ç': 'Anorganik Kimya',
        'd': 'Biyokimya',
        'e': 'Polimer Kimyası'
    };

    // Önceki dropdown değerlerini tutan harita (eski seçimi silebilmek için)
    // selectElement -> "eskiLetter"
    const previousSelectValues = new Map();

    selects.forEach(select => {
        previousSelectValues.set(select, ""); // Başlangıçta boş

        select.addEventListener('change', function () {
            const disciplineName = this.dataset.discipline;
            const newLetter = this.value; // Örn: 'a', 'b', '', vb.
            const oldLetter = previousSelectValues.get(this);

            // 1. Eğer eski bir harf seçiliyse, o harfe ait inputtaki text bu disiplinse temizle
            if (oldLetter) {
                const oldInput = document.querySelector(`.blank-input[data-letter="${oldLetter}"]`);
                if (oldInput && oldInput.value === disciplineName) {
                    oldInput.value = "";
                    // Input temizlendiği için CSS classlarını da sıfırla
                    oldInput.classList.remove('correct', 'incorrect');
                }
            }

            // 2. Yeni bir harf seçildiyse (-seçiniz- değilse)
            if (newLetter) {
                // Eğer baska bir dropdown ayni harfi secmisse, o dropdownu temizle
                selects.forEach(otherSelect => {
                    if (otherSelect !== this && otherSelect.value === newLetter) {
                        otherSelect.value = "";
                        previousSelectValues.set(otherSelect, "");
                    }
                });

                // Yeni input'a disiplin adını yaz
                const newInput = document.querySelector(`.blank-input[data-letter="${newLetter}"]`);
                if (newInput) {
                    newInput.value = disciplineName;
                    newInput.classList.remove('correct', 'incorrect');
                }
            }

            // Eski değeri güncelle
            previousSelectValues.set(this, newLetter);
        });
    });

    // Kullanıcı elle yazarsa dropdown mantığıyla çatışmaması için
    // Kullanıcı bir harfin inputuna kendi değer girerse, orayı hedefleyen dropdownları sıfırla
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            const targetLetter = this.dataset.letter;
            this.classList.remove('correct', 'incorrect');

            selects.forEach(select => {
                if (select.value === targetLetter) {
                    select.value = "";
                    previousSelectValues.set(select, "");
                }
            });
        });
    });

    // Kontrol Et Butonu İşlemleri
    checkBtn.addEventListener('click', () => {
        let allCorrect = true;
        let answeredCount = 0;

        inputs.forEach(input => {
            input.classList.remove('correct', 'incorrect');
            const letter = input.dataset.letter;
            const userAnswer = input.value.trim();
            const correctAnswer = answerKey[letter];

            if (userAnswer.length > 0) {
                answeredCount++;

                // Case-insensitive (Büyük/küçük harf duyarsız) kontrol
                if (userAnswer.toLocaleLowerCase('tr-TR') === correctAnswer.toLocaleLowerCase('tr-TR')) {
                    input.classList.add('correct');
                } else {
                    input.classList.add('incorrect');
                    allCorrect = false;
                }
            } else {
                allCorrect = false;
            }
        });

        if (answeredCount === 0) {
            resultMessage.textContent = "Lütfen önce boşlukları doldurunuz.";
            resultMessage.className = "result-message show";
            resultMessage.style.backgroundColor = "#fff3cd";
            resultMessage.style.color = "#856404";
            resultMessage.style.border = "1px solid #ffeeba";
        } else if (allCorrect && answeredCount === 6) {
            resultMessage.textContent = "Tebrikler! Tümce eşleştirmeleri doğru.";
            resultMessage.className = "result-message correct show";
            resultMessage.style.backgroundColor = "#d4edda";
            resultMessage.style.color = "#155724";
            resultMessage.style.border = "1px solid #c3e6cb";
        } else {
            resultMessage.textContent = "Bazı cevaplar yanlış veya eksik. Lütfen kontrol edip tekrar deneyiniz.";
            resultMessage.className = "result-message incorrect show";
            resultMessage.style.backgroundColor = "#f8d7da";
            resultMessage.style.color = "#721c24";
            resultMessage.style.border = "1px solid #f5c6cb";
        }
    });

});
