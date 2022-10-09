import { Marcador } from './../interfaces/interfaz';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  listamarcadores:Marcador[]=[];
  // objMarker:any;
  // objMarker2:Marcador;
  // objMarker3:Marcador;
  // objMarker4:any;
  
  constructor() { 
    // this.objMarker ={lat:-2.2242623921298077, lng:-80.90874396442749};
    // this.objMarker2={position:{lat:-2.223242456171192, lng:-80.90998794816016}};
    // this.objMarker3={position:{lat:-2.221998411124988, lng:-80.90938538953498}};
    // this.objMarker4={lat:-2.22266123220188, lng:-80.90716560263468};

    // this.listamarcadores=[this.objMarker, this.objMarker2, this.objMarker3, this.objMarker4];
  }

  getMarcadores(){
    return this.listamarcadores;
  }

  addMarcador(obj: Marcador){
    this.listamarcadores.push(obj);
  }
}
