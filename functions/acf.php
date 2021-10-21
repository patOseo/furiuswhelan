<?php

if( function_exists('acf_add_options_page') ) {
	
	acf_add_options_page('Site Options');
	acf_add_options_page(array(
		'page_title' => 'Sold Listings',
		'icon_url' => 'dashicons-admin-home',
		'position' => '30'
	));
	
}