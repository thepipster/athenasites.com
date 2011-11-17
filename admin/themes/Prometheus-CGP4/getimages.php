<?php

require_once("../../code/php/setup.php");

// Set a virtual page id so that the header knows this page is being displayed
define("VIRTUAL_PAGE_ID", 33);

$csv_tags = CommandHelper::getPara('tag', false, CommandHelper::$PARA_TYPE_STRING);
$csv_tags = str_replace('.html', '', $csv_tags);

Logger::debug("Tags = $csv_tags");

// Get the site id from the URL
$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$site_id = SitesTable::getSiteIDFromDomain($domain);

// Replace '-' spaces with spaces
$csv_tags = str_replace("-", " ", $csv_tags);

// Get tag list
$tag_list = explode(",", $csv_tags);

//Logger::echoLog();

Logger::debug("Site ID = $site_id Tag = $csv_tags");

$media_id_list = array();
foreach($tag_list as $tag){
	if ($tag != ''){
		Logger::debug("Tag = " . $tag);
		$temp_list = MediaTable::getMediaIDsByTag($site_id, trim($tag));
		if (isset($temp_list)){
			$media_id_list = array_merge($media_id_list, $temp_list);
		}
	}
}

$media_id_list = array_unique($media_id_list);
shuffle($media_id_list);

// Force PageManager setup..

PageManager::init('',4);
PageManager::$page_title = 'Ideas for ' . ucfirst($csv_tags) . ': Charlotte Geary Photography';


// List of title/texts for each media tag

