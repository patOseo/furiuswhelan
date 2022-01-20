<?php

if(get_field('show_all') == TRUE) {
	$num_posts = -1;
} else {
	$num_posts = 4;
}

$args = array(

	'post_type' 		=> 'listings',
	'orderby' 			=> 'date',
	'order' 			=> 'DESC',
	'posts_per_page' 	=> -1,
	'meta_query' 		=> array(
								array(
									'key' => 'status',
									'value' => 'sold',
									'compare' => '='
								)
						   ),
	'post_status' 		=> 'publish',
	'posts_per_page'	=> $num_posts

);

$listings = new WP_Query($args);

?>



<div class="listings">

	<div class="container">
		<div class="row">
			<div class="col-12 text-center">
				<h2 class="mb-5 text-primary"><?php the_field('heading'); ?></h2>
			</div>
		</div>
		<div class="row justify-content-center">
			<?php if($listings->have_posts()): ?>
				<?php while($listings->have_posts()): $listings->the_post(); ?>
					<?php
						$sold_image = get_field('sold_image', get_the_ID());
						$images = explode(', ', get_field('images', get_the_ID()));
						$price = get_field('price', get_the_ID());
						$currency = get_field('currency', get_the_ID());
					?>
					<div class="col-sm-6 col-md-4 col-xl-3 mb-3">
						<div class="card h-100 listing-card">
							<div class="card-img-top">
								<img src="<?php if(isset($sold_image) && $sold_image) { echo $sold_image; } else { echo $images[0]; } ?>" alt="<?php the_title(); ?>">
							</div>
							<div class="card-body">
								<h6 class="h4 mb-3 d-block">SOLD!</h6><hr>
								<p><?php if($price): echo $currency . number_format($price); endif; ?></p>
								<h2 class="h5"><?php the_title(); ?></h2>
								
							</div>
						</div>
					</div>

				<?php endwhile; ?>

			<?php else: ?>
			
				<p>There are currently no listings to show.</p>
			<?php endif; wp_reset_postdata(); ?>
		</div>
	</div>

</div>

