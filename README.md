Dependencias Codeigniter:
Qr Code Library

Importante: Avisar al Capo cuál es el dominio en el que se va a usar esta genialidad.

Pasos:
1. Log In con Google y Crear QR Code.

	controller	
	bancarrota_app/login
	
	view
	bancarrota/app_login.php
	
	assets/images
	google_logo.png
	

2. Sincronizar Categorías. 
Se recomienda poner el script en un listado o similar, porque lo que hace es escribir TODAS las categorias/subcategorias cada vez que hay un cambio. El formato que hay formar con PHP es el siguiente:

 $categorias_fb[] = array(
          "id_subcategoria" => (int),
          "id_categoria" => (int),
          "subcategoria" => (string),
          "categoria" => (string),
          "icono" => (string),
          "emoji" => (string), //nombres de íconos de Material Design
          "acceso_rapido" => (int) //determina si la subcategoría se muestra en home de app
          );

	controller
	bancarrota_app/sincronizar_categorias
	
	view
	bancarrota/app_categorias.php

3. Sincronizar Transacciones.
La idea es que las sincronizaciones se hagan apenas uno ingresa a la página. En el ejemplo está con un botón, pero lo mejor sería sacar eso y ponerlo en el document ready. Por eso ahora tiene funcionalidad duplicada.

OJO: el formato de transacciones va a cambiar. Avisame cuando llegues a este punto.

	controller
	bancarrota_app/sincronizar_transacciones
	view
	bancarrota/app_transacciones.php
	

