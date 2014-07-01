// $('.splitFatherLink').html('Yo Dawg!');
var times = 0;
var load_checker = window.setInterval(check_nav,4000);

function create_evn_link() {
  $('#tablist').append("<li><a href=\"#\" id=\"evernoteNav\">NoteFuser</a></li>");
}

function check_nav(){
  navigation = $('#tablist');
  evernote_link = $('#evernoteNav');
  if(navigation.length > 0 && evernote_link.length == 0 ){
    create_evn_link();
  }
}

function get_focused_id () {
  main_url = $('a#main').attr('href');
  expr = /[A-Z0-9]{4}-[A-Z0-9]{3}/;
  id = main_url.match(expr)[0];
  return id;
}

function notefuser_template(){
  template = "<div id=\"note_fuser\">" +
    "<h1 class=\"nf_header\">NoteFuser</h1>"+
    "<div class=\"nf_controles\">"+
      "<a href=\"#\" id=\"create_blank_note\"><img src=\"https://new.familysearch.org/gadgetrepo/org/familysearch/collaboration/df/DiscussionCpGadget/1.x/add_blue_v1.png\" width=\"13\" /> Create a Blank Note</a><br/>"+
      "<a href=\"#\" id=\"create_research_log\"><img src=\"https://new.familysearch.org/gadgetrepo/org/familysearch/collaboration/df/DiscussionCpGadget/1.x/add_blue_v1.png\" width=\"13\" /> Create a Research Log</a>"+
    "</div>"+
    "<div id=\"notefuser_alerts\"></div>"+
    "<div id=\"notefuser_notes\">Loading...</div>"+
  "</div>";
  return template;
}

function load_notes() {
  $('#notefuser_notes').html('Loading...');
  focused_id = get_focused_id();
  $.getJSON('https://new.familysearch.org/familytree/v2/person/'+focused_id+'?assertions=none&personas=all&dataFormat=application/json',function(famtree){
    ids = $.map(famtree.persons[0].personas.persona,function(persona){
      return 'fs.'+persona.id;
    });
    $.get('http://notefuser.herokuapp.com/tags/search?tags='+ids.join(','),function(data){
      $('#notefuser_notes').html(data);
    });
  });
}

function load_notefuser_div(){
  $('#tablist a.activeOption').removeClass('activeOption');
  $('#evernoteNav').addClass('activeOption');
  $('#indiDetails').html(notefuser_template());
  load_notes();
  return false;
}

function create_research_log() {
  focused_id = get_focused_id();
  $.getJSON('https://new.familysearch.org/familytree/v2/person/'+focused_id+'?dataFormat=application/json',function(famtree){
    person = famtree.persons[0]
    id = 'fs.'+ person.id
    name = person.assertions.names[0].value.forms[0].fullText
    console.log(name);
    if(person.assertions.events[0] && person.assertions.events[0].value.type == 'Birth' &&person.assertions.events[0].value.place){
      place = person.assertions.events[0].value.place
      if(place.normalized){
        locality = place.normalized.value;
      }else{
        locality = place.original;
      }
    }else{
      locality = '';
    }
    $('#notefuser_notes').html('Loading...')
    $.post('http://notefuser.herokuapp.com/notes',{id: id, name: name, locality: locality, type: 'log'},function(data){
      $('#notefuser_alerts').html(data);
      load_notes();
    });
  });
  return false;
}
function create_blank_note() {
  focused_id = get_focused_id();
  $.getJSON('https://new.familysearch.org/familytree/v2/person/'+focused_id+'?dataFormat=application/json',function(famtree){
    person = famtree.persons[0]
    id = 'fs.'+ person.id
    name = person.assertions.names[0].value.forms[0].fullText
    console.log(name);
    $('#notefuser_notes').html('Loading...')
    $.post('http://notefuser.herokuapp.com/notes',{id: id, name: name, type: 'blank'},function(data){
      $('#notefuser_alerts').html(data);
      load_notes();
    });
  });
  return false;
}


$('#evernoteNav').live('click',load_notefuser_div);
$('#create_research_log').live('click',create_research_log);
$('#create_blank_note').live('click',create_blank_note);
$('.show_evernote').live('click',function(){
  guid = $(this).attr('rel');
  $('#note'+guid).toggle();
  return false;
});