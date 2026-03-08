document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkBtn = document.getElementById('checkBtn9');
    const resultMessage = document.getElementById('resultMessage9');

    // Doğru cevap anahtarı
    const answerKey = {
        '1': 'c',
        '2': 'a',
        '3': 'b',
        '4': 'ç',
        '5': 'd'
    };

    let draggedItem = null;
    let isDropped = false;

    // Her öğenin yerini bulabilmesi için
    const originalParents = new Map();

    draggables.forEach(item => {
        // Orijinal containerı kaydet
        originalParents.set(item, item.parentElement);

        item.addEventListener('dragstart', function (e) {
            // Pasif seçeneğinin sürüklenmemesi gerekir (gerçi pointer-events:none olacak ama yine de koruma ekleyelim)
            if (this.parentElement.classList.contains('is-used-row')) {
                e.preventDefault();
                return;
            }

            draggedItem = this;
            isDropped = false; // Sürükleme başladığında sıfırla

            setTimeout(() => {
                this.classList.add('dragging');

                // Eğer orijinal yerinden sürükleniyorsa ROW'u silik yap
                if (originalParents.get(this) === this.parentElement) {
                    this.parentElement.classList.add('is-dragging-row');
                } else {
                    // Drop Zone'dan sürükleniyorsa
                    this.classList.add('opacity-low');
                }
            }, 0);
        });

        item.addEventListener('dragend', function (e) {
            this.classList.remove('dragging', 'opacity-low');

            // Eğer orijinal yerinden sürüklendiyse ve orada kaldıysa veya hata olduysa sürükleme iptal classını temizle
            if (originalParents.get(this) === this.parentElement) {
                this.parentElement.classList.remove('is-dragging-row');
            }

            // Eğer geçerli bir bırakma noktasına bırakılmadıysa orijinal yerine dön
            if (!isDropped) {
                snapBackToOriginal(this);
            }

            // Drop zone sınırlarını temizle
            dropZones.forEach(zone => zone.classList.remove('drag-over'));
            draggedItem = null;
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault(); // Sürüklenen öğenin buraya bırakılmasına izin ver
            if (zone.children.length === 0) { // Sadece boşsa yeşil etki göster
                zone.classList.add('drag-over');
            }
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            if (draggedItem) {
                isDropped = true; // Bırakıldı bayrağını işaretle

                // Eğer drop zone'da zaten bir öğe varsa, onu orijinal yerine gönder
                if (this.children.length > 0) {
                    const existingItem = this.children[0];
                    snapBackToOriginal(existingItem);
                }

                const origParent = originalParents.get(draggedItem);

                // Eğer orijinal listeden geliyorsa
                if (draggedItem.parentElement === origParent) {
                    origParent.classList.remove('is-dragging-row');
                    origParent.classList.add('is-used-row');

                    // Görsel kaymayı önlemek ve silik bir kutu bırakmak için
                    const placeholder = document.createElement('div');
                    placeholder.className = 'passive-clone';
                    placeholder.textContent = draggedItem.dataset.id;
                    origParent.insertBefore(placeholder, origParent.firstChild);
                }

                this.appendChild(draggedItem);
                draggedItem.classList.add('dropped');
            }
        });
    });

    // Öğeyi başa döndüren animasyonlu fonksiyon
    function snapBackToOriginal(item) {
        const origParent = originalParents.get(item);
        if (origParent) {
            const placeholder = origParent.querySelector('.passive-clone');
            if (placeholder) {
                placeholder.remove();
            }
            origParent.classList.remove('is-used-row', 'is-dragging-row');
            item.classList.remove('dropped');
            origParent.insertBefore(item, origParent.firstChild);
        }
    }

    checkBtn.addEventListener('click', () => {
        let allCorrect = true;
        let answeredCount = 0;

        dropZones.forEach(zone => {
            zone.classList.remove('correct', 'incorrect');

            if (zone.children.length > 0) {
                answeredCount++;
                const item = zone.children[0];
                const selectedLetter = item.dataset.id;
                const targetNumber = zone.dataset.target;
                const correctLetter = answerKey[targetNumber];

                if (selectedLetter === correctLetter) {
                    zone.classList.add('correct');
                } else {
                    zone.classList.add('incorrect');
                    allCorrect = false;
                }
            } else {
                allCorrect = false;
            }
        });

        if (answeredCount === 0) {
            resultMessage.textContent = "Lütfen önce eşleştirme yapınız.";
            resultMessage.className = "result-message show";
            resultMessage.style.backgroundColor = "#fff3cd";
            resultMessage.style.color = "#856404";
            resultMessage.style.border = "1px solid #ffeeba";
        } else if (allCorrect && answeredCount === 5) {
            resultMessage.textContent = "Tebrikler! Tüm eşleştirmeler doğru.";
            resultMessage.className = "result-message correct show";
            resultMessage.style.backgroundColor = "#d4edda";
            resultMessage.style.color = "#155724";
            resultMessage.style.border = "1px solid #c3e6cb";
        } else {
            resultMessage.textContent = "Bazı eşleştirmeler yanlış veya eksik. Lütfen kontrol edip tekrar deneyiniz.";
            resultMessage.className = "result-message incorrect show";
            resultMessage.style.backgroundColor = "#f8d7da";
            resultMessage.style.color = "#721c24";
            resultMessage.style.border = "1px solid #f5c6cb";
        }
    });

});
