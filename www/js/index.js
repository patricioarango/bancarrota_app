/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        if (localStorage.getItem("bancarrota_registrado") === null) {
            mostrar_login();
        } else {
            console.log("logueado");
            $("#first_time_home").show();
            traer_categorias();
        }
    }
};

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD2PzScF-ihOBqL6hF3U5dDaUL6qo-pSPg",
    authDomain: "naught-to-sixty.firebaseapp.com",
    databaseURL: "https://naught-to-sixty.firebaseio.com",
    projectId: "naught-to-sixty",
    storageBucket: "naught-to-sixty.appspot.com",
    messagingSenderId: "401824998671"
};
firebase.initializeApp(config);
var db = firebase.database();

var connectedRef = db.ref(".info/connected");
var conexion;
connectedRef.on("value", function(snap) {
  if (snap.val() === true) {
    console.log("conexion online");
    conexion = true;
    sincronizar_subcategorias();
    sincronizar_transacciones();
} else {
    console.log("conexion offline");
    conexion = false;
}
});

function traer_categorias(){
    limpiar_categorias();
    var subcategorias = JSON.parse(window.localStorage.getItem("bancarrota_subcategorias"));
    var posicion = 0;
    if (subcategorias !== null){
        $.each(subcategorias, function(index, val) {
            if (val.acceso_rapido == 1){
                insertar_categoria_en_vista(posicion,val);
                ++posicion;
            }
        }); 
    } else {
        var error_string = '<div class="row">'+
            '<p><span id="msg_error"><p>Error: No hay subcategorias para mostrar. </p></span>'+
            '<div class="col s6 offset-s3">'+
                '<button id="recargar" class="btn waves-effect waves-light teal z-depth-4">Reload '+'<i class="material-icons right">send</i>'+
                '</button>'+           
            '</div>'+
        '</div>';
        show_error_vista(error_string);    
    }
}

function traer_todas_categorias(){
    limpiar_categorias();
    var subcategorias = JSON.parse(window.localStorage.getItem("bancarrota_subcategorias"));
    var posicion = 0;
    if (subcategorias.length > 0){
        $.each(subcategorias, function(index, val) {
                insertar_categoria_en_vista(posicion,val);
                ++posicion;
        }); 
    } else {
        sincronizar_subcategorias();
        show_error_vista('<p>No hay subcategorias para mostrar. La primera vez necesitamos conexión para sincronizar</p>');
    }
}

function insertar_categoria_en_vista(posicion,categoria){
        var colors = ["light-blue lighten-1","blue lighten-1","light-blue","blue","light-blue darken-1","blue darken-1","light-blue darken-2","blue darken-2","light-blue darken-3","blue darken-3","light-blue darken-4","blue darken-4","indigo darken-4","indigo lighten-1","indigo","indigo darken-1","indigo darken-2","indigo darken-3","indigo darken-4","deep-purple darken-4","light-blue accent-1","light-blue accent-2","light-blue accent-3","light-blue accent-4","blue accent-1","blue accent-2","blue accent-3","blue accent-4","indigo accent-1","indigo accent-2","indigo accent-3","indigo accent-4","deep-purple accent-1","deep-purple accent-2","deep-purple accent-3","deep-purple accent-4","cyan accent-1","cyan accent-2","cyan accent-3","cyan accent-4","teal accent-1","teal accent-2","teal accent-3","teal accent-4","green accent-1","green accent-2","green accent-3","green accent-4","light-green accent-1","light-green accent-2","light-green accent-3","light-green accent-4","orange accent-1","orange accent-2","orange accent-3","orange accent-4"];
            if (categoria.emoji != ""){
                var icono = categoria.emoji;
            } else {
                var icono = categoria.icono;
            }
            $("#insert").append('<li data-posicionscroll="'+posicion+'" class="'+colors[posicion]+'" style="padding:20px;"><div class="collapsible-header '+colors[posicion]+' white-text" style="border-bottom:0px;"><div class="col s7 offset-s2"><i class="material-icons large">'+icono+'</i>'+categoria.subcategoria+'</div></div>'+
                '<div class="collapsible-body '+colors[posicion]+'" style="border-bottom:0px;">'+
                '<input type="number" class="white-text" name="importe" placeholder="importe" id="importe_'+categoria.id_subcategoria+'" style="border-bottom:1px solid white;">'+
                '<input type="text" class="white-text" name="observacion" placeholder="observacion" id="observacion_'+categoria.id_subcategoria+'" style="border-bottom:1px solid white;">'+
                '<button style="margin-top:20px;" class="btn btn-floating btn-large pink pulse enviar_transaccion right" data-posicion="'+posicion+'" value="'+categoria.id_subcategoria+'" data-subcategoria="'+categoria.subcategoria+'"><i class="material-icons">send</i></button>'+
                '</div></li>');        
}

