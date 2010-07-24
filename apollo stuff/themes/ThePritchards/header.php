<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>

<head profile="http://gmpg.org/xfn/11">
<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

<title><?php bloginfo('name'); ?> <?php if ( is_single() ) { ?> &raquo; Blog Archive <?php } ?> <?php wp_title(); ?></title>

<meta name="generator" content="WordPress <?php bloginfo('version'); ?>" /> <!-- leave this for stats -->

<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
<link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name'); ?> RSS Feed" href="<?php bloginfo('rss2_url'); ?>" />
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
<?php wp_head(); ?>
</head>
<body>
<div id="header-outer">
    <div id="header">
        <div id="headerimg">
            <h1><a href="<?php echo get_option('home'); ?>/" title="<?php bloginfo('name'); ?>"><?php bloginfo('name'); ?></a></h1>
            <div class="desc"><?php bloginfo('description'); ?></div>
        </div>
        <div id="nav1">
            <ul>
                <li><a href="<?php echo get_option('home'); ?>/" title="Home">Home</a></li>
                    <?php wp_list_pages('depth=1&title_li='); ?>
            </ul>

            <form method="get" action="<?php bloginfo('url'); ?>/" class="searchbar">
                    <p>
                    <input type="text" class="txt" value="<?php the_search_query(); ?>" name="s"/>
                    <input type="submit" name="submit" value="Search" class="btn"/>
                    </p>
            </form>
        <div class="clr"></div>
        </div>
    </div>
</div>
<div id="wrapper">
<?php include (TEMPLATEPATH . "/sidebar.php"); ?>
    
