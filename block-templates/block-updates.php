<?php

$image = get_field('latest_updates_image');

if(get_field('override_pdf')) {
	$pdf = get_field('override_pdf');
} else {
	$pdf = get_field('latest_updates_document', 'option');
}

?>

<div class="latest-updates-block">
	<div class="row">
		<div class="col-12 text-center">
			<a href="<?php echo $pdf; ?>" target="_blank"><?php echo wp_get_attachment_image($image, 'full', array( 'class' => 'mx-auto' )); ?></a>
		</div>
	</div>
	
</div>