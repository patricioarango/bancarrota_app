<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Bancarrota Log In</title>


</head>

<body>
  <header>

  </header>

<div class="row">
  <div id="login">
    <div id="user_card" class="row valign-wrapper" style="padding-top: 20px;display:none">
      <div class="col s3">
      <img id="user_photo" class="circle responsive-img" src="" style="min-width:75px;">
      </div>
      <div class="col s7 grey-text text-lighten-2">
        <span id="user_displayname"></span>
        <span id="user_email"></span>
        <span id="logout_link"><br><a class="yellow-text" href="#" id="google_logout">Log Out</a></span>
      </div>
    </div>

    <div id="logued_out" class="row valign-wrapper" style="padding-top: 20px;display:none">
      <div class="col s3">
      <img id="user_photo" class="circle responsive-img" src="/assets/images/google_logo.jpg" style="height:75px;">
      </div>
        <a id="loguear_usuario" href="#" class="btn btn-floating pulse pink">entrar</a>    
    </div>
  </div>
  <div id="qr_contenedor">
    <img id="imagen_qr" src="" alt="" height="250px">
  </div>
</div><!-- main content -->

<footer>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"   integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="   crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>
  <script src="https://www.gstatic.com/firebasejs/3.9.0/firebase.js"></script>
  <script>
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

  //chequeamos si el usuario está o no logueado en firebase 
  firebase.auth().onAuthStateChanged(function(user) {
    console.log("chequeando estado usuario en Firebase");
    if (user) {
      console.log("usuario logueado en Firebase");
    //si está logueado mostramos datos de usuario
    show_user(user);
    //y generamos el código qr
    crear_codigo_qr(user);
  } else {
    console.log("usuario no logueado en Firebase");
    show_login_card();
  }
});

  $("#google_logout").on('click',  function(event) {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
      console.log("after logout");
      $("#user_card").hide();
    }).catch(function(error) {
    // An error happened.
  });
  });

  function show_login_card(){
    $("#logued_out").show();
    $("#qr_contenedor").hide();
  }

  //logueamos al usuario con google
  $("#loguear_usuario").on('click', function(event) {
    event.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider(); 
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        var token = result.credential.accessToken;
        var user = result.user;
        show_user(user);
        crear_codigo_qr(user);
      } else {
        firebase.auth().signInWithRedirect(provider);
      }

    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

  });

  /**
  * [show_user muestra los datos del usuario logueado en Firebase]
  * @param  {[type]} user [objeto que devuelve el logueo de Google en FB]
  * @return {[void]}
  */
  function show_user(user){
    console.log("show_user");
    localStorage.setItem("google_id",user.uid);
    $("#user_card").show();
    $("#user_displayname").text(user.displayName);
    $("#user_email").text(user.email);
    if (user.photoURL != ""){
      $("#user_photo").attr("src",user.photoURL);
    }
  }

  /**
  * [crear_codigo_qr crea código QR para escanear por única vez en Bancarrota APP]
  * @param  {[obj]} user [el objeto del resultado de Firebase Login]
  * @return {[void]} 
  */
  function crear_codigo_qr(user){
    var data_to_qr = encriptar_codigo_qr_data(user);
    $.post('/bancarrota_app/generar_qr', {data_to_qr: data_to_qr}, function(data) {
      //console.log(data);
      mostrar_codigo_qr_generado(data);
    },"json");
  }

  /**
  * [encriptar_codigo_qr_data Toma los datos del usuario y una palabra y los encripta para que el código QR no sea plano]
  * @param  {[obj]} user [el objeto del resultado de Firebase Login ]
  * @return {[string]}     [datos encriptados]
  */
  function encriptar_codigo_qr_data(user){
    var google_id = user.uid; 
    var displayName = user.displayName;
    var email = user.email; 
    var photoURL = user.photoURL; 
    var site_url = document.location.origin;  
    var qwerty = google_id + displayName + email + photoURL + site_url;
    var encrypted = CryptoJS.AES.encrypt(qwerty, "maria_esmin_dodero");  
    return encrypted.toString();
  }

  /**
  * [mostrar_codigo_qr_generado Muestra el código QR]
  * @param  {[type]} data [data con la url de la imagen]
  * @return {[void]}    
  */
  function mostrar_codigo_qr_generado(data){
    $("#qr_contenedor").show();
    $("#imagen_qr").attr("src",data.imagen);
  }
</script>
</footer>
</body>
</html>