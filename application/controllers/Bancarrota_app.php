<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @moduloPermiso Controlador de Bancarrota APP
 */
class Bancarrota_app extends MY_Controller {

    private $_subcategorias;    
    public function __construct()
    {
        parent::__construct();
        $this->_subcategorias = array(array(
        "id_categoria" => "id_categoria_0",
        "id_subcategoria" => "id_categoria_0",
        "categoria" => "categoria_0",
        "subcategoria" => "subcategoria_0",
        "emoji" => "emoji",
        "icono" => "icono",
        ),array(
        "id_categoria" => "id_categoria_1",
        "id_subcategoria" => "id_categoria_1",
        "categoria" => "categoria_1",
        "subcategoria" => "subcategoria_1",
        "emoji" => "emoji",
        "icono" => "icono",
        )); 

    }

    public function login(){
        $this->load->view("bancarrota/app_login.php");
    }

    public function sincronizar_categorias(){
        $data = array();
        
        foreach ($this->_subcategorias as $subcate){
            $data["subcategorias"][] = array(
                "id_categoria" => $subcate["id_categoria"],
                "id_subcategoria" => $subcate["id_subcategoria"],
                "categoria" => $subcate["categoria"],
                "subcategoria" => $subcate["subcategoria"],
                "emoji" => $subcate["emoji"],
                "icono" => $subcate["icono"],
                );
        }

        $this->load->view("bancarrota/app_categorias.php",$data);
    }

    public function sincronizar_transacciones(){
        $this->load->view("bancarrota/app_transacciones.php");
    }

    /**
     * [generar_qr Genera un código QR]
     * @return [json] [url del código QR]
     */
    public function generar_qr(){
        $this->load->library("Ciqrcode");
        $params['data'] = $this->input->post("data_to_qr");
        $params['level'] = 'H';
        $params['size'] = 10;
        $dir =  FCPATH .'assets/images-qrcode/';
        $savename = $dir . 'tes.png';
        if (!is_dir($dir)){ 
            mkdir($dir);
        }
        $params['savename'] = $savename;
        if ($this->ciqrcode->generate($params)){
            die(json_encode(array('imagen' => '/assets/images-qrcode/tes.png')));
        } else {
            header('HTTP/1.1 503 Internal Server Error');
            header('Content-Type: application/json; charset=UTF-8');
            die(json_encode(array('message' => 'ERROR', 'text' => 'No se pudo Generar el CodigoQR')));
        }
    }
}
