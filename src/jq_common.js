$( function() {
  var $componentPanel = $("#componentpanel");
  var $mainPanel = $("#mainpanel");

  var $compDetails = (function() {
    var allData = function() {
      return $.getJSON("components.json", function(result) {

      });
    };

    return {
      components: function(callback) {
        allData().done(function(data) {
          callback(data.components);//'components' element from components.json
        });
      }
    };
  })();

  //Object that contains all the current elements in the scratchpad and their saved settings
  var $neuralNet = (function(){
    var object_templates = [{}];
    var initfn = $compDetails.components(function(data) {
      $.each(data, function(n, v) {
        console.log('data[' + n + ']: ' + v);
        object_templates.push({name: n, properties: v});
      })
    });

    //Mar 4 -- @TODO add .data property to the component panel buttons
    var cnodes = $componentPanel.children(':button');
    return {
      delta: function() {
        //deltafn();
      },
      initialize: function() {
        console.log("initializing neuralNet object");
        return initfn;
      }
    };

  })();

  $neuralNet.initialize();
  //$neuralNet.delta();

  $(".chosencomponents").sortable();

  $("li", $componentPanel).draggable({
    cancel: "a.ui-icon",
    revert: "invalid",
    containment: "document",
    helper: "clone",
    cursor: "move",
    appendTo: "body"
  });

  $mainPanel.droppable({
    accept: "#componentpanel > li",
    classes: {
        "ui-droppable-active": "ui-state-highlight"
    },
    drop: function(event, ui) {
      //addComponent(ui.draggable)
      addComponent(ui);
    }
  });

  // Add component
  function addComponent( $item ) {
    var $list = $( "ul", $mainPanel );

    var $newItem = $item.helper.clone();
    $newItem.addClass("list-group-item");
    $newItem.removeAttr("style");
    $newItem
      .find("span.glyphicon-question-sign").remove().end();
    var $newSpan =
    "<span class='glyphicon glyphicon-wrench'></span>&nbsp;<span class='glyphicon glyphicon-remove-sign'></span>";
    $newItem.append($newSpan);//add $newSpan to $newItem
    $newItem.appendTo( $list );//add $newItem to ul

  }

  // Remove the "x's" parent component, a <li> element
  function removeComponent( $item ) {
    $parent = $item.context.parentElement;
    $parent.remove();
  }

  function editComponent( $item ) {
    $parentText = $item.context.parentElement.innerText.trim();
    var strText = "";
    var containsSettingsElements = 0;

    $compDetails.components(function(data) {
      $.each(data, function(n, v) {
        if (n == $parentText) {
          strText = "<div width='384' height='288' style='display: none; padding: 8px; text-align: left'><form><ul><fieldset class='csettings'><legend></legend>";
          $.each(v.settings, function(sn, sv) {
            containsSettingsElements = 1;
            if (sv == "n") {
              strText = strText + "<li><label for='" + sn + "'>" + sn + "</label> " + "<input type='number' name='" + sn + "' size=5 maxlength=5 /></li>";
            } else if (sv == "text") {
              strText = strText + "<li><label for='" + sn + "'>" + sn + "</label> " + "<input type='text' name='" + sn + "' size=5 maxlength=5 /></li>";
            } else if (sv == "f") {
              strText = strText + "<li><label for='" + sn + "'>" + sn + "</label> " + "<input type='range' name='" + sn + "' min=0 max=1 /></li>";
            } else if (sv.match(/:/)) {
              //dropdown choices
              var choices = sv.split(":");
              var strChoices = "<select id=" + sn + ">";
              for (var i = 0; i < choices.length; i++) {
                strChoices += "<option value='" + choices[i] + "'>" + choices[i] + "</option>";
              }
              strChoices += "</select>";
              //console.log("strc: " + strChoices);
              strText = strText + "<li><label for='" + sn + "'>" + sn + "</label> " + strChoices + "</li>";
            }
          });
          if (containsSettingsElements == 1) {
            strText = strText + "<button class='btn btn-large btn-primary'><span class='glyphicon glyphicon-floppy-disk'></span></button>";
          }
          strText = strText + "</fieldset></ul></form></div>";
          var divt = $(strText).appendTo( "body" );
          setTimeout(function() {
            divt.dialog({
              title: $parentText,
              width: 400,
              modal: true
            });
          }, 1 );
        }
      });
    });
  }

  // A modal window describing the component
  function describeComponent( $link ) {
    var $layerName = $link.context.nextSibling.data.trim();
    //console.log($layerName);

    $compDetails.components(function(data) {
      $.each(data, function(n, v) {
        //console.log('n: ' + n + '; d: ' + v['description']);
        if (n == $layerName) {
          var divt = $( "<div width='384' height='288' style='display: none; padding: 8px; text-align: left'>"
            + v['description'] + " <a target='_blank' style='background-color: lightgreen' href='" + v['external_link'] + "'>More...</a></div>")
            .appendTo( "body" );
          setTimeout(function() {
            divt.dialog({
              title: n,
              width: 400,
              modal: true
            });
          }, 1 );
        }
      });
    });
  }

  // For dynamically added 'chosencomponents' in the mainpanel
  $(document).on( "click", "ul.chosencomponents > li", function( event ) {
    var $item = $( this ),
      $target = $( event.target );

    if ( $target.is( "span.glyphicon-remove-sign" ) ) {
      removeComponent( $target );
    } else if ($target.is( "span.glyphicon-wrench" ) ) {
      editComponent($target);
    }
    return false;
  });

  // For the static components in the 'componentpanel'
  $( "ul.componentpanel > li" ).on( "click", function( event ) {
    var $item = $( this ),
      $target = $( event.target );

    if ( $target.is( "span.glyphicon-question-sign" ) ) {
      describeComponent( $target );
    }
    return false;
  });

});
