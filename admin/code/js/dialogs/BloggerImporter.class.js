/**
* Javascript interface to allow importing of posts and comments from Google's
* Blogger service
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 17th September, 2010
*/
var BloggerImporter = {

    // ////////////////////////////////////////////////////////////////////////

    show : function(){
        /*
Each blog you create has its own unique ID number. Usually, you won't need to worry about this, but occasionally it can be useful to know this number.
For instance, several third-party services you may want to install require a blog ID number. So if you ever need to figure this out, here's how:

First, e

At the end of the address, you can see that it says blogID=XXXXXX where the X's represent your blog's ID. In the example above, this is 5910562.
*/

        var txt = "";
        txt += "<div id='apolloBlogImporter'>";
        txt += "    <fieldset>";
        txt += "        <legend>Progress</legend>";
        txt += "        <div class='importProgress' id='status' align='center'></div>";
        txt += "        <div id='progressBar'></div>";
        txt += "    </fieldset>";
        txt += "    <fieldset>";
        txt += "        <legend>Controls</legend>";
        txt += "        <table border='0' width='100%'>";
        txt += "            <tr>";
        txt += "                <td><span class='label' id=''>Blog ID</span></td>";
        txt += "                <td><input type='text' id='bloggerID' name='bloggerID' value=''></td>";
        txt += "            </tr>";
        txt += "        </table>";
        txt += "    </fieldset>";
        txt += "    <fieldset>";
        txt += "        <legend>Help</legend>";
        txt += "            <h3>What is my blog ID number?</h3>";
        txt += "            <p>To find your blog ID, first log in to Blogger. Then choose the blog whose ID you want to find, and click on its name in the Dashboard, ";
        txt += "               just like you do when you want to post to it, or change the settings. </p><p>From any of the posting, settings, or template pages, you can find ";
        txt += "               your blog's ID number. Just look in your browser's address bar, at the end of the address you can something like blogID=XXXXXX</p>"
        txt += "    </fieldset>";
        txt += "</div>";

        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: true,
            width:385,
            //height:260,
            resizable:false,
            buttons: {
                "Start": BloggerImporter.startImport,
                "Done": function() {
                    $(this).dialog('close');
                }
            },
            title: 'Import your Blogger blog'
        });

        // Progress bar.....

        $("#progressBar").progressbar({
            value: 0
        });
        AthenaDialog.setProgressBarColorMap("#progressBar", 0, 100, 'roygbiv');

    },

    // ////////////////////////////////////////////////////////////////////////

    startImport : function(){

        if ($('#ljuser').val() == "" || $('#ljpass').val() == "") {
            BloggerImporter.onError("You must enter a valid username and password!");
            return;
        }

        BloggerImporter.onMessage("Importing....");
        //$('#progressBar').html("<div align='center'><img src='"+defines.root_url+"images/spinner.gif'/></div>");

        BloggerImporter.getComments();


    },

    // ////////////////////////////////////////////////////////////////////////

    getPosts : function(){
    
    // http://code.google.com/apis/gdata/docs/json.html
    	
    // GET http://www.blogger.com/feeds/blogID/posts/default
    // GET http://www.blogger.com/feeds/blogID/posts/default?published-min=2008-03-16T00:00:00&published-max=2008-03-24T23:59:59

    // http://hollypacione.blogspot.com/feeds/posts/default
    // http://stackoverflow.com/questions/2052512/obtain-a-blogger-blog-id-from-its-friendly-url-without-screen-scraping
    },

    getComments : function(){

        var username = "hollypacione";
        var feedURL = "http://"+username+".blogspot.com/feeds/comments/default";

        //        $.getJSON(feedURL+"?alt=json-in-script&callback=BloggerImporter.onGotCommentData()");


        // blog-6545474407612624437.post-2636905987669815419
        
        //$.getJSON(feedURL, BloggerImporter.onGotCommentData);
        
        var paras = {
            alt : 'json-in-script'
        };

        $.ajax({
            url: feedURL,
            type: 'get',
            dataType: "jsonp",
            success: BloggerImporter.onGotCommentData,
            data: paras
        });
        
    // Get comment feed in JSON
    // http://hollypacione.blogspot.com/feeds/comments/default?alt=json
    //
    // Need the blog id to get comments
    // OR
    // http://hollypacione.blogspot.com/feeds/comments/default
    // http://hollypacione.blogspot.com/feeds/postID/comments/default

    },

    /**
     * Parse the JSON comment data returned by the Google Blogger API
     */
    onGotCommentData : function(data){

        var feed = data.feed;
        var entries = feed.entry || [];
        var txt = "";

        for (var i = 0; i < entries.length; ++i) {
            var entry = entries[i];
            var title = entry.title.$t;
            //var start = (entry['gd$when']) ? entry['gd$when'][0].startTime : "";
            txt += title;
        }

        alert(txt);
    },
    
    // ////////////////////////////////////////////////////////////////////////

    onComplete : function(ret){

        $('#progressBar').html("");

        if (ret.result == 'ok'){
            $('#status').html("<span style='color:green'>Import completed! Refresh the browser to see the changes.</span>");
        }
        else {
            $('#status').html("<span style='color:red'>"+ret.data+"</span>");
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    onMessage : function(msg){
        $('#status').html("<span style='color:blue'>"+msg+"</span>");
    },

    onError : function(msg){
        $('#status').html("<span style='color:red'>"+msg+"</span>");
    }

// ////////////////////////////////////////////////////////////////////////

}