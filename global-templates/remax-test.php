<?php

define('REMAX_API_URL', 'https://api.remax.ky/api-2-0/listings');

$token = '7a4ebf4014ad4cd4b91603bec1a97eb25ca20a25d6469d565b1f83f7f8f27e9f';

$result = getResponse(REMAX_API_URL, $token);

echo count($result);

foreach($result as $property) {
    echo "<p>{$property->propertyTitle}<br>Sale Price: CI$ {$property->salePrice}</p>";
}


function getResponse($url, $token) {

    $ch = curl_init();
    $headers = array();
    $headers[] = "Authorization: Bearer {$token}";
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    $response = curl_exec($ch);

    if (curl_error($ch)) {
        curl_close($ch);
        return false;
    } else {
        curl_close($ch);
        return json_decode($response);
    }
}