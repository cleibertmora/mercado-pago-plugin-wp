import $ from 'jquery'
import { Modal } from 'bootstrap'
import { validateForm, montoFormat, renderCardPaymentBrick } from './logic'
import IMask from 'imask'

export function main(app){
	app.container.append(`
		<div class="card" style="background:#f6f6f6">
			<div class="card-body">
				<div class="b2w-mp-view" id="b2w-form-section"></div>
				<div class="b2w-mp-view" style="display:none" id="b2w-checkout-section"></div>
			    <div class="b2w-mp-view" style="display:none" id="b2w-response-section"></div>
			</div>
		</div>
	`)

	return {
		formContainer: $("#b2w-form-section"),
		checkoutContainer: $("#b2w-checkout-section"),
		responseContainer: $("#b2w-response-section"),
		views: $(".b2w-mp-view")
	};
}

export function checkout(app){
	
	app.mainContainerApp.checkoutContainer.empty();

	app.mainContainerApp.checkoutContainer.append(`
		<div id="bw2-header-mercado-pago-checkout"></div>
		<div id="b2w-render-checkout-mercado-pago"></div>
	`);

	renderCardPaymentBrick(app);

	return {
		title: $("#bw2-header-mercado-pago-checkout"),
		MPContainer: $("#b2w-render-checkout-mercado-pago"),
	};
}

export function handleResponse(app){
	app.mainContainerApp.responseContainer.append(`
		<div id="b2w-render-response-mercado-pago"></div>
	`)

	return {
		handleResponse: $("#b2w-render-response-mercado-pago")
	};
}

export function form(app){
	let the_form = `
		<h3 class="text-center my-1">¡Reserva tu moto YA!</h3>
		<p class="text-center">
			Desde aquí mismo puedes dejar reservado tu modelo desde <b>$${montoFormat(app.minMontoReserva)}</b>, rápido y sencillo. Luego puedes continuar el proceso en nuestra agencia.
		</p>
		<div class="d-flex justify-content-center">
			<form id="b2w-form-reservar-monto"  style="width:70%" class="row">
				<label><b>Reservar a nombre:</b></label>
				<div class="input-group my-3">
			    	<span class="input-group-text">
			    		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-person-fill" viewBox="0 0 16 16">
					  		<path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-1 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-3 4c2.623 0 4.146.826 5 1.755V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1.245C3.854 11.825 5.377 11 8 11z"/>
						</svg>
					</span>
					<input id="b2w-nombre-a-reservar-para-moto" type="text" class="form-control" placeholder="Nombre">
					<input id="b2w-apellido-a-reservar-para-moto" type="text" class="form-control" placeholder="Apellido">
				</div>
			    <div class="input-group mb-3">
			    	<span class="input-group-text">
			    		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
						  <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
						</svg>
			    	</span>
					<input id="b2w-monto-a-reservar-para-moto" type="text" value="${app.minMontoReserva}" class="form-control" placeholder="500.000">
				</div>
				<!-- Terminos y Condiciones -->
					<div style="background:#fff; font-size:0.8rem; max-height: 180px; overflow: auto; display:none" class="mb-3" id="b2w-terminos-condiciones-container">
						<p class="text-center mt-4"><b>Términos y condiciones de reserva</b></p>
						<ol>
						${app.terminosCondiciones.map(termino => {
							return `<li>${termino}</li>`
						}).join('')}
						</ol>
					</div>
				<!-- Terminos y Condiciones -->
				<div class="mb-3 form-check align-middle">
				    <input type="checkbox" class="form-check-input" id="b2w-aceptar-terminos-reserva">
				    <label class="form-check-label" for="b2w-aceptar-terminos-reserva">
				    	<small>Estoy de acuerdo con hacer una reserva online en este sitio web.</small>
				    	<!-- small>Estoy de acuerdo con los términos y condiciones de la reserva online.</small -->
				    </label>
			  	</div>
				<div class="d-grid gap-2">
				 	<button disabled type="submit" class="btn btn-dark" id="b2w-aperturar-checkout">
						<b>¡RESERVAR!</b>
					</button>
				</div>
			</form>
		</div>
		<div id="b2w-form-feedback-error" class="my-3 text-center"></div>
	`;

	app.mainContainerApp.formContainer.append(the_form);

	return {
		form: $("#b2w-form-reservar-monto"),
		monto: $("#b2w-monto-a-reservar-para-moto"),
		reservaAnombre: $("#b2w-nombre-a-reservar-para-moto"),
		reservaAapellido: $("#b2w-apellido-a-reservar-para-moto"),
		formFeedback: $("#b2w-form-feedback-error"),
		aceptarTerminos: $("#b2w-aceptar-terminos-reserva"),
		formBoton: $("#b2w-aperturar-checkout"),
		terminosContainer: $("#b2w-terminos-condiciones-container")
	};
}

