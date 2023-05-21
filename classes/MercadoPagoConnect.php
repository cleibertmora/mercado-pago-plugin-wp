<?php
/**
 *
 * @package B2WMercadoPago
 */

namespace B2WMercadoPago;
require_once __DIR__ . '/../vendor/autoload.php';

/**
 * Class MercadoPagoConnect.
 */

class MercadoPagoConnect {
	public function __construct()
	{
		add_action( 'wp_ajax_nopriv_sendpayment', array($this, 'proccess_mercado_pago_request') );
	}

	public function proccess_mercado_pago_request()
	{
		check_ajax_referer( 'b2wMer' );

		// this section is just for iteration proccess do not extend

		$thisBlogId = get_current_blog_id();
		$credentialsArr = array(
			'1' => array(
				'owner' => 'Cle',
				'plublic_key' => 'TEST-d49603d3-4c98-4c6f-ad4c-6021d47f406a',
				'secrect_key' => 'TEST-2735390642111949-061518-9f3cda7b0c93e4c552bf9c3b94f53e01-141374863',
				'nroWhatsapp' => '593978821259',
				'minMonto' => 3000
			)
		);

		// this section is just for iteration proccess do not extend


		// INICIAR MERCADO PAGO

	    \MercadoPago\SDK::setAccessToken($credentialsArr[$thisBlogId]['secrect_key']);

	    $cardInfo = $_POST["cardFormData"];

		$payment = new \MercadoPago\Payment();
	    
	    $payment->transaction_amount = (float)$cardInfo['transaction_amount'];
	    $payment->token = $cardInfo['token'];
	    $payment->description = sanitize_text_field($_POST['descripcion']);
	    $payment->installments = (int)$cardInfo['installments'];
	    $payment->payment_method_id = $cardInfo['payment_method_id'];
	    $payment->issuer_id = (int)$cardInfo['issuer'];

	    $payer = new \MercadoPago\Payer();
	    $payer->email = $cardInfo['payer']['email'];
	    $payer->identification = array(
	        "type" => $cardInfo['payer']['identification']['type'],
	        "number" => $cardInfo['payer']['identification']['number']
	    );
	    $payer->first_name = sanitize_text_field($_POST['reservaAnombre']);
	    $payer->last_name = sanitize_text_field($_POST['reservaAapellido']);
	    $payment->payer = $payer;
	    
	    $payment->save();

		$response = array(
	        'error' => $payment->error,
	        'status' => $payment->status,
	        'status_detail' => $payment->status_detail,
	        'id' => $payment->id,
	        'payer' => $payment->payer,
	        'transaction' => $payment->transaction_details
	    );

		wp_send_json($response);
	}
}