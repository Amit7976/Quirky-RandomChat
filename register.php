<?php
session_start();
if (!isset($_SESSION['is_login'])) {
} else {
    header("Location: /index.php");
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
        }

        .box-shadow-unique {
            box-shadow: 0 0 128px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5);
        }
    </style>
    <!-- // jquery  -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js" integrity="sha512-3gJwYpMe3QewGELv8k/BX9vcqhryRdzRMxVfq6ngyWXwo03GFEzjsUm8Q7RZcHPHksttq7/GFoxjCVUjkjvPdw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

</head>

<body class="min-h-screen overflow-hidden overflow-y-scroll bg-fixed bg-[url('img/background/PolygonLuminary.svg')] bg-center bg-cover bg-no-repeat backdrop-invert backdrop-blur-md flex justify-center">

    <div class="mx-auto w-[60%] rounded-2xl p-16 bg-white h-fit my-10 box-shadow-unique">
        <div class="flex justify-between items-center mb-5">
            <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register A new Account</h2>
            <img class="h-12 w-12 rounded-full" src="img/background/AbstractPaper.svg" alt="Your Company">
        </div>
        <p id="alert" class="text-red-500 font-semibold mb-5 hidden">Alert</p>
        <section class="flex flex-col gap-2">

            <h4 class="text-xl font-semibold flex items-center"><span class="text-sm text-gray-500 font-medium mr-2">Step 1 -</span> Select Avatar</h4>
            <div class="my-2 mb-10 grid grid-cols-6 gap-10">
                <img id="selectAvatar1" class="w-full rounded-full cursor-pointer border-4 border-transparent select-none" src="img\avatar\boy.png" alt="">
                <img id="selectAvatar2" class="w-full rounded-full cursor-pointer border-4 border-transparent select-none" src="img/avatar/boy2.png" alt="">
                <img id="selectAvatar3" class="w-full rounded-full cursor-pointer border-4 border-transparent select-none" src="img\avatar\koala.png" alt="">
                <img id="selectAvatar4" class="w-full rounded-full cursor-pointer border-4 border-transparent select-none" src="img\avatar\robot.png" alt="">
                <img id="selectAvatar5" class="w-full rounded-full cursor-pointer border-4 border-transparent select-none" src="img\avatar\girl.png" alt="">
                <img id="selectAvatar6" class="w-full rounded-full cursor-pointer border-4 border-transparent select-none" src="img\avatar\girl2.png" alt="">
            </div>

            <h4 class="text-xl font-semibold flex items-center"><span class="text-sm text-gray-500 font-medium mr-2">Step 2 -</span> Fill Details</h4>
            <div class="flex justify-between gap-10 my-2">
                <div class="w-full">
                    <label class="text-gray-400 font-medium text-sm ">First Name</label>
                    <input id="firstName" class="border-2 border-black outline-none px-5 py-2 my-1 w-full h-10 rounded-md" type="text" placeholder="First Name" required autocomplete="given-name">
                </div>
                <div class="w-full">
                    <label class="text-gray-400 font-medium text-sm ">Last Name</label>
                    <input id="lastName" class="border-2 border-black outline-none px-5 py-2 my-1 w-full h-10 rounded-md" type="text" placeholder="Last Name" required autocomplete="family-name">
                </div>
                <div class="w-full">
                    <label class="text-gray-400 font-medium text-sm ">Gender</label>
                    <select id="gender" class="border-2 border-black outline-none px-5 py-2 my-1 w-full h-10 rounded-md" id="" title="Gender" autocomplete="sex" value="male">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="NotToSay">Not To Say</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-between gap-10 my-2">
                <div class="w-full">
                    <label class="text-gray-400 font-medium text-sm ">Password</label>
                    <input id="password" class="border-2 border-black outline-none px-5 py-2 my-1 w-full h-10 rounded-md" type="password" autocomplete="off" placeholder="Enter new password" required>
                    <i class="fas fa-eye"></i>
                </div>
                <div class="w-full">
                    <label class="text-gray-400 font-medium text-sm ">Confirm Password</label>
                    <input id="confirmPassword" class="border-2 border-black outline-none px-5 py-2 my-1 w-full h-10 rounded-md" type="text" autocomplete="off" placeholder="Enter new password" required>
                    <i class="fas fa-eye"></i>
                </div>
            </div>
            <div class="field button w-full flex justify-center items-center mt-10">
                <span class="text-sm text-gray-500 font-medium mr-2">Step 3 -</span>
                <button id="submit" title="Continue to Chat" class="border border-black outline-none px-5 py-2 w-1/2 h-12 rounded-md bg-black text-white hover:bg-white hover:text-black hover:border-black duration-300 cursor-pointer">Continue to Chat</button>
            </div>
            <div class="text-center">Already signed up? <a class="hover:text-indigo-500" href="login.php">Login now</a>
            </div>
        </section>
    </div>


    <script src="register.js"></script>
</body>

</html>