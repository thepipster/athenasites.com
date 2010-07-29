<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */
?>
	<div id="sidebar" role="complementary">

		<h2>Search</h2>				
	
		<p>
		<?php get_search_form(); ?>
		</p>
				
		<h2>Tag Cloud</h2>				
		
		<p>
		<?php wp_tag_cloud( $args ); ?> 								
		</p>

		<h2>Categories</h2>				
		
		<?php
		
			$args = array(
			    'orderby'            => 'name',
			    'order'              => 'ASC',
			    'show_last_update'   => 0,
			    'style'              => '',
			    'show_count'         => 1,
			    'hide_empty'         => 1,
			    'use_desc_for_title' => 1,
			    'child_of'           => 0,
			    'current_category'   => 0,
			    'hierarchical'       => true,
			    'title_li'           => '',
			    'number'             => NULL,
			    'echo'               => 1,
			    'depth'              => 0 );
		?>
			<p>        
		<?php wp_list_categories( $args); ?>
			</p>
		
		<h2>Archive</h2>				
		 
		<?php 
			$args = array(
			    'type'            => 'monthly',
			    'format'          => 'custom', 
			    'before'          => '<p>',
			    'after'           => '</p>',
			    'show_post_count' => true,
			    'echo'            => 1 );
    		
			wp_get_archives($args);
		?>

	</div>

