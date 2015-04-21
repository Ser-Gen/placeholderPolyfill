/*!
 * placeHolder polyfill 1.1
 * https://github.com/Ser-Gen/placeholderPolyfill
 * Поддержка плейсхолдеров в старых браузерах
 * jQuery >1.7
 * MIT licensed
 *
 * Создан Сергеем Васильевым (@Ser_Gen)
 */
(function($) {

  // проверяем, поддерживаются ли плейсхолдеры браузером
  var HAS_INPUT_PLACEHOLDER = typeof document.createElement("input").placeholder === "undefined";
  var HAS_TEXTAREA_PLACEHOLDER = typeof document.createElement("textarea").placeholder === "undefined";

  // восстанавливаем значение
  function restoreVal ( elem ) {
    var val = elem.attr('placeholder');
    if (elem.val() === val) {
      elem.css('color', '#a9a9a9');
    } else if (elem.val().replace(/\s+/, '') === '') {
      elem.val(val);
      if (elem.attr('type') == 'password') {
        try {
          $(elem).attr('data-placeholderType', 'password').get(0).type = 'text';
        } catch (e) {};
      };
      elem.css('color', '#a9a9a9');
    };
  };

  // устанавливаем положение курсора
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
      };
    };
  };

  // проверяем состояние при вводе текста
  function preventDel (elem) {
    var val = elem.attr('placeholder');
    if (elem.val() === val) {
      resetCursor(elem);
    };
    var waitKey = true;
    elem.keydown(function () {
      if (waitKey && (elem.val() === elem.attr('placeholder'))) {
        if (elem.attr('data-placeholderType') == 'password') {
          try {
            $(elem).get(0).type = 'password';
          } catch (e) {};
        };
        elem.val('');
        elem.css('color', '');
        waitKey = false;
      }
      setTimeout(function () {
        if (!waitKey && (elem.val().length === 0)) {
          restoreVal(elem);
          resetCursor(elem);
          waitKey = true;
        };
      }, 0);
    });
  };

  // при отправке данных обнуляем
  function submitting (elem) {
    var val = elem.attr('placeholder');
    if (elem.val() === val) {
      elem.val('');
    };
  };

  // навешиваем обработчики
  function inputProcessor (elem) {

    // должно срабатывать только один раз
    if (elem.data('isPlaceholderPolyfillInit')) { return false; };
    elem.data('isPlaceholderPolyfillInit', true);

    restoreVal(elem);
    elem.on('focus.placeholderPolyfill', function () { preventDel(elem); });
    elem.on('blur.placeholderPolyfill', function () { restoreVal(elem); });
    elem.on('click.placeholderPolyfill', function () { resetCursor(elem); });
    $(elem).parents('form').on('submit.placeholderPolyfill', function () { submitting(elem); });
    $(elem).on('paste.placeholderPolyfill', function () {
      elem.val(' ');
      elem.select();
      elem.css('color', '');
    });
    $(elem).on('cut.placeholderPolyfill', function () {
      setTimeout(function () { restoreVal(elem); }, 0);
    });
  };

  $(document).ready(function () {
    $.placeholderPolyfillInit();
  });

  $.placeholderPolyfillInit = function () {
    if (HAS_INPUT_PLACEHOLDER) {
      $('input').each(function () {
        inputProcessor($(this));
      });
    };
    if (HAS_TEXTAREA_PLACEHOLDER) {
      $('textarea').each( function () {
        inputProcessor($(this));
      });
    };
  };
    
})(jQuery);
