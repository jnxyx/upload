<?php
/**
 * upload php created by xyx
 */
class FileUpload{

    private $originName;               //源文件名
    private $tmpFileName;              //临时文件名
    private $fileType;                 //文件类型(文件后缀)
    private $fileSize;                 //文件大小
    private $newFileName;              //新文件名

    private $errorNum = 0;             //错误号
    private $errorMess="";             //错误报告消息

	function upload(){
		$files = $_FILES;
		$results = array();
		foreach($files as $k => $v){
			$this -> initFile( $v );
			$path =  $this -> savefile();
			array_push( $results , $path );
		}
		return $results;
	}

	function initFile($file){
		$this -> originName  = $file['name'];
		$this -> tmpFileName = $file['tmp_name'];
		$array = explode( '.' , $file['name'] );
		$this -> fileType    = strtolower( $array[ count($array) - 1 ] );
		$this -> fileSize    = $file['size'];

		$this -> errorNum    = $file['error'];

		$this -> newFileName = $this -> getRandowName();
	}

	function getRandowName(){
      	$fileName  =  date('YmdHis') . "_" . rand( 100 , 999 );    
      	return   $fileName . '.' . $this -> fileType; 
	}

	function savefile(){
        $path =  rtrim( 'upload' , '/' ) . '/' ;
        $path .= $this -> newFileName;
        // var_dump($path);
        if (@move_uploaded_file( $this -> tmpFileName , $path )) {
          return 'http://' . $_SERVER['HTTP_HOST'] . '/upload' . '/' . $path;
        }else{
          return false;
        }
	}
}