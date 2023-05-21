<?php
/**
 *
 * @package B2WMercadoPago
 */

namespace B2WMercadoPago;

/**
 * Class Admin.
 */

class Admin {
	public function __construct()
	{
		add_action( 'admin_menu', array($this, 'add_admin_menu_page') );
	}

	public function add_admin_menu_page()
	{
		add_menu_page( 'B2W Mercado Pago', 'B2W Mercado Pago', 'manage_options', 'myplugin/myplugin-admin.php', array($this, 'wporg_options_page_html'), 'dashicons-welcome-comments', 99 );
	}

	public function wporg_options_page_html() {
    ?>
	    <div class="wrap">
	      Hello World
	    </div>
    <?php
	}
}