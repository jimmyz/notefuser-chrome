function create_nf_link() {
  $('#revision_tab').before("<li id=\"noteFuserTab\"><a href=\"#/tab/notefuser\" id=\"noteFuser\">NoteFuser</a></li>");
  $('#discussion_tab_content').after(notefuser_template());
}

function get_focused_id () {
  path = window.location.pathname;
  expr = /people\/[^/]*\/([0-9]*)/;
  id = path.match(expr)[1];
  return 'geni.'+id;
}


function setup_tab_views () {
  $('#overview_tab_content').addClass('other_tab_content');
  $('#media_tab_content').addClass('other_tab_content');
  $('#timeline_tab_content').addClass('other_tab_content');
  $('#discussion_tab_content').addClass('other_tab_content');
  $('#source_tab_content').addClass('other_tab_content');
  $('#revision_tab_content').addClass('other_tab_content');
}

function hide_other_tabs () {
  $('.other_tab_content').hide();
}

function load_notes() {
  $('#notefuser_notes').html('Loading...');  
  focused_id = get_focused_id();
  $.get('http://notefuser.herokuapp.com/tags/search?tags='+focused_id+'&notes_only=true',function(data){
    $('#notefuser_notes').html(data);
  });
}

function load_notefuser_div(){
  $('#profile_tabs li.current').removeClass('current');
  $('#profile_tabs li.first_current').removeClass('first_current');
  $('#noteFuserTab').addClass('current');
  hide_other_tabs();
  $('#notefuser_tab_content').show();
  load_notes();
  return false;
}

function notefuser_template(){
  template = "<div id=\"notefuser_tab_content\" style=\"display:none\">" +
    "<div class=\"content_bd\">"+
      "<div class=\"module profile_module lengthy\">"+
        "<div class=\"inner\">"+
          "<div class=\"hd basic_hd\">"+
            "<div class=\"supplemental\">"+
              "<img alt=\"Transparent\" class=\"icn add_icn\" src=\"http://assets2.geni.com/images/transparent.gif?1310602807\"> <a href=\"#\" id=\"create_blank_note\">Create Blank Note</a><br/>"+
              "<img alt=\"Transparent\" class=\"icn add_icn\" src=\"http://assets2.geni.com/images/transparent.gif?1310602807\"> <a href=\"#\" id=\"create_research_log\">Create Research Log</a>"+
            "</div>"+
            "<h2>NoteFuser</h2>"+
            "<ul class=\"horiz_list small strong\">"+
              "<li>View Notes</li>"+
            "</ul>"+
          "</div>"+
          "<div id=\"notefuser_paged_content\" class=\"basic_bd\">"+
            "<div id=\"notefuser_alerts\"></div>"+
            "<div id=\"notefuser_notes\"></div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>"+
  "</div>";
  return template;
}

function create_research_log() {
  $('#notefuser_alerts').html("Loading...");
  id = get_focused_id();
  name = $('span[itemprop="name"]').text();
  name = $.trim(name);
  console.log(name);
  vitals = $('table.data_table tr:first td:first').text();  
  $.post('http://notefuser.herokuapp.com/notes',{id: id, name: name, locality: '', type: 'log'},function(data){
    $('#notefuser_alerts').html(data);
    load_notes();
  });
  return false;
}

function create_blank_note() {
  $('#notefuser_alerts').html("Loading...");
  id = get_focused_id();
  name = $('span[itemprop="name"]').text();
  name = $.trim(name);
  console.log(name);
  $.post('http://notefuser.herokuapp.com/notes',{id: id, name: name, locality: '', type: 'blank'},function(data){
    $('#notefuser_alerts').html(data);
    load_notes();
  });
  return false;
}


$('#noteFuser').live('click',load_notefuser_div);
$('#profile_tabs li:not(li#noteFuserTab) a').live('click',function() {
  $('#notefuser_tab_content').hide();
});
$('#create_research_log').live('click',create_research_log);
$('#create_blank_note').live('click',create_blank_note);
$('.show_evernote').live('click',function(){
  guid = $(this).attr('rel');
  $('#note'+guid).toggle();
  return false;
});
create_nf_link();
setup_tab_views();