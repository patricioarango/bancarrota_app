<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Bancarrota Sincronizar Categorias</title>


</head>

<body>
  <header>

  </header>

<div class="row">
  <p>Mirá en la consola del Inspector</p>
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
      console.log("usuario logueado en Firebase");
      sincronizar_categorias_firebase(user);
    } else {
      console.log("usuario no logueado en Firebase");
      console.log('No estás logueado, no se podrá sincronizar con Firebase'); 
    }
  });

  function sincronizar_categorias_firebase(user){
    console.log("sincronizar_categorias_firebase");
    var datos = <?php echo json_encode($subcategorias); ?>;
    //console.log(datos);
    var insercion = db.ref('/bancarrota/'+user.uid+'/subcategorias').set({
            subcategorias: datos,
      });
    if (insercion){
      console.log("subcategorias sincronizadas con éxito");
    } else {
      console.log("subcategorias no sincronizadas");
    }   
  } 
</script>
</footer>
</body>
</html>