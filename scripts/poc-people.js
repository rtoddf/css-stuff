$(document).ready(function(){
    People.getPeople()
})

var isDefined = function(obj){
    return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
}

var Person = function(detail){
    this.name = isDefined(detail.name)
    this.photo = isDefined(detail['data'].shortname) + '.jpg'
    // this.birthdate = isDefined(detail.birthdate)
    // this.birthplace = isDefined(detail.birthplace)
    // this.bio = isDefined(detail.bio)
    // this.twitter = isDefined(detail.social.twitter)
    // this.instagram = isDefined(detail.social.instagram)
    // this.type = isDefined(detail.type)
}

var People = new function(){
    this.getPeople = function(){
        var people = []
        $.getJSON('data/people03.json', function(data){
            console.log('people: ', data)
            data.forEach(function(pers, i){
                var person = new Person(pers)
                people.push(person)
            })

            console.log('people: ', people)

            // people = _.sortBy(people, function(a){
            //     return (a.name).split(' ').pop()
            // })

            // People.render(people, p)
       })
   }
}