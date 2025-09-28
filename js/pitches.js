const pitches = document.querySelectorAll(".checkbox-container");
const pitchesToSend = document.querySelector("#pitches-to-send");
let checkedCount = 0;
const contactForm = document.querySelector("#contact-form");

for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[i];
    const pitchContent = pitch.querySelector(".checkbox-label").innerHTML;
    pitch.addEventListener('click', () => {
        if (pitch.classList.contains('checked')) {
            pitch.classList.remove('checked');
            const pitchToRemove = document.querySelector("#pitch" + i);
            pitchToRemove.remove();
            checkedCount--;
            if (checkedCount == 0 ) {
                contactForm.classList.remove('active');
            }
            console.log('-');
        } else {
            if (checkedCount < 5) {
                pitch.classList.add('checked');
                checkedCount++;
                pitchesToSend.innerHTML += 
                    '<div id=pitch' + i + ' class="checkbox-container checked">' +
                        '<span class="checkmark"></span>' +
                        '<p class="checkbox-label">' + pitchContent + '</p>' +
                    '</div>';
                if ( !contactForm.classList.contains('active') ) {
                    contactForm.classList.add('active');
                }

            }
        }
    });
}