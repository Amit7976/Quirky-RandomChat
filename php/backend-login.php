<?php
require "../conn.php";
session_start();

/// login start
if (!isset($_SESSION['is_login'])) {

    if (isset($_POST['login_userName'])) {


        $login_userName = mysqli_real_escape_string($conn, ($_POST['login_userName']));
        $user_pass = mysqli_real_escape_string($conn, ($_POST['login_pass']));

        
        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }


        $user_details = $conn->query("SELECT * FROM users WHERE userName='$login_userName' AND user_password ='$user_pass'");

        if (mysqli_num_rows($user_details) > 0) {
            
            $row = mysqli_fetch_assoc($user_details);


                $response = array(
                    'status' => 'loginSuccess',
                );

                $_SESSION["is_login"] = true;
                $_SESSION["user_id"] = $row['user_unique'];

            $user_unique = $row['user_unique'];
            $status = 'Online';

            $query = "UPDATE users SET status = ? WHERE user_unique = ?";
            $stmt = mysqli_prepare($conn, $query);

            mysqli_stmt_bind_param($stmt, 'ss', $status, $user_unique);
            $query_run = mysqli_stmt_execute($stmt);



        } else {
            
            $response = array(
                'status' => 'loginFail'
            );
        }

        // Close the database connection
        mysqli_close($conn);

        // Convert the response array to JSON and send the response
        echo json_encode($response);
    } else {
        echo "<script>alert('Email parameter not provided')</script>";
    }
}
