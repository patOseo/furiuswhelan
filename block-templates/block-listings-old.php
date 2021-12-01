<?php

if(get_field('show_all') == TRUE) {
	$num_posts = -1;
} else {
	$num_posts = 4;
}

if(get_field('type') == 'residential' || get_field('type') == 'commercial') {
	$type = get_field('type');
} else {
	$type = array('residential', 'commercial');
}

if(get_field('listing_status') == 'sale' || get_field('listing_status') == 'under_contract') {
	$status = get_field('listing_status');
} else {
	$status = array('sale', 'under_contract');
}


$args = array(

	'post_type' 		=> 'listings',
	'orderby' 			=> 'date',
	'order' 			=> 'DESC',
	'posts_per_page' 	=> $num_posts,
	'meta_query' 		=> array(
								array(
									'key' 			=> 'status',
									'value' 		=> $status,
									'compare' 		=> 'IN'
								),
								array(
									'key' => 'type',
									'value' => $type,
									'compare' => 'IN'
								)
						   ),
	'post_status' 		=> 'publish'

);

$listings = new WP_Query($args);

$i = 1;

?>



<div class="listings">

	<div class="container-fluid px-5">
		<div class="row">
			<div class="col-12 text-center">
				<h2 class="mb-5 text-primary"><?php the_field('listings_heading'); ?></h2>
			</div>
		</div>
		<div class="row justify-content-center">
			<?php if($listings->have_posts()): ?>
				<?php while($listings->have_posts()): $listings->the_post(); ?>
					<?php  
						$listing_id = get_the_ID();
						$mls = get_field('mls_number', $listing_id);
						$price = get_field('price', $listing_id);
						$image = get_field('image', $listing_id);
						$link = get_field('listing_link', $listing_id);
						if($i % 2 == 0) { $even = true; } else { $even = false; }
					?>
					<div class="col-12 col-sm-6">
						<div class="listing mb-5">
							<div class="row align-items-center">
								<div class="col-xl-6 <?php if($even == TRUE) { echo 'order-xl-2'; } ?>">
									<?php if($link) { ?><a href="<?php echo $link; ?>" target="_blank" rel="noopener,noreferrer"><?php } echo wp_get_attachment_image($image, 'full'); if($link) { ?></a><?php } ?>
								</div>
								<div class="col-xl-6 <?php if($even == TRUE) { echo 'order-xl-1 text-xl-right'; } ?>">
									<div class="text-uppercase">
										<?php if($link) { ?><a href="<?= $link; ?>" class="stretched-link" target="_blank" rel="noopener,noreferrer"><?php } ?><h3 class="h4 my-3"><?php the_title(); ?></h3><?php if($link) { ?></a><?php } ?>
										<?php if($mls) { ?><p class="h4 mb-3">MLS# <?= $mls; ?></p><?php } ?>
										<?php if($price) { ?><p class="h4 mb-3 text-primary">CI$ <?= $price; ?></p><?php } ?>
									</div>
								</div>
							</div>
						</div>
					</div>
				<?php $i++; endwhile; ?>
			<?php else: ?>
				<p>There are currently no listings to show.</p>
			<?php endif; ?>
		</div>
	</div>

</div>

