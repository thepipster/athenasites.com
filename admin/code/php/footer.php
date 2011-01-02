
                    </div> <!-- MainContent -->

                </td>
            </tr>
        </table>

    </div>

</body>
</html>

<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">

    defines.session_id = '<?php echo session_id(); ?>';
    defines.domain = '<?php echo $domain; ?>';
	
    $(document).ready(function(){ssMain.init(<?= $current_site_id ?>);});

</script>