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
function traer_categorias(){
    $("#first_time_home").hide();
    $("#categorias_container").show();
    var google_id = window.localStorage.getItem("bancarrota_google_id");
    console.log("traer_categorias");
    db.ref('/bancarrota/'+google_id+'/subcategorias').on('value', function(snapshot) {
        subcategorias = snapshot.val();
        $.each(subcategorias, function(key, value) { 
            $("#categorias_container").append('<div class="col s12 '+colors[key]+' white-text" style="padding:20px;">'+
                '<div class="container">'+
                '<div class="col s4"><i class="material-icons medium">'+value.icono+'</i></div>'+
                '<div class="col s8">'+'<p class="flow-text">'+value.subcategoria+'</p></div>'+
                '</div></div>');
        });
    });
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
    window.localStorage.setItem("bancarrota_registrado",1);
    traer_categorias();
}