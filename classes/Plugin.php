<?php 
/**
 *
 * @package B2WMercadoPago
 */

namespace B2WMercadoPago;

class Plugin {
		
	public function __construct()
	{
		new Admin();
		new FrontEnd();
		new MercadoPagoConnect();
	}

}
