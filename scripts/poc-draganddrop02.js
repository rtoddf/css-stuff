var cols;
var widgetOrder = [];

$(document).ready(function(){
    cols = $('#columns .column'),
        dragSrcEl = null
})

function handleDragStart(e){
    $(this).css({'opacity': '0.4'})

    dragSrcEl = this

    e.originalEvent.dataTransfer.effectAllowed = 'move'
    e.originalEvent.dataTransfer.setData('text/html', $(this).html())
}

function handleDragOver(e){
    if(e.preventDefault){
        // Necessary. Allows us to drop.
        e.preventDefault('text/html', $(this).html())
    }

    e.originalEvent.dataTransfer.dropEffect = 'move'
    return false;
}

function handleDragEnter(e){
    $(this).addClass('over')
}

function handleDragLeave(e){
    $(this).removeClass('over')
}

function handleDrop(e){
    if(e.stopPropagation){
        e.stopPropagation()
    }

    if(dragSrcEl != this){
        dragSrcEl.innerHTML = $(this).html()
        this.innerHTML = e.originalEvent.dataTransfer.getData('text/html')
    }

    $.each(cols, function(i, col){
        $(col).css({'opacity': '1.0'}).removeClass('over')
    });

    saveState();

    return false
}

function handleDragEnd(e){
    console.log('handleDragEnd: ', e);
    [].forEach.call(cols, function(col){
        $(col).css({'opacity': '1.0'}).removeClass('over')
    })
}

// var mutationObserver = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//         var target = mutation.target;
//         console.log($(target).attr("data-id"));
//     });
// });

// mutationObserver.observe(node, {
//     attributes: true,
//     characterData: true,
//     childList: true,
//     subtree: true,
//     // attributeOldValue: true,
//     // characterDataOldValue: true,
//     attributeFilter: ['data-id']
// });

function callback(mutationList, observer) {
    mutationList.forEach((mutation) => {
        switch(mutation.type) {
        case 'childList':
            /* One or more children have been added to and/or removed
                from the tree; see mutation.addedNodes and
                mutation.removedNodes */
            break;
        case 'attributes':
            /* An attribute value changed on the element in
                mutation.target; the attribute name is in
                mutation.attributeName and its previous value is in
                mutation.oldValue */
            break;
        }
        var target = mutation.target;
        var children = $(target).parent().children()
        console.log(children);
    });
}

var targetNode = document.querySelector(".container");
var observerOptions = {
  childList: true,
  attributes: true,
  subtree: true //Omit or set to false to observe only changes to the parent node.
}

var observer = new MutationObserver(callback);
observer.observe(targetNode, observerOptions);

function saveState(){
    if (localStorage) {
        // widgetOrder = [];

        // $.each(cols, function(i, col){
            
        //     widgetOrder.push($(col).attr("data-id"));
        // });

        

        console.log("we have local storage: ", widgetOrder);

    }
}

$('#columns').on('dragstart', '.column', handleDragStart)
$('#columns').on('dragenter', '.column', handleDragEnter)
$('#columns').on('dragover', '.column', handleDragOver)
$('#columns').on('dragleave', '.column', handleDragLeave)
$('#columns').on('drop', '.column', handleDrop)
$('#columns').on('dragstop', '.column', handleDragEnd)
