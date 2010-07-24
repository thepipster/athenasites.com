<?php get_header(); ?>

	<div id="content">

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<div class="navigation">
			<div class="alignleft"><?php previous_post_link('&laquo; %link') ?></div>
			<div class="alignright"><?php next_post_link('%link &raquo;') ?></div>
			<div class="clr"></div>
		</div>

		<div class="post" id="post-<?php the_ID(); ?>">
			<h2><a href="<?php echo get_permalink() ?>" rel="bookmark" title="Permanent Link: <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>	<div class="date"><?php the_time('jS F Y ') ?></div>

			<div class="entry">
				<?php the_content('<p class="serif">Read the rest of this entry &raquo;</p>'); ?>
<div class="clr"></div>
				<?php wp_link_pages(array('before' => '<p><strong>Pages:</strong> ', 'after' => '</p>', 'next_or_number' => 'number')); ?>
</div>
<p class="postmetadata alt">Posted in <?php the_category(', ') ?><?php the_tags(' | Tags: ', ', ', ''); ?><?php edit_post_link(' | Edit', '', ' | '); ?></p>
		

	<?php comments_template(); ?>
</div>
	<?php endwhile; else: ?>

		<p>Sorry, no posts matched your criteria.</p>

<?php endif; ?>

	</div>

<?php get_footer(); ?>
