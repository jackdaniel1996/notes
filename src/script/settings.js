//Settings/Overlay

//set saved color theme
function setColorTheme(bgColor, colorTheme, resetColorBtn) {
    let savedBgColor = localStorage.getItem('colorBg');

    if(savedBgColor != null){
        bgColor = savedBgColor;
        $('.notes-body').css('background-color', bgColor);
        $('.nav-logo, #settings').css('color', bgColor);
        $(colorTheme).attr('value', bgColor);
        resetColorBtn.removeAttribute('hidden');
    }
}

function setNotesColor(resetColorBtn) {    
    let savedNotesColor = localStorage.getItem('notesColor');

    if(savedNotesColor != null){
        $('#noteColor').attr('value', savedNotesColor);
        $('.notes-column').css('outline-color', savedNotesColor);
        $('.notes-column-head, .notes-add-entry, .add-column').css('background-color', savedNotesColor);
        resetColorBtn.removeAttribute('hidden');
    }
}

function setHeadlineColor(resetColorBtn) {    
    let savedHeadlineColor = localStorage.getItem('headlineColor');

    if(savedHeadlineColor != null){
        $('#fontColor').attr('value', savedHeadlineColor);
        $('.notes-column-head, .notes-add-entry, .notes-add-column').css('color', savedHeadlineColor);
        resetColorBtn.removeAttribute('hidden');
    }
}

function setFontColor(resetColorBtn) {    
    let savedFontColor = localStorage.getItem('fontColor');

    if(savedFontColor != null){
        $('#fontColor').attr('value', savedFontColor);
        $('.notes-entry').css({'color': savedFontColor, 'border-top-color': savedFontColor});
        resetColorBtn.removeAttribute('hidden');
    }
}

$(document).ready(function(){   

    let overlay = $("#overlay");
    let colorTheme = document.getElementById("colorTheme");
    let notes = document.getElementById("noteColor");
    let headline = document.getElementById("headlineColor");
    let font = document.getElementById("fontColor");
    let colorBg = '#1B9CFC';
    let defaultColor = '#1B9CFC';
    let resetColorBtn = document.getElementById("resetColorTheme");
    let resetFontBtn = document.getElementById("resetFontTheme");

    //set saved color theme
    setNotesColor(resetColorBtn);
    setColorTheme(colorBg, colorTheme, resetColorBtn);
    setHeadlineColor(resetFontBtn);
    setFontColor(resetFontBtn);    

    //open/close overlay
    document.getElementById('settings').addEventListener('click', () => {
        overlay.toggleClass('open');
    });
    document.getElementById('close').addEventListener('click', () => {
        overlay.toggleClass('open');
    });   

    colorTheme.addEventListener('change', () => {
        colorBg = event.target.value; //takes input color
        $(colorTheme).attr('value', colorBg);
        $('.notes-body').css('background-color', colorBg);
        $('.nav-logo, #settings').css('color', colorBg);

        localStorage.setItem('colorBg', colorBg);
        $('#resetColorTheme').fadeIn(300, function(){
            resetColorBtn.setAttribute('hidden', 'true');
        });
    });

    notes.addEventListener('change', () => {
        let notesColor = event.target.value; //takes input color
        $(notes).attr('value', notesColor);
        $('.notes-column').css('outline-color', notesColor);
        $('.notes-column-head, .notes-add-entry, .add-column').css('background-color', notesColor);

        localStorage.setItem('notesColor', notesColor);
        $('#resetColorTheme').fadeIn(300, function(){
            resetColorBtn.setAttribute('hidden', 'true');
        });
    });

    headline.addEventListener('change', () => {
        let headlineColor = event.target.value; //takes input color
        $(headline).attr('value', headlineColor);
        $('.notes-column-head, .notes-add-entry, .notes-add-column').css('color', headlineColor);

        localStorage.setItem('headlineColor', headlineColor);
        $('#resetFontTheme').fadeIn(300, function(){
            resetFontBtn.setAttribute('hidden', 'false');
        });
    });

    font.addEventListener('change', () => {
        let fontColor = event.target.value; //takes input color
        $(font).attr('value', fontColor);
        $('.notes-entry').css({'color': fontColor, 'border-top-color': fontColor});

        localStorage.setItem('fontColor', fontColor);
        $('#resetFontTheme').fadeIn(300, function(){
            resetFontBtn.setAttribute('hidden', 'false');
        });
    });    

    //reset Btn
    $('#resetColorTheme').on('click', () => {
        //bg
        localStorage.removeItem('colorBg');
        $('.notes-body').css('background-color', defaultColor);
        $('.nav-logo, #settings').css('color', defaultColor);
        $(colorTheme).attr('value', defaultColor);
        //notes
        localStorage.removeItem('notesColor')
        $(notes).attr('value', '#FFFFFF');
        $('.notes-column').css('outline-color', '#FFFFFF');
        $('.notes-column-head, .notes-add-entry, .add-column').css('background-color', '#FFFFFF');

        $('#resetColorTheme').fadeOut(200, function(){
            resetColorBtn.setAttribute('hidden', 'true');
        });
    });

    $('#resetFontTheme').on('click', () => {
        //headline
        localStorage.removeItem('headlineColor');
        $('.notes-column-head, .notes-add-entry, .notes-add-column').css('color', '#747474');

        //font
        localStorage.removeItem('fontColor');
        $('.notes-entry').css({'color': '#fff', 'border-top-color': '#fff'});

        $('#resetFontTheme').fadeOut(200, function(){
            resetFontBtn.setAttribute('hidden', 'true');
        });
    });

    setTimeout(function(){ // add animation to elements that change color, after page load so that the fade isnt visiible immidiately when loading the page
        $('.notes-body, .nav-logo, #settings, .notes-column-head, .notes-add-entry, .add-column, .notes-column').addClass('animation');        
    }, 0); 
});