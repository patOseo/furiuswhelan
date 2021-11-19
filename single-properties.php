<?php
/**
 * The template for displaying all single REMAX property listings
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
$container = get_theme_mod( 'understrap_container_type' );

$mls = get_field('mls');
$price = get_field('price');
$currency = get_field('currency');
$desc = get_field('description');
$beds = get_field('bedrooms');
$baths = get_field('bathrooms');
$garage = get_field('garage');
$stories = get_field('stories');
$zoning = get_field('zoning');
$sqft = get_field('square_feet');
$year = get_field('year_built');
$acreage = get_field('acreage');
$views = get_field('views');
$prop_type = get_field('property_type');
$listing_type = get_field('listing_type');
$district = get_field('district');
$furnished = get_field('furnished');
$tennis = get_field('tennis');
$dock = get_field('dock');
$alarm = get_field('security_alarm');
$gym = get_field('gym');
$pool = get_field('pool');
$videos = get_field('videos');
$images = get_field('images');
$propertyid = "MLS #" . $mls . ": " . get_the_title();

$information = array(
	"MLS#"			=> $mls,
	"Type"			=> $prop_type,
	"Stories"		=> $stories,
	"Bedrooms"		=> $beds,
	"Bathrooms"		=> $baths,
	"Square Feet"	=> $sqft,
	"Acreage"		=> $acreage,
	"Views"			=> $views,
	"Year Built"	=> $year
	
);

$features = array(
	"Zoning Type"		=> $zoning,
	"Furnished" 		=> $furnished,
	"Tennis Court" 		=> $tennis,
	"Dock"				=> $dock,
	"Garage" 			=> $garage,
	"Security Alarm"	=> $alarm,
	"Gym"				=> $gym,
	"Pool"				=> $pool
);

$imgs = explode(', ', $images);
?>

<div class="wrapper mb-5" id="single-wrapper">

	<div class="container-fluid px-md-5" id="content" tabindex="-1">

		<div class="row mb-3">

			<div class="col-12">
				<small><a href="/all-listings/"><i class="fa fa-chevron-left"></i> Back to Search</a></small>
			</div>

		</div><!-- .row -->

		<div class="row">
			<div class="col-xl-9">
				<div class="card mb-3 p-3 bg-light">
					<div class="row align-items-center">
						<div class="col-md-9">
							<h1 class="h2"><?php the_title(); ?></h1>
							<?php if($listing_type): ?><p class="mb-1"><strong><?= $listing_type; ?></strong></p><?php endif; ?>
							<p class="mb-0"><?php if($district): echo $district . ", "; endif; ?>Cayman Islands</p>
						</div>
						<div class="col-md-3 text-right">
							<?php if($price): ?><p class="h2 mb-0"><?php echo $currency . number_format($price); ?></p><?php endif; ?>
						</div>
					</div>
					
				</div>

				<div class="property-img">
					<img class="mb-4" src="<?php echo $imgs[0]; ?>" alt="<?php the_title(); ?>">
				</div>

				<h2 class="mb-4 card text-center p-2">Property Information</h2>

				<div class="row mb-4">
					<?php foreach($information as $info => $infoval): ?>
						<?php if($infoval): ?>
							<div class="col-6 col-sm-4 col-lg-3 mb-3">
								<h3 class="pb-2 h4 border-bottom"><?= $info; ?></h3>
								<p class="h6"><?php if($infoval) { echo $infoval; } else { echo "N/A"; } ?></p>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>

				<?php if($desc): ?>
					<div class="mb-5 property-desc"><?= $desc; ?></div>
				<?php endif; ?>

				<h2 class="mb-4 card text-center p-2">Property Features</h2>
				<div class="row">
					<?php foreach($features as $feature => $featureval): ?>
						<?php
							if($featureval == '0') {
								$feat = "No";
							} elseif($featureval == '1') {
								$feat = "Yes";
							} else {
								$feat = $featureval;
							}
						?>

						<?php if($featureval != null): ?>
							<div class="col-6 col-sm-4 col-lg-3 mb-3">
								<h3 class="pb-2 h4 border-bottom"><?= $feature; ?></h3>
								<p class="h6"><?php echo $feat; ?></p>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="col-xl-3">
				<div class="card p-4 bg-light">
					<p class="h4 mb-3 text-center">Set up a viewing for this property today</p>
					<img class="mb-2 mx-auto rounded-circle border border-secondary" src="/wp-content/themes/furiuswhelan/images/furius-whelan-circle.jpg" alt="Furius Whelan" width="160" height="160">
					<p class="h5 mb-4 text-center">Furius Whelan</p>
					<?php gravity_form(3, false, false, false, array('property' => $propertyid), true); ?>
				</div>
			</div>
		</div>

	</div><!-- #content -->

</div><!-- #single-wrapper -->

<?php
get_footer();
