<?php
session_start();
if (isset($_SESSION['is_login'])) {
} else {
    header("Location: /register.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <title>Chat App</title>
    <style>
        *::-webkit-scrollbar {
            display: none;
        }

        * {
            font-family: 'Poppins', sans-serif;
            word-break: break-word;
        }

        em-emoji-picker {
            width: 100%;
        }
    </style>
    <!-- // jquery  -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js" integrity="sha512-3gJwYpMe3QewGELv8k/BX9vcqhryRdzRMxVfq6ngyWXwo03GFEzjsUm8Q7RZcHPHksttq7/GFoxjCVUjkjvPdw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

</head>

<body>
    <?php
    require "conn.php";
    $user_unique = $_SESSION["user_id"];
    $user_details = $conn->query("SELECT * FROM users WHERE user_unique = '$user_unique'");



    // UPDATE ALL CHAT REACHED
    $chat_reached_query = "UPDATE chat SET c_reached = 1 WHERE c_receiver = ?";
    $chat_reached_stmt = $conn->prepare($chat_reached_query);
    $chat_reached_stmt->bind_param("s", $user_unique);
    $chat_reached_stmt->execute();



    if (mysqli_num_rows($user_details) > 0) {

        $row = mysqli_fetch_assoc($user_details);
    ?>
        <section class="grid grid-cols-5 bg-gray-100 dark:bg-[#161d24] w-full">
            <!-- // friend list -->
            <div class="w-full col-span-1 bg-gray-100 dark:bg-[#161d24] h-screen overflow-hidden overflow-y-scroll">
                <!-- // own profile card -->
                <div class="bg-gray-50 dark:bg-[#161d24] p-2 w-full my-2 flex items-center justify-between gap-10 rounded-xl">
                    <div onclick="document.getElementById('profileModal').style.display = 'flex';" class=" flex items-center gap-4 cursor-pointer">
                        <img class="w-12 h-12 rounded-full text-justify" src="img/avatar/<?php echo $row['avatar'] ?>" alt="">
                        <div class="flex flex-col gap-1">
                            <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white"><?php echo $row['name'] ?></h3>
                            <p class="text-gray-400 font-medium text-xs dark:text-gray-400">@<?php echo $row['userName'] ?></p>
                        </div>
                    </div>
                    <div onclick="document.getElementById('logoutModal').style.display = 'flex';" class="rounded-full cursor-pointer p-2">
                        <svg class="w-5 h-5 fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                        </svg>
                    </div>
                </div>

                <!-- // friend search -->
                <div class="p-2 h-fit w-full relative flex items-center">
                    <input title="Friend Search" class="w-full h-12 px-5 py-2 pr-12 rounded-lg outline-none bg-gray-200 border-white  text-black placeholder:text-gray-400 dark:bg-[#161d24] dark:text-white dark:border-gray-900" type="text" id="friendNameSearchInput" placeholder="Search...">
                    <svg id="friendNameSearchButton" class="w-5 h-5 absolute right-5 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                </div>

                <!-- -- RANDOM MATCH -->
                <div class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                    <div class="flex items-center gap-3 w-full p-2">
                        <svg class="w-7 h-7 rounded-full fil-lac dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z" />
                        </svg>

                        <div class="w-full">
                            <div class="flex justify-between gap-1 w-full">
                                <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">Random
                                    Match</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- -- RANDOM MATCH -->

                <!-- // friends list -->
                <div id="friendList" class="flex flex-col gap-1 mt-3 pb-40 bg-white dark:bg-[#161d24] overflow-hidden overflow-y-scroll h-[85vh]">
                    <?php
                    function getUserDetails($userId, $conn)
                    {
                        $query = "SELECT * FROM users WHERE user_unique = '$userId'";
                        $result = mysqli_query($conn, $query);

                        if ($result && mysqli_num_rows($result) > 0) {
                            return mysqli_fetch_assoc($result);
                        }

                        return null;
                    }

                    function getLastChat($userId, $receiverId, $conn)
                    {
                        $getMessage = "SELECT * FROM chat WHERE ((c_sender = '$userId' AND c_receiver = '$receiverId') OR (c_sender = '$receiverId' AND c_receiver = '$userId')) ORDER BY c_date_time DESC LIMIT 1";
                        $getMessageResult = mysqli_query($conn, $getMessage);

                        if ($getMessageResult && mysqli_num_rows($getMessageResult) > 0) {
                            return mysqli_fetch_assoc($getMessageResult);
                        }

                        return null;
                    }

                    $friendsJson = $row['friends'];
                    $friends = json_decode($friendsJson, true);

                    function isFriendOnline($friendId, $conn)
                    {
                        // Add your logic to check the online status of the friend based on your application
                        // For example, you might have a column 'is_online' in your users table
                        $query = "SELECT status FROM users WHERE user_unique = ?";
                        $stmt = mysqli_prepare($conn, $query);
                        mysqli_stmt_bind_param($stmt, 's', $friendId);
                        mysqli_stmt_execute($stmt);
                        mysqli_stmt_bind_result($stmt, $isOnline);
                        mysqli_stmt_fetch($stmt);
                        mysqli_stmt_close($stmt);

                        // Return true if online, false otherwise
                        return ($isOnline === 'Online');
                    }

                    function compareFriends($friend1, $friend2)
                    {
                        // Compare based on last chat time
                        $lastChatTime1 = strtotime($friend1['formattedTime']);
                        $lastChatTime2 = strtotime($friend2['formattedTime']);

                        if ($lastChatTime1 != $lastChatTime2) {
                            return $lastChatTime2 - $lastChatTime1;
                        }

                        // If last chat times are equal, compare based on online status
                        $isOnline1 = $friend1['isOnline'];
                        $isOnline2 = $friend2['isOnline'];

                        return $isOnline2 - $isOnline1;
                    }

                    $friendsData = array();


                    $friendsData = array();

                    $friendsData = array();

                    if (is_array($friends)) {
                        // Populate $friendsData with friend data
                        foreach ($friends as $friendId) {
                            $friendDetails = getUserDetails($friendId, $conn);

                            if ($friendDetails) {
                                $receiverId = $_SESSION['user_id'];

                                // Move the following lines inside the loop
                                $friendLastChat = getLastChat($friendId, $receiverId, $conn);

                                if ($friendLastChat) {
                                    $dateString = $friendLastChat['c_date_time'];
                                    $dateTime = new DateTime($dateString);
                                    $currentDate = new DateTime();
                                    $currentDate->setTime(0, 0, 0);
                                    $yesterday = clone $currentDate;

                                    $yesterday->modify('-1 day');

                                    if ($dateTime >= $currentDate) {
                                        $formattedTime = $dateTime->format("h:iA");
                                    } elseif ($dateTime >= $yesterday) {
                                        $formattedTime = "Yesterday";
                                    } else {
                                        $currentYear = (int)$currentDate->format("Y");
                                        $messageYear = (int)$dateTime->format("Y");

                                        if ($currentYear === $messageYear) {
                                            $formattedTime = $dateTime->format("M-d");
                                        } else {
                                            $formattedTime = $dateTime->format("d/m/Y");
                                        }
                                    }
                                } else {
                                    $formattedTime = "";
                                }

                                // Check if friend is online (you need to implement this function)
                                $isOnline = isFriendOnline($friendId, $conn);

                                // Store friend data
                                $friendsData[] = array(
                                    'friendDetails' => $friendDetails,
                                    'formattedTime' => $formattedTime,
                                    'isOnline' => $isOnline,
                                    'friendLastChat' => $friendLastChat, // Store the last chat for each friend
                                );
                            }
                        }

                        // Sort the friends based on custom compare function
                        usort($friendsData, 'compareFriends');
                        foreach ($friendsData as $friendData) {
                            $friendDetails = $friendData['friendDetails'];
                            $formattedTime = $friendData['formattedTime'];
                            $isOnline = $friendData['isOnline'];
                            $friendLastChat = $friendData['friendLastChat']; // Retrieve the last chat for each friend

                            // Output friend HTML here
                            echo '<!-- Friend Chat -->
    <div onclick="startChat(' . $friendDetails['user_unique'] . ')" class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
        <div class="flex items-center gap-3 w-full p-2">
            <img class="w-10 h-10 rounded-full" src="img/avatar/' . $friendDetails['avatar'] . '" alt="">
            <div class="w-full overflow-hidden">
                <div class="flex justify-between gap-1 w-full">
                    <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">' . $friendDetails['name'] . '</h3>
                    <p class="text-gray-400 font-medium text-[0.70rem] dark:text-gray-400">' . $formattedTime . '</p>
                </div>
                <div class="rounded-full p-1 w-full overflow-hidden">';

                            // Check if both c_message and c_image lengths are 0
                            if ($friendLastChat === null) {
                                echo '';
                            } else if (empty($friendLastChat['c_message']) && empty($friendLastChat['c_image'])) {
                                echo '<p class="text-gray-300 font-medium text-sm italic dark:text-gray-600 truncate w-full overflow-hidden flex gap-1 items-center"> <svg class="w-3 h-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M5 19L19 5" />
                                </g>
                            </svg> message deleted</p>';
                            } elseif (!empty($friendLastChat['c_image'])) {
                                // Check if c_image has content
                                echo '<p class="text-gray-300 font-medium text-sm dark:text-gray-600 truncate w-full overflow-hidden flex gap-1 items-center">
                                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" d="M5 3h13a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11.59l4.29-4.3l2.5 2.5l5-5L20 16V6a2 2 0 0 0-2-2zm4.79 13.21l-2.5-2.5L3 19a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.59l-5.21-5.2zM7.5 6A2.5 2.5 0 0 1 10 8.5A2.5 2.5 0 0 1 7.5 11A2.5 2.5 0 0 1 5 8.5A2.5 2.5 0 0 1 7.5 6m0 1A1.5 1.5 0 0 0 6 8.5A1.5 1.5 0 0 0 7.5 10A1.5 1.5 0 0 0 9 8.5A1.5 1.5 0 0 0 7.5 7"/>
                                    </svg> Image</p>';
                            } else {
                                // Display c_message content
                                echo '<p class="text-gray-400 font-medium text-sm dark:text-gray-500 truncate w-full overflow-hidden">' . $friendLastChat['c_message'] . '</p>';
                            }

                            echo '</div>
            </div>
        </div>
    </div>
    <!-- Friend Chat -->';
                        }
                    } else {
                        // Handle the case where $friends is not an array (invalid JSON)
                        echo "Invalid friend data.";
                    }




                    $send_requestJson = $row['send_request'];
                    $send_request = json_decode($send_requestJson, true);

                    if (is_array($send_request)) {
                    ?>
                        <div onclick="toggleSendRequest()" class="p-2 pr-5 my-3 w-full flex items-center justify-between gap-10 rounded-xl duration-300 cursor-pointer">
                            <div class="w-full overflow-hidden">
                                <div class="flex justify-between gap-1 w-full">
                                    <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">Requests</h3>
                                    <svg id="sendRequestToggleShow" class="w-4 h-4 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div id="allSendRequestAccounts" class="select-none">
                            <?php
                            foreach ($send_request as $send_requestId) {
                                $friendDetails = getUserDetails($send_requestId, $conn);

                                if ($friendDetails) {
                            ?>
                                    <!-- -- friend chat -->
                                    <div onclick="startChat(<?php echo $friendDetails['user_unique']; ?>)" class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                        <div class="flex items-center gap-3 w-full p-2">
                                            <img class="w-10 h-10 rounded-full" src="img/avatar/<?php echo $friendDetails['avatar']; ?>" alt="">

                                            <div class="w-full overflow-hidden">
                                                <div class="flex justify-between flex-col gap-1 w-full">
                                                    <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white"><?php echo $friendDetails['name']; ?></h3>
                                                    <p class="text-gray-400 font-medium text-[0.70rem] dark:text-gray-400"><?php echo $friendDetails['userName']; ?></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- -- friend chat -->
                            <?php
                                }
                            }
                            ?>
                        </div>
                    <?php
                    } else {
                        // Handle the case where $friends is not an array (invalid JSON)
                        echo "Invalid friend data.";
                    }

                    $requestJson = $row['request'];
                    $request = json_decode($requestJson, true);

                    if (is_array($request)) {
                    ?>
                        <div onclick="toggleRequest()" class="p-2 pr-5 my-3 w-full flex items-center justify-between gap-10 rounded-xl duration-300 cursor-pointer">
                            <div class="w-full overflow-hidden">
                                <div class="flex justify-between gap-1 w-full">
                                    <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">Invitation</h3>
                                    <svg id="requestToggleShow" class="w-4 h-4 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div id="allRequestAccounts" class="select-none">
                            <?php
                            foreach ($request as $requestId) {
                                $friendDetails = getUserDetails($requestId, $conn);

                                if ($friendDetails) {
                            ?>
                                    <!-- -- friend chat -->
                                    <div onclick="startChat(<?php echo $friendDetails['user_unique']; ?>)" class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                        <div class="flex items-center gap-3 w-full p-2">
                                            <img class="w-10 h-10 rounded-full" src="img/avatar/<?php echo $friendDetails['avatar']; ?>" alt="">

                                            <div class="w-full overflow-hidden">
                                                <div class="flex justify-between flex-col gap-1 w-full">
                                                    <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white"><?php echo $friendDetails['name']; ?></h3>
                                                    <p class="text-gray-400 font-medium text-[0.70rem] dark:text-gray-400"><?php echo $friendDetails['userName']; ?></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- -- friend chat -->
                            <?php
                                }
                            }
                            ?>
                        </div>
                    <?php
                    } else {
                        // Handle the case where $friends is not an array (invalid JSON)
                        echo "Invalid friend data.";
                    }
                    ?>
                </div>
                <!-- // friends list -->


            </div>

            <div id="chattingTab" class="hidden w-full col-span-3 bg-gray-100 dark:bg-[#161d24] pt-2  h-full overflow-hidden overflow-y-scroll">

                <!-- // chatting person profile -->
                <div class="w-full h-[8vh] bg-[#161d24] flex justify-between px-5 items-center  rounded-t-2xl">
                    <div class="flex items-center gap-4">
                        <div class="relative">
                            <img class="w-12 h-12 rounded-full" id="chattingPersonProfileImage" src="" alt="">
                            <p id="chattingPersonIsFriend" class="absolute bottom-0 right-0 hidden bg-[#ff005f] w-3 h-3 rounded-full"></p>
                        </div>


                        <div class="flex flex-col">
                            <h3 id="chattingPersonProfileName" class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white"></h3>
                            <p id="chattingPersonProfileStatus"><span class="text-gray-400 font-medium text-xs dark:text-gray-400"></span></p>
                        </div>
                    </div>
                    <div class="p-2 h-fit w-fit z-10 rounded-full cursor-pointer bg-[#161d24] flex justify-center items-center gap-5 relative">


                        <div>
                            <!-- // BLOCKED USER -->
                            <svg id="chattingPersonProfileBlockedUser" class="hover:fill-black dark:hover:fill-white p-2 w-9 h-9 fill-gray-600 dark:fill-gray-400 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M240 80H342.7c-7.9-19.5-20.4-36.5-36.2-49.9L240 80zm37.7-68.2C261.3 4.2 243.2 0 224 0c-53.7 0-99.7 33.1-118.7 80h81.4l91-68.2zM224 256c70.7 0 128-57.3 128-128c0-5.4-.3-10.8-1-16H97c-.7 5.2-1 10.6-1 16c0 70.7 57.3 128 128 128zM124 312.4c-9.7 3.1-19.1 7-28 11.7V512H243.7L181.5 408.2 124 312.4zm33-7.2L204.3 384H272c44.2 0 80 35.8 80 80c0 18-6 34.6-16 48h82.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3c-7.2 0-14.3 .4-21.3 1.3zM0 482.3C0 498.7 13.3 512 29.7 512H64V345.4C24.9 378.1 0 427.3 0 482.3zM320 464c0-26.5-21.5-48-48-48H223.5l57.1 95.2C303 507.2 320 487.6 320 464z" />
                            </svg>

                            <!-- // UNFRIEND -->
                            <svg id="chattingPersonProfileUnfriend" onclick="sendFriendRequest()" class="w-6 h-6 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                            </svg>

                            <!-- // FRIEND -->
                            <svg id="chattingPersonProfileFriend" onclick="document.getElementById('unfriendModal').style.display = 'flex';" class="w-6 h-6 hidden fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
                            </svg>

                            <!-- // REMOVE REQUEST -->
                            <svg id="chattingPersonFriendRequestSendByYou" onclick="removeFriendRequest()" class="hover:fill-black dark:hover:fill-white p-2 w-10 h-10 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z" />
                            </svg>

                        </div>
                        <!-- // MUTE -->
                        <svg id="chattingPersonProfileMute" onclick="notification()" class="w-8 h-8 p-1 fill-gray-600 rounded-full dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-90.2-70.7c.2-.4 .4-.9 .6-1.3c5.2-11.5 3.1-25-5.3-34.4l-7.4-8.3C497.3 319.2 480 273.9 480 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V51.2c-42.6 8.6-79 34.2-102 69.3L38.8 5.1zM406.2 416L160 222.1v4.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S115.4 416 128 416H406.2zm-40.9 77.3c12-12 18.7-28.3 18.7-45.3H320 256c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                        </svg>


                        <!-- // SEARCH -->
                        <svg id="chattingPersonProfileSearchButton" class="w-4 h-4 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                        </svg>
                        <div id="chattingPersonProfileSearchBox" class="absolute hidden opacity-0 top-full duration-100 right-0 rounded-lg bg-white dark:bg-[#2a353f] pt-2 shadow-2xl w-96 h-fit overflow-hidden  items-center">
                            <input id="chattingPersonProfileSearchBar" class="w-full h-12 px-5 py-2 pr-12 rounded-lg outline-none bg-gray-200 border-white  text-black placeholder:text-gray-400 dark:bg-transparent dark:text-white dark:border-gray-900" type="text" id="chatSearch" placeholder="Search...">
                            <svg class="w-8 h-8 p-2 absolute right-5 fill-gray-600 dark:fill-gray-400 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                            </svg>
                        </div>

                        <!-- // MENU -->
                        <div class="relative">
                            <svg id="chattingPersonProfileMenu" class="w-7 h-7 p-1 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                                <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                            </svg>

                            <div class="absolute z-10 right-0 rounded-lg bg-white dark:bg-[#161d24]">
                                <div id="chattingPersonProfileMenuItems" class="-top-[500%] relative duration-100 hidden pt-6 shadow-2xl w-fit h-fit">
                                    <p id="chattingPersonProfileSeeFiles" onclick="showAllMedia();" class="text-base min-w-40 py-2 px-4 hover:bg-gray-200 hover:dark:bg-gray-700 text-black dark:text-white duration-300">
                                        Files</p>
                                    <p id="chattingPersonProfileBlockButton" class="text-base min-w-40 py-2 px-4 hover:bg-gray-200 hover:dark:bg-gray-700 text-black dark:text-white duration-300">
                                        Block</p>
                                    <p id="chattingPersonProfileReportButton" class="text-left text-base min-w-40 py-2 px-4 hover:bg-gray-200 hover:dark:bg-gray-700 text-black dark:text-white duration-300">
                                        Report</p>
                                    <p id="chattingPersonProfileOpenSearchBox" class="text-base min-w-40 py-2 px-4 hover:bg-gray-200 hover:dark:bg-gray-700 text-black dark:text-white duration-300">
                                        Search</p>
                                    <p id="chattingPersonProfileClearChat" onclick="document.getElementById('clearAllChatModal').style.display = 'flex'" class="text-base min-w-40 py-2 px-4 hover:bg-gray-200 hover:dark:bg-gray-700 text-black dark:text-white duration-300">
                                        Clear chat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- // all chats -->
                <div id="allChatMainContainer" class="relative flex flex-col items-center">

                    <div id="allChat" class="chat-container relative w-full flex flex-col overflow-hidden overflow-y-scroll scroll-m-0 col-span-3 p-5 bg-gray-100 dark:bg-[#161d24] h-[82vh] bg-repeat bg-fixed bg-[url('img/background/backgroundImage1.svg')] bg-center"></div>







                    <div id="chatBottom" class="hidden cursor-pointer absolute bottom-10 justify-center items-center w-10 h-10 rounded-full shadow-2xl bg-white dark:bg-black opacity-70">
                        <svg class="w-5 h-5 fill-gray-600 dark:fill-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                        </svg>
                    </div>

                </div>


                <!-- // sending message -->
                <div id="sendingMessage" class="w-full h-[8vh] bg-[#161d24] flex justify-around rounded-b-2xl items-center relative">

                </div>

            </div>





            <!-- // PERSON TAB -->

            <div id="personTab" class="hidden w-full px-3 col-span-1 relative bg-gray-100 dark:bg-[#161d24] py-10 h-screen overflow-hidden overflow-y-scroll">

                <div id="defaultDetails">
                    <!-- // PERSON PROFILE -->
                    <div class="flex flex-col items-center gap-4">
                        <div class="relative flex justify-center items-end">
                            <img class="w-40 h-40 rounded-full" id="personProfileImage" src="" alt="">
                            <p id="personTabIsFriend" class="absolute hidden text-white bg-[#ff005f] px-5 py-1 rounded-full"></p>
                        </div>
                        <div class="text-center">
                            <h4 id="personProfileName" class="text-xl text-black dark:text-white font-medium capitalize truncate"></h4>
                            <p id="personProfileUserName" class="text-sm mt-1 text-gray-600 dark:text-gray-400 capitalize"></p>
                            <p id="personProfileStatus"><span class="text-sm mt-1 text-green-600 capitalize"></span></p>
                        </div>
                        <div class="p-2 h-fit w-fit rounded-full cursor-pointer flex justify-center items-center gap-5 relative">
                            <div>
                                <!-- // BLOCKED USER -->
                                <svg id="personProfileBlockedUser" class="hover:fill-black dark:hover:fill-white p-2 w-9 h-9 fill-gray-600 dark:fill-gray-400 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M240 80H342.7c-7.9-19.5-20.4-36.5-36.2-49.9L240 80zm37.7-68.2C261.3 4.2 243.2 0 224 0c-53.7 0-99.7 33.1-118.7 80h81.4l91-68.2zM224 256c70.7 0 128-57.3 128-128c0-5.4-.3-10.8-1-16H97c-.7 5.2-1 10.6-1 16c0 70.7 57.3 128 128 128zM124 312.4c-9.7 3.1-19.1 7-28 11.7V512H243.7L181.5 408.2 124 312.4zm33-7.2L204.3 384H272c44.2 0 80 35.8 80 80c0 18-6 34.6-16 48h82.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3c-7.2 0-14.3 .4-21.3 1.3zM0 482.3C0 498.7 13.3 512 29.7 512H64V345.4C24.9 378.1 0 427.3 0 482.3zM320 464c0-26.5-21.5-48-48-48H223.5l57.1 95.2C303 507.2 320 487.6 320 464z" />
                                </svg>


                                <!-- // UNFRIEND -->
                                <svg id="personProfileUnfriend" onclick="sendFriendRequest()" class="hover:fill-black dark:hover:fill-white p-2 w-9 h-9 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                                </svg>

                                <!-- // FRIEND -->
                                <svg id="personProfileFriend" onclick="document.getElementById('unfriendModal').style.display = 'flex';" class="hover:fill-black dark:hover:fill-white p-2 w-9 h-9 hidden fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
                                </svg>

                                <!-- // REMOVE REQUEST -->
                                <svg id="personProfileFriendRequestSendByYou" onclick="removeFriendRequest()" class="hover:fill-black dark:hover:fill-white p-2 w-9 h-9 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z" />
                                </svg>

                            </div>
                            <!-- // MUTE -->
                            <svg id="personProfileMuteButton" onclick="notification()" class="hover:fill-black rounded-full dark:hover:fill-white p-2 w-9 h-9 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-90.2-70.7c.2-.4 .4-.9 .6-1.3c5.2-11.5 3.1-25-5.3-34.4l-7.4-8.3C497.3 319.2 480 273.9 480 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V51.2c-42.6 8.6-79 34.2-102 69.3L38.8 5.1zM406.2 416L160 222.1v4.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S115.4 416 128 416H406.2zm-40.9 77.3c12-12 18.7-28.3 18.7-45.3H320 256c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                            </svg>

                            <!-- // REPORT -->

                            <svg id="personProfileReportButton" class="hover:fill-black rounded-full dark:hover:fill-white p-2 w-9 h-9 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                            </svg>


                            <!-- // BLOCK -->
                            <svg id="personProfileBlockButton" class="hover:fill-black rounded-full dark:hover:fill-white p-2 w-9 h-9 fill-gray-600 dark:fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                            </svg>
                        </div>
                    </div>

                    <button id="personProfileFriendRequestButton" onclick="accept()" class="text-xs w-fit hidden px-10 py-2 rounded-full font-semibold my-2 bg-black dark:bg-white text-white dark:text-black shadow-xl cursor-pointer mx-auto">Accept</button>

                    <div class="w-full border-t border-gray-300 dark:border-gray-700 my-8"></div>

                    <!-- // PERSON DETAILS -->
                    <div class="flex flex-col gap-5">
                        <div class="px-3">
                            <h6 class="text-gray-400 font-medium text-sm ">Description</h6>
                            <p id="personProfileDescription" class="text-white font-medium text-sm"></p>
                        </div>
                        <div class="px-3">
                            <h6 class="text-gray-400 font-medium text-sm ">Phone No.</h6>
                            <p id="personProfileNumber" class="text-white font-medium text-sm "></p>
                        </div>
                        <div class="px-3">
                            <h6 class="text-gray-400 font-medium text-sm ">Gender</h6>
                            <p id="personProfileGender" class="text-white font-medium text-sm "></p>
                        </div>
                        <div class="px-3">
                            <h6 class="text-gray-400 font-medium text-sm ">Country</h6>
                            <p id="personProfileCountry" class="text-white font-medium text-sm "></p>
                        </div>
                    </div>

                    <div class="w-full border-t border-gray-300 dark:border-gray-700 my-8"></div>

                    <!-- // HOBBIES -->
                    <div id="personProfileHobbies" class="flex flex-wrap items-center gap-x-2 gap-y-4">
                    </div>


                    <div id="isPersonProfileHobbies" class="w-full border-t border-gray-300 dark:border-gray-700 my-8"></div>
                </div>

                <!-- // FILES -->
                <div id="ChatMediaContainer" class="z-50 top-0 bg-gray-100 dark:bg-[#161d24] duration-1000 overflow-y-scroll">
                    <div class="flex justify-between items-center w-full mb-4 px-4">
                        <p class="text-base text-white font-medium">Files</p>
                        <p id="showAllMediaButton" onclick="showAllMedia()" class="text-xs text-gray-400 font-medium cursor-pointer hover:text-indigo-500 duration-300">
                            View All</p>
                    </div>
                    <div id="allChatMedia" class="grid grid-cols-2 items-center gap-3 gap-y-6 p-3">

                    </div>
                </div>


            </div>



            <!-- // STARTING TAB -->
            <div id="startingTab" class="flex col-span-4 h-screen justify-center items-center flex-col bg-gray-100 dark:bg-gray-700">
                <!-- -- RANDOM MATCH -->
                <div class="p-10 pt-0 w-full flex items-center justify-center gap-10">
                    <div class="w-1/2 flex items-center gap-5 p-2 h-32 justify-center rounded-xl duration-300 cursor-pointer">
                        <svg class="w-12 h-12 rounded-full fil-lac dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z" />
                        </svg>

                        <div class="w-fit">
                            <div class="flex justify-between gap-1 w-fit">
                                <h3 class="text-gray-800 font-medium capitalize text-lg truncate dark:text-white">Random
                                    Match</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- -- RANDOM MATCH -->

                <!-- // friends list -->
                <div class="grid grid-cols-4 gap-5 mt-3 p-10 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden overflow-y-scroll">
                    <?php

                    $friendsJson = $row['friends'];
                    $friends = json_decode($friendsJson, true);

                    if (is_array($friends)) {
                        foreach ($friends as $friendId) {
                            $friendDetails = getUserDetails($friendId, $conn);

                            if ($friendDetails) {
                                $receiverId = $friendDetails['user_unique'];
                                $friendLastChat = getLastChat($friendId, $receiverId, $conn);


                                if ($friendLastChat) {
                                    $dateString = $friendLastChat['c_message'];
                                    $dateTime = new DateTime($dateString);
                                    $currentDate = new DateTime();
                                    $currentDate->setTime(0, 0, 0);
                                    $yesterday = clone $currentDate;
                                    $yesterday->modify('-1 day');
                                    if ($dateTime >= $currentDate) {
                                        $formattedTime = $dateTime->format("h:iA");
                                    } elseif ($dateTime >= $yesterday) {
                                        $formattedTime = "Yesterday " . $dateTime->format("h:iA");
                                    } else {
                                        $formattedTime = $dateTime->format("Y-m-d");
                                    }
                                    echo $formattedTime;
                                } else {
                                    $formattedTime = "";
                                }
                    ?>

                                <!-- -- friend chat -->
                                <div onclick="startChat(<?php echo $friendDetails['user_unique']; ?>)" class="p-2 pr-5 col-span-1 flex items-center border-4 justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                    <div class="flex items-center gap-3 w-full p-2">
                                        <img class="w-10 h-10 rounded-full" src="img/avatar/<?php echo $friendDetails['avatar']; ?>" alt="">

                                        <div class="w-full">
                                            <div class="flex justify-between gap-1 w-full">
                                                <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white"><?php echo $friendDetails['name']; ?></h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- -- friend chat -->
                    <?php
                            }
                        }
                    } else {
                        // Handle the case where $friends is not an array (invalid JSON)
                        echo "Invalid friend data.";
                    }
                    ?>
                </div>
                <!-- // friends list -->
            </div>

        </section>








        <!-- /// REPORT MODAL -->
        <div id="reportModal" class="hidden items-center w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div id="subReported" class="mt-0 opacity-1 md:max-w-2xl md:w-full m-3 md:mx-auto">
                <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div class="absolute top-2 end-2">
                        <button onclick="document.getElementById('reportModal').style.display='none'" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-danger-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <h3 class="w-full h-16 flex items-center px-5 text-base text-black dark:text-white">Report User</h3>

                    <textarea id="reportUserText" class="w-full h-56 bg-gray-200 dark:bg-gray-700 resize-none p-5 text-black dark:text-white placeholder:text-gray-400 outline-none border-0" maxlength="299" placeholder="Write your report.."></textarea>

                    <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-gray-800 dark:border-gray-700">
                        <button onclick="document.getElementById('reportModal').style.display='none'" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Cancel</button>
                        <button onclick="document.getElementById('reportModal').style.display='none';reportUser()" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Submit
                            Report</button>
                    </div>
                </div>
            </div>
        </div>






        <!-- /// UNFRIEND MODAL -->
        <div id="unfriendModal" class="hidden items-center w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div class="mt-0 opacity-1 md:max-w-2xl md:w-full m-3 md:mx-auto">
                <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div class="absolute top-2 end-2">
                        <button type="button" onclick="document.getElementById('unfriendModal').style.display = 'none';" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-danger-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-10 overflow-y-auto">
                        <div class="flex flex-col justify-center items-center gap-y-4 md:gap-y-7">
                            <img id="unfriendImage" class="w-20 h-20 -mb-1 rounded-full object-cover" src="" alt="">

                            <div class="text-center">
                                <h3 class="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
                                    Unfriend
                                </h3>
                                <p class="text-gray-500">
                                    Are you sure you want to unfriend Amit Gupta?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-gray-800 dark:border-gray-700">
                        <button onclick="document.getElementById('unfriendModal').style.display = 'none';" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Cancel</button>
                        <button onclick="document.getElementById('unfriendModal').style.display = 'none';removeFriend();" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Confirm
                            and Unfriend</button>
                    </div>
                </div>
            </div>
        </div>






        <!-- /// BLOCK MODAL -->
        <div id="BlockModal" class="hidden items-center w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div class="mt-0 opacity-1 md:max-w-2xl md:w-full m-3 md:mx-auto">
                <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div class="absolute top-2 end-2">
                        <button onclick="document.getElementById('BlockModal').style.display='none'" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-danger-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-10 overflow-y-auto">
                        <div class="flex flex-col justify-center items-center gap-y-4 md:gap-y-7">
                            <img id="blockModalImage" class="w-20 h-20 -mb-1 rounded-full object-cover" src="" alt="">

                            <div class="text-center">
                                <h3 class="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
                                    Block
                                </h3>
                                <p class="text-gray-500">
                                    Are you sure you want to block him? Once you block him, you won't be able to chat
                                    with him.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-gray-800 dark:border-gray-700">
                        <button onclick="document.getElementById('BlockModal').style.display='none'" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Cancel</button>
                        <button onclick="document.getElementById('BlockModal').style.display='none';blockUser()" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Confirm
                            and Block</button>
                    </div>
                </div>
            </div>
        </div>






        <!-- /// UNBLOCK MODAL -->
        <div id="unblockModal" class="hidden items-center w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div class="mt-0 opacity-1 md:max-w-2xl md:w-full m-3 md:mx-auto">
                <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div class="absolute top-2 end-2">
                        <button onclick="document.getElementById('unblockModal').style.display='none'" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-danger-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-10 overflow-y-auto">
                        <div class="flex flex-col justify-center items-center gap-y-4 md:gap-y-7">
                            <img id="unblockModalImage" class="w-20 h-20 -mb-1 rounded-full object-cover" src="" alt="">

                            <div class="text-center">
                                <h3 class="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
                                    Unblock
                                </h3>
                                <p class="text-gray-500">
                                    Are you sure you want to unblock him?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-gray-800 dark:border-gray-700">
                        <button onclick="document.getElementById('unblockModal').style.display='none'" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Cancel</button>
                        <button onclick="document.getElementById('unblockModal').style.display='none';unblockUser()" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Confirm
                            and Unblock</button>
                    </div>
                </div>
            </div>
        </div>






        <!-- /// REMOVE REPORT MODAL -->
        <div id="removeReportModal" class="hidden items-center w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div class="mt-0 opacity-1 md:max-w-2xl md:w-full m-3 md:mx-auto">
                <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div class="absolute top-2 end-2">
                        <button onclick="document.getElementById('removeReportModal').style.display='none'" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-danger-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-10 overflow-y-auto">
                        <div class="flex flex-col justify-center items-center gap-y-4 md:gap-y-7">
                            <img id="removeReportImage" class="w-20 h-20 -mb-1 rounded-full object-cover" src="" alt="">

                            <div class="text-center">
                                <h3 class="mb-3 text-xl font-bold text-gray-800 dark:text-gray-200">
                                    Remove Report
                                </h3>
                                <p class="text-gray-500">
                                    Are you sure you want to remove Report?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-gray-800 dark:border-gray-700">
                        <button onclick="document.getElementById('removeReportModal').style.display='none'" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border-2 border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Cancel</button>
                        <button onclick="document.getElementById('removeReportModal').style.display='none';removeReport()" class="px-3 h-10 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Confirm
                            and Remove</button>
                    </div>
                </div>
            </div>
        </div>




        <!-- // CLEAR ALL CHAT MODAL -->

        <div id="clearAllChatModal" class="hidden w-full h-full items-center fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto  bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div class="mt-0 opacity-1 sm:max-w-xl sm:w-full m-3 sm:mx-auto">
                <div class="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-gray-800">
                    <div class="absolute top-2 end-2">
                        <button onclick="document.getElementById('clearAllChatModal').style.display = 'none';" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-sign-out-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-10 text-center overflow-y-auto">
                        <span class="mb-8 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-0 fill-black dark:fill-white">
                            <svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path d="M566.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192-34.7-34.7c-4.2-4.2-10-6.6-16-6.6c-12.5 0-22.6 10.1-22.6 22.6v29.1L364.3 320h29.1c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16l-34.7-34.7 192-192zM341.1 353.4L222.6 234.9c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8C76.5 307.5 64 337.7 64 369.2c0 6.8 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L7.3 473.4C2.7 477.6 0 483.6 0 489.9C0 502.1 9.9 512 22.1 512l173.3 0c38.8 0 75.9-15.4 103.4-42.8c30.6-30.6 45.9-73.1 42.3-115.8z" />
                            </svg>
                        </span>

                        <h3 class="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Clear All Chat
                        </h3>
                        <p class="text-gray-500">
                            Are you sure you want to clear all chats? This will delete the entire chat from both sides
                        </p>

                        <div class="mt-8 flex justify-center gap-x-4">
                            <button onclick="document.getElementById('clearAllChatModal').style.display = 'none';" class=" py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                Cancel
                            </button>
                            <button onclick="document.getElementById('clearAllChatModal').style.display = 'none';clearAllChat()" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-sign-out-alert">
                                Clear chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>






        <!-- // LOGOUT MODAL -->

        <div id="logoutModal" class="hidden w-full h-full items-center fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto  bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div class="mt-0 opacity-1 sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                <div class="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-gray-800">
                    <div class="absolute top-2 end-2">
                        <button onclick="document.getElementById('logoutModal').style.display = 'none';" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-sign-out-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-10 text-center overflow-y-auto">
                        <span class="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
                            <svg class="flex-shrink-0 w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                        </span>

                        <h3 class="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Sign out
                        </h3>
                        <p class="text-gray-500">
                            Are you sure you would like to sign out of your Chat account?
                        </p>

                        <div class="mt-6 flex justify-center gap-x-4">
                            <button onclick="document.getElementById('logoutModal').style.display = 'none';" class=" py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                Cancel
                            </button>
                            <button onclick="location.assign('/logout.php')" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-sign-out-alert">
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>






        <!-- /// PROFILE MODAL -->
        <div id="profileModal" class="hidden py-20 w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-[#ffffff7e] dark:bg-[#000000a2]">
            <div class="mt-0 opacity-1 md:max-w-2xl md:w-full m-3 md:mx-auto">
                <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div class="absolute top-2 end-2">
                        <button onclick="document.getElementById('profileModal').style.display = 'none';" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-danger-alert">
                            <span class="sr-only">Close</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-10 overflow-y-auto">
                        <!-- // person Profile -->
                        <div class="flex items-center gap-6">
                            <img id="profileImagePreview" class="w-40 h-40 rounded-full" src="img/avatar/<?php echo $row['avatar'] ?>" alt="">
                            <label for="profileImageInput" class="cursor-pointer">

                                <p class="flex justify-center items-center w-40 h-12 rounded-lg cursor-pointer bg-black text-white border-transparent border-2 dark:bg-transparent dark:text-white dark:border-white hover:bg-white hover:text-black border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-transparent duration-300">
                                    Update Image</p>

                            </label>
                            <input type="file" hidden class="hidden" id="profileImageInput" accept=".jpg, .jpeg, .png">
                        </div>

                        <div class="w-full border-t border-gray-300 dark:border-gray-700 my-8"></div>

                        <!-- // Person Details -->
                        <div class="flex flex-col gap-5">
                            <div class="px-3 grid grid-cols-4 items-center">
                                <p class="text-gray-400 font-medium text-sm ">Full Name</p>
                                <input title="Full Name" class="rounded-md my-2 font-medium col-span-3  text-sm outline-none w-full py-2 px-5 h-10 text-center text-black" type="text" id="fullNameUpdate" value="<?php echo $row['name'] ?>" placeholder="Your full name">
                            </div>
                            <div class="px-3 grid grid-cols-4 items-center">
                                <p class="text-gray-400 font-medium text-sm ">UserName</p>
                                <input title="UserName" class="rounded-md my-2 font-medium col-span-3  text-sm outline-none w-full py-2 px-5 h-10 text-center text-black" type="text" id="userNameUpdate" value="<?php echo $row['userName'] ?>" placeholder="Your username">
                            </div>

                            <div class="px-3 grid grid-cols-4 items-center">
                                <p class="text-gray-400 font-medium text-sm ">Description</p>
                                <textarea id="descriptionUpdate" title="Description" class="rounded-md my-2 font-medium resize-none text-sm outline-none w-full col-span-3 py-2 px-5 h-32 text-left text-black" placeholder="Enter Something about you"><?php echo $row['description'] ?></textarea>
                            </div>
                            <div class="px-3 grid grid-cols-4 items-center">
                                <p class="text-gray-400 font-medium text-sm ">Phone No.</p>
                                <input title="Phone Number" class="rounded-md my-2 font-medium col-span-3  text-sm outline-none w-full py-2 px-5 h-10 text-center text-black" type="text" id="numberUpdate" value="+91 7976950039" placeholder="Your Phone Number">
                            </div>
                            <div class="px-3 grid grid-cols-4 items-center">
                                <p class="text-gray-400 font-medium text-sm ">Gender</p>
                                <select class="rounded-md my-2 font-medium col-span-3  text-sm outline-none w-full py-2 px-5 h-10 text-left text-black" id="genderUpdate" title="Gender">
                                    <option <?php echo (($row['gender'] === 'male') ? 'selected' : '') ?> value="male">Male</option>
                                    <option <?php echo (($row['gender'] === 'female') ? 'selected' : '') ?> value="female">Female</option>
                                    <option <?php echo (($row['gender'] === 'NotToSay') ? 'selected' : '') ?> value="NotToSay">Not To Say</option>
                                </select>
                            </div>
                            <div class="px-3 grid grid-cols-4 items-center">
                                <p class="text-gray-400 font-medium text-sm ">Country</p>
                                <input title="Country" class="rounded-md my-2 font-medium col-span-3  text-sm outline-none w-full py-2 px-5 h-10 text-center text-black" type="text" value="<?php echo $row['country'] ?>" disabled>
                            </div>
                            <div class="px-3 grid grid-cols-4 items-center">
                                <p class="text-gray-400 font-medium text-sm ">Hobbies</p>
                                <div class=" col-span-3">
                                    <textarea id="hobbiesUpdate" title="Hobbies" class="rounded-md mt-2 font-medium resize-none text-sm outline-none w-full py-2 px-5 h-20 text-left text-black" placeholder="Enter Your all hobbies"><?php echo $row['hobbies'] ?></textarea>
                                    <p class="text-sm text-gray-600 mb-2 dark:text-gray-400 w-full"><small>*Keep all hobbies
                                            separate with commas (,).</small></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-gray-800 dark:border-gray-700">
                        <button onclick="document.getElementById('profileModal').style.display = 'none';" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            Cancel
                        </button>
                        <button id="submitUpdateProfile" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border-transparent bg-white text-black hover:bg-transparent border-2 hover:border-white hover:text-white duration-300 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>

    <?php } ?>



    <script src="https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/browser.js"></script>
    <script src="index.js"></script>

</body>

</html>