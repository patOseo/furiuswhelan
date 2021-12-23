<?php

$args = array(

	'post_type' 		=> 'listings',
	'orderby' 			=> 'date',
	'order' 			=> 'DESC',
	'posts_per_page' 	=> -1,
	'meta_query' 		=> array(
								array(
									'key' => 'featured',
									'value' => '1',
									'compare' => '='
								),
								array(
									'key' => 'status',
									'value' => 'active',
									'compare' => '='
								)
						   ),
	'post_status' 		=> 'publish'

);

$listings = new WP_Query($args);

?>



<div class="listings">

	<div class="container-fluid px-5">
		<div class="row">
			<div class="col-12 text-center">
				<h2 class="mb-5 text-primary"><?php the_field('featured_listings_heading'); ?></h2>
			</div>
		</div>
		<div class="row justify-content-center">
			<?php if($listings->have_posts()): ?>
				<?php while($listings->have_posts()): $listings->the_post(); ?>
					<?php 
						$images = explode(', ', get_field('images', get_the_ID()));
						$district = get_field('district', get_the_ID());
						$propertytype = get_field('property_type', get_the_ID());
						$mls = get_field('mls', get_the_ID());
					?>
					<div class="col-sm-6 col-md-4 col-xl-3 mb-3">
						<div class="card h-100 listing-card">
							<div class="card-img-top">
								<img src="<?= $images[0]; ?>" alt="<?php the_title(); ?>">
							</div>
							<div class="card-body">
								<small class="mb-3 d-block"><?php if($propertytype) { echo $propertytype; } if($district && $propertytype) { echo " | "; } if($district) { echo $district; } else { "Cayman Islands"; } if($mls) { ?><span class="float-right">MLS# <?= $mls; ?></span><?php } ?></small>
								<h2 class="h5"><a href="<?php the_permalink(); ?>" class="stretched-link"><?php the_title(); ?></a></h2>
								<p><strong><?php the_field('currency', get_the_ID()); echo number_format(get_field('price', get_the_ID())); ?></strong></p>
							</div>
						</div>
					</div>

				<?php endwhile; ?>

			<?php else: ?>
			
				<p>My featured listings are currently being updated - Why not check out all of ReMax Cayman Islands listings?</p>
			<?php endif; wp_reset_postdata(); ?>
		</div>
	</div>

</div>

