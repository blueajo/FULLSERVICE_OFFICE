const pitches = document.querySelectorAll(".checkboxContainer");
const pitchesToSend = document.querySelector("#pitchesToSend");
let checkedCount = 0;
const contactForm = document.querySelector(".contactForm");

for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[i];
    const pitchContent = pitch.querySelector(".checkboxLabel").innerHTML;
    pitch.addEventListener('click', () => {
        console.log(i);
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
                pitch.classList.remove('plusDotArea');
                console.log('+');
                checkedCount++;
                pitchesToSend.innerHTML += 
                    '<div id=pitch' + i + ' class="checkboxContainer checked">' +
                        '<span class="checkmark"></span>' +
                        '<p class="checkboxLabel">' + pitchContent + '</p>' +
                    '</div>';
                if ( !contactForm.classList.contains('active') ) {
                    contactForm.classList.add('active');
                }

            }
        }
    });

    pitch.addEventListener('mouseenter', () => {
        if (pitch.classList.contains('checked')) {
            document.querySelector('#plusMinusDot img').src = "./img/cursors/minusDot.svg";
        } else if (!pitch.classList.contains('checked')) {
            document.querySelector('#plusMinusDot img').src = "./img/cursors/plusDot.svg";
        }
    });
}