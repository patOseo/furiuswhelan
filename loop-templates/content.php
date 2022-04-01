<?php
/**
 * Post rendering content according to caller of get_template_part
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;
?>

<article class="card" id="post-<?php the_ID(); ?>">

	<div class="row align-items-center">
			<div class="col-5">
				<?php echo get_the_post_thumbnail( $post->ID, 'blogthumb' ); ?>
			</div>
		
			<div class="col-7">
				<?php if ( 'post' === get_post_type() ) : ?>
		
					<div class="entry-meta">
		
						<?php the_date('F j, Y'); ?>
		
					</div><!-- .entry-meta -->
		
				<?php endif; ?>
				<a href="<?php the_permalink(); ?>" class="stretched-link"><h2><?php the_title(); ?></h2></a>
			</div>
	</div>

</article><!-- #post-## -->
