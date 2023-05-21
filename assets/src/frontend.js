import $ from 'jquery'
import "./css/frontend.scss"
import { main, form, checkout, handleResponse, eventos_dom, mask_currency_plugin } from './modules/elements'
import { renderCardPaymentBrick, openModal } from './modules/logic'

/*
* @plugin B2W Mercado Pago Plugin
*
* -- Archivo Principal
*
* Inicialización del Plugin
* Bootstraping de todas las funcionalidades
*
*
*/

$(function() {
    // CARGAR APP
    var app = new Object();
    app.container = $("#b2w-payment-form-container");
	app.the_ajax_opt = b2wMercardoPagoData;
	app.the_data = JSON.parse(app.the_ajax_opt.the_data);
	app.clase_css_estilos_encapsulados = "b2w-estilos-encapsulados";

	// AGREGAR CLASES CSS
	app.container.addClass(app.clase_css_estilos_encapsulados);
	
	// TO-DO: obtener de manera los terminos y condiciones
	app.terminosCondiciones = app.the_ajax_opt.politicas_terminos

	// TO-DO: obtener de manera el nro. WhatsApp
	app.whatsaapLink = `https://wa.me/${app.the_ajax_opt.nroWhatsapp}`;

	// TO-DO: obtener de manera dinamica el public key
	app.publicKey = app.the_ajax_opt.public_key_mp;
		
	// TO-DO: obtener de manera dinamica el monto minimo para reserva
	app.minMontoReserva = app.the_ajax_opt.minMontoReserva;
    
    // Construcción del HTML en DOM
	app.mainContainerApp = main(app);
	app.formElem = form(app);
	app.responseElem = handleResponse(app);
	
	// Formatear campo de moneda
	app.campoMontoFormateado = mask_currency_plugin(app);
	
	// Atar eventos en el DOM
	eventos_dom(app, openModal);
});