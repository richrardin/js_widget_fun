
// This variable contains the id of the open popup menu
var ta_openPopup = null;
var dataArrays=new Object();
var minLen = 1;

// This function retuns the absolute location of an element by id
// It is used to position the popup under the element
function getOffset( el ) {
    //var el=document.getElementById(id);
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

// This function removes all children from a node
//   It is used to empty out a popup list
function ta_removeChildren( el ) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

// This function is called any time the field changes
// If the field is empty it closes the popup
// If the field contains a changed value it updates the contents of the popup
// event.target contains the element
function ta_update(event) {
  function ta_match(the_list, n) {
    m = escapeRegExp(n);
    var re = new RegExp("(^|@|\\.)"+m,"gi");
    console.log(re);
    stra = new Array;
    for (x in the_list) {
      str = the_list[x][0];
      if (str.search(re) != -1) {
        stra.push(str);
      }
    }
    return stra;
  }
  // This private function adds a line item to the popup menu
  function popup_add(popup, value) {
    //var br = document.createElement("br");    
    var node = document.createElement("div");
    node.setAttribute("class", "ta_line");
    node.setAttribute("id", "click_" + popup.id);
    node.setAttribute("index", popup.children.length);
    node.onclick = ta_popupClick;
    var txt = document.createTextNode(value);
    node.appendChild(txt);
    
    popup.appendChild(node);
  }
  
  console.log(event.target.id);
  var ta_field = document.getElementById(event.target.id);
  var parent = document.getElementById(event.target.id).parentNode;
  var pid = "popup_" + event.target.id;
  console.log(pid);
  var popup=document.getElementById(pid);
  if (popup) {
    ta_removeChildren(popup);

    console.log("fill our popup");

    // This is now a string that contains the name of our handler as defined
    // by the ta_obj attrigute added to the text field
    handler = ta_field.getAttribute("ta_obj");

    var objPtr = window[handler];    

    //the_list = objPtr.ta_list(ta_field.value);
    the_list = ta_match(objPtr, ta_field.value);

    for (x in the_list) {
      popup_add(popup, the_list[x]);
    }
   
  }
  if (the_list.length > 0 && ta_field.value.length > (minLen-1)) {
    popup.style.display="block";  
    ta_openPopup = pid;
    window.onclick = ta_everyClick;
  } else {
    popup.style.display="none";  
    ta_openPopup = null;
    window.onclick = null;
  }    
}

// This function is called when a row in the popup is clicked
function ta_popupClick( event ) {
  newval = event.target.innerHTML;
  ta_field = document.getElementById(event.target.parentNode.getAttribute("pid"));
  ta_field.value = newval;
  ta_field.focus(); 
}

// This function exists to close the current popup whenever a click is made outside the popup
// (it also closes it when a click is made inside, but after the selection click is processed)
function ta_everyClick( event ) {
  if (ta_openPopup) {
      popup = document.getElementById(ta_openPopup);
      popup.style.display="none";
      window.onclick = null;
      ta_openPopup = null;
  }
  return true;
}

// This function is the listener that closes the popup menu when we exit the field
// NOT USED currently because closing the window on blur eats the menu click
function ta_blur(event) {
  var x=document.getElementById("popup_" + event.target.id);
  x.style.display="none";
}

// This function searches the DOM for all items with a class of "typeahead" and adds them
function ta_init() {
  // This private function takes the ID of a text field and attaches the typeahead listeners to it 
  function ta_add( id ) {
  
    var text_field=document.getElementById(id);
    
    text_field.addEventListener("input", ta_update);
    
    pc = getOffset(text_field);

    var parent = text_field.parentNode;
    var pid = "popup_" + id;
    console.log(pid);
    console.log("create our popup");
    var popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    popup.setAttribute("id", pid); // id of this popup menu (popup_ + parent's id)
    popup.setAttribute("pid", id); // Parent's id
    popup.style.top = pc.top + text_field.offsetHeight;
    popup.style.left = pc.left;
    popup.style.minWidth = text_field.offsetWidth;
    // Note: The popup is attached to the parent of the text field not the field itself
    parent.appendChild(popup);
    
    // Find the data for this field and store it in our local data collection for use latter
    console.log( "typeahead field: " + id );
  }

  var ta_eles = document.getElementsByClassName('typeahead');
  for (var i = 0; i < ta_eles.length; ++i) {
    var item = ta_eles[i]; 
    ta_add(item.id);
  }
}

// These are some utility functions
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
