<?php

// Enqueue block CSS for the editor
function custom_blocks_editor_scripts() {
	// Enqueue block editor styles
    wp_enqueue_style(
        'custom-blocks-editor-css',
        get_stylesheet_directory_uri() . '/css/custom-blocks.css',
        [ 'wp-edit-blocks' ]
    );
}
add_action( 'enqueue_block_editor_assets', 'custom_blocks_editor_scripts' );


// Create custom Gutenberg block category for ACF Blocks
function custom_block_category( $categories, $post ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug' => 'custom-blocks',
				'title' => __( 'Custom Blocks', 'custom-blocks' ),
			),
		)
	);
}
add_filter( 'block_categories', 'custom_block_category', 1, 2);


function acf_custom_blocks() {
	
	// check function exists
	if( function_exists('acf_register_block') ) {
		
		// register Listings block
		acf_register_block(array(
			'name'				=> 'listings',
			'title'				=> __('Listings'),
			'description'		=> __('A custom block to show active listings'),
			'render_template'	=> 'block-templates/block-listings.php',
			'category'			=> 'custom-blocks',
			'icon'				=> 'admin-home',
			'mode' 				=> 'edit',
			'keywords'			=> array( 'listings', 'houses' ),
		));

		// register Sold block
		acf_register_block(array(
			'name'				=> 'sold',
			'title'				=> __('Sold Listings'),
			'description'		=> __('A custom block to show sold listings'),
			'render_template'	=> 'block-templates/block-sold.php',
			'category'			=> 'custom-blocks',
			'icon'				=> 'tag',
			'mode' 				=> 'edit',
			'keywords'			=> array( 'sold'),
		));

		// register Sold block
		acf_register_block(array(
			'name'				=> 'reviews',
			'title'				=> __('Reviews Listings'),
			'description'		=> __('A custom block for reviews'),
			'render_template'	=> 'block-templates/block-reviews.php',
			'category'			=> 'custom-blocks',
			'icon'				=> 'format-status',
			'mode' 				=> 'edit',
			'keywords'			=> array( 'reviews', 'testimonials'),
		));

		// register PDF block
		acf_register_block(array(
			'name'				=> 'pdf',
			'title'				=> __('Latest Updates Block'),
			'description'		=> __('A custom block for Latest Updates PDF'),
			'render_template'	=> 'block-templates/block-updates.php',
			'category'			=> 'custom-blocks',
			'icon'				=> 'pdf',
			'mode' 				=> 'edit',
			'keywords'			=> array( 'pdf', 'updates'),
		));

		// accordion block
		acf_register_block(array(
			'name'				=> 'accordion',
			'title'				=> __('Accordion'),
			'description'		=> __('A custom block to display a FAQ-style accordion.'),
			'mode'				=> 'edit',
			'render_template'	=> 'block-templates/block-accordion.php',
			'category'			=> 'custom-blocks',
			'icon'				=> 'excerpt-view',
			'keywords'			=> array( 'faq', 'accordion' ),
		));
	}
}

add_action('acf/init', 'acf_custom_blocks');