$(document).on('click',"#escanear",function(e) {
    e.preventDefault();
    getQrCode();
});

function getQrCode(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          codigo_escaneado(result.text);
        /*
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
    */        
}, 
function (error) {
  alert("Scanning failed: " + error);
},
{
          "preferFrontCamera" : false, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "prompt" : "Escanea el codigo QR en tu sitio", // supported on Android only
          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
      }
      );
}

function codigo_escaneado(qrcode){
    var decrypted = CryptoJS.AES.decrypt(qrcode, "maria_esmin_dodero");
    var data = decrypted.toString(CryptoJS.enc.Utf8);
    var datos = data.split(';');
    window.localStorage.setItem("bancarrota_google_id",datos[0]);
    window.localStorage.setItem("bancarrota_nombre",datos[1]);
    window.localStorage.setItem("bancarrota_email",datos[2]);
    window.localStorage.setItem("bancarrota_photoURL",datos[3]);
    window.localStorage.setItem("bancarrota_site_url",datos[4]);
    window.localStorage.setItem("bancarrota_registrado",1);
    sincronizar_y_mostrar_subcategorias();
}

function sincronizar_subcategorias(){
    console.log("sincronizar_subcategorias");
    var google_id = window.localStorage.getItem("bancarrota_google_id");
    if (google_id != null){
        db.ref('/bancarrota/'+google_id+'/subcategorias').on('value', function(snapshot) {
            window.localStorage.setItem("bancarrota_subcategorias",JSON.stringify(snapshot.val()));
        });
    }
}

function sincronizar_y_mostrar_subcategorias(){
    console.log("sincronizar_y_mostrar_subcategorias");
    $("#first_time_home").show();
    var google_id = window.localStorage.getItem("bancarrota_google_id");
    if (google_id != null){
        db.ref('/bancarrota/'+google_id+'/subcategorias').on('value', function(snapshot) {
            window.localStorage.setItem("bancarrota_subcategorias",JSON.stringify(snapshot.val()));
            traer_categorias();
        });
    }
}

$(document).on('click',".enviar_transaccion", function(event) {
    event.preventDefault();
    var id = $(this).val();
    var posicion = $(this).data("posicion");
    var importe = $("#importe_" + id).val();
    var observacion = $("#observacion_" + id).val();
    var subcategoria = $(this).data("subcategoria");
    var id_transaccion = get_transaccion();
    guardar_transaccion(id_transaccion,importe,id,observacion,subcategoria);
    limpiar_transaccion(id,posicion);
    if (conexion){
      sincronizar_transacciones();
  }
});   

function get_transaccion(){
    var id_transaccion = localStorage.getItem("id_transaccion");
    if (id_transaccion == null){
        id_transaccion = 0;
    }
    var nuevo_id_transaccion = parseInt(id_transaccion) + 1;
    localStorage.setItem("id_transaccion",nuevo_id_transaccion);
    calcular_para_sincronizar();    
    return nuevo_id_transaccion;
}

function guardar_transaccion(id_transaccion,importe,id_subcategoria,observacion,subcategoria){
    localStorage.setItem("bancarrota_id_subcategoria_" + id_transaccion,id_subcategoria); 
    localStorage.setItem("bancarrota_importe_" + id_transaccion,importe); 
    localStorage.setItem("bancarrota_observacion_" + id_transaccion,observacion); 
    localStorage.setItem("bancarrota_subcategoria_" + id_transaccion,subcategoria); 
}

function limpiar_transaccion(id_subcategoria,posicion){
    $("#importe_" + id_subcategoria).val('');
    $("#observacion_" + id_subcategoria).val('');
    $('.collapsible').collapsible('close', posicion);
}

function sincronizar_transacciones(){
    var id_transaccion = parseInt(localStorage.getItem("id_transaccion"));
    if (id_transaccion > 0) {
        for (i = 1; i<=id_transaccion; i++){
            db.ref("/bancarrota/transacciones/no_procesadas").push({
                importe: localStorage.getItem("bancarrota_importe_" + i),
                id_subcategoria: localStorage.getItem("bancarrota_id_subcategoria_" + i),
                observacion: localStorage.getItem("bancarrota_observacion_" + i),
                subcategoria: localStorage.getItem("bancarrota_subcategoria_" + i), 
                google_id: localStorage.getItem("bancarrota_google_id"),
                fecha: firebase.database.ServerValue.TIMESTAMP
            });
            localStorage.removeItem("bancarrota_importe_" + i);
            localStorage.removeItem("bancarrota_id_subcategoria_" + i);
            localStorage.removeItem("bancarrota_observacion_" + i),
            localStorage.removeItem("bancarrota_subcategoria_" + i); 
            localStorage.removeItem("id_transaccion");
        }
    }
    calcular_para_sincronizar();
}