export function finalizacion_proceso(app){
	const data = app.dataRes

	return `
		<div class="row justify-content-center text-center">
			<div style="width:80%">
				<div class="alert alert-${data.color} text-center" role="alert">
				  ${data.icon} <h4 class="pt-1 mt-1">${data.titulo}</h4>
				  ${data.transaccion_nro ? `<h5 class="my-1">Nro. de Transacción: ${data.transaccion_nro}</h5>` : ''}
				  ${data.errorApi ? `<small class="my-1"><b>Detalle:</b> ${data.errorApi}</small>` : ''}
				</div>
				<p>${data.descripcion}</p>
				<div class="d-grid gap-2">
					<a target="_blank" href="${app.whatsaapLink}" class="btn btn-success" type="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
						  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
						</svg> Comunicarme por Whatsapp
					</a>
				</div>
			<div>
		</div>
		`
}

export function construir_header_checkout(app){
	const nombreCompleto = `${$.trim(app.formElem.reservaAnombre.val())} ${$.trim(app.formElem.reservaAapellido.val())}`
	
	let template = `
		<div class="row mb-4">
			<div class="col-sm-12">
				<button id="b2w-btn-volver-al-formulario" class="btn-sm btn-dark mb-3">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
					  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
					</svg> Volver
				</button>
			</div>
			<div class="col-sm-12">
				<span>
					<b>Reserva a Nombre:</b> ${nombreCompleto} <br>
			    	<b>Monto de Reserva:</b> $${montoFormat(app.campoMontoFormateado.unmaskedValue)}
				</span>
			</div>
    	<div>
    `
    app.checkoutElem.title.empty();
    app.checkoutElem.title.append(template);

    $("#b2w-btn-volver-al-formulario").on("click", () => {
    	controlador_de_vista('form', app);
    })
}

export function mask_currency_plugin(app){
	const elemID = app.formElem.monto.attr("id")
	const element = document.getElementById(`${elemID}`);
	
	const mask_elem = IMask(element, {
	  mask: Number,  // enable number mask
	  thousandsSeparator: '.',
	});

	return mask_elem;
}

export function eventos_dom(app, openModal){
	app.formElem.form.on("submit", e => {
		e.preventDefault();
		// TO-DO: HACER VALIDACIONES RESPECTIVAS
		if(validateForm(app)){
			// ABRIR EL MODAL
			controlador_de_vista('checkout', app);		
		}
	})

	app.formElem.aceptarTerminos.on("change", e => {		
		if(e.target.checked){
			app.formElem.formBoton.attr("disabled", false)
		}else{
			app.formElem.formBoton.attr("disabled", true)
		}
	})
}

export function controlador_de_vista(vista, app){
	app.mainContainerApp.views.hide();

	if(vista === 'checkout'){
		app.checkoutElem = null;
		app.mp = null;
		app.bricksBuilder = null;

		app.mp = new MercadoPago(app.publicKey, {
			locale: "es-CO"
		});
		// Inicializar el checkout de Mercado Pago
		app.bricksBuilder = app.mp.bricks();

	    // Construcción del checkout de Mercado Pago en DOM
		app.checkoutElem = checkout(app);
		
		construir_header_checkout(app);
		app.mainContainerApp.checkoutContainer.fadeIn(500);
	}

	if(vista === 'form'){
		app.mainContainerApp.formContainer.fadeIn(500);
	}

	if(vista === 'response_mp'){
		app.mainContainerApp.responseContainer.fadeIn(500);
	}
}