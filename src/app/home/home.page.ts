import { Marcador } from './../interfaces/interfaz';
import { Component } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ServicosService } from '../servicos/servicos.service';
import { IonItemSliding } from '@ionic/angular';


declare var google:any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  map = null;
  newMarker:Marcador;
  listado:Marcador[]=[];
  listado2:any[]=[];

  latitud:number=0;
  longitud:number=0;
  objMarcador:any;
  saveLocate:any;
  nuevoMarcador:Marcador;

  databaseObj: SQLiteObject;
  StrCadenaSql: string = "";

  constructor(private ser:ServicosService, private geolocation: Geolocation, private sqlite: SQLite) {  }

  ngOnInit() {
    this.crearBD();
    this.listado = this.ser.getMarcadores();
    this.mostrarMapa();
  }

  mostrarMapa(){
    const miUbicacion = {lat:-2.2233196109608357, lng:-80.9089775658942};

    const mapElement:HTMLElement = document.getElementById('map');
    const options={
      center:miUbicacion,
      zoom:15,
      disableDefaultUI:true
    };
    this.map = new google.maps.Map(mapElement, options);
    
    google.maps.event.addListenerOnce(this.map,'idle',()=>{
      mapElement.classList.add('show-map');
    });

    this.objMarcador = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable:true
    });

    this.ubicacionClick();
    this.agregarMarcador(miUbicacion);

  }

  agregarMarcador(position:any){
    let latLng = new google.maps.LatLng(position.lat, position.lng);

    this.objMarcador.setPosition(latLng);
    this.map.panTo(position);
    
    this.saveLocate = position;
    console.log(this.saveLocate);
  }
  
  miUbicaion(){
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);

      const posicion = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
      }
      this.agregarMarcador(posicion);
   
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  agregarMarcadoresAlMapa(objMarker:Marcador){
    return new google.maps.Marker({
      position:objMarker.position,
      map:this.map
    });
  }


  mostrarMarcadores(){
  
    this.mostrarCoordenadas();

    // alert("Antes del for para duplicar");
    // for(var i=0; i<=this.listado2.length; i++){
    //   this.newMarker={position: {lat:(Number(this.listado2[i].latitud)), lng:(Number(this.listado2[i].longitud))}};
    //   this.listado[i] = this.newMarker;
    //   alert("agregado: "+[i]);
    // }

    // console.log(this.listado);
    // alert("Antes del foreach para pintar.");
    this.listado.forEach(obj=>{
      this.agregarMarcadoresAlMapa(obj);
    });
  }

  ubicacionClick(){
    this.map.addListener('click', (event:any)=>{
      const miUbiacion = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.agregarMarcador(miUbiacion);
    });
  }

  save(){
    let lati = this.saveLocate.lat;
    let longi =  this.saveLocate.lng;
    this.nuevoMarcador={position:{lat:lati, lng:longi}}
    this.ser.addMarcador(this.nuevoMarcador);

    this.StrCadenaSql = "";
    this.StrCadenaSql = this.StrCadenaSql + " INSERT INTO tbl_coordenadas ";
    this.StrCadenaSql = this.StrCadenaSql + " (latitud,longitud) VALUES ( ";
    this.StrCadenaSql = this.StrCadenaSql + "'" + lati + "','" + longi + "')";

    this.databaseObj.executeSql(this.StrCadenaSql, [])
      .then(() => {
        alert("Registro con éxito");
      }).catch(e => {
        alert("Error al Registrar: " + JSON.stringify(e));
      })
  }

  crearBD(){
    this.sqlite.create({
      name: "BDCoordenadas.db",
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        // alert("La BD se creo con éxito");
        this.crearTablasBD();
      })
      .catch(e => {
        alert("Error " + JSON.stringify(e));
      });
  }

  crearTablasBD(){
    // alert("Entra a crear tabla");
    this.StrCadenaSql = "";
    this.StrCadenaSql = this.StrCadenaSql + "CREATE TABLE IF NOT EXISTS tbl_coordenadas(id INTEGER PRIMARY KEY AUTOINCREMENT,latitud VARCHAR(80),longitud VARCHAR(80))"
    this.databaseObj.executeSql(this.StrCadenaSql, [])
      .then(() => {
        // alert("la tabla fue creada");
      }).catch(e => {
        alert("Error al crear la tabla: " + JSON.stringify(e));
      })
  }

  mostrarCoordenadas(){
    
    this.StrCadenaSql = "";
    this.StrCadenaSql = this.StrCadenaSql + " SELECT * ";
    this.StrCadenaSql = this.StrCadenaSql + " FROM tbl_coordenadas ";
    // this.StrCadenaSql = this.StrCadenaSql + " WHERE estado='A'";
    this.databaseObj.executeSql(this.StrCadenaSql, [])
      .then((resp) => {
        this.listado2 = [];
        if (resp.rows.length > 0) {
          for (var i = 0; i < resp.rows.length; i++) {
            this.listado2.push(resp.rows.item(i));
          }
        }
      }).catch(e => {
        alert("Error al cargar la Información" + JSON.stringify(e));
      });
  }

  Eliminar(miId, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    this.StrCadenaSql = "";
    this.StrCadenaSql = this.StrCadenaSql + "DELETE FROM tbl_coordenadas WHERE id=" + miId;
    this.databaseObj.executeSql(this.StrCadenaSql, [])
      .then(() => {
        this.mostrarCoordenadas();
      }).catch(e => {
        alert("Error al Eliminar: " + JSON.stringify(e));
      })

  }
}
