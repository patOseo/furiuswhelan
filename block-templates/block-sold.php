<?php

$columns = get_field('columns');
$heading = get_field('heading');




if(have_rows('sold_listings', 'option')): ?>



<div class="sold-listings py-5">
	<div class="container">
		<div class="row">
			<div class="col-12 text-center">
				<h2 class="mb-5 text-primary h1"><?php the_field('heading'); ?></h2>
			</div>
		</div>
		<div class="row justify-content-center">
			<?php while(have_rows('sold_listings', 'option')): the_row(); ?>
	
				<div class="col-sm-6 col-md-4 col-xl-3 mb-3">
					<div class="card h-100 listing-card">
						<div class="card-img-top">
							<?php echo wp_get_attachment_image(get_sub_field('sold_image'), 'medium'); ?>
						</div>
						<div class="card-body">
							<h6 class="mb-3 d-block">SOLD!</h6><hr>
							<h2 class="h5"><?php the_sub_field('title'); ?></h2>
							<p><strong><?php the_sub_field('price'); ?></strong></p>
						</div>
					</div>
				</div>
	
			<?php endwhile; ?>
		</div>
	</div>
</div>


<?php endif;