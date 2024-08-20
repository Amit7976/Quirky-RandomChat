<?php
require "../conn.php";
session_start();

if (isset($_SESSION['is_login'])) {


    // FETCH OWN DATA
    if (isset($_POST['fetchDetails'])) {
        //     ini_set('display_errors', 1);
        // ini_set('display_startup_errors', 1);
        // error_reporting(E_ALL);
        // Get the current user's ID from the session
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $query = "SELECT * FROM users WHERE user_unique = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // Extract information from JSON columns
            $block = json_decode($row['block'], true);
            $report = json_decode($row['report'], true);
            $notificationOff = json_decode($row['notificationOff'], true);
            $friend = json_decode($row['friends'], true);
            $request = json_decode($row['request'], true);
            $sendRequest = json_decode($row['send_request'], true);

            // Check if $user_unique exists in the JSON arrays
            $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
            $isBlocked = in_array($user_unique, $block);
            $isReported = isset($report[$user_unique]);
            $isNotificationOff = in_array($user_unique, $notificationOff);
            $isFriend = in_array($user_unique, $friend);
            $isRequest = in_array($user_unique, $request);
            $isSendRequest = in_array($user_unique, $sendRequest);

            // Prepare the response
            $response = [
                'status' => 'Success',
                'details' => $row,
                'isBlocked' => $isBlocked,
                'isRequest' => $isRequest,
                'isReported' => $isReported,
                'isNotificationOff' => $isNotificationOff,
                'isFriend' => $isFriend,
                'isSendRequest' => $isSendRequest,
            ];
        } else {
            $response = [
                'status' => 'noUser',
            ];
        }
        echo json_encode($response);
    }





    // FETCH FRIENDS DATA
    if (isset($_POST['fetchData'])) {
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $query = "SELECT * FROM users WHERE user_unique = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $user_unique);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // Extract information from JSON columns
            $block = json_decode($row['block'], true);
            // $report = json_decode($row['report'], true);
            // $notificationOff = json_decode($row['notificationOff'], true);
            $friend = json_decode($row['friends'], true);
            $request = json_decode($row['request'], true);

            $uniqueId = $_SESSION['user_id'];
            // Check if $user_unique exists in the JSON arrays
            $isBlocked = in_array($uniqueId, $block);
            // $isReported = in_array($uniqueId, $report);
            // $isNotificationOff = in_array($uniqueId, $notificationOff);
            $isFriend = in_array($uniqueId, $friend);
            $isRequest = in_array($uniqueId, $request);



            $fetch_chat_query = "SELECT * FROM chat WHERE ((c_sender = ? AND c_receiver = ?) OR (c_sender = ? AND c_receiver = ?))";
            $fetch_chat_stmt = $conn->prepare($fetch_chat_query);
            $fetch_chat_stmt->bind_param("ssss", $user_id, $user_unique, $user_unique, $user_id);
            $fetch_chat_stmt->execute();
            $fetch_chat_result = $fetch_chat_stmt->get_result();


            $mediaFiles = array();

            if ($fetch_chat_result->num_rows > 0) {

                // Loop through each row in the result set
                while ($fetch_chat_row = $fetch_chat_result->fetch_assoc()) {
                    if(strlen($fetch_chat_row['c_image']) > 0){
                        $mediaFiles[] = $fetch_chat_row['c_image'];
                    }
                }
            }

            // Prepare the response
            $response = [
                'status' => 'Success',
                'data' => $row,
                'isBlocked' => $isBlocked,
                'isRequest' => $isRequest,
                'mediaFiles' => $mediaFiles,
                // 'isReported' => $isReported,
                // 'isNotificationOff' => $isNotificationOff,
                'isFriend' => $isFriend,
            ];
        } else {
            $response = [
                'status' => 'noUser',
            ];
        }

        echo json_encode($response);
    }





    // FETCH ALL CHATS
    if (isset($_POST['fetchChats'])) {
        $current_user = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
        // $oldMessage = mysqli_real_escape_string($conn, $_POST['oldMessage']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $check_user_online = $conn->query("SELECT * FROM users WHERE user_unique = '$user_unique'");
        $user_online_row = mysqli_fetch_assoc($check_user_online);

        $oldMessage = $_POST['oldMessage'];

        $placeholders = str_repeat('?,', count($oldMessage) - 1) . '?';
        $query = "SELECT * FROM chat WHERE ((c_sender = ? AND c_receiver = ?) OR (c_sender = ? AND c_receiver = ?)) AND c_unique_id NOT IN ($placeholders) ORDER BY c_date_time";
        $stmt = $conn->prepare($query);
        $params = array_merge([$user_unique, $current_user, $current_user, $user_unique], $oldMessage);
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();


        if ($result->num_rows > 0) {
            $messages = array();

            while ($row = $result->fetch_assoc()) {
                // Decode HTML entities for specific fields
                // echo "__||__";
                // echo $row['c_message'];
                // echo "__||__";
                // $row['c_message'] = htmlspecialchars_decode(htmlspecialchars($row['c_message']));
                // $row['c_reply_message'] = htmlspecialchars_decode(htmlspecialchars($row['c_reply_message']));
                // echo "now";
                // echo "__||__";
                // echo $row['c_message'];
                // echo "__||__";
                // Add the updated row to the $messages array
                $messages[] = $row;
            }

            $lastMessageId = $messages[count($messages) - 1]['c_unique_id'];
            $lastFetchedChatTime = $messages[count($messages) - 1]['c_date_time'];

            $status = $user_online_row['status'];
            date_default_timezone_set('Asia/Kolkata');
            $currentTimestamp = time();
            $userStatusTimestamp = $user_online_row['online_at'];
            if ($user_online_row['status'] == 'Online' && $userStatusTimestamp + 5 >= $currentTimestamp) {
                if ($userStatusTimestamp + 5 >= $currentTimestamp) {
                    $user_id = $_SESSION["user_id"];
                    if ($user_online_row['replyingId'] == $user_id) {
                        $response = array(
                            'status' => 'Success',
                            'data' => $messages,
                            'lastMessageId' => $lastMessageId,
                            'lastFetchedChatTime' => $lastFetchedChatTime,
                            'userStatus' => 'Typing...',
                            'replyingId' => $user_online_row['replyingId'],
                        );
                    } else {
                        $response = array(
                            'status' => 'Success',
                            'data' => $messages,
                            'lastMessageId' => $lastMessageId,
                            'lastFetchedChatTime' => $lastFetchedChatTime,
                            'userStatus' => $status,
                            'replyingId' => $user_online_row['replyingId'],
                        );
                    }
                } else {
                    $response = array(
                        'status' => 'Success',
                        'data' => $messages,
                        'lastMessageId' => $lastMessageId,
                        'lastFetchedChatTime' => $lastFetchedChatTime,
                        'userStatus' => 'Offline',
                    );
                }
            } else {
                $response = array(
                    'status' => 'Success',
                    'data' => $messages,
                    'lastMessageId' => $lastMessageId,
                    'lastFetchedChatTime' => $lastFetchedChatTime,
                    'userStatus' => 'Offline',
                );
            }

            // UPDATE CHAT SEEN
            $chat_seen_query = "UPDATE chat SET c_reached = 1, c_seen = 1 WHERE c_sender = ? AND c_receiver = ?";
            $chat_seen_stmt = $conn->prepare($chat_seen_query);
            $chat_seen_stmt->bind_param("ss", $user_unique, $current_user);
            $chat_seen_stmt->execute();
        } else {
            $status = $user_online_row['status'];
            date_default_timezone_set('Asia/Kolkata');
            $currentTimestamp = time();
            $userStatusTimestamp = $user_online_row['online_at'];

            if ($user_online_row['status'] == 'Online' && $userStatusTimestamp + 5 >= $currentTimestamp) {
                if ($userStatusTimestamp + 5 >= $currentTimestamp) {
                    $user_id = $_SESSION["user_id"];
                    if ($user_online_row['replyingId'] == $user_id) {
                        $response = array(
                            'status' => 'NoNewMessages',
                            'data' => 'No new messages',
                            'userStatus' => 'Typing...',
                        );
                    } else {
                        $response = array(
                            'status' => 'NoNewMessages',
                            'data' => 'No new messages',
                            'userStatus' => $status,
                        );
                    }
                } else {
                    $response = array(
                        'status' => 'NoNewMessages',
                        'data' => 'No new messages',
                        'userStatus' => 'Offline',
                    );
                }
            } else {
                $response = array(
                    'status' => 'NoNewMessages',
                    'data' => 'No new messages',
                    'userStatus' => 'Offline',
                );
            }
        }



        echo json_encode($response);
    }




    // SHOW TYPING
    if (isset($_POST['typing'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $query = "UPDATE users SET replyingId = ? WHERE user_unique = ?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'ss', $user_unique, $user_id);
        $query_run = mysqli_stmt_execute($stmt);
    }



    // SEND CHAT
    if (isset($_POST['sendChats'])) {
        $current_user = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
        $message = mysqli_real_escape_string($conn, $_POST['message']);
        $chat_unique = rand(111111111, 999999999);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Check if the current user and the target user are friends
        $check_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_friends_stmt = mysqli_prepare($conn, $check_friends_query);
        mysqli_stmt_bind_param($check_friends_stmt, 's', $current_user);
        mysqli_stmt_execute($check_friends_stmt);
        mysqli_stmt_bind_result($check_friends_stmt, $friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_friends_stmt);

        // Decode the existing JSON data into an associative array
        $friends_array = json_decode($friends_json, true);

        // Check if the target user is in the friends array
        if (!in_array($user_unique, $friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'You are not friends with the target user.',
            );
            echo json_encode($response);
            exit;
        }

        // Check if the target user has the current user in their friends array
        $check_target_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_target_friends_stmt = mysqli_prepare($conn, $check_target_friends_query);
        mysqli_stmt_bind_param($check_target_friends_stmt, 's', $user_unique);
        mysqli_stmt_execute($check_target_friends_stmt);
        mysqli_stmt_bind_result($check_target_friends_stmt, $target_friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_target_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_target_friends_stmt);

        // Decode the target user's friends JSON into an associative array
        $target_friends_array = json_decode($target_friends_json, true);

        // Check if the current user is in the target user's friends array
        if (!in_array($current_user, $target_friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'Target user does not have you as a friend.',
            );
            echo json_encode($response);
            exit;
        }

        // Insert the chat message
        $insert_chat_query = "INSERT INTO chat (`c_sender`, `c_receiver`, `c_message`, `c_unique_id`) VALUES (?, ?, ?, ?)";
        $insert_chat_stmt = mysqli_prepare($conn, $insert_chat_query);
        mysqli_stmt_bind_param($insert_chat_stmt, 'ssss', $current_user, $user_unique, $message, $chat_unique);
        $insert_chat_result = mysqli_stmt_execute($insert_chat_stmt);

        // Check if the chat message was successfully inserted
        if ($insert_chat_result) {
            $response = array(
                'status' => 'Success',
            );
        } else {
            $response = array(
                'status' => 'Error',
                'message' => 'Error inserting chat message: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($insert_chat_stmt);

        // Update the replyingId status
        $update_status_query = "UPDATE users SET replyingId = 0 WHERE user_unique = ?";
        $update_status_stmt = mysqli_prepare($conn, $update_status_query);
        mysqli_stmt_bind_param($update_status_stmt, 's', $current_user);
        $update_status_result = mysqli_stmt_execute($update_status_stmt);

        // Check if the replyingId status was successfully updated
        if (!$update_status_result) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating replyingId status: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($update_status_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }





    // SEND IMAGES
    if (isset($_POST['sendImage'])) {
        $current_user = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);



        // Check if the current user and the target user are friends
        $check_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_friends_stmt = mysqli_prepare($conn, $check_friends_query);
        mysqli_stmt_bind_param($check_friends_stmt, 's', $current_user);
        mysqli_stmt_execute($check_friends_stmt);
        mysqli_stmt_bind_result($check_friends_stmt, $friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_friends_stmt);

        // Decode the existing JSON data into an associative array
        $friends_array = json_decode($friends_json, true);

        // Check if the target user is in the friends array
        if (!in_array($user_unique, $friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'You are not friends with the target user.',
            );
            echo json_encode($response);
            exit;
        }

        // Check if the target user has the current user in their friends array
        $check_target_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_target_friends_stmt = mysqli_prepare($conn, $check_target_friends_query);
        mysqli_stmt_bind_param($check_target_friends_stmt, 's', $user_unique);
        mysqli_stmt_execute($check_target_friends_stmt);
        mysqli_stmt_bind_result($check_target_friends_stmt, $target_friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_target_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_target_friends_stmt);

        // Decode the target user's friends JSON into an associative array
        $target_friends_array = json_decode($target_friends_json, true);

        // Check if the current user is in the target user's friends array
        if (!in_array($current_user, $target_friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'Target user does not have you as a friend.',
            );
            echo json_encode($response);
            exit;
        }

        $chat_unique = rand(111111111, 999999999);

        // image upload
        $file_name = $_FILES['Image']['name'];
        $file_tmp = $_FILES['Image']['tmp_name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $new_Image = preg_replace('/[^a-zA-Z0-9_]/', '', $chat_unique) . '_Image_' . '.' . $file_ext;
        $upload_path = "../img/chatImage/" . $new_Image;
        $valid_extensions = array('jpg', 'png', 'jpeg');

        if (in_array($file_ext, $valid_extensions)) {
            if (move_uploaded_file($file_tmp, $upload_path)) {
                // echo " image uploaded successfully.";
            } else {
                // echo "Error uploading  image.";
            }
        } else {
            // echo "Invalid file type for  image.";
        }


        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Insert the IMAGEs
        $insert_chat_query = "INSERT INTO chat (`c_sender`, `c_receiver`, `c_image`, `c_unique_id`) VALUES (?, ?, ?, ?)";
        $insert_chat_stmt = mysqli_prepare($conn, $insert_chat_query);
        mysqli_stmt_bind_param($insert_chat_stmt, 'ssss', $current_user, $user_unique, $new_Image, $chat_unique);
        $insert_chat_result = mysqli_stmt_execute($insert_chat_stmt);

        // Check if the chat message was successfully inserted
        if ($insert_chat_result) {
            $response = array(
                'status' => 'Success',
            );
        } else {
            $response = array(
                'status' => 'Error',
                'message' => 'Error inserting chat message: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($insert_chat_stmt);

        // Update the replyingId status
        $update_status_query = "UPDATE users SET replyingId = 0 WHERE user_unique = ?";
        $update_status_stmt = mysqli_prepare($conn, $update_status_query);
        mysqli_stmt_bind_param($update_status_stmt, 's', $current_user);
        $update_status_result = mysqli_stmt_execute($update_status_stmt);

        // Check if the replyingId status was successfully updated
        if (!$update_status_result) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating replyingId status: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($update_status_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }






    // SET STATUS ONLINE
    if (isset($_POST['online'])) {

        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $My_status = 'Online';

        date_default_timezone_set('Asia/Kolkata');
        $currentTimestamp = date('Y-m-d H:i:s');
        $timestamp = strtotime($currentTimestamp);

        $query = "UPDATE users SET status = ?, online_at = ?,replyingId = 0 WHERE user_unique = ?";
        $stmt = mysqli_prepare($conn, $query);

        mysqli_stmt_bind_param($stmt, 'sss', $My_status, $timestamp, $user_id);
        $query_run = mysqli_stmt_execute($stmt);
    }






    // BLOCK USER
    if (isset($_POST['block'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch user data from the database
        $query = "SELECT * FROM users WHERE user_unique = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();


            // Extract information from JSON columns
            $notificationOff = json_decode($row['notificationOff'], true);
            $friend = json_decode($row['friends'], true);
            $request = json_decode($row['request'], true);
            $sendRequest = json_decode($row['send_request'], true);
            $block = json_decode($row['block'], true);

            // Remove user_unique from arrays
            $user_unique_array = array($user_unique);
            $notificationOff = array_values(array_diff($notificationOff, $user_unique_array));
            $friend = array_values(array_diff($friend, $user_unique_array));
            $request = array_values(array_diff($request, $user_unique_array));
            $sendRequest = array_values(array_diff($sendRequest, $user_unique_array));
            $block[] = $user_unique;

            // Encode the modified arrays back to JSON
            $updated_notificationOff = json_encode($notificationOff);
            $updated_friend = json_encode($friend);
            $updated_request = json_encode($request);
            $updated_sendRequest = json_encode($sendRequest);
            $updated_block = json_encode($block);

            // Update the columns in the database
            $update_query = "UPDATE users SET `block` = ?, friends = ?, notificationOff = ?, request = ?, send_request = ? WHERE user_unique = ?";
            $update_stmt = mysqli_prepare($conn, $update_query);
            mysqli_stmt_bind_param($update_stmt, 'ssssss', $updated_block, $updated_friend, $updated_notificationOff, $updated_request, $updated_sendRequest, $user_id);
            $query_run = mysqli_stmt_execute($update_stmt);

            // Close the statement
            mysqli_stmt_close($update_stmt);

            // REMOVE CURRENT USER ID FROM FRIEND'S FRIEND JSON
            $fetch_friend_query = "SELECT friends FROM users WHERE user_unique = ?";
            $fetch_stmt_friend = mysqli_prepare($conn, $fetch_friend_query);
            mysqli_stmt_bind_param($fetch_stmt_friend, 's', $user_unique);
            mysqli_stmt_execute($fetch_stmt_friend);
            mysqli_stmt_bind_result($fetch_stmt_friend, $friend_json_data);
            mysqli_stmt_fetch($fetch_stmt_friend);
            mysqli_stmt_close($fetch_stmt_friend);

            $friend_data_array = json_decode($friend_json_data, true);
            $friend_data_array = array_values(array_diff($friend_data_array, array($user_id)));
            $updated_friend_json_data = json_encode($friend_data_array);

            $update_query_friend = "UPDATE users SET friends = ? WHERE user_unique = ?";
            $update_stmt_friend = mysqli_prepare($conn, $update_query_friend);
            mysqli_stmt_bind_param($update_stmt_friend, 'ss', $updated_friend_json_data, $user_unique);
            $query_run_friend = mysqli_stmt_execute($update_stmt_friend);

            // Close the statement
            mysqli_stmt_close($update_stmt_friend);



            // DELETE CHATS

            // Fetch chat data from the database
            $fetch_chat_query = "SELECT *FROM chat WHERE ((c_sender = ? AND c_receiver = ?) OR (c_sender = ? AND c_receiver = ?))";
            $fetch_chat_stmt = $conn->prepare($fetch_chat_query);
            $fetch_chat_stmt->bind_param("ssss", $user_id, $user_unique, $user_unique, $user_id);
            $fetch_chat_stmt->execute();
            $fetch_chat_result = $fetch_chat_stmt->get_result();

            if ($fetch_chat_result->num_rows > 0) {

                // Loop through each row in the result set
                while ($fetch_chat_row = $fetch_chat_result->fetch_assoc()) {
                    $chat_image = $fetch_chat_row["c_image"];

                    // Check if $chat_image is not empty before attempting to delete the file
                    if (!empty($chat_image)) {
                        // Delete image file from filesystem
                        $image_path = '../img/chatImage/' . $chat_image;
                        if (file_exists($image_path)) {
                            unlink($image_path);
                        }
                    }
                }
            }

            $delete_query = "DELETE FROM chat WHERE ((c_sender = ? AND c_receiver = ?) OR (c_sender = ? AND c_receiver = ?))";
            $delete_stmt = $conn->prepare($delete_query);
            $delete_stmt->bind_param("ssss", $user_id, $user_unique, $user_unique, $user_id);
            $delete_stmt->execute();
            $delete_stmt->close();

            if (!$query_run || !$query_run_friend) {
                // Set error response if the update fails
                $response = array(
                    'status' => 'Error',
                    'message' => 'Error updating JSON columns: ' . mysqli_error($conn),
                );
            } else {
                // Success response
                $response = array(
                    'status' => 'Success',
                    'message' => 'User blocked successfully.',
                );
            }

            // Send the response in JSON format
            echo json_encode($response);
        }
    }








    // UNBLOCK USER
    if (isset($_POST['unblock'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch existing JSON data from the database
        $fetch_query = "SELECT block FROM users WHERE user_unique = ?";
        $fetch_stmt = mysqli_prepare($conn, $fetch_query);
        mysqli_stmt_bind_param($fetch_stmt, 's', $user_id);
        mysqli_stmt_execute($fetch_stmt);
        mysqli_stmt_bind_result($fetch_stmt, $block_json);

        // Fetch the result
        mysqli_stmt_fetch($fetch_stmt);

        // Close the statement
        mysqli_stmt_close($fetch_stmt);

        // Decode the existing JSON data into an array
        $block_array = json_decode($block_json, true);

        $block_array = array_diff($block_array, array($user_unique));

        // Encode the modified array back to JSON
        $updated_block_json = json_encode($block_array);

        // Update the 'block' column in the database
        $update_query = "UPDATE users SET block = ? WHERE user_unique = ?";
        $update_stmt = mysqli_prepare($conn, $update_query);
        mysqli_stmt_bind_param($update_stmt, 'ss', $updated_block_json, $user_id);
        $query_run = mysqli_stmt_execute($update_stmt);


        if (!$query_run) {
            // Set error response if the update fails
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating the "block" JSON:' . mysqli_error($conn),
            );
        } else {
            // Success response
            $response = array(
                'status' => 'Success',
                'message' => 'ID removed from the "block" JSON successfully.',
            );
        }

        // Close the statement for the current user
        mysqli_stmt_close($update_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }








    // REMOVE FRIEND
    if (isset($_POST['removeFriend'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }


        $query = "SELECT * FROM users WHERE user_unique = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // Extract information from JSON columns
            $notificationOff = json_decode($row['notificationOff'], true);
            $friend = json_decode($row['friends'], true);
            $request = json_decode($row['request'], true);
            $sendRequest = json_decode($row['send_request'], true);

            // Convert the string to an array
            $user_unique_array = array($user_unique);

            // Assuming $notificationOff is an array that you want to modify
            $notificationOff = array_values(array_diff($notificationOff, $user_unique_array));

            $friend = array_diff($friend, $user_unique_array);
            $request = array_diff($request, $user_unique_array);
            $sendRequest = array_diff($sendRequest, $user_unique_array);

            // Encode the modified array back to JSON
            $updated_notificationOff = json_encode($notificationOff);
            $updated_friend = json_encode($friend);
            $updated_request = json_encode($request);
            $updated_sendRequest = json_encode($sendRequest);

            // Update the column in the database
            $update_query = "UPDATE users SET friends = ?, notificationOff = ?, request = ?, send_request = ? WHERE user_unique = ?";
            $update_stmt = mysqli_prepare($conn, $update_query);
            mysqli_stmt_bind_param($update_stmt, 'sssss', $updated_friend, $updated_notificationOff, $updated_request, $updated_sendRequest, $user_id);
            $query_run = mysqli_stmt_execute($update_stmt);
        }

        $friend_query = "SELECT * FROM users WHERE user_unique = ?";
        $friend_stmt = $conn->prepare($friend_query);
        $friend_stmt->bind_param("s", $user_unique);
        $friend_stmt->execute();
        $result = $friend_stmt->get_result();

        $friend_friend = json_decode($row['friends'], true);
        $user_id_array = array($user_id);
        $friend_friend = array_diff($friend_friend, $user_id_array);
        $friend_updated_friend = json_encode($friend_friend);

        // Update the column in the database
        $friend_update_query = "UPDATE users SET friends = ? WHERE user_unique = ?";
        $update_friend_stmt = mysqli_prepare($conn, $friend_update_query);
        mysqli_stmt_bind_param($update_friend_stmt, 'ss', $friend_updated_friend, $user_unique);
        $friend_query_run = mysqli_stmt_execute($update_friend_stmt);


        if (!$query_run || !$friend_query_run) {
            // Set error response if the update fails
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating the "friends" and "request" JSONs: ' . mysqli_error($conn),
            );
        } else {
            // Success response
            $response = array(
                'status' => 'Success',
                'message' => 'Unfriend Successfully',
            );
        }

        // Close the statement for the current user
        mysqli_stmt_close($update_stmt);
        // Close the statement for the friend user
        mysqli_stmt_close($update_friend_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }




    // REPORT
    if (isset($_POST['report'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
        $reportUserText = mysqli_real_escape_string($conn, $_POST['reportUserText']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch existing JSON data from the database
        $fetch_query = "SELECT report FROM users WHERE user_unique = ?";
        $fetch_stmt = mysqli_prepare($conn, $fetch_query);
        mysqli_stmt_bind_param($fetch_stmt, 's', $user_id);
        mysqli_stmt_execute($fetch_stmt);
        mysqli_stmt_bind_result($fetch_stmt, $report_json);

        // Fetch the result
        mysqli_stmt_fetch($fetch_stmt);

        // Close the statement
        mysqli_stmt_close($fetch_stmt);

        // Decode the existing JSON data into an associative array
        $report_array = json_decode($report_json, true);

        // Add or update the report for the specified user_unique
        $report_array[$user_unique] = ['report' => $reportUserText];

        // Encode the modified array back to JSON
        $updated_report_json = json_encode($report_array);

        // Update the 'report' column in the database
        $update_query = "UPDATE users SET report = ? WHERE user_unique = ?";
        $update_stmt = mysqli_prepare($conn, $update_query);
        mysqli_stmt_bind_param($update_stmt, 'ss', $updated_report_json, $user_id);
        $query_run = mysqli_stmt_execute($update_stmt);

        if (!$query_run) {
            // Set error response if the update fails
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating the "report" JSON:  ' . mysqli_error($conn),
            );
        } else {
            // Success response
            $response = array(
                'status' => 'Success',
                'message' => 'Report added/updated in the "report" JSON successfully.',
            );
        }

        // Close the statement
        mysqli_stmt_close($update_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }



    // Remove Report
    if (isset($_POST['removeReport'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch existing JSON data from the database
        $fetch_query = "SELECT report FROM users WHERE user_unique = ?";
        $fetch_stmt = mysqli_prepare($conn, $fetch_query);
        mysqli_stmt_bind_param($fetch_stmt, 's', $user_id);
        mysqli_stmt_execute($fetch_stmt);
        mysqli_stmt_bind_result($fetch_stmt, $report_json);

        // Fetch the result
        mysqli_stmt_fetch($fetch_stmt);

        // Close the statement
        mysqli_stmt_close($fetch_stmt);

        // Decode the existing JSON data into an associative array
        $report_array = json_decode($report_json, true);

        // Check if the user_unique exists in the report array
        if (isset($report_array[$user_unique])) {
            // Remove the report for the specified user_unique
            unset($report_array[$user_unique]);

            // Encode the modified array back to JSON
            $updated_report_json = json_encode($report_array);

            // Update the 'report' column in the database
            $update_query = "UPDATE users SET report = ? WHERE user_unique = ?";
            $update_stmt = mysqli_prepare($conn, $update_query);
            mysqli_stmt_bind_param($update_stmt, 'ss', $updated_report_json, $user_id);
            $query_run = mysqli_stmt_execute($update_stmt);

            if (!$query_run) {
                // Set error response if the update fails
                $response = array(
                    'status' => 'Error',
                    'message' => 'Error updating the "report" JSON:  ' . mysqli_error($conn),
                );
            } else {
                // Success response
                $response = array(
                    'status' => 'Success',
                    'message' => 'Report removed from the "report" JSON successfully.',
                );
            }
        } else {
            $response = array(
                'status' => 'Error',
                'message' => 'Report does not exist for the specified user_unique.',
            );
        }


        // Send the response in JSON format
        echo json_encode($response);
    }



    // Remove or Add Notification
    if (isset($_POST['manageNotification'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch existing JSON data from the database
        $fetch_query = "SELECT notificationOff FROM users WHERE user_unique = ?";
        $fetch_stmt = mysqli_prepare($conn, $fetch_query);
        mysqli_stmt_bind_param($fetch_stmt, 's', $user_id);
        mysqli_stmt_execute($fetch_stmt);
        mysqli_stmt_bind_result($fetch_stmt, $notification_json);
        mysqli_stmt_fetch($fetch_stmt);
        mysqli_stmt_close($fetch_stmt);


        $notification_array = json_decode($notification_json, true);


        if (in_array($user_unique, $notification_array)) {

            $user_unique_array = array($user_unique);
            $notification_array = array_values(array_diff($notification_array, $user_unique_array));

            $response = array(
                'status' => 'Success',
                'action' => 'removed',
            );
        } else {

            $notification_array[] = $user_unique;

            $response = array(
                'status' => 'Success',
                'action' => 'added',
            );
        }

        $updated_notification_json = json_encode($notification_array);

        // Update the 'notification' column in the database
        $update_query = "UPDATE users SET notificationOff = ? WHERE user_unique = ?";
        $update_stmt = mysqli_prepare($conn, $update_query);
        mysqli_stmt_bind_param($update_stmt, 'ss', $updated_notification_json, $user_id);
        $query_run = mysqli_stmt_execute($update_stmt);

        if (!$query_run) {
            // Set error response if the update fails
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating the "notificationOff" JSON: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($update_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }



    // ACCEPT FRIEND REQUEST
    if (isset($_POST['acceptFriend'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // ADD FRIEND UNIQUE ID INTO THE FRIENDS JSON AND REMOVE HIS ID FROM REQUEST JSON
        $fetch_query_current_user = "SELECT friends, request FROM users WHERE user_unique = ?";
        $fetch_stmt_current_user = mysqli_prepare($conn, $fetch_query_current_user);
        mysqli_stmt_bind_param($fetch_stmt_current_user, 's', $user_id);
        mysqli_stmt_execute($fetch_stmt_current_user);
        mysqli_stmt_bind_result($fetch_stmt_current_user, $friends_json, $request_json);
        mysqli_stmt_fetch($fetch_stmt_current_user);
        mysqli_stmt_close($fetch_stmt_current_user);

        $friends_array = json_decode($friends_json, true);
        $request_array = json_decode($request_json, true);

        $friends_array[] = $user_unique;
        $request_array = array_diff($request_array, array($user_unique));

        $updated_friends_json = json_encode($friends_array);
        $updated_request_json = json_encode($request_array);


        // ADD THE CURRENT USER ID INTO THE FRIEND'S  'FRIENDS' JSON AND REMOVE IT FROM 'SEND_REQUEST' JSON
        $friend_fetch_query = "SELECT friends, send_request FROM users WHERE user_unique = ?";
        $friend_fetch_stmt = mysqli_prepare($conn, $friend_fetch_query);
        mysqli_stmt_bind_param($friend_fetch_stmt, 's', $user_unique);
        mysqli_stmt_execute($friend_fetch_stmt);
        mysqli_stmt_bind_result($friend_fetch_stmt, $friend_friends_json, $send_request_json);
        mysqli_stmt_fetch($friend_fetch_stmt);
        mysqli_stmt_close($friend_fetch_stmt);

        $friend_friends_array = json_decode($friend_friends_json, true);
        $send_request_array = json_decode($send_request_json, true);

        $friend_friends_array[] = $user_id;
        $send_request_array = array_diff($send_request_array, array($user_id));

        $updated_friend_friends_json = json_encode($friend_friends_array);
        $updated_send_request_json = json_encode($send_request_array);

        // Update the 'friends' and 'request' columns in the database for the current user
        $update_query_current_user = "UPDATE users SET friends = ?, request = ? WHERE user_unique = ?";
        $update_stmt_current_user = mysqli_prepare($conn, $update_query_current_user);
        mysqli_stmt_bind_param($update_stmt_current_user, 'sss', $updated_friends_json, $updated_request_json, $user_id);
        $query_run_current_user = mysqli_stmt_execute($update_stmt_current_user);

        // Update the 'send_request' and 'friends' columns in the database for the friend user
        $update_query_friend_user = "UPDATE users SET send_request = ?, friends = ? WHERE user_unique = ?";
        $update_stmt_friend_user = mysqli_prepare($conn, $update_query_friend_user);
        mysqli_stmt_bind_param($update_stmt_friend_user, 'sss', $updated_send_request_json, $updated_friend_friends_json, $user_unique);
        $query_run_friend_user = mysqli_stmt_execute($update_stmt_friend_user);

        if (!$query_run_current_user || !$query_run_friend_user) {
            // Set error response if the update fails
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating the "friends" and "request" JSONs: ' . mysqli_error($conn),
            );
        } else {
            // Success response
            $response = array(
                'status' => 'Success',
                'message' => 'Friend request accepted successfully.',
            );
        }

        // Close the statement for the current user
        mysqli_stmt_close($update_stmt_current_user);
        // Close the statement for the friend user
        mysqli_stmt_close($update_stmt_friend_user);

        // Send the response in JSON format
        echo json_encode($response);
    }


    // SEND FRIEND REQUEST
    if (isset($_POST['sendFriendRequest'])) {
        $current_user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch and update send_request for the current user
        $fetch_query_current_user = "SELECT `send_request`, `block` FROM users WHERE user_unique = ?";
        $fetch_stmt_current_user = mysqli_prepare($conn, $fetch_query_current_user);
        mysqli_stmt_bind_param($fetch_stmt_current_user, 's', $current_user_id);
        mysqli_stmt_execute($fetch_stmt_current_user);
        mysqli_stmt_bind_result($fetch_stmt_current_user, $current_user_block_json, $send_request_json);
        mysqli_stmt_fetch($fetch_stmt_current_user);
        mysqli_stmt_close($fetch_stmt_current_user);

        $current_user_block_array = json_decode($current_user_block_json, true);

        // Check if the target user is in the friends array
        if (in_array($user_unique, $current_user_block_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'You Blocked this user',
            );
            echo json_encode($response);
            exit;
        }

        // Fetch and update request for the friend user
        $fetch_query_friend_user = "SELECT `request`, `block` FROM users WHERE user_unique = ?";
        $fetch_stmt_friend_user = mysqli_prepare($conn, $fetch_query_friend_user);
        mysqli_stmt_bind_param($fetch_stmt_friend_user, 's', $user_unique);
        mysqli_stmt_execute($fetch_stmt_friend_user);
        mysqli_stmt_bind_result($fetch_stmt_friend_user, $friend_block_json, $request_json);
        mysqli_stmt_fetch($fetch_stmt_friend_user);
        mysqli_stmt_close($fetch_stmt_friend_user);

        $friend_block_array = json_decode($friend_block_json, true);

        // Check if the target user is in the friends array
        if (in_array($current_user_id, $friend_block_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'This User Blocked You',
            );
            echo json_encode($response);
            exit;
        }





        $send_request_array = json_decode($send_request_json, true);
        $send_request_array[] = $user_unique;
        $updated_send_request_json = json_encode($send_request_array);

        $update_query_current_user = "UPDATE users SET send_request = ? WHERE user_unique = ?";
        $update_stmt_current_user = mysqli_prepare($conn, $update_query_current_user);
        mysqli_stmt_bind_param($update_stmt_current_user, 'ss', $updated_send_request_json, $current_user_id);
        $query_run_current_user = mysqli_stmt_execute($update_stmt_current_user);
        mysqli_stmt_close($update_stmt_current_user);




        $request_array = json_decode($request_json, true);
        $request_array[] = $current_user_id;
        $updated_request_json = json_encode($request_array);

        $update_query_friend_user = "UPDATE users SET request = ? WHERE user_unique = ?";
        $update_stmt_friend_user = mysqli_prepare($conn, $update_query_friend_user);
        mysqli_stmt_bind_param($update_stmt_friend_user, 'ss', $updated_request_json, $user_unique);
        $query_run_friend_user = mysqli_stmt_execute($update_stmt_friend_user);
        mysqli_stmt_close($update_stmt_friend_user);

        // Provide a response
        $response = [
            'status' => $query_run_current_user && $query_run_friend_user ? 'Success' : 'Error',
        ];

        echo json_encode($response);
    }



    // REMOVED FRIEND REQUEST
    if (isset($_POST['removeFriendRequest'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch existing JSON data from the database for the current user
        $fetch_query_current_user = "SELECT send_request FROM users WHERE user_unique = ?";
        $fetch_stmt_current_user = mysqli_prepare($conn, $fetch_query_current_user);
        mysqli_stmt_bind_param($fetch_stmt_current_user, 's', $user_id);
        mysqli_stmt_execute($fetch_stmt_current_user);
        mysqli_stmt_bind_result($fetch_stmt_current_user, $send_request_json);
        mysqli_stmt_fetch($fetch_stmt_current_user);
        mysqli_stmt_close($fetch_stmt_current_user);

        $send_request_array = json_decode($send_request_json, true);
        $send_request_array = array_diff($send_request_array, array($user_unique));
        $updated_send_request_json = json_encode($send_request_array);

        // Update the 'send_request' column in the database for the current user
        $update_query_current_user = "UPDATE users SET send_request = ? WHERE user_unique = ?";
        $update_stmt_current_user = mysqli_prepare($conn, $update_query_current_user);
        mysqli_stmt_bind_param($update_stmt_current_user, 'ss', $updated_send_request_json, $user_id);
        $query_run_current_user = mysqli_stmt_execute($update_stmt_current_user);

        // Fetch existing JSON data from the database for the friend user
        $fetch_query_friend_user = "SELECT request FROM users WHERE user_unique = ?";
        $fetch_stmt_friend_user = mysqli_prepare($conn, $fetch_query_friend_user);
        mysqli_stmt_bind_param($fetch_stmt_friend_user, 's', $user_unique);
        mysqli_stmt_execute($fetch_stmt_friend_user);
        mysqli_stmt_bind_result($fetch_stmt_friend_user, $request_json);
        mysqli_stmt_fetch($fetch_stmt_friend_user);
        mysqli_stmt_close($fetch_stmt_friend_user);

        $request_array = json_decode($request_json, true);
        $request_array = array_diff($request_array, array($user_id));
        $updated_request_json = json_encode($request_array);

        // Update the 'request' column in the database for the friend user
        $update_query_friend_user = "UPDATE users SET request = ? WHERE user_unique = ?";
        $update_stmt_friend_user = mysqli_prepare($conn, $update_query_friend_user);
        mysqli_stmt_bind_param($update_stmt_friend_user, 'ss', $updated_request_json, $user_unique);
        $query_run_friend_user = mysqli_stmt_execute($update_stmt_friend_user);

        if (
            !$query_run_current_user || !$query_run_friend_user
        ) {
            // Set error response if the update fails
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating the "send_request" and "request" JSONs: ' . json_last_error_msg(),
            );
        } else {
            // Success response
            $response = array(
                'status' => 'Success',
                'message' => 'Friend request removed successfully.',
            );
        }

        // Close the statement for the current user
        mysqli_stmt_close($update_stmt_current_user);
        // Close the statement for the friend user
        mysqli_stmt_close($update_stmt_friend_user);

        // Send the response in JSON format
        echo json_encode($response);
    }





    // SEARCH FRIEND
    if (isset($_POST['searchFriend'])) {
        $searchInput = $_POST['searchInput'];
        $current_user_id = $_SESSION['user_id'];

        // Check if the connection was successful
        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }


        $get_current_user_details = "SELECT * FROM users WHERE user_unique = ?";
        $stmt = $conn->prepare($get_current_user_details);
        $stmt->bind_param("s", $current_user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        $currentUserUserName = $row['userName'];
        $currentUserName = $row['name'];


        // Prepare the SQL query with prepared statements
        $query = "SELECT * FROM users WHERE (userName LIKE ? OR name LIKE ?) AND (userName NOT LIKE ? OR name NOT LIKE ?)";
        $stmt = $conn->prepare($query);

        // Bind parameters
        $searchInputWildCarded = '%' . $searchInput . '%';
        $currentUserUserNameWildCarded = '%' . $currentUserUserName . '%';
        $currentUserNameWildCarded = '%' . $currentUserName . '%';
        $stmt->bind_param("ssss", $searchInputWildCarded, $searchInputWildCarded, $currentUserUserNameWildCarded, $currentUserNameWildCarded);

        // Execute the query
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if any rows were returned
        if ($result->num_rows > 0) {
            // Fetch all rows into an array
            $rows = $result->fetch_all(MYSQLI_ASSOC);

            // Create an associative array with the response data
            $response = array(
                'status' => 'available',
                'data' => $rows,
            );
        } else {
            // Create an associative array with the response data
            $response = array(
                'status' => 'no_user',
                'data' => null,
            );
        }

        // Close the statement
        $stmt->close();

        // Close the database connection
        mysqli_close($conn);

        // Convert the response array to JSON and send the response
        echo json_encode($response);
    }






    // UPDATE PROFILE DETAILS
    if (isset($_POST['updateDetails'])) {

        $current_user = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $fullNameUpdate = mysqli_real_escape_string($conn, $_POST['fullNameUpdate']);
        $userNameUpdate = mysqli_real_escape_string($conn, $_POST['userNameUpdate']);
        $descriptionUpdate = mysqli_real_escape_string($conn, $_POST['descriptionUpdate']);
        $numberUpdate = mysqli_real_escape_string($conn, $_POST['numberUpdate']);
        $genderUpdate = mysqli_real_escape_string($conn, $_POST['genderUpdate']);
        $hobbiesUpdate = mysqli_real_escape_string($conn, $_POST['hobbiesUpdate']);

        $chat_unique = rand(11111, 99999);
        $new_ProfileImage = null;

        // No new ProfileImage provided, fetch the existing one
        $get_user_details_query = "SELECT * FROM users WHERE user_unique = ?";
        $get_user_details_stmt = $conn->prepare($get_user_details_query);
        $get_user_details_stmt->bind_param("s", $current_user);
        $get_user_details_stmt->execute();
        $get_user_details_result = $get_user_details_stmt->get_result();



        if ($get_user_details_result->num_rows > 0) {
            $user_details_row = $get_user_details_result->fetch_assoc();
            $new_ProfileImage = $user_details_row['avatar'];
            $new_ProfileUserName = $user_details_row['userName'];

            if (isset($_FILES['ProfileImage']) && $_FILES['ProfileImage']['error'] === UPLOAD_ERR_OK) {

                // Check if $chat_image is not empty before attempting to delete the file
                if (!empty($new_ProfileImage)) {
                    if ($new_ProfileImage !== 'robot.png' && $new_ProfileImage !== 'koala.png' && $new_ProfileImage !== 'girl2.png' && $new_ProfileImage !== 'girl.png' && $new_ProfileImage !== 'boy.png' && $new_ProfileImage !== 'boy2.png') {
                        // Delete image file from filesystem
                        $image_path = '../img/avatar/' . $new_ProfileImage;
                        if (file_exists($image_path)) {
                            unlink($image_path);
                        }
                    }
                }


                // ProfileImage upload
                $file_name = $_FILES['ProfileImage']['name'];
                $file_tmp = $_FILES['ProfileImage']['tmp_name'];
                $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
                $new_ProfileImage = preg_replace('/[^a-zA-Z0-9_]/', '', $chat_unique) . '_ProfileImage_' . '.' . $file_ext;
                $upload_path = "../img/avatar/" . $new_ProfileImage;
                $valid_extensions = array('jpg', 'png', 'jpeg');

                if (in_array($file_ext, $valid_extensions)) {
                    if (move_uploaded_file($file_tmp, $upload_path)) {
                        // File uploaded successfully.
                    } else {
                        // Handle the error.
                    }
                } else {
                    // Invalid file type for image.
                }
            }




            if ($new_ProfileUserName !== $userNameUpdate) {

                // CHECK USERNAME
                $check_user_name_query = "SELECT * FROM users WHERE userName = ?";
                $check_user_name_stmt = $conn->prepare($check_user_name_query);
                $check_user_name_stmt->bind_param("s", $userNameUpdate);
                $check_user_name_stmt->execute();
                $check_user_name_result = $check_user_name_stmt->get_result();
                if ($check_user_name_result->num_rows > 0) {
                    $response = array(
                        'status' => 'Error',
                        'message' => 'UserNameFound',
                    );
                    echo json_encode($response);
                    exit;
                }
            }
        }

        // Update the Profile
        $update_query = "UPDATE users SET `avatar` = ?, `name` = ?, `userName` = ?, `description` = ?, `number` = ?, `gender` = ?, `hobbies` = ? WHERE `user_unique` = ?";
        $update_stmt = mysqli_prepare($conn, $update_query);
        mysqli_stmt_bind_param($update_stmt, 'ssssssss', $new_ProfileImage, $fullNameUpdate, $userNameUpdate, $descriptionUpdate, $numberUpdate, $genderUpdate, $hobbiesUpdate, $current_user);
        $update_result = mysqli_stmt_execute($update_stmt);

        if (!$update_result) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating Profile: ' . mysqli_error($conn),
            );
        } else {
            $response = array(
                'status' => 'Success',
                'message' => 'Profile updated successfully',
            );
        }

        // Close the statement
        mysqli_stmt_close($update_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }







    // CLEAR ALL CHAT
    if (isset($_POST['clearAllChat'])) {
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Fetch chat data from the database
        $query = "SELECT *FROM chat WHERE ((c_sender = ? AND c_receiver = ?) OR (c_sender = ? AND c_receiver = ?)) AND c_star = 0";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssss", $user_id, $user_unique, $user_unique, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {

            // Loop through each row in the result set
            while ($row = $result->fetch_assoc()) {
                $chat_image = $row["c_image"];

                // Check if $chat_image is not empty before attempting to delete the file
                if (!empty($chat_image)) {
                    // Delete image file from filesystem
                    $image_path = '../img/chatImage/' . $chat_image;
                    if (file_exists($image_path)) {
                        unlink($image_path);
                    }
                }
            }


            // DELETE CHATS
            $delete_query = "DELETE FROM chat WHERE ((c_sender = ? AND c_receiver = ?) OR (c_sender = ? AND c_receiver = ?)) AND c_star = 0";
            $delete_stmt = $conn->prepare($delete_query);
            $delete_stmt->bind_param("ssss", $user_id, $user_unique, $user_unique, $user_id);
            $delete_stmt->execute();

            if ($delete_stmt->error) {
                // Set error response if the deletion fails
                $response = array(
                    'status' => 'Error',
                    'message' => 'Error deleting chat records: ' . $delete_stmt->error,
                );
            } else {
                // Success response
                $response = array(
                    'status' => 'Success',
                    'message' => 'Chat cleared',
                );
            }

            // Close the statement
            $delete_stmt->close();
            // Send the response in JSON format
            echo json_encode($response);
        }
    }





    // CLEAR SINGLE CHAT
    if (isset($_POST['singleMessageDelete'])) {

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }
        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $messageId = mysqli_real_escape_string($conn, $_POST['messageId']);


        $query = "SELECT *FROM chat WHERE c_unique_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $messageId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($stmt->error) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error selecting chat records: ' . $stmt->error,
            );
        }

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $chat_image = $row["c_image"];
            $chat_sender = $row["c_sender"];
            $chat_receiver = $row["c_receiver"];

            if (!empty($chat_image)) {
                $image_path = '../img/chatImage/' . $chat_image;
                if (file_exists($image_path)) {
                    unlink($image_path);
                }
            }

            // DELETE CHAT
            $delete_query = "UPDATE chat SET c_message = '', c_image = '', c_star = 0 WHERE c_unique_id = ?";
            $delete_stmt = $conn->prepare($delete_query);
            $delete_stmt->bind_param("s", $messageId);
            $delete_stmt->execute();

            if ($delete_stmt->error) {
                // Set error response if the deletion fails
                $response = array(
                    'status' => 'Error',
                    'message' => 'Error deleting chat records: ' . $delete_stmt->error,
                );
            } else {
                if ($chat_receiver == $user_id) {
                    $response = array(
                        'status' => 'Success',
                        'message' => 'Chat cleared',
                        'messageOwner' => 'Receiver',
                    );
                } else if ($chat_sender == $user_id) {
                    $response = array(
                        'status' => 'Success',
                        'message' => 'Chat cleared',
                        'messageOwner' => 'Sender',
                    );
                } else {
                    $response = array(
                        'status' => 'Success',
                        'message' => 'Chat cleared',
                        'messageOwner' => 'Error',
                    );
                }
            }

            // Close the statement
            $delete_stmt->close();

            // Send the response in JSON format
            echo json_encode($response);
        }
    }





    // STAR MARK CHAT MESSAGE
    if (isset($_POST['starMarkMessage'])) {

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $messageId = mysqli_real_escape_string($conn, $_POST['messageId']);

        $star_mark_query = "UPDATE chat SET c_star = 1 WHERE c_unique_id = ?";
        $star_mark_stmt = $conn->prepare($star_mark_query);
        $star_mark_stmt->bind_param("s", $messageId);
        $star_mark_stmt->execute();

        if ($star_mark_stmt->error) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating star status: ' . $star_mark_stmt->error,
            );
        } else {
            // Success response
            $response = array(
                'status' => 'Success',
                'message' => 'Chat message marked as starred',
            );
        }

        // Close the statement
        $star_mark_stmt->close();

        echo json_encode($response);
    }





    // STAR MARK REMOVE FROM CHAT MESSAGE
    if (isset($_POST['starMarkRemoveFromMessage'])) {

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $messageId = mysqli_real_escape_string($conn, $_POST['messageId']);

        $star_mark_remove_query = "UPDATE chat SET c_star = 0 WHERE c_unique_id = ?";
        $star_mark_remove_stmt = $conn->prepare($star_mark_remove_query);
        $star_mark_remove_stmt->bind_param("s", $messageId);
        $star_mark_remove_stmt->execute();

        if ($star_mark_remove_stmt->error) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating star status: ' . $star_mark_remove_stmt->error,
            );
        } else {
            // Success response
            $response = array(
                'status' => 'Success',
                'message' => 'Star mark removed from the chat message',
            );
        }

        // Close the statement
        $star_mark_remove_stmt->close();

        echo json_encode($response);
    }





    // GET ALL FRIEND DETAILS FOR FORWARD MESSAGE
    if (isset($_POST['getAllFriendsDetails'])) {

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        $user_id = mysqli_real_escape_string($conn, $_SESSION['user_id']);

        $fetch_friend_query = "SELECT friends FROM users WHERE user_unique = ?";
        $fetch_stmt_friend = mysqli_prepare($conn, $fetch_friend_query);
        mysqli_stmt_bind_param($fetch_stmt_friend, 's', $user_id);
        mysqli_stmt_execute($fetch_stmt_friend);
        mysqli_stmt_bind_result($fetch_stmt_friend, $friend_json_data);
        mysqli_stmt_fetch($fetch_stmt_friend);
        mysqli_stmt_close($fetch_stmt_friend);

        $friend_data_array = json_decode($friend_json_data, true);

        $all_friends_details = array();

        foreach ($friend_data_array as $friend_unique_id) {
            $fetch_friend_query = "SELECT `avatar`, `name`, `userName`,`user_unique` FROM users WHERE user_unique = ?";
            $fetch_stmt_friend = mysqli_prepare($conn, $fetch_friend_query);
            mysqli_stmt_bind_param($fetch_stmt_friend, 's', $friend_unique_id);
            mysqli_stmt_execute($fetch_stmt_friend);

            // Fetch the result into an associative array
            $friend_details = array();
            $result = mysqli_stmt_get_result($fetch_stmt_friend);
            if ($row = mysqli_fetch_assoc($result)) {
                $friend_details = $row;
            }

            // Close the statement
            mysqli_stmt_close($fetch_stmt_friend);

            // Add friend details to the array
            $all_friends_details[] = $friend_details;
        }

        // Success response
        $response = array(
            'status' => 'Success',
            'data' => $all_friends_details,
        );

        echo json_encode($response);
    }





    // REPLY MESSAGE
    if (isset($_POST['sendReply'])) {
        $current_user = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $messageId = mysqli_real_escape_string($conn, $_POST['messageId']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
        $message = mysqli_real_escape_string($conn, $_POST['message']);
        $chat_unique = rand(111111111, 999999999);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }


        // Check if the current user and the target user are friends
        $check_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_friends_stmt = mysqli_prepare($conn, $check_friends_query);
        mysqli_stmt_bind_param($check_friends_stmt, 's', $current_user);
        mysqli_stmt_execute($check_friends_stmt);
        mysqli_stmt_bind_result($check_friends_stmt, $friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_friends_stmt);

        // Decode the existing JSON data into an associative array
        $friends_array = json_decode($friends_json, true);

        // Check if the target user is in the friends array
        if (!in_array($user_unique, $friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'You are not friends with the target user.',
            );
            echo json_encode($response);
            exit;
        }

        // Check if the target user has the current user in their friends array
        $check_target_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_target_friends_stmt = mysqli_prepare($conn, $check_target_friends_query);
        mysqli_stmt_bind_param($check_target_friends_stmt, 's', $user_unique);
        mysqli_stmt_execute($check_target_friends_stmt);
        mysqli_stmt_bind_result($check_target_friends_stmt, $target_friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_target_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_target_friends_stmt);

        // Decode the target user's friends JSON into an associative array
        $target_friends_array = json_decode($target_friends_json, true);

        // Check if the current user is in the target user's friends array
        if (!in_array(
            $current_user,
            $target_friends_array
        )) {
            $response = array(
                'status' => 'Error',
                'message' => 'Target user does not have you as a friend.',
            );
            echo json_encode($response);
            exit;
        }


        $query = "SELECT * FROM chat WHERE c_unique_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $messageId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($stmt->error) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error selecting chat records: ' . mysqli_stmt_error($stmt),
            );
        }

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $chat_message = $row["c_message"];
            $chat_image = $row["c_image"];


            // Insert the chat message
            $insert_chat_query = "INSERT INTO chat (`c_sender`, `c_receiver`, `c_message`, `c_unique_id`, `c_reply_message`, `c_reply_image`, `c_replying_message`, `c_replier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $insert_chat_stmt = mysqli_prepare($conn, $insert_chat_query);
            mysqli_stmt_bind_param($insert_chat_stmt, 'ssssssss', $current_user, $user_unique, $message, $chat_unique, $chat_message, $chat_image, $messageId, $current_user);
            $insert_chat_result = mysqli_stmt_execute($insert_chat_stmt);

            // Check if the chat message was successfully inserted
            if ($insert_chat_result) {
                $response = array(
                    'status' => 'Success',
                );
            } else {
                $response = array(
                    'status' => 'Error',
                    'message' => 'Error inserting chat message: ' . mysqli_error($conn),
                );
            }

            // Close the statement
            mysqli_stmt_close($insert_chat_stmt);
        }

        // Update the replyingId status
        $update_status_query = "UPDATE users SET replyingId = 0 WHERE user_unique = ?";
        $update_status_stmt = mysqli_prepare($conn, $update_status_query);
        mysqli_stmt_bind_param($update_status_stmt, 's', $current_user);
        $update_status_result = mysqli_stmt_execute($update_status_stmt);

        // Check if the replyingId status was successfully updated
        if (!$update_status_result) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating replyingId status: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($update_status_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }






    // SEND IMAGE REPLY
    if (isset($_POST['sendReplyImage'])) {
        $current_user = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
        $messageId = mysqli_real_escape_string($conn, $_POST['messageId']);



        // Check if the current user and the target user are friends
        $check_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_friends_stmt = mysqli_prepare($conn, $check_friends_query);
        mysqli_stmt_bind_param($check_friends_stmt, 's', $current_user);
        mysqli_stmt_execute($check_friends_stmt);
        mysqli_stmt_bind_result($check_friends_stmt, $friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_friends_stmt);

        // Decode the existing JSON data into an associative array
        $friends_array = json_decode($friends_json, true);

        // Check if the target user is in the friends array
        if (!in_array($user_unique, $friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'You are not friends with the target user.',
            );
            echo json_encode($response);
            exit;
        }

        // Check if the target user has the current user in their friends array
        $check_target_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_target_friends_stmt = mysqli_prepare($conn, $check_target_friends_query);
        mysqli_stmt_bind_param($check_target_friends_stmt, 's', $user_unique);
        mysqli_stmt_execute($check_target_friends_stmt);
        mysqli_stmt_bind_result($check_target_friends_stmt, $target_friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_target_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_target_friends_stmt);

        // Decode the target user's friends JSON into an associative array
        $target_friends_array = json_decode($target_friends_json, true);

        // Check if the current user is in the target user's friends array
        if (!in_array($current_user, $target_friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'Target user does not have you as a friend.',
            );
            echo json_encode($response);
            exit;
        }

        $chat_unique = rand(111111111, 999999999);

        // image upload
        $file_name = $_FILES['Image']['name'];
        $file_tmp = $_FILES['Image']['tmp_name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $new_Image = preg_replace('/[^a-zA-Z0-9_]/', '', $chat_unique) . '_Image_' . '.' . $file_ext;
        $upload_path = "../img/chatImage/" . $new_Image;
        $valid_extensions = array('jpg', 'png', 'jpeg');

        if (in_array(
            $file_ext,
            $valid_extensions
        )) {
            if (move_uploaded_file($file_tmp, $upload_path)) {
                // echo " image uploaded successfully.";
            } else {
                // echo "Error uploading  image.";
            }
        } else {
            // echo "Invalid file type for  image.";
        }


        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }





        $query = "SELECT * FROM chat WHERE c_unique_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $messageId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($stmt->error) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error selecting chat records: ' . mysqli_stmt_error($stmt),
            );
        }

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $chat_message = $row["c_message"];
            $chat_image = $row["c_image"];

            // Insert the IMAGEs
            $insert_chat_query = "INSERT INTO chat (`c_sender`, `c_receiver`, `c_image`, `c_unique_id`, `c_reply_message`, `c_reply_image`, `c_replying_message`, `c_replier`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $insert_chat_stmt = mysqli_prepare($conn, $insert_chat_query);
            mysqli_stmt_bind_param($insert_chat_stmt, 'ssssssss', $current_user, $user_unique, $new_Image, $chat_unique, $chat_message, $chat_image, $messageId, $current_user);
            $insert_chat_result = mysqli_stmt_execute($insert_chat_stmt);


            // Check if the chat message was successfully inserted
            if ($insert_chat_result) {
                $response = array(
                    'status' => 'Success',
                );
            } else {
                $response = array(
                    'status' => 'Error',
                    'message' => 'Error inserting chat message: ' . mysqli_error($conn),
                );
            }

            // Close the statement
            mysqli_stmt_close($insert_chat_stmt);
        }


        // Update the replyingId status
        $update_status_query = "UPDATE users SET replyingId = 0 WHERE user_unique = ?";
        $update_status_stmt = mysqli_prepare($conn, $update_status_query);
        mysqli_stmt_bind_param($update_status_stmt, 's', $current_user);
        $update_status_result = mysqli_stmt_execute($update_status_stmt);

        // Check if the replyingId status was successfully updated
        if (!$update_status_result) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating replyingId status: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($update_status_stmt);

        // Send the response in JSON format
        echo json_encode($response);
    }




    // FORWARD MESSAGE
    if (isset($_POST['forwardMessage'])) {
        $current_user = mysqli_real_escape_string($conn, $_SESSION['user_id']);
        $user_unique = mysqli_real_escape_string($conn, $_POST['user_unique']);
        $messageId = mysqli_real_escape_string($conn, $_POST['messageId']);
        $chat_unique = rand(111111111, 999999999);

        if (!$conn) {
            die('Failed to connect to the database: ' . mysqli_connect_error());
        }

        // Check if the current user and the target user are friends
        $check_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_friends_stmt = mysqli_prepare($conn, $check_friends_query);
        mysqli_stmt_bind_param($check_friends_stmt, 's', $current_user);
        mysqli_stmt_execute($check_friends_stmt);
        mysqli_stmt_bind_result($check_friends_stmt, $friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_friends_stmt);

        // Decode the existing JSON data into an associative array
        $friends_array = json_decode($friends_json, true);

        // Check if the target user is in the friends array
        if (!in_array($user_unique, $friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'You are not friends with the target user.',
            );
            echo json_encode($response);
            exit;
        }

        // Check if the target user has the current user in their friends array
        $check_target_friends_query = "SELECT friends FROM users WHERE user_unique = ?";
        $check_target_friends_stmt = mysqli_prepare($conn, $check_target_friends_query);
        mysqli_stmt_bind_param($check_target_friends_stmt, 's', $user_unique);
        mysqli_stmt_execute($check_target_friends_stmt);
        mysqli_stmt_bind_result($check_target_friends_stmt, $target_friends_json);

        // Fetch the result
        mysqli_stmt_fetch($check_target_friends_stmt);

        // Close the statement
        mysqli_stmt_close($check_target_friends_stmt);

        // Decode the target user's friends JSON into an associative array
        $target_friends_array = json_decode($target_friends_json, true);

        // Check if the current user is in the target user's friends array
        if (!in_array($current_user, $target_friends_array)) {
            $response = array(
                'status' => 'Error',
                'message' => 'Target user does not have you as a friend.',
            );
            echo json_encode($response);
            exit;
        }




        $query = "SELECT * FROM chat WHERE c_unique_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $messageId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($stmt->error) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error selecting chat records: ' . mysqli_stmt_error($stmt),
            );
        }

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $chat_message = $row["c_message"];
            $chat_image = $row["c_image"];


            // Insert the chat message
            $insert_chat_query = "INSERT INTO chat (`c_sender`, `c_receiver`, `c_message`, `c_image`, `c_unique_id`,`c_forward`) VALUES (?, ?, ?, ?, ?, ?)";
            $insert_chat_stmt = mysqli_prepare($conn, $insert_chat_query);
            mysqli_stmt_bind_param($insert_chat_stmt, 'ssssss', $current_user, $user_unique, $chat_message, $chat_image, $chat_unique, $messageId);
            $insert_chat_result = mysqli_stmt_execute($insert_chat_stmt);

            // Check if the chat message was successfully inserted
            if ($insert_chat_result) {
                $response = array(
                    'status' => 'Success',
                );
            } else {
                $response = array(
                    'status' => 'Error',
                    'message' => 'Error inserting chat message: ' . mysqli_error($conn),
                );
            }

            // Close the statement
            mysqli_stmt_close($insert_chat_stmt);
        }
        // Update the replyingId status
        $update_status_query = "UPDATE users SET replyingId = 0 WHERE user_unique = ?";
        $update_status_stmt = mysqli_prepare($conn, $update_status_query);
        mysqli_stmt_bind_param($update_status_stmt, 's', $current_user);
        $update_status_result = mysqli_stmt_execute($update_status_stmt);

        // Check if the replyingId status was successfully updated
        if (!$update_status_result) {
            $response = array(
                'status' => 'Error',
                'message' => 'Error updating replyingId status: ' . mysqli_error($conn),
            );
        }

        // Close the statement
        mysqli_stmt_close($update_status_stmt);


        // Send the response in JSON format
        echo json_encode($response);
    }




   
}
