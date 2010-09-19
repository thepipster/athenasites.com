<?php
/**
 * Class to handle rendering of a blog's side bar, based on the current blogs
 * preferences.
 *
 * @since 18th September, 2010
 * @author Mike Pritchard (mike@apollosites.com)
 */
class SideBarManager {

    /**
     * Get the html for a list of categories for this site, returned as links
     * @param int $site_id
     * @param string $categoryCSS (Optional) The css class to use for each category item
     */
    public static function getCategories($site_id, $categoryCSS="categoryItem"){

        $catList = PostsTable::getCategories($site_id);

        $txt = "<ul>";
        if (isset($catList)){
            foreach ($catList as $cat) {
                $cat_slug = StringUtils::encodeSlug($cat, '');
                $link = PageManager::$blog_url . "?category=" . $cat_slug;
                $txt .= "<li><a href='{$link}'><span class='$categoryCSS'>{$cat_slug}</span></a></li>";
            }
        }
        $txt .= "</ul>";
    }

    // /////////////////////////////////////////////////////////////////////////////////
    
    public static function getArchive($site_id, $monthCSS="archiveMonth"){

        // Get the oldest date for posts
        $oldest_post_date = PostsTable::getOldestPostDate($site_id);

        // How many months ago was this?
        $seconds_per_month = 2629744;
        $delta_months = (time() - strtotime($oldest_post_date)) / $seconds_per_month;

        $txt = "<ul>";

        for($i=0; $i<$delta_months; $i++){

            $month_epoch = mktime(date("H"), date("i"), date("s"), date("m")-$i, date("d"), date("Y"));
            
            //$target_date = mktime();
            $month = date("F", $month_epoch);
            $year = date("Y", $month_epoch);

            // Get the start and end dates for the this month...
            $month_digit = date('n', $month_epoch);
            
            $date_from = date("Y-m-d 00:00:00", strtotime($month_digit.'/01/'.date('Y').' 00:00:00'));
            $date_end = date("Y-m-d 23:59:59", strtotime('-1 second',strtotime('+1 month',strtotime($month_digit.'/01/'.date('Y').' 00:00:00'))));

            // Now get the number of posts for this month
            $no_posts = PostsTable::getNoPostsForTimeSpan($site_id, $date_from, $date_end);
            
            $link = PageManager::$blog_base_url . "/$year/$month_digit/";

            //$txt .= "<a class='$monthCSS' href'$link'>$month </a>($no_posts)<br/>";
            $txt .= "<li><a href='{$link}'><span class='{$monthCSS}'>{$month}&nbsp;</span></a>($no_posts)</li>";
            
        }
        $txt .= "</ul>";


        return $txt;

    }

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a tag cloud for the give site
     * @param <type> $site_id
     * @return <type>
     */
    public static function getTagCloud($site_id){

        // Get tags from database
        $tag_counts = PostsTable::getTagCounts(4);

        $no_tags = count($tag_counts);

        // The results are in order, so get max and min
        $max_ct = $tag_counts[0]['ct'];
        $min_ct = $tag_counts[$no_tags-1]['ct'];

        $max_font_size = 36; // max font size in pixels
        $min_font_size = 8; // min font size in pixels

        // find the range of values
        $spread = $max_ct - $min_ct;
        if ($spread == 0) { // we don't want to divide by zero
            $spread = 1;
        }

        // set the font-size increment
        $step = ($max_font_size - $min_font_size) / ($spread);

        $txt = "";

        $tag_list = array();
        foreach ($tag_counts as $tag) {
            $tag_list[$tag['tag']] = $tag['ct'];
        }

        Logger::debug("$no_tags Tags " . count($tag_list));

        //shuffle($tag_counts);
        ksort($tag_list);
        
        // loop through the tag array
        foreach ($tag_list as $name => $count) {

            //$count = $tag['ct'];
            //$name = $tag['tag'];
            
            // calculate font-size
            // find the $value in excess of $min_qty
            // multiply by the font-size increment ($size)
            // and add the $min_size set above
            $size = round($min_font_size + (($count - $min_ct) * $step));
            $pad = $size / 5;
            $txt .= "<a href='#' style='font-size:{$size}px; padding-left:5px; padding-right:5px; display:inline-block'>$name</a>";
        }


        return $txt;
    }

}
?>