$text_list = array(
	array ("tag" => "autumn weddings", "title" => "Autumn Wedding Ideas", "caption" => "Pictures of fall weddings: locations, bouquets, centerpieces, decorations, dresses, cakes, boutonnieres, flower girl dresses, flower girl baskets and kissing balls, bridesmaid dresses, favors, place cards, and other ideas. Decorations for autumn-themed weddings may include pumpkins, leaves, branches, gourds, and pine cones. Popular autumn colors include red, yellow, orange, and brown.  Fall wedding flowers include gerbera daisies, marigolds, sunflowers, asters, roses, and zinnias."),
	array ("tag" => "black weddings", "title" => "Ideas for Black Weddings", "caption" => "Pictures of  weddings with a black theme: centerpieces, decorations, suits, bridesmaid dresses, flower girl dresses, mother of the bride dresses, cakes, jewelry, reception decorations, and other ideas. "),
	array ("tag" => "blue and brown weddings", "title" => "Ideas for Blue and Brown Weddings", "caption" => "Pictures of  weddings with a blue and brown theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Blue colors include turquoise, periwinkle, navy, and indigo. Blue flowers include hyacinths, hydrangeas, and delphiniums."),
	array ("tag" => "blue and orange weddings", "title" => "Ideas for Blue and Orange Weddings", "caption" => "Pictures of  weddings with an orange and blue theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Blue colors include turquoise, periwinkle, navy, and indigo. Blue flowers include hyacinths, hydrangeas, and delphiniums. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons."),
	array ("tag" => "blue and purple weddings", "title" => "Ideas for Blue and Purple Weddings", "caption" => "Pictures of  weddings with a purple and blue theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Blue colors include turquoise, periwinkle, navy, and indigo. Blue flowers include hyacinths, hydrangeas, and delphiniums. Shades of purple include lavender, plum, indigo, violet, eggplant, aubergine, and indigo. Purple flowers include lilies, orchids, roses, lavender, campanulas, calla lilies, and hydrangeas."),
	array ("tag" => "blue weddings", "title" => "Ideas for Blue Weddings", "caption" => "Pictures of  weddings with a blue theme: bouquets, centerpieces, decorations, bridesmaid dresses, flower girl dresses, sashes, cakes, boutonnieres, jewelry, reception decorations, and other ideas. Blue colors include turquoise, periwinkle, navy, and indigo. Blue flowers include hyacinths, hydrangeas, and delphiniums"),
	array ("tag" => "bouquets", "title" => "Ideas for Wedding Bouquets", "caption" => "Pictures of wedding bouquets for brides, bridesmaids, flower girls, and mothers of the bride, with flowers that include roses, calla lilies, peonies, gerbera daisies, sunflowers, and many others."),
	array ("tag" => "boutonnieres", "title" => "Ideas for Wedding Boutonnieres", "caption" => "Photos of boutonnieres for grooms, groomsmen, and other men at weddings, using flowers that include roses, calla lilies, sunflowers, stephanotis, and other flowers."),
	array ("tag" => "bridal gowns", "title" => "Ideas for Bridal Gowns", "caption" => "Pictures of wedding gowns, including modern dresses, traditional gowns, mermaid styles, tea-length dresses, long trains, full skirts, and many others."),
	array ("tag" => "brides", "title" => "Photos of Brides", "caption" => "Pictures of brides for inspiration for make up, hairstyles, dresses, veils, bouquets, and accessories."),
	array ("tag" => "brides rooms", "title" => "Ideas for Brides' Rooms", "caption" => "Pictures of brides' getting ready areas, including hotel rooms, venue dressing areas, and honeymoon suites."),
	array ("tag" => "bridesmaids", "title" => "Ideas for Bridesmaids", "caption" => "Pictures of bridesmaids for inspiration for dresses, colors, hairstyles, bouquets, shoes, and accessories."),
	array ("tag" => "brown and purple weddings", "title" => "Ideas for Purple and Brown Weddings", "caption" => "Pictures of weddings with a brown and purple color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of brown include tan, auburn, chocolate, sienna, ecru, ochre, rust, and taupe. Brown flowers include roses, orchids, callas, chocolate cosmos, hypercum berries, fiddlehead ferns, and ghost leaves.  Shades of purple include lavender, plum, indigo, violet, eggplant, aubergine, and indigo. Purple flowers include lilies, orchids, roses, lavender, campanulas, calla lilies, and hydrangeas."),
	array ("tag" => "brown weddings", "title" => "Ideas for Brown Weddings", "caption" => "Pictures of  weddings with a brown color theme: bouquets, centerpieces, decorations, bridesmaid dresses, flower girl dresses, suits, sashes, cakes, boutonnieres, favors, table settings, invitations, programs, and other ideas. Shades of brown include tan, auburn, chocolate, sienna, ecru, ochre, rust, and taupe. Brown flowers include roses, orchids, callas, chocolate cosmos, hypercum berries, fiddlehead ferns, and ghost leaves. Chocolate brown is a popular accent color paired with pink or blue color schemes, and it is a great choice for autumn weddings or outdoorsy themes. It is often seen in chocolate cakes and desserts."),
	array ("tag" => "cake toppers", "title" => "Ideas for Wedding Cake Toppers", "caption" => "Photos of wedding cake toppers, including sugar flowers, fresh flowers, sculptures, monograms, and creative ideas."),
	array ("tag" => "cakes", "title" => "Ideas for Wedding Cakes", "caption" => "Photos of wedding cake ideas, including cakes with sugar flowers, fresh flowers, sculptures, monograms, ribbons, and creative ideas. Cupcake towers or doughnuts are casual and fun alternatives to a traditional cake. Dessert buffets with pies and cookies are also alternatives to cakes."),
	array ("tag" => "candy buffets", "title" => "Ideas for Wedding Candy Buffets", "caption" => "Photos of candy buffets for inspiration for colors, containers, arrangements, and candies."),
	array ("tag" => "card boxes", "title" => "Ideas for Wedding Card Boxes", "caption" => "Photos of containers for wedding greeting cards, including vases, bowls, birdcages, mailboxes, and other creative ideas."),
	array ("tag" => "centerpieces", "title" => "Ideas for Wedding Centerpieces", "caption" => "Reception tables are often decorated with beautiful flowers, such as roses, peonies, tulips, or lilies. I've also seen creative decorations made with candles, pine cones, willow branches, vegetables, and even crayons! I love it when couples personalize their receptions to reflect their personalities."),
	array ("tag" => "ceremony decorations", "title" => "Ideas for Wedding Ceremony Decorations", "caption" => "Photos of wedding ceremony decorations, including flowers, programs, pew decorations, altar decorations, altar arches, bubbles, rose petals, and candles."),
	array ("tag" => "champagne glasses", "title" => "Ideas for Wedding Champagne Glasses", "caption" => "Pictures of wedding champagne glasses, including crystal flutes, silver goblets, modern whimsical designs, and other ideas."),
	array ("tag" => "departures", "title" => "Ideas for Wedding Departures", "caption" => "Pictures of wedding departures for inspiration for the bride and groom's big send-off, including limos, antique cars, sparklers, and gondolas."),
	array ("tag" => "engagement portraits", "title" => "Ideas for Displaying Engagement Portraits at Weddings", "caption" => "Pictures of engagement portraits displayed at weddings in various ways, including frame arrangements, guest books, programs, signature mats, card boxes, and table numbers."),
	array ("tag" => "fathers and grandfathers", "title" => "Ideas for the Father or Grandfather of the Bride or Groom", "caption" => "Pictures of fathers and grandfathers of the bride and groom, with ideas for suits, tuxedos, ties, boutonnieres, and accessories."),
	array ("tag" => "favors", "title" => "Ideas for Wedding Favors", "caption" => "Photos of wedding favors, including candy, ornaments, cookies, coasters, flower seeds, and other gifts."),
	array ("tag" => "flower girls", "title" => "Ideas for Wedding Flower Girls", "caption" => "Photos of flower girls and other little girls at weddings. Ideas for flower girl dresses, baskets, jewelry, accessories, and hairstyles."),
	array ("tag" => "food and drinks", "title" => "Ideas for Wedding Food and Drinks", "caption" => "Photos of wedding food and drinks, including champagne, margaritas, cocktails, salads, appetizers, meals, and desserts."),
	array ("tag" => "garters", "title" => "Ideas for Wedding Garters", "caption" => "Pictures of wedding garters for the bride, including heirlooms, traditional styles, humorous ideas, and special surprises for the groom."),
	array ("tag" => "gold weddings", "title" => "Ideas for Gold Weddings", "caption" => "Pictures of  weddings with a gold color theme: jewelry, centerpieces, decorations, dresses, cakes, invitations, and other ideas. "),
	array ("tag" => "green and brown weddings", "title" => "Ideas for Green and Brown Weddings", "caption" => "Pictures of  weddings with a brown and green color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of green include sage, apple, lime, forest, and emerald. Leaves, ivy, and grasses are popular green accents to bouquets and centerpieces. Green flowers include hydrangeas, orchids, and gladiolas. Shades of brown include tan, auburn, chocolate, sienna, ecru, ochre, rust, and taupe. Brown flowers include roses, orchids, callas, chocolate cosmos, hypercum berries, fiddlehead ferns, and ghost leaves. "),
	array ("tag" => "green and orange weddings", "title" => "Ideas for Green and Orange Weddings", "caption" => "Pictures of  weddings with a green and brown color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of green include sage, apple, lime, forest, and emerald. Leaves, ivy, and grasses are popular green accents to bouquets and centerpieces. Green flowers include hydrangeas, orchids, and gladiolas. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons."),
	array ("tag" => "green weddings", "title" => "Ideas for Green Wedding Themes", "caption" => "Pictures of  weddings with a green color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of green include sage, apple, lime, forest, and emerald. Leaves, ivy, and grasses are popular green accents to bouquets and centerpieces. Green flowers include hydrangeas, orchids, and gladiolas."),
	array ("tag" => "grooms", "title" => "Photos of Grooms", "caption" => "Pictures of grooms for inspiration for suits, ties, boutonnieres, and accessories."),
	array ("tag" => "grooms cakes", "title" => "Ideas for Groom's Cakes", "caption" => "Pictures of groom's cake ideas, including chocolate cakes, sports themes, cupcakes, college logos, and other fun ideas."),
	array ("tag" => "groomsmen", "title" => "Ideas for Groomsmen", "caption" => "Pictures of groomsmen for inspiration for suits, colors, boutonnieres, ties, and accessories."),
	array ("tag" => "guestbooks", "title" => "Ideas for Wedding Guestbooks", "caption" => "Pictures of wedding guestbooks, including engagement portrait books, signature photo mats, quilts, Polaroid photo books, photobooths, and art books."),
	array ("tag" => "hairstyles", "title" => "Ideas for Wedding Hairstyles", "caption" => "Photos of hairstyles for the bride, bridesmaid, mother of the bride, and flower girl, with a variety of styles to suit long hair, shoulder-length hair, short hair, straight hair, and curly hair."),
	array ("tag" => "heirlooms", "title" => "Ideas for Including Heirlooms in Weddings", "caption" => "Pictures of family heirlooms that have been included in wedding traditions and decor. Heirlooms include jewelry, handkerchiefs, veils, Bibles, pocketwatches, and dishes."),
	array ("tag" => "invitations", "title" => "Ideas for Wedding Invitations", "caption" => "Pictures of wedding invitation ideas, including traditional styles, modern designs, and a variety of color scheme"),
	array ("tag" => "jewelry", "title" => "Ideas for Wedding Jewelry", "caption" => "Photos of wedding and bridal jewelry, including necklaces, earrings, bracelets, rings, cufflinks, and brooches for the bride, bridesmaids, mothers, and flower girls."),
	array ("tag" => "kids activities", "title" => "Ideas for Kids' Activities at Weddings", "caption" => "Photos of activities to entertain children at weddings, including coloring books, crafts, gifts, and toys."),
	array ("tag" => "mens accessories", "title" => "Ideas for Men's Accessories for Weddings", "caption" => "Photos of accessories for grooms, groomsmen, and other men at weddings, including cufflinks, vests, ties, hats, shoes, boutonnieres, and military uniforms."),
	array ("tag" => "mothers and grandmothers", "title" => "Ideas for the Mother or Grandmother of the Bride or Groom", "caption" => "Pictures of mothers and grandmothers of the bride and groom, with ideas for dresses, flowers, hairstyles, and accessories."),
	array ("tag" => "orange and brown weddings", "title" => "Ideas for Orange and Brown Weddings", "caption" => "Pictures of weddings with a brown and orange color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons. Shades of brown include tan, auburn, chocolate, sienna, ecru, ochre, rust, and taupe. Brown flowers include roses, orchids, callas, chocolate cosmos, hypercum berries, fiddlehead ferns, and ghost leaves. "),
	array ("tag" => "orange and green weddings", "title" => "Ideas for Orange and Green Weddings", "caption" => "Pictures of weddings with a green and orange color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons. Shades of green include sage, apple, lime, forest, and emerald. Leaves, ivy, and grasses are popular green accents to bouquets and centerpieces. Green flowers include hydrangeas, orchids, and gladiolas."),
	array ("tag" => "orange and purple weddings", "title" => "Ideas for Orange and Purple Weddings", "caption" => "Pictures of weddings with a purple and orange color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons. Shades of purple include lavender, plum, indigo, violet, eggplant, aubergine, and indigo. Purple flowers include lilies, orchids, roses, lavender, campanulas, calla lilies, and hydrangeas."),
	array ("tag" => "orange and red weddings", "title" => "Ideas for Orange and Red Weddings", "caption" => "Pictures of weddings with a red and orange color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons. Shades of red include apple, burgundy, coral, crimson, fire engine, maroon, ruby, and vermillion. Red flowers include roses, gerbera daisies, orchids, Peruvian lilies, tulips, freesia, hypericum, and calla lilies."),
	array ("tag" => "orange and yellow weddings", "title" => "Ideas for Orange and Yellow Weddings", "caption" => "Inspiration for weddings with an orange and yellow color scheme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons. Shades of yellow include gold, amber, tangerine, maize, beige, and cream. Yellow flowers include sunflowers, roses, Peruvian lilies, gerbera daisies, orchids, spider flowers, tulips, and calla lilies. cream, lemon, ochre, and gold."),
	array ("tag" => "orange weddings", "title" => "Ideas for Orange Weddings", "caption" => "Pictures of weddings with an orange color scheme: bouquets, centerpieces, decorations, bridesmaid dresses, flower girl dresses, cakes, boutonnieres, ceremony decorations, table settings, flower girl baskets, and other ideas. Shades of orange include pumpkin, salmon, rust, persimmon, coral, and amber. Orange flowers include mango calla lilies, roses, alstroemeria, gerbera daisies, orchids, tulips, birds of paradise, and snapdragons."),
	array ("tag" => "other creative ideas", "title" => "Ideas for Other Unique Wedding Details", "caption" => "Pictures of creative wedding details, including decorations, accessories, gifts, cultural traditions, and ceremony ideas."),
	array ("tag" => "pink and blue weddings", "title" => "Ideas for Pink and Blue Weddings", "caption" => "Pictures of weddings with a blue and pink color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of pink include blush, rose, magenta, fuschia, salmon, and pastels. Pink flowers include roses, peonies, gerbera daisies, lilies, and orchids. Blue colors include turquoise, periwinkle, navy, and indigo. Blue flowers include hyacinths, hydrangeas, and delphiniums."),
	array ("tag" => "pink and brown weddings", "title" => "Ideas for Pink and Brown Weddings", "caption" => "Pictures of weddings with a brown and pink color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of pink include blush, rose, magenta, fuschia, salmon, and pastels. Pink flowers include roses, peonies, gerbera daisies, lilies, and orchids. Shades of brown include tan, auburn, chocolate, sienna, ecru, ochre, rust, and taupe. Brown flowers include roses, orchids, callas, chocolate cosmos, hypercum berries, fiddlehead ferns, and ghost leaves. "),
	array ("tag" => "pink and green weddings", "title" => "Ideas for Pink and Green Weddings", "caption" => "Pictures of weddings with a green and pink color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of pink include blush, rose, magenta, fuschia, salmon, and pastels. Pink flowers include roses, peonies, gerbera daisies, lilies, and orchids. Shades of green include sage, apple, lime, forest, and emerald. Leaves, ivy, and grasses are popular green accents to bouquets and centerpieces. Green flowers include hydrangeas, orchids, and gladiolas."),
	array ("tag" => "pink and orange weddings", "title" => "Ideas for Pink and Orange Weddings", "caption" => "Pictures of weddings with an orange and pink color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of pink include blush, rose, magenta, fuschia, salmon, and pastels. Pink flowers include roses, peonies, gerbera daisies, lilies, and orchids."),
	array ("tag" => "pink and purple weddings", "title" => "Ideas for Pink and Purple Weddings", "caption" => "Pictures of weddings with a purple and pink color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of pink include blush, rose, magenta, fuschia, salmon, and pastels. Pink flowers include roses, peonies, gerbera daisies, lilies, and orchids. Shades of purple include lavender, plum, indigo, violet, eggplant, aubergine, and indigo. Purple flowers include lilies, orchids, roses, lavender, campanulas, calla lilies, and hydrangeas."),
	array ("tag" => "pink weddings", "title" => "Ideas for Pink Weddings", "caption" => "Pictures of weddings with a pink color theme: bouquets, pink, decorations, dresses, cakes, gifts, boutonnieres, drinks, place cards, lanterns, flower girl baskets, invitations, and other ideas. Shades of pink include blush, rose, magenta, fuschia, salmon, and pastels. Pink flowers include roses, peonies, gerbera daisies, lilies, and orchids."),
	array ("tag" => "place cards", "title" => "Ideas for Wedding Place Cards", "caption" => "Photos of wedding placecards and seat assignment escort cards, including color ideas, decorations, gifts, and other creative ideas."),
	array ("tag" => "programs", "title" => "Ideas for Wedding Programs", "caption" => "Photos of wedding programs for inspiration, including traditional programs, contemporary designs, color themes, and other creative ideas."),
	array ("tag" => "purple and green weddings", "title" => "Ideas for Purple and Green Weddings", "caption" => "Pictures of weddings with an green and purple color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas."),
	array ("tag" => "purple weddings", "title" => "Ideas for Purple Weddings", "caption" => "Pictures of weddings with a purple color theme: bouquets, centerpieces, decorations, bridesmaid dresses, flower girl dresses, cakes, boutonnieres, flower girl baskets, chair covers, jewelry, sashes, and other ideas. Shades of purple include lavender, plum, indigo, violet, eggplant, aubergine, and indigo. Purple flowers include lilies, orchids, roses, lavender, campanulas, calla lilies, and hydrangeas."),
	array ("tag" => "purses", "title" => "Ideas for Wedding Purses", "caption" => "Pictures of handbags for brides, bridesmaids, and mothers of the bride or groom, including satin handbags, beaded bags, colorful purses, and heirlooms."),
	array ("tag" => "reception rooms", "title" => "Ideas for Wedding Reception Rooms", "caption" => "Pictures of venues decorated for wedding receptions, including hotels, ballrooms, lodges, tents, backyards, wineries, restaurants, and museums."),
	array ("tag" => "red and black weddings", "title" => "Ideas for Red and Black Weddings", "caption" => "Pictures of weddings with a black and red color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of red include apple, burgundy, coral, crimson, fire engine, maroon, ruby, and vermillion. Red flowers include roses, gerbera daisies, orchids, Peruvian lilies, tulips, freesia, hypericum, and calla lilies."),
	array ("tag" => "red and brown weddings", "title" => "Ideas for Red and Brown Weddings", "caption" => "Pictures of weddings with a brown and red color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of red include apple, burgundy, coral, crimson, fire engine, maroon, ruby, and vermillion. Red flowers include roses, gerbera daisies, orchids, Peruvian lilies, tulips, freesia, hypericum, and calla lilies. Shades of brown include tan, auburn, chocolate, sienna, ecru, ochre, rust, and taupe. Brown flowers include roses, orchids, callas, chocolate cosmos, hypercum berries, fiddlehead ferns, and ghost leaves."),
	array ("tag" => "red and green weddings", "title" => "Ideas for Red and Green Weddings", "caption" => "Pictures of weddings with a green and red color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of red include apple, burgundy, coral, crimson, fire engine, maroon, ruby, and vermillion. Red flowers include roses, gerbera daisies, orchids, Peruvian lilies, tulips, freesia, hypericum, and calla lilies. Shades of green include sage, apple, lime, forest, and emerald. Leaves, ivy, and grasses are popular green accents to bouquets and centerpieces. Green flowers include hydrangeas, orchids, and gladiolas. Red and green color schemes are a popular choice for Christmastime weddings."),
	array ("tag" => "red and pink weddings", "title" => "Ideas for Red and Pink Weddings", "caption" => "Pictures of weddings with a pink and red color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of red include apple, burgundy, coral, crimson, fire engine, maroon, ruby, and vermillion. Red flowers include roses, gerbera daisies, orchids, Peruvian lilies, tulips, freesia, hypericum, and calla lilies. Shades of pink include blush, rose, magenta, fuschia, salmon, and pastels. Pink flowers include roses, peonies, gerbera daisies, lilies, and orchids. Red and pink color chemes are popular choices for Valentine's Day weddings, spring weddings, or summer weddings. "),
	array ("tag" => "red and yellow weddings", "title" => "Ideas for Red and Yellow Weddings", "caption" => "Pictures of weddings with a yellow and red color theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of red include apple, burgundy, coral, crimson, fire engine, maroon, ruby, and vermillion. Red flowers include roses, gerbera daisies, orchids, Peruvian lilies, tulips, freesia, hypericum, and calla lilies. Shades of yellow include gold, amber, tangerine, maize, beige, and cream. Yellow flowers include sunflowers, roses, Peruvian lilies, gerbera daisies, orchids, spider flowers, tulips, and calla lilies. cream, lemon, ochre, and gold."),
	array ("tag" => "red weddings", "title" => "Ideas for Red Weddings", "caption" => "Pictures of weddings with a red color scheme: bouquets, centerpieces, flowers, decorations, bridesmaid dresses, cakes, shoes, table settings, accessories, boutonnieres, programs, ceremony decorations, and other ideas. Shades of red include apple, burgundy, coral, crimson, fire engine, maroon, ruby, and vermillion. Red flowers include roses, gerbera daisies, orchids, Peruvian lilies, tulips, freesia, hypericum, and calla lilies."),
	array ("tag" => "ring bearers", "title" => "Ideas for Wedding Ring Bearers", "caption" => "Pictures of ringbearers and other little boys at weddings. Ideas for boys' tuxedos, suits, and ring pillows, as well as ideas for dog ring bearers."),
	array ("tag" => "rings", "title" => "Ideas for Wedding Rings", "caption" => "Pictures of wedding rings, including wedding bands, engagement rings, and diamond rings."),
	array ("tag" => "shoes", "title" => "Ideas for Wedding Shoes", "caption" => "Pictures of shoes for brides, bridesmaids, and flower girls."),
	array ("tag" => "silver and black weddings", "title" => "Ideas for Silver and Black Weddings", "caption" => "Pictures of weddings with a black and silver theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas."),
	array ("tag" => "silver and white weddings", "title" => "Ideas for Silver and White Weddings", "caption" => "Pictures of weddings with a white and silver theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas."),
	array ("tag" => "silver weddings", "title" => "Ideas for Silver Weddings", "caption" => "Pictures of weddings with a silver theme: jewelry, bouquets, centerpieces, flowers, decorations, dresses, cakes, shoes, table settings, accessories, boutonnieres, programs, ceremony decorations, and other ideas."),
	array ("tag" => "spring weddings", "title" => "Spring Wedding Ideas", "caption" => "Pictures of spring weddings: bouquets, centerpieces, decorations, dresses, cakes, boutonnieres, shoes, boots, jewelry, boutonnieres, cake toppers, favors, flower girl dresses, flower girl baskets, and other ideas. Spring weddings often include pastel colors such as pink, light blue, lavender, or sage, or bright colors such as bright pinks or yellows. Spring wedding flowers include tulips, peonies, roses, daffodils, hyacinths, irises, and lilies. "),
	array ("tag" => "stationery", "title" => "Ideas for Wedding Stationery", "caption" => "Pictures of wedding cards and stationery. Ideas for programs, menus, placecards, guestbooks, table numbers, favors, and invitations."),
	array ("tag" => "summer weddings", "title" => "Summer Wedding Ideas", "caption" => "Pictures of summer weddings: bouquets, centerpieces, decorations, dresses, cakes, boutonnieres, shoes, boots, jewelry, boutonnieres, cake toppers, favors, flower girl dresses, flower girl baskets, and other ideas. Summer weddings often include bright colors, green decorations, and outdoor settings.  Summer wedding flowers include calla lilies, daisies, geraniums, hydrangeas, roses, and sunflowers. Most colors are appropriate for summer weddings, and popular colors include green, pink, red, yellow, and blue."),
	array ("tag" => "table numbers", "title" => "Ideas for Wedding Table Numbers", "caption" => "Pictures of unique ways to identify tables at wedding receptions."),
	array ("tag" => "table settings", "title" => "Ideas for Wedding Table Settings", "caption" => "Pictures of wedding place settings, including dishes, linens, silverware, favors, and place cards."),
	array ("tag" => "unity candles", "title" => "Ideas for Wedding Unity Candles", "caption" => "Pictures of ideas for unity candles, as well as candle alternatives, such as sand or wine ceremonies."),
	array ("tag" => "veils", "title" => "Ideas for Wedding Veils", "caption" => "Pictures of bridal veils, including fingertip length, cathedral length, shoulder length, mantilla, and birdcage veils."),
	array ("tag" => "venues", "title" => "Ideas for Wedding Venues", "caption" => "Photos of wedding venues, featuring scenic views from a variety of settings, including mountains, cities, parks, chapels, and waterfronts."),
	array ("tag" => "white weddings", "title" => "Ideas for White Weddings", "caption" => "Pictures of weddings with a white theme: bouquets, centerpieces, flowers, decorations, flower girl dresses, cakes, ring bearer pillows, ring bearer suits, purses, accessories, ceremony decorations, shoes, flower girl baskets, favors, lanterns, and other ideas. Shades of white include ivory, cream, beige, and pure white. White flowers include calla lilies, roses, peonies, hydrangeas, alstroemerias, gerbera daisies, Queen Anne's lace, orchids, Anastasia spider flowers, and gardenias."),
	array ("tag" => "winter weddings", "title" => "Winter Wedding Ideas", "caption" => "Pictures of winter weddings and snowy settings: bouquets, centerpieces, decorations, dresses, cakes, boutonnieres, shoes, boots, jewelry, boutonnieres, cake toppers, favors, flower girl dresses, flower girl baskets, and other ideas. Winter decorations often include evergreen trees or boughs, poinsettias, snowflakes, and pine cones.  Winter wedding flowers include amaryllis, camellias, jasmine, orchids, poinsettias, and holly. Winter wedding colors often include red, green, silver, white, and blue."),
	array ("tag" => "yellow and blue weddings", "title" => "Ideas for Yellow and Blue Weddings", "caption" => "Pictures of weddings with a blue and yellow theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Blue colors include turquoise, periwinkle, navy, and indigo. Blue flowers include hyacinths, hydrangeas, and delphiniums. Shades of yellow include gold, amber, tangerine, maize, beige, and cream. Yellow flowers include sunflowers, roses, Peruvian lilies, gerbera daisies, orchids, spider flowers, tulips, and calla lilies. cream, lemon, ochre, and gold."),
	array ("tag" => "yellow and green weddings", "title" => "Ideas for Yellow and Green Weddings", "caption" => "Pictures of weddings with a green and yellow theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of yellow include gold, amber, tangerine, maize, beige, and cream. Yellow flowers include sunflowers, roses, Peruvian lilies, gerbera daisies, orchids, spider flowers, tulips, and calla lilies. cream, lemon, ochre, and gold. Shades of green include sage, apple, lime, forest, and emerald. Leaves, ivy, and grasses are popular green accents to bouquets and centerpieces. Green flowers include hydrangeas, orchids, and gladiolas."),
	array ("tag" => "yellow and orange weddings", "title" => "Ideas for Yellow and Orange Weddings", "caption" => "Pictures of weddings with an orange and yellow theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of yellow include gold, amber, tangerine, maize, beige, and cream. Yellow flowers include sunflowers, roses, Peruvian lilies, gerbera daisies, orchids, spider flowers, tulips, and calla lilies. cream, lemon, ochre, and gold."),
	array ("tag" => "yellow and purple weddings", "title" => "Ideas for Yellow and Purple Weddings", "caption" => "Pictures of weddings with a purple and yellow color scheme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, invitations, flower girl dresses, flower girl baskets, sashes, accessories, jewelry, table settings, programs, and other ideas. Shades of yellow include gold, amber, tangerine, maize, beige, and cream. Yellow flowers include sunflowers, roses, Peruvian lilies, gerbera daisies, orchids, spider flowers, tulips, and calla lilies. cream, lemon, ochre, and gold. Shades of purple include lavender, plum, indigo, violet, eggplant, aubergine, and indigo. Purple flowers include lilies, orchids, roses, lavender, campanulas, calla lilies, and hydrangeas."),
	array ("tag" => "yellow weddings", "title" => "Ideas for Yellow Weddings", "caption" => "Pictures of weddings with a yellow theme: bouquets, centerpieces, decorations, bridesmaid dresses, cakes, boutonnieres, ceremony decorations, flower girl dresses, jewelry, lanterns, table settings, place cards, and other ideas. Shades of yellow include gold, amber, tangerine, maize, beige, and cream. Yellow flowers include sunflowers, roses, Peruvian lilies, gerbera daisies, orchids, spider flowers, tulips, and calla lilies. cream, lemon, ochre, and gold.")
);

