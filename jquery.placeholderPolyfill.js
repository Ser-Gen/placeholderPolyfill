/*!
 * placeHolder polyfill 1.0
 * https://github.com/Ser-Gen/placeholderPolyfill
 * ��������� ������������� � ������ ���������
 * jQuery >1.7
 * MIT licensed
 *
 * ������ ������� ���������� (@Ser_Gen)
 */
(function($) {

    // ��������������� ��������
    function restoreVal ( elem ) {
      var val = elem.attr( 'placeholder' );
      if ( elem.val() === val ) {
        elem.css( 'color', '#a9a9a9' );
      } else if ( elem.val().replace( /\s+/, '' ) === '' ) {
        elem.val(val);
        if ( elem.attr('type') == 'password' ) {
          try {
            $(elem).attr( 'data-placeholderType', 'password' ).get(0).type = 'text';
          } catch (e) {}
        }
        elem.css( 'color', '#a9a9a9' );
      }
    }

    // ������������� ��������� �������
    function resetCursor ( elem ) {
      if ( elem.val() == elem.attr( 'placeholder' ) ) {
        elem = elem[0];
        if ( elem.setSelectionRange ) {
          elem.focus();
          elem.setSelectionRange( 0, 0 );
        } else if ( elem.createTextRange ) {
          var range = elem.createTextRange();
          range.move( 'character', 0 );
          range.select();
        }
      }
    }

    // ��������� ��������� ��� ����� ������
    function preventDel ( elem ) {
      var val = elem.attr( 'placeholder' );
      if ( elem.val() === val ) {
        resetCursor( elem );
      }
      var waitKey = true;
      elem.keydown(function () {
        if ( waitKey && ( elem.val() === elem.attr( 'placeholder' ) ) ) {
          if ( elem.attr( 'data-placeholderType' ) == 'password' ) {
            try {
              $(elem).get(0).type = 'password';
            } catch (e) {}
          }
          elem.val('');
          elem.css( 'color', '' );
          waitKey = false;
        }
        setTimeout(function () {
          if (!waitKey && ( elem.val().length === 0) ) {
            restoreVal( elem );
            resetCursor( elem );
            waitKey = true;
          }
        }, 0);
      });
    }

    // ��� �������� ������ ��������
    function submitting ( elem ) {
      var val = elem.attr( 'placeholder' );
      if ( elem.val() === val ) {
        elem.val('');
      }
    }

    // ���������� �����������
    function inputProcessor ( elem ) {
      restoreVal( elem );
      elem.on( 'focus', function () { preventDel(elem); } );
      elem.on( 'blur', function () { restoreVal(elem); } );
      elem.on( 'click', function () { resetCursor(elem); } );
      $(elem).parents('form').on( 'submit', function () { submitting(elem); } );
      $(elem).on('paste', function () {
        elem.val(' ');
        elem.select();
        elem.css( 'color','' );
      });
      $(elem).on('cut', function () {
        setTimeout(function () { restoreVal(elem); }, 0);
      });
    }

    // ���������, �������������� �� ������������ ���������
    $(document).ready(function () {
      if ( typeof document.createElement( "input" ).placeholder === "undefined" ) {
        $( 'input' ).each( function () {
          inputProcessor( $(this) );
        });
      }
      if ( typeof document.createElement( "textarea" ).placeholder === "undefined" ) {
        $( 'textarea' ).each( function () {
          inputProcessor( $(this) );
        });
      }
    });
    
})(jQuery);
