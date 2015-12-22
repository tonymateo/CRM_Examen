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
var cargarDB = {
    db:"",
    initialize:function(){
        console.log("iniciando");
        //creamos un enlace con la base de datos
        //openDatabase(nombre de la base de datos,version,descriptivo,tamaño estimado)
        this.db=window.openDatabase("localDB","1.0","Base de datos CRM",2*1024*1024);
        this.createConexDB();
    },
    createConexDB:function(){
        console.log("Cargamos la base de datos");
        this.db.transaction(this.cargarLocalDB, this.createDBError);
    },
    cargarLocalDB:function(tx){
        var sql="SELECT * FROM localDB;";
        console.log("Lanzando el select a la tabla localDB");
        tx.executeSql(
            sql,
            [],
            //funcion de que se ha realizado la consulta bien
            function(tx,result){
                console.log("Se ha realizado la consulta con exito");
                if(result.rows.length>0){
                    for(var i=0;i<result.rows.length;i++){
                        var fila=result.rows.item(i);
                        console.log("ROW "+1+" Nombre: "+fila.nombre);
                        $("#listaJugadores ul").append("<li>"+fila.nombre+"</li>").listview("refresh");
                        console.log("Despues de meter el dato en la nueva pagina");
                    }
                }
            },
            //funcion de que no funciona
            function(tx,error){
                this.createDBError(error);
            }
            );
    },
    createDBError:function(err){
        console.log("Se ha producido un error en la creacion de la base de datos: "+err.code);
        console.log("Mensaje de error: "+err.message);
    }
};

var confDB = {
    db:"",
    existe_db:"",
    initialize:function(){
        //variable existe db
        existe_db=window.localStorage.getItem("existe_db");
        //creamos un enlace con la base de datos
        //openDatabase(nombre de la base de datos,version,descriptivo,tamaño estimado)
        this.db=window.openDatabase("localDB","1.0","Base de datos CRM",2*1024*1024);

        if(existe_db==null){
            //No existe base de datos
            this.createDB();
            navigator.notification.confirm(
                'La base de datos no esta creada',
                this.onConfirm,
                'Base de Datos',
                ['Crear','Salir']
              );
        }else{
            //Base de datos creada
            cargarDB.initialize();
            console.log("Estoy haciendo el else de confDB");
        }
    },
    onConfirm:function(buttonIndex){
        if(buttonIndex==1){
          this.createDB();
        }
    },
    createDB:function(){
        console.log("Creamos la base de datos");
        this.db.transaction(this.createLocalDB, this.createDBError, this.createDBSucc);
    },
    createLocalDB:function(tx){
        tx.executeSql("DROP TABLE IF EXISTS localDB");

        var sql="CREATE TABLE IF NOT EXISTS localDB ("+
                "id INTEGER PRIMARY KEY AUTOINCREMENT,"+
                "nombre VARCHAR(60),"+
                "apellidos VARCHAR(60),"+
                "equipo VARCHAR(120),"+
                "edad INTEGER,"+
                "email VARCHAR(240),"+
                "localidad VARCHAR(240) );"
                ;
        tx.executeSql(sql);

        var sql2 = "INSERT INTO localDB VALUES (1, 'Prueba de insert nombre', 'prueba apelidos', 'prueba equipo', 25, 'prueba@gmail.com', 'prueba localidad');";
        tx.executeSql(sql2);
    },
    createDBError:function(err){
        console.log("Se ha producido un error en la creacion de la base de datos: "+err.code);
        console.log("Mensaje de error: "+err.message);
    },
    createDBSucc:function(){
        console.log("Se ha generado la base de datos con éxito");
        window.localStorage.setItem("existe_db",1);
        cargarDB.initialize();
    }
};

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
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);

        confDB.initialize();

        navigator.notification.alert(
         'Dispositivo arrancado',  // message
         this.alertDismissed,         // callback
         'Arranque',            // title
         'Done'                // buttonName
        );
   },
   alertDismissed:function() {
     // do something
   }
};

app.initialize();