function calcular_para_sincronizar(){
    var transacciones2 = localStorage.getItem("id_transaccion");   
        if (transacciones2 == null){
            $("#para_sincronizar").text("0 ");        
        } else {
            $("#para_sincronizar").text(transacciones2 + " ");
        }
}    

/*$("#insert").on('click', 'li', function(e){
    e.preventDefault();
    var posicionscroll = $(this).data("posicionscroll");
    var cantidad = (posicionscroll * 250);
    //console.log(cantidad);
    //$("html, body").animate({ scrollTop: cantidad }, 600);
});*/

$(document).on('click','#recargar', function(event) {
    event.preventDefault();
    window.location.reload();
});

function mostrar_transacciones_enviadas(){
    limpiar_categorias();
    var google_id = window.localStorage.getItem("bancarrota_google_id");
    traer_transacciones_a_sincronizar(google_id);
}

function mostrar_transacciones_en_cola(){
    limpiar_categorias();
    var id_transaccion = parseInt(localStorage.getItem("id_transaccion"));
    if (id_transaccion > 0) {
        var html = "";
        html += "<ul>";
        for (i = 1; i<=id_transaccion; i++){
            html += "<li>importe: "+ localStorage.getItem("bancarrota_importe_" + i) + "</li>";
            html += "<li>id_subcategoria: "+ localStorage.getItem("bancarrota_id_subcategoria_" + i) + "</li>";
            html += "<li>observacion: "+ localStorage.getItem("bancarrota_observacion_" + i) + "</li>";
            html += "<li>subcategoria: "+ localStorage.getItem("bancarrota_subcategoria_" + i) + "</li>";
        }
        html += "</ul>";
        $("#listado").html(html);
    } else {
      $("#listado").text("No hay transacciones pendientes");
    }   
}

function traer_transacciones_a_sincronizar(google_id){
  console.log("traer_transacciones_a_sincronizar");
  db.ref('/bancarrota/transacciones/no_procesadas').orderByChild('google_id').equalTo(google_id).on('value', function(snapshot) {
    var transacciones = snapshot.val();
    console.log(transacciones);
    if (transacciones != null){
      var html = "";
    html += '<table class="centered">'+
        '<thead>'+
          '<tr>'+
              '<th>Subcategoria</th>'+
              '<th>Observaci&oacute;n</th>'+
              '<th>Precio</th>'+
              '<th>Fecha</th>'+
          '</tr>'+
        '</thead>'+
        '<tbody>';
      $.each(transacciones, function(key, transaccion) {
       html += '<tr>'+
                '<td>'+transaccion.subcategoria+'</td>'+
                '<td>'+transaccion.observacion+'</td>'+
                '<td>'+transaccion.precio+'</td>'+
                '<td>'+new Date(transaccion.fecha)+'</td>'+
       /*$.each(transaccion, function(index, val) {
        if (index == "fecha"){
          val = new Date(val);
        }
        html += "<li>" + index + ": "+ val + "</li>";
      });*/
     });
    html += "</tbody></table>";
      $("#listado").html(html);
    } else {
      $("#listado").text("No hay transacciones pendientes");
    }
  });  
} 

function mostrar_login(){
    $("#login_contenedor").show();
}

function limpiar_categorias(){
    $("#insert").empty();
    $("#listado").empty();
}

function show_error_vista(error){
  $("#listado").empty();
  $("#listado").append(error);
}

$(function(){

   var google_id = window.localStorage.getItem("bancarrota_google_id");
   db.ref('/bancarrota/transacciones/no_procesadas').orderByChild('google_id').equalTo(google_id).on('value', function(snapshot) {
      var transacciones = snapshot.val();
        if (transacciones == null){
            $("#enviadas").text("0 ");        
        } else {
            $("#enviadas").text(Object.keys(transacciones).length + " ");
        }
    });  

   if (window.localStorage.getItem("bancarrota_registrado") == 1){
    var nombre = window.localStorage.getItem("bancarrota_nombre");
    var email = window.localStorage.getItem("bancarrota_email");
    var foto = window.localStorage.getItem("bancarrota_photoURL");
    $("#user_photoURL").attr('src', foto);
    $("#user_name").html(nombre);
    $("#user_email").html(email);
   }
    
    $('.mostrar_nav').sideNav({
          menuWidth: 250, // Default is 300
          closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
          draggable: true, // Choose whether you can drag to open on touch screens,
        }
    );

    $('.collapsible').collapsible();          
});