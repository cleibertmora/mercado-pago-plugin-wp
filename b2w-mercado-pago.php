<?php

/**
 * Author: Bike 2 Web
 * Version: 1.0.0
 * Plugin Name: B2W - Mercado Pago
 * Description: Plugin para integrar mercado pago al sitio del Dealer
 */


if ( ! defined( 'ABSPATH' ) ) exit;

require_once 'vendor/autoload.php';

use B2WMercadoPago\Plugin;

if ( class_exists( 'B2WMercadoPago\Plugin' ) ) {
	// VALIDACION MULTISITE
    if(in_array(get_current_blog_id(), array(1, 22, 30))){
        $the_plugin = new Plugin();
    }
}
