<?php

	include "upload.class.php";

	$upload = new FileUpload;
	//初始化属性
	$results = $upload -> upload() ;
	if(count($results)){
		echo json_encode(array('data' => $results , 'info' => '' , 'status' => '' )) ;
	}else{
		echo json_encode(array('data' => ''    , 'info' => '' , 'status' => '' )) ;
	}
