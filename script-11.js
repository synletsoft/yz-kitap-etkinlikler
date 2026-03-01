document.addEventListener('DOMContentLoaded', () => {

    const selects = document.querySelectorAll('.answer-select');
    const checkBtn = document.getElementById('checkAnswersBtn11');
    const resultMessage = document.getElementById('resultMessage11');

    // Mappings and randomized options
    const rawOptions = [
        { id: "cam-balon", text: "cam balon" },
        { id: "huni", text: "huni" },
        { id: "spor", text: "spor" },
        { id: "ispirto-ocagi", text: "ispirto ocağı" },
        { id: "deney-tupu", text: "deney tüpü" },
        { id: "damlalik", text: "damlalık" },
        { id: "erlenmayer", text: "erlenmayer" },
        { id: "kiskac", text: "kıskaç" },
        { id: "bunzen-beki", text: "bünzen beki" },
        { id: "beherglas", text: "beherglas" },
        { id: "termometre", text: "termometre" },
        { id: "uc-ayak", text: "üç ayak" },
        { id: "amyant-tel", text: "amyant tel" }
    ];

    // Shuffle options to ensure they don't appear in alphabetical or mapped order
    const options = [...rawOptions];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    // Populate all drops
    selects.forEach(select => {
        options.forEach(opt => {
            const optionElement = document.createElement('option');
            optionElement.value = opt.id;
            optionElement.textContent = opt.text;
            select.appendChild(optionElement);
        });

        // Reset styling on change
        select.addEventListener('change', function () {
            this.classList.remove('correct', 'incorrect');
        });
    });

    // Check Answers Logic
    checkBtn.addEventListener('click', () => {
        let allValid = true;
        let anyEmpty = false;

        selects.forEach(select => {
            // Remove previous classes
            select.classList.remove('correct', 'incorrect');
            // Trigger reflow to restart animations
            void select.offsetWidth;

            const selectedValue = select.value;
            const correctValue = select.getAttribute('data-correct');

            if (!selectedValue) {
                anyEmpty = true;
                allValid = false;
                select.classList.add('incorrect');
            } else if (selectedValue === correctValue) {
                select.classList.add('correct');
            } else {
                select.classList.add('incorrect');
                allValid = false;
            }
        });

        resultMessage.style.display = 'block';

        if (allValid) {
            resultMessage.textContent = 'Mükemmel! Bütün laboratuvar malzemelerini doğru tanımladınız.';
            resultMessage.className = 'result-message success';
        } else if (anyEmpty) {
            resultMessage.textContent = 'Lütfen tüm boşlukları doldurun.';
            resultMessage.className = 'result-message error';
        } else {
            resultMessage.textContent = 'Bazı eşleştirmeler hatalı. Lütfen kırmızı ile işaretlenen cevaplarınızı kontrol edin.';
            resultMessage.className = 'result-message error';
        }
    });
});
