//creating DOM elements
// src https://javascript.plainenglish.io/how-to-build-complex-dom-elements-quickly-b3ead8e09647
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
    let columnCount = 'column-' + (($('.notes-column').length) + 1);

    let addCol =  dom_utils.createEl({
        type: 'div',
        id: columnCount,
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
    let columnCount = 'column-' + (($('.notes-column').length) + 1);

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
            contenteditable:''
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
        id: entryCount,
        className: 'notes-entry-head',
        innerHTML:'Entry Headline',
        attrs:{
            contenteditable:''
        }
    });

    let addNotesEntryText =  dom_utils.createEl({
        type: 'div',
        id: entryCount,
        className: 'notes-entry-text',
        innerHTML:'Entry text',
        attrs:{
            contenteditable:''
        }
    });
    colBodyParent.insertBefore(addNotesEntry, colBodyParent.lastElementChild);
    addNotesEntry.appendChild(addNotesEntryHeadline);
    addNotesEntry.appendChild(addNotesEntryText);
    
}