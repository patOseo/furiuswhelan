<?php

$poststoshow = get_field('posts_to_show');

$args = array(
	'post_type' 		=> 'post',
	'status' 			=> 'publish',
	'posts_per_page' 	=> $poststoshow,
	'order' 			=> 'DESC'
);

$query = new WP_Query($args);

if($query->have_posts()):

	while($query->have_posts()): $query->the_post();

		get_template_part('loop-templates/content');

	endwhile;

endif;

?>