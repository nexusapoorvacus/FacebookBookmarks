// ==UserScript==
// @name        Facebookmark
// @namespace   http://hayageek.com
// @include     https://www.facebook.com/*
// @version     1
// ==/UserScript==

//Adding See Bookmarks to the Left Side Bar
var s = '<div id="bm" height = "20px" display: inline-block><img src="http://png-1.findicons.com/files/icons/977/rrze/720/bookmark.png" alt="Smiley face" height="15" width="15"> See Bookmarks</div><br>';
var div = document.createElement('div');
div.innerHTML = s;
div.onclick = retrieve_data;
document.getElementById("pagelet_pinned_nav").appendChild(div);
//var rightbar = document.getElementsByClassName("pagelet_ego_pane")[0];
//GM_log('rightbar is'+rightbar);

var rtsidebar = document.getElementById("rightCol");
//var counter = 0;

function go_to_bookmarks()
{
    if (rtsidebar.style.display != 'none')
    {
        rtsidebar.style.display = 'none';
    }
    else
    {
        rtsidebar.style.display = 'block';
    }
}

    
//Adding a Bookmark to every post
var poststream = document.getElementsByClassName("uiList uiStream uiStreamHomepage translateParent uiStreamRedesign uiStreamLargeHeadline UIIntentionalStream_Content _4kg _4ks")[0];

var hiddenpoststream = document.getElementsByClassName("uiList mtm uiCollapsedList uiCollapsedListHidden uiStreamSubstories _4kg _6-h _704 _4ks")[0];

var bmStream = [];
var data_number = -1;
        
for (var i = 0; i < poststream.children.length; i++)
{
    var story = poststream.children[i];
    GM_log(story);
    
    if(story.getElementsByClassName("uiStreamFooter")[0] != null)
    {
        var bottomNav = document.getElementsByClassName("uiStreamFooter")[i];
        var bookmarkLink = bottomNav.firstChild;
       
        //Now replace "a" with bmStream[i]
        bmStream.push(document.createElement('a'));
        var atext = document.createTextNode("Bookmark ");
        bmStream[i].appendChild(atext);
        bmStream[i].title = "Bookmark";
        bmStream[i].href = "#";
        bmStream[i].onclick = (function(){
            var currentI = i; 
            return function(){
                GM_log(bmStream[currentI]);
                obtain_data(bmStream[currentI]);
            };
        })(); 
        bookmarkLink.appendChild(bmStream[i]);
    }
}
GM_log(bmStream);

for (var j = 0; j < hiddenpoststream.children.length; j++)
{
    var hiddenstory = poststream.children[j];
    
    
    if(hiddenstory.getElementsByClassName("uiStreamFooter")[0] == null)
    {
        var bottomNav = document.getElementsByClassName("uiStreamFooter")[hiddenstory];
        var bookmarkLink = bottomNav.firstChild;
        
        var a = document.createElement('a');
        var atext = document.createTextNode("Bookmark ");
        a.appendChild(atext);
        a.title = "Bookmark";
        a.href = "#";
        //a.onclick
        bookmarkLink.appendChild(a);
    }
        
}


function showBookmarkPanel()
{
    GM_log("Showing bookmark panel");
}

function obtain_data(bookmark)
{
    GM_log("Obtaining the data...");
    function ancestor(node){
        if(!node)
        {
            return null;
        }
        else if(node.getElementsByClassName("mainWrapper")[0])
        {
            return node;
        }
        else
        {
            return ancestor(node.parentNode);
        }
    }              
    mainwrapper = ancestor(bookmark);
    userName = mainwrapper.getElementsByTagName("a")[0].textContent;
//    GM_log(userName);
    var userContent = mainwrapper.getElementsByClassName("userContent")[0].textContent;
    GM_log(userName+"says: "+userContent);
    save_data(userName, userContent);
}

function save_data(userName, userContent)
{
    data_number += 1;
    var post = {getusername: userName, getusercontent: userContent};
    stringpost = JSON.stringify(post);
    GM_setValue(data_number, stringpost);
}

GM_log('HI');
document.getElementById("pagelet_pinned_nav").appendChild(div);

//var rdiv = document.createElement('div');
function retrieve_data(){
    //Retrive the stored posts data and present them.
    for (var i = 0; i < data_number + 1; i++){
        var post = JSON.parse(GM_getValue(i));
        var post_username = post.getusername;
        var post_usercontent = post.getusercontent;
        var newdiv = document.createElement('div');
        newdiv.innerHTML = '<span>'+(i+1)+'.'+'<b>'+post_username+':</b><br>'+post_usercontent+'<br><br></span>';
        document.getElementById("pagelet_pinned_nav").appendChild(newdiv);
        
    }
}
