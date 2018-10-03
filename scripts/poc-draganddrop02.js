var cols;

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

    return false
}

function handleDragEnd(e){
    console.log('handleDragEnd: ', e);
    [].forEach.call(cols, function(col){
        $(col).css({'opacity': '1.0'}).removeClass('over')
    })
}

$('#columns').on('dragstart', '.column', handleDragStart)
$('#columns').on('dragenter', '.column', handleDragEnter)
$('#columns').on('dragover', '.column', handleDragOver)
$('#columns').on('dragleave', '.column', handleDragLeave)
$('#columns').on('drop', '.column', handleDrop)
$('#columns').on('dragstop', '.column', handleDragEnd)
