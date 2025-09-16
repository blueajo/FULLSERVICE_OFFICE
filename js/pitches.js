const pitches = document.querySelectorAll(".checkboxContainer");
const formPitches = document.querySelectorAll(".pitchContainer");
let checkedCount = 0;
const contactForm = document.querySelector(".contactForm");

for (let i = 0; i < pitches.length; i++) {
    const pitch = pitches[i];
    const pitchContent = pitch.querySelector(".checkboxLabel").innerHTML;
    pitch.addEventListener('click', () => {
        console.log(i);
        if (pitch.classList.contains('checked')) {
            pitch.classList.remove('checked');
            formPitches[i].classList.remove('active');
            checkedCount--;
            if (checkedCount == 0 ) {
                contactForm.classList.remove('active');
            }
            console.log('-');
        } else {
            if (checkedCount < 5) {
                pitch.classList.add('checked');
                console.log('+');
                checkedCount++;
                formPitches[i].classList.add('active');
                if ( !contactForm.classList.contains('active') ) {
                    contactForm.classList.add('active');
                }
            }
        }
    });
}