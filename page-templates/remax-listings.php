<?php
/**
 * Template Name: Remax Listings Page
 *
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
$container = get_theme_mod( 'understrap_container_type' );

//Protect against arbitrary paged values
$paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;

// Setting Up the Main Query arguments
$args = array(
	'post_type' 		=> array('properties', 'listings'),
	'status'			=> 'publish',
	'posts_per_page'	=> 12,
	'paged' 			=> $paged,
	'meta_query'		=> array(
		array(
			'key' => 'status',
			'value' => 'active',
			'compare' => '='
		)
	)
);

// Checking the $_GET values from search
if(isset($_GET['district'])) {
	$get_district = $_GET['district'];
}
if(isset($_GET['proptype'])) {
	$get_proptype = $_GET['proptype'];
}
if(isset($_GET['beds'])) {
	$get_beds = $_GET['beds'];
}
if(isset($_GET['views'])) {
	$get_views = $_GET['views'];
}
if(isset($_GET['price'])) {
	$get_price = $_GET['price'];
}
if(isset($_GET['propsearch'])) {
	$get_propsearch = $_GET['propsearch'];
}

// Update the $args with GET values
if( ( isset($get_district) && $get_district )
	|| ( isset($get_proptype) && $get_proptype )
	|| ( isset($get_beds) && $get_beds )
	|| ( isset($get_views) && $get_views )
	|| ( isset($get_price) && $get_price )
	|| ( isset($get_propsearch) && $get_propsearch )
	) {
	$args['meta_query'] = array( 'relation'=>'AND' );
}
		
if(isset($get_district) && $get_district) {

	$compare = 'IN';

	if($get_district == "East End") {
		$the_district = array("Colliers", "East Inland", "High Rock", "East End");
	} elseif($get_district == "The Sister Islands") {
		$the_district = array("Cayman Brac Centr", "Cayman Brac East", "Cayman Brac West", "Little Cayman East", "Little Cayman West");
	} elseif($get_district == "Seven Mile Beach") {
		$the_district = array("W Bay Bch North", "W Bay Bch South");
	} elseif($get_district == "Seven Mile Beach Corridor") {
		$the_district = array("W Bay Bch North", "W Bay Bch South", "W Bay North East", "W Bay North West", "W Bay South", "George Town Centr", "George Town Comm", "George Town East", "George Town South");
	} elseif($get_district == "West Bay") {
		$the_district = array("W Bay North East", "W Bay North West", "W Bay South");
	} elseif($get_district == "North Side") {
		$the_district = array("Midland East", "North Side");
	} elseif($get_district == "Savannah") {
		$the_district = array("Lower Valley", "Savannah");
	} else {
		$the_district = $get_district;
		$compare = 'LIKE';
	}

	$args['meta_query'][] = array(
		'key' => 'district',
		'value' => $the_district,
		'compare' => $compare
	);
}

if(isset($get_proptype) && $get_proptype) {
	$args['meta_query'][] = array(
		'key' => 'property_type',
		'value' => $get_proptype,
		'compare' => 'LIKE'
	);
}

if(isset($get_beds) && $get_beds) {
	if($get_beds == 4) {
		$args['meta_query'][] = array(
			'key' => 'bedrooms',
			'value' => $get_beds,
			'compare' => '>='
		);
	} else {
		$args['meta_query'][] = array(
		'key' => 'bedrooms',
			'value' => $get_beds,
			'compare' => '='
		);
	}
}

if(isset($get_views) && $get_views) {
	$args['meta_query'][] = array(
		'key' => 'views',
		'value' => $get_views,
		'compare' => 'LIKE'
	);
}

if(isset($get_price) && $get_price) {
	if($get_price == "0_500k") {
		$args['meta_query'][] = array(
			'key' => 'price',
			'value' => array(0, 500000),
			'type' => 'numeric',
			'compare' => 'BETWEEN'
		);
	} elseif($get_price == "500k_1m") {
		$args['meta_query'][] = array(
			'key' => 'price',
			'value' => array(500000, 1000000),
			'type' => 'numeric',
			'compare' => 'BETWEEN'
		);
	} elseif($get_price == "1m_5m") {
		$args['meta_query'][] = array(
			'key' => 'price',
			'value' => array(1000000, 5000000),
			'type' => 'numeric',
			'compare' => 'BETWEEN'
		);
	} elseif($get_price == "5m_10m") {
		$args['meta_query'][] = array(
			'key' => 'price',
			'value' => array(5000000, 10000000),
			'type' => 'numeric',
			'compare' => 'BETWEEN'
		);
	} elseif($get_price == "10m_plus") {
		$args['meta_query'][] = array(
			'key' => 'price',
			'value' => 9999999,
			'type' => 'numeric',
			'compare' => '>'
		);
	}
}

if(isset($get_propsearch) && $get_propsearch) {
	$args['meta_query'][] = array(
		'key' => 'mls',
		'value' => $get_propsearch,
		'compare' => 'LIKE'
	);
}


// Create the listings query
$listings = new WP_Query($args);

?>

<div class="wrapper" id="full-width-page-wrapper">

	<div class="container-fluid px-md-5" id="content">

		<div class="row">

			<?php the_content(); ?>

			<div class="col-12" id="listings">
				<h1 class="h2 my-5 text-center">Real Estate Listings in Cayman</h1>

				<?php get_template_part('global-templates/listings-form'); ?>
				<p>There are <?php echo $listings->found_posts; ?> properties <?php if(isset($_GET)) { echo "that match your search"; } else { echo "in total"; } ?>.</p>
			</div>

			<?php if($listings->have_posts()): ?>
				<?php while($listings->have_posts()): $listings->the_post(); ?>
					<?php 
						$images = explode(', ', get_field('images'));
						$district = get_field('district');
						$propertytype = get_field('property_type');
						$mls = get_field('mls');
					?>
					<div class="col-sm-6 col-md-4 col-xl-3 mb-3">
						<div class="card h-100 listing-card">
							<div class="card-img-top">
								<img src="<?= $images[0]; ?>" alt="<?php the_title(); ?>">
							</div>
							<div class="card-body">
								<small class="mb-3 d-block"><?php if($propertytype) { echo $propertytype; } if($district && $propertytype) { echo " | "; } if($district) { echo $district; } else { "Cayman Islands"; } if($mls) { ?><span class="float-right">MLS# <?= $mls; ?></span><?php } ?></small>
								<h2 class="h5"><a href="<?php the_permalink(); ?>" class="stretched-link"><?php the_title(); ?></a></h2>
								<p><strong><?php the_field('currency'); echo number_format(get_field('price')); ?></strong></p>
							</div>
						</div>
					</div>

				<?php endwhile; ?>

				<div class="mt-4 text-center w-100">
					<?php 
						$big = 99999999;
						understrap_pagination([
							'base' 			=> str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
							'show_all'     	=> true,
							'format'	   	=> '?paged=%#%',
							'current' 		=> max( 1, get_query_var('paged') ),
							'total'        	=> $listings->max_num_pages,
						], 'pagination justify-content-center');
    				?>
    			</div>
			<?php endif; ?>
			<?php wp_reset_postdata(); ?>

		</div><!-- .row end -->

	</div><!-- #content -->

</div><!-- #full-width-page-wrapper -->

<?php
get_footer();
