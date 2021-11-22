<?php

if(have_rows('reviews')): ?>

<div class="reviews">
	<div class="container">
		<div class="row">
			<div class="col-12 text-center">
				<h2 class="mb-5 text-primary h1"><?php the_field('review_heading'); ?></h2>
			</div>
		</div>
		<div class="row">
			<?php while(have_rows('reviews')): the_row(); ?>
				<?php
					$count = count(get_sub_field('review'));
					$review = get_sub_field('review');
					$name = get_sub_field('name');
				?>
				<div class="<?php if($count == 1) { echo "col-12"; } else { echo "col-sm-6"; } ?> text-center">
					<div class="review">
						<?= $review; ?>
					</div>
					<p class="review-name mb-4">
						<?= $name; ?>
					</p>
				</div>
			<?php endwhile; ?>
		</div>
	</div>
</div>


<?php endif; 