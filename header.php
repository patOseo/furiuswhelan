<?php
/**
 * The header for our theme
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$container = get_theme_mod( 'understrap_container_type' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5V3FZC7');</script>
<!-- End Google Tag Manager -->
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-207287623-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-207287623-1');
</script>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?> <?php understrap_body_attributes(); ?>>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5V3FZC7"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<?php do_action( 'wp_body_open' ); ?>
<div class="site" id="page">

	<?php if(is_page('new-home')): ?>
		<div class="home-hero-section">
			<div class="container-fluid h-100">
				<div class="row h-100 align-items-center text-primary">
					<div class="col-12 text-center">
						<img class="mb-4 mx-auto d-block" src="/wp-content/themes/furiuswhelan/images/FW-logo.png" alt="Furius Whelan" width="300" height="300">
						<img class="mb-2 mx-auto d-block rounded-circle border border-secondary" src="/wp-content/themes/furiuswhelan/images/furius-whelan-circle.jpg" alt="Furius Whelan" width="160" height="160">
						<h1 class="mb-5 text-center text-royalblue w-100"><?php the_field('tagline', 'option'); ?></h1>
						<div class="row px-5 justify-content-center">
							<div class="col-lg-10">	
								<?php get_template_part('global-templates/listings-form'); ?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	<?php else: ?>
		<div class="hero-section pt-2">
		<div class="container">
			<div class="row align-items-center text-primary">
				<div class="col-3 col-sm-2">
					<?php $headerimg = get_field('image', 'option'); ?>
					<a href="/" rel="home"><?php echo wp_get_attachment_image($headerimg, 'full'); ?></a>
				</div>
				<div class="col-9 col-sm-8">
					<p class="mb-0 h1 text-center"><?php the_field('tagline', 'option'); ?></p>
				</div>
			</div>
		</div>
	</div>
	<?php endif; ?>
	

	<!-- ******************* The Navbar Area ******************* -->
	<div id="wrapper-navbar" class="sticky-top">

		<a class="skip-link sr-only sr-only-focusable" href="#content"><?php esc_html_e( 'Skip to content', 'understrap' ); ?></a>

		<nav id="main-nav" class="navbar navbar-expand-xl navbar-dark" aria-labelledby="main-nav-label">

			<h2 id="main-nav-label" class="sr-only">
				<?php esc_html_e( 'Main Navigation', 'understrap' ); ?>
			</h2>

			<div class="container">

					<p class="mb-0 navbar-brand"><a href="mailto:furius.whelan@remax.ky">furius.whelan@remax.ky</a></p>

				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle navigation', 'understrap' ); ?>">
					<span class="navbar-toggler-icon"></span>
				</button>

				<!-- The WordPress Menu goes here -->
				<?php
				wp_nav_menu(
					array(
						'theme_location'  => 'primary',
						'container_class' => 'collapse navbar-collapse',
						'container_id'    => 'navbarNavDropdown',
						'menu_class'      => 'navbar-nav ml-auto align-items-center',
						'fallback_cb'     => '',
						'menu_id'         => 'main-menu',
						'depth'           => 2,
						'walker'          => new Understrap_WP_Bootstrap_Navwalker(),
					)
				);
				?>

			</div><!-- .container -->

		</nav><!-- .site-navigation -->

	</div><!-- #wrapper-navbar end -->
