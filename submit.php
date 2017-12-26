<?php

sleep(2);

header("HTTP/1.1 422 Unprocessable Entity");

echo json_encode($_POST);