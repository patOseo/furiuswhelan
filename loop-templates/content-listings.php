<?php
/**
 * Partial template for listings
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$mls = get_field('mls_number');
$price = get_field('price');
$image = get_field('image');
$link = get_field('listing_link');
?>

<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

	<div class="row">
		<div class="col-4">
			<?php echo wp_get_attachment_image($image, 'full'); ?>
		</div>

		<div class="col-8">
			<?php the_title( '<h1 class="entry-title h2 mb-3">', '</h1>' ); ?>
			<?php if($mls): ?><div class="h5"><strong>MLS #:</strong> <?= $mls; ?></div><?php endif; ?>
			<?php if($price): ?><div class="price h5 text-primary mb-5">CI$ <?= $price; ?></div><?php endif; ?>
			<?php if($link): ?><a href="<?= $link; ?>" class="btn btn-md btn-secondary" target="_blank" rel="noopener,noreferrer">More Info</a><?php endif; ?>
		</div>
	</div>

	<div class="entry-content">

		<?php
		the_content();
		?>

	</div><!-- .entry-content -->

</article><!-- #post-## -->