$title_text = getTitleText($text_list, $tag_list);

// Get header...
require_once('header.php');

// Echo images....


//Detect special conditions devices
$iPod = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
$iPhone = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
$iPad = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
$isMobile = ($iPod || $iPhone || $iPad || $Android);

echo "

<div id='venuePage' class='pageContents'>

	<div class='venuePageContents'>
	
";

if ($isMobile) {
	// Add a banner add for mobile
	echo "
	<div id='cgpWeddingIdeasMobileAds' style='float:right; margin-right:20px;'>
		<script type='text/javascript'><!--
			// XHTML should not attempt to parse these strings, declare them CDATA.
			/* <![CDATA[ */
			window.googleAfmcRequest = {
				client: 'ca-mb-pub-1988280901434851',
				format: '320x50_mb',
				output: 'html',
				slotname: '4926793021',
			};
		/* ]]> */
		//--></script>
		<script type='text/javascript' src='http://pagead2.googlesyndication.com/pagead/show_afmc_ads.js'></script>
	</div>
	";
}

echo "	
	<h1>WEDDING PLANNING IDEAS</h1>
	
	<h2>".$title_text['title']."</h2>
	
	<p>".$title_text['caption']."</p>

";	

if (!$isMobile){

	echo "
	<div id='cgpWeddingIdeasAds' style='float:right; margin-right:20px;'>
		<script type='text/javascript'><!--
			/* CGP Wedding Ideas */
			google_ad_client = 'ca-pub-1988280901434851';
			google_ad_slot = '5490349513';
			google_ad_width = 160;
			google_ad_height = 600;
		//-->
		</script>
		<script type='text/javascript' src='http://pagead2.googlesyndication.com/pagead/show_ads.js'></script>
	</div>
	";

}

