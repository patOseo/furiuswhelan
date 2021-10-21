<?php
/**
 * Single post partial template
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;
?>

<small class="mb-0"><a href="/" rel="home">Home</a> » <a href="/latest-updates/">Latest Updates</a> » <?php the_title(); ?></small>

<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

	<header class="entry-header">

		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

		<div class="entry-meta mb-3">

			<?php the_date('F j, Y'); ?>

		</div><!-- .entry-meta -->

	</header><!-- .entry-header -->

	<div class="featured-img mb-3">
		<?php echo get_the_post_thumbnail( $post->ID, 'large' ); ?>
			
		</div>

	<div class="entry-content">

		<?php
		the_content();
		understrap_link_pages();
		?>

	</div><!-- .entry-content -->

	<footer class="entry-footer">

		<?php understrap_entry_footer(); ?>

	</footer><!-- .entry-footer -->

</article><!-- #post-## -->
