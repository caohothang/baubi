<div class="text-slider content right slider-home">
    <ul>
        <?php foreach($articles as $article) : ?>
        <li class="dis-block slide">
          <div class="images-article">
            <img src="<?=$article->getImageUrl()?>" alt="<?=$article->getImageUrl()?>">
          </div>
          <div class="content-article">
            <p class="title"><a href="<?=$article->getUrlDetail()?>"><?=$article->title?></a></p>
            <div class="des"><?=StringHelper::truncate($article->description, 30)?></div>
            <a href="<?=$article->getUrlDetail()?>"> <img src="<?php echo www() ?>images/view-video-icon.png" alt=""><span>Xem thêm</span></a>
            <div class="clear"></div>
          </div>
          <div class="clear"></div>
        </li>
        <?php endforeach ?>
    </ul>
    <div class="control right">
        <span id="prev" class="prev run"><i class="fa fa-angle-left"></i></span>
        <span id="next" class="next run"><i class="fa fa-angle-right"></i></span>
    </div>
</div>
<script>
    $(document).ready(function(){
        $('.slider-home').simpleSliderText({
          height:480
        });
    });
</script>