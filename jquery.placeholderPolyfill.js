/*
 * PlaceHolder Polyfill
 * из-за метода .on() требуется jQuery >1.7
 *
 * Показывает текстовые заглушки в браузерах, не поддерживающих их (ИЕ<10, ФФ<4, О<11); не исполняется в поддерживающих
 *
 * параметры:
 * color — цвет плейсхолдера
 *
 * вызов: 
 * $(селектор).placeholderPolyfill();
 *
 * 09.11.2012
 */

(function($) {
  var defaults = {
        color : '#a9a9a9'
      },
      options;
   
  $.fn.placeholderPolyfill = function (params) {

    options = $.extend ({}, defaults, options, params);

    function restoreVal (elem) {
      var val = elem.attr('placeholder');
      if (elem.val() === val) {
        elem.css('color', options.color);
      } else if (elem.val().replace(/\s+/, '') === '') {
        elem.val(val);
        elem.css('color', options.color);
      }
    }

    function resetCursor (elem) {
      if (elem.val() == elem.attr('placeholder')) {
        elem = elem[0];
        if (elem.setSelectionRange) {
          elem.focus();
          elem.setSelectionRange(0, 0);
        } else if (elem.createTextRange) {
          var range = elem.createTextRange();
          range.move('character', 0);
          range.select();
        }
      }
    }

    function preventDel (elem) {
      var val = elem.attr('placeholder');
      if (elem.val() === val) {
        resetCursor(elem);
      }
      var waitKey = true;
      elem.keydown(function () {
        if ((waitKey) && (elem.val() === elem.attr('placeholder'))) {
          elem.val('');
          elem.css('color','');
          waitKey = false;
        }
        setTimeout(function () {
          if (!(waitKey) && (elem.val().length === 0)) {
            restoreVal(elem);
            resetCursor(elem);
            waitKey = true;
          }
        }, 0);
      });
    }

    function inputProcessor (elem) {
      restoreVal(elem);
      elem.focus(function () { preventDel(elem); });
      elem.blur(function () { restoreVal(elem); });
      elem.click(function () { resetCursor(elem); });
      $(elem).on('paste', function () {
        elem.val(' ');
        elem.select();
        elem.css('color','');
      });
      $(elem).on('cut', function () {
        setTimeout(function () { restoreVal(elem); }, 0);
      });
    }

    // проверяем, поддерживаются ли плейсхолдеры браузером?
    var placeholderTestInput = document.createElement("input"),
        placeholderTestTextarea = document.createElement("textarea");
    if (typeof placeholderTestInput.placeholder === "undefined") {
      $(this).each(function () {
        if ($(this).is('input')) {
          inputProcessor($(this));
        };
      });
    }
    if (typeof placeholderTestTextarea.placeholder === "undefined") {
      $(this).each(function () {
        if ($(this).is('textarea')) {
          inputProcessor($(this));
        }
      });
    }

    return this;
    
  };
})(jQuery);