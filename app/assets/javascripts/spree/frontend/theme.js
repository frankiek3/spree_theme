//= require spree/frontend
//= require jquery.hoverIntent
//= require jquery-ui
//= require jquery.bxslider
//= require jquery.dotdotdot-1.5.2
//= require matchMedia
//= require enquire
//= require select2


function flashError(data)
{
  $('#wrapper').prepend($(document.createElement("DIV")).addClass("flash").addClass("error").html(data));
  setTimeout('$(".flash").fadeOut(1000)', 10000);
  $("html, body").animate({ scrollTop: 0 }, "slow");
}

$(function(){
  // jQuery(function($) {

  $('select.select2').select2({
    allowClear: false,
    dropdownAutoWidth: true
  });

  // Hide flash messages after timeout
  setTimeout('$(".flash").fadeOut(1000)', 10000);

  // Home sliders
  if($('#home-slider').length > 0) {

    var cached_carousel_1 = $('#featured-products .carousel').html();
    var cached_carousel_2 = $('#latest-products .carousel').html();

    $('#home-slider > ul').bxSlider({
      adaptiveHeight: true,
      auto: true,
      autoHover: true,
      useCSS: true,
      controls: false,
      pagerSelector: '.slider-pager',
      touchEnabled: true
    });

    $('.carousel').bxSlider({
      minSlides: 1,
      maxSlides: 4,
      useCSS: true,
      slideWidth: 230,
      slideMargin: 10,
      auto: true,
      autoHover: true,
      controls: false,
      touchEnabled: true
    });

    $("#home-slider .product-description").dotdotdot({
      watch: true,
      height: 250
    });

  }

  // Make buttons from radio inputs
  $( "#product-variants .variants-buttons" ).buttonset();
  $( ".payment-method-selector").buttonset();

  // Search hover
  var searchHoverConfig = {
    over: function(){
      $("#search-bar").find('form').fadeIn('300');
    },
    timeout: 300, // number = milliseconds delay before onMouseOut
    out: function(){
      $("#search-bar").find("form").fadeOut('300');
    }
  };

  $("#search-bar").hoverIntent(searchHoverConfig);

  // Cart table responsive fixes
  var cart_description_header = $('th.cart-item-description-header');
  var cart_subtotal_header = $('tr.cart-subtotal td').first();
  var cart_total_header = $('tr.cart-total td').first();
  var cart_adjustment_header = $('#cart_adjustments tr').find(':first-child');

  // Media
  enquire.register("screen and (max-width: 767px)", {
      //Mobile
      match : function() {
        $('#navigation, #mobile-navigation').children().detach().appendTo("#mobile-navigation");
        if(cart_description_header.length > 0 || cart_adjustment_header.length > 0) {
          cart_description_header.attr('colspan', '1');
          cart_subtotal_header.attr('colspan', '3');
          cart_total_header.attr('colspan', '3');
          cart_adjustment_header.attr('colspan', '3');
        }
      },
      //Non-mobile
      unmatch : function() {
        $('#navigation, #mobile-navigation').children().detach().appendTo("#navigation");
        if(cart_description_header.length > 0 || cart_adjustment_header.length > 0) {
          cart_description_header.attr('colspan', '2');
          cart_subtotal_header.attr('colspan', '4');
          cart_total_header.attr('colspan', '4');
          cart_adjustment_header.attr('colspan', '4');
        }
      }
  }).listen();

  enquire.register("screen and (max-width: 479px)", {
    match : function() {
      $('div[data-hook="cart_container"]').parent().parent().css("width", "auto");
      //$('#google_ads ins, #google_ads iframe').width(287).height(80);
    },
    unmatch : function() {
      $('div[data-hook="cart_container"]').parent().parent().css("width", "");
      //$('#google_ads, #google_ads ins, #google_ads iframe').width(935).height(140);
    }
  }).listen();

  enquire.register("screen and (min-width: 768px) and (max-width: 959px)", {
    match : function() {
      $('div[data-hook="cart_container"]').parent().parent().css("width", "auto");
      //$('#google_ads ins, #google_ads iframe').width(735).height(120);
    },
    unmatch : function() {
      $('div[data-hook="cart_container"]').parent().parent().css("width", "");
      //$('#google_ads, #google_ads ins, #google_ads iframe').width(935).height(140);
    }
  }).listen();

  enquire.register("screen and (min-width: 480px) and (max-width: 767px)", {
    match : function() {
      //$('#google_ads ins, #google_ads iframe').width(435).height(100);
    },
    unmatch : function() {
      //$('#google_ads, #google_ads ins, #google_ads iframe').width(935).height(140);
    }
  }).listen();

  enquire.register("screen and (min-width: 960px) and (max-width: 9999px)", {
    match : function() {
      //$('#google_ads ins, #google_ads iframe').width(935).height(140);
    },
    unmatch : function() {
    }
  }).listen();


});

