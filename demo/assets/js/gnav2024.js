$(function(){
  // kuratoku nav select
  if($('#gnav2024').hasClass('is_kuratoku')) {
    const path_name = $(location).attr('pathname');
    const dir_name = path_name.split('/');
    const search_href = '/' + dir_name[1] + '/';
    let href_val;
    let target_item;
    let kuratoku_flg = true;
    let img_path;
    let current_img_path;

    // パスが/food/, /nosh/, /oisix/のいずれかの場合にfoodリンクをターゲットとする
    const food_target_paths = ['/food/', '/nosh/', '/oisix/'];

    // パスが/contents/, /column/, /professional/, /warranty/のいずれかの場合にcontentsリンクをターゲットとする
    const contents_target_paths = ['/contents/', '/column/', '/professional/'];

    // パスが/warranty/の場合にwarrantyリンクをターゲットとする
    const warranty_target_paths = ['/warranty/'];

    $('.navlist_layer1__item').each(function(index) {
      href_val = $(this).find('.navlist_layer1__link').attr('href');
      if(food_target_paths.includes(search_href)) {
        target_item = $('.navlist_layer1__item.nav_color4'); // foodリンクに設定されたクラス
        kuratoku_flg = false;
        return false;
      }
      if(contents_target_paths.includes(search_href)) {
        target_item = $('.navlist_layer1__item.nav_color8'); // contentsリンクに設定されたクラス
        kuratoku_flg = false;
        return false;
      }
      if(warranty_target_paths.includes(search_href)) {
        target_item = $('.navlist_layer1__item.nav_color7'); // warrantyリンクに設定されたクラス
        kuratoku_flg = false;
        return false;
      }
    });

    if(kuratoku_flg) {
      target_item = $('.navlist_layer1__item').eq(0);
    }

    img_path = target_item.find('img').attr('src');
    current_img_path = img_path.replace('.svg', '_current.svg');
    target_item.find('img').attr('src', current_img_path);

    target_item.addClass('is_current');
  }

  // nav fix
  const $body = $('body');
  function fixGnav() {
    let common_header_height = 0;
    let scroll = $(window).scrollTop();

    if($('.global-header').length) {
      common_header_height =  $('.global-header').height();
    }

    if (scroll >= common_header_height){
      $body.addClass('is_gnav_fixed');
    }else{
      $body.removeClass('is_gnav_fixed');
    }
  }
  
  $(window).scroll(function () {
    fixGnav();
  });

  // gnav2024 check
  if($('#gnav2024').length) {
    $('body').addClass('is_gnav2024');
  }

  // layer2 check
  if($('.navlist_layer2').length) {
    $('body').addClass('is_layer2');
  }

  // layer3 switch
  if($('.navlist_layer2__switch').length) {
    let layer3_pos = $('#gnav2024').height();
    $('.navlist_layer2__switch').on('click', function(){
      $(this).toggleClass('is_active');
      $('.navlist_layer3').css('top', layer3_pos+'px');
      $('.navlist_layer3').fadeToggle(300);
    });
  }
});
