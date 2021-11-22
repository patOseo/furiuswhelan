<?php

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

<form action="/all-listings/#listings" method="get" class="mb-5">
	<div class="row">
		<div class="col-6 col-lg mb-1 px-2">
			<select name="proptype" id="proptype" class="form-control">
				<option value="">Property Type</option>
				<?php foreach($proptypes as $proptype): ?>
					<option value="<?= $proptype; ?>" <?php if(isset($get_proptype) && $get_proptype == $proptype) { echo "selected"; } ?>><?= $proptype; ?></option>
				<?php endforeach; ?>
			</select>
		</div>
		<div class="col-6 col-lg mb-1 px-2">
			<select name="district" id="district" class="form-control">
				<option value="">District</option>
				<?php foreach($districts as $district): ?>
					<option value="<?= $district; ?>" <?php if(isset($get_district) && $get_district == $district) { echo "selected"; } ?>><?= $district; ?></option>
				<?php endforeach; ?>
			</select>
		</div>
		<div class="col-6 col-lg mb-1 px-2">
			<select name="beds" id="beds" class="form-control">
				<option value="">Beds</option>
				<option value="1" <?php if(isset($get_beds) && $get_beds == 1) { echo "selected"; } ?>>1</option>
				<option value="2" <?php if(isset($get_beds) && $get_beds == 2) { echo "selected"; } ?>>2</option>
				<option value="3" <?php if(isset($get_beds) && $get_beds == 3) { echo "selected"; } ?>>3</option>
				<option value="4" <?php if(isset($get_beds) && $get_beds == 4) { echo "selected"; } ?>>4+</option>
			</select>
		</div>
		<div class="col-6 col-lg mb-1 px-2">
			<select name="views" id="views" class="form-control">
				<option value="">Views</option>
				<?php foreach($views as $view): ?>
					<option value="<?= $view; ?>" <?php if(isset($get_views) && $get_views == $view) { echo "selected"; } ?>><?= $view; ?></option>
				<?php endforeach; ?>
			</select>
		</div>
		<div class="col-6 col-lg mb-1 px-2">
			<select name="price" id="price" class="form-control">
				<option value="">Price</option>
				<?php foreach($prices as $price_key => $price_label): ?>
					<option value="<?= $price_key; ?>" <?php if(isset($get_price) && $get_price == $price_key) { echo "selected"; } ?>><?= $price_label; ?></option>
				<?php endforeach; ?>
			</select>
		</div>
		<div class="col-6 col-lg mb-1 px-2">
			<input type="text" name="propsearch" placeholder="Name / MLS#" value="<?php if(isset($get_propsearch) && $get_propsearch) { echo $get_propsearch; }?>" class="form-control">
		</div>
		<div class="col-12 col-lg-1 mb-1 px-2 text-center">
			<button type="submit" class="btn btn-secondary w-100 text-light"><i class="fa fa-search"></i></button>
		</div>
	</div>
</form>