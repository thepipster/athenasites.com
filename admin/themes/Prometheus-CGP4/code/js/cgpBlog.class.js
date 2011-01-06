var cgpBlog = {

    init : function(){

        var setup = false;
	
        // See if this is a category....
        var sp1 = location.href.indexOf('blog/cat/');
        if (sp1 > 0){
            var cat = location.href.substring(sp1 + 9);
            cat = cat.substring(0, cat.length-1);
            cgpCommon.init('blog', cat);
            setup = true;
        }
	
        // see if this is a tag....
        sp1 = location.href.indexOf('blog/?tag=');
        if (sp1 > 0){
            var tag = location.href.substring(sp1 + 10);
            cgpCommon.init('blog', tag);
            setup = true;
        }

        if (!setup){
            cgpCommon.init('blog', 'all');
        }
    }
}