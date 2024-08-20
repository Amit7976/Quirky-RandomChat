<?php
include '../conn.php';
include "userLocation.php";
session_start();

if (!$conn) {
    die('Failed to connect to the database: ' . mysqli_connect_error());
}

$user_firstName = mysqli_real_escape_string($conn, $_POST['firstName']);
$user_lastName = mysqli_real_escape_string($conn, $_POST['lastName']);
$user_Name = $user_firstName." ". $user_lastName;
$user_gender = mysqli_real_escape_string($conn, $_POST['gender']);
$user_password = mysqli_real_escape_string($conn, $_POST['password']);
$user_confirmPassword = mysqli_real_escape_string($conn, $_POST['confirmPassword']);
$user_selectedAvatar = mysqli_real_escape_string($conn, $_POST['selectedAvatar']);
$user_unique = rand(111111111,999999999).rand(5555,9999);
$userName = str_replace(' ', '', $user_firstName)."_".rand(5555,9999);
$friends = ['1111111111111'];
$block = [];
$report = [];
$notificationOff = [];
$request = [];
$send_request = [];

$friends_json = json_encode($friends);
$block_json = json_encode($block);
$report_json = json_encode($report);
$notificationOff_json = json_encode($notificationOff);
$request_json = json_encode($request);
$send_request_json = json_encode($send_request);

if($user_password === $user_confirmPassword){


    $response = array(
        'status' => 'success',
    );


    $_SESSION["is_login"] = true;
    $_SESSION["userName"] = $userName;
    $_SESSION["user_id"] = $user_unique;

    

    $query = "INSERT INTO users (`name`, `gender`, `user_password`, `user_unique`, `avatar`, `userName`, `country`, `friends`, `block`, `report`, `notificationOff`,`request`,`send_request`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 'sssssssssssss', $user_Name, $user_gender, $user_password, $user_unique, $user_selectedAvatar, $userName, $locCountry,$friends_json, $block_json, $report_json, $notificationOff_json, $request_json, $send_request_json);
    $query_run = mysqli_stmt_execute($stmt);



    
    // MAKE HIM FRIEND OF OFFICIAL ACCOUNT
    $officialAccountUnique = '1111111111111';

    // Fetch existing JSON data from the database for the official account
    $fetchQueryOfficialAccount = "SELECT friends FROM users WHERE user_unique = ?";
    $fetchStmtOfficialAccount = mysqli_prepare($conn, $fetchQueryOfficialAccount);
    mysqli_stmt_bind_param($fetchStmtOfficialAccount, 's', $officialAccountUnique);
    mysqli_stmt_execute($fetchStmtOfficialAccount);
    mysqli_stmt_bind_result($fetchStmtOfficialAccount, $friendsJson);
    mysqli_stmt_fetch($fetchStmtOfficialAccount);
    mysqli_stmt_close($fetchStmtOfficialAccount);

    $friendsArray = json_decode($friendsJson, true);
    $friendsArray[] = $user_id;
    $updatedFriendsJson = json_encode($friendsArray);

    $updateQueryOfficialAccount = "UPDATE users SET friends = ? WHERE user_unique = ?";
    $updateStmtOfficialAccount = mysqli_prepare($conn, $updateQueryOfficialAccount);
    mysqli_stmt_bind_param($updateStmtOfficialAccount, 'ss', $updatedFriendsJson, $officialAccountUnique);
    $queryRunOfficialAccount = mysqli_stmt_execute($updateStmtOfficialAccount);
    mysqli_stmt_close($updateStmtOfficialAccount);


}else{
    $response = array(
        'status' => 'PasswordNotMatch',
    );
}

if (!$query_run) {
    $response = array(
        'status' => 'serverOverload',
    );
}




echo json_encode($response);
