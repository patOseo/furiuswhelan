<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
$address = get_field('address', 'option');
$cell = get_field('cell_number', 'option');
$office = get_field('office_number', 'option');
$email = get_field('email', 'option');
?>

<?php get_template_part( 'sidebar-templates/sidebar', 'footerfull' ); ?>

<div class="wrapper" id="wrapper-footer">

	<div class="<?php echo esc_attr( $container ); ?>">

		<div class="row">
			<div class="col-12">
				<p class="mb-4 text-center h3">Furius Whelan RE/MAX Cayman Islands</p>
			</div>
		</div>

		<div class="row justify-content-center">

			<div class="col-4">
				<div class="newsletter text-center mb-5">
					<?php echo do_shortcode('[gravityform id="1" title="true" description="false"]'); ?>
				</div>
			</div>

			<div class="col-md-12">

				<footer class="site-footer" id="colophon">

					<div class="site-info">

						<?php if($email): ?>
							<p class="mb-2"><a href="mailto:<?= $email; ?>"><?= $email; ?></a></p>
						<?php endif; ?>

						<p class="mb-2">
						<?php if($cell): ?>
							<a href="tel:<?= $cell; ?>"><?= $cell; ?></a> c.
						<?php endif; ?>
						<?php if($office): ?>
							<a href="tel:<?= $office; ?>"><?= $office; ?></a> o.
						<?php endif; ?>
						</p>

						<?php if($address): ?>
							<p class="mb-2"><?= $address; ?></p>
						<?php endif; ?>
						<br>
						<p class="mb-1">© <?php echo date('Y'); ?> by Furius Whelan.</p>
						<?php if(get_field('footer_text', 'option')): ?>
							<?php the_field('footer_text', 'option'); ?>
						<?php endif; ?>

					</div><!-- .site-info -->

				</footer><!-- #colophon -->

			</div><!--col end -->

		</div><!-- row end -->

	</div><!-- container end -->

</div><!-- wrapper end -->

</div><!-- #page we need this extra closing tag here -->

<?php wp_footer(); ?>

</body>

</html>