(function() {
  Spree.ready(function($) {
    var fillStates, getCountryId, updateState;
    if (($('#checkout_form_address')).is('*')) {
      ($('#checkout_form_address')).validate();
      getCountryId = function(region) {
        return $('#' + region + 'country select').val();
      };
      updateState = function(region) {
        var countryId;
        countryId = getCountryId(region);
        if (countryId != null) {
          if (Spree.Checkout[countryId] == null) {
            return $.get(Spree.routes.states_search, {
              country_id: countryId
            }, function(data) {
              Spree.Checkout[countryId] = {
                states: data.states,
                states_required: data.states_required
              };
              return fillStates(Spree.Checkout[countryId], region);
            });
          } else {
            return fillStates(Spree.Checkout[countryId], region);
          }
        }
      };

      fillStates = function(data, region) {
        var selected, stateInput, statePara, stateSelect, stateSpanRequired, states, statesRequired, statesWithBlank;
        statesRequired = data.states_required;
        states = data.states;
        statePara = $('#' + region + 'state');
        stateSelect = statePara.find('select');
        stateInput = statePara.find('input');
        stateSpanRequired = statePara.find('state-required');
        if (states.length > 0) {
          selected = parseInt(stateSelect.val());
	  stateSelect.easyDropDown('destroy');
          stateSelect.html('');
          statesWithBlank = [
            {
              name: '',
              id: ''
            }
          ].concat(states);
          $.each(statesWithBlank, function(idx, state) {
            var opt;
            opt = ($(document.createElement('option'))).attr('value', state.id).html(state.name);
            if (selected === state.id) {
              opt.prop('selected', true);
            }
            return stateSelect.append(opt);
          });
	  var newDrop = stateSelect.easyDropDown({ cutOff: 10 });
	  newDrop.easyDropDown('enable');
          stateInput.hide().prop('disabled', true);
          statePara.show();
          stateSpanRequired.show();
          if (statesRequired) {
            stateSelect.addClass('required');
          }
	  stateSelect.removeClass('hidden');
          return stateInput.removeClass('required');
        } else {
	  stateSelect.easyDropDown('disable');
	  stateInput.show();
          if (statesRequired) {
            stateSpanRequired.show();
            stateInput.addClass('required');
          } else {
            stateInput.val('');
            stateSpanRequired.hide();
            stateInput.removeClass('required');
          }
          statePara.toggle(!!statesRequired);
          stateInput.prop('disabled', !statesRequired);
          stateInput.removeClass('hidden');
	  statePara.find('.dropdown').addClass('hidden');
          return stateSelect.removeClass('required');
        }
      };
      
      ($('#bcountry select')).unbind("change");
      ($('#scountry select')).unbind("change");
      
      ($('#bcountry select')).change(function() {
        return updateState('b');
      });
      ($('#scountry select')).change(function() {
        return updateState('s');
      });
      updateState('b');
    }
  });

}).call(this);

//var hide_dialog = function() {
//    $('.dialog').hide();
//    $('.dialog-overlay').hide();
//  });

$(function () {
  if($("input[name=variant_id][type=radio]").length)
  {
    $("input[name=variant_id][type=radio]").each(function(i, item){if(item.checked){item.click();}});
  }

  $('.dialog-overlay').on('click', function() {
    $('.dialog').hide();
    $('.dialog-overlay').hide();
  });

  $('.close-dialog-button').on('click', function() {
    $('.dialog').hide();
    $('.dialog-overlay').hide();
  });

  $('a[data-type=json]').on('click', function() {
    $('.dialog-overlay').show();
//    $('.dialog-overlay').off('click');
  });
  //$('a[data-type=json]').on('ajax:error', function(e, data, status, xhr) {//Error});

  var addtocart = function(e, data, status, xhr) {
    if(data.error)
    {
      $('.dialog').hide();
      $('.dialog-overlay').hide();
      flashError(data.error);
    }
    else
    {
      $('#dialog_image').html(data.image);
      $('#dialog_name').text(data.name);
      $('#dialog_original_price').html(data.original_price);
      $('#dialog_price').html(data.price);
//Show/View Cart


//You Might Also Like

//In cart
//Add to Cart
//Item in Cart

//Previously Purchased
//      $('div#ajax_cart_flash').html(dialog_html);
      $('.dialog-overlay').show();
      $('#ajax_cart_flash').show();
      $('#ajax_choose_flash').hide();
      //$('.dialog').show();
//      $('.dialog-overlay').on('click', hide_dialog);
      Spree.fetch_cart();
    }
  };

  $('a[data-type=json].choose-link').on('ajax:success', function(e, data, status, xhr) {
    if(data.error)
    {
      $('.dialog').hide();
      $('.dialog-overlay').hide();
      flashError(data.error);
    }
    else
    {
      $('#product_choices').empty();
      $.each(data.variants, function(index, v){
        $('#product_choices')
          .append($(document.createElement("LI"))
            .append($(document.createElement("SPAN")).append($(v.image)).append($(v.link)
              .append($(document.createElement("SPAN")).addClass("selling").css("float","right").html(v.price))
            )
          )
        );
//.attr("itemprop", "price")
//v.id
//v.name
      });
      $('a[data-type=json].product-option-link').on('ajax:success', addtocart)
      $('.dialog-overlay').show();
      $('#ajax_choose_flash').show();
    }
  });

  $('a[data-type=json].addtocart-link').on('ajax:success', addtocart);
});
