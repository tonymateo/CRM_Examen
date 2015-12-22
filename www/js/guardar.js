var nombre="";
var apellidos="";
var equipo="";
var edad="";
var email="";
var localidad="";
var db="";

function insertarDatos(tx){
	//Insertando valores de prueba
	sql = "INSERT INTO localDB (nombre,apellidos,equipo,edad,email,localidad)"+
	"Values('"+nombre+"','"+apellidos+"','"+equipo+"','"+edad+"','"+email+"','"+localidad+"');";
	tx.executeSql(sql);
	console.log("ROW INSERT: "+sql);
};

function errorGuardado(err){
	console.log("Se ha producido un error en la busqueda de la base de datos: "+err.code);
    console.log("Mensaje de error: "+err.message);
};

$("#salvar").click(
				function(event){
					console.log("Nuevo jugador");
					nombre=$("#valNombre").val();
					apellidos=$("#valApellidos").val();
					equipo=$("#valEquipo").val();
					edad=$("#valEdad").val();
					email=$("#valEmail").val();
					localidad=$("#valLocalidad").val();

					//Conexion con la base de datos
					db=window.openDatabase("localDB","1.0","Base de datos CRM",2*1024*1024);
					db.transaction(insertarDatos, errorGuardado);
				}
);
