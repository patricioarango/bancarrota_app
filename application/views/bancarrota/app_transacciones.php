<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Bancarrota Sincronizar Transacciones</title>

</head>

<body>
  <header>

  </header>

<div class="row">
  
</div><!-- main content -->

<footer>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="   crossorigin="anonymous"></script>
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

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("esta logueado");
      traer_transacciones_a_sincronizar(user);
    } else {
      console.log("no logueado");
      console.log('No estás logueado, no se podrá sincronizar con Firebase'); 
    }
  });

  function traer_transacciones_a_sincronizar(){
    console.log("traer_transacciones_a_sincronizar");
    var google_id = localStorage.getItem("google_id");
    var html;
   db.ref('/bancarrota/transacciones').orderByChild('google_id').equalTo(google_id).once('value').then(function(snapshot) {
      var transacciones = snapshot.val();
      
      if (transacciones == null){
        html = "No hay Transacciones para Sincronizar";
      } else {
        html = "";
        $.each(transacciones, function(key, transaccion) {
          html += "<ul>";
           
           $.each(transaccion, function(index, val) {
            html += "<li>" + index + ": "+ val + "</li>";
           });
          
          html += "</ul>";
        });
        
        html += '<button id="sincronizar_transacciones">sincronizar</button>';
      }
      
      $(".row").html(html);
    });  
  } 

  $(document).on('click','#sincronizar_transacciones', function(event) {
    event.preventDefault();
    console.log("sincronizar_transacciones");
    var google_id = localStorage.getItem("google_id");
    var html;
    db.ref('/bancarrota/transacciones').orderByChild('google_id').equalTo(google_id).once('value').then(function(snapshot) {
      var transacciones = snapshot.val();
      
      if (transacciones == null){
        html = "No hay Transacciones para Sincronizar";
      } else {
        $.each(transacciones, function(key, transaccion) {
            console.log("updateado");
            //para updatear PHP dentro de este each se puede enviar por AJAX POST
            $.each(transaccion, function(campo, valor) {
              if (campo == "procesado" && valor == 0){
              var updateado = db.ref('/bancarrota/transacciones/'+key).update({procesado: 1});
              //$.post('/path/to/file', {param1: 'value1'}, function(data, textStatus, xhr) { });
              }
           });
        });
      }
      window.location.reload();  
    }); 
  });

  enviar_importes_firebase = function(e){
    db.ref('/bancarrota/transacciones/no_procesadas').push({
      google_id: '8G40UvTwqoXTaakwOnwpeOj4QWZ2', 
      importe: e,
      procesado: 0,
      fecha: Date.now()
    });
  }
  
  var importes = [54,35,23,12,50];

  importes.map(enviar_importes_firebase);



</script>
</footer>
</body>
</html>
