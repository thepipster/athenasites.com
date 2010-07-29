<?php $search_text = "Search"; ?> 

<form role="search" method="get" id="searchform" action="<?php bloginfo('home'); ?>/">
	<div>
		<input type="text" value="<?php echo $search_text; ?>"  name="s" id="s"  
				onblur="if (this.value == '') {this.value = '<?php echo $search_text; ?>';}"  
				onfocus="if (this.value == '<?php echo $search_text; ?>'){this.value = '';}" /> 
		<input type="submit" id="searchsubmit" value="Search" />
	</div>
</form>