echo "		
	<p align='left'>";


foreach($media_id_list as $media_id){

	$image = MediaTable::getMedia($site_id, $media_id);
	
	$image_url = "http://files.apollosites.com/$site_id/" . $image['filepath'] . $image['filename'];
	$thumb_url = "http://files.apollosites.com/$site_id/" . $image['filepath'] . $image['thumb_filename'];
	$title =  $image['title'];
	$description = $image['description'];										
	$alt_text = $image['tags'];
		
	echo "<img src='$image_url' title='$title' alt='$alt_text'/><br/>";  
	if ($title != ''){
		echo "<span class='title'>$title</span><br/>";
	} 
	echo "<span class='caption'>$description</span>"; 
	echo "<br/><br/>";	
}

echo "
	</p>
</div>";

?>
<script type="text/javascript">
	$(document).ready(function(){	
		$('#page_33').addClass('selected');	
		$('#navigation').accordion( "activate" , '#page_29' );
	});	
</script>
<?

// Get header...
require_once('footer.php');



function getTitleText($text_list, $tag_list){

	$data = array('caption' => '', 'title' => '');
	
	foreach ($text_list as $text){
		foreach($tag_list as $tag){
			if ($text['tag'] == $tag){
				$data['caption'] = $text['caption'];
				$data['title'] = $text['title'];
				return $data;
			}
		}
	}
}

?>