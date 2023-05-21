<?php
/**
 *
 * @package B2WMercadoPago
 */

namespace B2WMercadoPago;

/**
 * Class FrontEnd.
 */

class FrontEnd { 

	public function __construct()
	{
		add_action( 'wp_enqueue_scripts', array($this, 'load_front_end_script') );
		add_filter( 'the_content', array($this, 'add_elem_to_render_mercado_pago_checkout' ));
	}

	public function load_front_end_script()
	{
		global $post;

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

		if ( !is_admin() && is_single() && 'post' == get_post_type() && $post->post_type === 'post' ) {
			$the_data = array(
				'post_id'    => get_the_ID(),
				'post_title' => get_the_title(),
				'url_action' => esc_url(admin_url('admin-post.php'))
			);

			wp_enqueue_style('b2w-mercado-pago-frontend-styles', plugins_url( '../assets/build/frontend.css', __FILE__ ));
			wp_enqueue_script( 'b2w-mercado-pago-sdk', 'https://sdk.mercadopago.com/js/v2', null, null, true );
			wp_enqueue_script( 'b2w-mercado-pago-front-end', plugins_url( '../assets/build/frontend.js', __FILE__ ), array('jquery'), null, true );
			wp_localize_script( 'b2w-mercado-pago-front-end', 'b2wMercardoPagoData', array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce' => wp_create_nonce('b2wMer'),
				'public_key_mp' => $credentialsArr[$thisBlogId]['plublic_key'],
				'nroWhatsapp' => $credentialsArr[$thisBlogId]['nroWhatsapp'],
				'minMontoReserva' => $credentialsArr[$thisBlogId]['minMonto'],
				'owner' => $credentialsArr[$thisBlogId]['owner'],
				'politicas_terminos' => array(
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut lacinia orci.",
					"Clei elit nisl, dapibus vitae leo ut, venenatis ullamcorper nunc. Nam ac viverra magna, dapibus congue ipsum. Etiam quis tincidunt dolor.",
					"Curabitur non dolor turpis. Morbi lobortis scelerisque tellus, a bibendum erat molestie sit amet. Vivamus gravida turpis ut arcu convallis, a posuere nunc condimentum. In malesuada placerat neque faucibus aliquam.",
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
				),
				'the_data' => wp_json_encode($the_data),
				'site_url' => $thisBlogId
			) );
		}
	}

	public function add_elem_to_render_mercado_pago_checkout($content)
	{

		global $post;

		if ( is_single() && 'post' == get_post_type() && $post->post_type === 'post' ) {

			return $content . '
				<div id="b2w-payment-form-container"></div>';
		}

		return $content;
	}
	
}