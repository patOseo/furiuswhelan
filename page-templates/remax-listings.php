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
	'post_type' 		=> 'properties',
	'status'			=> 'publish',
	'posts_per_page'	=> 12,
	'paged' 			=> $paged,
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
	$args['meta_query'][] = array(
		'key' => 'district',
		'value' => $get_district,
		'compare' => 'LIKE'
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

// Getting the unique fields for districts and property types 
$properties = get_posts(
	array(
		'post_type'	=> 'properties',
		'status' => 'publish',
		'posts_per_page' => -1,
	),
);


$all_districts = array();
$all_types = array();

foreach($properties as $post) {
	setup_postdata( $post );
	$all_districts[] = get_field('district');
	$all_types[] = get_field('property_type');
	wp_reset_postdata();
}

$districts = array_unique($all_districts);
$proptypes = array_unique($all_types);
$views = array('Water View', 'Water Front', 'Golf View', 'Garden View', 'Canal Front', 'Canal View', 'Beach Front', 'Inland', 'Pool View');
$prices = array(
'0_500k' => '$0 - $500K',
'500k_1m' => '$500K - $1M',
'1m_5m' => '$1M - $5M',
'5m_10m' => '$5M - $10M',
'10m_plus' => '$10M +',
);

sort($districts);
sort($proptypes);
sort($views);

?>

<div class="wrapper" id="full-width-page-wrapper">

	<div class="container-fluid px-md-5" id="content">

		<div class="row">

			<div class="col-12">
				<h1 class="mb-4 text-center">Browse Real Estate Listings in Cayman</h1>

				<form action="/all-listings/" method="get" class="mb-5">
					<div class="row">
						<div class="col-6 col-lg mb-1 mb-md-0">
							<select name="proptype" id="proptype" class="form-control">
								<option value="">Property Type</option>
								<?php foreach($proptypes as $proptype): ?>
									<option value="<?= $proptype; ?>" <?php if(isset($get_proptype) && $get_proptype == $proptype) { echo "selected"; } ?>><?= $proptype; ?></option>
								<?php endforeach; ?>
							</select>
						</div>
						<div class="col-6 col-lg mb-1 mb-md-0">
							<select name="district" id="district" class="form-control">
								<option value="">District</option>
								<?php foreach($districts as $district): ?>
									<option value="<?= $district; ?>" <?php if(isset($get_district) && $get_district == $district) { echo "selected"; } ?>><?= $district; ?></option>
								<?php endforeach; ?>
							</select>
						</div>
						<div class="col-6 col-lg mb-1 mb-md-0">
							<select name="beds" id="beds" class="form-control">
								<option value="">Beds</option>
								<option value="1" <?php if(isset($get_beds) && $get_beds == 1) { echo "selected"; } ?>>1</option>
								<option value="2" <?php if(isset($get_beds) && $get_beds == 2) { echo "selected"; } ?>>2</option>
								<option value="3" <?php if(isset($get_beds) && $get_beds == 3) { echo "selected"; } ?>>3</option>
								<option value="4" <?php if(isset($get_beds) && $get_beds == 4) { echo "selected"; } ?>>4+</option>
							</select>
						</div>
						<div class="col-6 col-lg mb-1 mb-md-0">
							<select name="views" id="views" class="form-control">
								<option value="">Views</option>
								<?php foreach($views as $view): ?>
									<option value="<?= $view; ?>" <?php if(isset($get_views) && $get_views == $view) { echo "selected"; } ?>><?= $view; ?></option>
								<?php endforeach; ?>
							</select>
						</div>
						<div class="col-6 col-lg mb-1 mb-md-0">
							<select name="price" id="price" class="form-control">
								<option value="">Price</option>
								<?php foreach($prices as $price_key => $price_label): ?>
									<option value="<?= $price_key; ?>" <?php if(isset($get_price) && $get_price == $price_key) { echo "selected"; } ?>><?= $price_label; ?></option>
								<?php endforeach; ?>
							</select>
						</div>
						<div class="col-6 col-lg mb-1 mb-md-0">
							<input type="text" name="propsearch" placeholder="Name / MLS#" value="<?php if(isset($get_propsearch) && $get_propsearch) { echo $get_propsearch; }?>" class="form-control">
						</div>
						<div class="col-12 col-lg-1 mb-1 mb-md-0 text-center">
							<button type="submit" class="btn btn-primary w-100 text-light"><i class="fa fa-search"></i> Search</button>
						</div>
					</div>
				</form>
				<p>There are <?php echo $listings->found_posts; ?> properties <?php if(isset($_GET)) { echo "that match your search"; } else { echo "in total"; } ?>.</p>
			</div>

			<?php if($listings->have_posts()): ?>
				<?php while($listings->have_posts()): $listings->the_post(); ?>
					<?php 
						$images = explode(', ', get_field('images'));
						$district = get_field('district');
						$propertytype = get_field('property_type');
					?>
					<div class="col-sm-6 col-md-4 col-xl-3 mb-3">
						<div class="card h-100">
							<div class="card-img-top">
								<img src="<?= $images[0]; ?>" alt="<?php the_title(); ?>">
							</div>
							<div class="card-body">
								<small><?php if($propertytype) { echo $propertytype; } if($district && $propertytype) { echo " | "; } if($district) { echo $district; } else { "Cayman Islands"; } ?></small>
								<h2 class="h5"><a href="<?php the_permalink(); ?>" class="stretched-link"><?php the_title(); ?></a></h2>
								<p><?php the_field('currency'); echo number_format(get_field('price')); ?></p>
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
