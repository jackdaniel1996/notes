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
// NoteToSelf: Attributes (attrs) must be written in camelCase
let dom_utils = {};

// functions to create and append/insert elements
function appendDOMobj(type, id, className, innerHTML, attrs, parent){
    let addContent = dom_utils.createEl({
        type: type,
        id: id,
        className: className,
        innerHTML: innerHTML,
        attrs: attrs
    });
    parent.append(addContent);
    return addContent;
}

function insertDOMobj(type, id, className, innerHTML, attrs, parent){
    let addContent = dom_utils.createEl({
        type: type,
        id: id,
        className: className,
        innerHTML: innerHTML,
        attrs: attrs
    });
    parent.insertBefore(addContent, parent.lastElementChild);
    return addContent;
}

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
    let addColAttr = {onclick: 'addCol()'};  

    // add column button body
    let addCol = appendDOMobj('div', 'column-0', 'notes-column add-column', '', addColAttr, notesBody);    

    // add column button content
    appendDOMobj('div', '', 'notes-add-column', 'Add Column +', '', addCol);  
}

$(document).ready(function(){
    addColButton();
});

// add Column
function addCol(){
    let notesBody = document.getElementById('notesBody');
    let columnCount = 'column-' + $('.notes-column').length;

    //col body
    let addColBody = insertDOMobj('div', columnCount, 'notes-column', '', '', notesBody);

    //col content
    let colHeadlineAttr = {contenteditable:''};
    appendDOMobj('div', '', 'notes-column-head', 'Headline', colHeadlineAttr, addColBody);

    let addEntryAttr = {onclick: 'addColEntry(this)'};
    let addColEntryBtn = appendDOMobj('div', '', 'notes-add-entry', 'Add Entry +', addEntryAttr, addColBody);
        
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
    let addNotesEntry = insertDOMobj('div', entryCount, 'notes-entry', '', '', colBodyParent);
   
    //entry content
    let notesAttr = {contenteditable:''}
    //headline
    appendDOMobj('div', '', 'notes-entry-head', 'Entry Headline', notesAttr, addNotesEntry)
    //text
    appendDOMobj('div', '', 'notes-entry-text', 'Entry text', notesAttr, addNotesEntry)
   
    //save
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
        let notesAttr = {contenteditable:''}

        var c = 0;
        //column
        do{
            c += 1;
            let colId = Object.getOwnPropertyNames(savedData); //TODO: error when saveData does not exist yet. 

            //col body
            insertDOMobj('div', colId[c], 'notes-column', '', '', notesBody)

            //col headline
            let col = document.getElementById('column-'+c);
            
            appendDOMobj('div', '', 'notes-column-head',  savedData[colId[c]].headline, notesAttr, col)            

            //add entry button
            let addEntryAttr = {onclick: 'addColEntry(this)'};
            appendDOMobj('div', '', 'notes-add-entry', 'Add Entry +', addEntryAttr, col);
            
            //entrys
            let entryCount = Object.getOwnPropertyNames(savedData[colId[c]])
            var e = 0;
            do{
                e += 1;
                let entryId = Object.getOwnPropertyNames(savedData[colId[c]]);
                //entry body
                insertDOMobj('div', entryId[e], 'notes-entry', '', '', col);
                
                //entry content
                let entry = $('#column-'+c+' #entry-'+e);
                //entry headline
                appendDOMobj('div', '', 'notes-entry-head', savedData['column-'+c]['entry-'+e].headline, notesAttr, entry);
                //entry text
                appendDOMobj('div', '', 'notes-entry-text', savedData['column-'+c]['entry-'+e].text, notesAttr, entry);
                

            }while (e < entryCount.length - 1)

        }while (c < savedData.columnCount)
    })();
});