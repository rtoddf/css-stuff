$(document).ready(function(){
    People.getPeople('politics')
})

var isDefined = function(obj){
    return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
}

var Person = function(detail){
    this.name = isDefined(detail.name)
    this.photo = isDefined(getPhoto(detail.name))
    this.birthdate = isDefined(detail.birthdate)
    this.birthplace = isDefined(detail.birthplace)
    this.bio = isDefined(detail.bio)
    this.twitter = isDefined(detail.social.twitter)
    this.instagram = isDefined(detail.social.instagram)
    this.type = isDefined(detail.type)
}

function getPhoto(name, type){
    var image_name = name.toLowerCase().replace(/ |\//g,'_').replace(/\(|\)|\.|\'|\,/g, '').replace('é', 'e').replace('ë', 'e') + '.jpg'
    return image_name
}

var People = new function(){
    this.getPeople = function(p){
        var people = []
        $.getJSON('../data/' + p + '.json', function(data){
            data.forEach(function(pers, i){
                var person = new Person(pers)
                people.push(person)
            })

            people = _.sortBy(people, function(a){
                return (a.name).split(' ').pop()
            })

            People.render(people, p)
        })
    }

    this.render = function(people, type){
        var template_people_compiled = _.template(template_people_raw, {
            members: people,
            type: type
        })

        $('#gallery #columns').html(template_people_compiled)
        cols = $('#columns .column')
    }
}

var template_people_raw = '<% for (var i = 0; i < members.length; i++){ %> \
    <div class="column" draggable="true"> \
        <header><%= members[i].name %></header> \
        <div class="content"> \
            <img src="../images/drag-n-drop/<%= members[i].photo %>" class="treatment" /> \
            <p>&nbsp; \
                <% if(members[i].twitter !== ""){ %> \
                    <span><a href="http://www.twitter.com/<%= members[i].twitter %>" target="_blank">Twitter</a></span> \
                <% } %> \
                <% if(members[i].instagram !== ""){ %> \
                    <span> / <a href="http://instagram.com/<%= members[i].instagram %>" target="_blank">Instagram</a></span> \
                <% } %> \
            &nbsp;</p> \
        </div> \
    </div> \
    <% if ((i + 1) % 4 === 0){ %> \
        <div class="clear"></div> \
    <% } %> \
<% } %>'

var cols,
    dragSrcEl = null

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

    [].forEach.call(cols, function(col){
        $(col).css({'opacity': '1.0'}).removeClass('over')
    })

    return false
}

function handleDragEnd(e){
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
