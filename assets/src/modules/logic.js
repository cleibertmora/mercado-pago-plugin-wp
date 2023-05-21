import $ from 'jquery'
import { finalizacion_proceso, controlador_de_vista } from './elements'

export async function renderCardPaymentBrick (app){
	const nombre = $.trim(app.formElem.reservaAnombre.val());
	const apellido = $.trim(app.formElem.reservaAapellido.val());
	app.reservaDetalle = `${nombre} ${apellido} realiza un pago por concepto de reserva por el modelo: ${app.the_data.post_title} en el sitio web.`

	const settings = {
	initialization: {
		  amount: app.campoMontoFormateado.unmaskedValue, //valor del pago a realizar
		},
	customization: {
        visual: {
            texts: {
				formSubmit: `Reservar`
            },
        }
    },
	callbacks: {
	  onReady: () => {
	    // callback llamado cuando Brick esté listo
	  },
	  onSubmit: (cardFormData) => {
	    
	    return new Promise((resolve, reject) => {
	    	$.post(app.the_ajax_opt.ajax_url, {
            	_ajax_nonce: app.the_ajax_opt.nonce,
            	action: 'sendpayment',
            	descripcion: app.reservaDetalle,
            	reservaAnombre: nombre,
            	reservaAapellido: apellido,
            	cardFormData: cardFormData
	        }).done((response) => {
	            // recibir el resultado del pago
	            app.responseMP = response;
	            manejar_respuestas_mercado_pago(app)
	            resolve();
	        }).error((error) => {
	        	// tratar respuesta de error al intentar crear el pago
	            app.responseMP = {
	            	status: "error_server"
	            };
	            manejar_respuestas_mercado_pago(app)
	            reject();
	        })
		})
	  },
	  onError: (error) => { 
	    // callback llamado para todos los casos de error de Brick
	  },
	},
	};
	
	const cardPaymentBrickController = await app.bricksBuilder.create('cardPayment', 'b2w-render-checkout-mercado-pago', settings);
};

export function openModal(app){
	
	app.modalElem.modal.show()
}

export function validateForm(app){
	const nombre = app.formElem.reservaAnombre.val()
	const apellido = app.formElem.reservaAapellido.val()
	const monto = app.campoMontoFormateado.unmaskedValue
	const minMonto = app.minMontoReserva
	const section_feedback = app.formElem.formFeedback
	const errorMsj = ''

	section_feedback.empty()

	// Validar los campos de nombre
	if(nombre === '' || apellido === ''){
		section_feedback.append(`
			<span class="text-danger">
				Por favor escribir su nombre para continuar.
			</span>
		`)

		return false;
	}

	// Validar campo de monto

	if(monto < minMonto){
		section_feedback.append(`
			<span class="text-danger">
				El monto minimo para reservar es de <b>$${montoFormat(minMonto)}</b>.
			</span>
		`)

		return false;
	}

	// Dar permiso

	return true;
}

export function montoFormat(monto){
	return parseFloat(monto)
		.toLocaleString('es-ES');
}

function manejar_respuestas_mercado_pago(app){
	const res = app.responseMP
	let template = '';

	// Cuando el pago es aprobado
	if(res.status === "approved"){
		app.dataRes = formatear_data_para_mostrar_en_pantalla(res, true)
		template = finalizacion_proceso(app)
	} // Cuando el pago es rechazado o error general
	else{
		app.dataRes = formatear_data_para_mostrar_en_pantalla(res, false)
		template = finalizacion_proceso(app)
	}

	app.responseElem.handleResponse.empty();
	app.responseElem.handleResponse.append(template);

	controlador_de_vista('response_mp', app);
}

function formatear_data_para_mostrar_en_pantalla(res, aprobado){
	if(!aprobado){
		let errorApi = '';

		switch(res.status_detail){
			case 'cc_rejected_other_reason':
				errorApi = "Sin contacto con entidad bancaria"
				break;
			case 'cc_rejected_call_for_authorize':
				errorApi = "No autorizado por entidad bancaria"
				break;
			case 'cc_rejected_insufficient_amount':
				errorApi = "Sin fondos para cubrir la transacción"
				break;
			case 'cc_rejected_bad_filled_security_code':
				errorApi = "El código de seguridad no es el correcto"
				break;
			case 'cc_rejected_bad_filled_date':
				errorApi = "Tarjeta expirada"
				break;
			case 'error_server':
				errorApi = "Sin respuesta desde Mercado Pago"
				break;
			default:
				errorApi = "Problemas con el servicio"
		}

		return {
			titulo: "Pago no aprobado",
			descripcion: "<b>No hemos podido procesar tu pago de reserva</b><br><br>Por favor intenta de nuevo en unos minutos o has clic debajo",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
				  <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
				  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
				</svg>`,
			transaccion_nro: null,
			color: "warning",
			errorApi
		}
	}

	if(aprobado){
		return {
			titulo: "Pago aprobado",
			descripcion: "<b>Uno de nuestros asesores se pondrá en contacto con usted para continuar con el proceso.</b> <br><br> ¿Alguna duda?",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
				  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
				</svg>`,
			transaccion_nro: res.id,
			color: "success",
			errorApi: null
		}
	}	
}



