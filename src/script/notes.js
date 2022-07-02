let lables = {
    addColumn: 'Add Column +',
    addEntry: 'Add Entry +',
    headline: 'Headline',
    entryHeadline: 'Entry Headline',
    entryText: 'Entry Text'
}

let dom_utils = {};
// elements that are editable
let contentInputs;

// functions to create and append/insert elements
// NoteToSelf: Attributes (attrs) must be written in camelCase
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
// src for this function https://javascript.plainenglish.io/how-to-build-complex-dom-elements-quickly-b3ead8e09647
// creating DOM elements
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
    appendDOMobj('div', '', 'notes-add-column', lables.addColumn, '', addCol);  
}

// add Column
function addCol(){
    let notesBody = document.getElementById('notesBody');
    let columnCount = $('.notes-column').length;

    //col body
    let addColBody = insertDOMobj('div', 'column-' + columnCount, 'notes-column', '', '', notesBody);

    //settings panel
    let deleteAttr = {onclick: 'deleteCol(this)'}
    let addSettingsPanel = appendDOMobj('div', 'settings-' + columnCount, 'notes-col-settings', '', '', addColBody);
    appendDOMobj('div', '', 'delete-col', '', deleteAttr, addSettingsPanel);

    //col content
    let colHeadlineAttr = {contenteditable:''};
    appendDOMobj('div', '', 'notes-column-head', lables.healdine, colHeadlineAttr, addColBody);

    let addEntryAttr = {onclick: 'addColEntry(this)'};
    let addColEntryBtn = appendDOMobj('div', '', 'notes-add-entry', lables.addEntry, addEntryAttr, addColBody);
        
    //add first entry
    addColEntry(addColEntryBtn);

    //save
    contentInputs = $('.notes-column-head, .notes-entry-head, .notes-entry-text');
    contentInputs.each(inputSave);
}

//add Entry
function addColEntry(elem){
    let colBodyParent = document.getElementById(elem.parentNode.id);
    let parentCount = elem.parentNode.id.slice(-1);
    let entryCount = 'entry-'+ parentCount + '-' + (($('#' + elem.parentNode.id + ' .notes-entry').length) + 1); //id of entry (entry-ColCount-EntryCount)
    //entry body
    let addNotesEntry = insertDOMobj('div', entryCount, 'notes-entry', '', '', colBodyParent);
   
    //entry content
    let notesAttr = {contenteditable:''}
    //headline
    appendDOMobj('div', '', 'notes-entry-head', lables.healdine, notesAttr, addNotesEntry)
    //text
    appendDOMobj('div', '', 'notes-entry-text', lables.healdine, notesAttr, addNotesEntry)
   
    //save
    contentInputs = $('.notes-column-head, .notes-entry-head, .notes-entry-text');
    contentInputs.each(inputSave);
    saveData();
}

//delete Col
function deleteCol(col){
    selectedColumn = col.parentElement.getAttribute('id').slice(-1);
    $('#column-' + selectedColumn).remove();  
    renumberContent();

    //save
    setTimeout(function(){
        saveData();
    }, 200); 
}

function renumberContent(){
    $('#notesBody .notes-column').each(function(c){
        c += 1;
        $(this).attr('id', 'column-' + c);
        $(this).children('.notes-col-settings').attr('id', 'settings-' + c);

        $(this).children('.notes-entry').each(function(e){
            e += 1;
            $(this).attr('id', 'entry-' + c + '-' + e); 
        });
    });
    $('#notesBody > :last-child').attr('id', 'column-0');
}

// saving data
var dbContent = {}; // object to store notes content

function saveData(){
    dbContent.columnCount = $('.notes-column').length - 1;
    if(dbContent.columnCount > 0)
    {
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
                let entry = 'entry-' + i + '-' + e;
                dbContent[col][entry] = {};
                dbContent[col][entry]["headline"] =  $('#' + col + ' #' + entry + ' .notes-entry-head').text(); // entry headline
                dbContent[col][entry]["text"] =  $('#' + col + ' #' + entry + ' .notes-entry-text').text(); // entry content

            }while (e < entryCount)
            
        } while (i < dbContent.columnCount);
        
        
        localStorage.setItem('savedData', JSON.stringify(dbContent));        

        console.log('Saved!');
    }else{
        localStorage.setItem('savedData', 0);
    }
}

//displaying saved data
$(document).ready(function(){  
    addColButton();  
    (function displayData (){
        let savedData = JSON.parse(localStorage.getItem('savedData'));
        let notesBody = document.getElementById('notesBody');
        let notesAttr = {contenteditable:''}
        
        //column
        if(savedData !== null && savedData !== 0)
        {
            var c = 0;
            do{
                c += 1;
                let colId = Object.getOwnPropertyNames(savedData);
               
                //col body
                insertDOMobj('div', colId[c], 'notes-column', '', '', notesBody)

                //col headline
                let col = document.getElementById('column-'+c);

                //settings panel
                let deleteAttr = {onclick: 'deleteCol(this)'}
                let addSettingsPanel = appendDOMobj('div', 'settings-' + c, 'notes-col-settings', '', '', col);
                appendDOMobj('div', '', 'delete-col', '', deleteAttr, addSettingsPanel);
                
                appendDOMobj('div', '', 'notes-column-head',  savedData[colId[c]].headline, notesAttr, col)            

                //add entry button
                let addEntryAttr = {onclick: 'addColEntry(this)'};
                appendDOMobj('div', '', 'notes-add-entry', lables.addEntry, addEntryAttr, col);
                
                //entrys
                let entryCount = Object.getOwnPropertyNames(savedData[colId[c]])
                var e = 0;
                do{
                    e += 1;
                    let entryId = Object.getOwnPropertyNames(savedData[colId[c]]);
                    //entry body
                    insertDOMobj('div', entryId[e], 'notes-entry', '', '', col);
                    
                    //entry content
                    let entry = $('#column-'+c+' #entry-'+c+'-'+e);
                    //entry headline
                    appendDOMobj('div', '', 'notes-entry-head', savedData['column-'+c]['entry-'+c+'-'+e].headline, notesAttr, entry);
                    //entry text
                    appendDOMobj('div', '', 'notes-entry-text', savedData['column-'+c]['entry-'+c+'-'+e].text, notesAttr, entry);
                    

                }while (e < entryCount.length - 1)

            }while (c < savedData.columnCount)
        }
    })();

    contentInputs = $('.notes-column-head, .notes-entry-head, .notes-entry-text');
    contentInputs.each(inputSave);
});

//save after input
let typingTimer;               
let doneTypingInterval = 500;  
contentInputs = $('.notes-column-head, .notes-entry-head, .notes-entry-text');

contentInputs.each(inputSave);

function inputSave(input){
    contentInputs[input].addEventListener('keyup', () => {
        clearTimeout(typingTimer); 
        typingTimer = setTimeout(doneTyping, doneTypingInterval);          
    });
}

function doneTyping() {
    saveData()
}