import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import swal from "sweetalert";
import { Paquete } from 'src/app/models/paquete.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styles: []
})
export class PaquetesComponent implements OnInit {

  public ocultarBoton: string ='';
  public ocultarPerfil: string ='';
  correo: string='';
  usuario: Usuario;
  paquetes: Paquete[]=[];


  constructor(
    public _usuarioServices: UsuarioService,
    public router: Router
  ) { }

  ngOnInit() {

    //======= para ver el carrito
    let bell=document.getElementById('notification');
    if(this._usuarioServices.contador!=0){
      bell.setAttribute('data-count',  (this._usuarioServices.contador).toString());
      bell.classList.add('show-count');
      bell.classList.add('notify');
      bell.addEventListener('animationend', ()=>{
          bell.classList.remove('notify');
      });
    }

    
    this.cargarPaquetes()
    // console.log("PAQUETES......",this.paquetes);
    
    this.usuario= this._usuarioServices.usuario;
    this.correo=this.usuario.email;
    if(this.usuario._id.length>3){
      this.ocultarBoton='oculto';
    }else{

      this.ocultarPerfil='oculto';
    }

    

    
  }

  
  ingresar(forma: NgForm){
    console.log("hola",forma.value)

    let usuario= new Usuario(null,forma.value.email, forma.value.password);

    this._usuarioServices.login(usuario).subscribe(correcto=>{
        console.log(correcto);
        if(correcto){
          swal('Bienvenido', '','success');
          this.ocultarBoton="oculto";
          this.ocultarPerfil="";
   
          console.log("usuario:", this._usuarioServices.usuario.email );
          
        }
    })
  }


  registrarse(forma: NgForm){
    console.log("hola",forma.value)
    let usuario = new Usuario(forma.value.nombre,
      forma.value.email,
      forma.value.password,
      forma.value.telefono);
      this._usuarioServices.registrarse(usuario).subscribe(resp=>{
        console.log("la respusta", resp);
    
      })

  }

  cargarPaquetes(){
    this._usuarioServices.cargarPaquetes().subscribe((resp:any)=>{
      // console.log(resp.paquetes);
      this.paquetes = resp.paquetes;
      console.log("PAQUETES......",this.paquetes[0]);
      // console.log("Prueba",this.paquetes[0].servicios[0]._id);
      
    })
  }

  carrito(paquete: any){
    console.log("corrito")
    let bell=document.getElementById('notification');
    // var count= Number(bell.getAttribute('data-count')) || 0;
    // var count = this._usuarioServices.contador;
    bell.setAttribute('data-count',  (this._usuarioServices.contador+=1).toString());
    bell.classList.add('show-count');
    bell.classList.add('notify');
    

    bell.addEventListener('animationend', ()=>{
        bell.classList.remove('notify');
    });

    this.guardarStorage(paquete)


  }

  guardarStorage(paquete:any){
    // localStorage.setItem('id', id);
    // localStorage.setItem('usuario',JSON.stringify(usuario));

    // this.usuario= usuario;
    this._usuarioServices.servicios[this._usuarioServices.contador-1]=paquete;
    this._usuarioServices.total+=paquete.precio;
    // console.log("pakkkkkk",paquete.precio);
    
  }

  irCarrito(){
    console.log("CARRITOO");
    
    this.usuario= this._usuarioServices.usuario;

    if(this.usuario==null){
      swal('Importante!', "Por favor debe iniciar secion", 'warning')
    }else{

      this.router.navigate(['/carrito'])
    }
  }

}
