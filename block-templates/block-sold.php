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
		<div class="row align-items-center justify-content-center">
			<?php while(have_rows('sold_listings', 'option')): the_row(); ?>
	
				<?php $image = get_sub_field('sold_image');  ?>
				<div class="col-md-6">
					<div class="sold-listing mb-5 text-center"><?php echo wp_get_attachment_image($image, 'full'); ?></div>
				</div>
	
			<?php endwhile; ?>
		</div>
	</div>
</div>


<?php endif;