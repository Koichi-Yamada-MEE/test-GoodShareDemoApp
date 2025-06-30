//ハンバーガーメニュー
$(function(){
  const $trigger = $('.menu_ico');
  const $closeMenu = $('.menu_close');
  const $menu_block = $('#menu_block');
  const point_header = window.matchMedia('screen and (min-width: 768px)');
  $trigger.on('click',function(){
    const expanded = $trigger.attr('aria-expanded');
    if(expanded == 'false'){
      $(this).attr('aria-expanded', true);
      MicroModal.show('menu_block',{
        // disableScroll: true,
        awaitOpenAnimation: true,
      });
    }else{
      $(this).attr('aria-expanded', false);
      MicroModal.close('menu_block',{
        awaitCloseAnimation: true,
      });
    }
  });
  $($closeMenu).on('click',function(){
    $trigger.attr('aria-expanded', false);
    MicroModal.close('menu_block',{
      awaitCloseAnimation: true,
    });
  });

  //ブレイクポイントをまたいだときの挙動
  function checkBreakPoint() {
    if (point_header.matches) {
      $menu_block.removeAttr('aria-hidden').removeClass("is-open");
      // console.log("PC");
    }else {
      $trigger.attr('aria-expanded',false);
      $menu_block.attr('aria-hidden',true);
      // console.log("SP");
    }
  }
  point_header.addListener(checkBreakPoint);
});

//ヘッダー固定
$(function(){
  const headerH = 55;
  const $gnav = $('.l_header_meamor');
  const $body = $('body');
  const point_header = window.matchMedia('screen and (min-width: 768px)');
  function fixedHeader() {
    let scroll = $(window).scrollTop();
    let w = $(window).innerWidth();
    if (scroll >= headerH){
      $body.addClass('is_header_fixed');
        if(w < 768) {
          $gnav.css('height','calc(100vh - 50px)');
        }else {
          $gnav.removeAttr('style');
        }
      }else{
        $body.removeClass('is_header_fixed');
        $gnav.removeAttr('style');
        if(w < 768) {
          $gnav.css('height','calc(100vh - 104px)');
        }else {
          $gnav.removeAttr('style');
        }
      }
  }
  function fixHeaderSp() {
    let scroll = $(window).scrollTop();
    let w = $(window).innerWidth();
    if (scroll >= headerH){
        $body.addClass('is_header_fixed');
        $gnav.css('height','calc(100vh - 50px)');
      }else{
        $body.removeClass('is_header_fixed');
        $gnav.css('height','calc(100vh - 104px)');
      }
  }
  function fixHeaderPc() {
    let scroll = $(window).scrollTop();
    let w = $(window).innerWidth();
    if (scroll >= headerH){
        $body.addClass('is_header_fixed');
        $gnav.removeAttr('style');
      }else{
        $body.removeClass('is_header_fixed');
        $gnav.removeAttr('style');
      }
  }
  function checkBreakPointHeader() {
    if (point_header.matches) {
      fixHeaderPc();
    }else {
      fixHeaderSp();
    }
  }

  $(window).scroll(function () {
    fixedHeader();
  });
  point_header.addListener(checkBreakPointHeader);
});

// faq
$(function(){
  if($('.qa').length) {
    $('.qa._open .answer').show();
    $('.qa').on('click', function(){
      $(this).toggleClass('_open');
      $(this).children('.answer').slideToggle(300);
    });
  }
});

// guide under
$(function(){
  $('#meamor-guide-under .step_content').each(function(index){
    $(this).on('inview', function(event, isInView) {
      var current_item = $('#meamor-guide-under .current_nav .item').eq(index);
      if (isInView) {
        current_item.addClass('_current');
      } else {
        if(current_item.hasClass('_current')) {
          current_item.removeClass('_current');
        }
      }
    });
  });
});



$(document).ready(function () {
  // タイトルの文字数が50文字を超えたら、省略記号「...」で表示
  $('.accordion-title').each(function () {
    var titleText = $(this).data('full-title');
    if (titleText.length > 50) {
      var truncatedText = titleText.substring(0, 50) + '...';
      $(this).text(truncatedText);
    } else {
      $(this).text(titleText);
    }
  });

  $('.accordion-title').on('click', function () {
    var fullTitle = $(this).data('full-title');
    var truncatedText = fullTitle.substring(0, 50) + '...';

    if ($(this).hasClass('active')) {
      $(this).text(truncatedText);
    } else {
      $(this).text(fullTitle);
    }

    $(this).toggleClass('active');
    $(this).next('.accordion-content').slideToggle();
  });
});