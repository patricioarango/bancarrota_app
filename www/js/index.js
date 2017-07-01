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
            $("#first_time_home").show();
        } else {
            console.log("logueado");
            traer_categorias();
        }
    }
};
var colors = ["red","pink","blue","purple","deep-purple","indigo","cyan","teal","light-blue","green","light-green","lime","yellow","orange","amber","deep-orange","brown"];
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
    $("#first_time_home").hide();
    $("#second_time_home").show();
    var subcategorias = JSON.parse(window.localStorage.getItem("bancarrota_subcategorias"));
    var posicion = 0;
    if (subcategorias.length > 0){
        $.each(subcategorias, function(index, val) {
        var colors = ["light-blue lighten-1","blue lighten-1","light-blue","blue","light-blue darken-1","blue darken-1","light-blue darken-2","blue darken-2","light-blue darken-3","blue darken-3","light-blue darken-4","blue darken-4","indigo darken-4","indigo lighten-1","indigo","indigo darken-1","indigo darken-2","indigo darken-3"];
          if (val.acceso_rapido == 1){
            $("#insert").append('<li data-posicionscroll="'+posicion+'" class="'+colors[posicion]+'" style="padding:20px;"><div class="collapsible-header '+colors[posicion]+' white-text" style="border-bottom:0px;"><div class="col s7 offset-s2"><i class="material-icons large">'+val.icono+'</i>'+val.subcategoria+'</div></div>'+
                '<div class="collapsible-body '+colors[posicion]+'" style="border-bottom:0px;">'+
                '<input type="number" class="white-text" name="importe" placeholder="importe" id="importe_'+val.id_subcategoria+'" style="border-bottom:1px solid white;">'+
                '<input type="text" class="white-text" name="observacion" placeholder="observacion" id="observacion_'+val.id_subcategoria+'" style="border-bottom:1px solid white;">'+
                '<input type="hidden" name="id_subcategoria_2" value="'+val.id_subcategoria+'">'+
                '<button style="margin-top:20px;" class="btn btn-floating btn-large pink pulse enviar_transaccion right" data-posicion="'+posicion+'" value="'+val.id_subcategoria+'"><i class="material-icons">send</i></button>'+
                '</div></li>');
              ++posicion;
          }
      }); 
} else {
    $("#insert").append('<p>No hay subcategorias para mostrar. La primera vez necesitamos conexión para sincronizar</p>');
}
}

$("#escanear").on('click',function(e) {
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
          "prompt" : "Escanea el codigo de barras del sitio", // supported on Android only
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
    sincronizar_subcategorias();
    traer_categorias();
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

$(function(){
    $('.collapsible').collapsible();

   var google_id = window.localStorage.getItem("bancarrota_google_id");
   db.ref('/bancarrota/transacciones/no_procesadas').orderByChild('google_id').equalTo(google_id).on('value', function(snapshot) {
      var transacciones = snapshot.val();
        if (transacciones == null){
            $("#enviadas").text("0 ");        
        } else {
            $("#enviadas").text(transacciones.length + " ");
        }
    });  

});

$(document).on('click',".enviar_transaccion", function(event) {
    event.preventDefault();
    var id = $(this).val();
    var posicion = $(this).data("posicion");
    var importe = $("#importe_" + id).val();
    var observacion = $("#observacion_" + id).val();
    var id_transaccion = get_transaccion();
    guardar_transaccion(id_transaccion,importe,id,observacion);
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
    return nuevo_id_transaccion;    
}

function guardar_transaccion(id_transaccion,importe,id_subcategoria,observacion){
    localStorage.setItem("bancarrota_id_subcategoria_" + id_transaccion,id_subcategoria); 
    localStorage.setItem("bancarrota_importe_" + id_transaccion,importe); 
    localStorage.setItem("bancarrota_observacion_" + id_transaccion,observacion); 
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
                google_id: localStorage.getItem("bancarrota_google_id"),
                fecha: firebase.database.ServerValue.TIMESTAMP
            });
            localStorage.removeItem("bancarrota_importe_" + i);
            localStorage.removeItem("bancarrota_id_subcategoria_" + i);
            localStorage.removeItem("bancarrota_observacion_" + i),
            localStorage.removeItem("id_transaccion");
        }
    }
    calcular_para_sincronizar();
}

function calcular_para_sincronizar(){
    var transacciones2 = localStorage.getItem("id_transaccion");   
        if (transacciones2 == null){
            $("#para_sincronizar").html("0 ");        
        } else {
            $("#para_sincronizar").html(transacciones2 + " ");
        }
}    

$('#insert').on('click', 'li', function(e){
    e.preventDefault();
    var posicionscroll = $(this).data("posicionscroll");
    var cantidad = (posicionscroll * 250);
    console.log(cantidad);
    //$("html, body").animate({ scrollTop: cantidad }, 600);
});