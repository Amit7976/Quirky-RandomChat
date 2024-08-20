<?php
session_start();

$user_unique = $row['user_unique'];
$status = 'Offline';

$query = "UPDATE users SET status = ? WHERE user_unique = ?";
$stmt = mysqli_prepare($conn, $query);

mysqli_stmt_bind_param($stmt, 'ss', $status, $user_unique);
$query_run = mysqli_stmt_execute($stmt);



session_unset();
session_destroy();
ob_start();
header("location:index.php");
ob_end_flush();

exit();
