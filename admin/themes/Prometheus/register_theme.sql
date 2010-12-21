INSERT INTO `apollo_Theme` (`id`,`theme_name`) VALUES (2,'CGP4');

INSERT INTO `apollo_ThemeParas` (`theme_id`,`para_type`,`page_template_name`,`description`,`admin_order`,`help_text`)
VALUES
	(2,'gallery','homepage.php','Home page gallery',1,'Choose a gallery with decent size images, with an aspect ratio of 1.5 to avoid image distortions (aspect ratio is width divided by height). A good size to use is 1200x800' ),
	(2,'transition-effect','homepage.php','Gallery Transition effect', 2, 'Choose an image transition effect' ),
	(2,'transition-pause','homepage.php','Time between image transitions', 3, 'Choose a time between image transition (in seconds)'),

	(2,'gallery','gallerypage.php','Basic gallery',1,'Choose a gallery with decent size images, with an aspect ratio of 1.5 to avoid image distortions (aspect ratio is width divided by height). A good size to use is 1200x800' ),
	(2,'transition-effect','gallerypage.php','Gallery Transition effect', 2, 'Choose an image transition effect' ),
	(2,'transition-pause','gallerypage.php','Time between image transitions', 3, 'Choose a time between image transition (in seconds)'),

	(2,'gallery','textandgallerypage.php','Mini gallery',1,'Choose a gallery with smaller images, a good size to use is 500x500 images'),
	(2,'transition-effect','textandgallerypage.php','Gallery Transition effect', 2, 'Choose an image transition effect' ),
	(2,'transition-pause','textandgallerypage.php','Time between image transitions', 3, 'Choose a time between image transition (in seconds)'),

	(2,'image','textandimagepage.php','Image displayed in right column',1,'Choose any image, a good size to use is 500x500 images'),

	(2,'gallery','imagelistpage.php','Image list',1,'Choose any gallery, the images will be listed in basic html'),


	(2,'image','textandgallerypage.php','Image to use if no flash player installed',1,'Choose an image that should be displayed if there is no flash player present, a good size to use is 500x500 images'),





	(1,1,'gallery','gallerypage.php','Basic portfolio page',1,NULL),
	(2,1,'gallery','homepage.php','Home page with gallery',1,NULL),
	(3,1,'image','contentleftpage.php','background photo',1,'Choose a background picture that will appear as the background of this page'),
	(4,1,'image','contentrightpage.php','background photo',1,'Choose a background picture that will appear as the background of this page'),
	(5,1,'image','contactpage.php','background photo',2,NULL),
	(6,1,'email','contactpage.php','email',1,NULL),
	(7,1,'image','all','Logo (450 x 164)',1,'Your site logo, you can use any image but its recommended to use an image that supports transparancy (such as png or gif) and make the backround transparent.'),
	(8,1,'font-size','all','Font size',1,NULL),
	(9,1,'font-family','all','Font Family',1,NULL),
	(10,1,'favicon','all','Fav Icon',1,NULL),
	(11,1,'color','all','Background Color',1,NULL),
	(12,1,'color','all','Foreground Color',1,NULL),
	(15,1,'image','default','background photo',1,'Choose a background picture that will appear as the background of this page'),
	(16,1,'spam-filter','contactpage.php','Akismet spam filter',1,'This options determines if content form your contact form is passed through a spam filter before it is emailed to you.');

