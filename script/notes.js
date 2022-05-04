//save 2s after Input
let input = $('.notes-column-head, .notes-entry-head, .notes-entry-text');
let timer;
var saving = () => input.on('input', function (e) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        saveData()
    }, 1000);
});

// src for this function https://javascript.plainenglish.io/how-to-build-complex-dom-elements-quickly-b3ead8e09647
// creating DOM elements
// Attributes (attrs) must be written in camelCase
let dom_utils = {};
(function(context) {
   
    /**
     * @param {Object} o - object literal with element properties
     */
    context.createEl = function(o) {
      let type = o.type || 'div';
      let el = document.createElement(type);
        for (const key of (Object.keys(o))) {
          if (key != 'attrs' && key != 'type') {
            el[key] = o[key];
          }
        }
        if (o.attrs) {
             for (let key of (Object.keys(o.attrs))) {
                let value = o.attrs[key];
                if (key != key.toLowerCase()) {
                   key = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                }
                el.setAttribute(key, value);
            }
        }
       
        return el;
    };
})(dom_utils);

// add-Column button
function addColButton(){
    let notesBody = document.getElementById('notesBody');

    let addCol =  dom_utils.createEl({
        type: 'div',
        id: 'column-0',
        className: 'notes-column add-column',
        innerHTML:'',
        attrs:{
            onclick: 'addCol()'
        }        
    });
    notesBody.appendChild(addCol);

    let addColContent = dom_utils.createEl({
        type: 'div',
        className: 'notes-add-column',
        innerHTML: 'Add Column +',
        attrs:''
    });

    addCol.appendChild(addColContent);
}

$(document).ready(function(){
    addColButton();
});

// add Column
function addCol(){
    let notesBody = document.getElementById('notesBody');
    let columnCount = 'column-' + $('.notes-column').length;

    //col body
    let addColBody =  dom_utils.createEl({
        type: 'div',
        id: columnCount,
        className: 'notes-column',
        innerHTML:'',
        attrs:''        
    });    

    //col content
    let addColHeadline = dom_utils.createEl({
        type: 'div',
        className: 'notes-column-head',
        innerHTML: 'Headline',
        attrs:{
            contenteditable:'',
        }
    });
    let addColEntryBtn = dom_utils.createEl({
        type: 'div',
        className: 'notes-add-entry',
        innerHTML: 'Add Entry +',
        attrs:{
            onclick: 'addColEntry(this)'
        }
    });

    notesBody.insertBefore(addColBody, notesBody.lastElementChild);
    addColBody.appendChild(addColHeadline);
    addColBody.appendChild(addColEntryBtn);
    
    //add first entry
    addColEntry(addColEntryBtn);

    //save
    saveData();
}

//add Entry
function addColEntry(elem){
    let colBodyParent = document.getElementById(elem.parentNode.id);
    let entryCount = 'entry-' + (($('#' + elem.parentNode.id + ' .notes-entry').length) + 1);

    //entry body
    let addNotesEntry =  dom_utils.createEl({
        type: 'div',
        id: entryCount,
        className: 'notes-entry',
        innerHTML:'',
        attrs:''
    });
    //entry content
    let addNotesEntryHeadline =  dom_utils.createEl({
        type: 'div',
        id: '',
        className: 'notes-entry-head',
        innerHTML:'Entry Headline',
        attrs:{
            contenteditable:''
        }
    });

    let addNotesEntryText =  dom_utils.createEl({
        type: 'div',
        id: '',
        className: 'notes-entry-text',
        innerHTML:'Entry text',
        attrs:{
            contenteditable:''
        }
    });
    colBodyParent.insertBefore(addNotesEntry, colBodyParent.lastElementChild);
    addNotesEntry.appendChild(addNotesEntryHeadline);
    addNotesEntry.appendChild(addNotesEntryText);

    input = $('.notes-column-head, .notes-entry-head, .notes-entry-text');
    saving();
}

// saving data
var dbContent = {}; // object to store notes content

function saveData(){
    dbContent.columnCount = $('.notes-column').length - 1;

    // get col and headline
    var i = 0; //column count    
    do {
        i += 1;
        let col = 'column-' + i;
        let entryCount = document.getElementById(col).querySelectorAll('.notes-entry').length;        

        dbContent[col] = {};        
        dbContent[col]["headline"] = $('#' + col + ' .notes-column-head').text(); //column headline 

        //get entrys of col and its content
        var e = 0 //entry count
        do {
            e += 1;
            let entry = 'entry-' + e;
            dbContent[col][entry] = {};
            dbContent[col][entry]["headline"] =  $('#' + col + ' #' + entry + ' .notes-entry-head').text(); // entry headline
            dbContent[col][entry]["text"] =  $('#' + col + ' #' + entry + ' .notes-entry-text').text(); // entry content

        }while (e < entryCount)

    } while (i < dbContent.columnCount);

    console.log('Saved!');

    localStorage.setItem('savedData', JSON.stringify(dbContent));
}

//displaying saved data
$(document).ready(function(){
    (function displayData (){
        let savedData = JSON.parse(localStorage.getItem('savedData'));
        let notesBody = document.getElementById('notesBody');

        var c = 0;
        //column
        do{
            c += 1;
            let colId = Object.getOwnPropertyNames(savedData);

            //col body
            let addColBody =  dom_utils.createEl({
                type: 'div',
                id: colId[c],
                className: 'notes-column',
                innerHTML:'',
                attrs:''        
            });         

            //col headline
            let addColHeadline = dom_utils.createEl({
                type: 'div',
                className: 'notes-column-head',
                innerHTML: savedData[colId[c]].headline,
                attrs:{
                    contenteditable:'',
                }
            });

            //add entry button
            let addColEntryBtn = dom_utils.createEl({
                type: 'div',
                className: 'notes-add-entry',
                innerHTML: 'Add Entry +',
                attrs:{
                    onclick: 'addColEntry(this)'
                }
            });

            notesBody.insertBefore(addColBody, notesBody.lastElementChild);

            let col = document.getElementById('column-'+c);
            col.appendChild(addColHeadline);
            col.appendChild(addColEntryBtn);

            //entrys
            let entryCount = Object.getOwnPropertyNames(savedData[colId[c]])
            var e = 0;
            do{
                e += 1;
                let entryId = Object.getOwnPropertyNames(savedData[colId[c]]);
                //entry body
                let addNotesEntry =  dom_utils.createEl({
                    type: 'div',
                    id: entryId[e],
                    className: 'notes-entry',
                    innerHTML:'',
                    attrs:''
                });
                
                col.insertBefore(addNotesEntry, col.lastElementChild);

                //entry content
                let addNotesEntryHeadline =  dom_utils.createEl({
                    type: 'div',
                    id: '',
                    className: 'notes-entry-head',
                    innerHTML: savedData['column-'+c]['entry-'+e].headline,
                    attrs:{
                        contenteditable:''
                    }
                });

                let addNotesEntryText =  dom_utils.createEl({
                    type: 'div',
                    id: '',
                    className: 'notes-entry-text',
                    innerHTML:savedData['column-'+c]['entry-'+e].text,
                    attrs:{
                        contenteditable:''
                    }
                });

                let entry = $('#column-'+c+' #entry-'+e);
                entry.append(addNotesEntryHeadline);
                entry.append(addNotesEntryText);

            }while (e < entryCount.length - 1)

        }while (c < savedData.columnCount)
    })();
});