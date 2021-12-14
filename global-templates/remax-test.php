<?php

define('REMAX_API_URL', 'https://api.remax.ky/api-2-0/listings');

$token = '7a4ebf4014ad4cd4b91603bec1a97eb25ca20a25d6469d565b1f83f7f8f27e9f';

$result = getResponse(REMAX_API_URL, $token);

$fp = fopen('wp-content/themes/furiuswhelan/api/listings.csv', 'w');

?>

<div class="container">

<?php echo "<p>Total Results: " . count($result) . "</p>";

foreach($result as $property) { ?>
    <p>
        <h5 class="mb-0"><?php echo $property->propertyTitle; ?></h5>
        <?php echo $property->details->priceCurrency . " " . number_format($property->details->price); ?>
        <?php echo $property->listingStatus;

        ?>
    </p>

    <?php  ?>

<?php } ?>
</div>

<?php

$data = array();

fputcsv($fp, array("ID", "MLS", "Title", "Currency", "Price", "Type", "listingType", "District", "Description", "Bedrooms", "Bathrooms", "Garage", "Stories", "Zoning", "SquareFt", "Acreage", "YearBuilt", "Views", "Furnished", "Tennis", "Dock", "Alarm", "Gym", "Pool", "Pictures", "Videos", "Featured"));

foreach($result as $property) {

    $agents = $property->agents;
    $agent = implode(',', array_column($agents, 'email'));
    if(strpos($agent, 'furius') !== false) {
        $featured = 1;
    } else {
        $featured = 0;
    }
    $pics = $property->pictures;
    $vids = $property->videos;
    $pix = implode(', ', array_column($pics, 'pictureUrl'));
    $vid = implode(', ', array_column($pics, 'videoUrl'));
    $currency = $property->details->priceCurrency;

    $tennis_val = $property->otherdetails->tennis;
    $dock_val = $property->otherdetails->dock;
    $securityAlarm_val = $property->otherdetails->securityAlarm;
    $gym_val = $property->otherdetails->gym;
    $pool_val = $property->otherdetails->pool;

    if($tennis_val == "Yes") {
        $tennis = 1;
    } else {
        $tennis = 0;
    }

    if($dock_val == "Yes") {
        $dock = 1;
    } else {
        $dock = 0;
    }

    if($securityAlarm_val == "Yes") {
        $securityAlarm = 1;
    } else {
        $securityAlarm = 0;
    }

    if($gym_val == "Yes") {
        $gym = 1;
    } else {
        $gym = 0;
    }

    if($pool_val == "Yes") {
        $pool = 1;
    } else {
        $pool = 0;
    }

    if($currency == 'CI$') {
        $curr = 'cid';
    } elseif($currency == 'US$') {
        $curr = 'usd';
    }

    $data[] = array(
        $property->id,
        $property->details->mlsId,
        $property->propertyTitle,
        $curr,
        $property->details->price,
        $property->propertyType,
        $property->listingType,
        $property->location->district,
        $property->details->description,
        $property->details->numBedrooms,
        $property->details->numFullBathrooms,
        $property->otherdetails->garage,
        $property->otherdetails->stories,
        $property->otherdetails->zoning,
        $property->details->squareFeet,
        $property->details->acreage,
        $property->details->yearBuilt,
        $property->details->views,
        $property->otherdetails->furnished,
        $tennis,
        $dock,
        $securityAlarm,
        $gym,
        $pool,
        $pix,
        $vid,
        $featured
    );
}

foreach($data as $row) {
    fputcsv($fp, $row);
}

fclose($fp);

?>

<?php
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